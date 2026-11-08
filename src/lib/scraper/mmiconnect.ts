import { chromium } from "playwright";

export const PORTAL_SLUG = "ep-blr-2026";
const CATALOGUE_URL = `https://mmiconnect.in/app/catalogue/exhibitors/${PORTAL_SLUG}?first=100`;
const PAGE_SIZE = 100;
const MAX_PAGES = 12; // safety cap regardless of what the API reports

// Captured verbatim from the real app's own request (see
// scripts/discover-graphql.ts) — the server rejects a trimmed-down query
// with "unused variable" errors, so every declared variable here is used.
const QUERY =
  "query getExhibitorListForGroup($where: [WhereExpression!], $first: Int, $after: Int, $categoryIds: [Int], $keyword: String, $group: String, $categoryGroup: String, $categoryWhere: [WhereExpression!]) {\n  catalogueQueries {\n    exhibitorsWithWishListGroup(\n      first: $first\n      where: $where\n      after: $after\n      categoryIds: $categoryIds\n      keyword: $keyword\n      group: $group\n    ) {\n      totalCount\n      exhibitors {\n        customer {\n          id\n          companyName\n          country\n          squareLogo\n          userId\n          showId\n          exhibitorDetail {\n            exhibitorType\n            sponsorship\n            boothNo\n            hallNo\n            __typename\n          }\n          show {\n            showName\n            startDate\n            endDate\n            __typename\n          }\n          __typename\n        }\n        customerRating {\n          id\n          __typename\n        }\n        appoinment {\n          id\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    selectedCustomerCategories(where: $categoryWhere, group: $categoryGroup) {\n      categoryType\n      productCategoryType\n      mainCategory\n      categoryName\n      id\n      __typename\n    }\n    __typename\n  }\n}\n";

export type RawExhibitorRecord = {
  mmiExhibitorId: string;
  companyName: string;
  country: string;
  logoUrl: string | null;
  hallNo: string;
  boothNo: string;
  exhibitionName: string;
};

type GraphQlCustomer = {
  id: number | string;
  companyName: string;
  country: string;
  squareLogo: string | null;
  exhibitorDetail: { boothNo: string | null; hallNo: string | null } | null;
  show: { showName: string } | null;
};

type GraphQlResponse = {
  data?: {
    catalogueQueries?: {
      exhibitorsWithWishListGroup?: {
        totalCount: number;
        exhibitors: { customer: GraphQlCustomer }[];
      };
    };
  };
  errors?: { message: string }[];
};

/**
 * Fetches one page of the real exhibitor GraphQL response, executed
 * in-page via the browser's own `fetch` (same approach the Angular app
 * itself uses) so this never needs to guess at cookie/session handling.
 */
async function fetchPage(
  page: import("playwright").Page,
  after: number,
): Promise<GraphQlResponse> {
  return page.evaluate(
    async ({ query, after, first, group }) => {
      const res = await fetch("/graphql", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationName: "getExhibitorListForGroup",
          variables: {
            where: [],
            categoryWhere: [{ comparison: "equal", path: "categoryType", value: ["EXHIBITOR"] }],
            group,
            categoryGroup: group,
            first,
            after,
          },
          query,
        }),
      });
      return res.json();
    },
    { query: QUERY, after, first: PAGE_SIZE, group: PORTAL_SLUG },
  );
}

export type ScrapeProgress = {
  pagesScraped: number;
  recordsSeen: number;
};

/**
 * Scrapes every exhibitor from the live mmiconnect.in catalogue for
 * PORTAL_SLUG, paginating until all records (per the API's own
 * totalCount) have been collected or MAX_PAGES is hit.
 */
export async function scrapeAllExhibitors(
  onProgress?: (progress: ScrapeProgress) => void,
): Promise<RawExhibitorRecord[]> {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(CATALOGUE_URL, { waitUntil: "networkidle", timeout: 60_000 });

    const records: RawExhibitorRecord[] = [];
    let after = -1;
    let totalCount = Infinity;
    let pagesScraped = 0;

    while (records.length < totalCount && pagesScraped < MAX_PAGES) {
      const response = await fetchPage(page, after);

      if (response.errors?.length) {
        throw new Error(
          `GraphQL errors while scraping exhibitors: ${response.errors.map((e) => e.message).join("; ")}`,
        );
      }

      const result = response.data?.catalogueQueries?.exhibitorsWithWishListGroup;
      if (!result) {
        throw new Error("Unexpected GraphQL response shape — no exhibitorsWithWishListGroup");
      }

      totalCount = result.totalCount;
      pagesScraped += 1;

      for (const { customer } of result.exhibitors) {
        records.push({
          mmiExhibitorId: String(customer.id),
          companyName: customer.companyName.trim(),
          country: customer.country.trim(),
          logoUrl: customer.squareLogo || null,
          hallNo: customer.exhibitorDetail?.hallNo?.trim() || "",
          boothNo: customer.exhibitorDetail?.boothNo?.trim() || "",
          exhibitionName: customer.show?.showName?.trim() || "Unknown Exhibition",
        });
      }

      onProgress?.({ pagesScraped, recordsSeen: records.length });

      if (result.exhibitors.length === 0) break; // defensive: avoid an infinite loop
      // `after` is 0-indexed "last item index already fetched, minus one is
      // the starting sentinel" — see scripts/discover-pagination.ts for how
      // this was verified against the live API.
      after = records.length - 1;
    }

    return records;
  } finally {
    await browser.close();
  }
}

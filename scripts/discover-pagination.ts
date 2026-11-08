/**
 * One-off discovery script: confirms what the `after` GraphQL variable
 * means for pagination, using the EXACT query text and variable shape
 * captured from the real app (see discover-graphql.ts output) — a
 * trimmed-down query gets rejected by this server's "unused variable"
 * validation, so the full query is reused verbatim, varying only `after`.
 */
import { chromium } from "playwright";

const QUERY =
  "query getExhibitorListForGroup($where: [WhereExpression!], $first: Int, $after: Int, $categoryIds: [Int], $keyword: String, $group: String, $categoryGroup: String, $categoryWhere: [WhereExpression!]) {\n  catalogueQueries {\n    exhibitorsWithWishListGroup(\n      first: $first\n      where: $where\n      after: $after\n      categoryIds: $categoryIds\n      keyword: $keyword\n      group: $group\n    ) {\n      totalCount\n      exhibitors {\n        customer {\n          id\n          companyName\n          country\n          squareLogo\n          userId\n          showId\n          exhibitorDetail {\n            exhibitorType\n            sponsorship\n            boothNo\n            hallNo\n            __typename\n          }\n          show {\n            showName\n            startDate\n            endDate\n            __typename\n          }\n          __typename\n        }\n        customerRating {\n          id\n          __typename\n        }\n        appoinment {\n          id\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    selectedCustomerCategories(where: $categoryWhere, group: $categoryGroup) {\n      categoryType\n      productCategoryType\n      mainCategory\n      categoryName\n      id\n      __typename\n    }\n    __typename\n  }\n}\n";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("https://mmiconnect.in/app/catalogue/exhibitors/ep-blr-2026?first=100", {
    waitUntil: "networkidle",
    timeout: 60_000,
  });

  for (const after of [-1, 5, 100]) {
    const result = await page.evaluate(
      async ({ query, after }) => {
        const res = await fetch("/graphql", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationName: "getExhibitorListForGroup",
            variables: {
              where: [],
              categoryWhere: [{ comparison: "equal", path: "categoryType", value: ["EXHIBITOR"] }],
              group: "ep-blr-2026",
              categoryGroup: "ep-blr-2026",
              first: 5,
              after,
            },
            query,
          }),
        });
        return res.json();
      },
      { query: QUERY, after },
    );
    const list = result?.data?.catalogueQueries?.exhibitorsWithWishListGroup;
    if (!list) {
      console.log(`after=${after} -> errors:`, JSON.stringify(result.errors));
      continue;
    }
    console.log(
      `after=${after} totalCount=${list.totalCount} companies=${list.exhibitors
        .map((e: { customer: { companyName: string } }) => e.customer.companyName)
        .join(" | ")}`,
    );
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

/**
 * One-off discovery script (not part of the shipped scraper). Loads the
 * real exhibitor catalogue page, captures the Angular app's actual
 * /graphql request/response, and prints the query, variables, and a
 * sample of the response shape so lib/scraper/mmiconnect.ts can be built
 * against ground truth instead of guesses.
 *
 * Usage: npm run scrape:discover
 */
import { chromium } from "playwright";

const TARGET_URL =
  "https://mmiconnect.in/app/catalogue/exhibitors/ep-blr-2026?first=100";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on("request", (req) => {
    if (req.url().includes("/graphql")) {
      console.log("\n=== GRAPHQL REQUEST ===");
      console.log("URL:", req.url());
      console.log("Method:", req.method());
      console.log("Post data:", req.postData());
    }
  });

  page.on("response", async (res) => {
    if (res.url().includes("/graphql")) {
      console.log("\n=== GRAPHQL RESPONSE ===");
      console.log("Status:", res.status());
      try {
        const json = await res.json();
        console.log(JSON.stringify(json, null, 2).slice(0, 6000));
      } catch (error) {
        console.log("Could not parse response as JSON:", error);
      }
    }
  });

  console.log(`Navigating to ${TARGET_URL} ...`);
  await page.goto(TARGET_URL, { waitUntil: "networkidle", timeout: 60_000 });

  await page.waitForTimeout(2000);
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

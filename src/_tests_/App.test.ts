import puppeteer from "puppeteer";

import { cdpTest } from "./renderPage/CDP.test";
import { dashboardTest } from "./renderPage/Dashboard.test";
import { leadTest } from "./renderPage/Lead.test";
import { orderTest } from "./renderPage/Order.test";
import { promotionTest } from "./renderPage/Promotion.test";
import { transportationTest } from "./renderPage/Transportation.test";

describe("App", () => {
  let domainUrl = process.env.DOMAIN || "";
  let browser: any;
  let page: any;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
  });

  it("contains the welcome text", async () => {
    await page.goto(`${domainUrl}/login`);
    await page.waitForTimeout(3000);

    await page.type("input[type=email]", "admin@demo.vn");
    await page.type("input[type=password]", "abcd@123");
    await page.click("button[type=submit]");

    await page.waitForNavigation();

    await dashboardTest({ domainUrl, page });
    await orderTest({ domainUrl, page });
    await leadTest({ domainUrl, page });
    await transportationTest({ domainUrl, page });
    await cdpTest({ domainUrl, page });
    await promotionTest({ domainUrl, page });
  }, 150000);

  afterAll(() => browser.close());
});

export async function autoScroll(page: any) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve(distance);
        }
      }, 100);
    });
  });
}

export const pageTest = async ({ routers, page }: { routers: string[]; page: any }) => {
  let currentURL: string;

  try {
    for (currentURL of routers) {
      const url = new URL(currentURL);
      const chuoiBatKy = url.pathname.substring(1);

      await page.goto(currentURL);
      await page.waitForTimeout(2000);
      await autoScroll(page);
      // await page.screenshot({ path: `.test/assets/${toSimplest(chuoiBatKy)}.png` });
    }
  } catch (error) {
    console.log(`page ${page.url()}`, error);
  }
};

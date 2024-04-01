import { pageTest } from "_tests_/App.test";

export const orderTest = async ({ domainUrl, page }: { domainUrl: string; page: any }) =>
  await pageTest({
    routers: [
      `${domainUrl}/orders/list/all`,
      `${domainUrl}/orders/list/draft`,
      `${domainUrl}/orders/list/completed`,
      `${domainUrl}/orders/chi-tiet-don`,
      `${domainUrl}/report-order/list`,
      `${domainUrl}/report-order/item`,
    ],
    page,
  });

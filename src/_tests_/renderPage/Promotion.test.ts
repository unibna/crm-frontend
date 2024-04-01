import { pageTest } from "_tests_/App.test";

export const promotionTest = async ({ domainUrl, page }: { domainUrl: string; page: any }) =>
  await pageTest({
    routers: [
      `${domainUrl}/promotions/all`,
      `${domainUrl}/promotions/active`,
      `${domainUrl}/promotions/inactive`,
      `${domainUrl}/promotions/deactived`,
      `${domainUrl}/promotions/promotion-id`,
    ],
    page,
  });

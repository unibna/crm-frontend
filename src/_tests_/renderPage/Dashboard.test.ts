import { pageTest } from "_tests_/App.test";

export const dashboardTest = async ({ domainUrl, page }: { domainUrl: string; page: any }) =>
  await pageTest({
    routers: [
      `${domainUrl}/profile`,
      `${domainUrl}/dashboard`,
      `${domainUrl}/sale-dashboard`,
      `${domainUrl}/mkt-dashboard`,
      `${domainUrl}/sale-online-report`,
    ],
    page,
  });

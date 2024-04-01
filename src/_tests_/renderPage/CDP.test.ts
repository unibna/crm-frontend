import { pageTest } from "_tests_/App.test";

export const cdpTest = async ({ domainUrl, page }: { domainUrl: string; page: any }) =>
  await pageTest({
    routers: [
      `${domainUrl}/cdp/users/list`,
      `${domainUrl}/cdp/users/reports`,
      `${domainUrl}/cdp/users/detail/?name=hello`,
    ],
    page,
  });

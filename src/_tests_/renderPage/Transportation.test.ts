import { pageTest } from "_tests_/App.test";

export const transportationTest = async ({ domainUrl, page }: { domainUrl: string; page: any }) =>
  await pageTest({
    routers: [
      `${domainUrl}/transportation/status/new`,
      `${domainUrl}/transportation/status/pending`,
      `${domainUrl}/transportation/status/processing`,
      `${domainUrl}/transportation/status/handled`,
      `${domainUrl}/transportation/status/completed`,
      `${domainUrl}/transportation/status/all`,
    ],
    page,
  });

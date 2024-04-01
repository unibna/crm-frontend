import { pageTest } from "_tests_/App.test";

export const leadTest = async ({ domainUrl, page }: { domainUrl: string; page: any }) =>
  await pageTest({
    routers: [
      `${domainUrl}/lead-online/status/all`,
      `${domainUrl}/lead-online/status/handling`,
      `${domainUrl}/lead-online/status/order`,
      `${domainUrl}/lead-online/status/new`,
      `${domainUrl}/lead-online/status/no-order`,
      `${domainUrl}/lead-online/status/bad-data`,
      `${domainUrl}/lead-online/status/waiting`,
      `${domainUrl}/lead-online/report/v1`,
      `${domainUrl}/lead-online/report/v2`,
      `${domainUrl}/lead-online/report/report-handle-item-by-product`,
      `${domainUrl}/lead-online/report/user`,
    ],
    page,
  });

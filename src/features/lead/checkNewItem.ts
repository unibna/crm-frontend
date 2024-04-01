import { phoneLeadApi } from "_apis_/lead.api";
import { PhoneLeadResType } from "_types_/PhoneLeadType";

export const handleCheckNewLead = async ({
  selected,
  params,
}: {
  selected?: string[];
  params?: any;
}) => {
  if (selected) {
    const res = await phoneLeadApi.get<PhoneLeadResType>({
      params: { ...params, limit: 1, lead_status: selected },
    });
    return { result: res.data, count: res.data?.count };
  }
  return;
};

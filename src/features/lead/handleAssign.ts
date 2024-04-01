import { phoneLeadApi } from "_apis_/lead.api";
import { PhoneLeadResType } from "_types_/PhoneLeadType";
import map from "lodash/map";

export const handleAutoAssignerToServer = async (leadIds: string[]) => {
  const res = await phoneLeadApi.updateHandleByAuto({
    phone_leads: leadIds,
    endpoint: "auto-assign/",
  });

  return res.data;
};

export const handleManualAssignerToServer = async ({
  rowId,
  userId,
}: {
  rowId: string;
  userId: string;
}) => {
  if (userId) {
    //update người chia số
    const res = await phoneLeadApi.updatePhoneLeadHandle({
      phone_leads: [rowId],
      handle_by: userId,
      endpoint: "update-handle-by/",
    });
    return res.data;
  }
  return undefined;
};

export const handleAssignSaleForLeadRow = ({
  data,
  checked,
  saleId,
}: {
  checked?: boolean;
  data: PhoneLeadResType[];
  saleId: string;
}) => {
  //handle change checked item
  let countChecked: string[] = [];
  const newData = map(data, (item) => {
    if (item.id === saleId) {
      if (checked) {
        countChecked.push(saleId);
      }
      return { ...item, isCheckHandleBy: checked };
    }
    if (item.isCheckHandleBy && item.id) {
      countChecked.push(item.id);
    }
    return item;
  });
  return { newData, countChecked };
};

export const handleSelectedAllAssignerRow = ({
  data,
  checked,
}: {
  data: PhoneLeadResType[];
  checked: boolean;
}) => {
  let countChecked: string[] = [];
  const newData = map(data, (phoneLead) => {
    const { id } = phoneLead;
    if (id) {
      if (checked) countChecked.push(id);
      return { ...phoneLead, isCheckHandleBy: checked };
    }
    return phoneLead;
  });

  return { newData, countChecked };
};

import { phoneLeadApi } from "_apis_/lead.api";
import { AttributeType } from "_types_/AttributeType";
import { InterceptDataType, LeadStatusType, PhoneLeadResType } from "_types_/PhoneLeadType";
import { UserType } from "_types_/UserType";
import useAuth from "hooks/useAuth";
import map from "lodash/map";
import { dispatch } from "store";
import { toastError } from "store/redux/toast/slice";
import { LEAD_STATUS, SPAM_TYPE } from "views/LeadCenterView/constants";

const SPAM_CHECK_ITEM_DEFAULT: Partial<InterceptDataType> = {
  created_by_id: "",
  data: "",
  modified_by_id: "",
  spam_type: "",
  status: "",
};

export const handleSelectedAllDataStatusRow = ({
  data,
  isChecked,
}: {
  isChecked: boolean;
  data: PhoneLeadResType[];
}) => {
  let countChecked: string[] = [];
  const checkedData = map(data, (phoneLead) => {
    const { lead_status, id, data_status, ip_address, phone } = phoneLead;
    if (
      id &&
      lead_status &&
      [LEAD_STATUS.NEW, LEAD_STATUS.WAITING, LEAD_STATUS.HANDLING].includes(
        lead_status as LeadStatusType
      )
    ) {
      if (isChecked) {
        countChecked.push(id);
      }
      return { ...phoneLead, isCheckDataStatus: isChecked };
    }
    return phoneLead;
  });

  return { countChecked, checkedData };
};

export const handleCheckingSpam = ({
  leadData,
  dataStatus,
  user,
  leadCheckedData,
}: {
  leadData: PhoneLeadResType[];
  dataStatus?: AttributeType;
  user?: Partial<UserType> | null;
  leadCheckedData: string[];
}) => {
  let spamList: Partial<InterceptDataType>[] = [];
  map(leadData, (phoneLead) => {
    const leadIdx = leadCheckedData.findIndex((item) => item === phoneLead.id);
    if (leadIdx > -1) {
      const { ip_address, phone } = leadData[leadIdx];
      if (ip_address) {
        spamList.push({
          ...SPAM_CHECK_ITEM_DEFAULT,
          created_by_id: user?.id,
          modified_by_id: user?.id,
          data: ip_address,
          status: dataStatus?.name,
          spam_type: SPAM_TYPE.IP,
        });
        if (phone) {
          spamList.push({
            ...SPAM_CHECK_ITEM_DEFAULT,
            created_by_id: user?.id,
            modified_by_id: user?.id,
            data: phone,
            status: dataStatus?.name,
            spam_type: SPAM_TYPE.PHONE,
          });
        }
      }
    }
    return;
  });

  return { spamList };
};

export const handleSubmitDataStatusToServer = async ({
  id,
  data,
}: {
  id?: string;
  data: string[];
}) => {
  if (!id) {
    dispatch(toastError({ message: "Vui lòng chọn trạng thái xử lý" }));
    return;
  } else {
    const res = await phoneLeadApi.updatePhoneLeadDataStatus({
      data_status: parseInt(id),
      phone_leads: data,
    });
    return res.data;
  }
};

export const handleChangeDataStatusForLeadRow = ({
  data,
  dataStatusId,
  checked,
  user,
}: {
  checked?: boolean;
  data: PhoneLeadResType[];
  dataStatusId: string;
  user?: Partial<UserType> | null;
}) => {
  let countChecked: string[] = [];
  let countCanUpdate = 0;
  const newData = map(data, (item) => {
    if (
      item.lead_status &&
      [LEAD_STATUS.NEW, LEAD_STATUS.WAITING, LEAD_STATUS.HANDLING].includes(
        item.lead_status as LeadStatusType
      )
    ) {
      countCanUpdate += 1;
    }
    if (item.id === dataStatusId) {
      if (checked) {
        countChecked.push(dataStatusId);
      }
      return { ...item, isCheckDataStatus: checked };
    }
    if (item.isCheckDataStatus && item.id) {
      countChecked.push(item.id);
    }
    return item;
  });
  return { countCanUpdate, countChecked, newData };
};

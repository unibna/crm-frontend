import { STATUS_ROLE_AIRTABLE } from "constants/rolesTab";
import CustomerCareContainer from "views/CskhView/containers/CustomerCare/CustomerCareContainer";

const AirTable = ({ phone }: { phone: string }) => {
  return (
    <CustomerCareContainer
      paramsProps={{ search: phone }}
      isShowHeaderFiler={false}
      isShowOperation={false}
      status={STATUS_ROLE_AIRTABLE.ALL}
      titleHeaderTable="CSKH"
    />
  );
};

export default AirTable;

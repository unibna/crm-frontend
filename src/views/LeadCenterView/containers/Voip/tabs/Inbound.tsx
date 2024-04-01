import { yyyy_MM_dd_HH_mm_ss } from "constants/time";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { useState } from "react";
import VoipContainer from "../components/VoipContainer";

const Inbound = () => {
  const [params, setParams] = useState<any>({
    limit: 200,
    page: 1,
    ordering: "-created",
    callDateValue: 0,
    call_status: ["meet_call"],
    date_from: format(subDays(new Date(), 0), yyyy_MM_dd_HH_mm_ss),
    date_to: format(subDays(new Date(), 0), yyyy_MM_dd_HH_mm_ss),
  });
  return (
    <VoipContainer
      params={{ ...params, call_type: ["callin"] }}
      setParams={setParams}
      isFilterCallAttribute
      isFilterCallDate
      isFilterModifiedByName
      isFilterTelephonist
      isFilterVoipStatus
    />
  );
};

export default Inbound;

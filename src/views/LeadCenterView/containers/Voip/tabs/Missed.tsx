import { yyyy_MM_dd_HH_mm_ss } from "constants/time";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { useState } from "react";
import VoipContainer from "../components/VoipContainer";

const Missed = () => {
  const [params, setParams] = useState<any>({
    limit: 200,
    page: 1,
    ordering: "-created",
    callDateValue: 0,
    call_type: ["callin"],
    date_from: format(subDays(new Date(), 0), yyyy_MM_dd_HH_mm_ss),
    date_to: format(subDays(new Date(), 0), yyyy_MM_dd_HH_mm_ss),
  });
  return (
    <VoipContainer
      params={{ ...params, call_status: ["miss_call"] }}
      setParams={setParams}
      isFilterCallDate
      isFilterCallAttribute
      isFilterTelephonist
      isFilterModifiedByName
      isFilterVoipProccess
    />
  );
};

export default Missed;

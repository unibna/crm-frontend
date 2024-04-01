import { useState } from "react";
import PromotionContainer from "../components/PromotionContainer";

const ActiveTab = () => {
  const [params, setParams] = useState<any>({
    limit: 30,
    page: 1,
    ordering: "-created",
    status: ["ACTIVED"],
  });

  return (
    <PromotionContainer
      params={params}
      setParams={setParams}
      tabName="ACTIVED"
      isFilterType
      isFilterCreatedBy
      isFilterMethod
      isFilterDate
      isFilterActiveDate
    />
  );
};

export default ActiveTab;

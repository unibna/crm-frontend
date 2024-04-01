import React, { useState } from "react";
import PromotionContainer from "../components/PromotionContainer";

const DeActivedTab = () => {
  const [params, setParams] = useState<any>({
    limit: 30,
    page: 1,
    ordering: "-created",
    status: ["DEACTIVED"],
  });

  return (
    <PromotionContainer
      params={params}
      setParams={setParams}
      tabName="DEACTIVED"
      isFilterType
      isFilterCreatedBy
      isFilterMethod
      isFilterDate
      isFilterActiveDate
    />
  );
};

export default DeActivedTab;

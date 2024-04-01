import React, { useState } from "react";
import PromotionContainer from "../components/PromotionContainer";

const AllTab = () => {
  const [params, setParams] = useState<any>({
    limit: 30,
    page: 1,
    ordering: "-created",
  });

  return (
    <PromotionContainer
      params={params}
      setParams={setParams}
      tabName="ALL"
      isFilterType
      isFilterCreatedBy
      isFilterMethod
      isFilterDate
      isFilterActiveDate
      isFilterStatus
    />
  );
};

export default AllTab;

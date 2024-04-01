import React, { useState } from "react";
import PromotionContainer from "../components/PromotionContainer";

const InActivedTab = () => {
  const [params, setParams] = useState<any>({
    limit: 30,
    page: 1,
    ordering: "-created",
    status: ["INACTIVED"],
  });

  return (
    <PromotionContainer
      params={params}
      setParams={setParams}
      tabName="INACTIVED"
      isFilterType
      isFilterCreatedBy
      isFilterMethod
      isFilterDate
    />
  );
};

export default InActivedTab;

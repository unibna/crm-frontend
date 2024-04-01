// Libraries
import { FunctionComponent, useReducer } from "react";

// Context
import { initialState, reducerSaleOnlineReport, StoreSaleOnlineReport } from "./context";

// Components
import Dashboard from "./containers";

const SaleOnlineReportView: FunctionComponent = (props) => {
  const [state, dispatch] = useReducer(reducerSaleOnlineReport, initialState);

  return (
    <StoreSaleOnlineReport.Provider value={{ state, dispatch }}>
        <Dashboard />
    </StoreSaleOnlineReport.Provider>
  );
};

export default SaleOnlineReportView;

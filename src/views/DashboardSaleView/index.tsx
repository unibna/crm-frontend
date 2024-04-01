// Libraries
import { FunctionComponent, useReducer } from "react";

// Context
import { reducerDashboard, StoreDashboard, initialState } from "./context";

// Components
import Dashboard from "./containers";

const Components: FunctionComponent = (props) => {
  const [state, dispatch] = useReducer(reducerDashboard, initialState);

  return (
    <StoreDashboard.Provider value={{ state, dispatch }}>
      <Dashboard {...props} />
    </StoreDashboard.Provider>
  );
};

export default Components;

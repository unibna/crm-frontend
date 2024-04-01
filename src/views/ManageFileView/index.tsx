// Libraries
import { FunctionComponent, useReducer } from "react";

// Context
import { StoreManageFile, initialState, reducerManageFile } from "views/ManageFileView/contextStore";

// Hooks
import useAuth from "hooks/useAuth";

// Components
import { TabRouteWrap } from "components/Tabs";
import { TAB_HEADER_MANAGE_FILE } from "./constants";

// Constants & Utils

const ManageFileView: FunctionComponent = () => {
  const { user } = useAuth();

  return (
    <TabRouteWrap
      title="Quản lí File"
      routes={TAB_HEADER_MANAGE_FILE(user, user?.group_permission?.data)}
    />
  );
};

const Components: FunctionComponent = (props) => {
  const [state, dispatch] = useReducer(reducerManageFile, initialState);

  return (
    <StoreManageFile.Provider value={{ state, dispatch }}>
      <ManageFileView {...props} />
    </StoreManageFile.Provider>
  );
};

export default Components;

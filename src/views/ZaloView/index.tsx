// Libraries
import { useEffect, FunctionComponent, useContext } from "react";
import { Outlet } from "react-router-dom";

import find from "lodash/find";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Context
import { ZaloContext, ZaloProvider } from "./contextStore";
import { PopupProvider } from "./contextPopup";

// Constants & Utils
import { actionType } from "views/ZaloView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { showToast } from "contexts/ToastContext";

import Box from "@mui/material/Box";

const ZaloView: FunctionComponent = () => {
  const { state: store, dispatch } = useContext(ZaloContext);
  const {
    notifications,
    params,
    dataFilter: { dataAccountOaZalo = [] },
  } = store;

  useEffect(() => {
    document.title = "Zalo";
    getListAccountOaZalo();
  }, []);

  useEffect(() => {
    if (params.zalo_oa) {
      dispatch({
        type: actionType.UPDATE_OA_FILTER,
        payload: {
          ...find(dataAccountOaZalo, (item) => item.id === params.zalo_oa),
        },
      });
    }
  }, [params.zalo_oa]);

  useEffect(() => {
    if (notifications?.message) {
      showToast(notifications);
    }
  }, [notifications]);

  const getListAccountOaZalo = async () => {
    const result = await zaloApi.get({}, "oa/");

    if (result && result.data) {
      const { results = [] } = result.data;

      const newData = results.map((item: any) => {
        return {
          ...item,
          label: item.name,
          value: item.id,
        };
      });

      dispatch({
        type: actionType.UPDATE_DATA_FILTER,
        payload: {
          dataAccountOaZalo: newData,
        },
      });

      dispatch({
        type: actionType.UPDATE_OA_FILTER,
        payload: {
          ...getObjectPropSafely(() => newData[0]),
        },
      });

      dispatch({
        type: actionType.UPDATE_PARAMS,
        payload: {
          zalo_oa: getObjectPropSafely(() => newData[0].value),
        },
      });
    }
  };

  return <Outlet />;
};

const Components: FunctionComponent = (props) => {
  return (
    <ZaloProvider>
      <PopupProvider>
        <Box mb={3}>
          <ZaloView {...props} />
        </Box>
      </PopupProvider>
    </ZaloProvider>
  );
};

export default Components;

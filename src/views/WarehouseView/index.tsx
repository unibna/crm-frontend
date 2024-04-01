// Libraries
import { FunctionComponent, useReducer, useContext, useEffect } from "react";

// Services
import { productApi } from "_apis_/product";

// Context
import { reducerWarehouse, StoreWarehouse, initialState } from "views/WarehouseView/contextStore";

// Hooks
import useAuth from "hooks/useAuth";
import usePopup from "hooks/usePopup";

// Components
import { TabRouteWrap } from "components/Tabs";
import Box from "@mui/material/Box";

// Constants & Utils
import { typeHandle, message, TAB_HEADER_WAREHOUSE } from "views/WarehouseView/constants";
import { handleParams } from "utils/formatParamsUtil";
import { statusNotification } from "constants/index";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { showToast } from "contexts/ToastContext";

// ------------------------------------------------------------------

const WarehouseView: FunctionComponent = () => {
  const { user } = useAuth();
  const { state: store } = useContext(StoreWarehouse);
  const { notifications } = store;
  const { dataPopup, closePopup, dataForm, setNotifications } = usePopup();
  const { type: typePopup } = dataPopup;

  useEffect(() => {
    if (notifications?.message) {
      showToast(notifications);
    }
  }, [notifications]);

  useEffect(() => {
    if (Object.values(dataForm).length) {
      handleSubmitPopup(dataForm);
    }
  }, [dataForm]);

  const handleSubmitPopup = async (form: any) => {
    switch (typePopup) {
      case typeHandle.EDIT_WAREHOUSE:
      case typeHandle.CREATE_WAREHOUSE: {
        const params = {
          manager_name: form.manager_name,
          manager_phone: form.manager_phone,
          name: form.name,
          address: {
            street: form.address,
            location: getObjectPropSafely(() => form.ward),
            is_default: true,
          },
          description: form.description,
          id: form.id || "",
        };

        const newParams = handleParams(params);

        const result: any =
          typePopup === typeHandle.CREATE_WAREHOUSE
            ? await productApi.create(newParams, "warehouse/")
            : await productApi.update(newParams, "warehouse/");

        if (result && result.data) {
          setNotifications({
            message: message[typePopup].OPERATION_SUCCESS,
            variant: statusNotification.SUCCESS,
          });

          closePopup();
        }

        break;
      }
    }
  };

  return (
    <TabRouteWrap title="Kho" routes={TAB_HEADER_WAREHOUSE(user, user?.group_permission?.data)} />
  );
};

const Components: FunctionComponent = (props) => {
  const [state, dispatch] = useReducer(reducerWarehouse, initialState);

  return (
    <StoreWarehouse.Provider value={{ state, dispatch }}>
      <Box mb={3}>
        <WarehouseView {...props} />
      </Box>
    </StoreWarehouse.Provider>
  );
};

export default Components;

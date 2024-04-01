// Libraries
import { FunctionComponent, useEffect } from "react";
import isBoolean from "lodash/isBoolean";
import format from "date-fns/format";

// Services
import { deliveryApi } from "_apis_/delivery.api";

// Hooks
import useAuth from "hooks/useAuth";
import usePopup from "hooks/usePopup";

// Context
import { ShippingProvider } from "views/ShippingView/context";

// Components
import { TabRouteWrap } from "components/Tabs";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { statusNotification } from "constants/index";
import { handleParams } from "utils/formatParamsUtil";
import { SHIPPING_STATUS, TAB_HEADER_SHIPPING } from "./constants";
import { STATUS_ROLE_SHIPPING } from "constants/rolesTab";
import { yyyy_MM_dd } from "constants/time";

// -----------------------------------------------------------------

const ShippingView: FunctionComponent = () => {
  const { user } = useAuth();
  const { dataForm, setLoadingSubmit, setNotifications, closePopup, dataPopup } = usePopup<{
    id: string;
    carrier_status_manual: string;
    is_cod_transferred: string;
    objFinishDate: {
      isShowFinishDate: boolean;
      finishDate: string;
    };
  }>();

  useEffect(() => {
    if (Object.values(dataForm).length) {
      submitForm();
    }
  }, [dataForm]);

  const submitForm = async () => {
    setLoadingSubmit(true);

    const carrier_status_manual =
      getObjectPropSafely(() => dataPopup.defaultData.carrier_status_manual) !==
      dataForm.carrier_status_manual
        ? dataForm.carrier_status_manual
        : "";

    const is_cod_transferred =
      getObjectPropSafely(() => dataPopup.defaultData.is_cod_transferred) !==
      dataForm.is_cod_transferred
        ? dataForm.is_cod_transferred
        : "";

    const params = {
      id: dataForm.id,
      modified_by: user?.id,
      carrier_status_manual,
      is_cod_transferred,
      cod_transfer_date:
        isBoolean(is_cod_transferred) && is_cod_transferred ? new Date().toISOString() : "",
      finish_date:
        dataForm.carrier_status_manual === SHIPPING_STATUS[STATUS_ROLE_SHIPPING.SUCCESS] &&
        getObjectPropSafely(() => dataForm?.objFinishDate?.isShowFinishDate)
          ? format(
              new Date(getObjectPropSafely(() => dataForm?.objFinishDate?.finishDate)),
              yyyy_MM_dd
            )
          : "",
    };

    const newParams = handleParams(params);

    const result = await deliveryApi.update(newParams, "shipment/");

    if (result && result.data) {
      closePopup();
      setNotifications({
        message: "Cập nhật thành công",
        variant: statusNotification.SUCCESS,
      });
    } else {
      setNotifications({
        message: "Cập nhật thất bại",
        variant: statusNotification.ERROR,
      });
    }

    setLoadingSubmit(false);
  };

  return (
    <TabRouteWrap
      title="Vận chuyển"
      routes={TAB_HEADER_SHIPPING(user, user?.group_permission?.data)}
    />
  );
};

const Components: FunctionComponent = (props) => {
  return (
    <ShippingProvider>
      <ShippingView {...props} />
    </ShippingProvider>
  );
};

export default Components;

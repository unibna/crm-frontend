// Libraries
import { useEffect } from "react";
import isString from "lodash/isString";
import map from "lodash/map";
import tail from "lodash/tail";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Hooks
import usePopup from "hooks/usePopup";
import useAuth from "hooks/useAuth";

// Components
import { MButton } from "components/Buttons";
import ContentZns from "views/ZaloView/components/ContentZns";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { handleParams } from "utils/formatParamsUtil";
import { statusNotification } from "constants/index";

// Constants & Utisl
import { message, TypeHandle } from "views/ZaloView/constants";
import { GridSizeType } from "_types_/GridLayoutType";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import format from "date-fns/format";
import { yyyy_MM_dd } from "constants/time";

// -----------------------------------------------------------

type Props = {
  phones?: string[];
};

const SendZns = (props: Props) => {
  const { phones = [] } = props;
  const { setDataPopup, setNotifications, closePopup, dataPopup, dataForm } = usePopup<any>();
  const { user: userLogin } = useAuth();

  useEffect(() => {
    if (Object.keys(dataForm).length) {
      sendZns();
    }
  }, [dataForm]);

  const openPopup = () => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Gửi";
    let newContentRender: any;
    let defaultData = {};
    let title = "Gửi thông báo ZNS";
    let isShowFooter = true;
    let isDisabledSubmit = true;
    let maxWidthForm: GridSizeType = "md";

    defaultData = {
      name: "",
      zaloOa: {},
      template: {},
      templateData: {},
      phones,
      validateType: {},
    };
    newContentRender = (methods: any) => {
      return <ContentZns {...methods} />;
    };
    funcContentSchema = (yup: any) => {
      return {
        name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME),
        zaloOa: yup.object(),
        template: yup.object(),
        templateData: yup.object(),
        validateType: yup.object(),
      };
    };

    setDataPopup({
      ...dataPopup,
      maxWidthForm,
      buttonText: buttonTextPopup,
      isDisabledSubmit,
      isOpenPopup: true,
      title,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter,
    });
  };

  const sendZns = async () => {
    setDataPopup({
      ...dataPopup,
      isLoadingButton: true,
    });

    const keysTemplateData = Object.keys(dataForm.templateData);

    const newTemplateData = keysTemplateData.length
      ? keysTemplateData.reduce((prevObj: any, current: string) => {
          return isString(dataForm.templateData[current])
            ? {
                ...prevObj,
                [current]: dataForm.templateData[current],
              }
            : {
                ...prevObj,
                [current]: format(new Date(dataForm.templateData[current]), yyyy_MM_dd),
              };
        }, {})
      : {};

    const newPhone = map(dataForm.phones, (item) =>
      item[0] === "0" ? "84" + tail(item).join("") : item
    );

    const params = {
      name: dataForm.name,
      phone: newPhone,
      created_by: userLogin?.id,
      oa_id: getObjectPropSafely(() => dataForm.zaloOa.oa_id),
      template_id: getObjectPropSafely(() => dataForm.template.template_id),
      template_data: newTemplateData,
    };

    const newParams = handleParams(params);

    const result: any = await zaloApi.create(newParams, "send-request-zns/");

    if (result && result.data) {
      setNotifications({
        message: message[TypeHandle.SEND_ZNS].OPERATION_SUCCESS,
        variant: statusNotification.SUCCESS,
      });

      closePopup();
    } else {
      const { error = {} } = result;

      if (error.name) {
        setNotifications({
          message: "Tên đã tồn tại",
          variant: statusNotification.ERROR,
        });
      } else {
        setNotifications({
          message: message[TypeHandle.SEND_ZNS].OPERATION_FAILED,
          variant: statusNotification.ERROR,
        });
      }

      setDataPopup({
        ...dataPopup,
        isLoadingButton: false,
      });
    }
  };

  return (
    <MButton sx={{ py: 1 }} onClick={openPopup}>
      Gửi ZNS
    </MButton>
  );
};

export default SendZns;

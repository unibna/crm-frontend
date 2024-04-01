// Libraries
import { createContext, ReactNode, useContext, useEffect } from "react";
import map from "lodash/map";
import tail from "lodash/tail";

// Hooks
import useAuth from "hooks/useAuth";

// Context
import { ZaloContext } from "views/ZaloView/contextStore";
import usePopup from "hooks/usePopup";

// Components
import ImportExcelZns from "views/ZaloView/components/ImportExcelZns";
import ContentSendNotification from "views/ZaloView/components/ContentSendNotification";
import ContentTemplateOan from "views/ZaloView/components/ManualOanNotification/ContentTemplate";
import ContentTemplateZns from "views/ZaloView/components/ManualZnsNotification/ContentTemplate";
import ContentTemplateAutomatic from "views/ZaloView/components/AutomaticNotification/ContentTemplate";
import ContentZns from "views/ZaloView/components/ContentZns";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Types
import { GridSizeType } from "_types_/GridLayoutType";

// Constants & Utils
import {
  TitlePopupHandle,
  TypeHandle,
  contentRenderDefault,
  message,
} from "views/ZaloView/constants";
import { handleParams } from "utils/formatParamsUtil";
import { PHONE_REGEX, statusNotification, TYPE_FORM_FIELD } from "constants/index";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import format from "date-fns/format";
import { dd_MM_yyyy } from "constants/time";
interface PopupContextProps {
  dataPopup: Partial<any>;
  openPopup: (type: string, optional?: Partial<any>) => void;
  closePopup: VoidFunction;
  setDataPopup: React.Dispatch<React.SetStateAction<Partial<any>>>;
}

const initialState: PopupContextProps = {
  dataPopup: {
    valueOptional: {},
    isOpenPopup: false,
    isLoadingButton: false,
    funcContentRender: () => [],
    defaultData: {},
    funcContentSchema: (value: any) => {},
    title: "",
    type: "",
    buttonText: "Tạo",
    maxWidthForm: "sm",
    // isDisabledSubmit: true,
    isShowFooter: true,
  },
  openPopup: () => {},
  closePopup: () => {},
  setDataPopup: () => {},
};

const PopupContext = createContext(initialState);

type DetailVariantProviderProps = {
  children: ReactNode;
};

const PopupProvider = ({ children }: DetailVariantProviderProps) => {
  const { user: userLogin } = useAuth();
  const { state: store } = useContext(ZaloContext);
  const { dataPopup, setDataPopup, closePopup, dataForm, setLoadingSubmit, setNotifications } =
    usePopup();
  const { type: typeVariant, buttonText, title: titlePopup } = dataPopup;
  const { oaFilter } = store;

  useEffect(() => {
    if (Object.values(dataForm).length) {
      submitPopup(dataForm);
    }
  }, [dataForm]);

  const openPopup = (type: string, optional: Partial<any> = {}) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = buttonText;
    let newContentRender: any = () => contentRenderDefault[type];
    let defaultData = {};
    let title = type;
    let isShowFooter = true;
    // let isDisabledSubmit = true;
    let maxWidthForm: GridSizeType = "sm";

    switch (type) {
      case TitlePopupHandle.SEND_NOTIFICATION: {
        typeProduct = TypeHandle.SEND_NOTIFICATION;
        defaultData = {
          name: "",
          title: "",
          subtitle: "",
          image_url: "",
          action_url: "",
          scheduledTime: {
            time: new Date(),
            isScheduledTime: false,
          },
          columnSelected: optional.columnSelected,
        };
        newContentRender = (methods: any) => {
          return <ContentSendNotification {...methods} />;
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên"),
            title: yup.string().required("Vui lòng nhập tiêu đề"),
            subtitle: yup.string().required("Vui lòng nhập tiêu đề phụ"),
            image_url: yup
              .string()
              .required("Vui lòng nhập đường dẫn ảnh")
              .url("Vui lòng nhập đúng đường dẫn")
              .max(200, "Độ dài đường dẫn phải nhỏ hơn 200 kí tự"),
            action_url: yup
              .string()
              .required("Vui lòng nhập đường dẫn")
              .url("Vui lòng nhập đúng đường dẫn")
              .max(200, "Độ dài đường dẫn phải nhỏ hơn 200 kí tự"),
            scheduledTime: yup.object().shape({
              time: yup.mixed(),
              isScheduledTime: yup.bool(),
            }),
          };
        };

        maxWidthForm = "md";
        buttonTextPopup = "Gửi";
        break;
      }
      case TitlePopupHandle.IMPORT_EXCEL_ZNS: {
        typeProduct = TypeHandle.IMPORT_EXCEL_ZNS;

        defaultData = {
          name: "",
          zaloOa: {},
          template: {},
          templateData: {},
          objKeyPhone: {},
          dataExcel: [],
          dataTable: [],
          columns: [],
          scheduledTime: {
            time: new Date(),
            isScheduledTime: false,
          },
          validateType: {},
        };
        newContentRender = (methods: any) => {
          return <ImportExcelZns {...methods} />;
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME),
            zaloOa: yup.object(),
            template: yup.object(),
            templateData: yup.object(),
            objKeyPhone: yup.object(),
            dataTable: yup.array(),
            dataExcel: yup.array(),
            columns: yup.array(),
            scheduledTime: yup.object().shape({
              time: yup.mixed(),
              isScheduledTime: yup.bool(),
            }),
            validateType: yup.object(),
          };
        };

        maxWidthForm = "lg";
        buttonTextPopup = "Gửi";
        isShowFooter = false;

        break;
      }
      case TitlePopupHandle.SEND_ZNS: {
        typeProduct = TypeHandle.SEND_ZNS;
        defaultData = {
          name: "",
          zaloOa: {},
          template: {},
          templateData: {},
          phone: "",
          validateType: {},
          scheduledTime: {
            time: new Date(),
            isScheduledTime: false,
          },
        };
        newContentRender = (methods: any) => {
          return <ContentZns {...methods} isShowInputPhone />;
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME),
            phone: yup
              .string()
              .trim()
              //eslint-disable-next-line
              .matches(PHONE_REGEX, {
                message: VALIDATION_MESSAGE.FORMAT_PHONE,
                excludeEmptyString: true,
              }),
            zaloOa: yup.object(),
            template: yup.object(),
            templateData: yup.object(),
            validateType: yup.object(),
            scheduledTime: yup.object().shape({
              time: yup.mixed(),
              isScheduledTime: yup.bool(),
            }),
          };
        };

        maxWidthForm = "md";

        break;
      }
      case TitlePopupHandle.TEMPLATE_MANUAL_OAN_NOTIFICATION: {
        typeProduct = TypeHandle.TEMPLATE_MANUAL_OAN_NOTIFICATION;
        defaultData = {
          image_url: optional.image_url,
          title: optional.title,
          subtitle: optional.subtitle,
          action_url: optional.action_url,
        };
        newContentRender = (methods: any) => {
          return <ContentTemplateOan {...methods} />;
        };
        funcContentSchema = (yup: any) => {
          return {
            image_url: yup.string(),
            title: yup.string(),
            subtitle: yup.string(),
            action_url: yup.string(),
          };
        };

        maxWidthForm = "sm";
        isShowFooter = false;
        break;
      }
      case TitlePopupHandle.TEMPLATE_MANUAL_ZNS_NOTIFICATION: {
        typeProduct = TypeHandle.TEMPLATE_MANUAL_ZNS_NOTIFICATION;
        defaultData = {
          template: {},
          templateId: getObjectPropSafely(() => optional.receive_data.template_id),
          templateData: getObjectPropSafely(() => optional.receive_data.content),
        };
        newContentRender = (methods: any) => {
          return <ContentTemplateZns {...methods} />;
        };
        funcContentSchema = (yup: any) => {
          return {
            template: yup.object(),
            templateData: yup.object(),
            templateId: yup.string(),
          };
        };

        maxWidthForm = "md";
        isShowFooter = false;
        break;
      }
      case TitlePopupHandle.TEMPLATE_MANUAL_AUTOMATIC_NOTIFICATION: {
        typeProduct = TypeHandle.TEMPLATE_MANUAL_AUTOMATIC_NOTIFICATION;
        defaultData = {
          template: {},
          templateId: getObjectPropSafely(() => optional.receive_data.template_id),
          templateData: getObjectPropSafely(() => optional.receive_data.content),
        };
        newContentRender = (methods: any) => {
          return <ContentTemplateAutomatic {...methods} />;
        };
        funcContentSchema = (yup: any) => {
          return {
            template: yup.object(),
            templateData: yup.object(),
            templateId: yup.string(),
          };
        };

        maxWidthForm = "md";
        isShowFooter = false;
        break;
      }
    }

    setDataPopup({
      ...dataPopup,
      maxWidthForm,
      valueOptional: optional,
      buttonText: buttonTextPopup,
      // isDisabledSubmit,
      isOpenPopup: true,
      title,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter,
    });
  };

  const formatValue = (key: string, form: Partial<any>) => {
    switch (true) {
      case getObjectPropSafely(() => form.validateType[TYPE_FORM_FIELD.NUMBER]) &&
        form.validateType[TYPE_FORM_FIELD.NUMBER].includes(key): {
        return {
          [key]: +form.templateData[key],
        };
      }
      case getObjectPropSafely(() => form.validateType[TYPE_FORM_FIELD.DATE]) &&
        form.validateType[TYPE_FORM_FIELD.DATE].includes(key): {
        return {
          [key]: format(new Date(form.templateData[key]), dd_MM_yyyy),
        };
      }
      default: {
        return {
          [key]: form.templateData[key],
        };
      }
    }
  };

  const submitPopup = async (form: Partial<any>) => {
    setLoadingSubmit(true);

    switch (typeVariant) {
      case TypeHandle.SEND_NOTIFICATION: {
        const sendData = getObjectPropSafely(() => form.columnSelected.length)
          ? map(form.columnSelected, (item) => {
              return {
                user_id: item,
                content: {
                  title: form.title,
                  subtitle: form.subtitle,
                  image_url: form.image_url,
                  action_url: form.action_url,
                },
              };
            })
          : [];

        const params = {
          name: form.name,
          created_by: userLogin?.id,
          oa_id: oaFilter.oa_id,
          send_data: sendData,
          scheduled_time: getObjectPropSafely(() => form.scheduledTime.isScheduledTime)
            ? getObjectPropSafely(() => form.scheduledTime.time.toISOString())
            : "",
        };

        const newParams = handleParams(params);
        const result: any = await zaloApi.create(newParams, "send-request-notification/");

        if (result && result.data) {
          setNotifications({
            message: message[titlePopup].OPERATION_SUCCESS,
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
              message: message[titlePopup].OPERATION_FAILED,
              variant: statusNotification.ERROR,
            });
          }
        }

        setLoadingSubmit(false);
        break;
      }
      case TypeHandle.SEND_ZNS: {
        const keysTemplateData = Object.keys(form.templateData);

        const newSendData = [
          {
            phone:
              getObjectPropSafely(() => form.phone[0]) === "0"
                ? "84" + tail(form.phone).join("")
                : form.phone,
            content: keysTemplateData.length
              ? keysTemplateData.reduce((prevObj: any, current: string) => {
                  return {
                    ...prevObj,
                    ...formatValue(current, form),
                  };
                }, {})
              : {},
          },
        ];

        const params = {
          name: form.name,
          created_by: userLogin?.id,
          oa_id: getObjectPropSafely(() => form.zaloOa.oa_id),
          template_id: getObjectPropSafely(() => form.template.template_id),
          send_data: newSendData,
          scheduled_time: getObjectPropSafely(() => form.scheduledTime.isScheduledTime)
            ? getObjectPropSafely(() => form.scheduledTime.time.toISOString())
            : "",
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
        }

        setLoadingSubmit(false);
      }
    }
  };

  return (
    <PopupContext.Provider
      value={{
        dataPopup,
        closePopup,
        openPopup,
        setDataPopup,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export { PopupProvider, PopupContext };

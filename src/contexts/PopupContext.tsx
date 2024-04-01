// Libraries
import { useState, createContext, ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Services
import { productApi } from "_apis_/product";

// Components
import FormPopup, { FormValuesProps, PropsContentRender } from "components/Popups/FormPopup";
import { UseFormReturn } from "react-hook-form";
import { GridSizeType } from "_types_/GridLayoutType";
import { showToast, VariantNotificationType } from "contexts/ToastContext";
import { statusNotification } from "constants/index";
export interface DataPopupType {
  valueOptional: Partial<any>;
  isOpenPopup: boolean;
  isLoadingButton: boolean;
  funcContentRender: (
    methods: UseFormReturn<FormValuesProps, object>,
    optional: any
  ) => JSX.Element | PropsContentRender[];
  defaultData: Partial<any>;
  funcContentSchema: (value: any) => void;
  title: string;
  type: string;
  buttonText: string;
  maxWidthForm: GridSizeType;
  isDisabledSubmit: boolean;
  isShowFooter: boolean;
  isFullScreen?: boolean;
  zIndex?: number;
}
export interface PopupContextProps<T> {
  dataPopup: DataPopupType;
  dataPopupChild: DataPopupType;
  dataForm: Partial<T>;
  dataFormChild: Partial<T>;
  isLoadingSubmit: boolean;
  isLoadingSubmitChild: boolean;
  isSubmit: boolean;
  isSubmitChild: boolean;
  closePopup: VoidFunction;
  closePopupChild: VoidFunction;
  submitPopup: (form: Partial<T>) => void;
  submitPopupChild: (form: Partial<T>) => void;
  setLoadingSubmit: (isLoading: boolean) => void;
  setSubmit: (isLoading: boolean) => void;
  setSubmitChild: (isLoading: boolean) => void;
  setLoadingSubmitChild: (isLoading: boolean) => void;
  setDataPopup: React.Dispatch<React.SetStateAction<Partial<DataPopupType>>>;
  setDataPopupChild: React.Dispatch<React.SetStateAction<Partial<DataPopupType>>>;
  setDataForm: React.Dispatch<React.SetStateAction<Partial<T>>>;
  setDataFormChild: React.Dispatch<React.SetStateAction<Partial<T>>>;
  setNotifications: React.Dispatch<
    React.SetStateAction<{
      message: string;
      variant: VariantNotificationType;
    }>
  >;
  notifications?: {
    message: string;
    variant: VariantNotificationType;
  };
}

const defaultDataPopup: DataPopupType = {
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
  isDisabledSubmit: true,
  isShowFooter: true,
  isFullScreen: false,
  zIndex: 1300,
};

const initialState: PopupContextProps<any> = {
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
    isDisabledSubmit: true,
    isShowFooter: true,
    isFullScreen: false,
    zIndex: 1300,
  },
  dataPopupChild: {
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
    isDisabledSubmit: true,
    isShowFooter: true,
    isFullScreen: false,
    zIndex: 1300,
  },
  isLoadingSubmit: false,
  isLoadingSubmitChild: false,
  isSubmit: false,
  isSubmitChild: false,
  dataForm: {},
  dataFormChild: {},
  closePopup: () => {},
  closePopupChild: () => {},
  submitPopup: () => {},
  submitPopupChild: () => {},
  setDataPopup: () => {},
  setDataPopupChild: () => {},
  setDataForm: () => {},
  setDataFormChild: () => {},
  setLoadingSubmit: () => {},
  setLoadingSubmitChild: () => {},
  setNotifications: () => {},
  setSubmit: () => {},
  setSubmitChild: () => {},
  notifications: {
    message: "",
    variant: "info",
  },
};

const PopupContext = createContext(initialState);

type DetailVariantProviderProps = {
  children: ReactNode;
};

const Popup = ({
  dataPopup,
  closePopup,
  submitPopup,
  isLoadingSubmit,
  setNotifications,
}: {
  dataPopup: DataPopupType;
  closePopup: VoidFunction;
  submitPopup: (form: Partial<any>) => void;
  isLoadingSubmit: boolean;
  setNotifications: React.Dispatch<
    React.SetStateAction<{
      message: string;
      variant: VariantNotificationType;
    }>
  >;
}) => {
  const {
    isOpenPopup,
    title: titlePopup,
    buttonText,
    funcContentRender,
    funcContentSchema,
    isDisabledSubmit,
    maxWidthForm,
    defaultData,
    isShowFooter,
    zIndex,
    isFullScreen,
  } = dataPopup;
  const [isLoading, setLoading] = useState(false);

  const handleDrop = async (
    acceptedFiles: File[],
    methods: UseFormReturn<FormValuesProps, object>
  ) => {
    const { setValue } = methods;
    setLoading(true);

    const result: any = await productApi.upload(acceptedFiles[0], "image/");

    setLoading(false);

    if (result && result?.data) {
      const { data } = result;

      setNotifications({
        message: "Tải hình ảnh thành công",
        variant: statusNotification.SUCCESS,
      });

      setValue("imageApi", [data.id]);
      setValue("image", [{ id: data.id, url: data.image }]);
    } else {
      setNotifications({
        message: "Tải hình ảnh thất bại",
        variant: statusNotification.ERROR,
      });
    }
  };

  const handleRemoveAll = (methods: UseFormReturn<FormValuesProps, object>) => {
    const { setValue } = methods;
    setValue("image", []);
    setValue("imageApi", []);
  };

  const handleRemove = (
    file: { id: string; url: string },
    methods: UseFormReturn<FormValuesProps, object>
  ) => {
    const { watch, setValue } = methods;
    const values = watch();
    const newImages = values.image?.filter((_file: any) => _file.id !== file?.id);
    const newImageApi = values.imageApi.filter((_file: any) => _file !== file?.id);

    setValue("image", newImages);
    setValue("imageApi", newImageApi);
  };

  return (
    <FormPopup
      zIndex={zIndex}
      fullScreen={isFullScreen}
      isOpen={isOpenPopup}
      isLoadingButton={isLoadingSubmit}
      isLoadingImage={isLoading}
      isShowFooter={isShowFooter}
      title={titlePopup}
      isDisabledSubmit={isDisabledSubmit}
      maxWidthForm={maxWidthForm}
      buttonText={buttonText}
      defaultData={defaultData}
      funcContentSchema={funcContentSchema}
      funcContentRender={funcContentRender}
      handleClose={closePopup}
      handleDropImage={handleDrop}
      handleRemoveAllImage={handleRemoveAll}
      handleRemoveImage={handleRemove}
      handleSubmitPopup={submitPopup}
    />
  );
};

const PopupChild = ({
  dataPopup,
  closePopup,
  submitPopup,
  isLoadingSubmit,
  setNotifications,
}: {
  dataPopup: DataPopupType;
  closePopup: VoidFunction;
  submitPopup: (form: Partial<any>) => void;
  isLoadingSubmit: boolean;
  setNotifications: React.Dispatch<
    React.SetStateAction<{
      message: string;
      variant: VariantNotificationType;
    }>
  >;
}) => {
  const {
    isOpenPopup,
    title: titlePopup,
    buttonText,
    funcContentRender,
    funcContentSchema,
    isDisabledSubmit,
    maxWidthForm,
    defaultData,
    isShowFooter,
    zIndex,
    isFullScreen,
  } = dataPopup;
  const [isLoading, setLoading] = useState(false);

  const handleDrop = async (
    acceptedFiles: File[],
    methods: UseFormReturn<FormValuesProps, object>
  ) => {
    const { setValue } = methods;
    setLoading(true);

    const result: any = await productApi.upload(acceptedFiles[0], "image/");

    setLoading(false);

    if (result && result?.data) {
      const { data } = result;

      setNotifications({
        message: "Tải hình ảnh thành công",
        variant: statusNotification.SUCCESS,
      });

      setValue("imageApi", [data.id]);
      setValue("image", [{ id: data.id, url: data.image }]);
    } else {
      setNotifications({
        message: "Tải hình ảnh thất bại",
        variant: statusNotification.ERROR,
      });
    }
  };

  const handleRemoveAll = (methods: UseFormReturn<FormValuesProps, object>) => {
    const { setValue } = methods;
    setValue("image", []);
    setValue("imageApi", []);
  };

  const handleRemove = (
    file: { id: string; url: string },
    methods: UseFormReturn<FormValuesProps, object>
  ) => {
    const { watch, setValue } = methods;
    const values = watch();
    const newImages = values.image?.filter((_file: any) => _file.id !== file?.id);
    const newImageApi = values.imageApi.filter((_file: any) => _file !== file?.id);

    setValue("image", newImages);
    setValue("imageApi", newImageApi);
  };

  return (
    <FormPopup
      zIndex={zIndex}
      fullScreen={isFullScreen}
      isOpen={isOpenPopup}
      isLoadingButton={isLoadingSubmit}
      isLoadingImage={isLoading}
      isShowFooter={isShowFooter}
      title={titlePopup}
      isDisabledSubmit={isDisabledSubmit}
      maxWidthForm={maxWidthForm}
      buttonText={buttonText}
      defaultData={defaultData}
      funcContentSchema={funcContentSchema}
      funcContentRender={funcContentRender}
      handleClose={closePopup}
      handleDropImage={handleDrop}
      handleRemoveAllImage={handleRemoveAll}
      handleRemoveImage={handleRemove}
      handleSubmitPopup={submitPopup}
    />
  );
};

const PopupProvider = ({ children }: DetailVariantProviderProps) => {
  const [dataPopup, setDataPopup] = useState(initialState.dataPopup);
  const [dataForm, setDataForm] = useState(initialState.dataForm);
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const pathname = useLocation();

  // Child
  const [dataPopupChild, setDataPopupChild] = useState(initialState.dataPopupChild);
  const [dataFormChild, setDataFormChild] = useState(initialState.dataFormChild);
  const [isLoadingSubmitChild, setLoadingSubmitChild] = useState(false);
  const [isSubmitChild, setSubmitChild] = useState(false);

  const [notifications, setNotifications] = useState(initialState.notifications);

  useEffect(() => {
    if (pathname) {
      closePopup();
      closePopupChild();
    }
  }, [pathname]);

  useEffect(() => {
    if (notifications?.message) {
      showToast(notifications);
    }
  }, [notifications]);

  useEffect(() => {
    if (!dataPopup.isOpenPopup) {
      setDataForm({});
    }
  }, [dataPopup.isOpenPopup]);

  useEffect(() => {
    if (!dataPopupChild.isOpenPopup) {
      setDataFormChild({});
    }
  }, [dataPopupChild.isOpenPopup]);

  const closePopup = () => {
    setDataPopup(defaultDataPopup);

    setDataForm({});
    setSubmit(false);
    setLoadingSubmit(false);
  };

  const closePopupChild = () => {
    setDataPopupChild(defaultDataPopup);

    setDataFormChild({});
  };

  const submitPopup = async (form: Partial<any>) => {
    setDataForm(form);
    setSubmit(true);
  };

  const submitPopupChild = async (form: Partial<any>) => {
    setDataFormChild(form);
  };

  return (
    <PopupContext.Provider
      value={{
        dataPopup,
        dataForm,
        isLoadingSubmit,
        isSubmit,
        closePopup,
        submitPopup,
        setDataPopup,
        setLoadingSubmit,
        setDataForm,
        setSubmit,

        // Child
        dataPopupChild,
        dataFormChild,
        isLoadingSubmitChild,
        isSubmitChild,
        closePopupChild,
        submitPopupChild,
        setDataPopupChild,
        setLoadingSubmitChild,
        setDataFormChild,
        setSubmitChild,

        setNotifications,
      }}
    >
      <Popup
        dataPopup={dataPopup}
        isLoadingSubmit={isLoadingSubmit}
        closePopup={closePopup}
        submitPopup={submitPopup}
        setNotifications={setNotifications}
      />
      <PopupChild
        dataPopup={dataPopupChild}
        isLoadingSubmit={isLoadingSubmitChild}
        closePopup={closePopupChild}
        submitPopup={submitPopupChild}
        setNotifications={setNotifications}
      />
      {children}
    </PopupContext.Provider>
  );
};

export { PopupProvider, PopupContext };

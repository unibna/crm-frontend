// Libraries
import { useState, createContext, ReactNode } from "react";
interface DetailWarehouseContextProps {
  dataPopup: Partial<any>;
  openPopup: (type: string, optional: Partial<any>) => void;
  closePopup: VoidFunction;
  submitPopup: (form: Partial<any>) => void;
  setDataPopup: React.Dispatch<React.SetStateAction<Partial<any>>>
}

const initialState: DetailWarehouseContextProps = {
  dataPopup: {
    valueOptional: {},
    isOpenPopup: false,
    isLoadingButton: false,
    funcContentRender: () => [],
    defaultData: {},
    funcContentSchema: (value: any) => { },
    title: "",
    type: "",
    buttonText: "Tạo",
    maxWidthForm: "sm",
    isShowFooter: true
  },
  openPopup: () => { },
  closePopup: () => { },
  submitPopup: () => { },
  setDataPopup: () => { },
}

const DetailWarehouseContext = createContext(initialState);

type DetailVariantProviderProps = {
  children: ReactNode;
};

const DetailWarehouseProvider = ({ children }: DetailVariantProviderProps) => {
  const [dataPopup, setDataPopup] = useState(initialState.dataPopup)
  const {
    type: typeVariant,
    buttonText,
  } = dataPopup;

  const closePopup = () => {
    setDataPopup({
      ...dataPopup,
      isOpenPopup: false
    })
  }

  const openPopup = (type: string, optional: Partial<any> = {}) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = buttonText;
    let newContentRender: any = [];
    let defaultData = {};
    let title = type;
    let isShowFooter = true;
    let maxWidthForm = "sm";

    switch (type) {
    }

    setDataPopup({
      ...dataPopup,
      maxWidthForm,
      valueOptional: optional,
      buttonText: buttonTextPopup,
      isOpenPopup: true,
      title,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter
    })
  }

  const submitPopup = async (form: Partial<any>) => {
    setDataPopup({
      ...dataPopup,
      isLoadingButton: true
    })

    switch (typeVariant) {
    }
  }

  return (
    <DetailWarehouseContext.Provider
      value={{
        dataPopup,
        closePopup,
        openPopup,
        submitPopup,
        setDataPopup
      }}
    >
      {children}
    </DetailWarehouseContext.Provider>
  )
}

export { DetailWarehouseProvider, DetailWarehouseContext }
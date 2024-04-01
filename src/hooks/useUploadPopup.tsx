import { GridSizeType } from "_types_/GridLayoutType";
import UploadFile from "components/Uploads/UploadFile";
import usePopup from "./usePopup";
import { DataPopupType } from "contexts/PopupContext";

const useUploadPopup = ({
  apiUpload,
  onUploadSuccess,
  onUploadFailed,
  ...rest
}: Partial<DataPopupType> & {
  apiUpload: (file: any) => any;
  onUploadSuccess?: (files: any) => void;
  onUploadFailed?: () => void;
}) => {
  const { dataPopup, setDataPopup, closePopup } = usePopup();

  const onOpenPopup = () => {
    let funcContentSchema: any;
    let defaultData = { files: [] };
    let isShowFooter = true;
    let isDisabledSubmit = true;
    let maxWidthForm: GridSizeType = "md";

    let newContentRender = (methods: any) => {
      return (
        <UploadFile
          {...methods}
          onUploadFailed={onUploadFailed}
          onUploadSuccess={onUploadSuccess}
          apiUpload={apiUpload}
        />
      );
    };

    funcContentSchema = (yup: any) => {
      return {
        files: yup.mixed(),
      };
    };

    setDataPopup({
      ...dataPopup,
      maxWidthForm,
      isDisabledSubmit,
      isOpenPopup: true,
      defaultData,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter,
      ...rest,
    });
  };

  return {
    onOpenPopup,
    onClosePopup: closePopup,
  };
};

export default useUploadPopup;

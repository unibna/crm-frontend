import vi from "locales/vi.json";
import { RHFUploadMultiFile } from "components/HookFormFields";
import { useAppDispatch } from "hooks/reduxHook";
import { useState } from "react";
import { toastError, toastSuccess } from "store/redux/toast/slice";

interface Props {
  setValue: any;
  watch: any;
  apiUpload: (file: any) => any;
  onUploadSuccess?: (files: any) => void;
  onUploadFailed?: () => void;
}

export default function UploadFile(props: Props) {
  const { setValue, watch, apiUpload, onUploadSuccess, onUploadFailed } = props;
  const values = watch();
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);

  const handleDrop = async (acceptedFiles: any) => {
    setLoading(true);
    const arrResult = await Promise.all(
      acceptedFiles.map(async (item: File) => {
        return apiUpload(item);
      })
    );

    setLoading(false);
    if (arrResult.length) {
      let arrFile: any = [];
      const arrId: any = arrResult.reduce((prevArr: any, current: any) => {
        const { data } = current as any;
        arrFile = [...arrFile, data];
        return [...prevArr, data.id];
      }, []);

      dispatch(toastSuccess({ message: vi.upload_success }));

      const files = [...values?.files, ...arrFile];
      setValue("files", files);
      onUploadSuccess && onUploadSuccess(files);
    } else {
      dispatch(toastError({ message: vi.upload_error }));
      onUploadFailed && onUploadFailed();
    }
  };

  const handleRemoveAll = () => {
    setValue("files", []);
  };

  const handleRemove = (file: any) => {
    const newFiles = values?.files?.filter((_file: any) => _file.id !== file?.id);
    setValue("files", newFiles);
  };

  return (
    <RHFUploadMultiFile
      name="files"
      showPreview
      isMultiple
      accept="*"
      isLoadingBackground={isLoading}
      onDrop={handleDrop}
      onRemove={handleRemove}
      onRemoveAll={handleRemoveAll}
    />
  );
}

import { skycomtableApi } from "_apis_/skycomtable.api";
import vi from "locales/vi.json";
import { RHFUploadMultiFile } from "components/HookFormFields";
import { useAppDispatch } from "hooks/reduxHook";
import { useState } from "react";
import { toastError, toastSuccess } from "store/redux/toast/slice";
import { downscaleImage } from "utils/helpers";

interface Props {
  setValue: any;
  watch: any;
}

export default function UploadAttachment(props: Props) {
  const { setValue, watch } = props;
  const values = watch();
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);

  const handleDrop = async (acceptedFiles: any) => {
    setLoading(true);
    const arrResult = await Promise.all(
      acceptedFiles.map(async (item: File) => {
        let newItem: any = await downscaleImage({ file: item });
        newItem = new File([newItem], item.name, { type: item.type });
        if (newItem) {
          console.log(`Compress file successfully! ${item.size} -> ${newItem.size}`);
        }
        return skycomtableApi.upload(newItem || item, "table/uploadfile/");
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

      dispatch(toastSuccess({ message: vi.airtable.upload_success }));

      // setValue("imageApi", [...(values?.imageApi || []), ...arrId]);
      setValue("files", [...values?.files, ...arrFile]);
    } else {
      dispatch(toastError({ message: vi.airtable.upload_error }));
    }
  };

  const handleRemoveAll = () => {
    setValue("files", []);
    // setValue("imageApi", []);
  };

  const handleRemove = (file: any) => {
    const newFiles = values?.files?.filter((_file: any) => _file.id !== file?.id);
    // const newImageApi = values.imageApi.filter((_file: any) => _file !== file?.id);
    setValue("files", newFiles);
    // setValue("imageApi", newImageApi);
  };

  return (
    <RHFUploadMultiFile
      name="files"
      showPreview
      isMultiple
      accept="*"
      // maxSize={10485780} //10MB
      isLoadingBackground={isLoading}
      onDrop={handleDrop}
      onRemove={handleRemove}
      onRemoveAll={handleRemoveAll}
    />
  );
}

// Libraries
import { useContext, useState } from "react";

// Services
import { productApi } from "_apis_/product";

// Store Context
import { StoreProduct } from "views/ProductView/contextStore";

// Components
import Grid from "@mui/material/Grid";
import { RHFUploadMultiFile } from "components/HookFormFields";
import { LabelStyle } from "views/ProductView";

// Constants && Utils
import { actionType, message } from "views/ProductView/constants";
import { statusNotification } from "constants/index";
interface Props {
  setValue: any;
  watch: any;
}

const UploadImage = (props: Props) => {
  const { setValue, watch } = props;
  const values = watch();
  const { dispatch: dispatchStore } = useContext(StoreProduct);
  const [isLoading, setLoading] = useState(false);

  const handleDrop = async (acceptedFiles: any) => {
    setLoading(true);
    const arrResult = await Promise.all(
      acceptedFiles.map((item: any) => {
        return productApi.upload(item, "image/");
      })
    );

    setLoading(false);
    if (arrResult.length) {
      let arrImage: any = [];
      const arrId: any = arrResult.reduce((prevArr: any, current: any) => {
        const { data } = current as any;
        arrImage = [...arrImage, { id: data.id, url: data.image }];
        return [...prevArr, data.id];
      }, []);

      dispatchStore({
        type: actionType.UPDATE_NOTIFICATIONS,
        payload: {
          message: message.UPLOAD_IMAGE_SUCCESS,
          variant: statusNotification.SUCCESS,
        },
      });

      setValue("imageApi", [...values?.imageApi, ...arrId]);
      setValue("images", [...values?.images, ...arrImage]);
    } else {
      dispatchStore({
        type: actionType.UPDATE_NOTIFICATIONS,
        payload: {
          message: message.UPLOAD_IMAGE_FAILED,
          variant: statusNotification.ERROR,
        },
      });
    }
  };

  const handleRemoveAll = () => {
    setValue("images", []);
    setValue("imageApi", []);
  };

  const handleRemove = (file: any) => {
    const newImages = values.images?.filter((_file: any) => _file.id !== file?.id);
    const newImageApi = values.imageApi.filter((_file: any) => _file !== file?.id);
    setValue("images", newImages);
    setValue("imageApi", newImageApi);
  };

  return (
    <Grid item lg={12} xs={12} sm={12}>
      <LabelStyle>Hình đại diện của sản phẩm</LabelStyle>
      <RHFUploadMultiFile
        name="images"
        showPreview
        accept="image/*"
        maxSize={2145728}
        isLoadingBackground={isLoading}
        onDrop={handleDrop}
        onRemove={handleRemove}
        onRemoveAll={handleRemoveAll}
      />
    </Grid>
  );
};

export default UploadImage;

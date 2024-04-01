// Libraries
import { useEffect } from "react";
import map from "lodash/map";
import filter from "lodash/filter";
import reduce from "lodash/reduce";
import { Controller, ControllerRenderProps, FieldError, UseFormReturn } from "react-hook-form";

// Context
import usePopup from "hooks/usePopup";

// Components
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ThumbImgStyle } from "components/DDataGrid/components/ColumnThumbImg";
import { MButton } from "components/Buttons";
import InputAdornment from "@mui/material/InputAdornment";
import OperationVariant from "views/ProductView/components/OperationVariant";

// Types
import { AttributeVariant } from "_types_/ProductType";
import { FormValuesProps } from "components/Popups/FormPopup";

// Constants & Utils
import {
  initAttribuesVariant,
  titlePopupHandleProduct,
  typeHandleProduct,
} from "views/ProductView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import logoIcon from "assets/images/icon-logo.png";
import { fNumber } from "utils/formatNumber";
import { random } from "utils/randomUtil";

// -----------------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const VariantItem = ({
  variant,
  field,
  error,
  handleOpenPopup,
}: {
  variant: AttributeVariant;
  field: ControllerRenderProps<FormValuesProps, "variants">;
  error?: Partial<any>;
  handleOpenPopup: VoidFunction;
}) => {
  const { value, onChange } = field;

  const handleChangeInput = (objValue: Partial<any>) => {
    const newVariants = reduce(
      value,
      (prevArr, current) => {
        return current.id === variant.id
          ? [
              ...prevArr,
              {
                ...current,
                ...objValue,
              },
            ]
          : [...prevArr, current];
      },
      []
    );

    onChange(newVariants);
  };

  const convertValueVnd = (value: string) => {
    return value.replace(/,/gi, "");
  };

  return (
    <Grid item container xs={12} spacing={2}>
      <Grid item xs={12} md={0.8}>
        <ThumbImgStyle src={getObjectPropSafely(() => variant?.image[0]?.url) || logoIcon} />
      </Grid>
      <Grid item xs={12} md={4.2}>
        <TextField
          value={variant.value}
          fullWidth
          label="Tên biến thể"
          required
          error={!!getObjectPropSafely(() => error?.value?.message)}
          helperText={getObjectPropSafely(() => error?.value?.message)}
          onChange={(e) => handleChangeInput({ value: e.target.value })}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <TextField
          value={variant.SKU_code}
          fullWidth
          label="SKU"
          error={!!getObjectPropSafely(() => error?.SKU_code?.message)}
          helperText={getObjectPropSafely(() => error?.SKU_code?.message)}
          onChange={(e) => handleChangeInput({ SKU_code: e.target.value })}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <TextField
          value={fNumber(variant.neo_price)}
          fullWidth
          label="Giá niêm yết"
          placeholder="0 đ"
          InputProps={{
            endAdornment: <InputAdornment position="end">vnd</InputAdornment>,
          }}
          onChange={(e) => handleChangeInput({ neo_price: +convertValueVnd(e.target.value) })}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <TextField
          value={fNumber(variant.sale_price)}
          fullWidth
          label="Giá bán"
          placeholder="0 đ"
          InputProps={{
            endAdornment: <InputAdornment position="end">vnd</InputAdornment>,
          }}
          onChange={(e) => handleChangeInput({ sale_price: +convertValueVnd(e.target.value) })}
        />
      </Grid>
      <Grid item container alignItems="center" xs={12} md={1}>
        <IconButton color="info" onClick={handleOpenPopup}>
          <EditIcon />
        </IconButton>
        {getObjectPropSafely(() => value.length) > 1 ? (
          <IconButton
            color="error"
            onClick={() => onChange(filter(value, (item) => item.id !== variant.id))}
          >
            <DeleteIcon />
          </IconButton>
        ) : null}
      </Grid>
    </Grid>
  );
};

const VariantCreate = (props: Props) => {
  const { control, watch, setValue } = props;
  const { variants } = watch();
  const { dataPopupChild, dataFormChild, setDataPopupChild, closePopupChild } = usePopup();

  useEffect(() => {
    if (Object.values(dataFormChild).length) {
      handleSubmitPopup(dataFormChild);
    }
  }, [dataFormChild]);

  const handleOpenPopup = (type: string, optional: any = {}) => {
    const typeProduct = typeHandleProduct.EDIT_ATTRIBUTE_VALUE;
    const defaultData = {
      id: optional.id,
      SKU_code: optional.SKU_code,
      value: optional.value,
      barcode: optional.barcode,
      description: optional.description,
      sale_price: optional.sale_price || "",
      neo_price: optional.neo_price || "",
      purchase_price: optional.purchase_price || "",
      image: optional.image || [],
      imageApi: optional.imageApi || [],
      status: optional?.status || false,
    };
    const title = `${type} ${optional.value}`;
    const maxWidthForm = "lg";
    const funcContentSchema = (yup: any) => {
      return {
        sale_price: yup.string(),
        neo_price: yup.string(),
        value: yup.string(),
        purchase_price: yup.string(),
        description: yup.string(),
        status: yup.bool(),
        SKU_code: yup.string(),
        barcode: yup.string(),
        imageApi: yup.array(),
        image: yup.array(),
      };
    };
    const newContentRender: any = (methods: any, optional: any) => {
      return <OperationVariant {...methods} {...optional} />;
    };

    setDataPopupChild({
      ...dataPopupChild,
      maxWidthForm,
      buttonText: "Cập nhật",
      isOpenPopup: true,
      title,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
    });
  };

  const handleSubmitPopup = async (form: any) => {
    const newVariants = getObjectPropSafely(() => variants.length)
      ? variants.reduce((prevArr: any, current: AttributeVariant) => {
          return current.id === form.id ? [...prevArr, form] : [...prevArr, current];
        }, [])
      : [];

    setValue("variants", newVariants);

    closePopupChild();
  };

  return (
    <Grid item xs={12} sm={12} lg={12}>
      <Grid item xs={12} md={12}>
        <Typography variant="body2">Tạo biến thể cho sản phẩm:</Typography>
        <Typography variant="caption" sx={{ opacity: 0.5 }}>
          Thêm các biến thể khi sản phẩm có các phiên bản khác nhau, chẳng hạn như màu sắc và kích
          thước
        </Typography>
      </Grid>
      <Grid item container xs={12} spacing={3} sx={{ py: 3 }}>
        <Controller
          name="variants"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              {map(variants, (item, index) => (
                <VariantItem
                  field={field}
                  error={error && error[index]}
                  variant={item}
                  handleOpenPopup={() =>
                    handleOpenPopup(titlePopupHandleProduct.EDIT_ATTRIBUTE_VALUE, item)
                  }
                />
              ))}
            </>
          )}
        />
      </Grid>
      <Grid item container xs={12}>
        <Controller
          name="variants"
          control={control}
          render={({ field }) => (
            <MButton
              color="primary"
              variant="contained"
              size="small"
              sx={{ mb: 3, mt: 1 }}
              onClick={() =>
                field.onChange([...field.value, { ...initAttribuesVariant, id: random(6) }])
              }
            >
              Thêm mới
            </MButton>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default VariantCreate;

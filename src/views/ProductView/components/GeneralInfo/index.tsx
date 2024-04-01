// Libraries
import { useMemo, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useTheme } from "@mui/material/styles";

// Services
import { productApi } from "_apis_/product";

// Store Context
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import { getAllAttributesProduct } from "selectors/attributes";
import usePopup from "hooks/usePopup";
import { updateAttributesProduct } from "store/redux/attributes/slice";

// Types
import { SelectOptionType } from "_types_/SelectOptionType";

// Components
import Grid from "@mui/material/Grid";
import Collapse from "@mui/material/Collapse";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import { MultiSelect } from "components/Selectors";
import { RHFTextField } from "components/HookFormFields";
import UploadImage from "views/ProductView/components/UploadImage";

// Constants & Utils
import {
  keyDataFilter,
  message,
  typeHandleProduct,
  contentRenderDefault,
  titlePopupHandleProduct,
  optionFilterOperation,
} from "views/ProductView/constants";
import { statusNotification } from "constants/index";
import { handleParams } from "utils/formatParamsUtil";
import { fNumber } from "utils/formatNumber";
interface Props {
  control: any;
  watch: any;
  setValue: any;
  isCombo?: boolean;
}

const GeneralInfo = (props: Props) => {
  const { control, watch, setValue, isCombo = false } = props;
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const attributesProduct = useAppSelector((state) => getAllAttributesProduct(state.attributes));
  const {
    setDataPopupChild,
    dataPopupChild,
    dataFormChild,
    setLoadingSubmitChild,
    setNotifications,
    closePopupChild,
  } = usePopup<{ name: string }>();
  const {
    dataCategory: dataFilterCategory,
    dataType: dataFilterType,
    dataSupplier: dataFilterSupplier,
    dataBrand: dataFilterBrand,
    dataTags: dataFilterTags,
  } = attributesProduct;
  const { tags } = watch();
  const { title: titlePopup, type: typeProduct } = dataPopupChild;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (Object.values(dataFormChild).length) {
      handleSubmitPopup(dataFormChild);
    }
  }, [dataFormChild]);

  const handleOpenPopup = (type: string, defaultValue: Partial<SelectOptionType> = {}) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Tạo";
    let newContentRender = () => contentRenderDefault[type] || [];
    let defaultData = defaultValue;

    switch (type) {
      case titlePopupHandleProduct.ADD_CATEGORY: {
        typeProduct = typeHandleProduct.CATEGORY;
        defaultData = {
          name: "",
          code: "",
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên nhóm sản phẩm"),
            code: yup.string(),
          };
        };
        break;
      }
      case titlePopupHandleProduct.ADD_TYPE: {
        typeProduct = typeHandleProduct.TYPE;
        defaultData = {
          name: "",
          code: "",
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên loại sản phẩm"),
            code: yup.string(),
          };
        };
        break;
      }
      case titlePopupHandleProduct.ADD_BRAND: {
        typeProduct = typeHandleProduct.BRAND;
        defaultData = {
          name: "",
          code: "",
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên thương hiệu"),
            code: yup.string(),
          };
        };
        break;
      }
      case titlePopupHandleProduct.ADD_SUPPLIER: {
        typeProduct = typeHandleProduct.SUPPLIER;
        defaultData = {
          name: "",
          business_code: "",
          tax_number: "",
          country: "",
          address: "",
          status: optionFilterOperation[0].value,
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên nhà sản xuất"),
            business_code: yup.string(),
            tax_number: yup.string(),
            country: yup.string(),
            address: yup.string(),
            status: yup.string(),
          };
        };
        break;
      }
      case titlePopupHandleProduct.ADD_TAGS: {
        typeProduct = typeHandleProduct.TAGS;
        defaultData = {
          name: "",
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên nhãn"),
          };
        };
        break;
      }
    }

    setDataPopupChild({
      ...dataPopupChild,
      zIndex: 1304,
      buttonText: buttonTextPopup,
      isOpenPopup: true,
      title: type,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
    });
  };

  const handleSubmitPopup = async (form: any) => {
    const { name, code } = form;
    setLoadingSubmitChild(true);

    switch (titlePopup) {
      case titlePopupHandleProduct.ADD_CATEGORY: {
        const params = {
          name,
          code,
        };

        const result: any = await productApi.create(handleParams(params), "category/");
        if (result && result.data) {
          const { id = "", name = "", code = "" } = result.data;

          dispatch(
            updateAttributesProduct({
              dataCategory: [
                ...dataFilterCategory,
                {
                  value: id,
                  label: name,
                  code,
                },
              ],
            })
          );

          setValue("category", id);

          setNotifications({
            message: message[typeProduct]?.ADD_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        }

        break;
      }
      case titlePopupHandleProduct.ADD_SUPPLIER: {
        const params = {
          name: form.name,
          business_code: form.business_code,
          tax_number: form.tax_number,
          country: form.country,
          address: form.address,
          status: form.status,
        };

        const result: any = await productApi.create(handleParams(params), "supplier/");
        if (result && result.data) {
          const { id = "", name = "" } = result.data;

          dispatch(
            updateAttributesProduct({
              dataSupplier: [
                ...dataFilterSupplier,
                {
                  value: id,
                  label: name,
                  ...result.data,
                },
              ],
            })
          );

          setValue("supplier", id);

          setNotifications({
            message: message[typeProduct]?.ADD_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        }

        break;
      }
      case titlePopupHandleProduct.ADD_TYPE:
      case titlePopupHandleProduct.ADD_BRAND: {
        const params = {
          name,
          code,
          type: typeProduct,
        };

        const result: any = await productApi.create(handleParams(params), "option/");

        if (result && result.data) {
          const { id = "", name = "", code = "" } = result.data;

          dispatch(
            updateAttributesProduct({
              [keyDataFilter[typeProduct]]: [
                ...attributesProduct[keyDataFilter[typeProduct]],
                {
                  value: id,
                  label: name,
                  code,
                },
              ],
            })
          );

          setValue(titlePopup === titlePopupHandleProduct.ADD_TYPE ? "type" : "brand", id);

          setNotifications({
            message: message[typeProduct]?.ADD_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        }
        break;
      }
    }

    setLoadingSubmitChild(false);
    closePopupChild();
  };

  const handleChangeTags = (field: any, valueSelected: SelectOptionType[]) => {
    const { onChange } = field;

    onChange(valueSelected);
  };

  const handleDeleteTag = (objTag: SelectOptionType) => {
    const newTags = tags.filter((item: SelectOptionType) => item.value !== objTag.value);
    setValue("tags", newTags);
  };

  const convertValueVnd = (value: string) => {
    return value.replace(/,/gi, "");
  };

  const dataCategory = useMemo(() => {
    return dataFilterCategory.length
      ? dataFilterCategory.filter((item: SelectOptionType) => item.value !== "all")
      : [];
  }, [dataFilterCategory]);

  const dataType = useMemo(() => {
    return dataFilterType.length
      ? dataFilterType.filter((item: SelectOptionType) => item.value !== "all")
      : [];
  }, [dataFilterType]);

  const dataSupplier = useMemo(() => {
    return dataFilterSupplier.length
      ? dataFilterSupplier.filter((item: SelectOptionType) => item.value !== "all")
      : [];
  }, [dataFilterSupplier]);

  const dataBrand = useMemo(() => {
    return dataFilterBrand.length
      ? dataFilterBrand.filter((item: SelectOptionType) => item.value !== "all")
      : [];
  }, [dataFilterBrand]);

  return (
    <Grid item container xs={12} sm={12} lg={12}>
      <Grid item container xs={12} sx={{ mb: 2 }}>
        <Typography variant="body2">Thông tin sản phẩm:</Typography>
      </Grid>
      <Grid item container spacing={2}>
        <Grid item xs={12} sm={12} lg={5}>
          <RHFTextField name="name" label="Tên sản phẩm *" placeholder="Nhập tên sản phẩm" />
        </Grid>
        <Grid item xs={12} sm={12} lg={3}>
          <RHFTextField name="SKU_code" label="SKU" placeholder="Nhập mã sản phẩm/ SKU" />
        </Grid>
        {isCombo && (
          <>
            <Grid item xs={12} sm={12} lg={2}>
              <Controller
                name="neo_price"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    value={fNumber(field.value)}
                    onChange={(event) => field.onChange(convertValueVnd(event.target.value))}
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    label="Giá niêm yết"
                    placeholder="0 đ"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">vnd</InputAdornment>,
                    }}
                    disabled
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={2}>
              <Controller
                name="sale_price"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    value={fNumber(field.value)}
                    onChange={(event) => field.onChange(convertValueVnd(event.target.value))}
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    label="Giá bán"
                    placeholder="0 đ"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">vnd</InputAdornment>,
                    }}
                    disabled
                  />
                )}
              />
            </Grid>
          </>
        )}
      </Grid>

      <Grid item container xs={12} sx={{ my: 2 }}>
        {expanded ? (
          <Typography
            variant="caption"
            color={theme.palette.secondary.main}
            onClick={() => setExpanded(!expanded)}
            sx={{ cursor: "pointer" }}
          >
            Thu gọn
          </Typography>
        ) : (
          <Typography
            variant="caption"
            color={theme.palette.secondary.main}
            onClick={() => setExpanded(!expanded)}
            sx={{ cursor: "pointer" }}
          >
            Chi tiết
          </Typography>
        )}
      </Grid>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Grid item container xs={12} spacing={2}>
          <Grid item xs={6} sm={6} md={4} lg={4}>
            <Controller
              name="category"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <MultiSelect
                  zIndex={1303}
                  style={{ width: "100%" }}
                  title="Chọn nhóm sản phẩm"
                  size="medium"
                  outlined
                  selectorId="category"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  options={dataCategory}
                  onChange={(value: any) => field.onChange(value)}
                  defaultValue={field.value || ""}
                  contentRender={
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{ p: 1, pb: 0.5, pt: 2, pl: 1.5, cursor: "pointer" }}
                      onClick={() => handleOpenPopup(titlePopupHandleProduct.ADD_CATEGORY)}
                    >
                      <AddCircleIcon color="primary" sx={{ fontSize: 15, mr: 0.5 }} />
                      <Typography
                        variant="body1"
                        component="span"
                        color="primary"
                        sx={{ fontSize: 13 }}
                      >
                        Thêm mới thuộc tính
                      </Typography>
                    </Box>
                  }
                  simpleSelect
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4} lg={4}>
            <Controller
              name="type"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <MultiSelect
                  zIndex={1303}
                  style={{ width: "100%" }}
                  title="Chọn loại sản phẩm"
                  size="medium"
                  outlined
                  selectorId="type"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  options={dataType}
                  onChange={(value: any) => field.onChange(value)}
                  defaultValue={field.value || ""}
                  contentRender={
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{ p: 1, pb: 0.5, pt: 2, pl: 1.5, cursor: "pointer" }}
                      onClick={() => handleOpenPopup(titlePopupHandleProduct.ADD_TYPE)}
                    >
                      <AddCircleIcon color="primary" sx={{ fontSize: 15, mr: 0.5 }} />
                      <Typography
                        variant="body1"
                        component="span"
                        color="primary"
                        sx={{ fontSize: 13 }}
                      >
                        Thêm mới thuộc tính
                      </Typography>
                    </Box>
                  }
                  simpleSelect
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4} lg={4}>
            <Controller
              name="supplier"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <MultiSelect
                  zIndex={1303}
                  style={{ width: "100%" }}
                  title="Chọn nhà sản xuất"
                  size="medium"
                  outlined
                  selectorId="supplier"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  options={dataSupplier}
                  onChange={(value: any) => field.onChange(value)}
                  defaultValue={field.value || ""}
                  simpleSelect
                  contentRender={
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{ p: 1, pb: 0.5, pt: 2, pl: 1.5, cursor: "pointer" }}
                      onClick={() => handleOpenPopup(titlePopupHandleProduct.ADD_SUPPLIER)}
                    >
                      <AddCircleIcon color="primary" sx={{ fontSize: 15, mr: 0.5 }} />
                      <Typography
                        variant="body1"
                        component="span"
                        color="primary"
                        sx={{ fontSize: 13 }}
                      >
                        Thêm mới thuộc tính
                      </Typography>
                    </Box>
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4} lg={4}>
            <Controller
              name="brand"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <MultiSelect
                  zIndex={1303}
                  style={{ width: "100%" }}
                  title="Chọn thương hiệu"
                  size="medium"
                  outlined
                  selectorId="brand"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  options={dataBrand}
                  onChange={(value: any) => field.onChange(value)}
                  defaultValue={field.value || ""}
                  simpleSelect
                  contentRender={
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{ p: 1, pb: 0.5, pt: 2, pl: 1.5, cursor: "pointer" }}
                      onClick={() => handleOpenPopup(titlePopupHandleProduct.ADD_BRAND)}
                    >
                      <AddCircleIcon color="primary" sx={{ fontSize: 15, mr: 0.5 }} />
                      <Typography
                        variant="body1"
                        component="span"
                        color="primary"
                        sx={{ fontSize: 13 }}
                      >
                        Thêm mới thuộc tính
                      </Typography>
                    </Box>
                  }
                />
              )}
            />
          </Grid>
          <Grid item container xs={12} sm={12} md={4} lg={5}>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  id="asynchronous-demo"
                  value={tags}
                  fullWidth
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  getOptionLabel={(option) => option.label}
                  options={dataFilterTags}
                  multiple
                  sx={{
                    ".MuiOutlinedInput-root": {
                      div: { display: "none" },
                    },
                    ".MuiChip-root": { height: 24, label: { pr: 1, pl: 1 }, m: 0.25 },
                    zIndex: 1303,
                    mt: 1,
                  }}
                  onChange={(event, newValue) => handleChangeTags(field, newValue)}
                  renderInput={(params) => <TextField {...params} placeholder="Nhãn" />}
                />
              )}
            />
            <Grid item container direction="row" spacing={1} sx={{ ml: 1, mt: 1 }}>
              {tags.map((tag: SelectOptionType, index: number) => (
                <Chip
                  key={index}
                  label={tag.label}
                  onDelete={() => handleDeleteTag(tag)}
                  size="small"
                  style={{ marginTop: 8, marginRight: 8, marginLeft: 0 }}
                />
              ))}
            </Grid>
          </Grid>
          <Grid item container alignItems="center" lg={3} xs={12} md={6}>
            <Typography component="span" variant="body2">
              Ngừng kinh doanh
            </Typography>
            <Controller
              name="status"
              control={control}
              render={({ field }) => <Switch {...field} checked={field.value} />}
            />
          </Grid>
          <Grid item container xs={12}>
            <UploadImage {...props} />
          </Grid>
        </Grid>
      </Collapse>
    </Grid>
  );
};

export default GeneralInfo;

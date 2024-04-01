// Libraries
import { useEffect, useMemo, useState } from "react";
import { Controller, ControllerRenderProps, UseFormReturn } from "react-hook-form";
import map from "lodash/map";
import find from "lodash/find";
import filter from "lodash/filter";
import sumBy from "lodash/sumBy";
import flatMap from "lodash/flatMap";
import reduce from "lodash/reduce";
import { useTheme } from "@mui/material/styles";
import format from "date-fns/format";

// Services
import { productApi } from "_apis_/product";

// Hooks
import usePopup from "hooks/usePopup";
import { getAllAttributesWarehouse } from "selectors/attributes";
import { useAppSelector } from "hooks/reduxHook";

// Components
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { ThumbImgStyle } from "components/DDataGrid/components/ColumnThumbImg";
import PopupBatch from "./PopupBatch";
import Scrollbar from "components/Scrolls/Scrollbar";
import SkeletonInfo from "views/WarehouseView/components/SkeletonInfo";
import { MTextLine, Span } from "components/Labels";
import { MultiSelect } from "components/Selectors";
import { MButton } from "components/Buttons";
import { SearchVariant } from "components/ProductComponent";

// Types
import { AttributeVariant, BatchType, STATUS_PRODUCT } from "_types_/ProductType";
import { GridSizeType } from "_types_/GridLayoutType";
import { FormValuesProps } from "components/Popups/FormPopup";

// Constants & Utils
import {
  titlePopupHandle,
  typeHandle,
  contentRenderDefault,
  message,
  selectLotPopupType,
} from "views/WarehouseView/constants";
import { statusNotification } from "constants/index";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import logoIcon from "assets/images/icon-logo.png";
import { fDate } from "utils/dateUtil";
import { random } from "utils/randomUtil";
import { yyyy_MM_dd } from "constants/time";
import { TypeWarehouseSheet } from "_types_/WarehouseType";
import { ROLE_TAB } from "constants/rolesTab";
import { fValueVnd } from "utils/formatNumber";

// -------------------------------------------------------------------
interface Props extends UseFormReturn<FormValuesProps, object> {
  type: TypeWarehouseSheet;
  setDefaultValue: (value: Partial<any>) => void;
}

const AttachLot = (props: Props) => {
  const theme = useTheme();
  const { control, watch, setValue, type: typeSheet, setDefaultValue } = props;
  const attributesWarehouse = useAppSelector((state) =>
    getAllAttributesWarehouse(state.attributes)
  );
  const { listWarehouse: dataWarehouse } = attributesWarehouse;
  const { dataPopup, setDataPopup, closePopup, dataForm, setNotifications } = usePopup();
  const { variantsSelected } = watch();

  // State
  const [isLoading, setLoading] = useState(false);

  const { type: typePopup, valueOptional, defaultData } = dataPopup;

  useEffect(() => {
    if (Object.values(dataForm).length) {
      handleSubmitPopup(dataForm);
    }
  }, [dataForm]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const defaultVariantsSelected = queryParams.get("variant_selected")?.split(",") || [];

    if (defaultVariantsSelected.length && dataWarehouse.length) {
      getVariantDefaultSelected({
        variant_id: defaultVariantsSelected,
      });
    }
  }, [dataWarehouse]);

  const getVariantDefaultSelected = async (params: any) => {
    setLoading(true);
    const result: any = await productApi.get(params, "variant/");
    if (result && result.data) {
      const { results = [] } = result.data;
      const warehouseDefault = find(dataWarehouse, (item) => item.is_default) || dataWarehouse[0];

      const newResults = reduce(
        results,
        (prevArr, current) => {
          const newBatches = getObjectPropSafely(() => current.batches.length)
            ? map(current.batches, (batch) => ({
                ...batch,
                quantity: 0,
                isNew: false,
              }))
            : [];

          return current.status === "ACTIVE"
            ? [
                ...prevArr,
                {
                  ...current,
                  batches: newBatches,
                  value: current.name,
                  batchesSelected: [],
                  warehouse: warehouseDefault,
                  toWarehouse: warehouseDefault,
                },
              ]
            : prevArr;
        },
        []
      );

      setValue("variantsSelected", newResults);
      setDefaultValue({
        variantsSelected: newResults,
      });

      setLoading(false);
    }
  };

  const handleOpenPopup = (type: string, optional: any = {}, optionalParent: any = {}) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Tạo";
    let newContentRender: any = () => contentRenderDefault[type] || [];
    let defaultData = {};
    let title = type;
    let isShowFooter = true;
    let isDisabledSubmit = false;
    let maxWidthForm: GridSizeType = "sm";
    let zIndex = 1300;

    switch (type) {
      case titlePopupHandle.CREATE_BATCH: {
        typeProduct = typeHandle.CREATE_BATCH;
        defaultData = {
          id: optional.id,
          name: "",
          quantity: 1,
          valueDate: {
            value: "",
            isHaveHsd: true,
          },
        };
        newContentRender = (methods: any) => <PopupBatch {...methods} type={typeSheet} />;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên lô"),
            quantity: yup.number().required("Vui lòng nhập số lượng"),
            valueDate: yup.object().test({
              name: "valueDate",
              message: "Vui lòng nhập ngày sử dụng",
              test: (valueDate: any) =>
                (valueDate.isHaveHsd && !!valueDate.value) || !valueDate.isHaveHsd,
            }),
          };
        };
        title = `Thêm lô ${optional.value}`;
        buttonTextPopup = "Xong";
        zIndex = 1299;
        break;
      }
      case titlePopupHandle.EDIT_BATCH: {
        typeProduct = typeHandle.EDIT_BATCH;
        defaultData = {
          id: optional.id,
          name: optional.batch_name,
          expiry_date: optional.expiry_date,
          quantity: 1,
          quantityPrev: optional.quantity || 0,
          valueDate: {},
        };
        newContentRender = (methods: any) => <PopupBatch {...methods} type={typeSheet} isEdit />;

        funcContentSchema = (yup: any) => {
          return {
            name: yup.string(),
            quantity: yup.string().required("Vui lòng nhập số lượng"),
            quantityPrev: yup.number(),
          };
        };
        title = `Chỉnh sửa số lượng lô ${optionalParent.value}`;
        buttonTextPopup = "Cập nhật";
        break;
      }
    }

    setDataPopup({
      zIndex,
      maxWidthForm,
      valueOptional: optionalParent,
      buttonText: buttonTextPopup,
      isOpenPopup: true,
      title,
      isDisabledSubmit,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter,
    });
  };

  const handleSubmitPopup = async (form: any) => {
    switch (typePopup) {
      case typeHandle.CREATE_BATCH: {
        const { name, valueDate, id: variantId } = form;
        const expiryDate = valueDate.isHaveHsd ? format(new Date(valueDate.value), yyyy_MM_dd) : "";

        const newVariantsSelected = map(variantsSelected, (variant) => {
          return variant.id === variantId
            ? {
                ...variant,
                batches: [
                  ...variant.batches,
                  {
                    batch_name: name,
                    expiry_date: expiryDate,
                    quantity: form.quantity,
                    variant: variantId,
                    isNew: true,
                    id: random(3),
                  },
                ],
                batchesSelected: [
                  ...variant.batchesSelected,
                  {
                    batch_name: name,
                    expiry_date: expiryDate,
                    quantity: form.quantity,
                    variant: variantId,
                    isNew: true,
                    id: random(3),
                  },
                ],
              }
            : variant;
        });

        setValue("variantsSelected", newVariantsSelected);
        setNotifications({
          message: message[typePopup].OPERATION_SUCCESS,
          variant: statusNotification.SUCCESS,
        });

        break;
      }
      case typeHandle.EDIT_BATCH: {
        if (
          (typeSheet === TypeWarehouseSheet.EXPORTS || typeSheet === TypeWarehouseSheet.TRANSFER) &&
          +form.quantity > form.quantityPrev
        ) {
          setNotifications({
            message: message.NOT_ENOUGH_QUANTITY,
            variant: statusNotification.WARNING,
          });

          return;
        }

        const newVariantsSelected = map(variantsSelected, (variant) => {
          if (variant.id === valueOptional.id) {
            const newBatches = map(variant.batches, (item) => {
              return item.id === defaultData.id
                ? {
                    ...item,
                    batch_name: form.name,
                    quantity: +form.quantity,
                  }
                : item;
            });

            const index = variant.batchesSelected.findIndex(
              (item: BatchType) => item.id === defaultData.id
            );

            const newBatchesSelected =
              index !== -1
                ? map(variant.batchesSelected, (item) => {
                    return item.id === defaultData.id
                      ? {
                          ...item,
                          batch_name: form.name,
                          quantity: +form.quantity,
                          expiry_date: form.expiry_date,
                        }
                      : item;
                  })
                : [
                    ...variant.batchesSelected,
                    {
                      ...defaultData,
                      isNew: false,
                      batch_name: form.name,
                      quantity: +form.quantity,
                      expiry_date: form.expiry_date,
                    },
                  ];

            return {
              ...variant,
              batches: newBatches,
              batchesSelected: newBatchesSelected,
            };
          }

          return variant;
        });

        setValue("variantsSelected", newVariantsSelected);

        setNotifications({
          message: message[typePopup].OPERATION_SUCCESS,
          variant: statusNotification.SUCCESS,
        });

        break;
      }
    }
    closePopup();
  };

  const handleDeleteBatch = (
    field: ControllerRenderProps<FormValuesProps, "variantsSelected">,
    batch: BatchType,
    variant: AttributeVariant
  ) => {
    const { value, onChange } = field;
    const newBatchesSelected = filter(variant.batchesSelected, (item) => item.id !== batch.id);
    const newVariantsSelected = map(value, (item) => {
      return item.id === variant.id
        ? {
            ...item,
            batchesSelected: newBatchesSelected,
          }
        : item;
    });

    onChange(newVariantsSelected);
  };

  const handleChooseBatch = (batch: BatchType, variant: AttributeVariant) => {
    handleOpenPopup(
      selectLotPopupType[typeSheet as keyof typeof selectLotPopupType],
      batch,
      variant
    );
  };

  const handleChooseWarehouse = (
    value: Partial<any>,
    variant: AttributeVariant,
    field: ControllerRenderProps<FormValuesProps, "variantsSelected">
  ) => {
    const newVariantsSelected = reduce(
      variantsSelected,
      (prevArr: any, current) => {
        return variant.id === current.id
          ? [
              ...prevArr,
              {
                ...current,
                ...value,
              },
            ]
          : [...prevArr, current];
      },
      []
    );

    field.onChange(newVariantsSelected);
  };

  const handleDataVariantItem = (variant: AttributeVariant | any) => {
    const newBatches = getObjectPropSafely(() => variant?.batches?.length)
      ? map(variant.batches, (batch) => ({
          ...batch,
          quantity: getObjectPropSafely(() => batch?.inventory?.quantity) || 0,
          isNew: false,
        }))
      : [];

    return {
      ...variant,
      batches: newBatches,
      batchesSelected: [],
      warehouse: warehouseDefault,
      toWarehouse: warehouseDefault,
    };
  };

  const handleSelectVariant = (
    field: ControllerRenderProps<FormValuesProps, "variantsSelected">,
    variants: AttributeVariant[]
  ) => {
    const newVariants = reduce(
      variants,
      (prevArr, current: AttributeVariant) => {
        const objVariant = find(field.value, (item) => item.id === current.id);

        return objVariant ? [...prevArr, objVariant] : [...prevArr, current];
      },
      []
    );

    field.onChange(newVariants);
  };

  const warehouseDefault = useMemo(() => {
    return find(dataWarehouse, (item) => item.is_default) || dataWarehouse[0];
  }, [dataWarehouse]);

  const totalQuantityAfterInput = useMemo(() => {
    return (
      sumBy(
        flatMap(variantsSelected, (item) => item.batchesSelected),
        (current) => current.quantity
      ) || 0
    );
  }, [variantsSelected]);

  return (
    <>
      {isLoading && (
        <Grid item sx={{ width: "100%" }}>
          <SkeletonInfo />
        </Grid>
      )}
      {!isLoading && (
        <Card sx={{ p: 5 }}>
          <Grid container sx={{ mb: 5 }}>
            <Controller
              name="variantsSelected"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <SearchVariant
                  value={field.value}
                  endpoint="variant/"
                  params={{ limit: 10 }}
                  isMultiple
                  placeholder="Tìm theo tên sản phẩm"
                  message={error?.message}
                  handleDisableItem={(variant) =>
                    variant.status === STATUS_PRODUCT.INACTIVE ||
                    getObjectPropSafely(() => variant.bundle_variants?.length)
                  }
                  handleDataItem={handleDataVariantItem}
                  handleSelectVariant={(variants: AttributeVariant[]) =>
                    handleSelectVariant(field, variants)
                  }
                />
              )}
            />
          </Grid>

          <Scrollbar sx={{ p: 3, maxHeight: 600 }}>
            <Grid item container rowSpacing={4}>
              {variantsSelected
                ? map(variantsSelected, (variant: AttributeVariant | any) => {
                    const {
                      SKU_code,
                      value,
                      batches = [],
                      batchesSelected = [],
                      sale_price,
                      total_inventory,
                      warehouse,
                      id: variantId,
                    } = variant;
                    const quantityBatchSelected = sumBy(batchesSelected, "quantity") || 0;
                    const quantity =
                      total_inventory +
                        (typeSheet === TypeWarehouseSheet.IMPORTS
                          ? quantityBatchSelected
                          : -quantityBatchSelected) || 0;
                    const batchesSelectedId = batchesSelected.map((item: BatchType) => item.id);

                    const newBatches: any = batches.reduce((prevArr: any, batch: BatchType) => {
                      const inventoryWarehouse =
                        find(
                          batch.inventory,
                          (item) => getObjectPropSafely(() => item?.warehouse?.id) === warehouse?.id
                        ) || {};

                      return !batchesSelectedId.includes(batch.id) &&
                        Object.values(inventoryWarehouse).length
                        ? [
                            ...prevArr,
                            {
                              ...batch,
                              label: batch.batch_name,
                              value: batch.id,
                              quantity: inventoryWarehouse.quantity || 0,
                            },
                          ]
                        : prevArr;
                    }, []);

                    return (
                      <Grid item container rowSpacing={3} key={SKU_code}>
                        <Grid item container xs={12} alignItems="center" columnSpacing={2}>
                          <Grid item xs={12} md={1}>
                            <ThumbImgStyle
                              src={getObjectPropSafely(() => variant?.image?.url) || logoIcon}
                            />
                          </Grid>
                          <Grid item container xs={12} md={9} spacing={1}>
                            <Grid item xs={12} md={12}>
                              <Controller
                                name="variantsSelected"
                                control={control}
                                render={() => (
                                  <Link
                                    underline="hover"
                                    variant="subtitle2"
                                    color="primary.main"
                                    sx={{ cursor: "pointer" }}
                                    href={`/${ROLE_TAB.PRODUCT}/${variantId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {value}
                                  </Link>
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Controller
                                name="variantsSelected"
                                control={control}
                                render={() => (
                                  <MTextLine
                                    label={<Typography variant="caption">SKU:</Typography>}
                                    value={SKU_code}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Controller
                                name="variantsSelected"
                                control={control}
                                render={() => (
                                  <MTextLine
                                    label={<Typography variant="caption"> SL hiện tại:</Typography>}
                                    value={total_inventory || 0}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Controller
                                name="variantsSelected"
                                control={control}
                                render={() => (
                                  <MTextLine
                                    label={<Typography variant="caption">Giá bán:</Typography>}
                                    value={fValueVnd(sale_price)}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Controller
                                name="variantsSelected"
                                control={control}
                                render={() => (
                                  <MTextLine
                                    label={
                                      <Typography variant="caption">
                                        SL sau khi{" "}
                                        {typeSheet === TypeWarehouseSheet.IMPORTS
                                          ? "nhập"
                                          : typeSheet === TypeWarehouseSheet.EXPORTS
                                          ? "xuất"
                                          : "chuyển"}
                                        :
                                      </Typography>
                                    }
                                    value={quantity || 0}
                                  />
                                )}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item container xs={12} direction="row" alignItems="center">
                          <Controller
                            name="variantsSelected"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <Grid container spacing={2}>
                                {typeSheet === TypeWarehouseSheet.TRANSFER ? (
                                  <Grid
                                    item
                                    container
                                    direction="row"
                                    alignItems="center"
                                    columnGap={2}
                                    sx={{ ml: 1 }}
                                  >
                                    <MultiSelect
                                      zIndex={1303}
                                      style={lotInputStyle}
                                      title="Chọn kho từ"
                                      size="medium"
                                      fullWidth
                                      selectorId="from_warehouse"
                                      options={dataWarehouse}
                                      onChange={(value) => {
                                        const newWarehouse = {
                                          ...find(dataWarehouse, (item) => item.value === value),
                                        };
                                        handleChooseWarehouse(
                                          { warehouse: newWarehouse },
                                          variant,
                                          field
                                        );
                                      }}
                                      defaultValue={getObjectPropSafely(() => variant.warehouse.id)}
                                      simpleSelect
                                    />
                                    <MultiSelect
                                      zIndex={1303}
                                      style={lotInputStyle}
                                      title="Chọn kho đến"
                                      size="medium"
                                      selectorId="to-warehouse"
                                      fullWidth
                                      error={!!error}
                                      helperText={error?.message}
                                      options={dataWarehouse}
                                      onChange={(value) => {
                                        const newWarehouse = {
                                          ...find(dataWarehouse, (item) => item.value === value),
                                        };
                                        handleChooseWarehouse(
                                          { toWarehouse: newWarehouse },
                                          variant,
                                          field
                                        );
                                      }}
                                      defaultValue={getObjectPropSafely(
                                        () => variant.toWarehouse.id
                                      )}
                                      simpleSelect
                                    />
                                  </Grid>
                                ) : (
                                  <Grid item container sx={{ ml: 1 }}>
                                    <MultiSelect
                                      zIndex={1303}
                                      style={lotInputStyle}
                                      title="Chọn kho"
                                      size="medium"
                                      fullWidth
                                      selectorId={`warehouse${variant.id}`}
                                      options={dataWarehouse}
                                      renderOptionTitleFunc={({ option }: any) => (
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                          <Typography>{option.label}</Typography>
                                          {option.is_default ? (
                                            <Span
                                              variant={
                                                theme.palette.mode === "light" ? "ghost" : "filled"
                                              }
                                              color="info"
                                            >
                                              Kho mặc định
                                            </Span>
                                          ) : null}
                                        </Stack>
                                      )}
                                      onChange={(value) => {
                                        const newWarehouse = {
                                          ...find(dataWarehouse, (item) => item.value === value),
                                        };
                                        handleChooseWarehouse(
                                          { warehouse: newWarehouse },
                                          variant,
                                          field
                                        );
                                      }}
                                      defaultValue={getObjectPropSafely(() => warehouse.id)}
                                      simpleSelect
                                    />
                                  </Grid>
                                )}
                                <Grid
                                  item
                                  container
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                  sx={{ ml: 1 }}
                                >
                                  {getObjectPropSafely(() => batchesSelected.length)
                                    ? map(batchesSelected, (batch: BatchType, index: number) => (
                                        <Chip
                                          key={index}
                                          label={`${batch.batch_name} ${
                                            batch.expiry_date ? "/ " + fDate(batch.expiry_date) : ""
                                          } / SL:${batch.quantity}`}
                                          onDelete={() => handleDeleteBatch(field, batch, variant)}
                                          onClick={() => handleChooseBatch(batch, variant)}
                                          size="small"
                                          style={lotChipStyle}
                                        />
                                      ))
                                    : null}
                                  <MultiSelect
                                    zIndex={1303}
                                    style={lotInputStyle}
                                    title="Chọn lô"
                                    size="medium"
                                    error={!!error && !batchesSelected.length}
                                    helperText={!batchesSelected.length ? error?.message : ""}
                                    options={newBatches}
                                    onChange={(value) => {
                                      const batch = {
                                        ...find(newBatches, (item) => item.value === value),
                                      };
                                      handleChooseBatch(batch, variant);
                                    }}
                                    defaultValue={""}
                                    renderOptionTitleFunc={({ option }) => {
                                      return (
                                        <Typography variant="body2">{`${option.label} (${
                                          option?.quantity || 0
                                        })`}</Typography>
                                      );
                                    }}
                                    simpleSelect
                                    selectorId="batch"
                                  />
                                  {typeSheet === TypeWarehouseSheet.IMPORTS ? (
                                    <MButton
                                      color="warning"
                                      onClick={() =>
                                        handleOpenPopup(titlePopupHandle.CREATE_BATCH, variant)
                                      }
                                      sx={{ mt: 2, ml: 1 }}
                                    >
                                      Thêm lô mới
                                    </MButton>
                                  ) : null}
                                </Grid>
                              </Grid>
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Divider flexItem sx={{ borderStyle: "dashed" }} />
                        </Grid>
                      </Grid>
                    );
                  })
                : null}
            </Grid>
          </Scrollbar>

          {!!getObjectPropSafely(() => variantsSelected.length) && (
            <Grid item container xs={12} sx={{ pt: 4 }}>
              <MTextLine
                label={
                  <Typography variant="body2">
                    Tổng số lượng khi{" "}
                    {typeSheet === TypeWarehouseSheet.IMPORTS
                      ? "nhập"
                      : typeSheet === TypeWarehouseSheet.EXPORTS
                      ? "xuất"
                      : "chuyển"}
                    :
                  </Typography>
                }
                value={totalQuantityAfterInput}
                valueStyle={{ fontSize: 20 }}
              />
            </Grid>
          )}
        </Card>
      )}
    </>
  );
};

export default AttachLot;

const lotInputStyle = { width: 250 };
const lotChipStyle = { marginTop: 20, marginRight: 8, marginLeft: 0 };

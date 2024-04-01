import { yupResolver } from "@hookform/resolvers/yup";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { orderApi } from "_apis_/order.api";
import { AttributeVariant, VARIANT_TYPE } from "_types_/ProductType";
// prettier-ignore
import { DISCOUNT_METHOD, PROMOTION_TYPE, ProductOrderType, PromotionStatus, PromotionType } from "_types_/PromotionType";
import vi from "locales/vi.json";
import FormDialog from "components/Dialogs/FormDialog";
import { LabelInfo, TextInfo, WrapperSection } from "components/Labels";
import { ProductList, ProductModal } from "components/ProductComponent";
import { MTextLine } from "components/Labels";
import { SearchField } from "components/Fields";
import { SX_PADDING_FORM_FULL_WIDTH_MODAL } from "constants/index";
import map from "lodash/map";
import unionBy from "lodash/unionBy";
import { memo, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { dispatch } from "store";
import { toastWarning } from "store/redux/toast/slice";
import { handleFormatPromotionBody, promotionSchema } from "views/PromotionView/constants";
import ActionPanel from "./ActionPanel";
import General from "./General";
import PromotionApplyVariants from "./PromotionApplyVariants";
import PromotionCondition from "./PromotionCondition";
import PromotionTypeRadio from "./PromotionTypeRadio";

let defaultStatus: PromotionStatus | undefined = undefined;

interface Props {
  onClose?: () => void;
  row?: Partial<PromotionType>;
  onApplyChanges: () => void;
  open: boolean;
  isPage?: boolean;
  tabName?: "INACTIVED" | "ACTIVED" | "DEACTIVED" | "ALL";
}

//=====================================

const PromotionDialog = ({ open, onClose, onApplyChanges, row, isPage }: Props) => {
  // prettier-ignore
  const { reset, watch, setValue, handleSubmit, getValues, clearErrors, formState: { errors } } = useForm<PromotionType>({
    resolver: yupResolver(promotionSchema),
  });

  const [loading, setLoading] = useState(false);

  // prettier-ignore
  const { name, type, discount_method, discount_amount, discount_percent, note, applied_variant, requirements, date_end, date_start, is_cumulative, combo_times, status, id } = watch();

  const [selectedProducts, setSelectedProducts] = useState<AttributeVariant[]>([]);
  const [searchProductText, setSearchProductText] = useState("");

  const handleCreatePromotion = async (
    form: Omit<Partial<PromotionType>, "applied_variant" | "available_variants"> & {
      applied_variant?: string;
      available_variants?: { variant: string; quantity: number }[];
    }
  ) => {
    setLoading(true);
    const result = await orderApi.create<PromotionType>({
      endpoint: "promotion/",
      params: form,
    });
    if (result.data) {
      onApplyChanges();
      onClose?.();
    }
    setLoading(false);
  };

  const handleUpdatePromotion = async (
    form: Omit<Partial<PromotionType>, "applied_variant" | "available_variants"> & {
      applied_variant?: string;
      available_variants?: { variant: string; quantity: number }[];
    }
  ) => {
    setLoading(true);
    const result = await orderApi.update<PromotionType>({
      endpoint: `promotion/${id}/`,
      params: form,
    });
    if (result.data) {
      onApplyChanges();
      onClose?.();
    }
    setLoading(false);
  };

  const handleChangeAmountCombo = (value: number) => {
    if (value < 0) {
      dispatch(toastWarning({ message: "Vui lòng nhập số sản phẩm giới hạn" }));
    } else {
      setValue("combo_times", value);
    }
  };

  const setProductSelectedToForm = useCallback(() => {
    const products: ProductOrderType[] = [];
    map(selectedProducts, (item) => {
      const { id, quantity } = item;
      if (item.selected) products.push({ id, quantity });
      return;
    });
    setValue("product_selected", products);
  }, [selectedProducts, setValue]);

  const handleDuplidate = () => {
    setValue("id", undefined);
    setValue("date_start", new Date().toString());
    reset({
      ...getValues(),
      id: undefined,
      date_start: new Date().toString(),
      date_end: undefined,
      status: "INACTIVED",
    });
  };

  const handleFormSubmit = (form: PromotionType) => {
    const body = handleFormatPromotionBody(form);
    id ? handleUpdatePromotion(body) : handleCreatePromotion(body);
  };

  // set product selected vào form
  useEffect(() => {
    setProductSelectedToForm();
  }, [setProductSelectedToForm]);

  const lineItemError = errors.product_selected as { message: string } | undefined;

  //Update product default selected khi mở order modal
  useEffect(() => {
    if (open && row?.available_variants) {
      const productSelected =
        map(row.available_variants, (item) => {
          const { quantity } = item;
          return {
            ...item.variant,
            quantity: quantity,
            selected: true,
          };
        }) || [];
      setSelectedProducts(productSelected);
    }
  }, [open, row?.available_variants]);

  useEffect(() => {
    if (open && row?.status) {
      defaultStatus = row.status;
    } else {
      defaultStatus = undefined;
    }
  }, [open, row?.status]);

  useEffect(() => {
    clearErrors();
    if (open && row) {
      const { discount_amount, discount_percent = 0, applied_variant = {}, note = "" } = row;
      const initForm: Partial<PromotionType> = {
        ...row,
        discount_amount: discount_amount || 0,
        discount_percent: discount_percent || 0,
        applied_variant,
        note,
      };
      reset(initForm);
    } else {
      reset({});
    }
  }, [open, row, clearErrors, reset]);

  const rowID = id;
  const disabledStyles: React.CSSProperties = { pointerEvents: rowID ? "none" : "auto" };

  return (
    <FormDialog
      maxWidth="md"
      fullScreen
      title={vi.promotion.promotion}
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(handleFormSubmit)}
      buttonText={id ? vi.button.update : vi.button.add}
      isLoadingButton={loading}
      transition
      component="div"
    >
      <Grid container spacing={2} px={isPage ? "unset" : SX_PADDING_FORM_FULL_WIDTH_MODAL}>
        {id && (
          <Grid xs={12} item>
            <ActionPanel duplidateAction={handleDuplidate} />
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={8}>
          <WrapperSection title="Thông tin chi tiết">
            <Stack direction="column" spacing={2}>
              {!!rowID ? (
                <MTextLine
                  displayType="grid"
                  xsLabel={3}
                  xsValue={9}
                  label={<LabelInfo>{`${vi.promotion_name}:`}</LabelInfo>}
                  value={<TextInfo>{name}</TextInfo>}
                />
              ) : (
                <Box>
                  <LabelInfo sx={{ mb: 1 }}>{vi.promotion_name}</LabelInfo>
                  <TextField
                    disabled={!!rowID}
                    defaultValue={name || ""}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    onBlur={(e) => setValue("name", e.target.value)}
                    fullWidth
                    placeholder="Nhập tên khuyến mãi"
                    required
                    autoFocus={!rowID}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Box>
              )}

              {/* đối tượng khuyến mãi */}
              <PromotionTypeRadio
                errors={errors}
                onChangeRequirement={(value) => setValue("requirements", value)}
                onChangeType={(value) => setValue("type", value)}
                type={type}
                rowID={rowID}
              />

              {/* sản phẩm áp dụng */}
              <PromotionApplyVariants
                errors={errors}
                onChangeApplyVariant={(value) => setValue("applied_variant", value)}
                type={type}
                applied_variant={applied_variant}
                rowID={rowID}
              />

              {/* yêu cầu chi tiêu tối thiểu */}
              <PromotionCondition
                errors={errors}
                onChangeDiscountAmount={(value) => setValue("discount_amount", value)}
                onChangeComboTimes={handleChangeAmountCombo}
                onChangeDiscountMethod={(value) => setValue("discount_method", value)}
                onChangeDiscountPercent={(value) => setValue("discount_percent", value)}
                onChangeRequirement={(value) => setValue("requirements", value)}
                type={type}
                requirements={requirements}
                discount_amount={discount_amount}
                discount_method={discount_method}
                discount_percent={discount_percent}
                combo_times={combo_times}
                rowID={rowID}
              />

              {/* chọn sản phẩm khuyến mãi */}
              {discount_method === DISCOUNT_METHOD.COMBO && type === PROMOTION_TYPE.VARIANT && (
                <Grid item xs={12} style={{ paddingTop: 0 }}>
                  {!!rowID ? (
                    <MTextLine
                      displayType="grid"
                      xsLabel={3}
                      xsValue={9}
                      label={<LabelInfo>{"Sản phẩm tặng:"}</LabelInfo>}
                      value={
                        <ProductList
                          selectedProducts={selectedProducts}
                          setSelectedProducts={setSelectedProducts}
                          error={errors.product_selected}
                          disabled={!!rowID}
                          isUpdate={false}
                          listProductSx={{
                            overflow: "auto",
                            maxHeight: "calc(100vh - 270px)",
                          }}
                          hiddenColumns={["quantity", "total", "cross_sale"]}
                          isDelete={false}
                        />
                      }
                    />
                  ) : (
                    <>
                      <SearchField
                        onSearch={(value) => setSearchProductText(value)}
                        defaultValue={searchProductText}
                        fullWidth
                        renderIcon={<SearchIcon />}
                        placeholder="Nhập tên, sku sản phẩm"
                        error={!!lineItemError?.message}
                        helperText={lineItemError?.message}
                        style={{ marginBottom: 8, ...disabledStyles }}
                      />
                      <ProductList
                        selectedProducts={selectedProducts}
                        setSelectedProducts={setSelectedProducts}
                        error={errors.product_selected}
                        disabled={!!rowID}
                        isUpdate={false}
                        listProductSx={{
                          overflow: "auto",
                          maxHeight: "calc(100vh - 270px)",
                        }}
                        hiddenColumns={["cross_sale", "price", "quantity"]}
                      />
                      <ProductModal
                        setSearchProductText={setSearchProductText}
                        setSelectedProduct={(values) =>
                          setSelectedProducts(unionBy([...selectedProducts, ...values], "id"))
                        }
                        searchDefault={searchProductText}
                        params={{ variant_type: VARIANT_TYPE.SIMPLE }}
                      />
                    </>
                  )}
                </Grid>
              )}
            </Stack>
          </WrapperSection>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <WrapperSection title="Thông tin chung">
            <General
              errors={errors}
              onChangeActive={(value) => setValue("status", value)}
              onChangeCumulative={(value) => setValue("is_cumulative", value)}
              onChangeDateEnd={(value) => setValue("date_end", value)}
              onChangeDateStart={(value) => {
                setValue("date_start", value);
              }}
              onChangeNote={(value) => setValue("note", value.trim())}
              is_cumulative={is_cumulative}
              note={note}
              date_end={date_end}
              date_start={date_start}
              type={type}
              status={status}
              rowID={rowID}
              defaultStatus={defaultStatus}
            />
          </WrapperSection>
        </Grid>
      </Grid>
    </FormDialog>
  );
};

export default memo(PromotionDialog);

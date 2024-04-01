// Libraries
import { useEffect } from "react";
import { Controller, ControllerRenderProps, UseFormReturn } from "react-hook-form";
import map from "lodash/map";
import reduce from "lodash/reduce";
import find from "lodash/find";
import sumBy from "lodash/sumBy";

// Components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Scrollbar from "components/Scrolls/Scrollbar";
import { SearchVariant, ProductItem } from "components/ProductComponent";
import { InputNumber } from "components/Fields";

// @Types
import { FormValuesProps } from "components/Popups/FormPopup";
import { AttributeVariant, VARIANT_TYPE } from "_types_/ProductType";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { fNumber } from "utils/formatNumber";

// ----------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {
  isEdit?: boolean;
}

const VariantSelected = ({
  variant,
  handleChangeVariant,
  isDisableQuantity = false,
}: {
  variant: AttributeVariant;
  isDisableQuantity?: boolean;
  handleChangeVariant: (variant: AttributeVariant) => void;
}) => {
  const convertValueVnd = (value: string) => {
    return value.replace(/,/gi, "");
  };

  return (
    <Grid item container alignItems="center" lg={12} xs={12} sm={12} spacing={2}>
      <Grid item container lg={7} xs={7} sm={7}>
        <ProductItem
          product={variant}
          isShowActualInventory
          hiddenColumns={["quantity", "price", "cross_sale", "total", "listed_price"]}
          isShowStatus
          isShowBundle={false}
        />
      </Grid>
      <Grid item container xs={2} sm={2} lg={2}>
        <TextField
          value={fNumber(variant.neo_price)}
          onChange={(event) =>
            handleChangeVariant({
              ...variant,
              neo_price: +convertValueVnd(event.target.value),
            })
          }
          fullWidth
          label="Giá niêm yết"
          placeholder="0 đ"
          InputProps={{
            endAdornment: <InputAdornment position="end">vnd</InputAdornment>,
          }}
          sx={{ mt: 1 }}
          disabled
        />
      </Grid>
      <Grid item container xs={2} sm={2} lg={2}>
        <TextField
          value={fNumber(variant.sale_price)}
          onChange={(event) =>
            handleChangeVariant({
              ...variant,
              sale_price: +convertValueVnd(event.target.value),
            })
          }
          fullWidth
          label="Giá bán"
          placeholder="0 đ"
          InputProps={{
            endAdornment: <InputAdornment position="end">vnd</InputAdornment>,
          }}
          sx={{ mt: 1 }}
          disabled
        />
      </Grid>
      <Grid item container lg={1} xs={1} sm={1}>
        <Box>
          <InputNumber
            disabled={isDisableQuantity}
            value={variant.quantity}
            minQuantity={1}
            onChange={(value = 0) => {
              handleChangeVariant({ ...variant, quantity: value });
            }}
            containerStyles={{
              minWidth: "70px",
              maxWidth: "120px",
              paddingTop: 1.5,
              paddingBottom: 1.5,
              mt: 0.5,
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

const ComboVariant = ({ control, isEdit, watch, setValue }: Props) => {
  const { bundle_variants } = watch();

  useEffect(() => {
    if (bundle_variants.length) {
      setValue(
        "sale_price",
        sumBy(
          bundle_variants,
          (item: AttributeVariant) => +(item?.sale_price || 0) * +(item?.quantity || 0)
        )
      );

      setValue(
        "neo_price",
        sumBy(
          bundle_variants,
          (item: AttributeVariant) => +(item?.neo_price || 0) * +(item?.quantity || 0)
        )
      );
    }
  }, [bundle_variants]);

  const changeVariant = (
    field: ControllerRenderProps<FormValuesProps, "bundle_variants">,
    variant: AttributeVariant
  ) => {
    const { value, onChange } = field;
    const newBundleVariants = reduce(
      value,
      (prevArr, current) => {
        return current.id === variant.id
          ? [
              ...prevArr,
              {
                ...current,
                ...variant,
              },
            ]
          : [...prevArr, current];
      },
      []
    );

    onChange(newBundleVariants);
  };

  const handleSelectVariant = (
    field: ControllerRenderProps<FormValuesProps, "bundle_variants">,
    arrValue: AttributeVariant[]
  ) => {
    const { value, onChange } = field;
    const newBundleVariants = reduce(
      arrValue,
      (prevArr, current) => {
        const oldVariant = find(value, (item) => item.id === current.id) || {};

        return [
          ...prevArr,
          {
            ...current,
            quantity: oldVariant.quantity || 1,
            sale_price: oldVariant.sale_price || current.sale_price,
            neo_price: oldVariant.neo_price || current.neo_price,
          },
        ];
      },
      []
    );

    onChange(newBundleVariants);
  };

  return (
    <Grid item container xs={12}>
      <Grid item container xs={12} sx={{ mb: 2 }}>
        <Typography variant="body2">Chọn sản phẩm cho combo:</Typography>
      </Grid>
      <Grid item container xs={12}>
        <Controller
          name="bundle_variants"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <>
                <Grid item container lg={12} xs={12} sm={12}>
                  <SearchVariant
                    value={field.value}
                    isDisabled={isEdit}
                    isMultiple
                    limitTags={3}
                    placeholder="Tìm kiếm tên sản phẩm"
                    message={error?.message}
                    params={{ variant_type: VARIANT_TYPE.SIMPLE }}
                    handleSelectVariant={(variants) => handleSelectVariant(field, variants)}
                  />
                </Grid>
                {getObjectPropSafely(() => field.value.length) ? (
                  <Grid item container lg={12} xs={12} sm={12}>
                    <Scrollbar sx={{ my: 3, maxHeight: 400 }}>
                      <Grid item container lg={12} xs={12} sm={12} spacing={1}>
                        {map(field.value, (item) => (
                          <VariantSelected
                            variant={item}
                            handleChangeVariant={(variant: AttributeVariant) =>
                              changeVariant(field, variant)
                            }
                            isDisableQuantity={isEdit}
                          />
                        ))}
                      </Grid>
                    </Scrollbar>
                  </Grid>
                ) : null}
              </>
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ComboVariant;

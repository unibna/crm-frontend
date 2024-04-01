//types
import { FieldErrors } from "react-hook-form";
import { PromotionType, PROMOTION_TYPE } from "_types_/PromotionType";

//components
import Grid from "@mui/material/Grid";
import ProductAutocomplete from "./ProductAutocomplete";
import { MTextLine } from "components/Labels";
import { ProductItem } from "components/ProductComponent";
import { LabelInfo } from "components/Labels";

//utils
import vi from "locales/vi.json";
import { AttributeVariant } from "_types_/ProductType";

interface Props {
  errors: FieldErrors<PromotionType>;
  onChangeApplyVariant: (value: Partial<AttributeVariant>) => void;
  type?: PROMOTION_TYPE;
  applied_variant?: AttributeVariant;
  rowID?: string | number;
}

const PromotionApplyVariants = ({
  errors,
  onChangeApplyVariant,
  type,
  applied_variant,
  rowID,
}: Props) => {
  return type === PROMOTION_TYPE.VARIANT ? (
    <Grid item xs={12}>
      {!!rowID ? (
        <MTextLine
          xsLabel={3}
          xsValue={9}
          displayType="grid"
          label={<LabelInfo> {`${vi.promotion_apply_variant}:`}</LabelInfo>}
          value={
            applied_variant?.id && (
              <ProductItem
                index={0}
                product={{ ...applied_variant, selected: true }}
                disabled={true}
                isShowActualInventory
                hiddenColumns={["quantity", "total", "cross_sale"]}
              />
            )
          }
        />
      ) : (
        <>
          <LabelInfo sx={{ mb: 2 }}> {vi.promotion_apply_variant}</LabelInfo>

          <ProductAutocomplete
            onSelected={(vr) => {
              onChangeApplyVariant(vr);
            }}
            error={!!errors.applied_variant?.id?.message}
            helperText={errors.applied_variant?.id?.message}
            required
            autoFocus
            defaultValue=""
            params={{}}
            disabled={!!rowID}
            size="small"
            placeholder="Nhập tên sản phẩm"
            label={"Tìm kiếm sản phẩm"}
          />

          {applied_variant?.id && (
            <ProductItem
              index={0}
              product={{ ...applied_variant, selected: true }}
              disabled={!!rowID}
              isShowActualInventory={false}
              hiddenColumns={["quantity", "total", "cross_sale"]}
              bundleHiddenColumns={["quantity", "listed_price", "cross_sale", "total", "price"]}
            />
          )}
        </>
      )}
    </Grid>
  ) : null;
};

export default PromotionApplyVariants;

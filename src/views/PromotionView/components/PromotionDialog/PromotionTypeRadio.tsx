//types
import { FieldErrors } from "react-hook-form";
import { PromotionRequireType, PromotionType, PROMOTION_TYPE } from "_types_/PromotionType";

//utils
import vi from "locales/vi.json";

//components
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import React, { memo } from "react";
import { REQUIREMENT_DEFAULT } from "../PromotionContainer";
import { FormControlLabelStyled, LabelInfo, TextInfo } from "components/Labels";
import { MTextLine } from "components/Labels";

interface Props {
  errors: FieldErrors<PromotionType>;
  onChangeType: (value: PROMOTION_TYPE) => void;
  onChangeRequirement: (requires: PromotionRequireType[]) => void;
  type?: PROMOTION_TYPE;
  style?: React.CSSProperties;
  rowID?: string | number;
}

const PromotionTypeRadio = memo(
  ({ errors, type, onChangeRequirement, onChangeType, style, rowID }: Props) => {
    return !!rowID ? (
      <MTextLine
        displayType="grid"
        xsLabel={3}
        xsValue={9}
        label={<LabelInfo>{`${vi.promotion_type}:`}</LabelInfo>}
        value={
          <TextInfo sx={{ textTransform: "uppercase" }}>
            {type === PROMOTION_TYPE.ORDER ? "Đơn hàng" : "Sản phẩm"}
          </TextInfo>
        }
      />
    ) : (
      <Grid
        item
        xs={12}
        style={{ ...formControlLayoutStyle, ...style, pointerEvents: !!rowID ? "none" : "auto" }}
      >
        <FormControl error={!!errors.type?.message}>
          <LabelInfo> {vi.promotion_type}</LabelInfo>
          <RadioGroup
            aria-labelledby="demo-radio-shipping-mode"
            name="radio-buttons-group"
            value={type || null}
            row
            onChange={(e, value) => {
              onChangeType(e.target.value as PROMOTION_TYPE);
              onChangeRequirement(REQUIREMENT_DEFAULT);
            }}
          >
            <FormControlLabelStyled
              value={PROMOTION_TYPE.ORDER}
              control={<Radio />}
              label="Đơn hàng"
            />
            <FormControlLabelStyled
              value={PROMOTION_TYPE.VARIANT}
              control={<Radio />}
              label="Sản phẩm"
            />
          </RadioGroup>
          <FormHelperText>{errors.type?.message}</FormHelperText>
        </FormControl>
      </Grid>
    );
  }
);

export default PromotionTypeRadio;

const formControlLayoutStyle = { paddingTop: 12 };

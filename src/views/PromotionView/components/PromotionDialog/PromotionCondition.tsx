//types
import { FieldErrors } from "react-hook-form";
import {
  DISCOUNT_METHOD,
  PromotionRequireType,
  PromotionType,
  PROMOTION_TYPE,
} from "_types_/PromotionType";

//utils
import vi from "locales/vi.json";
import { QUANTITY_MAX, QUANTITY_MIN, TOTAL_BILL, TOTAL_MAX } from "../PromotionContainer";
import { dispatch } from "store";
import { toastWarning } from "store/redux/toast/slice";
import { VND } from "constants/index";
import { fValueVnd } from "utils/formatNumber";

//components
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { MTextLine } from "components/Labels";
import { CommasField } from "components/Fields";
import InputAdornment from "@mui/material/InputAdornment";
import Fade from "@mui/material/Fade";
import { FormControlLabelStyled, LabelInfo, TextInfo } from "components/Labels";
import FloatNumberField from "./FloatNumberField";
import { Fragment } from "react";

interface Props {
  errors: FieldErrors<PromotionType>;
  onChangeRequirement: (requires: PromotionRequireType[]) => void;
  onChangeDiscountMethod: (value: DISCOUNT_METHOD) => void;
  onChangeDiscountAmount: (value: number) => void;
  onChangeDiscountPercent: (value: number) => void;
  onChangeComboTimes: (value: number) => void;
  discount_percent?: number;
  discount_method?: DISCOUNT_METHOD;
  discount_amount?: number;
  requirements?: PromotionRequireType[];
  combo_times: number;
  type?: PROMOTION_TYPE;
  rowID?: string | number;
}

const PromotionCondition = ({
  errors,
  onChangeDiscountAmount,
  onChangeDiscountMethod,
  onChangeRequirement,
  onChangeDiscountPercent,
  onChangeComboTimes,
  type,
  requirements,
  discount_amount,
  discount_method,
  discount_percent,
  combo_times,
  rowID,
}: Props) => {
  const handleChangePercent = (e: any) => {
    let percentNumber = e.target.value;
    if (percentNumber < 0) {
      percentNumber = 0;
    } else if (percentNumber > 100) {
      dispatch(toastWarning({ message: "Vui lòng nhập giá trị nhỏ hơn hoặc bằng 100" }));
      percentNumber = 0;
    }
    onChangeDiscountPercent(percentNumber || 0);
  };

  const handleChangeOrderRequire = (value: any) => {
    onChangeRequirement([
      {
        requirement: value || undefined,
        requirement_type: TOTAL_BILL.requirement_type,
      },
      {
        requirement: requirements?.[1].requirement || 0,
        requirement_type: QUANTITY_MIN.requirement_type,
      },
      {
        requirement: requirements?.[2].requirement || 0,
        limit_type: TOTAL_MAX.limit_type,
      },
      QUANTITY_MAX,
    ]);
  };

  const handleChangeVariantRequire = (value: any) => {
    onChangeRequirement([
      {
        requirement: requirements?.[0]?.requirement || 0,
        requirement_type: TOTAL_BILL.requirement_type,
      },
      {
        requirement: value || undefined,
        requirement_type: QUANTITY_MIN.requirement_type,
      },
      {
        requirement: requirements?.[2].requirement || 0,
        limit_type: TOTAL_MAX.limit_type,
      },
      QUANTITY_MAX,
    ]);
  };

  const handleChangeDiscountPercentRequire = (value: any) => {
    onChangeRequirement([
      {
        requirement: requirements?.[0]?.requirement || 0,
        requirement_type: TOTAL_BILL.requirement_type,
      },
      {
        requirement: requirements?.[1].requirement || 0,
        requirement_type: QUANTITY_MIN.requirement_type,
      },
      {
        limit: value || undefined,
        limit_type: TOTAL_MAX.limit_type,
      },
      QUANTITY_MAX,
    ]);
  };

  const promotionTypes = [
    {
      value: DISCOUNT_METHOD.AMOUNT,
      label: "Số tiền",
      content: (
        <MTextLine
          label="Số tiền:"
          value={
            <CommasField
              fullWidth
              styles={{ maxWidth: "340px" }}
              unit={100000}
              autoFocus={false}
              variant="outlined"
              value={discount_amount || 0}
              error={!!errors.discount_amount?.message}
              helperText={errors.discount_amount?.message}
              onChange={(value: number) => onChangeDiscountAmount(value)}
              onBlur={(value: number) => onChangeDiscountAmount(value || 0)}
              disabled={discount_method !== DISCOUNT_METHOD.AMOUNT || !!rowID}
              InputProps={{
                startAdornment: <InputAdornment position="start">{VND}</InputAdornment>,
              }}
            />
          }
        />
      ),
    },
    {
      value: DISCOUNT_METHOD.PERCENTAGE,
      label: "Phần trăm",
      content: (
        <Stack direction="column" spacing={1}>
          <MTextLine
            displayType="grid"
            label="Phần trăm:"
            value={
              <FloatNumberField
                fullWidth
                styles={{ maxWidth: "340px" }}
                size="small"
                value={discount_percent}
                error={!!errors.discount_percent}
                disabled={discount_method !== DISCOUNT_METHOD.PERCENTAGE || !!rowID}
                helperText={errors.discount_percent?.message}
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                  startAdornment: <InputAdornment position="start">%</InputAdornment>,
                }}
                onChange={handleChangePercent}
              />
            }
          />

          <MTextLine
            displayType="grid"
            label="Giảm tối đa:"
            value={
              <CommasField
                fullWidth
                styles={{ maxWidth: "340px" }}
                autoFocus={false}
                disabled={discount_method !== DISCOUNT_METHOD.PERCENTAGE || !!rowID}
                value={requirements?.[2]?.limit}
                error={!!errors.requirements?.[2]?.limit?.message}
                helperText={errors.requirements?.[2]?.limit?.message}
                onBlur={handleChangeDiscountPercentRequire}
                onChange={handleChangeDiscountPercentRequire}
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start">{VND}</InputAdornment>,
                }}
                unit={100000}
              />
            }
          />
        </Stack>
      ),
    },
    {
      value: DISCOUNT_METHOD.COMBO,
      label: "Combo",
      content: (
        <MTextLine
          label="SL tối đa trong combo:"
          value={
            <CommasField
              fullWidth
              styles={{ maxWidth: "340px" }}
              autoFocus={false}
              disabled={!(discount_method === DISCOUNT_METHOD.COMBO) || !!rowID}
              value={combo_times}
              error={!!errors.combo_times?.message}
              helperText={errors.combo_times?.message}
              onBlur={(value: number) => onChangeComboTimes(value)}
              onChange={(value: number) => onChangeComboTimes(value)}
              variant="outlined"
              label="Giới hạn sản phẩm tặng"
            />
          }
        />
      ),
    },
  ];

  return (
    <Grid item xs={12} pt={0}>
      {!!rowID ? (
        <MTextLine
          displayType="grid"
          xsLabel={3}
          xsValue={9}
          label={<LabelInfo>{vi.require_spent}:</LabelInfo>}
          value={
            <TextInfo>
              {type === PROMOTION_TYPE.ORDER
                ? `Đơn hàng tối thiểu ${fValueVnd(requirements?.[0]?.requirement || 0)}`
                : `Tối thiểu ${requirements?.[1].requirement || 0} sản phẩm`}
            </TextInfo>
          }
        />
      ) : (
        <>
          <FormControl
            style={{ ...formControlLabel, marginTop: type === PROMOTION_TYPE.ORDER ? 0 : 12 }}
          >
            <LabelInfo>{vi.require_spent}</LabelInfo>
            <Grid container spacing={1} style={formControlLayoutStyle}>
              {type === PROMOTION_TYPE.ORDER ? (
                <Grid item xs={12} sm={6}>
                  <MTextLine
                    label={`${vi.minimum_spent}:`}
                    value={
                      <CommasField
                        autoFocus={false}
                        disabled={!!rowID}
                        value={requirements?.[0]?.requirement}
                        error={!!errors.requirements?.[0]?.requirement?.message}
                        helperText={errors.requirements?.[0]?.requirement?.message}
                        onBlur={handleChangeOrderRequire}
                        onChange={handleChangeOrderRequire}
                        unit={100000}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">{VND}</InputAdornment>,
                        }}
                      />
                    }
                  />
                </Grid>
              ) : (
                <Grid item xs={12} sm={6}>
                  <MTextLine
                    label={`${vi.product_minimum_amount}:`}
                    value={
                      <CommasField
                        autoFocus={false}
                        disabled={!!rowID}
                        value={requirements?.[1].requirement}
                        error={!!errors.requirements?.[1].requirement?.message}
                        helperText={errors.requirements?.[1].requirement?.message}
                        onBlur={handleChangeVariantRequire}
                        onChange={handleChangeVariantRequire}
                        variant="outlined"
                      />
                    }
                  />
                </Grid>
              )}
            </Grid>
          </FormControl>
        </>
      )}
      {/* loại khuyến mãi */}
      <Grid item xs={12} style={formControlLayoutStyle}>
        {!!rowID ? (
          <MTextLine
            displayType="grid"
            xsLabel={3}
            xsValue={9}
            label={<LabelInfo>{"Khuyến mãi:"}</LabelInfo>}
            value={
              <TextInfo>
                {discount_method === DISCOUNT_METHOD.COMBO &&
                  `${DISCOUNT_METHOD.COMBO} (Tối đa ${combo_times} sản phẩm)`}
                {discount_method === DISCOUNT_METHOD.AMOUNT && fValueVnd(discount_amount || 0)}
                {discount_method === DISCOUNT_METHOD.PERCENTAGE &&
                  `${discount_percent}% (Tối đa: ${fValueVnd(requirements?.[2]?.limit || 0)})`}
              </TextInfo>
            }
          />
        ) : (
          <FormControl error={!!errors.type?.message} style={formControlStyle}>
            <LabelInfo>{vi.promotion_by}</LabelInfo>
            <RadioGroup
              aria-labelledby="demo-radio-promotion-type"
              name="radio-buttons-promotion-type"
              value={discount_method || null}
              onChange={(e, value) => onChangeDiscountMethod(value as DISCOUNT_METHOD)}
              style={{ pointerEvents: !!rowID ? "none" : "auto" }}
            >
              {promotionTypes.map((item) => {
                if (type !== PROMOTION_TYPE.VARIANT && item.value === DISCOUNT_METHOD.COMBO)
                  return null;
                return (
                  <Fragment key={item.value}>
                    <FormControlLabelStyled
                      value={item.value}
                      control={<Radio />}
                      label={item.label}
                    />
                    {discount_method === item.value && (
                      <Fade in={Boolean(discount_method === item.value)}>
                        <Grid>{item.content}</Grid>
                      </Fade>
                    )}
                  </Fragment>
                );
              })}
            </RadioGroup>
            <FormHelperText>{errors.type?.message}</FormHelperText>
          </FormControl>
        )}
      </Grid>
    </Grid>
  );
};

export default PromotionCondition;

const formControlLayoutStyle = { paddingTop: 12 };

const formControlLabel = { fontSize: 13, width: "100%", marginTop: 12 };

const formControlStyle = { width: "100%" };

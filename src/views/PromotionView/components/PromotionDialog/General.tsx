//types
import { FieldErrors } from "react-hook-form";
import { PromotionStatus, PromotionType, PROMOTION_TYPE } from "_types_/PromotionType";

//components
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import MDatePicker from "components/Pickers/MDatePicker";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import { FormControlLabelStyled, LabelInfo, TextInfo } from "components/Labels";
import Stack from "@mui/material/Stack";
import { MTextLine } from "components/Labels";

//utiles
import { PROMOTION_ACTIVE_LIST } from "views/PromotionView/constants";
import { fDate } from "utils/dateUtil";
import { dd_MM_yyyy } from "constants/time";

interface Props {
  errors: FieldErrors<PromotionType>;
  onChangeActive: (value: PromotionStatus) => void;
  onChangeNote: (value: string) => void;
  onChangeDateStart: (value: string) => void;
  onChangeDateEnd: (value: string) => void;
  onChangeCumulative: (value: boolean) => void;
  is_cumulative?: boolean;
  note?: string;
  date_end?: string;
  date_start?: string;
  type: PROMOTION_TYPE;
  rowID?: string;
  status?: PromotionStatus;
  defaultStatus?: PromotionStatus;
}

const General = ({
  errors,
  onChangeActive,
  is_cumulative,
  note,
  date_end,
  date_start,
  type,
  onChangeDateEnd,
  onChangeDateStart,
  onChangeNote,
  onChangeCumulative,
  rowID,
  status = "INACTIVED",
  defaultStatus,
}: Props) => {
  return (
    <Stack direction="column" spacing={1.5}>
      {/* {type === PROMOTION_TYPE.ORDER && (
        <FormControlLabel
          onChange={(e, checked) => onChangeCumulative(!checked)}
          control={<Checkbox color="primary" checked={!is_cumulative} />}
          label="Không áp dụng đồng thời"
        />
      )} */}
      <FormControl>
        <LabelInfo>Trạng thái</LabelInfo>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-status-promotion"
          name="radio-buttons-group-status-promotion"
          value={status}
          onChange={(e, value) => onChangeActive(value as PromotionStatus)}
        >
          {PROMOTION_ACTIVE_LIST.map((item: any) => (
            <FormControlLabelStyled
              key={item.value}
              value={item.value}
              label={item.label}
              control={<Radio />}
              disabled={item?.checkDisabled(defaultStatus) || false}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <FormControl error={!!errors.date_start?.message} style={formControlStyle}>
        <LabelInfo>Nội dung khuyến mãi</LabelInfo>
        <TextField
          required
          placeholder="Nội dung khuyến mãi"
          fullWidth
          defaultValue={note || ""}
          multiline
          minRows={2}
          onBlur={(e) => onChangeNote(e.target.value)}
          error={!!errors.note}
          helperText={errors.note?.message}
          sx={{ mt: 1 }}
        />
      </FormControl>
      <Box>
        <LabelInfo>Thời gian áp dụng</LabelInfo>
        {!!rowID ? (
          <Stack direction="column" spacing={1} sx={{ mt: 1 }}>
            <MTextLine label="Từ:" value={<TextInfo>{fDate(date_start)}</TextInfo>} />
            <MTextLine
              label="Đến:"
              value={
                <FormControl error={!!errors.type?.message} style={{ maxWidth: "240px" }}>
                  <MDatePicker
                    onChangeDate={onChangeDateEnd}
                    inputFormat={dd_MM_yyyy}
                    value={date_end}
                    fullWidth
                    disablePast={!rowID}
                  />
                </FormControl>
              }
            />
          </Stack>
        ) : (
          <Stack
            direction="row"
            spacing={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 1 }}
          >
            <FormControl error={!!errors.date_start?.message} style={formControlStyle}>
              <MDatePicker
                value={date_start}
                onChangeDate={onChangeDateStart}
                fullWidth
                disablePast={!rowID}
                inputFormat={dd_MM_yyyy}
                disabled={!!rowID}
              />
            </FormControl>
            <span>-</span>
            <FormControl error={!!errors.type?.message} style={formControlStyle}>
              <MDatePicker
                onChangeDate={onChangeDateEnd}
                inputFormat={dd_MM_yyyy}
                value={date_end}
                fullWidth
                disablePast={!rowID}
              />
            </FormControl>
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default General;

const formControlStyle = { width: "100%" };

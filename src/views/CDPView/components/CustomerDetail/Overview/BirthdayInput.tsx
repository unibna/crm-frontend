import vi from "locales/vi.json";
import { SxProps } from "@mui/material/styles";
import MDatePicker from "components/Pickers/MDatePicker";
import { Theme } from "@mui/material";
import { MTextLine } from "components/Labels";
import { dd_MM_yyyy } from "constants/time";

const BirthdayInput = ({
  value,
  onChangeDate,
  sx,
  disabled,
}: {
  value?: string | null;
  onChangeDate: (newValue: any) => void;
  sx?: SxProps<Theme>;
  disabled?: boolean;
}) => {
  return (
    <MTextLine
      containerStyle={sx}
      label={`${vi.birthday}:`}
      value={
        <MDatePicker
          disableFuture
          fullWidth
          value={value}
          inputFormat={dd_MM_yyyy}
          onChangeDate={onChangeDate}
          disabled={disabled}
        />
      }
      displayType="grid"
    />
  );
};

export default BirthdayInput;

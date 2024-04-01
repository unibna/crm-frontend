import TextField, { TextFieldProps } from "@mui/material/TextField";
import { Theme } from "@mui/material";
import { SxProps } from "@mui/material";
import vi from "locales/vi.json";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import { MTextLine } from "components/Labels";
import { ROLE_TAB, STATUS_ROLE_CDP } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import { isReadAndWriteRole } from "utils/roleUtils";
import { isVietnamesePhoneNumber } from "utils/stringsUtil";

const SecondPhoneInput = ({
  secondPhone = "",
  setSecondPhone,
  sx,
  ...props
}: {
  secondPhone?: string;
  setSecondPhone: (value?: string) => void;
  sx?: SxProps<Theme>;
} & Partial<TextFieldProps>) => {
  const { user } = useAuth();

  const isModifySecondPhone = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.PHONE]
  );

  return (
    <MTextLine
      label={`${vi.second_phone}:`}
      containerStyle={sx}
      value={
        <TextField
          value={secondPhone || ""}
          onChange={(e) => setSecondPhone(e.target.value)}
          fullWidth
          size="small"
          error={secondPhone ? !isVietnamesePhoneNumber(secondPhone) : false}
          helperText={
            secondPhone && !isVietnamesePhoneNumber(secondPhone)
              ? VALIDATION_MESSAGE.FORMAT_PHONE
              : ""
          }
          disabled={!isModifySecondPhone}
          {...props}
        />
      }
      displayType="grid"
    />
  );
};

export default SecondPhoneInput;

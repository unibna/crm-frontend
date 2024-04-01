import Stack from "@mui/material/Stack";
import { TypeNotification, dataFilterTypeAutomatic } from "views/ZaloView/constants";
import { Span, MTextLine } from "components/Labels";
import { useTheme } from "@mui/material";

const ZaloCard = ({
  type,
  is_success,
  reason_error,
}: {
  type?: TypeNotification;
  is_success?: boolean;
  reason_error?: string;
}) => {
  const theme = useTheme();

  const directType = dataFilterTypeAutomatic.find((item) => item.value === type);

  return (
    <Stack spacing={0.5}>
      {directType && (
        <Span
          variant={theme.palette.mode === "light" ? "ghost" : "filled"}
          color={(is_success && "success") || "error"}
          style={{ width: "fit-content" }}
        >
          {is_success ? "Thành công" : "Thất bại"}
        </Span>
      )}
      {directType && (
        <Span
          variant={theme.palette.mode === "light" ? "ghost" : "filled"}
          color={(type === TypeNotification.ORN && "warning") || "info"}
        >
          {dataFilterTypeAutomatic.find((item) => item.value === type)?.label}
        </Span>
      )}
      {reason_error && <MTextLine label="Lý do:" value={reason_error} />}
    </Stack>
  );
};

export default ZaloCard;

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { AttributeType } from "_types_/AttributeType";
import { PhoneCDPDrawer } from "components/Drawers";
import { Span } from "components/Labels";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { LEAD_STATUS } from "views/LeadCenterView/constants";

interface Props {
  name?: string;
  phone?: string;
  is_new_customer?: boolean;
  created?: string;
  created_by?: { id: string; name: string; email: string };
  handler_assigned_at?: string;
  channel?: AttributeType;
  lead_status?: string;
  call_later_at?: string;
}

function CustomerCard(props: Props) {
  const theme = useTheme();

  const isRedPhone = () => {
    // Tính khoảng thời gian tính từ thời điểm chia số đến thời điểm hiện tại
    const duration = props.handler_assigned_at
      ? differenceInCalendarDays(new Date(), new Date(props.handler_assigned_at))
      : 0;
    // Kiểm tra trạng thái lead đang ở trạng thái chờ xử lý và đang xử lý
    const isInProgress =
      props.lead_status === LEAD_STATUS.WAITING || props.lead_status === LEAD_STATUS.HANDLING;

    // Kiểm tra có nhập ngày gọi lại hay chưa
    const isHasCallLater = Boolean(props.call_later_at);

    const CRM = "(system) CRM";

    if (props?.channel?.name === CRM && isInProgress && duration > 7) {
      return true;
    }

    if (props?.channel?.name !== CRM && isInProgress && isHasCallLater && duration > 7) {
      return true;
    }

    if (props?.channel?.name !== CRM && isInProgress && !isHasCallLater && duration > 3) {
      return true;
    }

    return false;
  };

  return (
    <Stack display="flex" justifyContent="flex-start" direction="column" sx={{ minWidth: "300px" }}>
      <Span
        sx={{ width: "min-content" }}
        variant={"ghost"}
        color={props.is_new_customer ? "primary" : "info"}
      >{`Khách hàng ${props.is_new_customer ? "mới" : "cũ"}`}</Span>

      <Stack
        direction="row"
        sx={{ fontSize: 13, display: "flex", mt: "12px!important", mb: "6px!important" }}
      >
        <PhoneCDPDrawer
          phone={props.phone}
          containerStyles={{
            width: "min-content",
            ...(isRedPhone() && {
              color: theme.palette.error.dark,
            }),
          }}
        />
      </Stack>
      <Typography sx={{ fontSize: 13, mb: 1 }}>{`${props?.name}`}</Typography>
    </Stack>
  );
}

export default CustomerCard;

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { AttributeType } from "_types_/AttributeType";
import { LeadStatusType } from "_types_/PhoneLeadType";
import { MTextLine } from "components/Labels";
import { leadStatusColor } from "features/lead/formatStatusColor";
import { FULL_LEAD_STATUS_OPTIONS } from "views/LeadCenterView/constants";

interface Props {
  lead_status?: LeadStatusType;
  order_information?: string;
  order_id?: string;
  handle_status?: number;
  bad_data_reason?: AttributeType;
  handle_reason?: AttributeType;
  fail_reason?: AttributeType;
  data_status?: AttributeType;
}

function LeadStatusCard(props: Props) {
  const { lead_status, data_status } = props;
  const leadStatusLabel = lead_status
    ? FULL_LEAD_STATUS_OPTIONS.find((item) => item.value === lead_status)?.label
    : "";

  return (
    <Stack
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      direction="column"
      spacing={1}
      width="100%"
    >
      {props.lead_status && (
        <Chip
          size="small"
          variant="outlined"
          label={leadStatusLabel}
          style={{
            backgroundColor: leadStatusColor(lead_status, data_status?.name),
            borderColor: leadStatusColor(lead_status, data_status?.name),
            color: "#fff",
          }}
        />
      )}

      {props.order_information ? (
        <MTextLine
          label="Mã đơn hàng:"
          value={props.order_information || "---"}
          valueStyle={{ textAlign: "left" }}
        />
      ) : null}

      {props.bad_data_reason ? (
        <MTextLine
          label="Lý do không chất lượng:"
          value={props.bad_data_reason.name || "---"}
          valueStyle={{ textAlign: "left" }}
        />
      ) : null}

      {props.handle_reason ? (
        <MTextLine
          label="Lý do đang xử lý:"
          value={props.handle_reason.name || "---"}
          valueStyle={{ textAlign: "left" }}
        />
      ) : null}

      {props.fail_reason ? (
        <MTextLine
          label="Lý do không mua:"
          value={props.fail_reason.name || "---"}
          valueStyle={{ textAlign: "left" }}
        />
      ) : null}
    </Stack>
  );
}

export default LeadStatusCard;

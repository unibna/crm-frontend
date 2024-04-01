import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { AttributeType } from "_types_/AttributeType";
import { LeadStatusType } from "_types_/PhoneLeadType";
import { MTextLine, Span } from "components/Labels";
import { leadStatusColor } from "features/lead/formatStatusColor";
import { FULL_LEAD_STATUS_OPTIONS } from "views/LeadCenterView/constants";

interface Props {
  ad_channel?: string;
  ad_id?: string;
  ad_id_content?: string;
}

function AdsCard(props: Props) {
  const { ad_channel, ad_id, ad_id_content } = props;

  if (!ad_channel && !ad_id && !ad_id_content) {
    return <Span>Không có dữ liệu</Span>;
  }

  return (
    <Stack
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      direction="column"
      spacing={1}
      width="100%"
    >
      {ad_channel ? (
        <MTextLine
          label="Kênh Ads:"
          value={ad_channel || "---"}
          valueStyle={{ textAlign: "left" }}
        />
      ) : null}
      {ad_id ? (
        <MTextLine label="Ads ID:" value={ad_id || "---"} valueStyle={{ textAlign: "left" }} />
      ) : null}
      {ad_id_content ? (
        <MTextLine
          label="Ads Id Content:"
          value={ad_id_content || "---"}
          valueStyle={{ textAlign: "left" }}
        />
      ) : null}
    </Stack>
  );
}

export default AdsCard;

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { MTextLine } from "components/Labels";
import Chip from "@mui/material/Chip";
import { optionStatus } from "views/CskhView/constants";

const CarriesCustomerCard = ({
  status_airtable,
  description,
  note,
}: {
  status_airtable?: number;
  description?: string;
  note?: string;
}) => {
  const status = optionStatus.find((item) => item.value === status_airtable);
  return (
    <Stack spacing={0.5}>
      {status && (
        <Chip
          size="small"
          variant="outlined"
          label={`${status.label}`}
          style={{
            backgroundColor: status.color,
            color: "#fff",
            width: "fit-content",
          }}
        />
      )}
      {description && (
        <MTextLine
          label="Tình trạng:"
          value={<Typography fontSize={13}>{description}</Typography>}
        />
      )}
      {note && <MTextLine label="Ghi chú:" value={<Typography fontSize={13}>{note}</Typography>} />}
    </Stack>
  );
};

export default CarriesCustomerCard;

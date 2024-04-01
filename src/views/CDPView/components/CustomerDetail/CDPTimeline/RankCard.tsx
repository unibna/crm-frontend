import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MTextLine } from "components/Labels";
import { fDate } from "utils/dateUtil";
import RankField, { RANK_CHIP_OPTIONS } from "../Overview/RankField";

const RankCard = ({
  field_changed,
  new_value,
}: {
  field_changed: "ranking" | "birthday" | "customer_note";
  new_value?: string;
}) => {
  const rank = RANK_CHIP_OPTIONS.find((item) => item.value.toString() === new_value?.toString());
  return (
    <Stack spacing={0.5}>
      {rank && field_changed === "ranking" && <RankField value={rank.label} />}

      {field_changed === "birthday" && (
        <MTextLine
          label="Ngày sinh:"
          value={<Typography fontSize={13}>{fDate(new_value)}</Typography>}
        />
      )}

      {field_changed === "customer_note" && (
        <MTextLine label="" value={<Typography fontSize={13}>{new_value}</Typography>} />
      )}
    </Stack>
  );
};

export default RankCard;

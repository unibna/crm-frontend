import { Stack, Typography } from "@mui/material";
import { AirTableOption } from "_types_/SkyTableType";
import KanbanMenuHeader from "./KanbanMenuHeader";

type Props = {
  choice: AirTableOption;
  choices?: { [key: string]: AirTableOption };
  onChangeOptions: (
    newValue: AirTableOption[],
    optional?: { actionSuccess: () => void } | undefined
  ) => void;
};

const KanbanColumnToolbar = ({ choice, choices, onChangeOptions }: Props) => {
  return (
    <Stack direction="row" width="100%" alignItems="center" mt={1}>
      <Typography
        variant="h6"
        sx={{
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {choice.name}
      </Typography>
      {choice.id !== "uncategorized" && (
        <KanbanMenuHeader choices={choices} choice={choice} onChangeOptions={onChangeOptions} />
      )}
    </Stack>
  );
};

export default KanbanColumnToolbar;

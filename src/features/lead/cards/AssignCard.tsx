import { Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { UserTooltip } from "components/Tooltips";
import { MTextLine } from "components/Labels/MTextLine";
import { fDateTime } from "utils/dateUtil";

interface Props {
  handle_by?: { id: string; name: string; email: string; image?: string };
  handler_assigned_at?: string;
}

function AssignCard(props: Props) {
  const theme = useTheme();

  const styles = {
    labelInfo: {
      fontWeight: 400,
      fontSize: "0.8125rem",
      display: "inline",
    },
    info: {
      fontWeight: 600,
      fontSize: "0.8125rem",
      display: "inline",
    },
    handler: {
      fontWeight: 600,
      fontSize: "0.8125rem",

      color: theme.palette.primary.main,
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  };

  const { name, image, email } = props.handle_by || {};

  return (
    <Stack display="flex" justifyContent="flex-start" direction="column" spacing={1}>
      <MTextLine
        label="Ngày chia:"
        value={
          props.handler_assigned_at ? (
            <Typography style={styles.info} component="span">
              {fDateTime(props.handler_assigned_at)}
            </Typography>
          ) : (
            "---"
          )
        }
      />
      <MTextLine label="Người nhận:" value={<UserTooltip user={{ name, image, email }} />} />
    </Stack>
  );
}

export default AssignCard;

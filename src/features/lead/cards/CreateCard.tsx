import { Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { MTextLine } from "components/Labels";
import { UserTooltip } from "components/Tooltips";
import { fDateTime } from "utils/dateUtil";

interface Props {
  name?: string;
  phone?: string;
  is_new_customer?: boolean;
  created?: string;
  created_by?: { id: string; name: string; email: string; image?: string };
}

function CreateCard(props: Props) {
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

  const { name, image, email } = props.created_by || {};

  return (
    <Stack display="flex" justifyContent="flex-start" direction="column" spacing={1}>
      <MTextLine
        label="Tạo lúc:"
        value={<Typography sx={styles.info}>{`${fDateTime(props.created)}`}</Typography>}
      />
      <MTextLine label="Người tạo:" value={<UserTooltip user={{ name, image, email }} />} />
    </Stack>
  );
}

export default CreateCard;

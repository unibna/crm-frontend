import { Stack, Theme, Typography } from "@mui/material";

import { useTheme } from "@mui/material/styles";

import { LabelColor, Span } from "components/Labels/Span";
import { fDateTime } from "utils/dateUtil";
import { MTextLine } from "components/Labels/MTextLine";
import isBefore from "date-fns/isBefore";
import { UserType } from "_types_/UserType";
import { UserTooltip } from "components/Tooltips";

interface Props {
  modified_by?: Partial<UserType>;
  modified?: string;
  recent_handling?: number;
  call_later_at?: string;
  handle_status?: number;
}

function HandleInfoCard(props: Props) {
  const theme = useTheme();

  const colors: LabelColor[] = ["primary", "info", "warning", "secondary"];

  const styles = cardStyles(theme);

  const { email, name, image } = props.modified_by || {};

  return (
    <Stack
      display="flex"
      justifyContent="flex-start"
      direction="column"
      spacing={1}
      sx={{ minWidth: "400px", py: 2 }}
    >
      <MTextLine
        label="Số lần gọi:"
        value={
          <Span
            variant={"ghost"}
            color={props.handle_status ? colors[props.handle_status] : "error"}
          >{`${!props.handle_status ? "Chưa có" : `Gọi lần ${props.handle_status}`}`}</Span>
        }
      />
      <MTextLine
        label="XL gần nhất:"
        value={<Typography sx={styles.info}>{`${fDateTime(props.modified) || "---"}`}</Typography>}
      />
      <MTextLine label="Người XL:" value={<UserTooltip user={{ email, name, image }} />} />

      <MTextLine
        label="Số phút xử lý:"
        value={<Typography sx={styles.info}>{`${props.recent_handling || ""} phút`}</Typography>}
      />
      <MTextLine
        label="Ngày gọi lại:"
        value={
          <Typography
            sx={{
              ...styles.info,
              color:
                props.call_later_at && isBefore(new Date(props.call_later_at), new Date())
                  ? theme.palette.error.dark
                  : "unset",
            }}
          >
            {`${props.call_later_at ? fDateTime(props.call_later_at) : "---"}`}
          </Typography>
        }
      />
    </Stack>
  );
}

export default HandleInfoCard;

const cardStyles = (theme: Theme) => {
  return {
    mainText: {
      fontWeight: 600,
      fontSize: "0.975rem",
    },
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
    createAt: {
      fontWeight: 400,
      fontSize: "0.775rem",
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
    note: {
      display: "-webkit-box",
      whiteSpace: "break-spaces",
      maxWidth: "220px",
    },
  };
};

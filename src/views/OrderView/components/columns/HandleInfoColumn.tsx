//components
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { UserTooltip } from "components/Tooltips";
import { MTextLine } from "components/Labels";

//types
import { OrderType } from "_types_/OrderType";

//utils
import { fDateTime } from "utils/dateUtil";
import { HISTORY_ACTIONS } from "constants/index";
import isEqual from "date-fns/isEqual";
import isBefore from "date-fns/isBefore";
import endOfDay from "date-fns/endOfDay";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value?. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export const HandleInfoColumn = (props: Props) => {
  const Formatter = ({ row }: { row?: OrderType }) => {
    const theme = useTheme();

    const styles = {
      labelInfo: {
        fontWeight: 400,
        fontSize: 13,
        display: "inline",
      },
      info: {
        fontWeight: 600,
        fontSize: 13,
        display: "inline",
      },
      handler: {
        fontWeight: 600,
        fontSize: 13,

        color: theme.palette.primary.main,
        cursor: "pointer",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    };

    let handler_by =
      {
        [HISTORY_ACTIONS.CREATE]: row?.created_by,
        [HISTORY_ACTIONS.CANCEL]: row?.modified_by,
        [HISTORY_ACTIONS.UPDATE]: row?.modified_by,
        [HISTORY_ACTIONS.PRINT]: row?.printed_by,
        [HISTORY_ACTIONS.CONFIRM]: row?.created_by,
      }[row?.history_action || ""] ?? row?.modified_by;

    let handler_at = row?.history_date || row?.modified;
    const {
      image: createdByImage,
      email: createdByEmail,
      name: createdByName,
    } = row?.created_by || {};
    const { image: handleByImage, email: handleByEmail, name: handleByName } = handler_by || {};

    return (
      <Stack direction="column" spacing={1} sx={{ width: 240 }}>
        <MTextLine
          label="Tạo lúc:"
          value={<Typography sx={styles.info}>{`${fDateTime(row?.created)}`}</Typography>}
          xsLabel={5}
          xsValue={7}
        />

        <MTextLine
          label="Người tạo:"
          value={
            <UserTooltip
              user={{ email: createdByEmail, name: createdByName, image: createdByImage }}
            />
          }
          xsLabel={5}
          xsValue={7}
        />

        {/* -------------------------------------------- */}
        {row?.completed_time && (
          <MTextLine
            label="Xác nhận lúc:"
            value={<Typography sx={styles.info}>{`${fDateTime(row?.completed_time)}`}</Typography>}
            xsLabel={5}
            xsValue={7}
          />
        )}
        {/* -------------------------------------------- */}
        <MTextLine
          label="XL lúc:"
          value={<Typography sx={styles.info}>{`${fDateTime(handler_at)}`}</Typography>}
          xsLabel={5}
          xsValue={7}
        />
        <MTextLine
          label="Người XL:"
          value={
            <UserTooltip
              user={{ email: handleByEmail, name: handleByName, image: handleByImage }}
            />
          }
          xsLabel={5}
          xsValue={7}
        />

        {row?.status !== "completed" && (
          <MTextLine
            label="T/g hẹn gọi lại:"
            value={fDateTime(row?.appointment_date) || "---"}
            xsLabel={5}
            xsValue={7}
            valueStyle={{
              color:
                row?.appointment_date &&
                (isEqual(new Date(row?.appointment_date), new Date()) ||
                  isBefore(new Date(row.appointment_date), endOfDay(new Date())))
                  ? theme.palette.error.dark
                  : "unset",
            }}
          />
        )}
      </Stack>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={props.for || []} />;
};

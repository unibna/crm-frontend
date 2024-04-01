import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import isBefore from "date-fns/isBefore";

import { useTheme } from "@mui/material";
import Stack from "@mui/material/Stack";

import { ReadMoreButton } from "components/Buttons";
import { MTextLine } from "components/Labels";
import { UserTooltip } from "components/Tooltips";

import { fDateTime } from "utils/dateUtil";

import { TransportationOrderType } from "_types_/TransportationType";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

function HandleColumn(props: Props) {
  const Formatter = ({ row }: { row?: TransportationOrderType }) => {
    const theme = useTheme();
    return (
      <Stack
        display="flex"
        justifyContent="flex-start"
        direction="column"
        spacing={1}
        sx={{ width: "320px" }}
      >
        <MTextLine
          label="Ngày chia số:"
          value={row?.assigned_at ? fDateTime(row?.assigned_at) : "---"}
          displayType="grid"
        />
        <MTextLine label="Ngày XL gần nhất:" value={fDateTime(row?.modified)} displayType="grid" />
        <MTextLine
          label="Người xử lý:"
          value={row?.modified_by?.name ? <UserTooltip user={row?.modified_by} /> : "---"}
          displayType="grid"
        />

        <MTextLine
          label="Ngày gọi lại:"
          value={`${row?.appointment_date ? fDateTime(row.appointment_date) : "---"}`}
          displayType="grid"
          valueStyle={{
            color:
              row?.appointment_date && isBefore(new Date(row?.appointment_date), new Date())
                ? theme.palette.error.dark
                : "unset",
          }}
        />

        <MTextLine
          label="Ghi chú:"
          value={
            <ReadMoreButton
              text={row?.note || "---"}
              textStyles={{ ...styles.info, ...styles.note }}
              isShow
              shortTextLength={50}
            />
          }
          displayType="grid"
        />
      </Stack>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={["handle"]} />;
}

export default HandleColumn;

const styles = {
  info: {
    fontWeight: 500,
    fontSize: 13,
    display: "inline",
  },
  note: {
    display: "-webkit-box",
    whiteSpace: "break-spaces",
    maxWidth: "240px",
  },
};

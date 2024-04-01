import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";

import { Theme, useTheme } from "@mui/material";
import Stack from "@mui/material/Stack";

import { MTextLine, Span } from "components/Labels";
import { UserTooltip } from "components/Tooltips";

import { TRANSPORTATION_STATUS } from "views/TransportationCareView/constant";

import { fDateTime } from "utils/dateUtil";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

function TaskColumn(props: Props) {
  const Formatter = ({ row }: { row?: any }) => {
    const theme = useTheme();

    const styles = styled(theme);

    const statusValue = TRANSPORTATION_STATUS.find((item) => item?.value === row?.status);
    return (
      <Stack spacing={1} sx={{ width: "280px" }}>
        <MTextLine
          label={"Trạng thái CSVĐ:"}
          value={
            <Span style={styles.chip} color={statusValue?.color}>
              {statusValue?.label}
            </Span>
          }
          displayType="grid"
        />
        <MTextLine label={"Ngày tạo CSVĐ:"} value={fDateTime(row?.created)} displayType="grid" />
        <MTextLine
          label={"Người tạo CSVĐ:"}
          value={
            row?.assign_by?.name ? (
              <UserTooltip user={row?.assign_by} />
            ) : (
              <UserTooltip user={{ name: "SuperAdmin" }} />
            )
          }
          displayType="grid"
        />
      </Stack>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={["task"]} />;
}

export default TaskColumn;

const styled = (theme: Theme) => ({
  chip: {
    width: "fit-content",
    whiteSpace: "break-spaces",
    lineHeight: "150%",
    height: "auto",
    padding: "4px 8px",
  } as React.CSSProperties,
});

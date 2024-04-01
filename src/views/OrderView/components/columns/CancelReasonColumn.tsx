//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { SxProps, Theme, useTheme } from "@mui/material";
import Stack from "@mui/material/Stack";
import { AttributeType } from "_types_/AttributeType";
import { OrderType } from "_types_/OrderType";
import { Span, MTextLine } from "components/Labels";
import { UserTooltip } from "components/Tooltips";
import { fDateTime } from "utils/dateUtil";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value?. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export const CancelReasonColumn = (props: Props) => {
  const Formatter = ({ row }: { row?: OrderType }) => {
    const { cancel_reason, modified, modified_by } = row || {};
    const theme = useTheme();
    const styles = styled(theme);

    const { email, name, image } = modified_by || {};
    if (!cancel_reason) {
      return (
        <Span color={"default"} sx={styles.chip}>
          Không có dữ liệu
        </Span>
      );
    }
    return (
      <Stack spacing={1}>
        <MTextLine
          label="Lý do huỷ:"
          value={cancel_reason ? (cancel_reason as AttributeType)?.name : "---"}
        />
        <MTextLine label="Thời gian huỷ:" value={modified ? fDateTime(modified) : "---"} />
        <MTextLine label="Người huỷ:" value={<UserTooltip user={{ email, name, image }} />} />
      </Stack>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={["cancel_reason"]} />;
};

const styled = (theme: Theme): { [key: string]: SxProps<Theme> } => ({
  mainText: {
    fontWeight: 600,
    fontSize: "0.975rem",
    color: theme.palette.primary.main,
    display: "block",
  },
  chip: {
    width: "fit-content",
    whiteSpace: "break-spaces",
    lineHeight: "150%",
    height: "auto",
    padding: "4px 8px",
  },
});

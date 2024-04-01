//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { Span } from "components/Labels";

//types
import { OrderStatusValue, OrderType } from "_types_/OrderType";
import { SxProps, Theme } from "@mui/material";

//utils
import { ORDER_STATUS } from "views/OrderView/constants/options";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value?. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  tabName?: OrderStatusValue;
}

const COLUMN_NAMES = ["status"];

export const OrderStatusColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: OrderType }) => {
    const labels: { [key: string]: string } = ORDER_STATUS.reduce(
      (prev, current) => ({ ...prev, [current.value]: current.label }),
      {}
    );
    const colors = ORDER_STATUS.reduce((prev, current) => ({
      ...prev,
      [current.value]: current.color,
    }));

    const colorValue = (row?.status || "draft") as keyof typeof colors;

    return (
      <Span color={colors[colorValue]} sx={styles.chip}>
        {labels[colorValue] || "---"}
      </Span>
    );
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};

const styles: { [key: string]: SxProps<Theme> } = {
  chip: {
    width: "fit-content",
    whiteSpace: "break-spaces",
    lineHeight: "150%",
    height: "auto",
    padding: "4px 8px",
  },
};

import { Column, DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { PhoneLeadReportType } from "_types_/PhoneLeadType";
import { formatReportPhoneLeadValue } from "features/lead/formatData";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = [
  "post_qualified",
  "processing",
  "processed",
  "buy",
  "not_buy",
  "waiting",
  "new",
  "unprocessed",
  "post_not_qualified",
  "pre_not_qualified",
  "pre_qualified",
  "buy_rate",
  "new_lead",
  "assigned_lead",
  "unassigned_lead",
  "total",
];

const LeadReportColumn = (props: Props) => {
  const zero = "0 - 0%";
  const Formatter = ({
    value,
    row,
    column,
  }: {
    value?: number | string;
    row?: PhoneLeadReportType;
    column: Column;
  }) => {
    const result = row && row.total ? formatReportPhoneLeadValue(column?.name, row, value) : zero;
    return <>{result}</>;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={COLUMN_NAMES} />;
};

export default LeadReportColumn;

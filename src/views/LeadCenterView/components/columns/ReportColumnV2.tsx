import { Column, DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { PhoneLeadReportType } from "_types_/PhoneLeadType";
import { formatReportPhoneLeadValueV2 } from "features/lead/formatData";

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
  "total_lead",
  "assigned_lead",
  "processed_lead",
  "waiting_lead",
  "processing_lead",
  "buy_lead",
  "not_buy_lead",
  "qualified_lead",
  "purchase_rate",
  "unassigned_lead",
  "new_lead",
];

const ReportLeadV2Column = (props: Props) => {
  const Formatter = ({
    value,
    row,
    column,
  }: {
    value?: number | string;
    row?: PhoneLeadReportType;
    column: Column;
  }) => {
    const result = formatReportPhoneLeadValueV2(column?.name, row, value);

    return <>{result}</>;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={COLUMN_NAMES} />;
};

export default ReportLeadV2Column;

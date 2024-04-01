import React from "react";
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { CustomerType } from "_types_/CustomerType";
import { PhoneCDPDrawer } from "components/Drawers";

const COLUMN_NAMES = ["customer_phone", "phone"];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  onRefresh?: () => void;
  onRefreshCDPRow?: (customer: CustomerType) => void;
}

const DPhoneColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value?: string }) => {
    return <PhoneCDPDrawer phone={value} onRefresh={props.onRefreshCDPRow} />;
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};

export default DPhoneColumn;

import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Switch from "@mui/material/Switch";
import { TanentType } from "_types_/FacebookType";
import React from "react";

export interface ColumnSyncTanentUrlProps {
  accountKey?: string;
  tenantKey?: string;
  onToggleSyncTannetSwitch?: (isActive: boolean, id: string, columnName: string) => void;
  getCheckedValue?: (id: string, tenantName: string) => TanentType;
}

interface Props extends ColumnSyncTanentUrlProps {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const ColumnSyncTanentUrl = (props: Props) => {
  const { onToggleSyncTannetSwitch, getCheckedValue, accountKey = "", tenantKey = "" } = props;
  const Formatter = ({ column, row }: { column: any; row?: any }) => {
    const tenant = getCheckedValue?.(row[accountKey || ""], column.tenantName);
    return row ? (
      <Switch
        color="primary"
        checked={
          tenant?.[tenantKey] === row[accountKey] &&
          tenant?.tenant.url_tenant?.includes(column.tenantName)
        }
        onChange={
          accountKey
            ? (e) => onToggleSyncTannetSwitch?.(e.target.checked, row[accountKey], column.name)
            : undefined
        }
      />
    ) : null;
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnSyncTanentUrl;

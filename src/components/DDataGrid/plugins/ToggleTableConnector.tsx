import { Plugin, Template, TemplateConnector } from "@devexpress/dx-react-core";
import {
  Table,
  TableEditColumn,
  TableHeaderRow,
  TableRowDetail,
  TableSelection,
} from "@devexpress/dx-react-grid-material-ui";
import ToggleModeTable from "components/DDataGrid/components/ToggleModeTable";

const ToggleTableConnector = ({
  isFullTable,
  setFullTable,
  visible = "detail",
}: {
  isFullTable?: boolean;
  setFullTable?: (value: boolean) => void;
  visible?: "detail" | "edit" | "selection";
}) => {
  return (
    <Plugin>
      <Template
        name="tableCell"
        predicate={(params: any) => {
          return params.tableRow.type === TableHeaderRow.ROW_TYPE &&
            ((visible === "detail" && params.tableColumn.type === TableRowDetail.COLUMN_TYPE) ||
              (visible === "edit" && params.tableColumn.type === TableEditColumn.COLUMN_TYPE) ||
              (visible === "selection" && params.tableColumn.type === TableSelection.COLUMN_TYPE))
            ? true
            : false;
        }}
      >
        {(params: any) => (
          <TemplateConnector>
            {(restProps) => (
              <Table.Cell {...params}>
                <ToggleModeTable
                  onToggleModeTable={() => setFullTable && setFullTable(!isFullTable)}
                  isFullTable={isFullTable}
                />
              </Table.Cell>
            )}
          </TemplateConnector>
        )}
      </Template>
    </Plugin>
  );
};

export default ToggleTableConnector;

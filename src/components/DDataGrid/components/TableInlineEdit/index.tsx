// Libraries
import { useState } from "react";
import { TableInlineCellEditing as TableInlineCellEditingGrid } from "@devexpress/dx-react-grid";
import { TableInlineCellEditing } from "@devexpress/dx-react-grid-material-ui";

// ------------------------------------------

type Combined = TableInlineCellEditingGrid.CellProps & Props;

interface Props {
  onCommitChanges: (value: any) => any;
}

const TableInlineEdit = (props: Combined) => {
  const { value, onCommitChanges } = props;
  const [inputValue, setInputValue] = useState(value);

  return (
    <TableInlineCellEditing.Cell
      {...props}
      value={inputValue}
      onValueChange={setInputValue}
      onBlur={() => {
        inputValue !== value && onCommitChanges(inputValue);
        props.onBlur();
      }}
      onKeyDown={(event: any) => {
        if (event.keyCode === 13) {
          inputValue !== value && onCommitChanges(inputValue);
        }
        props.onKeyDown(event);
      }}
    />
  );
};

export default TableInlineEdit;

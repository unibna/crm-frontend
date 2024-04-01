//component
import { TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";
import Popover from "@mui/material/Popover";
import { useState } from "react";
import { ColumnShowSortType } from "_types_/DGridType";
import { DIRECTION_SORT_TYPE, SortType } from "_types_/SortType";
import SortPopup from "./SortPopup";

interface Props {
  tableCellProps: TableHeaderRow.CellProps;
  columnShowSort?: ColumnShowSortType[];
  columnSortIndex: number;
  sortInstance?: SortType[];
  setSortInstance: (columnName: string, fieldName: string, direction: DIRECTION_SORT_TYPE) => void;
}

const SortHeader = (props: Props) => {
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLDivElement) | null>(null);

  const { columnShowSort, tableCellProps, columnSortIndex, sortInstance, setSortInstance } = props;

  const handleClickCell = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(e?.currentTarget || null);
  };

  return (
    <>
      <Popover
        id={`popover_${tableCellProps.column?.name}`}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <SortPopup
          columnShowSort={columnShowSort}
          columnSortIndex={columnSortIndex}
          setSortInstance={setSortInstance}
          sortInstance={sortInstance}
        />
      </Popover>
      <TableHeaderRow.Cell {...tableCellProps} onClick={handleClickCell} />
    </>
  );
};
export default SortHeader;

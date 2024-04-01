import { Typography, useTheme } from "@mui/material";
import TableRow from "@mui/material/TableRow";

import {
  styles,
  TableCellStyled,
  TableFootStyled,
} from "views/AirtableV2/components/views/Grid/CommonComponents";

function GridFooter({
  footerGroups,
  dataTable,
  rows,
}: {
  footerGroups: any[];
  dataTable: any[];
  rows: any[];
}) {
  const theme = useTheme();
  return (
    <TableFootStyled className="tfoot">
      {footerGroups.map((group: any, groupIndex: number) => (
        <TableRow {...group.getFooterGroupProps()} className="tr" key={groupIndex}>
          <TableCellStyled
            sx={{
              border: "none",
              borderTop: `1px solid ${theme.palette.divider}`,
              width: styles.checkbox.width,
              minWidth: styles.checkbox.width,
              ...styles.checkbox,
            }}
            className="td"
          >
            <Typography variant="caption" fontWeight={600}>{`${rows.length} records`}</Typography>
          </TableCellStyled>
          {group.headers.map((column: any) => (
            <TableCellStyled
              {...column.getFooterProps()}
              key={column.id}
              sx={{ border: "none", borderTop: `1px solid ${theme.palette.divider}` }}
              className="td"
            >
              {column.render("Footer", {
                dataFooter: [...dataTable.map((item: any) => item[column.id])],
              })}
            </TableCellStyled>
          ))}
        </TableRow>
      ))}
    </TableFootStyled>
  );
}

export default GridFooter;

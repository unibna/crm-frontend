// Libraries
import { TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";
import { useTheme, alpha } from "@mui/material/styles";

interface Props {
  tableCellProps: TableHeaderRow.CellProps;
  isTableDetail?: boolean;
  children?: React.ReactNode;
}

const HeaderOptional = ({ tableCellProps, isTableDetail, children }: Props) => {
  const theme = useTheme();

  return (
    <TableHeaderRow.Cell
      {...tableCellProps}
      sx={{
        whiteSpace: "normal",
        ...(isTableDetail && {
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        }),
        padding: "14px 0 14px 14px",
        verticalAlign: "top",
      }}
    >
      {children}
    </TableHeaderRow.Cell>
  );
};
export default HeaderOptional;

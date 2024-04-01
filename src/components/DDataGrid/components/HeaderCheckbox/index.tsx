// Libraries
import { TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useTheme, alpha } from "@mui/material/styles";

interface Props {
  tableCellProps: TableHeaderRow.CellProps;
  onChangeCheckBoxAll: (isCheck: boolean) => void;
  isCheckAll: boolean;
  isTableDetail?: boolean;
  label?: string;
}

const HeaderCheckbox = ({
  tableCellProps,
  onChangeCheckBoxAll,
  isCheckAll,
  label = "",
  isTableDetail,
}: Props) => {
  const theme = useTheme();

  return (
    <TableHeaderRow.Cell
      {...tableCellProps}
      sx={{
        whiteSpace: "normal",
        ...(isTableDetail && {
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        }),
      }}
    >
      <FormControlLabel
        sx={{ "&:nth-child(2)": { fontSize: 14 } }}
        control={
          <Checkbox
            onChange={(e) => onChangeCheckBoxAll(e.target.checked)}
            checked={Boolean(isCheckAll)}
            name="checkedB"
            color="primary"
            sx={{ ml: 1 }}
          />
        }
        label={label}
      />
    </TableHeaderRow.Cell>
  );
};
export default HeaderCheckbox;

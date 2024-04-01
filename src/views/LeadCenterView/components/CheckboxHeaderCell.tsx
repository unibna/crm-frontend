//component
import { TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//style
import { styled } from "@mui/material";
import { PhoneLeadTabNameType } from "_types_/PhoneLeadType";
interface Props {
  tableCellProps: TableHeaderRow.CellProps;
  onChangeCheckBoxAll: (isCheck: boolean) => void;
  isCheckAll: boolean;
  label: string;
  isControl?: boolean;
}

const CheckboxHeaderCell = ({
  tableCellProps,
  onChangeCheckBoxAll,
  isCheckAll,
  label,
  isControl,
}: Props) => {
  return (
    <TabHeaderCell {...tableCellProps}>
      <FormCheckboxHeader
        control={
          isControl ? (
            <Checkbox
              onChange={(e) => onChangeCheckBoxAll(e.target.checked)}
              checked={isCheckAll}
              style={{ marginLeft: 6 }}
              name="checkedB"
              color="primary"
            />
          ) : (
            <></>
          )
        }
        label={
          <Typography fontSize={14} fontWeight={600} mt={0.5}>
            {label}
          </Typography>
        }
      />
    </TabHeaderCell>
  );
};
export default CheckboxHeaderCell;

const FormCheckboxHeader = styled(FormControlLabel)`
  span:nth-child(2) {
    font-size: 14px;
  }
`;

const TabHeaderCell = styled(TableHeaderRow.Cell)`
  white-space: normal;
  padding: 3px 10px;
`;

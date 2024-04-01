// Components
import { TableInlineCellEditing } from "@devexpress/dx-react-grid-material-ui";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { MultiSelect } from "components/Selectors";

// Constants
import { TYPE_FORM_FIELD } from "constants/index";
interface Props {
  cellProps: any;
}

const ComponentMultiSelect = ({ value, onValueChange, column, onBlur }: any) => {
  const handleSelectFilter = (value: any) => {
    onValueChange(value);
    setTimeout(() => {
      onBlur();
    }, 0);
  };

  return (
    <MultiSelect
      options={[
        {
          value: "all",
          label: "Tất cả",
        },
        { label: "Sáng", value: "breakfast" },
        { label: "Trưa", value: "lunch" },
        { label: "Tối", value: "dinner" },
      ]}
      onChange={handleSelectFilter}
      defaultValue={value}
      selectorId="time-eat-in-day"
    />
  );
};

const ComponentSingleSelect = ({ value, onValueChange, column, onBlur }: any) => {
  const handleSelectFilter = (value: any) => {
    onValueChange(value);
    setTimeout(() => {
      onBlur();
    }, 0);
  };

  return (
    <MultiSelect
      options={[
        {
          value: "all",
          label: "Tất cả",
        },
        { label: "Sáng", value: "breakfast" },
        { label: "Trưa", value: "lunch" },
        { label: "Tối", value: "dinner" },
      ]}
      onChange={handleSelectFilter}
      simpleSelect
      selectorId="time-eat-in-day-2"
      defaultValue={value}
    />
  );
};

const InlineCell = ({ cellProps }: Props) => {
  const { column, value, onKeyDown, onFocus, onValueChange } = cellProps;

  const renderComponent = () => {
    switch (column.type) {
      case TYPE_FORM_FIELD.MULTIPLE_SELECT: {
        return <ComponentMultiSelect {...cellProps} />;
      }
      case TYPE_FORM_FIELD.SINGLE_SELECT: {
        return <ComponentSingleSelect {...cellProps} />;
      }
      default: {
        return (
          <Box>
            <TextField
              autoFocus
              variant="standard"
              value={value}
              style={inputStyle}
              onChange={(e) => onValueChange(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={onFocus}
            />
          </Box>
        );
      }
    }
  };

  return (
    <TableInlineCellEditing.Cell {...cellProps}>{renderComponent()}</TableInlineCellEditing.Cell>
  );
};

export default InlineCell;

const inputStyle = { marginTop: 5 };

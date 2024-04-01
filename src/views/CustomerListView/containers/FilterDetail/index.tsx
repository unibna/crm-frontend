// Libraries
import { useContext } from "react";

// Context
import { StoreCustomerList } from "views/CustomerListView/contextStore";

// Components
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { MultiSelect } from "components/Selectors";
import InputAdornment from "@mui/material/InputAdornment";

// Constants
import {
  fieldOptions,
  operatorOptionsByField,
  FilterChild,
  actionType,
  typeFilterOptions,
  valueOptions,
  typeComponent,
  exampleData,
} from "views/CustomerListView/constants";
import { TextField } from "@mui/material";
interface Props {
  filter: FilterChild;
  indexOfFilterParent: number;
  indexOfFilterChild: number;
  isShowButtonRemove?: boolean;
}

const FilterDetailInputValue = (props: any) => {
  const { value, option, indexOfFilterChild, indexOfFilterParent } = props;
  const { dispatch } = useContext(StoreCustomerList);

  const handleChangeInput = (value: any) => {
    dispatch({
      type: actionType.UPDATE_CUSTOMER_FILTER,
      payload: {
        location: [indexOfFilterChild, indexOfFilterParent],
        update: {
          value,
        },
      },
    });
  };

  const handleSelectValue = (value: any) => {
    dispatch({
      type: actionType.UPDATE_CUSTOMER_FILTER,
      payload: {
        location: [indexOfFilterChild, indexOfFilterParent],
        update: {
          value,
        },
      },
    });
  };

  const renderHtml = () => {
    let component = null;
    switch (option.type) {
      case typeComponent.INPUT_NUMBER: {
        component = (
          <Box sx={{ ml: 1, mt: 0.25 }}>
            <TextField
              fullWidth
              value={value}
              variant="standard"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">{option.unit || ""}</InputAdornment>,
              }}
              onChange={handleChangeInput}
            />
          </Box>
        );
        break;
      }
      case typeComponent.INPUT_TEXT: {
        component = (
          <Box sx={{ ml: 1, mt: 0.25 }}>
            <TextField
              fullWidth
              value={value}
              variant="standard"
              type="text"
              InputProps={{
                endAdornment: <InputAdornment position="end">{option.unit || ""}</InputAdornment>,
              }}
              onChange={handleChangeInput}
            />
          </Box>
        );
        break;
      }
      case typeComponent.MULTIPLE_SELECT: {
        component = (
          <MultiSelect
            options={exampleData}
            onChange={(value) => handleSelectValue(value)}
            label="value"
            defaultValue={value || exampleData[0].value}
            selectorId={value || exampleData[0].value}
          />
        );
      }
    }

    return component;
  };

  return <>{renderHtml()}</>;
};

const FilterDetail = (props: Props) => {
  const { filter, indexOfFilterParent, indexOfFilterChild, isShowButtonRemove = false } = props;
  const { type, field, operator, value } = filter;
  const { dispatch } = useContext(StoreCustomerList);

  const handleSelectType = (value: any) => {
    dispatch({
      type: actionType.UPDATE_CUSTOMER_FILTER,
      payload: {
        location: [indexOfFilterChild, indexOfFilterParent],
        update: {
          type: value,
        },
      },
    });
  };

  const handleSelectField = (value: any) => {
    dispatch({
      type: actionType.UPDATE_CUSTOMER_FILTER,
      payload: {
        location: [indexOfFilterChild, indexOfFilterParent],
        update: {
          field: value,
          operator: operatorOptionsByField[value][0].value || "",
        },
      },
    });
  };

  const handleSelectOperator = (value: any) => {
    dispatch({
      type: actionType.UPDATE_CUSTOMER_FILTER,
      payload: {
        location: [indexOfFilterChild, indexOfFilterParent],
        update: {
          operator: value,
        },
      },
    });
  };

  const handleRemoveFilterChild = () => {
    dispatch({
      type: actionType.REMOVE_FILTER_CHILD,
      payload: {
        location: [indexOfFilterChild, indexOfFilterParent],
      },
    });
  };

  return (
    <>
      <Box display="flex" my={2}>
        <Box width={2 / 10} mr={1}>
          <MultiSelect
            options={typeFilterOptions}
            onChange={(value) => handleSelectType(value)}
            label="type"
            defaultValue={type}
            simpleSelect
            selectorId={type}
          />
        </Box>
        <Box width={3 / 10} mr={1}>
          <MultiSelect
            fullWidth
            options={fieldOptions}
            onChange={(value) => handleSelectField(value)}
            label="field"
            defaultValue={field}
            selectorId={field}
            simpleSelect
          />
        </Box>
        <Box width={2 / 10}>
          {field ? (
            <MultiSelect
              options={operatorOptionsByField[field]}
              onChange={(value) => handleSelectOperator(value)}
              label="operator"
              defaultValue={operator || operatorOptionsByField[field][0]}
              selectorId={operator || operatorOptionsByField[field][0]}
              simpleSelect
            />
          ) : null}
        </Box>
        <Box width={2 / 10}>
          {operator ? (
            <FilterDetailInputValue
              value={value}
              option={valueOptions[field]}
              indexOfFilterChild={indexOfFilterChild}
              indexOfFilterParent={indexOfFilterParent}
            />
          ) : null}
        </Box>
        {isShowButtonRemove ? (
          <Box width={1 / 10} display="flex" justifyContent="flex-end">
            <IconButton color="secondary" component="span" onClick={handleRemoveFilterChild}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default FilterDetail;

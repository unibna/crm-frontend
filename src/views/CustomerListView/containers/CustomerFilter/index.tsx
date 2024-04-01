// Libraries
import { useContext } from "react";

// Context
import { StoreCustomerList } from "views/CustomerListView/contextStore";

// Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FilterDetail from "views/CustomerListView/containers/FilterDetail";

// Constants
import { actionType, typeFilter, FilterChild } from "views/CustomerListView/constants";

interface PropsCustomerFilter {
  isOpen?: boolean;
  buttonText?: string;
  title?: string;
  attributes?: { attribute: number | string; attributeValue: number | string }[];
  handleClose?: () => void;
  handleSubmit?: (data: any) => void;
}

interface PropsFilter {
  filterChild: FilterChild[];
  indexOfFilterParent: number;
}

const Filter = (props: PropsFilter) => {
  const { filterChild, indexOfFilterParent } = props;
  const { dispatch } = useContext(StoreCustomerList);

  const handleAddFilterChild = (type: string) => {
    dispatch({
      type: actionType.ADD_FILTER_CHILD,
      payload: {
        location: [indexOfFilterParent],
      },
    });
  };

  // const arrFilterTypeInclude = useMemo(() => {
  //   return filterChild.length ? filterChild.filter(item => item.type === typeFilter.INCLUDE) : []
  // }, [filterChild])

  // const arrFilterTypeExclude = useMemo(() => {
  //   return filterChild.length ? filterChild.filter(item => item.type === typeFilter.EXCLUDE) : []
  // }, [filterChild])

  return (
    <Box border={1} borderColor="grey.500" my={2}>
      <Box m={2}>
        {/* <Typography variant="subtitle1">
          <b> Tiêu chí lựa chọn </b>
        </Typography> */}
        {filterChild.length
          ? filterChild.map((item, index) => {
              return (
                <FilterDetail
                  key={item.id}
                  filter={item}
                  indexOfFilterParent={indexOfFilterParent}
                  indexOfFilterChild={index}
                  isShowButtonRemove={filterChild.length > 1}
                />
              );
            })
          : null}
        <Button
          variant="text"
          color="primary"
          onClick={() => handleAddFilterChild(typeFilter.INCLUDE)}
        >
          Thêm
        </Button>
      </Box>
      {/* <Box m={2}>
        <Typography variant="subtitle1">
          <b> Tiêu chí loại trừ </b>
        </Typography>
        <hr />
        {
          arrFilterTypeExclude.length ? arrFilterTypeExclude.map(item => {
            return (
              <FilterDetail
                key={item.id}
                filter={item}
                indexOfFilterParent={indexOfFilterParent}
                indexOfFilterChild={filterChild.findIndex(itemChild => itemChild.id === item.id)}
              />
            )
          }) : null
        }
        <Button
          variant='text'
          color='primary'
          onClick={() => handleAddFilterChild(typeFilter.EXCLUDE)}
        >
          Thêm
        </Button>
      </Box> */}
    </Box>
  );
};

const CustomerFilter = (props: PropsCustomerFilter) => {
  const { state: store, dispatch } = useContext(StoreCustomerList);
  const { customers } = store;

  const handleRemoveFilterParent = (indexOfFilterParent: number) => {
    dispatch({
      type: actionType.REMOVE_FILTER_PARENT,
      payload: {
        location: [indexOfFilterParent],
      },
    });
  };

  const renderHtml = () => {
    if (customers.length) {
      return customers.map((item, index) => {
        return (
          <div key={index}>
            {index > 0 ? (
              <Box display="flex" justifyContent="space-between">
                <span>Hoặc</span>
                <Button variant="outlined" onClick={() => handleRemoveFilterParent(index)}>
                  Xóa
                </Button>
              </Box>
            ) : null}
            <Filter filterChild={item} indexOfFilterParent={index} />
          </div>
        );
      });
    }
    return;
  };

  return <div>{renderHtml()}</div>;
};

export default CustomerFilter;

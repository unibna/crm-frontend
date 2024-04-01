// Libraries
import { memo, useContext } from "react";
import isEqual from "lodash/isEqual";

// Context
import { StoreCustomerList } from "views/CustomerListView/contextStore";

// Components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormDialog from "components/Dialogs/FormDialog";
import CustomerFilter from "views/CustomerListView/containers/CustomerFilter";
import CountMatchedCustomer from "views/CustomerListView/containers/CountMatchedCustomer";

// Constants
import { actionType } from "views/CustomerListView/constants";
import { TextField } from "@mui/material";

interface Props {
  isOpen: boolean;
  buttonText?: string;
  title?: string;
  arrCustomer?: any;
  handleClose: () => void;
  handleSubmit: (data: any) => void;
}

const PopupCustomer = (props: Props) => {
  const {
    title,
    isOpen,
    // arrCustomer = [],
    buttonText = "",
    handleClose,
    // handleSubmit
  } = props;
  const { state: store, dispatch } = useContext(StoreCustomerList);
  const { name } = store;

  const onSubmitAttribute = () => {
    handleClose();
    // handleSubmit(data)
  };

  const handleAddFilterParent = () => {
    dispatch({
      type: actionType.ADD_FILTER_PARENT,
      payload: {},
    });
  };

  return (
    <FormDialog
      title={title}
      sizeTitle="h5"
      buttonText={buttonText}
      maxWidth="lg"
      onClose={handleClose}
      onSubmit={onSubmitAttribute}
      open={isOpen}
    >
      <Box>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Box width={4 / 12}>
            <Typography variant="subtitle1">Tên tập khách hàng: </Typography>
          </Box>
          <Box width={8 / 12}>
            <TextField
              fullWidth
              value={name}
              onChange={(e) =>
                dispatch({
                  type: actionType.UPDATE_NAME,
                  payload: {
                    name: e.target.value,
                  },
                })
              }
            />
          </Box>
        </div>
        <CountMatchedCustomer />
        <CustomerFilter />
        <Button variant="contained" size="medium" onClick={handleAddFilterParent}>
          Mở rộng thêm
        </Button>
      </Box>
    </FormDialog>
  );
};

const areEqual = (prevProps: Props, nextProps: Props) => {
  if (
    !isEqual(prevProps.title, nextProps.title) ||
    !isEqual(prevProps.isOpen, nextProps.isOpen) ||
    !isEqual(prevProps.arrCustomer, nextProps.arrCustomer) ||
    !isEqual(prevProps.handleClose, nextProps.handleClose) ||
    !isEqual(prevProps.handleSubmit, nextProps.handleSubmit)
  ) {
    return false;
  }
  return true;
};

export default memo(PopupCustomer, areEqual);

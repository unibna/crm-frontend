// Libraries
import { useContext } from "react";

// Context
import { DataFlowContext } from "views/DataFlow/context";

// Components
import AddIcon from "@mui/icons-material/Add";
import { Card, IconButton } from "@mui/material";
import { ActionType } from "views/DataFlow/constants";

// ---------------------------------------------

const NodeInit = () => {
  const { updateDrawerData } = useContext(DataFlowContext);

  const handleOpenDrawer = () => {
    updateDrawerData({
      isOpen: true,
    });
  };

  return (
    <Card sx={{ p: 2, position: "absolute", mt: 2, top: 0, right: 20 }} onClick={handleOpenDrawer}>
      <IconButton>
        <AddIcon />
      </IconButton>
    </Card>
  );
};

export default NodeInit;

// Libraries
import { isEqual, map } from "lodash";
import { useContext, useEffect, useState } from "react";

// Context
import { DataFlowContext } from "views/DataFlow/context";

// Components
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Iconify from "components/Icons/Iconify";
import { LabelColor } from "components/Labels/Span";
import Scrollbar from "components/Scrolls/Scrollbar";

// Types
import { NodeFlowType } from "_types_/DataFlowType";

// Contants & Utils
import {
  initNodeDefault,
  NODE_TYPE,
  OPTION_NODE_TYPE,
  randomIdNode,
} from "views/DataFlow/constants";

// ---------------------------------------------------

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  transition: theme.transitions.create("all"),
}));

const Tab = ({
  label,
  description,
  handleSelect,
}: {
  label: string;
  description: string;
  handleSelect: VoidFunction;
}) => {
  return (
    <RootStyle onClick={handleSelect}>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          noWrap: true,
          variant: "subtitle2",
        }}
        secondary={description}
        // secondaryTypographyProps={{
        //   noWrap: true,
        // }}
      />
    </RootStyle>
  );
};

const DrawerOperation = () => {
  const { state: store, updateDrawerData, updateFlow } = useContext(DataFlowContext);
  const { drawerData } = store;

  // State
  const [node, setNode] = useState<NodeFlowType>(drawerData.oldValue);

  useEffect(() => {
    if (!isEqual(drawerData.oldValue, node)) {
      setNode(drawerData.oldValue);
    }
  }, [drawerData.oldValue]);

  const handleClose = () => {
    updateDrawerData({
      isOpen: false,
      oldValue: initNodeDefault,
    });
  };

  const handleSelectTypeNode = (objValueNode: {
    label: string;
    value: NODE_TYPE;
    color: LabelColor;
    description: string;
  }) => {
    const node = {
      ...initNodeDefault,
      name: objValueNode.label,
      type: objValueNode.value,
      description: objValueNode.description,
      id: randomIdNode(),
    };

    updateFlow({
      ...store.flowSelected,
      nodes: [...(store?.flowSelected?.nodes || []), node],
    });

    handleClose();

    updateFlow({
      ...store.flowSelected,
      nodes: [...(store?.flowSelected?.nodes || []), node],
    });
  };

  return (
    <Drawer
      anchor="right"
      open={drawerData.isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: { width: 350, border: "none", overflow: "hidden" },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 1, py: 2 }}
      >
        <Typography variant="subtitle1" sx={{ ml: 1 }}>
          Chọn nội dung
        </Typography>
        <IconButton onClick={handleClose}>
          <Iconify icon={"eva:close-fill"} width={20} height={20} />
        </IconButton>
      </Stack>
      <Divider />
      <Scrollbar>
        <Stack rowGap={3} sx={{ p: 3 }}>
          <List>
            {map(OPTION_NODE_TYPE, (item) => (
              <Tab key={item.value} {...item} handleSelect={() => handleSelectTypeNode(item)} />
            ))}
          </List>
        </Stack>
      </Scrollbar>
    </Drawer>
  );
};

export default DrawerOperation;

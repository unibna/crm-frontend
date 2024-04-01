// Libraries
import { filter, find } from "lodash";
import { forwardRef, useContext, useMemo, useState } from "react";
import { NodeProps } from "reactflow";

// Context
import { DataFlowContext } from "views/DataFlow/context";

// Components
import { Card, IconButton, Stack, SxProps, Typography, useTheme } from "@mui/material";
import Iconify from "components/Icons/Iconify";
import { Span } from "components/Labels";
import Scrollbar from "components/Scrolls/Scrollbar";
import { HandleSource, HandleTarget } from "views/DataFlow/components/HandleCustom";

// Constants & Utils
import { Box, Theme } from "@mui/material";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import {
  ActionType,
  initNodeDefault,
  OPTION_NODE_TYPE,
  randomIdNode,
  NODE_TYPE,
} from "views/DataFlow/constants";

// ---------------------------------------------

export interface Props extends NodeProps {
  name?: string;
  children?: JSX.Element;
}

const ListOperation = forwardRef(
  (
    {
      containerStyles,
      isDisabled,
      onRemove,
      onDuplicate,
      onPause,
      onRun,
    }: {
      containerStyles?: SxProps<Theme>;
      isDisabled?: boolean;
      onRemove?: () => void;
      onDuplicate?: () => void;
      onPause?: () => void;
      onRun?: () => void;
    },
    ref
  ) => {
    return (
      <Stack
        direction="row"
        sx={{ width: "100%", justifyContent: "center", ...containerStyles }}
        ref={ref}
      >
        <IconButton onClick={onRemove}>
          <Iconify
            icon={"eva:trash-2-outline"}
            width={20}
            height={20}
            sx={{ pointerEvents: "none" }}
          />
        </IconButton>
        <IconButton onClick={onDuplicate}>
          <Iconify
            icon={"eva:copy-outline"}
            width={20}
            height={20}
            sx={{ pointerEvents: "none" }}
          />
        </IconButton>
      </Stack>
    );
  }
);

const NodeProvider = (props: Props) => {
  const theme = useTheme();
  const { type, children, data } = props;
  const { state: store, openPopup, updateFlow } = useContext(DataFlowContext);

  // State
  const [hover, setHover] = useState<HTMLElement | null>(null);

  const [isDisabled, setIsDisable] = useState(false);

  const handleHoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setHover(event.currentTarget);
  };

  const handleHoverClose = () => {
    setHover(null);
  };

  const handleDeleteNode = () => {
    updateFlow({
      ...store.flowSelected,
      nodes: filter(store?.flowSelected?.nodes, (item) => item.id !== props.id),
    });
  };

  const handleDuplicateNode = () => {
    const nodeDup =
      find(store?.flowSelected?.nodes, (item) => item.id === props.id) || initNodeDefault;

    updateFlow({
      ...store.flowSelected,
      nodes: [
        ...(store?.flowSelected?.nodes || []),
        { ...nodeDup, id: randomIdNode(), position: initNodeDefault.position },
      ],
    });
  };

  const objType = useMemo(() => {
    return find(OPTION_NODE_TYPE, (item) => item.value === type);
  }, [type]);

  return (
    <Stack
      direction={"column"}
      onMouseEnter={handleHoverOpen}
      onMouseLeave={handleHoverClose}
      spacing={0.2}
    >
      {
        <ListOperation
          containerStyles={{ visibility: hover ? "visible" : "hidden" }}
          isDisabled={isDisabled}
          onRemove={handleDeleteNode}
          onDuplicate={handleDuplicateNode}
          onPause={() => {
            setIsDisable(!isDisabled);
          }}
          onRun={() => {}}
        />
      }

      <Box sx={{ position: "relative", opacity: isDisabled ? 0.3 : 1 }}>
        {type === NODE_TYPE.MERGE_PARAMETER ? (
          <>
            <HandleTarget style={{ top: `calc(30px)` }} id="input1" />
            <HandleTarget style={{ top: `calc(100% / 2 - 30px + 50%)` }} id="input2" />
          </>
        ) : (
          <HandleTarget />
        )}
        <Card
          sx={{ p: 3, width: 200, minHeight: 100 }}
          onClick={() =>
            openPopup(ActionType.EDIT_NODE, { ...props, flowSelected: store.flowSelected })
          }
        >
          <Scrollbar>
            <Stack spacing={2}>
              <Typography variant="subtitle1">{getObjectPropSafely(() => data?.name)}</Typography>
              {!!getObjectPropSafely(() => data?.description) && (
                <Typography variant="caption">
                  {getObjectPropSafely(() => data?.description)}
                </Typography>
              )}

              <Span
                variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                color={objType?.color || "info"}
              >
                {objType?.label}
              </Span>
              {children}
            </Stack>
          </Scrollbar>
        </Card>
        <HandleSource />
      </Box>
    </Stack>
  );
};

const NodeWorkplaceChatbot = (props: Props) => {
  return <NodeProvider {...props}></NodeProvider>;
};

const NodeSkyFeature = (props: Props) => {
  return <NodeProvider {...props}></NodeProvider>;
};

const NodeDatetimeRange = (props: Props) => {
  return <NodeProvider {...props}></NodeProvider>;
};

const NodeDatetimeCalculate = (props: Props) => {
  return <NodeProvider {...props}></NodeProvider>;
};

const NodeShortCircuit = (props: Props) => {
  return <NodeProvider {...props}></NodeProvider>;
};

const NodeTransform = (props: Props) => {
  return <NodeProvider {...props}></NodeProvider>;
};

const NodeMerge = (props: Props) => {
  return <NodeProvider {...props}></NodeProvider>;
};

export {
  NodeWorkplaceChatbot,
  NodeSkyFeature,
  NodeDatetimeRange,
  NodeDatetimeCalculate,
  NodeShortCircuit,
  NodeTransform,
  NodeMerge,
};

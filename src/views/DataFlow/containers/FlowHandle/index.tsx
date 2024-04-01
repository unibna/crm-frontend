// Libraries
import { findIndex, forEach, isEqual, map, omit, reduce } from "lodash";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, { MarkerType, addEdge, applyEdgeChanges, applyNodeChanges } from "reactflow";

// Services
import { windflowApi } from "_apis_/windflow.api";

// Context
import { useCancelToken } from "hooks/useCancelToken";
import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";
import { dispatch as dispatchStore } from "store";
import { toastError, toastSuccess } from "store/redux/toast/slice";
import { DataFlowContext } from "views/DataFlow/context";

// Components
import { Card, CircularProgress, Stack } from "@mui/material";
import { MButton } from "components/Buttons";
import LoadingModal from "components/Loadings/LoadingModal";
import DrawerOperation from "views/DataFlow/components/DrawerOperation";
import {
  NodeDatetimeCalculate,
  NodeDatetimeRange,
  NodeMerge,
  NodeShortCircuit,
  NodeSkyFeature,
  NodeTransform,
  NodeWorkplaceChatbot,
} from "views/DataFlow/components/NodeContent";
import NodeInit from "views/DataFlow/components/NodeInit";

// Types
import { EdgeFlowType, NodeFlowType } from "_types_/DataFlowType";

// Contants & Utils
import { useTheme } from "@mui/material";
import { handleParams } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { NODE_TYPE, convertParamsApiNode, handleNodeGetApiFlow } from "views/DataFlow/constants";
import produce from "immer";

// ------------------------------------------------

// const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const FlowHandle = () => {
  const theme = useTheme();
  const { newCancelToken } = useCancelToken();
  const params = useParams();
  const { state: store, updateFlow, updatePrevFlow } = useContext(DataFlowContext);
  const { flowSelected, prevFlow } = store;
  const prevNodes: any = useRef();

  // State
  const [nodes, setNodes] = useState<NodeFlowType[]>([]);
  const [edges, setEdges] = useState<EdgeFlowType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    if (params.flowId) {
      getFlow({
        id: params.flowId,
      });
    }
  }, []);

  useDidUpdateEffect(() => {
    if (!isEqual(flowSelected.nodes, prevNodes.current)) {
      setNodes(flowSelected.nodes || []);
    }
  }, [flowSelected.nodes]);

  useDidUpdateEffect(() => {
    const newNodes: any[] = reduce(
      nodes,
      (prevArr: NodeFlowType[], current: NodeFlowType) => {
        return [
          ...prevArr,
          {
            ...omit(current, ["dragging", "height", "positionAbsolute", "selected", "width"]),
          },
        ];
      },
      []
    );

    prevNodes.current = newNodes;

    updateFlow({
      ...flowSelected,
      nodes: newNodes,
    });
  }, [nodes]);

  useDidUpdateEffect(() => {
    updateFlow({
      ...flowSelected,
      edges,
    });
  }, [edges]);

  const getFlow = async (params: Partial<any>) => {
    setLoading(true);
    const result: any = await windflowApi.getId(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      `workflows/`
    );

    if (result && result.data) {
      const { data = [] } = result.data;
      const newNodes = map(data.nodes, (item) => ({
        id: item.id,
        type: item.type,
        position: {
          x: item.position[0],
          y: item.position[1],
        },
        data: {
          name: item.display_name,
          description: item.description,
          static_data: item.static_data,
          ...handleNodeGetApiFlow(item.type, item.parameters, item.static_data),
        },
      }));

      updatePrevFlow({
        ...data,
        nodes: newNodes,
        edges: getObjectPropSafely(() => data.static_data.edges) || [],
      });

      updateFlow({
        ...data,
        nodes: newNodes,
        edges: getObjectPropSafely(() => data.static_data.edges) || [],
      });

      setNodes(newNodes);
      setEdges(getObjectPropSafely(() => data.static_data.edges) || []);
    }

    setLoading(false);
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: theme.palette.text.primary,
            },
            style: { color: "#333", strokeWidth: 1.5 },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const handleSaveFlow = async () => {
    setLoadingSave(true);
    let newNodes: NodeFlowType[] = [...(flowSelected.nodes || [])];

    forEach(flowSelected.edges, (item) => {
      const index = findIndex(flowSelected?.nodes, (current) => current.id === item.target);

      if (index !== -1) {
        newNodes = produce(newNodes, (draft: NodeFlowType[]) => {
          draft[index] = {
            ...draft[index],
            dependencies: [...(draft[index].dependencies || []), item.source],
          };
        });
      }
    });

    const params = {
      id: flowSelected.id,
      name: flowSelected.name,
      static_data: {
        edges: flowSelected.edges,
      },
      nodes: map(newNodes, (item) =>
        handleParams({
          id: item.id,
          type: item.type,
          dependencies: item.dependencies,
          static_data: getObjectPropSafely(() => item.data.static_data),
          description: getObjectPropSafely(() => item.data.description),
          position: [item.position.x, item.position.y],
          display_name: getObjectPropSafely(() => item.data.name),
          parameters: handleParams(convertParamsApiNode(item?.type, item.data)),
        })
      ),
    };

    const result = await windflowApi.update({ ...params }, "workflows/");

    if (result && result.data) {
      dispatchStore(toastSuccess({ message: "Lưu thành công" }));
    } else {
      dispatchStore(toastError({ message: "Lưu thất bại" }));
    }

    setLoadingSave(false);
  };

  const handleResetFlow = () => {
    updateFlow(prevFlow);
  };

  const nodeTypes = useMemo(
    () => ({
      [NODE_TYPE.WORKPLACE_CHATBOT]: NodeWorkplaceChatbot,
      [NODE_TYPE.SKY_FEATURE]: NodeSkyFeature,
      [NODE_TYPE.DATETIME_CALCULATE]: NodeDatetimeCalculate,
      [NODE_TYPE.DATETIME_RANGE]: NodeDatetimeRange,
      [NODE_TYPE.SHORT_CIRCUIT]: NodeShortCircuit,
      [NODE_TYPE.TRANSFORM]: NodeTransform,
      [NODE_TYPE.MERGE_PARAMETER]: NodeMerge,
    }),
    []
  );
  const proOptions = { hideAttribution: true };

  return (
    <Card sx={{ height: "90vh", display: "flex" }}>
      <div style={{ width: "100vw", height: "100%", position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{ animated: false }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          proOptions={proOptions}
          connectionLineStyle={{ stroke: theme.palette.text.primary, strokeWidth: 1 }}
          // fitView
        />
        <DrawerOperation />
        <NodeInit />
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ position: "absolute", bottom: 0, right: 0, mr: 2, mb: 2 }}
        >
          <MButton
            size="medium"
            color="warning"
            onClick={handleResetFlow}
            disabled={isEqual(flowSelected, prevFlow)}
          >
            Reset
          </MButton>
          <Stack direction="row" alignItems="center">
            <MButton
              size="medium"
              onClick={handleSaveFlow}
              disabled={isEqual(flowSelected, prevFlow)}
            >
              Lưu
            </MButton>
            {isLoadingSave && <CircularProgress size={20} sx={{ ml: 1, mt: 1 }} />}
          </Stack>
        </Stack>
        {isLoading && <LoadingModal />}
      </div>
    </Card>
  );
};

export default FlowHandle;

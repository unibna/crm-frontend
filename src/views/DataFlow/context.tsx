// Libraries
import { createContext, ReactNode, useReducer } from "react";

// Hooks
import usePopup from "hooks/usePopup";

// Components
import FlowOperation from "views/DataFlow/components/FlowOperation";
import NodeOperation from "views/DataFlow/components/NodeOperation";

// Types
import { DispatchAction, ItemColumnsDatagrid } from "_types_/ColumnType";
import { FlowType, NodeFlowType } from "_types_/DataFlowType";
import { GridSizeType } from "_types_/GridLayoutType";

// Constants
import { STATUS_ROLE_DATA_FLOW } from "constants/rolesTab";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { getColumnsShow } from "utils/tableUtil";
import {
  ActionType,
  contentRenderDefault,
  convertDefaultData,
  convertSchema,
  initNodeDefault,
  OPTION_GET_FIELD,
  OPTION_SCHEDULE,
  titlePopupHandle,
} from "views/DataFlow/constants";
import { columnShowTabContainer } from "views/ShippingView/constants";
import { find } from "lodash";

// -----------------------------------------------------------------------

type StateType = {
  // [STATUS_ROLE_DATA_FLOW.LIST]: ItemColumnsDatagrid<any>;
  flowSelected: FlowType;
  prevFlow: FlowType;
  drawerData: {
    isOpen: boolean;
    oldValue: NodeFlowType;
  };
};

const initialState: StateType = {
  // [STATUS_ROLE_DATA_FLOW.LIST]: {
  //   columnsShow: getColumnsShow(columnShowTabContainer.columnShowTable),
  //   resultColumnsShow: columnShowTabContainer.columnsShowHeader,
  //   countShowColumn: getColumnsShow(columnShowTabContainer.columnShowTable).length,
  //   columnsWidthResize: columnShowTabContainer.columnWidths,
  //   columnSelected: [],
  // },
  flowSelected: {},
  prevFlow: {},
  drawerData: {
    isOpen: false,
    oldValue: initNodeDefault,
  },
};

const reducerDataFlow = (state: StateType, action: DispatchAction) => {
  const { payload = {} } = action;

  switch (action.type) {
    default: {
      return {
        ...state,
        ...payload,
      };
    }
  }
};

const DataFlowContext = createContext<{
  state: StateType;
  // updateDataFlows: (payload: FlowType[]) => void;
  updateFlow: (payload: FlowType) => void;
  updatePrevFlow: (payload: FlowType) => void;
  updateDrawerData: (payload: { isOpen: boolean; oldValue?: NodeFlowType }) => void;
  openPopup: (type: string, defaultValue?: Partial<any>) => void;
}>({
  state: initialState,
  // updateDataFlows: () => {},
  updateFlow: () => {},
  updatePrevFlow: () => {},
  updateDrawerData: () => {},
  openPopup: () => {},
});

const DataFlowProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducerDataFlow, initialState);
  const { dataPopup, setDataPopup } = usePopup<{}>();

  const updateFlow = (payload: Partial<FlowType>) => {
    dispatch({
      type: ActionType.UPDATE_FLOW,
      payload: {
        flowSelected: {
          ...state.flowSelected,
          ...payload,
        },
      },
    });
  };

  const updatePrevFlow = (payload: Partial<FlowType>) => {
    dispatch({
      type: ActionType.UPDATE_FLOW,
      payload: {
        prevFlow: {
          ...state.prevFlow,
          ...payload,
        },
      },
    });
  };

  const updateDrawerData = (payload: { isOpen: boolean; oldValue?: NodeFlowType }) => {
    dispatch({
      type: ActionType.UPDATE_DRAWER,
      payload: {
        drawerData: {
          ...state.drawerData,
          ...payload,
        },
      },
    });
  };

  const openPopup = (type: string, defaultValue: Partial<any> = {}) => {
    let typeProduct = type;
    let funcContentSchema: any;
    let buttonTextPopup = "Cập nhật";
    let title = titlePopupHandle[type];
    let newContentRender = (methods: any) => contentRenderDefault[type];
    let defaultData = defaultValue;
    let maxWidthForm: GridSizeType = "sm";
    let isDisabledSubmit = true;
    let isShowFooter = true;
    let isFullScreen = false;

    switch (type) {
      case ActionType.CREATE_NODE:
      case ActionType.EDIT_NODE: {
        defaultData = {
          type: defaultValue.type,
          id: defaultValue.id,
          name: getObjectPropSafely(() => defaultValue.data.name) || "",
          description: getObjectPropSafely(() => defaultValue.data.description) || "",
          static_data: getObjectPropSafely(() => defaultValue.data.static_data) || {},
          ...convertDefaultData(defaultValue.type, defaultValue),
        };
        newContentRender = (methods) => {
          return <NodeOperation {...methods} flowSelected={defaultValue.flowSelected} />;
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên node"),
            description: yup.string(),
            static_data: yup.mixed(),
            ...convertSchema(defaultValue.type, yup),
          };
        };

        maxWidthForm = "xl";
        isFullScreen = true;
        break;
      }
      case ActionType.CREATE_FLOW:
      case ActionType.EDIT_FLOW: {
        const newSchedule = find(
          OPTION_SCHEDULE,
          (current) => current.label === getObjectPropSafely(() => defaultValue.schedule.value)
        );

        defaultData = {
          ...defaultValue,
          name: getObjectPropSafely(() => defaultValue.name.value) || "",
          description: defaultValue.description || "",
          static_data: defaultValue.static_data || {},
          start_date: defaultValue.start_date || "",
          end_date: defaultValue.end_date || "",
          schedule: newSchedule?.value || "@once",
          id: defaultValue.id || "",
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên"),
            description: yup.string(),
            start_date: yup.string(),
            end_date: yup.string(),
            schedule: yup.string(),
            static_data: yup.mixed(),
          };
        };
        newContentRender = (methods: any) => {
          return <FlowOperation {...methods} />;
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
      case ActionType.ADD_INTERVAL_TIME: {
        defaultData = {
          number: 1,
          interval: "",
        };
        funcContentSchema = (yup: any) => {
          return {
            interval: yup.string().required("Vui lòng chọn"),
            number: yup.number(),
          };
        };
        newContentRender = (methods: any) => {
          return <FlowOperation {...methods} />;
        };
      }
    }

    setDataPopup({
      ...dataPopup,
      maxWidthForm,
      buttonText: buttonTextPopup,
      isOpenPopup: true,
      title,
      isDisabledSubmit,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter,
      isFullScreen,
    });
  };

  return (
    <DataFlowContext.Provider
      value={{ state, updateFlow, updatePrevFlow, updateDrawerData, openPopup }}
    >
      {children}
    </DataFlowContext.Provider>
  );
};

export { DataFlowProvider, DataFlowContext };

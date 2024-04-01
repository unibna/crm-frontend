// Libraries
import { createContext, Dispatch } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import produce from "immer";

// Constants
import {
  columnShowPost,
  columnShowMessage,
  columnShowConversation,
  columnShowComment,
  actionType,
} from "views/FanpageView/constants";

// Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";
import { VariantNotificationType } from "contexts/ToastContext";

interface ItemColumns {
  columnsShow: ColumnTypeDefault<FacebookType>[];
  resultColumnsShow: ColumnTypeDefault<FacebookType>[];
  columnsWidthResize: TableColumnWidthInfo[];
  countShowColumn: number;
}
interface InitialState {
  post: ItemColumns;
  message: ItemColumns;
  conversation: ItemColumns;
  comment: ItemColumns;
  notifications: {
    message: string;
    variant: VariantNotificationType;
  };
}
interface DispatchAction {
  type: string;
  payload: any;
}

const initialState: InitialState = {
  post: {
    columnsShow: columnShowPost.columnsShowHeader,
    resultColumnsShow: columnShowPost.columnsShowHeader,
    countShowColumn: columnShowPost.columnsShowHeader.length,
    columnsWidthResize: columnShowPost.columnWidths,
  },
  message: {
    columnsShow: columnShowMessage.columnsShowHeader,
    resultColumnsShow: columnShowMessage.columnsShowHeader,
    countShowColumn: columnShowMessage.columnsShowHeader.length,
    columnsWidthResize: columnShowMessage.columnWidths,
  },
  conversation: {
    columnsShow: columnShowConversation.columnsShowHeader,
    resultColumnsShow: columnShowConversation.columnsShowHeader,
    countShowColumn: columnShowConversation.columnsShowHeader.length,
    columnsWidthResize: columnShowConversation.columnWidths,
  },
  comment: {
    columnsShow: columnShowComment.columnsShowHeader,
    resultColumnsShow: columnShowComment.columnsShowHeader,
    countShowColumn: columnShowComment.columnsShowHeader.length,
    columnsWidthResize: columnShowComment.columnWidths,
  },
  notifications: {
    message: "",
    variant: "info",
  },
};

const handleToggleVisibleColumn = (
  column: any,
  arrColumnsShow: ColumnTypeDefault<FacebookType>[],
  arrResultColumnsShow: ColumnTypeDefault<FacebookType>[]
) => {
  const { isShow, name } = column;
  let resultColumnsShow = [];
  const index = arrColumnsShow.findIndex((item) => item.name === name);
  const columnsShow = produce(arrColumnsShow, (draft) => {
    draft[index].isShow = !isShow;
  });

  if (isShow) {
    resultColumnsShow = arrResultColumnsShow.filter((item) => item.name !== name);
  } else {
    resultColumnsShow = columnsShow.filter((item: ColumnTypeDefault<FacebookType>) => item.isShow);
  }

  return {
    columnsShow,
    resultColumnsShow,
    countShowColumn: resultColumnsShow.length,
  };
};

const handleChangeColumnOrders = (
  payload: any,
  arrResultColumnsShow: ColumnTypeDefault<FacebookType>[]
) => {
  const { columnsOrder } = payload;
  const arrResult = columnsOrder.reduce((prevArr: any, name: string) => {
    const column = arrResultColumnsShow.find((item) => item.name === name);
    return [...prevArr, column];
  }, []);

  return {
    resultColumnsShow: arrResult,
  };
};

const StoreFanpage = createContext<{
  state: InitialState;
  dispatch: Dispatch<DispatchAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const reducerFacebookFanpage = (state: InitialState, action: DispatchAction): InitialState => {
  const { payload } = action;
  const { post, message, conversation, comment } = state;

  switch (action.type) {
    case actionType.UPDATE_POST: {
      const columns = handleToggleVisibleColumn(payload, post.columnsShow, post.resultColumnsShow);

      return {
        ...state,
        post: {
          ...state.post,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_CONVERSATION: {
      const columns = handleToggleVisibleColumn(
        payload,
        conversation.columnsShow,
        conversation.resultColumnsShow
      );

      return {
        ...state,
        conversation: {
          ...state.conversation,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_MESSAGE: {
      const columns = handleToggleVisibleColumn(
        payload,
        message.columnsShow,
        message.resultColumnsShow
      );

      return {
        ...state,
        message: {
          ...state.message,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COMMENT: {
      const columns = handleToggleVisibleColumn(
        payload,
        comment.columnsShow,
        comment.resultColumnsShow
      );

      return {
        ...state,
        comment: {
          ...state.comment,
          ...columns,
        },
      };
    }
    case actionType.RESIZE_COLUMN_POST: {
      return {
        ...state,
        post: {
          ...state.post,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_MESSAGE: {
      return {
        ...state,
        message: {
          ...state.message,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_CONVERSAION: {
      return {
        ...state,
        conversation: {
          ...state.conversation,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_COMMENT: {
      return {
        ...state,
        comment: {
          ...state.comment,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_POST: {
      const columns = handleChangeColumnOrders(payload, post.resultColumnsShow);

      return {
        ...state,
        post: {
          ...state.post,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_MESSAGE: {
      const columns = handleChangeColumnOrders(payload, message.resultColumnsShow);

      return {
        ...state,
        message: {
          ...state.message,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_CONVERSATION: {
      const columns = handleChangeColumnOrders(payload, conversation.resultColumnsShow);

      return {
        ...state,
        conversation: {
          ...state.conversation,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_COMMENT: {
      const columns = handleChangeColumnOrders(payload, comment.resultColumnsShow);

      return {
        ...state,
        comment: {
          ...state.comment,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_NOTIFICATIONS: {
      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...payload,
        },
      };
    }
    default: {
      return { ...state };
    }
  }
};

export { StoreFanpage, reducerFacebookFanpage, initialState };

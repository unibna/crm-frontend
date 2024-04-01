// Libraries
import { createContext, ReactNode, useReducer } from "react";

// Types
import { DispatchAction } from "_types_/ColumnType";

// Constants
import {
  getColumnsShow,
  handleChangeColumnOrders,
  handleToggleVisibleColumn,
} from "utils/tableUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { STATUS_ROLE_CONTENT_ID } from "constants/rolesTab";
import { ActionType } from "constants/index";
import {
  columnShowContentIdTotalByContentID,
  columnShowContentIdTotalByProduct,
} from "views/ReportContentIdView/constants/total";
import { paramsDefault } from "views/ReportContentIdView/constants";
import {
  columnShowContentIdFacebookByContentId,
  columnShowContentIdFacebookCampaignDetail,
} from "views/ReportContentIdView/constants/facebook";
import {
  columnShowContentIdGoogle,
  columnShowContentIdGoogleCampaignDetail,
} from "views/ReportContentIdView/constants/google";
import {
  columnShowContentIdTiktok,
  columnShowContentIdTiktokCampaignDetail,
} from "views/ReportContentIdView/constants/tiktok";
import { columnShowPhoneLead } from "views/ReportContentIdView/constants/phoneLead";
import { columnShowAttachPhone } from "views/ReportContentIdView/constants/attachPhone";

// -----------------------------------------------------------------------

const initialState: Partial<any> = {
  [STATUS_ROLE_CONTENT_ID.TOTAL_BY_CONTENT_ID]: {
    columnsShow: getColumnsShow(columnShowContentIdTotalByContentID.columnShowTable),
    resultColumnsShow: columnShowContentIdTotalByContentID.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowContentIdTotalByContentID.columnShowTable).length,
    columnsWidthResize: columnShowContentIdTotalByContentID.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_CONTENT_ID.TOTAL_BY_PRODUCT]: {
    columnsShow: getColumnsShow(columnShowContentIdTotalByProduct.columnShowTable),
    resultColumnsShow: columnShowContentIdTotalByProduct.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowContentIdTotalByProduct.columnShowTable).length,
    columnsWidthResize: columnShowContentIdTotalByProduct.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_CONTENT_ID.FACEBOOK_BY_CONTENT_ID]: {
    columnsShow: getColumnsShow(columnShowContentIdFacebookByContentId.columnShowTable),
    resultColumnsShow: columnShowContentIdFacebookByContentId.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowContentIdFacebookByContentId.columnShowTable).length,
    columnsWidthResize: columnShowContentIdFacebookByContentId.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_CONTENT_ID.FACEBOOK_BY_CAMPAIGN]: {
    columnsShow: getColumnsShow(columnShowContentIdFacebookCampaignDetail.columnShowTable),
    resultColumnsShow: columnShowContentIdFacebookCampaignDetail.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowContentIdFacebookCampaignDetail.columnShowTable)
      .length,
    columnsWidthResize: columnShowContentIdFacebookCampaignDetail.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_CONTENT_ID.GOOGLE_BY_CONTENT_ID]: {
    columnsShow: getColumnsShow(columnShowContentIdGoogle.columnShowTable),
    resultColumnsShow: columnShowContentIdGoogle.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowContentIdGoogle.columnShowTable).length,
    columnsWidthResize: columnShowContentIdGoogle.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_CONTENT_ID.GOOGLE_BY_CAMPAIGN]: {
    columnsShow: getColumnsShow(columnShowContentIdGoogleCampaignDetail.columnShowTable),
    resultColumnsShow: columnShowContentIdGoogleCampaignDetail.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowContentIdGoogleCampaignDetail.columnShowTable).length,
    columnsWidthResize: columnShowContentIdGoogleCampaignDetail.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_CONTENT_ID.TIKTOK_BY_CONTENT_ID]: {
    columnsShow: getColumnsShow(columnShowContentIdTiktok.columnShowTable),
    resultColumnsShow: columnShowContentIdTiktok.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowContentIdTiktok.columnShowTable).length,
    columnsWidthResize: columnShowContentIdTiktok.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_CONTENT_ID.TIKTOK_BY_CAMPAIGN]: {
    columnsShow: getColumnsShow(columnShowContentIdTiktokCampaignDetail.columnShowTable),
    resultColumnsShow: columnShowContentIdTiktokCampaignDetail.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowContentIdTiktokCampaignDetail.columnShowTable).length,
    columnsWidthResize: columnShowContentIdTiktokCampaignDetail.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_CONTENT_ID.PHONE_LEAD]: {
    columnsShow: getColumnsShow(columnShowPhoneLead.columnShowTable),
    resultColumnsShow: columnShowPhoneLead.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowPhoneLead.columnShowTable).length,
    columnsWidthResize: columnShowPhoneLead.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_CONTENT_ID.ATTACH_PHONE]: {
    columnsShow: getColumnsShow(columnShowAttachPhone.columnShowTable),
    resultColumnsShow: columnShowAttachPhone.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowAttachPhone.columnShowTable).length,
    columnsWidthResize: columnShowAttachPhone.columnWidths,
    columnSelected: [],
  },
  params: paramsDefault,
};

const reducerContentId = (state: Partial<any>, action: DispatchAction): Partial<any> => {
  const { payload = {} } = action;

  switch (action.type) {
    case ActionType.UPDATE_PARAMS: {
      return {
        ...state,
        params: {
          ...state.params,
          ...payload,
        },
      };
    }
    case ActionType.UPDATE_DATA_FILTER: {
      return {
        ...state,
        dataFilter: {
          ...state.dataFilter,
          ...payload,
        },
      };
    }
    default: {
      return {
        ...state,
        [action.type]: {
          ...state[action.type],
          ...payload,
        },
      };
    }
  }
};

const ContentIdContext = createContext<{
  state: Partial<any>;
  updateColumn: (type: STATUS_ROLE_CONTENT_ID, payload: Partial<any>) => void;
  updateCell: (type: STATUS_ROLE_CONTENT_ID, payload: Partial<any>) => void;
  resizeColumn: (type: STATUS_ROLE_CONTENT_ID, payload: Partial<any>) => void;
  orderColumn: (type: STATUS_ROLE_CONTENT_ID, payload: Partial<any>) => void;
  updateParams: (payload: Partial<any>) => void;
}>({
  state: initialState,
  updateColumn: () => {},
  updateCell: () => {},
  resizeColumn: () => {},
  orderColumn: () => {},
  updateParams: () => {},
});

const ContentIdProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducerContentId, initialState);

  const updateColumn = (type: STATUS_ROLE_CONTENT_ID, payload: Partial<any>) => {
    dispatch({
      type,
      payload,
    });
  };

  const updateCell = (type: STATUS_ROLE_CONTENT_ID, payload: Partial<any>) => {
    const columns = handleToggleVisibleColumn(
      payload,
      getObjectPropSafely(() => state[type].columnsShow)
    );

    dispatch({
      type,
      payload: columns,
    });
  };

  const resizeColumn = (type: STATUS_ROLE_CONTENT_ID, payload: Partial<any>) => {
    dispatch({
      type,
      payload: {
        columnsWidthResize: payload,
      },
    });
  };

  const orderColumn = (type: STATUS_ROLE_CONTENT_ID, payload: Partial<any>) => {
    const columns = handleChangeColumnOrders(
      payload,
      getObjectPropSafely(() => state[type].resultColumnsShow)
    );

    dispatch({
      type,
      payload: columns,
    });
  };

  const updateParams = (payload: Partial<any>) => {
    dispatch({
      type: ActionType.UPDATE_PARAMS,
      payload,
    });
  };

  const updateDataFilter = (payload: Partial<any>) => {
    dispatch({
      type: ActionType.UPDATE_DATA_FILTER,
      payload,
    });
  };

  return (
    <ContentIdContext.Provider
      value={{
        state,
        updateColumn,
        updateCell,
        resizeColumn,
        orderColumn,
        updateParams,
      }}
    >
      {children}
    </ContentIdContext.Provider>
  );
};

export { ContentIdProvider, ContentIdContext };

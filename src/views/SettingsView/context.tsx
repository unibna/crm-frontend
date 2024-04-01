// Libraries
import { createContext, ReactNode, useReducer } from "react";

// Types
import { DispatchAction, ItemColumnsDatagrid } from "_types_/ColumnType";

// Constants
import {
  columnSkylinkAccount,
  columnShowAdAccount,
  columnShowFanpage,
  columnShowGoogleAccount,
  columnShowCustomerAccount,
  columnShowZaloAccount,
  columnShowTiktokAccount,
  columnShowLazadaAccount,
  columnShowShopeeAccount,
  columnShowRoles,
  columnShowFacebookAccount,
  columnShowTiktokBmAccount,
  columnShowTiktokAdsAccount,
} from "views/SettingsView/constants";
import {
  getColumnsShow,
  handleChangeColumnOrders,
  handleToggleVisibleColumn,
} from "utils/tableUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { STATUS_ROLE_SETTINGS } from "constants/rolesTab";
import {
  AdAccountType,
  CustomerAccountType,
  FacebookAccountType,
  FanpageAccountType,
  GoogleAccountType,
  LazadaAccountType,
  RoleType,
  ShopeeAccountType,
  SkylinkAccountType,
  TiktokAccountType,
  ZaloAccountType,
} from "_types_/AccountType";

// -----------------------------------------------------------------------
interface InitialStateType {
  [STATUS_ROLE_SETTINGS.SKYLINK_ACCOUNT]: ItemColumnsDatagrid<SkylinkAccountType>;
  [STATUS_ROLE_SETTINGS.FACEBOOK_ACCOUNT]: ItemColumnsDatagrid<FacebookAccountType>;
  [STATUS_ROLE_SETTINGS.AD_FACEBOOK_ACCOUNT]: ItemColumnsDatagrid<AdAccountType>;
  [STATUS_ROLE_SETTINGS.GOOGLE_ACCOUNT_BM]: ItemColumnsDatagrid<GoogleAccountType>;
  [STATUS_ROLE_SETTINGS.CUSTOMER_ACCOUNT]: ItemColumnsDatagrid<CustomerAccountType>;
  [STATUS_ROLE_SETTINGS.FANPAGE_ACCOUNT]: ItemColumnsDatagrid<FanpageAccountType>;
  [STATUS_ROLE_SETTINGS.ZALO_ACCOUNT]: ItemColumnsDatagrid<ZaloAccountType>;
  [STATUS_ROLE_SETTINGS.TIKTOK_ACCOUNT]: ItemColumnsDatagrid<TiktokAccountType>;
  [STATUS_ROLE_SETTINGS.TIKTOK_BM_ACCOUNT]: ItemColumnsDatagrid<TiktokAccountType>;
  [STATUS_ROLE_SETTINGS.TIKTOK_ADS_ACCOUNT]: ItemColumnsDatagrid<TiktokAccountType>;
  [STATUS_ROLE_SETTINGS.SHOPEE_ACCOUNT]: ItemColumnsDatagrid<ShopeeAccountType>;
  [STATUS_ROLE_SETTINGS.LAZADA_ACCOUNT]: ItemColumnsDatagrid<LazadaAccountType>;
  [STATUS_ROLE_SETTINGS.ROLE]: ItemColumnsDatagrid<RoleType>;
}

const initialState: InitialStateType = {
  [STATUS_ROLE_SETTINGS.SKYLINK_ACCOUNT]: {
    columnsShow: getColumnsShow(columnSkylinkAccount.columnShowTable),
    resultColumnsShow: columnSkylinkAccount.columnsShowHeader,
    countShowColumn: getColumnsShow(columnSkylinkAccount.columnShowTable).length,
    columnsWidthResize: columnSkylinkAccount.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SETTINGS.FACEBOOK_ACCOUNT]: {
    columnsShow: getColumnsShow(columnShowFacebookAccount.columnShowTable),
    resultColumnsShow: columnShowFacebookAccount.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowFacebookAccount.columnShowTable).length,
    columnsWidthResize: columnShowFacebookAccount.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SETTINGS.AD_FACEBOOK_ACCOUNT]: {
    columnsShow: getColumnsShow(columnShowAdAccount.columnShowTable),
    resultColumnsShow: columnShowAdAccount.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowAdAccount.columnShowTable).length,
    columnsWidthResize: columnShowAdAccount.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SETTINGS.GOOGLE_ACCOUNT_BM]: {
    columnsShow: getColumnsShow(columnShowGoogleAccount.columnShowTable),
    resultColumnsShow: columnShowGoogleAccount.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowGoogleAccount.columnShowTable).length,
    columnsWidthResize: columnShowGoogleAccount.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SETTINGS.CUSTOMER_ACCOUNT]: {
    columnsShow: getColumnsShow(columnShowCustomerAccount.columnShowTable),
    resultColumnsShow: columnShowCustomerAccount.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowCustomerAccount.columnShowTable).length,
    columnsWidthResize: columnShowCustomerAccount.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SETTINGS.FANPAGE_ACCOUNT]: {
    columnsShow: getColumnsShow(columnShowFanpage.columnShowTable),
    resultColumnsShow: columnShowFanpage.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowFanpage.columnShowTable).length,
    columnsWidthResize: columnShowFanpage.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SETTINGS.ZALO_ACCOUNT]: {
    columnsShow: getColumnsShow(columnShowZaloAccount.columnShowTable),
    resultColumnsShow: columnShowZaloAccount.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowZaloAccount.columnShowTable).length,
    columnsWidthResize: columnShowZaloAccount.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SETTINGS.TIKTOK_ACCOUNT]: {
    columnsShow: getColumnsShow(columnShowTiktokAccount.columnShowTable),
    resultColumnsShow: columnShowTiktokAccount.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowTiktokAccount.columnShowTable).length,
    columnsWidthResize: columnShowTiktokAccount.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SETTINGS.TIKTOK_BM_ACCOUNT]: {
    columnsShow: getColumnsShow(columnShowTiktokBmAccount.columnShowTable),
    resultColumnsShow: columnShowTiktokBmAccount.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowTiktokBmAccount.columnShowTable).length,
    columnsWidthResize: columnShowTiktokBmAccount.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SETTINGS.TIKTOK_ADS_ACCOUNT]: {
    columnsShow: getColumnsShow(columnShowTiktokAdsAccount.columnShowTable),
    resultColumnsShow: columnShowTiktokAdsAccount.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowTiktokAdsAccount.columnShowTable).length,
    columnsWidthResize: columnShowTiktokAdsAccount.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SETTINGS.LAZADA_ACCOUNT]: {
    columnsShow: getColumnsShow(columnShowLazadaAccount.columnShowTable),
    resultColumnsShow: columnShowLazadaAccount.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowLazadaAccount.columnShowTable).length,
    columnsWidthResize: columnShowLazadaAccount.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SETTINGS.SHOPEE_ACCOUNT]: {
    columnsShow: getColumnsShow(columnShowShopeeAccount.columnShowTable),
    resultColumnsShow: columnShowShopeeAccount.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowShopeeAccount.columnShowTable).length,
    columnsWidthResize: columnShowShopeeAccount.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SETTINGS.ROLE]: {
    columnsShow: getColumnsShow(columnShowRoles.columnShowTable),
    resultColumnsShow: columnShowRoles.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowRoles.columnShowTable).length,
    columnsWidthResize: columnShowRoles.columnWidths,
    columnSelected: [],
  },
};

const reducerShipping = (state: Partial<any>, action: DispatchAction): Partial<any> => {
  const { payload = {} } = action;

  switch (action.type) {
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

const SettingContext = createContext<{
  state: Partial<any>;
  updateColumn: (type: STATUS_ROLE_SETTINGS, payload: Partial<any>) => void;
  updateCell: (type: STATUS_ROLE_SETTINGS, payload: Partial<any>) => void;
  resizeColumn: (type: STATUS_ROLE_SETTINGS, payload: Partial<any>) => void;
  orderColumn: (type: STATUS_ROLE_SETTINGS, payload: Partial<any>) => void;
}>({
  state: initialState,
  updateColumn: () => {},
  updateCell: () => {},
  resizeColumn: () => {},
  orderColumn: () => {},
});

const SettingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducerShipping, initialState);

  const updateColumn = (type: STATUS_ROLE_SETTINGS, payload: Partial<any>) => {
    dispatch({
      type,
      payload,
    });
  };

  const updateCell = (type: STATUS_ROLE_SETTINGS, payload: Partial<any>) => {
    const columns = handleToggleVisibleColumn(
      payload,
      getObjectPropSafely(() => state[type].columnsShow)
    );

    dispatch({
      type,
      payload: columns,
    });
  };

  const resizeColumn = (type: STATUS_ROLE_SETTINGS, payload: Partial<any>) => {
    dispatch({
      type,
      payload: {
        columnsWidthResize: payload,
      },
    });
  };

  const orderColumn = (type: STATUS_ROLE_SETTINGS, payload: Partial<any>) => {
    const columns = handleChangeColumnOrders(
      payload,
      getObjectPropSafely(() => state[type].resultColumnsShow)
    );

    dispatch({
      type,
      payload: columns,
    });
  };

  return (
    <SettingContext.Provider value={{ state, updateColumn, updateCell, resizeColumn, orderColumn }}>
      {children}
    </SettingContext.Provider>
  );
};

export { SettingProvider, SettingContext };

// Libraries
import { useEffect, useContext, useMemo, useRef, useState, useCallback } from "react";
import produce from "immer";

// Context
import { SettingContext } from "views/SettingsView/context";
import { useAppDispatch } from "hooks/reduxHook";
import { toastSuccess, toastWarning } from "store/redux/toast/slice";

// Services
import { facebookApi } from "_apis_/facebook.api";

// Components
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";

// Types
import { AdAccountType, SkylinkAccountType } from "_types_/AccountType";

// Constants
import {
  statusSync,
  message,
  checkLocalStorage,
  keySaveTimeOnLocal,
  MAX_TIME_LOAD_DATA,
  MAX_COUNT_SYNC,
  propsTableDefault,
  arrColumnShowInfo,
  handleDataItem,
} from "views/SettingsView/constants";
import { setStorage } from "utils/asyncStorageUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { STATUS_ROLE_SETTINGS } from "constants/rolesTab";
import { tanentApi } from "_apis_/tanent.api";
import { TanentType } from "_types_/FacebookType";
import { TANENT_URL } from "constants/index";

const AdAccount = () => {
  const dispatch = useAppDispatch();
  let arrInterval: any = useRef([]);
  let intervalLoadData: any = useRef(null);
  let arrData: any = useRef([]);
  let count = 0;
  const { state: store, updateCell, resizeColumn, orderColumn } = useContext(SettingContext);

  // State
  const [data, setData] = useState<AdAccountType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    limit: 200,
    ordering: "-created",
  });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [name, setName] = useState("");
  const [tenantUrl, setTenantUrl] = useState<TanentType[]>([]);

  const { [STATUS_ROLE_SETTINGS.AD_FACEBOOK_ACCOUNT]: columns } = store;

  useEffect(() => {
    loadDataRealTime();

    return () => {
      arrInterval?.current.forEach(clearInterval);
      clearInterval(intervalLoadData?.current);
    };
  }, []);

  const loadDataTable = useCallback(() => {
    const objParams = {
      ...params,
    };
    getListFacebookAdAccount(objParams);
  }, [params]);

  const loadDataRealTime = () => {
    intervalLoadData.current = setInterval(() => {
      loadDataTable();
    }, MAX_TIME_LOAD_DATA);
  };

  const getListFacebookAdAccount = async (params: any) => {
    if (params) {
      setLoading(true);
      const result = await facebookApi.get(params, "ad-accounts/");

      if (result && result.data) {
        const { results = [], count = 0 } = result.data;
        const newData: any = results.map((item: SkylinkAccountType) => {
          return {
            ...item,
            isLoading: false,
            operation_refresh: {
              labelDialog: message.MESSAGE_POPUP_TUNR_ON_AD_ACCOUNT,
              isShowRefresh: item.sync_is_active,
              disabled: checkLocalStorage(
                `${keySaveTimeOnLocal.TIME_SYNC_AD_ACCOUNT}-${item.ad_account_id}`
              ),
            },
            ...handleDataItem(item),
          };
        });

        arrData.current = newData;

        setData(newData);
        setDataTotal(count);
      }

      setLoading(false);
    }
  };
  const getListTenantUrl = useCallback(async () => {
    const res = await tanentApi.getTenant<TanentType>({
      params: { limit: 200, page: 1 },
      endpoint: "tenant-facebook-ad-account/",
    });

    if (res.data) {
      const { results = [] } = res.data;
      setTenantUrl(results);
    }
  }, [params]);

  const handleData = (objData: any, dataSyncAdAccount: AdAccountType[]) => {
    return produce(dataSyncAdAccount, (draft: any) => {
      const index = draft.findIndex((item: any) => item.ad_account_id === objData.ad_account_id);
      if (index !== -1) {
        draft[index] = {
          ...draft[index],
          ...objData,
        };
      }
    });
  };

  const hanldeSyncData = (itemSync: any) => {
    itemSync.interval = setInterval(async () => {
      const result: any = await facebookApi.getId({ id: itemSync.ad_account_id }, "ad-accounts/");
      const { status_sync } = result.data;
      // Tối đa 200 lần gọi
      count = count + 1;
      if (count < MAX_COUNT_SYNC) {
        switch (status_sync) {
          case statusSync.IP:
          case statusSync.OH: {
            const newData = handleData({ ...result.data, isLoading: true }, arrData.current);
            arrData.current = newData;

            setData(newData);

            break;
          }
          case statusSync.RJ: {
            clearInterval(itemSync.interval);

            const newData = handleData({ ...result.data, isLoading: false }, arrData.current);
            arrData.current = newData;
            setData(newData);

            break;
          }
          case statusSync.CO: {
            clearInterval(itemSync.interval);

            const newData = handleData({ ...result.data, isLoading: false }, arrData.current);
            arrData.current = newData;
            setData(newData);
            break;
          }
        }
      } else {
        clearInterval(itemSync.interval);
      }
    }, 5000);

    arrInterval.current.push(itemSync.interval);
  };

  const hanldeTurnOffSyncData = (itemSync: any) => {
    itemSync.interval = setInterval(async () => {
      const result: any = await facebookApi.getId({ id: itemSync.ad_account_id }, "ad-accounts/");
      const { status_sync } = result.data;
      // Tối đa 200 lần gọi
      count = count + 1;
      if (count < MAX_COUNT_SYNC) {
        switch (status_sync) {
          case statusSync.IP: {
            const newData = handleData({ ...result.data, isLoading: true }, arrData.current);
            arrData.current = newData;

            setData(newData);

            break;
          }
          case statusSync.OH: {
            clearInterval(itemSync.interval);

            const newData = handleData({ ...result.data, isLoading: false }, arrData.current);
            arrData.current = newData;
            setData(newData);

            break;
          }
        }
      } else {
        clearInterval(itemSync.interval);
      }
    }, 2000);

    arrInterval.current.push(itemSync.interval);
  };

  const onToggleSwitch = async (
    isActive: boolean,
    id: string,
    switchType: string,
    switchStatus: boolean
  ) => {
    // sync is active
    const params = {
      id,
      sync_is_active: isActive,
    };

    const result: any = await facebookApi.update(params, "ad-accounts/");
    if (result && result.data) {
      const newDataState = handleData(
        { ...result.data, sync_is_active: !isActive, isLoading: true },
        arrData.current
      );

      setData(newDataState);

      arrData.current = newDataState;
      if (isActive) {
        if ([statusSync.CO, statusSync.RJ].includes(result.data.status_sync)) {
          const newData = handleData({ ...result.data, isLoading: false }, data);
          arrData.current = newData;
          newDataState;
        } else {
          hanldeSyncData({ ...result.data, interval: null });
        }
      } else {
        if ([statusSync.OH].includes(result.data.status_sync)) {
          const newData = handleData({ ...result.data, isLoading: false }, data);
          arrData.current = newData;
          newDataState;
        } else {
          hanldeTurnOffSyncData({ ...result.data, interval: null });
        }
      }
    } else {
      dispatch(toastWarning({ message: result.message }));
    }
  };

  const addTenantUrl = async (id: string, url: string) => {
    const addRes = await tanentApi.createTenant(
      { fb_ad_account_id: id, url_tenant: url },
      "tenant-facebook-ad-account/"
    );

    if ((addRes as any).status === 201) {
      await getListTenantUrl();
    } else {
      dispatch(toastWarning({ message: "Cập nhập không thành công" }));
    }
  };
  const removeTenantUrl = async (id: string, url: string) => {
    const tenant = tenantUrl.find(
      (item) => item["fb_ad_account_id"] === id && item.tenant.url_tenant?.includes(url)
    );
    if (tenant) {
      const removeRes = await tanentApi.deleteTenant(
        {},
        `tenant-facebook-ad-account/${tenant.id}/`
      );
      if (removeRes) {
        getListTenantUrl();
      } else {
        dispatch(toastWarning({ message: "Cập nhập không thành công" }));
      }
    } else {
      dispatch(toastWarning({ message: "Tenant không tồn tại" }));
    }
  };

  const onToggleSyncTannetSwitch = async (checked: boolean, id: string, columnName: string) => {
    const url = columnName === "sync_habt" ? TANENT_URL.HABT : TANENT_URL.JP24;
    setLoading(true);
    if (checked) {
      await addTenantUrl(id, url);
    } else {
      await removeTenantUrl(id, url);
    }
    setLoading(false);
  };

  const handleOperationRefresh = async (row: any) => {
    const params = {
      id: row.ad_account_id,
      sync_is_active: true,
    };

    setStorage(`${keySaveTimeOnLocal.TIME_SYNC_AD_ACCOUNT}-${row.ad_account_id}`, new Date());

    const result: any = await facebookApi.update(params, "ad-accounts/");

    if (result) {
      loadDataTable();

      dispatch(toastSuccess({ message: message.SYNC_SUCCESS }));
    }
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleFilter = (paramsProps: any) => {
    if (Object.keys(paramsProps)[0] === "name") {
      setName(paramsProps.name);
    } else {
      setParams({
        ...params,
        ...paramsProps,
      });
    }
  };

  const renderHeader = () => {
    return (
      <HeaderFilter
        searchInput={[
          {
            keySearch: "name",
            label: "Nhập tên",
          },
        ]}
        columns={columns}
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_SETTINGS.AD_FACEBOOK_ACCOUNT, columns)}
        handleRefresh={handleRefresh}
        handleFilter={handleFilter}
      />
    );
  };

  const newData = useMemo(() => {
    return name
      ? data.filter((item: any) => {
          return (
            getObjectPropSafely(() =>
              item.ad_account_name.toLowerCase().indexOf(name.toLowerCase())
            ) !== -1
          );
        })
      : data;
  }, [name, data]);

  useEffect(() => {
    loadDataTable();
  }, [loadDataTable]);

  useEffect(() => {
    getListTenantUrl();
  }, [getListTenantUrl]);

  return (
    <DataGrid
      {...propsTableDefault}
      data={newData}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={columns.resultColumnsShow}
      columnWidths={columns.columnsWidthResize}
      isLoadingTable={isLoading}
      renderHeader={renderHeader}
      contentColumnSwitch={{
        arrColumnSwitch: ["sync_is_active"],
        keySwitchToggle: "ad_account_id",
        messagePopupTurnOn: message.MESSAGE_POPUP_TUNR_ON_AD_ACCOUNT,
        messagePopupTurnOff: message.MESSAGE_POPUP_TUNR_OFF_AD_ACCOUNT,
        onToggleSwitch: onToggleSwitch,
      }}
      //tenant
      getCheckedValue={(id, tenantName) =>
        tenantUrl.find(
          (item) => item.fb_ad_account_id === id && item.tenant.url_tenant?.includes(tenantName)
        )
      }
      accountKey="ad_account_id"
      tenantKey="fb_ad_account_id"
      onToggleSyncTannetSwitch={onToggleSyncTannetSwitch}
      // end tanent
      contentColumnHandleOperation={{
        arrColumnHandleOperation: ["operation_refresh"],
        handleRefresh: handleOperationRefresh,
      }}
      contentColumnShowInfo={{
        arrColumnShowInfo: arrColumnShowInfo,
        infoCell: columns.columnsShow,
      }}
      setColumnWidths={(columns) => resizeColumn(STATUS_ROLE_SETTINGS.AD_FACEBOOK_ACCOUNT, columns)}
      handleChangeColumnOrder={(columns) =>
        orderColumn(STATUS_ROLE_SETTINGS.AD_FACEBOOK_ACCOUNT, columns)
      }
      handleChangeRowsPerPage={(rowPage: number) =>
        setParams({
          ...params,
          limit: rowPage,
          page: 1,
        })
      }
      handleChangePage={(page: number) => setParams({ ...params, page })}
    />
  );
};
export default AdAccount;

// Libraries
import { useEffect, useContext, useMemo, useRef, useState, useCallback } from "react";
import produce from "immer";

// Context
import { SettingContext } from "views/SettingsView/context";
import { toastSuccess, toastWarning } from "store/redux/toast/slice";
import { useAppDispatch } from "hooks/reduxHook";

// Services
import { googleInfo } from "_apis_/google.api";

// Components
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";

// Types
import { CustomerAccountType } from "_types_/AccountType";

// Constants
import {
  message,
  MAX_COUNT_SYNC,
  statusSync,
  MAX_TIME_LOAD_DATA,
  checkLocalStorage,
  keySaveTimeOnLocal,
  propsTableDefault,
  arrColumnShowInfo,
  handleDataItem,
} from "views/SettingsView/constants";
import { setStorage } from "utils/asyncStorageUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { STATUS_ROLE_SETTINGS } from "constants/rolesTab";
import { TanentType } from "_types_/FacebookType";
import { tanentApi } from "_apis_/tanent.api";
import { TANENT_URL } from "constants/index";

const CustomerAccount = () => {
  const dispatch = useAppDispatch();
  let arrInterval: any = useRef([]);
  let arrData: any = useRef([]);
  let intervalLoadData: any = useRef(null);
  let count = 0;
  const {
    state: store,
    updateColumn,
    updateCell,
    resizeColumn,
    orderColumn,
  } = useContext(SettingContext);

  // State
  const [data, setData] = useState<CustomerAccountType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    limit: 200,
    ordering: "-created",
  });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [name, setName] = useState("");
  const [tenantUrl, setTenantUrl] = useState<TanentType[]>([]);
  const { [STATUS_ROLE_SETTINGS.CUSTOMER_ACCOUNT]: columns } = store;

  const loadDataTable = () => {
    const objParams = {
      ...params,
    };
    getListCustomerAccount(objParams);
  };

  const loadDataRealTime = () => {
    intervalLoadData.current = setInterval(() => {
      loadDataTable();
    }, MAX_TIME_LOAD_DATA);
  };

  const getListCustomerAccount = async (params: any) => {
    if (params) {
      setLoading(true);
      const result = await googleInfo.get(params, "customers/");

      if (result && result.data) {
        const { results = [], count = 0 } = result.data;
        const newData = results.map((item: CustomerAccountType) => {
          return {
            ...item,
            isLoading: false,
            operation_refresh: {
              labelDialog: message.MESSAGE_POPUP_TUNR_ON_CUSTOMER,
              isShowRefresh: item.sync_is_active,
              disabled: checkLocalStorage(
                `${keySaveTimeOnLocal.TIME_SYNC_CUSTOMER}-${item.customer_id}`
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

  const handleData = (objData: any, dataSyncAdAccount: CustomerAccountType[]) => {
    return produce(dataSyncAdAccount, (draft: any) => {
      const index = draft.findIndex((item: any) => item.customer_id === objData.customer_id);
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
      const result: any = await googleInfo.getId({ id: itemSync.customer_id }, "customers/");
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
      const result: any = await googleInfo.getId({ id: itemSync.customer_id }, "customers/");
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

  const onToggleSwitch = async (isActive: boolean, id: string) => {
    const params = {
      id,
      sync_is_active: isActive,
    };

    const result: any = await googleInfo.update(params, "customers/");
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
          setData(newData);
        } else {
          hanldeSyncData({ ...result.data, interval: null });
        }
      } else {
        if ([statusSync.OH].includes(result.data.status_sync)) {
          const newData = handleData({ ...result.data, isLoading: false }, data);
          arrData.current = newData;
          setData(newData);
          hanldeTurnOffSyncData({ ...result.data, interval: null });
        }
      }
    } else {
      dispatch(toastWarning({ message: result.message }));
    }
  };

  const handleOperationRefresh = async (row: any) => {
    const params = {
      id: row.customer_id,
      sync_is_active: true,
    };

    setStorage(`${keySaveTimeOnLocal.TIME_SYNC_CUSTOMER}-${row.customer_id}`, new Date());

    const result: any = await googleInfo.update(params, "customers/");

    if (result) {
      loadDataTable();
      dispatch(toastSuccess({ message: message.SYNC_SUCCESS }));
    }
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleFilter = (paramsProps: any) => {
    setParams({
      ...params,
      ...paramsProps,
    });
  };

  const renderHeader = () => {
    return (
      <HeaderFilter
        searchInput={[
          {
            keySearch: "name",
            label: "Nhập khách hàng",
          },
        ]}
        columns={columns}
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_SETTINGS.CUSTOMER_ACCOUNT, columns)}
        handleRefresh={handleRefresh}
        handleFilter={handleFilter}
      />
    );
  };

  const newData = useMemo(() => {
    return name
      ? data.filter((item: any) => {
          return (
            getObjectPropSafely(() => item.name.toLowerCase().indexOf(name.toLowerCase())) !== -1
          );
        })
      : data;
  }, [name, data]);

  //tenant

  const getListTenantUrl = useCallback(async () => {
    const res = await tanentApi.getTenant<TanentType>({
      params: { limit: 200, page: 1 },
      endpoint: "tenant-google-customer/",
    });

    if (res.data) {
      const { results = [] } = res.data;
      setTenantUrl(results);
    }
    console.log("getListTenantUrl", res.data);
  }, [params]);

  const addTenantUrl = async (id: string, url: string) => {
    const addRes = await tanentApi.createTenant(
      { gg_customer_id: id, url_tenant: url },
      "tenant-google-customer/"
    );

    if ((addRes as any).status === 201) {
      await getListTenantUrl();
    } else {
      dispatch(toastWarning({ message: "Cập nhập không thành công" }));
    }
  };
  const removeTenantUrl = async (id: string, url: string) => {
    const tenant = tenantUrl.find(
      (item) => item["gg_customer_id"] === id && item.tenant.url_tenant?.includes(url)
    );
    if (tenant) {
      const removeRes = await tanentApi.deleteTenant({}, `tenant-google-customer/${tenant.id}/`);
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
  //endtenant

  useEffect(() => {
    loadDataRealTime();
  }, []);

  useEffect(() => {
    return () => {
      arrInterval?.current.forEach(clearInterval);
      clearInterval(intervalLoadData?.current);
    };
  }, []);

  useEffect(() => {
    loadDataTable();
  }, [params]);

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
      contentColumnSwitch={{
        arrColumnSwitch: ["sync_is_active"],
        keySwitchToggle: "customer_id",
        messagePopupTurnOn: message.MESSAGE_POPUP_TUNR_ON_CUSTOMER,
        messagePopupTurnOff: message.MESSAGE_POPUP_TUNR_OFF_CUSTOMER,
        onToggleSwitch: onToggleSwitch,
      }}
      //tenant
      getCheckedValue={(id, tenantName) =>
        tenantUrl.find(
          (item) => item.gg_customer_id === id && item.tenant.url_tenant?.includes(tenantName)
        )
      }
      accountKey="customer_id"
      tenantKey="gg_customer_id"
      onToggleSyncTannetSwitch={onToggleSyncTannetSwitch}
      //endtenant
      contentColumnHandleOperation={{
        arrColumnHandleOperation: ["operation_refresh"],
        handleRefresh: handleOperationRefresh,
      }}
      contentColumnShowInfo={{
        arrColumnShowInfo: arrColumnShowInfo,
        infoCell: columns.columnsShow,
      }}
      renderHeader={renderHeader}
      setColumnWidths={(columns) => resizeColumn(STATUS_ROLE_SETTINGS.CUSTOMER_ACCOUNT, columns)}
      handleChangeColumnOrder={(columns) =>
        orderColumn(STATUS_ROLE_SETTINGS.CUSTOMER_ACCOUNT, columns)
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
export default CustomerAccount;

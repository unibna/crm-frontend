import { tiktokAdsApi } from "_apis_/tiktok/tiktok_ads.api";
import { TiktokAdvertiserUserType } from "_types_/AccountType";
import DataGrid from "components/DataGrid";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import { STATUS_ROLE_SETTINGS } from "constants/rolesTab";
import { useAppDispatch } from "hooks/reduxHook";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { arrColumnShowInfo, propsTableDefault } from "views/SettingsView/constants";
import { SettingContext } from "views/SettingsView/context";
import { handleDataItem } from "views/SettingsView/constants";
import { tanentApi } from "_apis_/tanent.api";
import { TanentType } from "_types_/FacebookType";
import { toastWarning } from "store/redux/toast/slice";
import { TANENT_URL } from "constants/index";

const TiktokAdsAccount = () => {
  const dispatch = useAppDispatch();
  let arrData: any = useRef([]);
  const { state: store, updateCell, resizeColumn, orderColumn } = useContext(SettingContext);

  // State
  const [data, setData] = useState<TiktokAdvertiserUserType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [name, setName] = useState("");

  const [tenantUrl, setTenantUrl] = useState<TanentType[]>([]);

  const { [STATUS_ROLE_SETTINGS.TIKTOK_ADS_ACCOUNT]: columns } = store;

  useEffect(() => {
    loadDataTable();
  }, [params]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
    };
    getListTiktokAdsAccount(objParams);
  };

  const getListTiktokAdsAccount = async (params: any) => {
    if (params) {
      setLoading(true);
      const result = await tiktokAdsApi.get<TiktokAdvertiserUserType>(params, "advertisers/");

      if (result && result.data) {
        const { results = [], count = 0 } = result.data;
        const newData = results.map((item) => {
          return {
            ...item,
            isLoading: false,
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

  const onToggleSwitch = async (
    isActive: boolean,
    id: string,
    columnName: string,
    isLoading: boolean,
    row: any
  ) => {
    const result = await tiktokAdsApi.update(
      { sync_is_active: isActive, advertiser_id: id, core_user: row.core_user },
      `advertisers/${id}/`
    );

    if (result && result.data) {
      loadDataTable();
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
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_SETTINGS.TIKTOK_ADS_ACCOUNT, columns)}
        handleRefresh={handleRefresh}
        handleFilter={handleFilter}
      />
    );
  };

  //tenant

  const getListTenantUrl = useCallback(async () => {
    const res = await tanentApi.getTenant<TanentType>({
      params: { limit: 200, page: 1 },
      endpoint: "tenant-tiktok-advertiser/",
    });

    if (res.data) {
      const { results = [] } = res.data;
      setTenantUrl(results);
    }
    console.log("getListTenantUrl", res.data);
  }, [params]);

  const addTenantUrl = async (id: string, url: string) => {
    const addRes = await tanentApi.createTenant(
      { advertiser_id: id, url_tenant: url },
      "tenant-tiktok-advertiser/"
    );

    if ((addRes as any).status === 201) {
      await getListTenantUrl();
    } else {
      dispatch(toastWarning({ message: "Cập nhập không thành công" }));
    }
  };
  const removeTenantUrl = async (id: string, url: string) => {
    const tenant = tenantUrl.find(
      (item) => item["advertiser"] === id && item.tenant.url_tenant?.includes(url)
    );
    if (tenant) {
      const removeRes = await tanentApi.deleteTenant({}, `tenant-tiktok-advertiser/${tenant.id}/`);
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
        keySwitchToggle: "advertiser_id",
        onToggleSwitch: onToggleSwitch,
      }}
      //tenant
      getCheckedValue={(id, tenantName) =>
        tenantUrl.find(
          (item) => item.advertiser === id && item.tenant.url_tenant?.includes(tenantName)
        )
      }
      accountKey="advertiser_id"
      tenantKey="advertiser"
      onToggleSyncTannetSwitch={onToggleSyncTannetSwitch}
      //endtenant
      contentColumnShowInfo={{
        arrColumnShowInfo: arrColumnShowInfo,
        infoCell: columns.columnsShow,
      }}
      setColumnWidths={(columns) => resizeColumn(STATUS_ROLE_SETTINGS.TIKTOK_ADS_ACCOUNT, columns)}
      handleChangeColumnOrder={(columns) =>
        orderColumn(STATUS_ROLE_SETTINGS.TIKTOK_ADS_ACCOUNT, columns)
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
export default TiktokAdsAccount;

// Libraries
import { useEffect, useRef, useContext, useState } from "react";

// Context
import { SettingContext } from "views/SettingsView/context";
import { useAppDispatch } from "hooks/reduxHook";
import { toastSuccess } from "store/redux/toast/slice";

// Services
import { googleInfo } from "_apis_/google.api";

// Components
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";

// Types
import { GoogleAccountType } from "_types_/AccountType";

// Constants
import {
  message,
  MAX_TIME_LOAD_DATA,
  checkLocalStorage,
  keySaveTimeOnLocal,
  propsTableDefault,
  arrColumnShowInfo,
  handleDataItem,
} from "views/SettingsView/constants";
import { setStorage } from "utils/asyncStorageUtil";
import { STATUS_ROLE_SETTINGS } from "constants/rolesTab";

const GoogleAccount = () => {
  const dispatch = useAppDispatch();
  let arrData: any = useRef([]);
  let intervalLoadData: any = useRef(null);
  const {
    state: store,
    updateColumn,
    updateCell,
    resizeColumn,
    orderColumn,
  } = useContext(SettingContext);

  // State
  const [data, setData] = useState<GoogleAccountType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    limit: 200,
    ordering: "-created",
  });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [name, setName] = useState("");

  const { [STATUS_ROLE_SETTINGS.GOOGLE_ACCOUNT_BM]: columns } = store;

  useEffect(() => {
    loadDataRealTime();
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(intervalLoadData?.current);
    };
  }, []);

  useEffect(() => {
    loadDataTable();
  }, [params]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
    };
    getListGoogleAccount(objParams);
  };

  const loadDataRealTime = () => {
    intervalLoadData.current = setInterval(() => {
      loadDataTable();
    }, MAX_TIME_LOAD_DATA);
  };

  const getListGoogleAccount = async (params: any) => {
    if (params) {
      setLoading(true);
      const result = await googleInfo.get(params, "accounts/");

      if (result && result.data) {
        const { results = [], count = 0 } = result.data;
        const newData = results.map((item: GoogleAccountType) => {
          const { login_customer_id } = item;

          return {
            ...item,
            id: login_customer_id,
            operation_delete: {
              labelDialog:
                "Dữ liệu Google của tài khoản này sẽ được xóa tất cả. Bạn có chắc chắn với điều này",
              isShowDelete: true,
            },
            operation_refresh: {
              labelDialog:
                "Dữ liệu Google của tài khoản này sẽ được đồng bộ các thông tin sau: Customer(all)",
              isShowRefresh: true,
              disabled: checkLocalStorage(
                `${keySaveTimeOnLocal.TIME_SYNC_GOOGLE_ACCOUNT}-${login_customer_id}`
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

  const handleOperationRefresh = async (row: any) => {
    const params = {
      id: row.login_customer_id,
      sync_is_active: true,
    };

    setStorage(
      `${keySaveTimeOnLocal.TIME_SYNC_GOOGLE_ACCOUNT}-${row.login_customer_id}`,
      new Date()
    );

    const result: any = await googleInfo.update(params, "accounts/");

    if (result) {
      loadDataTable();

      dispatch(toastSuccess({ message: message.SYNC_SUCCESS }));
    }
  };

  const handleOperationDelete = async (row: any) => {
    const params = {
      id: row.login_customer_id,
    };

    setLoading(true);

    const result: any = await googleInfo.remove(params, "accounts/");

    if (result) {
      loadDataTable();
    }

    setLoading(false);
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const renderHeader = () => {
    return (
      <HeaderFilter
        columns={columns}
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_SETTINGS.GOOGLE_ACCOUNT_BM, columns)}
        isShowFilter={false}
        handleRefresh={handleRefresh}
      />
    );
  };

  return (
    <DataGrid
      {...propsTableDefault}
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={columns.resultColumnsShow}
      columnWidths={columns.columnsWidthResize}
      isLoadingTable={isLoading}
      renderHeader={renderHeader}
      contentColumnHandleOperation={{
        arrColumnHandleOperation: ["operation_refresh", "operation_delete"],
        handleDelete: handleOperationDelete,
        handleRefresh: handleOperationRefresh,
      }}
      contentColumnShowInfo={{
        arrColumnShowInfo: arrColumnShowInfo,
        infoCell: columns.columnsShow,
      }}
      setColumnWidths={(columns) => resizeColumn(STATUS_ROLE_SETTINGS.GOOGLE_ACCOUNT_BM, columns)}
      handleChangeColumnOrder={(columns) =>
        orderColumn(STATUS_ROLE_SETTINGS.GOOGLE_ACCOUNT_BM, columns)
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
export default GoogleAccount;

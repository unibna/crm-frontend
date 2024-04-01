// Libraries
import { useEffect, useRef, useContext, useState } from "react";
import { useLocation } from "react-router-dom";

// Context
import { SettingContext } from "views/SettingsView/context";
import { useAppDispatch } from "hooks/reduxHook";
import { toastError, toastSuccess } from "store/redux/toast/slice";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Components
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";

// Types
import { ZaloAccountType } from "_types_/AccountType";

// Constants
import {
  message,
  MAX_TIME_LOAD_DATA,
  ZALO_REFRESH_TOKEN_URL,
  SECRET_KEY_STORAGE_ZALO,
  checkLocalStorage,
  keySaveTimeOnLocal,
  arrColumnShowInfo,
  propsTableDefault,
} from "views/SettingsView/constants";
import { setStorage, getStorage, deleteStorage } from "utils/asyncStorageUtil";
import { random } from "utils/randomUtil";
import { STATUS_ROLE_SETTINGS } from "constants/rolesTab";

const ZaloAccount = () => {
  const dispatch = useAppDispatch();
  let arrData: any = useRef([]);
  let intervalLoadData: any = useRef(null);
  const { search } = useLocation();

  const { state: store, updateCell, resizeColumn, orderColumn } = useContext(SettingContext);

  // State
  const [data, setData] = useState<ZaloAccountType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "-created" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [name, setName] = useState("");

  const { [STATUS_ROLE_SETTINGS.ZALO_ACCOUNT]: columns } = store;

  useEffect(() => {
    const objPath = new URLSearchParams(search);
    const secretCode = getStorage(SECRET_KEY_STORAGE_ZALO);
    const paramsSecretCode = objPath.get("secret_code");
    const paramsStatus = objPath.get("status") as keyof typeof message.LOGIN_ZALO;

    if (paramsSecretCode && paramsStatus && paramsSecretCode === secretCode) {
      dispatch(
        paramsStatus === "success"
          ? toastSuccess({ message: message.LOGIN_ZALO[paramsStatus] })
          : toastError({ message: message.LOGIN_ZALO[paramsStatus] })
      );

      deleteStorage(SECRET_KEY_STORAGE_ZALO);
    }

    loadDataRealTime();
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
    getListZaloAccount(objParams);
  };

  const loadDataRealTime = () => {
    intervalLoadData.current = setInterval(() => {
      loadDataTable();
    }, MAX_TIME_LOAD_DATA);
  };

  const getListZaloAccount = async (params: any) => {
    if (params) {
      setLoading(true);
      const result = await zaloApi.get(params, "oa/");

      if (result && result.data) {
        const { results = [], count = 0 } = result.data;

        const newData = results.map((item: ZaloAccountType) => {
          return {
            ...item,
            thumb_img_account_name: {
              url: item.avatar,
            },
            operation_refresh: {
              labelDialog: "Dữ liệu Zalo Oa của tài khoản này sẽ được đồng bộ lại",
              isShowRefresh: true,
              isDisable: checkLocalStorage(`${keySaveTimeOnLocal.TIME_SYNC_ZALO}-${item.id}`),
            },
          };
        });

        arrData.current = newData;

        setData(newData);
        setDataTotal(count);
      }

      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleLoginZalo = () => {
    const { host, pathname } = document.location;
    const secretCode = random(4);
    setStorage(SECRET_KEY_STORAGE_ZALO, secretCode);
    window.location.href =
      ZALO_REFRESH_TOKEN_URL + `${host}${pathname}` + `&secret_code=${secretCode}`;
  };

  const handleOperationRefresh = async (row: any) => {
    const params = {
      id: row.oa_id,
    };

    setStorage(`${keySaveTimeOnLocal.TIME_SYNC_ZALO}-${row.id}`, new Date());

    const result: any = await zaloApi.getId(params, "sync-data/");

    if (result) {
      loadDataTable();

      dispatch(toastSuccess({ message: message.SYNC_SUCCESS }));
    }
  };

  const renderHeader = () => {
    const contentArrButtonOptional: {
      content: JSX.Element;
      handleClick: () => void;
    }[] = [
      {
        content: <>Login zalo</>,
        handleClick: handleLoginZalo,
      },
    ];

    return (
      <HeaderFilter
        columns={columns}
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_SETTINGS.ZALO_ACCOUNT, columns)}
        isShowFilter={false}
        handleRefresh={handleRefresh}
        contentArrButtonOptional={contentArrButtonOptional}
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
        arrColumnHandleOperation: ["operation_refresh"],
        handleRefresh: handleOperationRefresh,
      }}
      contentColumnShowInfo={{
        arrColumnShowInfo: arrColumnShowInfo,
        infoCell: columns.columnsShow,
      }}
      setColumnWidths={(columns) => resizeColumn(STATUS_ROLE_SETTINGS.ZALO_ACCOUNT, columns)}
      handleChangeColumnOrder={(columns) => orderColumn(STATUS_ROLE_SETTINGS.ZALO_ACCOUNT, columns)}
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

export default ZaloAccount;

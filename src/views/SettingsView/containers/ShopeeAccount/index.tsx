// Libraries
import { useEffect, useContext, useState, useMemo } from "react";
import map from "lodash/map";

// Context
import { SettingContext } from "views/SettingsView/context";
import { useAppDispatch } from "hooks/reduxHook";
import { toastSuccess } from "store/redux/toast/slice";

// Services
import { shopeeApi } from "_apis_/shopee.api";

// Components
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";
import ReplayIcon from "@mui/icons-material/Replay";

// Types
import { ColorSchema } from "_types_/ThemeColorType";
import { ShopeeAccountType } from "_types_/AccountType";

// Constants
import {
  arrColumnShowInfo,
  checkLocalStorage,
  keySaveTimeOnLocal,
  message,
  propsTableDefault,
} from "views/SettingsView/constants";
import { setStorage } from "utils/asyncStorageUtil";
import { STATUS_ROLE_SETTINGS } from "constants/rolesTab";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

const ShopeeAccount = () => {
  const dispatch = useAppDispatch();
  const { state: store, updateCell, resizeColumn, orderColumn } = useContext(SettingContext);

  // State
  const [data, setData] = useState<ShopeeAccountType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSync, setLoadingSync] = useState<{ [key: string]: any }>({});
  const [params, setParams] = useState({ page: 1, limit: 30, ordering: "-created" });
  const [dataTotal, setDataTotal] = useState<number>(0);

  const { [STATUS_ROLE_SETTINGS.SHOPEE_ACCOUNT]: columns } = store;

  useEffect(() => {
    loadDataTable();
  }, [params]);

  const loadDataTable = () => {
    getListAccount(params);
  };

  const getListAccount = async (params: any) => {
    if (params) {
      setLoading(true);
      const result = await shopeeApi.get(params, "shop/list");

      if (result && result.data) {
        const { data = [], count = 0 } = result.data;

        const newData: any = data.map((item: ShopeeAccountType) => {
          const isDisableSync = checkLocalStorage(
            `${keySaveTimeOnLocal.TIME_SYNC_SHOPEE}-${item.shop_id}`,
            5
          );

          return {
            ...item,
            status: {
              value: item.is_active ? "Thành công" : "Thất bại",
              color: item.is_active ? "success" : "error",
            },
            shop_name: {
              content: (
                <Typography variant="body2" fontWeight="600">
                  {getObjectPropSafely(() => item.shop_name)}
                </Typography>
              ),
            },
            thumb_img_shop: item.shop_logo,
            operation_resync: {
              content: (
                <Tooltip
                  title={
                    isDisableSync
                      ? message.TIME_SYNC_PRODUCT_SHOPEE
                      : message.MESSAGE_POPUP_SYNC_PRODUCT_SHOPEE
                  }
                >
                  <Box
                    sx={{
                      cursor: "pointer",
                      ...(isDisableSync && {
                        pointerEvents: "none",
                        cursor: "default",
                        opacity: 0.2,
                      }),
                    }}
                    onClick={() => handleOperationRefresh({ ...item })}
                  >
                    <ReplayIcon />
                  </Box>
                </Tooltip>
              ),
            },
          };
        });

        setData(newData);
        setDataTotal(count);
      }

      setLoading(false);
    }
  };

  const handleOperationRefresh = async (row: any) => {
    setLoadingSync({
      ...isLoadingSync,
      [row?.shop_id]: true,
    });

    const params = {
      shop_id: row.shop_id,
    };
    const result: any = await shopeeApi.create(params, "/lead/sync_products");
    if (result.data) {
      setStorage(`${keySaveTimeOnLocal.TIME_SYNC_SHOPEE}-${row.shop_id}`, new Date());

      loadDataTable();
      dispatch(toastSuccess({ message: message.SYNC_SUCCESS }));

      setLoadingSync({
        ...isLoadingSync,
        [row?.shop_id]: false,
      });
    }
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleLogin = async () => {
    const result: any = await shopeeApi.get(
      {
        ...params,
        redirect_url: window.location.href,
      },
      "oauth/authorize-link"
    );

    if (result.data) {
      window.open(result?.data || "", "_blank", "noopener,noreferrer");
    }
  };

  const renderHeader = () => {
    const contentArrButtonOptional: {
      content: JSX.Element;
      color?: ColorSchema;
      handleClick: () => void;
    }[] = [
      {
        content: <>Đăng nhập Shopee Shop</>,
        color: "info",
        handleClick: handleLogin,
      },
    ];

    return (
      <HeaderFilter
        columns={columns}
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_SETTINGS.SHOPEE_ACCOUNT, columns)}
        isShowFilter={false}
        handleRefresh={handleRefresh}
        contentArrButtonOptional={contentArrButtonOptional}
      />
    );
  };

  const newData = useMemo(() => {
    return map(data, (item: ShopeeAccountType) => {
      const isDisableSync =
        checkLocalStorage(`${keySaveTimeOnLocal.TIME_SYNC_SHOPEE}-${item?.shop_id}`, 5) ||
        isLoadingSync[item?.shop_id];

      return {
        ...item,
        operation_resync: {
          content: (
            <Tooltip
              title={
                isDisableSync
                  ? message.TIME_SYNC_PRODUCT_SHOPEE
                  : message.MESSAGE_POPUP_SYNC_PRODUCT_SHOPEE
              }
            >
              <Stack direction="row" alignItems="center">
                <Box
                  sx={{
                    cursor: "pointer",
                    ...(isDisableSync && {
                      cursor: "default",
                      opacity: 0.2,
                    }),
                  }}
                  onClick={() => handleOperationRefresh({ ...item })}
                >
                  <ReplayIcon />
                </Box>
                {item?.shop_id && isLoadingSync[item?.shop_id] && (
                  <CircularProgress size={15} sx={{ ml: 1, mb: 1 }} />
                )}
              </Stack>
            </Tooltip>
          ),
        },
      };
    });
  }, [isLoadingSync, data]);

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
      contentColumnShowInfo={{
        arrColumnShowInfo: arrColumnShowInfo,
        infoCell: columns.columnsShow,
      }}
      setColumnWidths={(columns) => resizeColumn(STATUS_ROLE_SETTINGS.SHOPEE_ACCOUNT, columns)}
      handleChangeColumnOrder={(columns) =>
        orderColumn(STATUS_ROLE_SETTINGS.SHOPEE_ACCOUNT, columns)
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

export default ShopeeAccount;

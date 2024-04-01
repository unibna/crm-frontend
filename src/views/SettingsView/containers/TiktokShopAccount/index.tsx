// Libraries
import { useEffect, useContext, useState, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import map from "lodash/map";

// Context
import { SettingContext } from "views/SettingsView/context";
import { useAppDispatch } from "hooks/reduxHook";
import { toastSuccess } from "store/redux/toast/slice";

// Services
import { tiktokApi } from "_apis_/tiktok/tiktok_shop.api";

// Components
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { Span } from "components/Labels";
import ReplayIcon from "@mui/icons-material/Replay";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

// Types
import { ColorSchema } from "_types_/ThemeColorType";
import { TiktokAccountType } from "_types_/AccountType";

// Constants
import {
  SHOP_TYPE_TIKTOK,
  USER_TYPE_TIKTOK,
  message,
  checkLocalStorage,
  keySaveTimeOnLocal,
  arrColumnShowInfo,
  propsTableDefault,
} from "views/SettingsView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { setStorage } from "utils/asyncStorageUtil";
import { STATUS_ROLE_SETTINGS } from "constants/rolesTab";

const TiktokShopAccount = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { state: store, updateCell, resizeColumn, orderColumn } = useContext(SettingContext);

  // State
  const [data, setData] = useState<TiktokAccountType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSync, setLoadingSync] = useState<{ [key: string]: any }>({});
  const [params, setParams] = useState({ page: 1, limit: 30, ordering: "-created" });
  const [dataTotal, setDataTotal] = useState<number>(0);

  const { [STATUS_ROLE_SETTINGS.TIKTOK_ACCOUNT]: columns } = store;

  useEffect(() => {
    loadDataTable();
  }, [params]);

  const loadDataTable = () => {
    getListAccount(params);
  };

  const getListAccount = async (params: any) => {
    if (params) {
      setLoading(true);
      const result = await tiktokApi.get(params, "seller/list");

      if (result && result.data) {
        const { data = [], count = 0 } = result.data;

        const newData: any = map(data, (item: TiktokAccountType) => {
          return {
            ...item,
            seller_name: {
              value: item.seller_name,
              content: (
                <>
                  <Typography variant="body2" fontWeight="600" sx={{ mr: 1 }}>
                    {getObjectPropSafely(() => item.seller_name)}
                  </Typography>
                  <Span variant={theme.palette.mode === "light" ? "ghost" : "filled"} color="info">
                    {USER_TYPE_TIKTOK[item?.user_type]}
                  </Span>
                </>
              ),
            },
            status: {
              value: item.is_active ? "Thành công" : "Thất bại",
              color: item.is_active ? "success" : "error",
            },
            shops: map(item.shops, (current) => {
              const isDisableSync = checkLocalStorage(
                `${keySaveTimeOnLocal.TIME_SYNC_TITOK}-${current?.shop_id}`,
                5
              );

              return {
                ...current,
                shop_name: {
                  value: current.shop_name,
                  content: (
                    <>
                      <Typography variant="body2" fontWeight="600" sx={{ mr: 1 }}>
                        {getObjectPropSafely(() => current.shop_name)}
                      </Typography>
                      <Span
                        variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                        color="warning"
                      >
                        {current?.type ? SHOP_TYPE_TIKTOK[current.type] : ""}
                      </Span>
                    </>
                  ),
                },
                operation_resync: {
                  content: (
                    <Tooltip
                      title={
                        isDisableSync
                          ? message.TIME_SYNC_PRODUCT_TIKTOK
                          : message.MESSAGE_POPUP_SYNC_PRODUCT_TIKTOK
                      }
                    >
                      <Stack direction="row" alignItems="center">
                        <Box
                          sx={{
                            cursor: "pointer",
                            ...(isDisableSync && {
                              // pointerEvents: "none",
                              cursor: "default",
                              opacity: 0.2,
                            }),
                          }}
                          onClick={() =>
                            !isDisableSync && handleOperationRefresh({ ...item, ...current })
                          }
                        >
                          <ReplayIcon />
                        </Box>
                      </Stack>
                    </Tooltip>
                  ),
                },
              };
            }),
          };
        });

        setData(newData);
        setDataTotal(count);
      }

      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleLogin = async () => {
    const result: any = await tiktokApi.get(
      {
        ...params,
        url_direct: window.location.href,
      },
      "oauth/authorize-link"
    );

    if (result.data) {
      window.open(result?.data || "", "_blank", "noopener,noreferrer");
    }
  };

  const handleOperationRefresh = async (row: { shop_id: string; open_id?: string }) => {
    setLoadingSync({
      ...isLoadingSync,
      [row?.shop_id]: true,
    });

    const params = {
      seller_id: row?.open_id,
      shop_id: row?.shop_id,
    };
    const result: any = await tiktokApi.create(params, "/lead/sync_products");
    if (result.data) {
      setStorage(`${keySaveTimeOnLocal.TIME_SYNC_TITOK}-${row?.shop_id}`, new Date());

      loadDataTable();
      dispatch(toastSuccess({ message: message.SYNC_SUCCESS }));

      setLoadingSync({
        ...isLoadingSync,
        [row?.shop_id]: false,
      });
    }
  };

  const renderHeader = () => {
    const contentArrButtonOptional: {
      content: JSX.Element;
      color?: ColorSchema;
      handleClick: () => void;
    }[] = [
      {
        content: <>Đăng nhập Tiktok Shop</>,
        color: "info",
        handleClick: handleLogin,
      },
    ];

    return (
      <HeaderFilter
        columns={columns}
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_SETTINGS.TIKTOK_ACCOUNT, columns)}
        isShowFilter={false}
        handleRefresh={handleRefresh}
        contentArrButtonOptional={contentArrButtonOptional}
      />
    );
  };

  const newData = useMemo(() => {
    return map(data, (item) => ({
      ...item,
      shops: map(item.shops, (current) => {
        return {
          ...current,
          operation_resync: {
            content: (
              <Tooltip title={message.MESSAGE_POPUP_SYNC_PRODUCT_TIKTOK}>
                <Stack direction="row" alignItems="center">
                  <Box
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleOperationRefresh({ open_id: item?.open_id, shop_id: current.shop_id })
                    }
                  >
                    <ReplayIcon />
                  </Box>
                  {current?.shop_id && isLoadingSync[current?.shop_id] && (
                    <CircularProgress size={15} sx={{ ml: 1, mb: 1 }} />
                  )}
                </Stack>
              </Tooltip>
            ),
          },
        };
      }),
    }));
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
      setColumnWidths={(columns) => resizeColumn(STATUS_ROLE_SETTINGS.TIKTOK_ACCOUNT, columns)}
      handleChangeColumnOrder={(columns) =>
        orderColumn(STATUS_ROLE_SETTINGS.TIKTOK_ACCOUNT, columns)
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

export default TiktokShopAccount;

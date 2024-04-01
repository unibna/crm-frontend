// Libraries
import { useEffect, useContext, useState, useMemo } from "react";
import { map } from "lodash";

// Context
import { SettingContext } from "views/SettingsView/context";
import { dispatch } from "store";
import { toastSuccess } from "store/redux/toast/slice";

// Services
import { lazadaApi } from "_apis_/lazada.api";

// Components
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import ReplayIcon from "@mui/icons-material/Replay";
import DataGrid from "components/DataGrid";

// Types
import { ColorSchema } from "_types_/ThemeColorType";
import { LazadaAccountType } from "_types_/AccountType";
import { STATUS_PRODUCT } from "_types_/ProductType";

// Constants
import {
  arrColumnShowInfo,
  propsTableDefault,
  message,
} from "views/SettingsView/constants";
import { STATUS_ROLE_SETTINGS } from "constants/rolesTab";
import { Box, CircularProgress, Stack, Tooltip } from "@mui/material";

const LazadaAccount = () => {
  const { state: store, updateCell, resizeColumn, orderColumn } = useContext(SettingContext);

  // State
  const [data, setData] = useState<LazadaAccountType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSync, setLoadingSync] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 30, ordering: "-created" });
  const [dataTotal, setDataTotal] = useState<number>(0);

  const { [STATUS_ROLE_SETTINGS.LAZADA_ACCOUNT]: columns } = store;

  useEffect(() => {
    loadDataTable();
  }, [params]);

  const loadDataTable = () => {
    getListAccount(params);
  };

  const getListAccount = async (params: any) => {
    if (params) {
      setLoading(true);
      const result = await lazadaApi.get(params, "connectors");

      if (result && result.data) {
        const { data = [], count = 0 } = result.data;

        const newData = data.map((item: any) => {
          return {
            ...item,
            status: {
              value: item.status === STATUS_PRODUCT.ACTIVE ? "Đang kinh doanh" : "Ngừng kinh doanh",
              color: item.status === STATUS_PRODUCT.ACTIVE ? "success" : "error",
            },
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

  const handleOperationRefresh = async (row: { connector_id?: string }) => {
    setLoadingSync(true);

    const params = {
      connector_id: row?.connector_id,
    };
    const result: any = await lazadaApi.create(params, "connectors/lazada-product");
    if (result.data) {
      loadDataTable();
      dispatch(toastSuccess({ message: message.SYNC_SUCCESS }));
    }
    setLoadingSync(false);
  };

  const handleLogin = async () => {
    const result: any = await lazadaApi.get(
      {
        ...params,
        callback_url: window.location.href,
      },
      "connectors/oauth_url"
    );

    if (result.data) {
      window.open(result?.data?.data || "", "_blank", "noopener,noreferrer");
    }
  };

  const renderHeader = () => {
    const contentArrButtonOptional: {
      content: JSX.Element;
      color?: ColorSchema;
      handleClick: () => void;
    }[] = [
      {
        content: <>Đăng nhập Lazada</>,
        color: "info",
        handleClick: handleLogin,
      },
    ];

    return (
      <HeaderFilter
        columns={columns}
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_SETTINGS.LAZADA_ACCOUNT, columns)}
        isShowFilter={false}
        handleRefresh={handleRefresh}
        contentArrButtonOptional={contentArrButtonOptional}
      />
    );
  };

  const newData = useMemo(() => {
    return map(data, (item) => ({
      ...item,
      operation_resync: {
        content: (
          <Tooltip title={message.MESSAGE_POPUP_SYNC_PRODUCT_TIKTOK}>
            <Stack direction="row" alignItems="center">
              <Box
                sx={{
                  cursor: "pointer",
                  // ...(!!isDisableSync && {
                  //   cursor: "default",
                  //   opacity: 0.2,
                  // }),
                }}
                onClick={() => handleOperationRefresh({ connector_id: item?.uuid })}
              >
                <ReplayIcon />
              </Box>
              {isLoadingSync && <CircularProgress size={15} sx={{ ml: 1, mb: 1 }} />}
            </Stack>
          </Tooltip>
        ),
      },
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
      setColumnWidths={(columns) => resizeColumn(STATUS_ROLE_SETTINGS.LAZADA_ACCOUNT, columns)}
      handleChangeColumnOrder={(columns) =>
        orderColumn(STATUS_ROLE_SETTINGS.LAZADA_ACCOUNT, columns)
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

export default LazadaAccount;

import FacebookIcon from "@mui/icons-material/Facebook";
import { tiktokAdsApi } from "_apis_/tiktok/tiktok_ads.api";
import { FacebookAccountType, TiktokBmAccountType } from "_types_/AccountType";
import { ColorSchema } from "_types_/ThemeColorType";
import DataGrid from "components/DataGrid";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import { STATUS_ROLE_SETTINGS } from "constants/rolesTab";
import { useContext, useEffect, useState } from "react";
import { arrColumnShowInfo, propsTableDefault } from "views/SettingsView/constants";
import { SettingContext } from "views/SettingsView/context";

const TiktokBmAccount = () => {
  const { state: store, updateCell, resizeColumn, orderColumn } = useContext(SettingContext);

  // State
  const [data, setData] = useState<FacebookAccountType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 10, ordering: "-created_at" });
  const [dataTotal, setDataTotal] = useState<number>(0);

  const { [STATUS_ROLE_SETTINGS.TIKTOK_BM_ACCOUNT]: columns } = store;

  useEffect(() => {
    loadDataTable();
  }, [params]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
    };
    getListTiktokBmAccount(objParams);
  };

  const getListTiktokBmAccount = async (params: any) => {
    if (params) {
      setLoading(true);
      const result = await tiktokAdsApi.get(params, "users/");

      if (result && result.data) {
        const { results = [], count = 0 } = result.data;

        const newData = results.map((item: TiktokBmAccountType) => {
          return {
            ...item,
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

  const handleLoginTiktok = async () => {
    const result: any = await tiktokAdsApi.get(
      {
        redirect_uri: window.location.href,
      },
      "auth/authorize-link/"
    );

    if (result.data) {
      window.open(result?.data?.auth_link || "", "_blank", "noopener,noreferrer");
    }
  };

  const renderHeader = () => {
    const contentArrButtonOptional: {
      content: JSX.Element;
      color?: ColorSchema;
      handleClick: () => void;
    }[] = [
      {
        content: (
          <>
            <FacebookIcon sx={{ mr: 0.5 }} />
            Đăng nhập Tiktok Account
          </>
        ),
        color: "info",
        handleClick: handleLoginTiktok,
      },
    ];

    return (
      <HeaderFilter
        columns={columns}
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_SETTINGS.TIKTOK_BM_ACCOUNT, columns)}
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
      contentColumnShowInfo={{
        arrColumnShowInfo: arrColumnShowInfo,
        infoCell: columns.columnsShow,
      }}
      setColumnWidths={(columns) => resizeColumn(STATUS_ROLE_SETTINGS.TIKTOK_BM_ACCOUNT, columns)}
      handleChangeColumnOrder={(columns) =>
        orderColumn(STATUS_ROLE_SETTINGS.TIKTOK_BM_ACCOUNT, columns)
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

export default TiktokBmAccount;

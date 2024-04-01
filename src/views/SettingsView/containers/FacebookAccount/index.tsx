// Libraries
import { useEffect, useContext, useState } from "react";

// Context
import { SettingContext } from "views/SettingsView/context";

// Services
import { facebookApi } from "_apis_/facebook.api";

// Components
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";
import FacebookIcon from "@mui/icons-material/Facebook";

// Types
import { ColorSchema } from "_types_/ThemeColorType";
import { FacebookAccountType } from "_types_/AccountType";

// Constants
import {
  arrColumnShowInfo,
  FACEBOOK_REFRESH_TOKEN_URL,
  handleDataItem,
  propsTableDefault,
} from "views/SettingsView/constants";
import { STATUS_ROLE_SETTINGS } from "constants/rolesTab";

const FacebookAccount = () => {
  const {
    state: store,
    updateColumn,
    updateCell,
    resizeColumn,
    orderColumn,
  } = useContext(SettingContext);

  // State
  const [data, setData] = useState<FacebookAccountType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    limit: 200,
    ordering: "-created",
  });
  const [dataTotal, setDataTotal] = useState<number>(0);

  const { [STATUS_ROLE_SETTINGS.FACEBOOK_ACCOUNT]: columns } = store;

  useEffect(() => {
    loadDataTable();
  }, [params]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
    };
    getListFacebookAdAccount(objParams);
  };

  const getListFacebookAdAccount = async (params: any) => {
    if (params) {
      setLoading(true);
      const result = await facebookApi.get(params, "accounts/");

      if (result && result.data) {
        const { results = [], count = 0 } = result.data;

        const newData = results.map((item: FacebookAccountType) => {
          return {
            ...item,
            ...handleDataItem(item),
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

  const handleLoginFacebook = async () => {
    window.open(FACEBOOK_REFRESH_TOKEN_URL, "_blank", "noopener,noreferrer");
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
            Đăng nhập Facebook
          </>
        ),
        color: "info",
        handleClick: handleLoginFacebook,
      },
    ];

    return (
      <HeaderFilter
        columns={columns}
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_SETTINGS.FACEBOOK_ACCOUNT, columns)}
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
      setColumnWidths={(columns) => resizeColumn(STATUS_ROLE_SETTINGS.FACEBOOK_ACCOUNT, columns)}
      handleChangeColumnOrder={(columns) =>
        orderColumn(STATUS_ROLE_SETTINGS.FACEBOOK_ACCOUNT, columns)
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

export default FacebookAccount;

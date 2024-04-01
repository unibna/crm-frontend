// Libraries
import { useEffect, useContext, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";

// Context
import { SettingContext } from "views/SettingsView/context";

// Services
import { userApi } from "_apis_/user.api";

// Components
import AddIcon from "@mui/icons-material/Add";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";
import { Typography } from "@mui/material";
import PermissionActions from "./PermissionActions";
import MutationRoleModal from "./MutationRoleModal";

// Constants
import { arrColumnShowInfo } from "views/SettingsView/constants";
import { createRoleAction, updateRoleAction } from "store/redux/roles/slice";
import { RoleType } from "_types_/AccountType";
import { STATUS_ROLE_SETTINGS } from "constants/rolesTab";
import { ColorSchema } from "_types_/ThemeColorType";
import { standardString } from "utils/helpers";

export type RoleItemType = {
  id?: string;
  label: string;
  value: string;
  data: any;
  route: string;
  code: string;
};

const ListRole = () => {
  const theme = useTheme();
  const { state: store, updateCell, resizeColumn, orderColumn } = useContext(SettingContext);

  // State
  const [isOpenPopup, setOpenPopup] = useState(false);
  const [data, setData] = useState<RoleType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "-created" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [name, setName] = useState("");

  const { [STATUS_ROLE_SETTINGS.ROLE]: columns } = store;

  const [roleItem, setRoleItem] = useState<RoleItemType | null>(null);

  useEffect(() => {
    loadDataTable();
  }, [params]);

  const loadDataTable = () => {
    getListRole(params);
  };

  const getListRole = async (params: any) => {
    if (params) {
      setLoading(true);
      const result: any = await userApi.getRoles({ params });

      if (result && result.data) {
        let data = result.data;
        // const data = result.data.sort((a: any, b: any) => {
        //   const nameA = a.name.toUpperCase();
        //   const nameB = b.name.toUpperCase();
        //   if (nameA < nameB) {
        //     return -1;
        //   }
        //   if (nameA > nameB) {
        //     return 1;
        //   }
        //   return 0;
        // });

        const newData = data.map((item: any) => {
          return {
            ...item,
            route: {
              value: item.route,
              content: (
                <Typography
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: "inherit",
                  }}
                >{`${item.route || ""}`}</Typography>
              ),
            },
            operation: {
              isShowEdit: true,
            },
          };
        });

        setData(newData);
        setDataTotal(newData.length);
      }

      setLoading(false);
    }
  };

  const handleSubmitPopup = (data: any) => {
    if (data?.role) {
      createRoleAction({ name: data.name, data: data.role, route: data.route, code: data.code });
    }
    handleClose();
    handleRefresh();
  };

  const handleClose = () => {
    setOpenPopup(!isOpenPopup);
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

  const handleUpdateRole = (id: string | number, name: string, role: any, route: string | null) => {
    updateRoleAction({ name, data: role, id, route });
    setTimeout(() => {
      loadDataTable();
    }, 1000);
    setRoleItem(null);
  };

  const newData = useMemo(() => {
    return (
      (name &&
        data.filter(
          (item: any) => item?.name && standardString(item?.name).includes(standardString(name))
        )) ||
      data
    );
  }, [name, data]);

  const renderHeader = () => {
    const contentArrButtonOptional: {
      content: JSX.Element;
      color?: ColorSchema;
      handleClick: () => void;
    }[] = [
      {
        content: (
          <>
            <AddIcon /> Thêm nhóm
          </>
        ),
        handleClick: () => setOpenPopup(!isOpenPopup),
      },
    ];

    return (
      <HeaderFilter
        searchInput={[
          {
            keySearch: "name",
            label: "Nhập tên nhóm",
            delay: 100,
          },
        ]}
        columns={columns}
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_SETTINGS.ROLE, columns)}
        isShowFilter={false}
        handleRefresh={handleRefresh}
        contentArrButtonOptional={contentArrButtonOptional}
        handleFilter={handleFilter}
      />
    );
  };

  return (
    <>
      <MutationRoleModal
        roles={newData}
        isOpen={isOpenPopup}
        isLoadingButton={false}
        title="Tạo quyền"
        buttonText="Lưu"
        handleClose={handleClose}
        hanldeSubmit={handleSubmitPopup}
      />

      <PermissionActions
        open={Boolean(roleItem)}
        roles={newData}
        onClose={() => setRoleItem(null)}
        roleItem={roleItem}
        setRoleItem={setRoleItem}
        handleUpdateRole={handleUpdateRole}
      />

      <DataGrid
        data={newData}
        dataTotal={dataTotal}
        page={params.page}
        pageSize={params.limit}
        columns={columns.resultColumnsShow}
        columnWidths={columns.columnsWidthResize}
        isLoadingTable={isLoading}
        contentColumnHandleOperation={{
          arrColumnHandleOperation: ["operation"],
          handleEdit: (row) => {
            setRoleItem({
              label: row.name,
              code: row.code,
              data: row.data,
              route: row.route.value,
              id: row.id,
            } as RoleItemType);
          },
          handleDelete: (row: RoleType) => {},
        }}
        contentOptional={{
          arrColumnOptional: ["route"],
        }}
        arrValueTitle={["name"]}
        contentColumnShowInfo={{
          arrColumnShowInfo: arrColumnShowInfo,
          infoCell: columns.columnsShow,
        }}
        renderHeader={renderHeader}
        setColumnWidths={(columns) => resizeColumn(STATUS_ROLE_SETTINGS.ROLE, columns)}
        handleChangeColumnOrder={(columns) => orderColumn(STATUS_ROLE_SETTINGS.ROLE, columns)}
        handleChangeRowsPerPage={(rowPage: number) =>
          setParams({
            ...params,
            limit: rowPage,
            page: 1,
          })
        }
        handleChangePage={(page: number) => setParams({ ...params, page })}
      />
    </>
  );
};

export default ListRole;

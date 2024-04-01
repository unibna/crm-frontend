import { map } from "lodash";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { alpha, Box, Skeleton, styled, Typography, useTheme } from "@mui/material";

import BaseBox from "../../components/BaseBox";
import EditBaseConfig from "../../components/EditBaseConfig";
import MenuConfigTable from "../../components/MenuConfigTable";

import { AirtableContext } from "../../context";

import { useCancelToken } from "hooks/useCancelToken";

import { skycomtableApi } from "_apis_/skycomtable.api";

import { AirTableBase, AirTableViewTypes } from "_types_/SkyTableType";

import { ROLE_OPTION, ROLE_TAB, STATUS_ROLE_SKYCOM_TABLE } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import { dispatch as dispatchStore } from "store";
import { getRolesAction } from "store/redux/roles/slice";
import { toastError, toastSuccess } from "store/redux/toast/slice";
import { isReadAndWriteRole } from "utils/roleUtils";

function ListTable() {
  const navigate = useNavigate();
  const theme = useTheme();

  const { newCancelToken } = useCancelToken();

  const { user } = useAuth();

  const {
    state: {
      data: { listTable, detailTable },
      loading,
    },
    permission,
    updateLoading,
    updateData,
  } = useContext(AirtableContext);

  useEffect(() => {
    getListTable();
  }, []);

  useEffect(() => {
    getRolesAction();
  }, []);

  const getListTable = async () => {
    updateLoading(true);

    const result = await skycomtableApi.get(
      {
        cancelToken: newCancelToken(),
      },
      `table`
    );

    if (result && result.data) {
      updateData({
        listTable: result.data,
      });
    }
    updateLoading(false);
  };

  const createTable = async (name: string) => {
    updateLoading(true);

    const result = await skycomtableApi.create(
      {
        name,
        description: name,
      },
      `table`
    );

    if (result && result.data) {
      const { id }: any = result.data;
      updateData({
        detailTable: result.data,
      });
      createView(result.data, () => navigate(`/${ROLE_TAB.SKYCOM_TABLE}/${id}`));
    }
    updateLoading(false);
  };

  const updateTable = (base: AirTableBase) => async (data: any, action?: (newData: any) => any) => {
    updateLoading(true);

    const result = await skycomtableApi.update(
      {
        ...base,
        ...data,
        cancelToken: newCancelToken(),
      },
      `table/${base.id}/`
    );

    if (result && result.data) {
      const index = listTable.findIndex((table) => table.id === base.id);
      listTable[index] = result.data;
      updateData({
        listTable: [...listTable],
      });
      dispatchStore(
        toastSuccess({
          message: "Cập nhật thành công",
        })
      );
    } else {
      dispatchStore(
        toastError({
          message: "Lỗi cập nhật. Vui lòng thử lại",
        })
      );
    }
    updateLoading(false);
  };

  const deleteTable = async (id: AirTableBase["id"], action?: (newData: any) => any) => {
    updateLoading(true);
    const result = await skycomtableApi.remove({}, `table/${id}/`);

    if (result && result.data) {
      getListTable();
    } else {
      dispatchStore(
        toastError({
          message: "Lỗi cập nhật. Vui lòng thử lại",
        })
      );
    }
    updateLoading(false);
  };

  const createView = async (data: any, action?: () => void) => {
    updateLoading(true);
    const result = await skycomtableApi.update(
      {
        type: AirTableViewTypes.GRID,
        name: `${AirTableViewTypes.GRID} 1`,
        description: "",
        visible_fields: [
          {
            field_id: data.primary_key,
            visible: true,
            width: 100,
          },
        ],
      },
      `table/${data.id}/views/`
    );

    if (result && result.data) {
      updateData({
        detailTable: {
          ...detailTable,
          views: [result.data],
        },
      });
      action && action();
    }
    updateLoading(false);
  };

  const handleSubmit = (name: string) => {
    createTable(name);
  };

  const isCanCreate = isReadAndWriteRole(
    user?.is_superuser,
    permission?.[STATUS_ROLE_SKYCOM_TABLE.CREATE]
  );
  const isCanDelete = isReadAndWriteRole(
    user?.is_superuser,
    permission?.[STATUS_ROLE_SKYCOM_TABLE.DELETE]
  );
  const isCanEdit = isReadAndWriteRole(
    user?.is_superuser,
    permission?.[STATUS_ROLE_SKYCOM_TABLE.HANDLE]
  );

  return (
    <Wrapper>
      <Typography sx={{ fontSize: "2rem", mb: 4, fontWeight: 700 }}>SkyTable</Typography>
      <FlexBox sx={{ maxWidth: 700 }}>
        {!loading && (
          <>
            {map(listTable, (base) => {
              const isReader =
                isCanEdit || base.options?.permission?.[user?.group_permission?.id || ""];
              // ||
              // base.views.some(
              //   (view) => view.options?.permission?.[user?.group_permission?.id || ""]
              // );

              const isMasterBaseRole = isReadAndWriteRole(
                user?.is_superuser,
                base.options?.permission?.[user?.group_permission?.id || ""]
              );

              const isEditor = isCanEdit || isCanDelete || isMasterBaseRole;

              return (
                (isReader && (
                  <FlexItem key={base.id}>
                    <BaseBox
                      {...base}
                      onClick={() => navigate(`/${ROLE_TAB.SKYCOM_TABLE}/${base.id}`)}
                      MenuComponent={
                        (isEditor && (
                          <MenuConfigTable
                            permission={permission}
                            table={base}
                            onUpdateTable={updateTable(base)}
                            onDeleteTable={() => deleteTable(base.id)}
                            buttonStyles={{
                              backgroundColor: alpha(theme.palette.grey[500], 0.1),
                              ".MuiSvgIcon-root": {
                                fontSize: "1rem",
                              },
                            }}
                          />
                        )) || <></>
                      }
                    />
                  </FlexItem>
                )) || <React.Fragment key={base.id}></React.Fragment>
              );
            })}
            {(isCanCreate && (
              <FlexItem>
                <EditBaseConfig onSubmit={handleSubmit} />
              </FlexItem>
            )) || <></>}
          </>
        )}

        {loading &&
          [1, 2, 3, 4, 5].map((index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              sx={{ borderRadius: 1, width: 70, height: 70 }}
            />
          ))}
      </FlexBox>
    </Wrapper>
  );
}

export default function ListTableContainer() {
  return <ListTable />;
}

const FlexBox = styled(Box)(() => ({
  maxWidth: 700,
  display: "flex",
  flexWrap: "wrap",
  gap: 20,
}));

const FlexItem = styled(Box)(() => ({
  flex: "0 1 auto",
}));

const Wrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  margin: "auto",
  height: "70%",
}));

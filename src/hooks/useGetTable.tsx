import { skycomtableApi } from "_apis_/skycomtable.api";
import { AirTableBase } from "_types_/SkyTableType";
import { ROLE_OPTION, ROLE_TAB, ROLE_TYPE, STATUS_ROLE_SKYCOM_TABLE } from "constants/rolesTab";
import { useContext, useEffect, useState } from "react";
import { PATH_DASHBOARD, ROOT } from "routes/paths";
import { isMatchRoles, isReadAndWriteRole } from "utils/roleUtils";
import { AirtableContext } from "views/AirtableV2/context";
import { useCancelToken } from "./useCancelToken";
import { UserType } from "_types_/UserType";

function useGetTable({
  user,
  roles,
  userGroupId,
}: {
  roles?: { [key in ROLE_TAB]?: { [key: string]: ROLE_TYPE } };
  userGroupId: string;
  user: Partial<UserType> | null;
}) {
  const [tables, setTables] = useState<
    { title: string; path: string; roles: boolean; code: string }[]
  >([]);
  const { newCancelToken } = useCancelToken();

  const {
    state: {
      data: { listTable = [] },
      fetched,
    },
    updateData,
    updateFetched,
  } = useContext(AirtableContext);

  useEffect(() => {
    if (
      isMatchRoles(user?.is_superuser, [
        roles?.[ROLE_TAB.SKYCOM_TABLE]?.[STATUS_ROLE_SKYCOM_TABLE.HANDLE],
      ])
    ) {
      const isCanEdit = isReadAndWriteRole(
        user?.is_superuser,
        roles?.[ROLE_TAB.SKYCOM_TABLE]?.[STATUS_ROLE_SKYCOM_TABLE.HANDLE]
      );
      const list = listTable?.filter(
        (item) =>
          isCanEdit ||
          item?.options?.permission?.[userGroupId] ||
          item.views.some((view) => view.options?.permission?.[userGroupId])
      );

      const listChildren = list.map((item) => ({
        title: item.name,
        path: `${PATH_DASHBOARD[ROLE_TAB.SKYCOM_TABLE][ROOT]}/${item.id}`,
        roles: true,
        code: `skycomtable/${item.id}`,
      }));

      setTables([
        {
          title: "Tất cả bảng",
          path: `${PATH_DASHBOARD[ROLE_TAB.SKYCOM_TABLE][ROOT]}`,
          roles: true,
          code: `skycomtable`,
        },
        ...listChildren,
      ]);
    }
  }, [listTable, roles]);

  const getListTable = async () => {
    const result: { data: AirTableBase[] } = await skycomtableApi.get(
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
  };

  useEffect(() => {
    if (
      !fetched &&
      !!roles?.[ROLE_TAB.SKYCOM_TABLE]?.[STATUS_ROLE_SKYCOM_TABLE.HANDLE] &&
      isMatchRoles(user?.is_superuser, [
        roles?.[ROLE_TAB.SKYCOM_TABLE]?.[STATUS_ROLE_SKYCOM_TABLE.HANDLE],
      ])
    ) {
      updateFetched(true);
      getListTable();
    }
  }, []);

  return { tables };
}

export default useGetTable;

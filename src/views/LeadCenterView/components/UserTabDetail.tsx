import TableDetail from "components/DDataGrid/components/TableDetail";
import { userApi } from "_apis_/user.api";
import { handleParamsApi } from "utils/formatParamsUtil";
import { columnShowUserLeadHistory } from "../constants/columns";
import { useAppSelector } from "hooks/reduxHook";
import { userStore } from "store/redux/users/slice";
import { Chip, Stack } from "@mui/material";
import { filter, isEqual, pick } from "lodash";
import { UserType } from "_types_/UserType";

interface Props {
  row: Partial<UserType>;
}

const UserTabDetail = ({ row }: Props) => {
  const userSlice = useAppSelector(userStore);
  const newParams = handleParamsApi(
    {
      page: 1,
      limit: 10,
      id: row.id,
    },
    ["id"]
  );
  const handleDataApi = (item: Partial<UserType>) => {
    return {
      history_user: userSlice.users.find((user) => user.id === item.history_user)?.name,
      is_auto_lead: {
        content: (
          <Stack direction="row" spacing={2}>
            <Chip
              size="small"
              color="info"
              label="CRM"
              sx={{ opacity: item?.auto_assign_crm ? 1 : 0.2 }}
            />
            <Chip
              size="small"
              label="LandingPage"
              color="primary"
              sx={{ opacity: item?.auto_assign_lp ? 1 : 0.2 }}
            />
            <Chip
              size="small"
              label="Số Miss"
              color="secondary"
              sx={{ opacity: item?.auto_assign_missed ? 1 : 0.2 }}
            />
            <Chip
              size="small"
              label="Pancake"
              color="warning"
              sx={{ opacity: item?.auto_assign_pc ? 1 : 0.2 }}
            />
            <Chip
              size="small"
              label="CRM Campaign"
              color="error"
              sx={{ opacity: item?.auto_assign_harapos ? 1 : 0.2 }}
            />
          </Stack>
        ),
      },
    };
  };

  const handleFilterDataApi = (list: Partial<UserType>[]) => {
    return filter(list, (listItem, listItemIndex) => {
      if (listItemIndex === list.length - 1) return listItem;

      const fields = [
        "auto_assign_crm",
        "auto_assign_lp",
        "auto_assign_missed",
        "auto_assign_pc",
        "auto_assign_harapos",
        "is_online",
      ];
      const currentAutoLeadObj = pick(listItem, fields);
      const nextAutoLeadObj = pick(list[listItemIndex + 1], fields);
      if (!isEqual(currentAutoLeadObj, nextAutoLeadObj)) return listItem;
      return;
    });
  };

  return (
    <TableDetail
      isFullRow
      host={userApi}
      params={{ ...newParams }}
      columnShowDetail={columnShowUserLeadHistory}
      endpoint={`${row.id}/history/`}
      arrDateTime={["history_date"]}
      contentOptional={{
        arrColumnOptional: ["is_auto_lead"],
      }}
      arrColumnEditLabel={["is_online"]}
      handleDataApi={handleDataApi}
      handleFilterDataApi={handleFilterDataApi}
    />
  );
};

export default UserTabDetail;

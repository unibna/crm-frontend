import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

import { ROLE_OPTION, ROLE_TAB, STATUS_ROLE_SKYCOM_TABLE } from "constants/rolesTab";

import { Typography, useTheme } from "@mui/material";
import { AirTableBase, AirTableRow, AirTableView } from "_types_/SkyTableType";
import useAuth from "hooks/useAuth";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AirtableContext } from "../context";
import ButtonAddView from "./ButtonAddView";
import MenuConfigTable from "./MenuConfigTable";
import { isReadAndWriteRole } from "utils/roleUtils";

function Header({
  updateTable,
  deleteTable,
  onChangeView,
}: {
  updateTable: (data: any, action?: ((newData: any) => any) | undefined) => Promise<void>;
  deleteTable: (id: AirTableBase["id"]) => Promise<void>;
  onChangeView: (
    newView: AirTableView,
    optional?:
      | {
          action?: ((result: any) => void) | undefined;
          fields?: any[] | undefined;
          records?: AirTableRow[] | undefined;
        }
      | undefined
  ) => void;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const {
    state: {
      data: { detailTable },
    },
    permission,
  } = useContext(AirtableContext);

  const userGroupId = user?.group_permission?.id;

  const isCanDeleteTable = isReadAndWriteRole(
    user?.is_superuser,
    permission?.[STATUS_ROLE_SKYCOM_TABLE.DELETE]
  );
  const isCanEditTable = isReadAndWriteRole(
    user?.is_superuser,
    permission?.[STATUS_ROLE_SKYCOM_TABLE.HANDLE]
  );

  const isEdit = isReadAndWriteRole(
    user?.is_superuser,
    userGroupId ? detailTable?.options?.permission?.[userGroupId] : undefined
  );

  return (
    <Stack direction="row" display="flex" alignItems="center" justifyContent="space-between" pb={1}>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <IconButton
          onClick={() => navigate(`/${ROLE_TAB.SKYCOM_TABLE}`)}
          sx={{ backgroundColor: theme.palette.divider }}
        >
          <NavigateBeforeRoundedIcon />
        </IconButton>
        {detailTable && (
          <Stack direction="row" display="flex" alignItems="center" spacing={1}>
            <Typography
              sx={{
                fontSize: "1.4rem",
                fontWeight: 600,
              }}
            >
              {detailTable?.name}
            </Typography>
            {(isCanEditTable || isCanDeleteTable || isEdit) && (
              <MenuConfigTable
                table={detailTable}
                permission={permission}
                onUpdateTable={updateTable}
                onDeleteTable={() => deleteTable(detailTable?.id)}
              />
            )}
          </Stack>
        )}
      </Stack>
      <Stack direction="row" spacing={1} display="flex" alignItems="center">
        {/* <ButtonHistoryLog onLoadData={getTableLogs} data={tableLogs} table={listTable} /> */}

        {(isCanEditTable || isEdit) && (
          <ButtonAddView
            views={detailTable?.views || []}
            table={detailTable || undefined}
            onAddView={(newView) => onChangeView(newView)}
          />
        )}
      </Stack>
    </Stack>
  );
}

export default Header;

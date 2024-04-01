import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import { phoneLeadApi } from "_apis_/lead.api";
import { SelectOptionType } from "_types_/SelectOptionType";
import vi from "locales/vi.json";
import { MultiSelect } from "components/Selectors";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import find from "lodash/find";
import map from "lodash/map";
import React, { useMemo, useState } from "react";
import { userStore } from "store/redux/users/slice";
import { isReadAndWriteRole } from "utils/roleUtils";
import { formatOptionSelect } from "utils/selectOptionUtil";
import { EDIT_HANDLE_BY_COLUMN } from "views/LeadCenterView/constants";

export interface HandleByColumnProps {
  onHandleByByCheckbox?: ({ id, isCheck }: { id: string; isCheck: boolean }) => void;
  onSubmitChangeHandleByItem?: ({ rowId, userId }: { rowId: string; userId: string }) => void;
  onRefresh?: () => void;
  isHandleByLabel?: boolean;
}
interface Props extends HandleByColumnProps {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = [EDIT_HANDLE_BY_COLUMN];

const HandleByActionColumn = (props: Props) => {
  const {
    for: columnNames = [],
    onHandleByByCheckbox,
    onSubmitChangeHandleByItem,
    onRefresh,
    isHandleByLabel,
  } = props;
  const Formatter = (formatProp: React.PropsWithChildren<DataTypeProvider.ValueFormatterProps>) => {
    const [loading, setLoading] = useState(false);
    const userSlice = useAppSelector(userStore);
    const { user } = useAuth();
    const userOnline = userSlice.telesaleOnlineUsers;
    const isReadAndWrite = isReadAndWriteRole(
      user?.is_superuser,
      user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.HANDLE_BY]
    );
    //check role
    let userOptions: SelectOptionType[] = map(userOnline, formatOptionSelect);

    let defaultValue = useMemo(
      () => formatProp.row?.handle_by?.id || "",
      [formatProp.row?.handle_by?.id]
    );

    const handleSubmitAutoLead = async () => {
      setLoading(true);
      const updateHandle = await phoneLeadApi.updateHandleByAuto({
        phone_leads: [formatProp.row.id],
        endpoint: "auto-assign/",
      });
      if (updateHandle.data) {
        // nếu chia số thành công thì reset lại các dữ liệu người xử lý
        onRefresh?.();
      }
      setLoading(false);
    };

    const list = useMemo(() => {
      if (formatProp.row.handle_by) {
        //kiểm tra xem người được chia số có trong list sale online không
        const isExistHandleBy = find(userOnline, (user) => user.id === formatProp.row.handle_by.id);

        //nếu không có thì push vào options
        return !isExistHandleBy
          ? [
              ...userOptions,
              {
                label: formatProp.row.handle_by?.name as string,
                value: formatProp.row.handle_by.id as string | number,
              },
            ]
          : userOptions;
      }
      return userOptions;
    }, [userOptions, formatProp.row.handle_by, userOnline]);

    //admin hoặc leader sale thì show nút update
    return isReadAndWrite ? (
      isHandleByLabel ? (
        <HandleByName>{formatProp.row.handle_by?.name}</HandleByName>
      ) : (
        <>
          <Stack direction="row" alignItems="center">
            {onHandleByByCheckbox && (
              <Checkbox
                color="primary"
                inputProps={{ "aria-label": "secondary checkbox" }}
                checked={!!formatProp.row.isCheckHandleBy}
                onChange={(e) =>
                  onHandleByByCheckbox &&
                  onHandleByByCheckbox({
                    id: formatProp.row.id,
                    isCheck: e.target.checked,
                  })
                }
                style={{ padding: 4, marginRight: 4 }}
              />
            )}
            <LoadingButton
              size="small"
              color="secondary"
              onClick={handleSubmitAutoLead}
              loading={loading}
              loadingPosition="start"
              startIcon={<ContactPhoneIcon />}
              variant="contained"
              style={{ boxShadow: "unset", minWidth: 90 }}
            >
              Chia số
            </LoadingButton>
            {onSubmitChangeHandleByItem && (
              <MultiSelect
                title={vi.multi_select}
                options={list}
                label="handle-select"
                defaultValue={defaultValue}
                onChange={(value) =>
                  onSubmitChangeHandleByItem &&
                  onSubmitChangeHandleByItem({
                    rowId: formatProp.row.id,
                    userId: value as string,
                  })
                }
                simpleSelect
                fullWidth
                outlined
                selectorId="handle-action"
              />
            )}
          </Stack>
        </>
      )
    ) : (
      <></>
    );
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};

export default HandleByActionColumn;

const HandleByName = styled("div")({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

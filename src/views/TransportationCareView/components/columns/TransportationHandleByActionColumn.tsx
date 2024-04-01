// Libraries
import map from "lodash/map";
import React, { useMemo } from "react";

// Components
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { MultiSelect } from "components/Selectors";

// Redux
import { userStore } from "store/redux/users/slice";

// Hooks
import { useAppSelector } from "hooks/reduxHook";

// Types
import { SelectOptionType } from "_types_/SelectOptionType";

// Utils
import { styled } from "@mui/material";
import { PhoneLeadTabNameType } from "_types_/PhoneLeadType";
import vi from "locales/vi.json";
import { ROLE_OPTION, ROLE_TYPE } from "constants/rolesTab";
import { isMatchRoles, isReadAndWriteRole } from "utils/roleUtils";
import { formatOptionSelect } from "utils/selectOptionUtil";
import { EDIT_HANDLE_BY_COLUMN } from "views/LeadCenterView/constants";
import { UserType } from "_types_/UserType";
import useAuth from "hooks/useAuth";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  onHandleCheckbox?: ({ id, isCheck }: { id: string; isCheck: boolean }) => void;
  onSubmitChangeHandleByItem?: ({ rowId, userId }: { rowId: string; userId: string }) => void;
  onSubmitAutoLead?: (idUser: string) => Promise<void>;
  role?: ROLE_TYPE;
  tabName?: PhoneLeadTabNameType;
  user: Partial<UserType> | null;
}

const HandleByActionColumn = (props: Props) => {
  const Formatter = (formatProp: React.PropsWithChildren<DataTypeProvider.ValueFormatterProps>) => {
    const userSlice = useAppSelector(userStore);
    const { user } = useAuth();

    let userOptions: SelectOptionType[] = map(userSlice.telesaleUsers, formatOptionSelect);

    let defaultValue = useMemo(() => formatProp.row?.handle_by?.id || "", []);

    return props.role && isReadAndWriteRole(props.user?.is_superuser, props.role) ? (
      <>
        <MultiSelect
          title={vi.multi_select}
          options={userOptions}
          label="handle-select"
          defaultValue={defaultValue}
          onChange={(value) =>
            props.onSubmitChangeHandleByItem &&
            props.onSubmitChangeHandleByItem({
              rowId: formatProp.row.id,
              userId: value as string,
            })
          }
          simpleSelect
          fullWidth
          outlined
          selectorId="handle-action"
        />
      </>
    ) : formatProp.row.handle_by && isMatchRoles(user?.is_superuser, props.role) ? (
      <>
        <HandleByName>{formatProp.row.handle_by?.name}</HandleByName>
      </>
    ) : (
      <HandleByName>Chưa có</HandleByName>
    );
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[EDIT_HANDLE_BY_COLUMN, ...(props.for || [])]}
    />
  );
};

export default HandleByActionColumn;

const HandleByName = styled("div")({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

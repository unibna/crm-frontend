//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "hooks/reduxHook";
import { userStore } from "store/redux/users/slice";
//utils
import find from "lodash/find";
import { UserType } from "_types_/UserType";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const UserColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: Partial<UserType> | string }) => {
    const { users } = useAppSelector(userStore);

    let user: Partial<UserType> | undefined;

    if (typeof value === "string") {
      user = find(users, (item) => item.id === value);
    } else {
      user = value;
    }

    return <Typography fontSize={13}>{user?.name || user?.full_name}</Typography>;
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={
        props.for || [
          "skylink_handle_user",
          "change_by",
          "assign_by",
          "modified_by",
          "handle_by",
          "customer_change_by",
          "history_user",
          "created_by",
          "import_file_by",
          "customer_care_staff",
          "modified_care_staff_by",
        ]
      }
    />
  );
};

export default UserColumn;

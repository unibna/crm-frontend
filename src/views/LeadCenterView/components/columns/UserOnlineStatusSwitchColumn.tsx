//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import { UserType } from "_types_/UserType";
import { useAppDispatch } from "hooks/reduxHook";
import { updateUserAction } from "store/redux/users/action";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["is_online"];

const UserOnlineStatusSwitchColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value, row }: { value?: boolean; row?: Partial<UserType> }) => {
    const dispatch = useAppDispatch();
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateUserAction({ is_online: event.target.checked, id: row?.id }));
    };

    return (
      <Tooltip title="Khi tắt online thì không thể tự động chia số">
        <Switch checked={value} onChange={handleChange} />
      </Tooltip>
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

export default UserOnlineStatusSwitchColumn;

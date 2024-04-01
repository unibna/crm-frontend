//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { UserType } from "_types_/UserType";

//component
import Chip from "@mui/material/Chip";
import { useAppDispatch } from "hooks/reduxHook";
import { updateUserAction } from "store/redux/users/action";
import Stack from "@mui/material/Stack";
import { toastWarning } from "store/redux/toast/slice";
import compact from "lodash/compact";

const COLUMN_NAMES = ["is_auto_lead"];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const AutoLeadColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value, row }: { value?: string; row?: UserType }) => {
    const dispatch = useAppDispatch();
    const handleChange = (key: keyof UserType, value: boolean) => {
      //khi checked = false
      if (!value) {
        let countOffOtherOption = compact([
          row?.auto_assign_crm,
          row?.auto_assign_lp,
          row?.auto_assign_missed,
          row?.auto_assign_pc,
          row?.auto_assign_harapos,
        ]).length;

        //chỉ còn có 1 kênh active thôi
        if (countOffOtherOption === 1) {
          dispatch(toastWarning({ message: "Yêu cầu có ít nhất một kênh chia số" }));
          return;
        }
      }

      dispatch(updateUserAction({ id: row?.id || "", [key]: value }));
    };

    return (
      <Stack direction="row">
        <Chip
          size="small"
          style={{ margin: 2, opacity: row?.auto_assign_crm ? 1 : 0.2 }}
          onClick={(e) => handleChange("auto_assign_crm", !row?.auto_assign_crm)}
          color="info"
          label="CRM"
        />
        <Chip
          size="small"
          style={{ margin: 2, opacity: row?.auto_assign_lp ? 1 : 0.2 }}
          onClick={(e) => handleChange("auto_assign_lp", !row?.auto_assign_lp)}
          label="LandingPage"
          color="primary"
        />
        <Chip
          size="small"
          style={{ margin: 2, opacity: row?.auto_assign_missed ? 1 : 0.2 }}
          onClick={(e) => handleChange("auto_assign_missed", !row?.auto_assign_missed)}
          label="Số Miss"
          color="secondary"
        />
        <Chip
          size="small"
          style={{ margin: 2, opacity: row?.auto_assign_pc ? 1 : 0.2 }}
          onClick={(e) => handleChange("auto_assign_pc", !row?.auto_assign_pc)}
          label="Pancake"
          color="warning"
        />
      </Stack>
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

export default AutoLeadColumn;

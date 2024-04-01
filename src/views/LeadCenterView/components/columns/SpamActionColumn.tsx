import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import DeletePopover from "components/Popovers/DeletePopover";
import { handleDeleteIntercept } from "features/lead/handleFilter";
import { useState } from "react";
import { dispatch } from "store";
import { toastError, toastSuccess } from "store/redux/toast/slice";

const COLUMN_NAMES = ["action"];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;

  onRefresh: () => void;
}

function SpamActionColumn(props: Props) {
  const Formatter = ({ value, row }: { value: string; row?: any }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: any) => {
      setAnchorEl(event.currentTarget);
    };

    const handleDelete = async () => {
      if (row?.data) {
        const res = await handleDeleteIntercept({ data: [row?.data] });
        if (res) {
          dispatch(toastSuccess({ message: "Xoá Spam thành công!" }));
          props.onRefresh();
          return;
        }
        dispatch(toastError({ message: "Xoá Spam thất bại!" }));
      }
    };

    return (
      <>
        <IconButton
          color="error"
          aria-label="upload picture"
          component="span"
          onClick={handleClick}
        >
          <DeleteIcon style={iconStyle} />
        </IconButton>
        <DeletePopover
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          handleDelete={handleDelete}
          status={{ loading: false, error: false }}
        />
      </>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={COLUMN_NAMES} />;
}
export default SpamActionColumn;

const iconStyle = { fontSize: 20 };

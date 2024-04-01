import React, { useState, useRef } from "react";
import { Column, DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";

// Components
import Switch from "@mui/material/Switch";
import LoadingModal from "components/Loadings/LoadingModal";
import Grid from "@mui/material/Grid";
import MenuPopover from "components/Popovers/MenuPopover";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import vi from "locales/vi.json";
interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  onToggleSwitch: (
    isActive: boolean,
    id: string,
    columnName: string,
    isLoading: boolean,
    row: any
  ) => void;
  keySwitchToggle?: string;
  messagePopupTurnOn?: string;
  messagePopupTurnOff?: string;
  buttonText?: string;
}

const ColumnSwitch = (props: Props) => {
  const {
    keySwitchToggle = "",
    onToggleSwitch,
    messagePopupTurnOn = "",
    messagePopupTurnOff = "",
    buttonText = vi.button.accept,
  } = props;
  const Formatter = ({ value, column, row }: { value: any; column: Column; row?: any }) => {
    const [messagePopup, setMessagePopup] = useState<string>("");
    const [isOpen, setOpen] = useState(false);
    const [isActiveSwitch, setActiveSwitch] = useState(false);
    const anchorRef = useRef(null);

    const handleSubmit = () => {
      setOpen(false);
      onToggleSwitch(isActiveSwitch, row[keySwitchToggle], column.name, !row.isLoading, row);
    };

    const toggleSwitch = (isActive: boolean) => {
      if (row[keySwitchToggle]) {
        if (messagePopupTurnOn || messagePopupTurnOff) {
          setOpen(!isOpen);
          setActiveSwitch(isActive);
          setMessagePopup(isActive ? messagePopupTurnOn : messagePopupTurnOff);
        } else {
          onToggleSwitch(isActive, row[keySwitchToggle], column.name, !row.isLoading, row);
        }
      }
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <Grid>
        <div style={wrapColumnStyle}>
          <Switch
            ref={anchorRef}
            color="primary"
            checked={value}
            name={column.name}
            onChange={(e) => toggleSwitch(e.target.checked)}
          />
          {row.isLoading && <LoadingModal size={13} style={loadingModalStyle} />}
        </div>
        <MenuPopover
          open={isOpen}
          onClose={handleClose}
          anchorEl={anchorRef.current}
          sx={{ p: 1, mt: -1, width: "auto" }}
        >
          <div style={wrapActionDialogStyle}>
            <Typography variant="subtitle1" style={labelActionStyle}>
              {messagePopup}
            </Typography>
            <Divider />
            <DialogActions sx={{ mb: 1 }}>
              <Button onClick={handleClose} color="primary">
                Hủy
              </Button>
              <Button onClick={handleSubmit} color="primary" variant="contained">
                {buttonText}
              </Button>
            </DialogActions>
          </div>
        </MenuPopover>
      </Grid>
    );
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnSwitch;

const wrapColumnStyle: React.CSSProperties = { position: "relative" };
const loadingModalStyle = { left: "-25px" };
const labelActionStyle = { maxWidth: 500 };
const wrapActionDialogStyle: React.CSSProperties = { padding: "20px 20px 10px 20px" };

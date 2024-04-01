// Libraries
import { useState } from "react";
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";

// Components
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import PopupDialog from "components/DDataGrid/components/PopupDialog";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  handleButtonRow?: any;
  titleButtonRow?: string;
  titlePopupButton?: string;
  label?: string;
  buttonText?: string;
  tooltipButton?: string;
}

const ColumnHandleButton = (props: Props) => {
  const {
    titleButtonRow = 'Edit',
    buttonText,
    titlePopupButton,
    label,
    handleButtonRow,
    tooltipButton = ''
  } = props;

  const Formatter = ({ row }: { value: Array<any>; row?: any }) => {
    const [isOpenPopup, setOpenPopup] = useState<boolean>(false)

    const handleSubmitAttributes = (data: any) => {
      setOpenPopup(false)
      handleButtonRow(data, row)
    }

    return (
      <div>
        <PopupDialog
          isOpen={isOpenPopup}
          buttonText={buttonText}
          title={titlePopupButton}
          label={label}
          handleClose={() => setOpenPopup(false)}
          handleSubmit={handleSubmitAttributes}
        />
        <Tooltip title={tooltipButton} placement='bottom'>
          <Box sx={{ pl: 2, pr: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="small"
              onClick={() => setOpenPopup(true)}
            >
              {titleButtonRow}
            </Button>
          </Box>
        </Tooltip>
      </div>
    );
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnHandleButton;

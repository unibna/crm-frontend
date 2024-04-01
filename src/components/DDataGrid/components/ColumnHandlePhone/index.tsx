// Libraries
import { useState } from "react";

// Components
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CustomerDetail from "views/CDPView/components/CustomerDetail";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  params?: any;
}

interface PropsDrawer {
  isOpen: boolean;
  phone: string;
  params?: any;
  handleClose: () => void;
}

export const DrawerCDP = (props: PropsDrawer) => {
  const { isOpen = false, phone = "" } = props;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      PaperProps={{
        sx: {
          width: "80%",
          border: "none",
        },
      }}
      onClose={() => props.handleClose()}
    >
      <div style={wrapColumnStyle}>
        <CustomerDetail
          isMutationNote
          isMutationCustomer
          isShowTableDetail
          isShowTimeline
          customerDefault={{ phone, full_name: "" }}
          overviewLayoutColumns={{
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 3,
          }}
        />
      </div>
    </Drawer>
  );
};

const ColumnHandlePhone = (props: Props) => {
  const { params } = props;
  const Formatter = ({ value }: { value: any }) => {
    const [isOpenDrawer, setOpenDrawer] = useState(false);

    return (
      <>
        <Grid container direction="row" alignItems="center">
          <Typography variant="body2" sx={{ mr: 1 }}>
            {value}
          </Typography>
          {value ? (
            <IconButton
              onClick={() => {}}
              sx={{ backgroundColor: "primary.main", padding: 0.3 }}
              onClickCapture={() => setOpenDrawer(!isOpenDrawer)}
            >
              <ArrowForwardIcon style={wrapColumnIconStyle} />
            </IconButton>
          ) : null}
        </Grid>
        <DrawerCDP
          isOpen={isOpenDrawer}
          phone={value}
          params={params}
          handleClose={() => setOpenDrawer(false)}
        />
      </>
    );
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnHandlePhone;

const wrapColumnStyle = { padding: 16, overflow: "auto" };
const wrapColumnIconStyle = { fontSize: 10, transform: "rotate(-45deg)" };

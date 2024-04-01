// Libraries
import { useCallback, useEffect, useState } from "react";

// Components
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CustomerDetail from "views/CDPView/components/CustomerDetail";
import { phoneLeadApi } from "_apis_/lead.api";
import { PhoneLeadResType } from "_types_/PhoneLeadType";
import reduce from "lodash/reduce";
import { Span } from "components/Labels";

// ------------------------------------------------
interface PropsDrawer {
  isOpen: boolean;
  phone: string;
  params?: any;
  handleClose: () => void;
}

const DrawerCDP = (props: PropsDrawer) => {
  const { isOpen = false, phone = "" } = props;
  const idModal = "modal-cdp-content-id";

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
      <div style={wrapColumnStyle} id={idModal}>
        <CustomerDetail
          customerDefault={{ phone, full_name: "" }}
          overviewLayoutColumns={{
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 3,
          }}
          isShowTableDetail
          isShowTimeline
        />
      </div>
    </Drawer>
  );
};

const ColumnHandlePhone = ({
  value,
  isShowCalltime,
  row = {},
}: {
  value: string;
  isShowCalltime?: boolean;
  row?: any;
}) => {
  const [isOpenDrawer, setOpenDrawer] = useState(false);

  const { phone_count } = row;

  return (
    <>
      <Box>
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
        {isShowCalltime && <Span>{`${phone_count ? `${phone_count} lần gọi` : "Chưa gọi"}`}</Span>}
      </Box>

      <DrawerCDP isOpen={isOpenDrawer} phone={value} handleClose={() => setOpenDrawer(false)} />
    </>
  );
};

export default ColumnHandlePhone;

const wrapColumnStyle = { padding: 16, overflow: "auto" };
const wrapColumnIconStyle = { fontSize: 10, transform: "rotate(-45deg)" };

import React from "react";
import { CustomerType } from "_types_/CustomerType";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAppDispatch } from "hooks/reduxHook";
import { toastSuccess } from "store/redux/toast/slice";
import CustomerDetail from "views/CDPView/components/CustomerDetail";
import vi from "locales/vi.json";

export interface PhoneCDPProps {
  phone?: string;
  onRefresh?: (customer: Partial<CustomerType>) => void;
  containerStyles?: any;
  label?: string;
}
export const PhoneCDPDrawer = ({ phone, onRefresh, containerStyles, label }: PhoneCDPProps) => {
  const [cdp, setCDP] = React.useState<Partial<CustomerType> | undefined>();
  const dispatch = useAppDispatch();

  const copyBoard = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (phone && e.detail === 3) {
      navigator.clipboard.writeText(phone);
      dispatch(toastSuccess({ message: vi.copied }));
      e.preventDefault();
    }
  };

  const handleRefreshCdp = (customer: Partial<CustomerType>) => {
    setCDP(undefined);
    onRefresh?.(customer);
  };

  return (
    <Box sx={{ ...styles.container, ...containerStyles }} onClick={copyBoard}>
      <Typography fontSize={13} fontWeight="bold">
        {label || phone}
      </Typography>
      {phone && (
        <ArrowForwardIcon
          onClick={() => setCDP({ phone: phone, full_name: "" })}
          sx={{
            transform: "rotate(-45deg)",
            backgroundColor: "primary.main",
            fontSize: 14,
            position: "absolute",
            top: -6,
            right: -15,
            cursor: "pointer",
            borderRadius: "50%",
            color: "#fff",
          }}
        />
      )}
      <SwipeableDrawer
        anchor="right"
        open={!!cdp}
        onOpen={() => {}}
        onClose={() => setCDP(undefined)}
        PaperProps={{
          sx: { width: "80%", border: "none", overflow: "hidden", zIndex: 9999 },
        }}
      >
        <div style={styles.wrapDetail}>
          <CustomerDetail
            isMutationCustomer
            isMutationNote
            isShowTimeline
            isShowTableDetail
            customerDefault={cdp}
            overviewLayoutColumns={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
            onRefreshCDPRow={handleRefreshCdp}
          />
        </div>
      </SwipeableDrawer>
    </Box>
  );
};

const styles = {
  container: { position: "relative", width: "fit-content" },
  wrapDetail: { padding: 16, overflow: "auto" },
};

import Grid from "@mui/material/Grid";
import MenuPopover from "components/Popovers/MenuPopover";
import useResponsive from "hooks/useResponsive";
import React, { useRef, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { MBadgeButton } from "components/Buttons";

interface Props {
  children?: JSX.Element | React.ReactNode;
  filterCount?: number;
}

const WrapFilterPopup = ({ children, filterCount }: Props) => {
  const anchorRef = useRef(null);
  const [isShowFilter, setShowFilter] = useState(false);
  const isMobile = useResponsive("down", "sm");

  return (
    <>
      <MenuPopover
        open={isShowFilter}
        onClose={() => setShowFilter(false)}
        anchorEl={anchorRef.current}
        sx={{
          p: isMobile ? 1 : 2,
          width: isMobile ? "85%" : "80%",
          maxHeight: "80%",
          overflow: "auto",
        }}
      >
        <Grid container spacing={1}>
          {children}
        </Grid>
      </MenuPopover>
      <MBadgeButton
        value={filterCount || 0}
        setShowPopup={setShowFilter}
        label="Filter"
        ref={anchorRef}
        icon={<FilterAltIcon style={{ fontSize: 22 }} />}
      />
    </>
  );
};

export default WrapFilterPopup;

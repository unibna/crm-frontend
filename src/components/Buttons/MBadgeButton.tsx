import React from "react";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import TuneIcon from "@mui/icons-material/Tune";

export const MBadgeButton = React.forwardRef(
  (
    {
      value,
      setShowPopup,
      label,
      icon = <TuneIcon style={badgeIconStyle} />,
    }: {
      label: string;
      value: number;
      setShowPopup: (value: boolean, e?: any) => void;
      icon?: React.ReactNode;
    },
    ref: React.RefObject<HTMLButtonElement>
  ) => {
    return (
      <>
        <Badge color="error" badgeContent={value} sx={{ padding: 0 }}>
          <Button variant="outlined" onClick={(e) => setShowPopup(true, e)} ref={ref}>
            {icon} {label}
          </Button>
        </Badge>
      </>
    );
  }
);

const badgeIconStyle: React.CSSProperties = { fontSize: 22 };

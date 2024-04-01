import React, { memo } from "react";
import Card from "@mui/material/Card";
import { styled, SxProps, Theme } from "@mui/material";

const WrapPage = ({
  children,
  sx,
  style,
}: {
  children: React.ReactNode | JSX.Element;
  sx?: SxProps<Theme>;
  style?: React.CSSProperties;
}) => {
  return (
    <StyleCard sx={sx} style={style}>
      {children}
    </StyleCard>
  );
};

export default memo(WrapPage);

const StyleCard = styled(Card)(({ theme }) => ({
  marginBottom: 24,
  padding: "8px",
  "& .Pagination-text*": {
    color: `${theme.palette.text.primary} !important`,
    minWidth: "16px !important",
  },
}));

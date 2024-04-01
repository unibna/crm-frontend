// @mui
import { Box, BoxProps, Typography } from "@mui/material";
import { SxProps, styled } from "@mui/material/styles";

import { Theme } from "@emotion/react";
import Image from "components/Images/Image";
import { MButton, MButtonProps } from "components/Buttons";

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(8, 2),
}));

// ----------------------------------------------------------------------

export interface EmptyContentProps extends BoxProps {
  title?: string;
  img?: string;
  description?: string;
  buttonLabel?: string;
  buttonProps?: MButtonProps;
  imgStyles?: SxProps<Theme>;
}

export default function EmptyContent({
  title,
  description,
  img,
  buttonLabel,
  buttonProps,
  imgStyles,
  ...other
}: EmptyContentProps) {
  return (
    <RootStyle {...other}>
      <Image
        disabledEffect
        visibleByDefault
        alt="empty content"
        src={img || "/static/illustrations/illustration_empty_content.svg"}
        sx={{ height: 240, mb: 3, ...imgStyles }}
      />

      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
      )}
      {buttonLabel && (
        <MButton sx={{ mt: 2 }} {...buttonProps}>
          {buttonLabel}
        </MButton>
      )}
    </RootStyle>
  );
}

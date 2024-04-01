import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import React from "react";
import { ERROR_COLOR } from "assets/color";
import { SxProps, Theme } from "@mui/material";
interface Props {
  label: React.ReactNode | JSX.Element | string | number;
  link?: string;
  value?: string | number | JSX.Element | React.ReactNode;
  vertical?: boolean;
  valueStyle?: SxProps<Theme> | React.CSSProperties;
  labelStyle?: SxProps<Theme> | React.CSSProperties;
  containerStyle?: SxProps<Theme> | React.CSSProperties;
  onClick?: (e: any) => void;
  error?: boolean;
  displayType?: "stack" | "grid";
  xsLabel?: number;
  xsValue?: number;
}

export const MTextLine = React.forwardRef((props: Props, ref: any) => {
  const {
    label,
    link,
    value,
    vertical,
    valueStyle,
    labelStyle,
    containerStyle,
    onClick,
    error,
    displayType = "stack",
    xsLabel,
    xsValue,
  } = props;
  const isStack = displayType === "stack";
  return (
    <Grid container sx={containerStyle} ref={ref} flex={1} alignItems="center">
      <Grid
        item
        xs={isStack ? 0 : vertical ? 12 : xsLabel ? xsLabel : 5}
        display="flex"
        alignItems="flex-start"
        justifyContent={"flex-start"}
      >
        <FormLabel
          component="span"
          sx={{
            pr: isStack ? 1 : 0,
            color: error ? `${ERROR_COLOR} !important` : "unset",
            ...styles.labelInfo,
            ...labelStyle,
            // link style
            ...(onClick && {
              ...styles?.event,
              color: error ? ERROR_COLOR : "secondary.main",
            }),
          }}
          onClick={onClick}
        >
          {label}
        </FormLabel>
      </Grid>
      <Grid
        item
        xs={isStack ? 0 : vertical ? 12 : xsValue ? xsValue : 7}
        display="flex"
        alignItems="flex-start"
        justifyContent={"flex-start"}
        flex={isStack ? 1 : undefined}
      >
        {typeof value === "string" || typeof value === "number" ? (
          <Typography
            sx={{
              width: "100%",
              ...styles.info,
              ...valueStyle,
            }}
            href={link}
            component={link ? Link : "div"}
            target={link ? "_blank" : undefined}
          >
            {value}
          </Typography>
        ) : (
          value
        )}
      </Grid>
    </Grid>
  );
});

const styles: any = {
  event: {
    cursor: "pointer",
    color: "primary.main",
    transition: "all .2s ease-in-out",
  },
  labelInfo: {
    fontWeight: 400,
    paddingRight: 1,
    fontSize: 13,
  },
  info: {
    fontWeight: 600,
    fontSize: 13,
  },
};

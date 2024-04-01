// material
import { useTheme } from "@mui/material/styles";
import { GlobalStyles as GlobalThemeStyles } from "@mui/material";
import { useEffect } from "react";

// ----------------------------------------------------------------------

export default function GlobalStyles() {
  const theme = useTheme();

  useEffect(() => {
    document.onclick = (e) => applyCursorRippleEffect(e);
  }, []);

  function applyCursorRippleEffect(e: MouseEvent) {
    // const ripple = document.createElement("div");
    // ripple.className = "ripple";
    // document.body.appendChild(ripple);
    // ripple.style.left = `${e.clientX}px`;
    // ripple.style.top = `${e.clientY}px`;
    // ripple.style.animation = "ripple-effect .3s  linear";
    // ripple.onanimationend = () => document.body.removeChild(ripple);
  }

  return (
    <GlobalThemeStyles
      styles={{
        "*": {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        },
        html: {
          width: "100%",
          height: "100%",
          WebkitOverflowScrolling: "touch",
        },
        body: {
          width: "100%",
          height: "100%",
          "& > div": {},
        },
        ".MuiButton-root": {
          textTransform: "unset !important" as any,
          padding: "5px 10px !important",
        },
        // ".MuiInputAdornment-root": {
        //   button: {
        //     padding: "5px !important",
        //   },
        // },
        "#root": {
          width: "100%",
          height: "max-content",
          position: "relative",
        },
        // "td, td > p": { fontSize: "13px !important" },
        ".ellipsis-label": {
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
        },
        ".text-max-line": {
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box !important",
          // -webkit-line-clamp: 2; /* number of lines to show */
          // line-clamp: 2;
          WebkitBoxOrient: "vertical",
        },
        //virtual table
        "table:last-child": {
          marginBottom: "0px !important",
        },
        "table:nth-child(2)": {
          zIndex: 0,
        },
        ".MuiPaper-root": {
          borderWidth: 0,
        },
        ".relative": { position: "relative" },
        ".MuiToolbar-root": {
          height: 0,
          minHeight: 0,
        },
        input: {
          fontSize: "14px !important",
          "&[type=number]": {
            MozAppearance: "textfield",
            "&::-webkit-outer-spin-button": {
              margin: 0,
              WebkitAppearance: "none",
            },
            "&::-webkit-inner-spin-button": {
              margin: 0,
              WebkitAppearance: "none",
            },
          },
        },
        textarea: {
          fontSize: "14px !important",
          "&::-webkit-input-placeholder": {
            color: theme.palette.text.disabled,
          },
          "&::-moz-placeholder": {
            opacity: 1,
            color: theme.palette.text.disabled,
          },
          "&:-ms-input-placeholder": {
            color: theme.palette.text.disabled,
          },
          "&::placeholder": {
            color: theme.palette.text.disabled,
          },
        },

        img: { display: "block", maxWidth: "100%" },

        ".PrivatePickersFadeTransitionGroup-root > div": {
          fontSize: 13,
        },

        // Lazy Load Img
        ".blur-up": {
          WebkitFilter: "blur(5px)",
          filter: "blur(5px)",
          transition: "filter 400ms, -webkit-filter 400ms",
        },
        ".blur-up.lazyloaded ": {
          WebkitFilter: "blur(0)",
          filter: "blur(0)",
        },
        //header table
        ".MuiDataGrid-columnHeader": {
          ".MuiDataGrid-columnHeaderTitle": {
            width: "100%",
          },
        },
        //tooltip
        ".MuiTooltip-tooltip": { maxWidth: "none !important" },
        //helper text input
        ".MuiFormControl-root > p": {
          margin: 0,
        },
        // header sort table
        table: {
          ".MuiTableSortLabel-icon": {
            display: "none",
          },
          "th:hover": {
            ".MuiTableSortLabel-icon": {
              display: "inline-block",
            },
          },
        },
        /* width */
        "::-webkit-scrollbar": {
          width: 8,
          height: 8,
        },

        /* Track */
        "::-webkit-scrollbar-track": {
          borderRadius: 7,
          background: "#f1f1f1",
        },

        /* Handle */
        "::-webkit-scrollbar-thumb": {
          background: "rgb(182, 182, 182)",
          borderRadius: 7,
        },

        /* Handle on hover */
        "::-webkit-scrollbar-thumb:hover": {
          background: "rgb(143, 143, 143)",
        },
        // tripple click
        ".ripple": {
          width: 10,
          height: 10,
          backgroundColor: "transparent",
          position: "fixed",
          borderRadius: "50%",
          // border: "1px solid red",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: theme.palette.primary.main,
        },
        "@keyframes ripple-effect": {
          to: {
            transform: "scale(5)",
            opacity: 0.01,
          },
        },
        ".product-item-box:last-child > hr": {
          display: "none",
        },
      }}
    />
  );
}

import {
  alpha,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from "@mui/material";
import { Alignment, ROW_HEIGHT_TYPES } from "_types_/SkyTableType";

export const styles: any = {
  checkbox: {
    width: 120,
    maxWidth: 120,
    minWidth: 120,
    textAlign: Alignment?.CENTER || "center",
    position: "sticky",
    left: 0,
    zIndex: 3,
    display: "inline-block",
    boxSizing: "border-box",
  },
};

export const TableContainerStyled = styled(TableContainer)(() => ({
  position: "relative",
  width: "100%",
  margin: "auto",
  height: "calc(100vh - 300px)",
  overflow: "auto",
}));

export const TableHeadStyled = styled(TableHead)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 4,
}));

export const TableBodyStyled = styled(TableBody)(() => ({}));

export const TableFootStyled = styled(TableFooter)(() => ({
  position: "sticky",
  bottom: 0,
  zIndex: 4,
}));

export const TableHeaderWrap = styled(TableCell)(({ theme }: any) => ({
  border: `1px solid ${theme.palette.divider}`,
  ".MuiSvgIcon-root": {
    fontSize: 18,
    opacity: 0.7,
  },
  borderRadius: "0!important",
  position: "relative",
}));

export const TableHeaderName = styled(Typography)(() => ({
  display: "inline",
  fontSize: 12,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

export const TableRowStyled = styled(TableRow, {
  shouldForwardProp: (props) => props !== "rowHeight",
})(({ rowHeight }: { rowHeight?: ROW_HEIGHT_TYPES }) => {
  return {
    ...(rowHeight === ROW_HEIGHT_TYPES.SHORT && {
      height: "100%",
    }),
    ...(rowHeight === ROW_HEIGHT_TYPES.MEDIUM && {
      height: 80,
    }),
    ...(rowHeight === ROW_HEIGHT_TYPES.TALL && {
      height: 160,
    }),
    ...(rowHeight === ROW_HEIGHT_TYPES.EXTRA_TALL && {
      height: 240,
    }),
  };
});

export const TableCellStyled: any = styled(TableCell, {
  shouldForwardProp: (props) =>
    props !== "isSelected" &&
    props !== "isEditing" &&
    props !== "isSelectedRow" &&
    props !== "isSelectedCellRange" &&
    props !== "isShowBorderTop" &&
    props !== "isShowBorderBottom" &&
    props !== "isShowBorderLeft" &&
    props !== "isShowBorderRight",
})(
  ({
    theme,
    isSelected,
    isEditing,
    isSelectedRow,
    isSelectedCellRange,
    isShowBorderTop,
    isShowBorderBottom,
    isShowBorderLeft,
    isShowBorderRight,
  }: {
    theme: Theme;
    isSelected: boolean;
    isEditing: boolean;
    isSelectedRow: boolean;
    isSelectedCellRange: boolean;
    isShowBorderTop: boolean;
    isShowBorderBottom: boolean;
    isShowBorderLeft: boolean;
    isShowBorderRight: boolean;
  }) => ({
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.common.white
        : theme.palette.background.default,

    ...(isSelected && {
      border: `2px solid ${theme.palette.primary.main}`,
    }),
    ...(isEditing && {
      border: `3px solid ${theme.palette.primary.main}`,
    }),
    ...((isSelectedRow || isSelectedCellRange) && {
      backgroundColor:
        theme.palette.mode === "light"
          ? theme.palette.primary.lighter
          : alpha(theme.palette.divider, 0.75),
    }),
    ...(isShowBorderTop &&
      !isSelected && {
        borderTop: `1px solid ${theme.palette.primary.main}`,
      }),
    ...(isShowBorderBottom &&
      !isSelected && {
        borderBottom: `1px solid ${theme.palette.primary.main}`,
      }),
    ...(isShowBorderLeft &&
      !isSelected && {
        borderLeft: `1px solid ${theme.palette.primary.main}`,
      }),
    ...(isShowBorderRight &&
      !isSelected && {
        borderRight: `1px solid ${theme.palette.primary.main}`,
      }),
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    cursor: "pointer",
    display: "flex!important",
    alignItems: "center",
  })
);

export const TableStyled = styled(Table)(({ theme }) => ({
  tableLayout: "fixed",
  height: "100%",
  backgroundColor:
    theme.palette.mode === "light" ? theme.palette.common.white : theme.palette.background.default,
  padding: 1,
  minWidth: "max-content!important",
}));

export const Resizer = styled("div", {
  shouldForwardProp: (props) => props !== "isResizing",
})(({ theme, isResizing }: { theme: Theme; isResizing: boolean }) => ({
  display: "inline-block",
  width: 7,
  height: "100%",
  position: "absolute",
  right: 0,
  top: 0,
  transform: "translateX(50%)",
  zIndex: 1,
  touchAction: "none",

  "&:hover": {
    background: theme.palette.primary.main,
  },
  ...(isResizing && {
    background: theme.palette.primary.dark,
  }),
}));

export const Image = styled("img")(() => ({}));

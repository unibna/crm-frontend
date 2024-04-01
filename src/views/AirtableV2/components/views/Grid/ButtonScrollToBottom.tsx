import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import { IconButton, useTheme } from "@mui/material";

function ButtonScrollToBottom({
  btnRef,
  rowVirtualizer,
  rows,
}: {
  btnRef: any;
  rowVirtualizer: any;
  rows: any[];
}) {
  const theme = useTheme();
  return (
    <IconButton
      sx={{
        backgroundColor: theme.palette.background.neutral,
        ml: "auto",
      }}
      ref={btnRef}
      onClick={() => rowVirtualizer.scrollToIndex(rows.length, { align: "end" })}
    >
      <ArrowDownwardRoundedIcon />
    </IconButton>
  );
}

export default ButtonScrollToBottom;

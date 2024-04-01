import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { styled, useTheme } from "@mui/material";
import { NoDataPanel } from "components/DDataGrid/components";
import { MTextLine } from "components/Labels";
import { useEffect, useState } from "react";

interface Props {
  sheets: {
    order_key: string;
    is_confirm: boolean | string;
    message?: string;
  }[];
}

function TableResultSheetScanned(props: Props) {
  const { sheets } = props;
  const theme = useTheme();
  const [count, setCount] = useState({
    success: 0,
    error: 0,
    duplicate: 0,
  });

  useEffect(() => {
    const newCount = sheets.reduce(
      (
        prev: any,
        current: {
          order_key: string;
          is_confirm: boolean | string;
          message?: string;
        },
        currentIndex: number
      ) => {
        if (current.is_confirm) prev.success += 1;
        else prev.error += 1;
        const indexDuplicate = sheets.findIndex(
          (item, index) => item.order_key === current.order_key && index > currentIndex
        );
        if (indexDuplicate !== -1) {
          prev.duplicate += 1;
        }
        return prev;
      },
      {
        success: 0,
        error: 0,
        duplicate: 0,
      }
    );
    setCount({ ...newCount });
  }, [sheets]);

  return (
    <Box sx={{ ...styles.container }}>
      <Stack direction="row" spacing={1} width="100%" my={1}>
        <MTextLine label="Tổng phiếu:" value={sheets?.length || 0} />
        <MTextLine label="Đã xác nhận:" value={count.success} />
        <MTextLine label="Lỗi:" value={count.error} />
        <MTextLine label="Trùng:" value={count.duplicate} />
      </Stack>
      <table style={styles.table}>
        <colgroup>
          <col style={{ width: "15%" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "55%" }} />
        </colgroup>
        <thead>
          <tr>
            <Th style={styles.th}>STT</Th>
            <Th style={styles.th}>MÃ PHIẾU</Th>
            <Th style={styles.th}>KẾT QUẢ</Th>
          </tr>
        </thead>
        <tbody>
          {sheets.reverse().map((sheet, index) => (
            <tr key={index}>
              <Td>{sheets.length - index}</Td>
              <Td>
                <Typography
                  sx={{
                    ...styles.mainText,
                    color: sheet.is_confirm ? theme.palette.text.primary : theme.palette.error.main,
                    transition: "all .15s ease-in-out",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                  component="a"
                  target="_blank"
                  href={`/warehouse/exports?sheet_code=${sheet.order_key.slice(1)}`}
                >
                  {sheet.order_key || ""}
                </Typography>
              </Td>
              <Td>
                {sheet.is_confirm ? (
                  <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                ) : (
                  <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
                    <ErrorIcon sx={{ color: theme.palette.error.main }} />
                    <Typography sx={styles.message}>{sheet.message}</Typography>
                  </Stack>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>

      {sheets.length === 0 ? (
        <NoDataPanel
          message="Danh sách phiếu trống"
          wrapImageStyles={{
            height: "120px",
            width: "100%",
          }}
          showImage
        />
      ) : null}
    </Box>
  );
}

export default TableResultSheetScanned;

const styles: any = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minWidth: "320px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  mainText: {
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
    textDecoration: "none",
  },
};

const Td = styled("td")(() => ({
  border: "1px solid #eee",
  padding: 3,
  textAlign: "center",
}));

const Th = styled("th")(() => {
  const theme = useTheme();
  return {
    border: "1px solid #eee",
    padding: 3,
    textAlign: "center",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  };
});

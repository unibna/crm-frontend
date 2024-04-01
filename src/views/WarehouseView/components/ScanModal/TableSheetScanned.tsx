import Delete from "@mui/icons-material/Delete";
import { useTheme, styled } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
interface Props {
  sheets: string[];
  handleDeleteSheet: (index: number) => void;
}

function TableSheetScanned(props: Props) {
  const { sheets, handleDeleteSheet } = props;
  const theme = useTheme();

  return (
    <Box sx={{ ...styles.container }}>
      {sheets.length > 0 && (
        <table style={styles.table}>
          <colgroup>
            <col style={{ width: "15%" }} />
            <col style={{ width: "60%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>
          <tr>
            <Th style={styles.th}>STT</Th>
            <Th style={styles.th}>MÃ PHIẾU</Th>
            <Th style={styles.th}>THAO TÁC</Th>
          </tr>
          <tbody>
            {sheets.map((sheet, index) => (
              <tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{sheet}</Td>
                <Td>
                  <IconButton
                    sx={{ color: theme.palette.error.main }}
                    onClick={() => handleDeleteSheet(index)}
                  >
                    <Delete />
                  </IconButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Box>
  );
}

export default TableSheetScanned;

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

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import styled from "@emotion/styled";

import { ProductProps } from "./index";
import vi from "locales/vi.json";
import { fDateTime } from "utils/dateUtil";
import "./printOrder.css";

const persons = ["Người lập", "Người nhận", "Người kiểm tra"];
const OrderPrintLog = (props: { products: any; orders: (string | undefined)[] }) => {
  const { products, orders } = props;
  return (
    <Box sx={styles.container}>
      <Typography sx={styles.titleSection}>{vi.export_warehouse_sheet}</Typography>
      <Typography sx={styles.timeExport}>Thời gian: {fDateTime(new Date())}</Typography>
      <table style={{ borderCollapse: "collapse", borderSpacing: "0 1.2em", width: "100%" }}>
        <colgroup>
          <col span={1} style={{ width: "15%", ...styles.col }} />
          <col span={1} style={{ width: "60%", ...styles.col }} />
          <col span={1} style={{ width: "25%", ...styles.col }} />
        </colgroup>
        <thead>
          <tr>
            <Th>STT</Th>
            <Th>Sản phẩm</Th>
            <Th>Số lượng</Th>
          </tr>
        </thead>
        <tbody>
          {products?.map((item: ProductProps, index: number) => (
            <tr key={index}>
              <Td>{index + 1}</Td>
              <Td style={{ textAlign: "left" }}>
                <Typography sx={{ fontSize: "0.8125rem" }}> {item.name}</Typography>
              </Td>
              <Td>{item.quantity}</Td>
            </tr>
          ))}
        </tbody>
      </table>
      <Typography sx={{ mt: 3, fontSize }}>
        <b>Nội dung:</b>
      </Typography>
      <Typography sx={{ mb: 4, fontSize }}>
        Xuất kho ĐH({orders.length}) số: {orders.join(", ")}
      </Typography>

      <Grid container sx={{ pb: 15 }}>
        {persons.map((person) => (
          <Grid item xs={4} key={person} display="flex" justifyContent="center">
            <b style={{ fontSize }}>{person}</b>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OrderPrintLog;

const fontFamily = "Avenir Next, sans-serif";
const fontSize = "0.975rem";

const styles: any = {
  container: {
    fontFamily,
    border: "1px solid #eee",
    p: 3,
    borderRadius: "4px",
    backgroundColor: "white",
    color: "#000",
  },
  titleSection: {
    fontFamily,
    fontWeight: 700,
    textTransform: "uppercase",
    mb: 1,
    mt: 2,
    textAlign: "center",
    fontSize: "1.4rem",
  },
  labelTotal: {
    fontFamily,
    fontWeight: 600,
    fontSize,
  },
  infoTotal: {
    fontFamily,
    fontWeight: 700,
    textAlign: "right",
    fontSize,
  },
  timeExport: {
    fontSize,
    mb: 3,
    textAlign: "center",
  },
};

const Td = styled("td")(({}) => ({
  textAlign: "center",
  verticalAlign: "middle",
  fontSize,
  fontWeight: "500",
  border: "1px solid #eee",
  padding: 3,
  fontFamily,
}));

const Th = styled("th")(({}) => ({
  fontSize,
  border: "1px solid #eee",
  padding: 3,
}));

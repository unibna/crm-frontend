import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Image from "components/Images/Image";

import { fDate } from "utils/dateUtil";
import { fCurrency2 } from "utils/formatNumber";

import styled from "@emotion/styled";

import "../printOrder.css";

import { OrderTemplateProps, ProductProps } from "../index";
import { COMMON_NOTE_PRINT_ORDER, textToBase64Barcode } from "../utils";

const OrderTemplate = (props: OrderTemplateProps) => {
  const {
    orderNumber,
    orderDate,
    customerName,
    customerPhone,
    address,
    products,
    total,
    discount,
    promotion,
    shippingCost,
    orderTotal,
    deliveryNote,
  } = props;

  return (
    <Box sx={styles.container}>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <Typography sx={styles.companyName}>{import.meta.env.REACT_APP_SHOP_NAME}</Typography>
          <Typography sx={styles.companyAddress}>
            {import.meta.env.REACT_APP_SHOP_ADDRESS}
          </Typography>
        </Grid>
        <Grid item xs={5} display="flex" alignItems={"flex-end"} sx={{ flexDirection: "column" }}>
          <Image
            sx={styles.barCode}
            src={textToBase64Barcode(orderNumber || "", false)}
            alt={orderNumber}
          />
          <Box
            sx={{
              width: "max-content",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            {/* <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Typography sx={styles.labelInfo}>Mã vận đơn: </Typography>
              <Typography sx={styles.info}>{shippingNumber}</Typography>
            </Stack> */}
            <Stack direction="row" spacing={2}>
              <Typography sx={styles.labelInfo}>Mã đơn hàng: </Typography>
              <Typography sx={styles.info}>{orderNumber}</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Typography sx={styles.labelInfo}>Ngày đặt: </Typography>
              <Typography sx={styles.info}>{fDate(orderDate)}</Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
      <Typography sx={styles.titleSection}>Thông tin người nhận</Typography>
      <Divider sx={{ backgroundColor: "#fff", mb: 1 }} />
      <Grid container sx={{ mb: 2 }}>
        <Grid item xs={4}>
          <Typography sx={styles.labelInfo}>Người nhận:</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography sx={styles.info}>{customerName} </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography sx={styles.labelInfo}>Điện thoại:</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography sx={styles.info}>{customerPhone} </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography sx={styles.labelInfo}>Địa chỉ:</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography sx={styles.info}>{address} </Typography>
        </Grid>
      </Grid>
      <Typography sx={styles.titleSection}>Thông tin đơn hàng</Typography>
      <Divider sx={{ backgroundColor: "#fff", mb: 1 }} />
      <table style={{ borderCollapse: "separate", borderSpacing: "0 1.2em", width: "100%" }}>
        <colgroup>
          <col span={1} style={{ width: "8%", ...styles.col }} />
          <col span={1} style={{ width: "50%", ...styles.col }} />
          <col span={1} style={{ width: "14%", ...styles.col }} />
          <col span={1} style={{ width: "14%", ...styles.col }} />
          <col span={1} style={{ width: "14%", ...styles.col }} />
        </colgroup>
        <tr>
          <Th>STT</Th>
          <Th>Sản phẩm</Th>
          <Th>Số lượng</Th>
          <Th>Giá bán</Th>
          <Th>Thành tiền</Th>
        </tr>
        {products?.map((product: ProductProps, index: number) => (
          <tr key={index}>
            <Td>{index + 1}</Td>
            <Td style={{ textAlign: "left" }}>{product.name}</Td>
            <Td>{product.quantity}</Td>
            <Td>{`${fCurrency2(product.price)}đ`}</Td>
            <Td>{`${fCurrency2(
              product.salePrice * (product.quantity - product.giftVariantQuantity)
            )}đ`}</Td>
          </tr>
        ))}
      </table>
      <Divider sx={{ backgroundColor: "#fff", mb: 1 }} />
      <Grid sx={{ mt: 2, pr: 4 }} container spacing={3}>
        <Grid item xs={12} sm={4}></Grid>
        <Grid item container xs={12} sm={8} spacing={2}>
          <Grid item xs={8}>
            <Typography sx={styles.labelTotal}>Tổng tiền hàng:</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={styles.infoTotal}>{`${fCurrency2(orderTotal || 0)}đ`}</Typography>
          </Grid>

          <Grid item xs={8}>
            <Typography sx={styles.labelTotal}>Phí vận chuyển:</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={styles.infoTotal}>{`${fCurrency2(shippingCost || 0)}đ`}</Typography>
          </Grid>

          <Grid item xs={8}>
            <Typography sx={styles.labelTotal}>Khuyến mãi:</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={styles.infoTotal}>{`${fCurrency2(promotion || 0)}đ`}</Typography>
          </Grid>

          <Grid item xs={8}>
            <Typography sx={styles.labelTotal}>Giảm giá:</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={styles.infoTotal}>{`${fCurrency2(discount || 0)}đ`}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography sx={styles.labelTotal}>
              Tổng giá trị đơn hàng (thanh toán khi giao hàng COD):
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ ...styles.infoTotal, fontWeight: 700 }}>{`${fCurrency2(
              total || 0
            )}đ`}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Stack direction={"column"} spacing={1.2} sx={{ mt: 10 }}>
        <Typography sx={styles.note}>
          {" "}
          Hotline CSKH / xử lý sự cố giao nhận hàng: <b>{import.meta.env.REACT_APP_HOTLINE}</b>
        </Typography>
        <Typography sx={styles.note}>{COMMON_NOTE_PRINT_ORDER}</Typography>
        {/* <Typography sx={styles.note}>{note ? `Ghi chú đơn hàng: ${note}` : ""}</Typography> */}
        <Typography sx={styles.note}>
          {deliveryNote ? `Ghi chú vận đơn: ${deliveryNote}` : ""}
        </Typography>
      </Stack>
    </Box>
  );
};

export default OrderTemplate;

const fontFamily = "Avenir Next, sans-serif";

const styles: any = {
  container: {
    fontFamily,
    border: "1px solid #eee",
    p: 3,
    borderRadius: "4px",
    backgroundColor: "white",
    color: "#000",
    mb: 2,
  },
  logoCompany: {
    width: "160px",
    objectFit: "contain",
  },
  companyName: {
    fontFamily,
    fontWeight: 700,
    fontSize: "22px",
  },
  companyAddress: {
    fontSize: "14px",
    fontWeight: 600,
    fontFamily,
    lineHeight: "150%",
  },
  barCode: {
    img: {
      width: "160px",
      objectFit: "contain",
    },
  },
  labelInfo: {
    fontFamily,
    fontWeight: 500,
    fontSize: "14px",
    display: "inline",
    width: "100px",
    textAlign: "left",
  },
  info: {
    fontFamily,
    fontWeight: 600,
    fontSize: "14px",
    display: "inline",
    width: "120px",
    textAlign: "right",
  },
  note: {
    fontFamily,
    fontWeight: 600,
    fontSize: "14px",
    display: "block",
    textAlign: "left",
  },
  titleSection: {
    fontFamily,
    fontWeight: 600,
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  col: {},
  labelTotal: {
    fontFamily,
    fontWeight: 600,
    // textTransform: "uppercase",
    fontSize: "16px",
  },
  infoTotal: {
    fontFamily,
    fontWeight: 600,
    textAlign: "right",
    fontSize: "16px",
  },
};

const Td = styled("td")(({}) => ({
  textAlign: "center",
  verticalAlign: "middle",
  fontSize: "14px",
  fontWeight: "500",
}));

const Th = styled("th")(({}) => ({
  fontSize: "15px",
}));

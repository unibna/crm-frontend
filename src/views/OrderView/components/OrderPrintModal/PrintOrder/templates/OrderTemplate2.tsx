import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";

import { fDate } from "utils/dateUtil";
import { fCurrency2 } from "utils/formatNumber";
import { COMMON_NOTE_PRINT_ORDER, textToBase64Barcode } from "../utils";

import "../printOrder.css";

import { OrderTemplateProps, ProductProps } from "../index";

const OrderTemplate2 = (props: OrderTemplateProps) => {
  const {
    orderNumber,
    orderDate,
    customerName,
    customerPhone,
    address,
    products,
    total,
    discount,
    shippingCost,
    orderTotalAfterDiscount,
    deliveryNote,
    promotion,
    paid,
    additionalFee,
    totalActual,
    shopName,
  } = props;
  return (
    <Box sx={styles.container}>
      <table style={{ ...styles.table, borderSpacing: "0 1.2em", width: "100%" }}>
        <colgroup>
          <col style={{ width: "70%" }} />
          <col style={{ width: "30%" }} />
        </colgroup>
        <tbody>
          <Tr>
            <Td
              style={{
                verticalAlign: "top",
              }}
            >
              <Typography sx={{ ...styles.font, ...styles.companyName }}>{shopName}</Typography>
              <Typography sx={{ ...styles.font, ...styles.address }}>
                {`Địa chỉ: ${import.meta.env.REACT_APP_SHOP_ADDRESS}`}
              </Typography>
            </Td>
            <Td rowSpan={2}>
              <img
                style={styles.barCode}
                src={textToBase64Barcode(orderNumber || "#23456789", false)}
                alt={orderNumber}
              />
              <Typography sx={{ ...styles.font, pl: "5px" }}>
                Đơn hàng: <b>{orderNumber}</b>
              </Typography>
              <Typography sx={{ ...styles.font, pl: "5px" }}>
                Ngày đặt: <b>{fDate(orderDate)}</b>
              </Typography>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Typography sx={{ ...styles.font }}>
                Người nhận: <b>{`${customerName} - ${customerPhone}`}</b>
              </Typography>
              <Typography sx={{ ...styles.font }}>{address}</Typography>
            </Td>
          </Tr>
          <Tr>
            <Td colSpan={2}>
              <table
                style={{ borderCollapse: "separate", borderSpacing: "0.5em 0.5em", width: "100%" }}
              >
                <colgroup>
                  <col span={1} style={{ width: "8%" }} />
                  <col span={1} style={{ width: "57%" }} />
                  <col span={1} style={{ width: "10%" }} />
                  <col span={1} style={{ width: "10%" }} />
                  <col span={1} style={{ width: "5%" }} />
                  <col span={1} style={{ width: "10%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <TableHead>STT</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead style={{ textAlign: "right" }}>Giá niêm yết</TableHead>
                    <TableHead style={{ textAlign: "right" }}>Giá KM</TableHead>
                    <TableHead style={{ textAlign: "right" }}>SL</TableHead>
                    <TableHead style={{ textAlign: "right" }}>Thành tiền</TableHead>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product: ProductProps, index: number) => (
                    <React.Fragment key={index}>
                      <tr>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell style={{ textAlign: "left" }}>{product.name}</TableCell>
                        <TableCell style={{ textAlign: "right" }}>{`${fCurrency2(
                          product.neoPrice
                        )}đ`}</TableCell>
                        <TableCell style={{ textAlign: "right" }}>{`${fCurrency2(
                          product.salePrice
                        )}đ`}</TableCell>
                        <TableCell style={{ textAlign: "right" }}>{product.quantity}</TableCell>
                        <TableCell style={{ textAlign: "right" }}>{`${fCurrency2(
                          product.salePrice * (product.quantity - product.giftVariantQuantity)
                        )}đ`}</TableCell>
                      </tr>
                      {/* {product.bundleVariants &&
                        product.bundleVariants.map((variant: any) => (
                          <tr>
                            <TableCell2 />
                            <TableCell2
                              style={{
                                textAlign: "left",
                                paddingLeft: 24,
                              }}
                            >
                              <Typography>
                                {variant.name}
                                {" x"}
                                {variant.quantity}
                              </Typography>
                            </TableCell2>
                            <TableCell2 style={{ textAlign: "right" }}></TableCell2>
                            <TableCell2 style={{ textAlign: "right" }}></TableCell2>
                            <TableCell2 style={{ textAlign: "right" }}></TableCell2>
                            <TableCell2 style={{ textAlign: "right" }}></TableCell2>
                          </tr>
                        ))} */}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </Td>
          </Tr>
          <Tr>
            <Td colSpan={2}>
              <RowTotal
                label="Tổng tiền hàng sau KM:"
                value={`${fCurrency2(orderTotalAfterDiscount || 0)}đ`}
              />
            </Td>
          </Tr>

          {(shippingCost || 0) > 0 && (
            <Tr>
              <Td colSpan={2}>
                <RowTotal label="Phí vận chuyển:" value={`${fCurrency2(shippingCost || 0)}đ`} />
              </Td>
            </Tr>
          )}
          {(additionalFee || 0) > 0 && (
            <Tr>
              <Td colSpan={2}>
                <RowTotal label="Phụ thu:" value={`${fCurrency2(additionalFee || 0)}đ`} />
              </Td>
            </Tr>
          )}

          {(promotion || 0) > 0 && (
            <Tr>
              <Td colSpan={2}>
                <RowTotal label="Khuyến mãi đơn hàng:" value={`${fCurrency2(promotion || 0)}đ`} />
              </Td>
            </Tr>
          )}

          {(discount || 0) > 0 && (
            <Tr>
              <Td colSpan={2}>
                <RowTotal label="Giảm giá:" value={`${fCurrency2(discount || 0)}đ`} />
              </Td>
            </Tr>
          )}

          {(paid || 0) > 0 && (
            <>
              <Tr>
                <Td colSpan={2}>
                  <RowTotal label="Tổng cộng:" value={`${fCurrency2(totalActual || 0)}đ`} />
                </Td>
              </Tr>
              <Tr>
                <Td colSpan={2}>
                  <RowTotal label="Đã thanh toán:" value={`${fCurrency2(paid || 0)}đ`} />
                </Td>
              </Tr>
            </>
          )}

          <Tr>
            <Td colSpan={2}>
              <RowTotal label="Tổng số tiền thu COD:" value={`${fCurrency2(total || 0)}đ`} bold />
            </Td>
          </Tr>
        </tbody>
        <caption style={styles.caption}>
          Hotline CSKH / xử lý sự cố giao nhận hàng: <b>{import.meta.env.REACT_APP_HOTLINE}</b>
        </caption>
        <caption style={styles.caption}>{COMMON_NOTE_PRINT_ORDER}</caption>

        <caption style={styles.caption}>
          {deliveryNote ? (
            <>
              Ghi chú vận đơn: <b>{deliveryNote}</b>
            </>
          ) : (
            ""
          )}
        </caption>
      </table>
    </Box>
  );
};

export default OrderTemplate2;

const RowTotal = ({ label, value, bold }: { label: string; value: any; bold?: boolean }) => {
  return (
    <Grid container spacing={1} sx={{ width: "100%", marginLeft: "auto" }}>
      <Grid item xs={10}>
        <Typography sx={{ ...styles.font, ...styles.total, fontWeight: bold ? "bold" : "600" }}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography sx={{ ...styles.font, ...styles.total, fontWeight: bold ? "bold" : "600" }}>
          {value}
        </Typography>
      </Grid>
    </Grid>
  );
};

const fontFamily = "Avenir Next, sans-serif";

const styles: any = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    p: 2,
    backgroundColor: "white",
    color: "#000",
    mb: 2,
  },
  table: {
    border: "1px solid black",
    borderCollapse: "collapse",
  },
  companyName: {
    fontFamily,
    fontWeight: 700,
    fontSize: "22px",
  },
  font: {
    fontFamily,
    fontWeight: 600,
  },
  total: {
    textAlign: "right",
    fontWeight: 600,
    paddingRight: "0.5em",
  },
  caption: {
    width: "100%",
    textAlign: "left",
    fontFamily,
    fontWeight: 500,
    captionSide: "bottom",
    marginTop: 4,
  },
  barCode: {
    width: "100%",
    height: "100px",
    objectFit: "fill",
    marginLeft: "-4px",
  },
};

const TableCell = styled("td")(({}) => ({
  textAlign: "center",
  verticalAlign: "middle",
  fontSize: "14px",
  fontWeight: "600",
  fontFamily,
}));

const TableHead = styled("th")(({}) => ({
  fontSize: "15px",
  fontFamily,
}));

const Tr = styled("tr")(() => ({
  ...styles.table,
}));

const Td = styled("td")(() => ({
  ...styles.table,
  padding: "4px",
}));

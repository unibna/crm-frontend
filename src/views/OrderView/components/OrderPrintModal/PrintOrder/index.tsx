import styled from "@emotion/styled";
import React, { forwardRef, useMemo, useState } from "react";

import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Image from "components/Images/Image";
import OrderPrintLog from "./OrderPrintLog";
import "./printOrder.css";
import template2 from "./samples/template2.png";
import OrderTemplate2 from "./templates/OrderTemplate2";

export interface ProductProps {
  name: string;
  quantity: number;
  price: number;
  salePrice: number;
  neoPrice: number;
  SKUCode: string;
  giftVariantQuantity: number;
  bundleVariants?: {
    name: string;
    quantity: number;
    price: number;
    salePrice: number;
    SKUCode: string;
  }[];
}
export interface OrderTemplateProps {
  orderNumber?: string;
  shippingNumber?: string;
  companyAddress?: string;
  orderDate?: string;
  customerName?: string;
  customerPhone?: string;
  address?: string;
  products?: ProductProps[];
  orderTotal?: number;
  discount?: number;
  shippingCost?: number;
  total?: number;
  note?: string;
  deliveryNote?: string;
  promotion?: number;
  paid?: number;
  orderTotalAfterDiscount?: number;
  additionalFee?: number;
  totalActual?: number;
  shopName?: string;
}

const templates = [
  {
    preview: template2,
    component: OrderTemplate2,
    shopName: import.meta.env.REACT_APP_SHOP_NAME,
  },
];

const PrintOrder = forwardRef(({ orders }: { orders: OrderTemplateProps[] }, ref) => {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const Template = templates[selectedTemplate].component;

  const onAddList = (prev: ProductProps[], product: ProductProps) => {
    const index = prev.findIndex(
      (prevProduct: ProductProps) => prevProduct.SKUCode === product.SKUCode
    );

    if (index !== -1) {
      const temp = {
        ...product,
        quantity: prev[index].quantity + product.quantity,
      };
      prev[index] = { ...temp };
    } else {
      prev.push(product);
    }
  };

  const products = useMemo(() => {
    return orders.reduce((prev: ProductProps[], current: OrderTemplateProps) => {
      current?.products?.map((product) => {
        if (product?.bundleVariants && product?.bundleVariants?.length > 0) {
          product?.bundleVariants?.map((item: any) => {
            onAddList(prev, { ...item, quantity: item.quantity });
          });
        } else {
          onAddList(prev, product);
        }
      });
      return prev;
    }, []);
  }, [orders]);

  return (
    <Grid container sx={{ height: "100%", overflowY: "hidden" }}>
      <Grid
        item
        xs={4}
        sx={{ p: 2, borderRight: "2px solid #eee", height: "100%", overflowY: "auto" }}
      >
        <ul style={styles.ul}>
          {templates.map((template, index) => (
            <Li
              key={index}
              style={styles.li}
              active={selectedTemplate === index}
              onMouseDown={() => setSelectedTemplate(index)}
            >
              <Image src={template.preview} alt={`${index}`} sx={styles.image} />
              <Typography sx={styles.name}>{template.shopName}</Typography>
            </Li>
          ))}
        </ul>
      </Grid>
      <Grid item xs={8} sx={{ p: 2, height: "100%", overflowY: "auto" }}>
        <Box ref={ref} sx={{ width: "100%" }}>
          {orders?.map((order, index) => (
            <React.Fragment key={index}>
              <div className="page-break" />
              <Template key={index} {...order} shopName={templates[selectedTemplate].shopName} />
            </React.Fragment>
          ))}
          <React.Fragment>
            <div className="page-break" />
            <OrderPrintLog products={products} orders={orders.map((order) => order.orderNumber)} />
          </React.Fragment>
        </Box>
      </Grid>
    </Grid>
  );
});

export default PrintOrder;

const styles: any = {
  ul: {
    listStyleType: "none",
  },
  li: {
    margin: "8px 0",
    position: "relative",
    cursor: "pointer",
    borderRadius: "8px",
    overflow: "hidden",
  },
  image: {
    backgroundColor: "#fafafa",
    img: {
      width: "100%",
      height: "200px",
      objectFit: "contain",
    },
  },
  name: {
    fontWeight: 600,
    marginTop: "4px",
    position: "absolute",
    fontSize: "14px",
    right: "12px",
    bottom: "12px",
  },
};

const Li = styled("li", {
  shouldForwardProp: (prop) => prop !== "active",
})((props: any) => {
  const theme = useTheme();
  return {
    border: "2px solid #eee",
    transition: "0.3s border-color ease-in-out",
    "&:hover": {
      borderColor: `${theme.palette.primary.main}`,
    },
    ...(props.active && {
      borderColor: `${theme.palette.primary.main}`,
    }),
  };
});

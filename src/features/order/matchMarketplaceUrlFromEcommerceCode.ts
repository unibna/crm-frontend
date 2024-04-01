import { AttributeType } from "_types_/AttributeType";
import { toSimplest } from "utils/stringsUtil";

export const TIKTOK_MARKETPLACE_URL = "https://seller-vn.tiktok.com/order/detail?order_no=";
export const LAZADA_MARKETPLACE_URL =
  "https://sellercenter.lazada.vn/apps/order/detail?tradeOrderId=";

export const SHOPEE_MARKETPLACE_URL = `https://banhang.shopee.vn/portal/sale/order/`;

export const matchMarketplaceUrlFromEcommerceCode = (
  ecommerce_code?: string,
  source?: AttributeType
) => {
  return ecommerce_code && source
    ? toSimplest(source.name).includes("tiktok")
      ? `${TIKTOK_MARKETPLACE_URL + ecommerce_code}`
      : toSimplest(source.name).includes("lazada")
      ? `${LAZADA_MARKETPLACE_URL + ecommerce_code}`
      : toSimplest(source.name).includes("shopee")
      ? `${SHOPEE_MARKETPLACE_URL + ecommerce_code}`
      : ""
    : "";
};

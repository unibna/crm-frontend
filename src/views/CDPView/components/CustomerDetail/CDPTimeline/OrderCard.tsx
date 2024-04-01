import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { ORDER_STATUS_VALUE } from "views/OrderView/constants";
import { OrderStatusValue, OrderType } from "_types_/OrderType";
import { fNumber } from "utils/formatNumber";
import { useTheme } from "@mui/material";
import { Theme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import Popover from "@mui/material/Popover";
import { fDateTime } from "utils/dateUtil";
import { ShippingType } from "_types_/ShippingType";
import Link from "@mui/material/Link";
import { deliveryCodeUrl } from "views/ShippingView/constants";
import useIsMountedRef from "hooks/useIsMountedRef";
import map from "lodash/map";

import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import { NoDataPanel } from "components/DDataGrid/components";
import { Span, MTextLine } from "components/Labels";
import { ProductItem } from "components/ProductComponent";
import { orderApi } from "_apis_/order.api";
import { useCancelToken } from "hooks/useCancelToken";
import { ClickAwayListener } from "@mui/material";
import { LABEL_STATUS_SHIPPING } from "constants/shipping";
import { AttributeVariant } from "_types_/ProductType";
import { ErrorName } from "_types_/ResponseApiType";
import { AttributeType } from "_types_/AttributeType";

const OrderCard = ({
  status,
  order_key,
  total_variant_all,
  total_variant_actual,
  id,
  ecommerce_code,
  source,
  completed_time,
  shipping,
  cancel_reason,
}: {
  id: string;
  cancel_reason?: AttributeType;
  ecommerce_code?: string;
  status: OrderStatusValue;
  source?: { id: number; name: string };
  order_key?: string;
  total_variant_all?: number;
  total_variant_actual?: number;
  completed_time?: string;
  shipping?: ShippingType;
}) => {
  const theme = useTheme();
  const styles = styled(theme);
  const { newCancelToken } = useCancelToken();
  const orderStatus = ORDER_STATUS_VALUE[status];
  const isMounted = useIsMountedRef();
  const [variantSummary, setVariantSummary] = useState<{
    data: AttributeVariant[];
    loading: boolean;
  }>({
    data: [],
    loading: false,
  });

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const getOrderByID = useCallback(async () => {
    if (open) {
      setVariantSummary((prev) => ({ ...prev, loading: true }));
      const resOrder = await orderApi.getId<OrderType>({
        endpoint: `${id}/`,
        params: { cancelToken: newCancelToken() },
      });
      if (resOrder?.data) {
        let variants: AttributeVariant[] = [];

        map(resOrder.data.data?.line_items, (item) => {
          const { variant, quantity = 0 } = item;
          if (variant?.id) {
            variants[variant.id] = {
              ...variant,
              quantity: (variants[variant.id]?.quantity || 0) + quantity,
            };
          }
          map(item.item_gift_variants, (giftItem) => {
            if (giftItem.promotion_variant.variant.id) {
              variants[parseInt(giftItem.promotion_variant.variant.id)] = {
                ...giftItem.promotion_variant.variant,
                quantity:
                  (variants[parseInt(giftItem.promotion_variant.variant.id)]?.quantity || 0) +
                  giftItem.gift_quantity,
              };
            }
          });
        });
        isMounted.current &&
          setVariantSummary((prev) => ({ ...prev, data: variants, loading: false }));
        return;
      }
      if ((resOrder?.error?.name as ErrorName) === "CANCEL_REQUEST") {
        return;
      }
      setVariantSummary((prev) => ({ ...prev, loading: false }));
    }
  }, [id, open, isMounted, newCancelToken]);

  useEffect(() => {
    getOrderByID();
  }, [getOrderByID]);

  return (
    <Stack onClick={handlePopoverOpen}>
      <Stack
        spacing={0.5}
        aria-owns={open ? "mouse-over-order-popover" : undefined}
        aria-haspopup="true"
        style={{ position: "relative" }}
      >
        {orderStatus && (
          <Span color={orderStatus.color} sx={styles.chip}>
            {orderStatus.value}
          </Span>
        )}
        {status === "cancel" && <MTextLine label="Lý do huỷ đơn:" value={cancel_reason?.name} />}
        {order_key && (
          <MTextLine
            value={
              <a
                href={`${window.location.origin}/orders/${id}?sourceName=${source?.name}&ecommerceCode=${ecommerce_code}`}
                target="_blank"
                rel="noreferrer"
                style={{ ...styles.mainText, textDecoration: "none" }}
              >
                {order_key}
              </a>
            }
            label="Mã đơn"
          />
        )}
        {total_variant_actual && (
          <MTextLine
            label="Doanh thu:"
            value={<Typography fontSize={13}>{fNumber(total_variant_actual)}</Typography>}
          />
        )}
        {source && (
          <MTextLine
            label="Kênh bán hàng:"
            value={<Typography fontSize={13}>{source.name}</Typography>}
          />
        )}
        {shipping ? (
          <MTextLine
            label="Trạng thái giao hàng:"
            value={
              <Typography fontSize={13}>
                {LABEL_STATUS_SHIPPING[shipping.carrier_status]}
              </Typography>
            }
          />
        ) : order_key ? (
          <MTextLine
            value={
              <a
                href={`${window.location.origin}/orders/${id}?sourceName=${source?.name}&ecommerceCode=${ecommerce_code}`}
                target="_blank"
                rel="noreferrer"
                style={{ ...styles.mainText, textDecoration: "none" }}
              >
                Tạo vận đơn
              </a>
            }
            label="Trạng thái giao hàng:"
          />
        ) : null}

        {/* anchor origin */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "green",
            position: "absolute",
            top: -10,
            right: -10,
          }}
        />
      </Stack>
      <Popover
        id="mouse-over-popover"
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <ClickAwayListener onClickAway={handlePopoverClose} disableReactTree>
          <Stack padding={1} spacing={1}>
            {source && (
              <MTextLine
                label="Kênh bán hàng:"
                value={<Typography fontSize={13}>{source.name}</Typography>}
              />
            )}
            {completed_time && (
              <MTextLine
                label="Ngày xác nhận:"
                value={<Typography fontSize={13}>{fDateTime(completed_time)}</Typography>}
              />
            )}
            {shipping?.tracking_number ? (
              <MTextLine
                label="Mã vận đơn:"
                value={
                  <Typography fontSize={13}>
                    <Link
                      href={deliveryCodeUrl({
                        deliveryType: shipping.delivery_company_type,
                        trackingNumber: shipping.tracking_number as any,
                        source,
                      })}
                      target="_blank"
                      rel="noreferrer"
                      sx={{ fontSize: 13 }}
                    >
                      {shipping.tracking_number}
                    </Link>
                  </Typography>
                }
              />
            ) : null}
            <Typography fontSize={13}>Danh sách sản phẩm:</Typography>
            <TableContainer component={Paper}>
              {variantSummary.loading && <LinearProgress />}
              <Paper elevation={2}>
                <Grid
                  container
                  p={2}
                  justifyContent="flex-start"
                  alignItems="center"
                  sx={{ color: "#637381", mb: 0.5 }}
                >
                  <Grid item xs={5}>
                    <Typography style={styles.header}>Sản phẩm</Typography>
                  </Grid>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={1.5}>
                    <Typography style={styles.header}>Giá niêm yết</Typography>
                  </Grid>
                  <Grid item xs={1.5}>
                    <Typography style={styles.header}>Giá bán</Typography>
                  </Grid>
                  <Grid item xs={1.5}>
                    <Typography style={styles.header}>Số lượng</Typography>
                  </Grid>
                  <Grid item xs={1.5}>
                    <Typography style={styles.header}>Thành tiền</Typography>
                  </Grid>
                </Grid>
              </Paper>
              {map(Object.keys(variantSummary.data), (item, index) => {
                return (
                  <ProductItem
                    key={index}
                    product={variantSummary.data[parseInt(item)]}
                    index={index}
                    isShowPromotion={false}
                    hiddenColumns={["cross_sale"]}
                    isShowInventoryForOrderConfirm={false}
                    isShowActualInventory={false}
                  />
                );
              })}
            </TableContainer>
            {Object.keys(variantSummary.data)?.length == 0 ? <NoDataPanel showImage /> : null}
          </Stack>
        </ClickAwayListener>
      </Popover>
    </Stack>
  );
};

export default OrderCard;

const styled = (theme: Theme) => {
  return {
    mainText: {
      fontWeight: 400,
      fontSize: 14,
      color: theme.palette.primary.main,
    },
    chip: {
      width: "fit-content",
      whiteSpace: "break-spaces",
      lineHeight: "150%",
      height: "auto",
      padding: "4px 8px",
    },
    labelInfo: {
      fontWeight: 400,
      fontSize: 13,
      display: "inline",
    },
    info: {
      fontWeight: 600,
      fontSize: 13,
      display: "inline",
    },
    createAt: {
      fontWeight: 400,
      fontSize: "0.775rem",
    },
    handler: {
      fontWeight: 400,
      fontSize: 13,

      color: theme.palette.primary.dark,
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    infoChip: {
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: "24px",
      background: theme.palette.primary.main,
      padding: "2px 8px",
      color: theme.palette.primary.contrastText,
    },
    copyIconStyle: {
      position: "absolute",
      top: -12,
      right: -16,
      cursor: "pointer",
      color: theme.palette.primary.main,
      "&:hover": {
        color: theme.palette.primary.dark,
        transition: "all .15s ease-in-out",
      },
      svg: {
        width: 15,
        height: 15,
      },
    },
    header: {
      fontSize: 13,
    },
  } as { [key: string]: any };
};

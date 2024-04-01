//components
import FormHelperText from "@mui/material/FormHelperText";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Section, TitleSection } from "components/Labels";
import { ProductModal, ProductList } from "components/ProductComponent";
import { SearchField } from "components/Fields";

//utils
import vi from "locales/vi.json";
import map from "lodash/map";

//hooks
import React, { memo, useState } from "react";

//types
import { FieldErrors } from "react-hook-form";
import { OrderFormType, OrderPaymentType } from "_types_/OrderType";

//icons
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { AttributeVariant } from "_types_/ProductType";

const LoadingSkeleton = () => {
  return (
    <>
      {map([1, 2, 3, 4], (item) => (
        <Stack direction="row" alignItems="center" key={item} width="100%" spacing={1}>
          <Skeleton variant="circular" width={35} height={35} sx={{ flexShrink: 0 }} />
          <Skeleton width="100%" height={60} />
          <Skeleton width="100%" height={60} />
          <Skeleton width={60} height={60} />
          <Skeleton width={60} height={60} />
        </Stack>
      ))}
    </>
  );
};

const OrderVariant = ({
  line_items = [],
  errors,
  onChangeLineItems,
  onChangePayment,
  onRefreshLineItems,
  payment,
  loading,
  isSearch,
}: {
  isSearch?: boolean;
  line_items: AttributeVariant[];
  payment?: OrderPaymentType;
  errors: FieldErrors<OrderFormType>;
  onChangePayment: (payment: OrderPaymentType) => void;
  onChangeLineItems: (lineItems: AttributeVariant[]) => void;
  onRefreshLineItems?: () => void;
  loading?: boolean;
}) => {
  const [searchProductText, setSearchProductText] = useState("");

  const lineItemError = errors.line_items as
    | { message: string }
    | {
        batch: {
          message: string;
        };
      }[]
    | undefined;

  const disabledStyles: React.CSSProperties = { pointerEvents: !isSearch ? "none" : "auto" };

  return (
    <Section elevation={3} sx={{ mb: 2 }}>
      <Stack direction={"row"} justifyContent="space-between">
        <TitleSection>{vi.product.product}</TitleSection>
        {onRefreshLineItems && (
          <Tooltip title="Làm mới danh sách sản phẩm">
            <IconButton style={{ marginLeft: 8 }} onClick={onRefreshLineItems}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Divider sx={{ my: 1, mb: 2 }} />

      {Array.isArray(lineItemError) && (
        <FormHelperText error={!!lineItemError}>
          {Array.isArray(lineItemError) && lineItemError[0]?.batch?.message}
        </FormHelperText>
      )}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {isSearch && (
            <SearchField
              style={{
                marginBottom: 8,
                ...disabledStyles,
              }}
              onSearch={setSearchProductText}
              fullWidth
              defaultValue={searchProductText}
              renderIcon={<SearchIcon />}
              placeholder="Nhập sku, tên sản phẩm"
              error={lineItemError ? (Array.isArray(lineItemError) ? false : true) : false}
              helperText={Array.isArray(lineItemError) ? "" : lineItemError?.message}
              autoFocus
            />
          )}

          <ProductList
            disabled={!isSearch}
            selectedProducts={line_items}
            setSelectedProducts={onChangeLineItems}
            setPayment={(value) => onChangePayment({ ...payment, ...value })}
            isShowPromotion
            payment={payment}
            isShowInventory
            error={errors.line_items}
            bundleHiddenColumns={["listed_price", "price", "total", "quantity"]}
          />

          <ProductModal
            setSelectedProduct={(products) => {
              onChangeLineItems([...line_items, ...products]);
            }}
            setSearchProductText={setSearchProductText}
            setPayment={(value) => onChangePayment({ ...payment, ...value })}
            payment={payment}
            params={{ in_warehouse_sales: "true" }}
            searchDefault={searchProductText}
          />
        </>
      )}
    </Section>
  );
};

export default memo(OrderVariant);

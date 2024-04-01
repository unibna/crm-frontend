// Libraries
import { useState, useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import map from "lodash/map";
import reduce from "lodash/reduce";
import findIndex from "lodash/findIndex";
import produce from "immer";
import { useTheme } from "@mui/material/styles";
import Iconify from "components/Icons/Iconify";

// Components
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import DDataGrid from "components/DDataGrid";
// import Image from "components/Images/Image";
import { Span } from "components/Labels";
import MImage from "components/Images/MImage";

// Types
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { ColumnShow } from "_types_/FacebookType";
import { FormValuesProps } from "components/Popups/FormPopup";
import { InventoryByBatch } from "_types_/WarehouseType";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { fValueVnd } from "utils/formatNumber";
import logoIcon from "assets/images/icon-logo.png";
import { ROLE_TAB } from "constants/rolesTab";
import { AttributeVariant } from "_types_/ProductType";

// ------------------------------------------

const columnShowProduct: ColumnShow = {
  columnWidths: [{ columnName: "product", width: 700 }],
  columnsShowHeader: [
    {
      name: "product",
      title: "Sản phẩm",
      isShow: true,
    },
  ],
};

interface Props extends UseFormReturn<FormValuesProps, object> {}

interface ProductItemType extends AttributeVariant {
  info_warehouse: InventoryByBatch[];
  batch_selected: InventoryByBatch;
}
interface PropsItem extends UseFormReturn<FormValuesProps, object> {
  productItem: ProductItemType;
  handleSelectBatch: (batchItem: InventoryByBatch) => void;
}

const ProductItem = (props: PropsItem) => {
  const { productItem, watch, handleSelectBatch } = props;
  const theme = useTheme();
  const { addressSend } = watch();

  return (
    <Grid container wrap="nowrap" direction="row">
      <Stack direction="row">
        <MImage
          src={getObjectPropSafely(() => productItem.image?.url) || logoIcon}
          preview
          width={64}
          height={64}
        />
        <Stack spacing={0.5} className="ellipsis-label" sx={{ ml: 2 }}>
          <Link
            underline="hover"
            variant="subtitle2"
            color="primary.main"
            sx={{ cursor: "pointer" }}
            href={`/${ROLE_TAB.PRODUCT}/${getObjectPropSafely(() => productItem.id)}`}
            target="_blank"
            rel="noreferrer"
          >
            {productItem.name}
          </Link>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography sx={{ fontSize: 13 }}>Giá:</Typography>
              <Typography variant="subtitle2">
                {fValueVnd(getObjectPropSafely(() => productItem.sale_price))}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography sx={{ fontSize: 13 }}>Số lượng:</Typography>
              <Typography variant="subtitle2">
                {getObjectPropSafely(() => productItem.quantity)}
              </Typography>
            </Stack>
          </Stack>

          <Stack>
            {getObjectPropSafely(() => productItem.info_warehouse.length) ? (
              map(productItem.info_warehouse, (item: InventoryByBatch, index: number) => {
                const isChecked =
                  getObjectPropSafely(() => item.variant_batch.id) ===
                  getObjectPropSafely(() => productItem.batch_selected.variant_batch.id);

                return (
                  <FormControlLabel
                    key={index}
                    control={
                      <Radio
                        checked={isChecked}
                        onChange={() => handleSelectBatch(item)}
                        checkedIcon={<Iconify icon={"eva:checkmark-circle-2-fill"} />}
                      />
                    }
                    sx={{ ml: 1 }}
                    label={
                      <Stack direction="row">
                        <Typography sx={{ fontSize: 13 }}>
                          Lô: {getObjectPropSafely(() => item.variant_batch.batch_name)} | SL:{" "}
                          {item.total_inventory} (Tồn thực kho giao) - {item?.reserved_inventory}{" "}
                          (Phiếu kho chưa XN)
                        </Typography>
                        <Span
                          variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                          color="info"
                          sx={{ ml: 1 }}
                        >
                          {addressSend.label}
                        </Span>
                      </Stack>
                    }
                  />
                );
              })
            ) : (
              <Typography sx={{ fontSize: 13, mt: 1 }} color="error">
                Không có sản phẩm trong kho
              </Typography>
            )}
          </Stack>

          {getObjectPropSafely(() => productItem.batch_selected.errorMessage) ? (
            <Stack>
              <Typography sx={{ fontSize: 13, mt: 1 }} color="error">
                {productItem.batch_selected.errorMessage}
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </Stack>
    </Grid>
  );
};

const Product = (props: Props) => {
  const { watch, setValue } = props;
  const theme = useTheme();
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowProduct.columnWidths
  );
  const [columnOrders, setColumnOrders] = useState<string[]>([]);

  const { products, products_promotion } = watch();

  useEffect(() => {
    const newColumnOrder = map(columnShowProduct.columnsShowHeader, (item) => item.name);
    setColumnOrders(newColumnOrder);
  }, []);

  const handleSelectBatchProducts = (batchItem: InventoryByBatch, productItem: ProductItemType) => {
    const newProducts = reduce(
      products,
      (prevArr, item) => {
        return getObjectPropSafely(() => productItem.variant_id) ===
          getObjectPropSafely(() => item.variant_id)
          ? [
              ...prevArr,
              {
                ...item,
                batch_selected: batchItem,
              },
            ]
          : [...prevArr, item];
      },
      []
    );

    setValue("products", newProducts);
  };

  const handleSelectBatchProductsPromotion = (
    batchItem: InventoryByBatch,
    giftPromotionItem: ProductItemType,
    indexProduct: number
  ) => {
    const newProductPromotion = produce(products_promotion, (draft: any) => {
      draft[indexProduct].gifts = reduce(
        draft[indexProduct].gifts,
        (prevArr, item) => {
          return getObjectPropSafely(() => giftPromotionItem.id) ===
            getObjectPropSafely(() => item.id)
            ? [
                ...prevArr,
                {
                  ...item,
                  batch_selected: batchItem,
                },
              ]
            : [...prevArr, item];
        },
        []
      );
    });

    setValue("products_promotion", newProductPromotion);
  };

  const formatContentProduct = (productItem: ProductItemType) => {
    const index = findIndex(
      products_promotion,
      (item: any) =>
        getObjectPropSafely(() => item.variant_id) ===
        getObjectPropSafely(() => productItem.variant_id)
    );

    const isShowPromotion = index !== -1;

    return (
      <>
        <ProductItem
          {...props}
          productItem={productItem}
          handleSelectBatch={(batchItem: InventoryByBatch) =>
            handleSelectBatchProducts(batchItem, productItem)
          }
        />
        {isShowPromotion ? (
          <Grid container sx={{ ml: 13, mt: 2 }}>
            {map(products_promotion[index].gifts, (item, indexGift) => (
              <ProductItem
                key={indexGift}
                {...props}
                productItem={item}
                handleSelectBatch={(batchItem: InventoryByBatch) =>
                  handleSelectBatchProductsPromotion(batchItem, item, index)
                }
              />
            ))}
          </Grid>
        ) : null}
      </>
    );
  };

  const data = useMemo(() => {
    return map(products, (item) => {
      return {
        ...item,
        product: {
          content: formatContentProduct(item),
        },
        sale_price: getObjectPropSafely(() => item.sale_price),
        purchase_price: getObjectPropSafely(() => item.purchase_price),
        warehouse: {
          content: getObjectPropSafely(() => item.warehouse.name) ? (
            <Span variant={theme.palette.mode === "light" ? "ghost" : "filled"} color="info">
              {getObjectPropSafely(() => item.warehouse.name)}
            </Span>
          ) : (
            <></>
          ),
        },
      };
    });
  }, [products, products_promotion]);

  return (
    <DDataGrid
      data={data}
      heightProps={800}
      isShowListToolbar={false}
      columns={columnShowProduct.columnsShowHeader}
      columnOrders={columnOrders}
      columnWidths={columnWidths}
      contentOptional={{
        arrColumnOptional: ["product", "warehouse"],
      }}
      arrAttachUnitVnd={["sale_price", "purchase_price"]}
      setColumnWidths={setColumnWidths}
      handleChangeColumnOrder={setColumnOrders}
    />
  );
};

export default Product;

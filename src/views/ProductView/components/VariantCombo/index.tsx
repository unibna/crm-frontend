// Libraries
import { useState, useEffect, useContext } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { useTheme } from "@mui/material/styles";
import map from "lodash/map";
import find from "lodash/find";

// Services
import { productApi } from "_apis_/product";

// Context
import { DetailVariantContext } from "views/ProductView/containers/DetailVariant/context";

// Components
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DataGrid from "components/DataGrid";
import { Span } from "components/Labels";

// Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { AttributeVariant, STATUS_PRODUCT } from "_types_/ProductType";

// Constants & Utils
import { columnShowDetailVariantCombo, optionPlatformEcommerce } from "views/ProductView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { ROLE_TAB } from "constants/rolesTab";
import { getColumnsShow, handleChangeColumnOrders } from "utils/tableUtil";

// -----------------------------------------------------------------

const VariantCombo = () => {
  const theme = useTheme();
  const { variantId, isRefresh } = useContext(DetailVariantContext);

  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowDetailVariantCombo.columnWidths
  );
  const [isLoading, setLoading] = useState(false);
  const [columnsShowHeader, setColumnsShowHeader] = useState<ColumnTypeDefault<any>[]>(
    getColumnsShow(columnShowDetailVariantCombo.columnsShowHeader)
  );
  const [variants, setVariants] = useState<AttributeVariant[]>([]);

  useEffect(() => {
    if (variantId) {
      getVariants({
        variant_id: variantId,
      });
    }
  }, [isRefresh]);

  const getVariants = async (params: any) => {
    setLoading(true);
    const result: any = await productApi.get(params, "variant/");

    if (result && result.data) {
      const { results = [] } = result.data;
      const newData = getObjectPropSafely(() => results[0].bundle_variants.length)
        ? map(
            results[0].bundle_variants,
            (item: { quantity: number; variant: any; variant_total: number }) => {
              const { variant = {} } = item;
              const newEcommerce = map(variant.variants_ecommerce_map, (current) => {
                const objEcommerce = find(
                  optionPlatformEcommerce,
                  (obj) => obj.value === getObjectPropSafely(() => current.ecommerce_platform)
                );

                return (
                  <Stack direction="row">
                    <Span
                      variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                      color={objEcommerce?.color || "warning"}
                    >
                      {objEcommerce?.label}
                    </Span>
                    <Typography variant="caption" sx={{ ml: 1.5 }}>
                      {getObjectPropSafely(() => current.ecommerce_sku)}
                    </Typography>
                  </Stack>
                );
              });

              return {
                ...item.variant,
                quantity: item.quantity,
                variant_total: item.variant_total,
                value: variant.name || "",
                created_by: getObjectPropSafely(() => variant?.created_by?.name),
                modified_by: getObjectPropSafely(() => variant?.modified_by?.name),
                thumb_img_variant: getObjectPropSafely(() => variant?.image.url),
                name: {
                  value: variant.name,
                  props: {
                    href: `/${ROLE_TAB.PRODUCT}/${getObjectPropSafely(() => variant.id)}`,
                  },
                },
                status: {
                  value:
                    variant.status === STATUS_PRODUCT.ACTIVE
                      ? "Đang kinh doanh"
                      : "Ngừng kinh doanh",
                  color: variant.status === STATUS_PRODUCT.ACTIVE ? "success" : "error",
                },
                total_quantity_confirm:
                  getObjectPropSafely(() => variant.total_inventory) -
                  getObjectPropSafely(() => variant?.inventory_available?.quality_confirm),
                total_quantity_non_confirm:
                  getObjectPropSafely(() => variant.total_inventory) -
                  getObjectPropSafely(() => variant?.inventory_available?.quality_confirm) -
                  getObjectPropSafely(() => variant?.inventory_available?.quality_non_confirm),
                status_variant: variant.status,
                ecommerce_platform: {
                  content: <Stack spacing={1}>{newEcommerce}</Stack>,
                },
              };
            }
          )
        : [];

      setVariants(newData);
    }
    setLoading(false);
  };

  const handleOrderColumn = (columns: any) => {
    const newColumns = handleChangeColumnOrders(columns, columnsShowHeader);

    setColumnsShowHeader(newColumns.resultColumnsShow);
  };

  return (
    <DataGrid
      heightProps={700}
      isLoadingTable={isLoading}
      isShowListToolbar={false}
      data={variants}
      columns={columnsShowHeader}
      columnWidths={columnWidths}
      contentColumnShowInfo={{
        arrColumnShowInfo: ["variant", "info", "action", "ecommerce"],
        infoCell: columnShowDetailVariantCombo.columnShowTable,
      }}
      arrColumnHandleLink={["name"]}
      arrAttachUnitVnd={["sale_price", "purchase_price", "variant_total", "neo_price"]}
      arrColumnEditLabel={["status"]}
      arrDateTime={["created", "modified"]}
      arrColumnThumbImg={["variant"]}
      arrColumnOptional={["ecommerce_platform"]}
      setColumnWidths={setColumnWidths}
      handleChangeColumnOrder={handleOrderColumn}
    />
  );
};

export default VariantCombo;

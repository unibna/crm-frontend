// Libraries
import { useContext, useMemo, useState } from "react";
import map from "lodash/map";
import find from "lodash/find";
import { useTheme } from "@mui/material/styles";

// Hooks
import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";

// Components
import DataGrid from "components/DataGrid";
import TableDetailNoneApi from "components/DataGrid/components/TableDetailNoneApi";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Span } from "components/Labels";
import { TabWrap } from "components/Tabs";

// Types
import { FacebookType } from "_types_/FacebookType";
import { AttributeVariant, STATUS_PRODUCT } from "_types_/ProductType";

// Constants & Utils
import { SortType } from "_types_/SortType";
import { StoreProduct } from "views/ProductView/contextStore";
import {
  actionType,
  columnShowDetailVariantCombo,
  optionPlatformEcommerce,
  titlePopupHandleProduct,
} from "views/ProductView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { ROLE_TAB } from "constants/rolesTab";

// --------------------------------------------------------------

const VariantList = ({
  variants,
  totalCount,
  isLoading,
  isShowTableDetail,
  params,
  setParams,
  isShowFullTable,
  handleOpenPopup,
  handleCheckColumn,
}: {
  variants: AttributeVariant[];
  isLoading: boolean;
  isShowTableDetail: boolean;
  params: Partial<any>;
  isShowFullTable: boolean;
  totalCount: number;
  setParams: (params: Partial<any>) => void;
  handleOpenPopup: (type: string, value: Partial<any>) => void;
  handleCheckColumn: (columnSelected: string[]) => void;
}) => {
  const theme = useTheme();
  const { state: store, dispatch: dispatch } = useContext(StoreProduct);

  // State
  const [columnSelected, setColumnSelected] = useState<string[]>([]);
  const { variant } = store;

  useDidUpdateEffect(() => {
    handleCheckColumn && handleCheckColumn(columnSelected);
  }, [columnSelected]);

  const handleChangeSorting = (value: SortType[]) => {
    const columnName = value[0].columnName;
    const ordering = value[0].direction === "asc" ? columnName : "-" + columnName;

    setParams({
      ...params,
      ordering,
    });
  };

  const handleResizeColumns = (value: any) => {
    dispatch({
      type: actionType.RESIZE_COLUMN_VARIANT,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatch({
      type: actionType.UPDATE_COLUMN_ORDER_VARIANT,
      payload: columns,
    });
  };

  const handleChangePage = (page: number) => {
    setParams({
      ...params,
      page,
    });
  };

  const handleChangeRowsPerPage = (rowPage: number) => {
    setParams({
      ...params,
      limit: rowPage,
      page: 1,
    });
  };

  const renderTableDetail = (row: any, value: number) => {
    const newData = getObjectPropSafely(() => row.bundle_variants.length)
      ? map(
          row.bundle_variants,
          (item: { quantity: number; variant: AttributeVariant; variant_total: number }) => {
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
                  variant.status === STATUS_PRODUCT.ACTIVE ? "Đang kinh doanh" : "Ngừng kinh doanh",
                color: variant.status === STATUS_PRODUCT.ACTIVE ? "success" : "error",
              },
              quality_confirm: getObjectPropSafely(
                () => variant?.inventory_available?.quality_confirm
              ),
              quality_non_confirm: getObjectPropSafely(
                () => variant?.inventory_available?.quality_confirm
              ),
              status_variant: variant.status,
              ecommerce_platform: {
                content: <Stack spacing={1}>{newEcommerce}</Stack>,
              },
            };
          }
        )
      : [];

    return (
      <TabWrap value={value} index={0}>
        <TableDetailNoneApi
          isHeightCustom
          data={newData}
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
          columnShowDetail={columnShowDetailVariantCombo}
        />
      </TabWrap>
    );
  };

  const newVariants = useMemo(() => {
    return map(
      variants,
      (item): AttributeVariant => ({
        ...item,
        isCheck: columnSelected.includes(item?.id || ""),
      })
    );
  }, [variants, columnSelected]);

  return (
    <DataGrid
      isShowListToolbar={false}
      isFullTable={isShowFullTable}
      data={newVariants}
      dataTotal={totalCount}
      page={params.page}
      pageSize={params.limit}
      columns={variant.resultColumnsShow}
      columnWidths={variant.columnsWidthResize}
      isLoadingTable={isLoading}
      contentColumnHandleOperation={{
        arrColumnHandleOperation: ["operation"],
        handleEdit: (row: FacebookType) =>
          handleOpenPopup(titlePopupHandleProduct.EDIT_VARIANT, row),
      }}
      contentColumnShowInfo={{
        arrColumnShowInfo: ["variant", "info", "action", "ecommerce"],
        infoCell: variant.columnsShow,
      }}
      arrColumnHandleLink={["name"]}
      arrAttachUnitVnd={["sale_price", "purchase_price", "neo_price"]}
      arrColumnEditLabel={["status", "status_combo"]}
      arrDateTime={["created", "modified"]}
      arrColumnThumbImg={["variant"]}
      arrColumnOptional={["ecommerce_platform"]}
      renderTableDetail={isShowTableDetail ? renderTableDetail : null}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleCheckColumn={setColumnSelected}
    />
  );
};

export default VariantList;

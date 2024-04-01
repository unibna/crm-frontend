// Libraries
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { useTheme } from "@mui/material/styles";
import isEqual from "lodash/isEqual";
import map from "lodash/map";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// Services
import { productApi } from "_apis_/product";

// Hooks
import { useCancelToken } from "hooks/useCancelToken";
import usePopup from "hooks/usePopup";

// Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { CopyIconButton, MButton } from "components/Buttons";
import { MTextLine, Span } from "components/Labels";
import DataGrid from "components/DataGrid";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";

// Constants & Utils
import { ColumnShowDatagrid } from "_types_/FacebookType";
import { TypeWarehouseSheet } from "_types_/WarehouseType";
import vi from "locales/vi.json";
import { COMMAS_REGEX, TYPE_DATA, statusNotification } from "constants/index";
import { ROLE_TAB } from "constants/rolesTab";
import { fDate, fDateTime } from "utils/dateUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { handleChangeColumnOrders } from "utils/tableUtil";
import {
  NameSheet,
  columnShowDetailDefaultWidths,
  dataRenderInfomationWarehouseSheet,
  informationWarehouseSheetColumnType,
} from "views/WarehouseView/constants";

const SkeletonInfo = () => {
  return (
    <>
      <Skeleton variant="rectangular" sx={{ height: 200, width: "100%", borderRadius: 2 }} />
      <Box sx={{ display: "flex", mt: 1.5 }}>
        <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
        <Skeleton variant="text" sx={{ mx: 1, flexGrow: 1 }} />
      </Box>
    </>
  );
};

const DetailSheet = () => {
  const theme = useTheme();
  const paramRouter = useParams();
  const { newCancelToken } = useCancelToken();
  const { setNotifications } = usePopup();
  const objValueDefault = useRef({});

  // State
  const [detailSheet, setDetailSheet] = useState<Partial<any>>({});
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);
  const [objValue, setObjValue] = useState<Partial<any>>({});
  const [columnShow, setColumnShow] = useState<ColumnShowDatagrid<any>>(
    informationWarehouseSheetColumnType[TypeWarehouseSheet.IMPORTS]
  );
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowDetailDefaultWidths
  );

  useEffect(() => {
    if (paramRouter.sheetId) {
      getListInfomationWarehouseSheet({
        id: paramRouter.sheetId,
      });
    }
  }, []);

  const getListInfomationWarehouseSheet = async (params: any) => {
    setLoading(true);
    const result: any = await productApi.getId(
      { ...params, cancelToken: newCancelToken() },
      "warehouse-sheet/"
    );

    if (result && result.data) {
      const { data = [] } = result;

      setObjValue({
        is_confirm: data.is_confirm,
        note: data.note || "",
      });

      objValueDefault.current = {
        is_confirm: data.is_confirm,
        note: data.note || "",
      };

      setColumnShow(
        informationWarehouseSheetColumnType[
          data?.sheet_reason?.type as keyof typeof informationWarehouseSheetColumnType
        ]
      );

      setDetailSheet({
        ...data,
        created_by: getObjectPropSafely(() => data.created_by.name),
        confirmed_by: getObjectPropSafely(() => data.confirmed_by.name),
        sheet_reason: getObjectPropSafely(() => data.sheet_reason.name),
        type: getObjectPropSafely(() => data.sheet_reason.type),
      });
    }

    setLoading(false);
  };

  const formatValue = ({
    label,
    value: valueAgs,
    type,
  }: {
    label: string;
    value: string;
    type?: string;
  }) => {
    const value = detailSheet[valueAgs];

    switch (type) {
      case TYPE_DATA.DATE_TIME: {
        return <MTextLine label={`${label}:`} value={fDateTime(value)} />;
      }
      case TYPE_DATA.DATE: {
        return <MTextLine label={`${label}:`} value={fDate(value)} />;
      }
      case TYPE_DATA.STATUS: {
        return (
          <Stack direction="row" alignItems="center">
            <Typography
              sx={{
                ...theme.typography.body2,
                fontWeight: 400,
                fontSize: "0.8125rem",
                flexShrink: 0,
                mr: 2,
              }}
            >
              {`${label}:`}
            </Typography>
            <Switch
              disabled={detailSheet.is_confirm || detailSheet.is_deleted}
              checked={objValue.is_confirm}
              onChange={(event) => setObjValue({ ...objValue, is_confirm: event.target.checked })}
            />
          </Stack>
        );
      }
      case TYPE_DATA.LINK: {
        return (
          <MTextLine
            label={`${label}:`}
            value={
              <>
                {detailSheet.order_key ? (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Link
                      variant="body2"
                      target="_blank"
                      rel="noreferrer"
                      href={`${window.location.origin}/orders/${detailSheet?.order_id}`}
                      color={theme.palette.info.main}
                    >
                      {detailSheet.order_key}
                    </Link>
                    <CopyIconButton value={detailSheet.order_key} />
                  </Stack>
                ) : (
                  "Chưa có"
                )}
              </>
            }
          />
        );
      }
      case TYPE_DATA.LABEL: {
        return (
          <MTextLine
            label={`${label}:`}
            value={
              <Span
                color={
                  detailSheet.is_deleted ? "error" : detailSheet.is_confirm ? "primary" : "info"
                }
              >
                {detailSheet.is_deleted
                  ? "Phiếu hủy"
                  : detailSheet.is_confirm
                  ? "Phiếu xác nhận"
                  : "Phiếu chưa xác nhận"}
              </Span>
            }
          />
        );
      }
      case TYPE_DATA.TEXTFIELD: {
        return (
          <>
            <Typography
              sx={{
                ...theme.typography.subtitle1,
                fontWeight: 400,
                fontSize: "0.8125rem",
                flexShrink: 0,
                mr: 2,
              }}
            >
              {`${label}:`}
            </Typography>
            <TextField
              value={objValue.note}
              onChange={(event) => setObjValue({ ...objValue, note: event.target.value })}
              size="small"
              minRows={2}
              multiline
              sx={{ width: "60%" }}
            />
          </>
        );
      }
      case TYPE_DATA.VND: {
        return (
          <MTextLine
            label={`${label}:`}
            value={`${Math.trunc(value)?.toString().replace(COMMAS_REGEX, ",") || 0} đ`}
          />
        );
      }
      default: {
        return <MTextLine label={`${label}:`} value={value} />;
      }
    }
  };

  const saveInformationSheet = async () => {
    setLoadingSubmit(true);

    const params = {
      note: objValue.note,
      is_confirm: objValue.is_confirm,
      id: paramRouter.sheetId,
      type: getObjectPropSafely(() => detailSheet.sheet_reason.type),
    };

    const result = await productApi.update(params, "warehouse-sheet/");

    if (result && result.data) {
      setNotifications({
        message: "Lưu thành công",
        variant: statusNotification.SUCCESS,
      });
    }

    setLoadingSubmit(false);
  };

  const handleOrderColumn = (columns: any) => {
    const newColumns = handleChangeColumnOrders(columns, columnShow.columnsShowHeader);

    setColumnShow({ ...columnShow, columnsShowHeader: newColumns.resultColumnsShow });
  };

  const dataInventory: any = useMemo(() => {
    switch (getObjectPropSafely(() => detailSheet.type)) {
      case TypeWarehouseSheet.STOCKTAKING: {
        return getObjectPropSafely(() => detailSheet?.inventory_sheet_details.length)
          ? map(detailSheet?.inventory_sheet_details, (item) => {
              return {
                quantity: getObjectPropSafely(() => item.inventory_log.quantity),
                actual_quantity: getObjectPropSafely(() => item.actual_quantity),
                system_quantity: getObjectPropSafely(() => item.system_quantity),
                batch_name: getObjectPropSafely(() => item.inventory_log.variant_batch.batch_name),
                variant_name: {
                  value: getObjectPropSafely(() => item.inventory_log.variant_batch.variant.name),
                  props: {
                    href: `/${ROLE_TAB.PRODUCT}/${getObjectPropSafely(
                      () => item.inventory_log.variant_batch.variant.id
                    )}`,
                  },
                },
                SKU_code: getObjectPropSafely(
                  () => item.inventory_log.variant_batch.variant.SKU_code
                ),
                warehouse: {
                  value: getObjectPropSafely(() => item.inventory_log.warehouse.name),
                  content: getObjectPropSafely(() => item.inventory_log.warehouse.name) ? (
                    <Span
                      variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                      color="info"
                    >
                      {getObjectPropSafely(() => item.inventory_log.warehouse.name)}
                    </Span>
                  ) : (
                    <></>
                  ),
                },
                expiry_date: fDate(
                  getObjectPropSafely(() => item.inventory_log.variant_batch.expiry_date)
                ),
                thumb_img_variant: getObjectPropSafely(
                  () => item.inventory_log.variant_batch.variant.image.url
                ),
                note: item.note || "",
              };
            })
          : [];
      }
      default: {
        return getObjectPropSafely(() => detailSheet?.inventories.length)
          ? map(detailSheet?.inventories, (item) => {
              return {
                quantity: item.quantity,
                batch_name: getObjectPropSafely(() => item.variant_batch.batch_name),
                variant_name: {
                  value: getObjectPropSafely(() => item.variant_batch.variant.name),
                  props: {
                    href: `/${ROLE_TAB.PRODUCT}/${getObjectPropSafely(
                      () => item.variant_batch.variant.id
                    )}`,
                  },
                },
                SKU_code: getObjectPropSafely(() => item.variant_batch.variant.SKU_code),
                warehouse: {
                  value: getObjectPropSafely(() => item.warehouse.name),
                  content: getObjectPropSafely(() => item.warehouse.name) ? (
                    <Span
                      variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                      color="info"
                    >
                      {getObjectPropSafely(() => item.warehouse.name)}
                    </Span>
                  ) : (
                    <></>
                  ),
                },
                expiry_date: fDate(getObjectPropSafely(() => item.variant_batch.expiry_date)),
                thumb_img_variant: getObjectPropSafely(() => item.variant_batch.variant.image.url),
              };
            })
          : [];
      }
    }
  }, [detailSheet]);

  const renderHeader = () => {
    return (
      <HeaderFilter
        dataExport={dataInventory}
        columns={{
          columnsShow: [],
          resultColumnsShow: columnShow.columnsShowHeader,
          columnShowExport: columnShow.columnShowTable,
        }}
      />
    );
  };

  return (
    <Card sx={{ p: 4, my: 3, height: "100%" }}>
      <Grid container rowSpacing={4}>
        <Grid item container>
          {isLoading && (
            <Grid item sx={{ width: "100%" }}>
              <SkeletonInfo />
            </Grid>
          )}
          {!isLoading && (
            <Grid item container>
              <Grid item container justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ ml: 2 }}>
                  {NameSheet[detailSheet.type as keyof typeof NameSheet]} - {detailSheet.code}
                </Typography>
                <Stack direction="row" alignItems="center">
                  {isLoadingSubmit && <CircularProgress size={20} sx={{ mr: 1, mt: 1 }} />}
                  <MButton
                    onClick={saveInformationSheet}
                    disabled={isLoadingSubmit || isEqual(objValueDefault.current, objValue)}
                  >
                    {vi.button.save}
                  </MButton>
                </Stack>
              </Grid>
              <Grid item container xs={12} md={12} spacing={2}>
                {map(
                  dataRenderInfomationWarehouseSheet,
                  (item: { label: string; value: string; type?: string }, index: number) => {
                    return (
                      <Grid
                        key={index}
                        item
                        container
                        xs={12}
                        md={6}
                        lg={6}
                        direction="row"
                        alignItems="center"
                      >
                        {formatValue(item)}
                      </Grid>
                    );
                  }
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} md={12}>
          <DataGrid
            heightProps={700}
            data={dataInventory}
            columns={columnShow.columnsShowHeader}
            columnWidths={columnWidths}
            // isShowListToolbar={false}
            contentColumnShowInfo={{
              arrColumnShowInfo: ["variant", "warehouse", "batch", "quantity"],
              infoCell: columnShow.columnShowTable,
            }}
            contentOptional={{
              arrColumnOptional: ["warehouse"],
            }}
            arrAttachUnitVnd={["sale_price", "purchase_price"]}
            arrColumnThumbImg={["variant"]}
            arrColumnEditLabel={["is_confirm"]}
            arrColumnHandleLink={["variant_name"]}
            renderHeader={renderHeader}
            setColumnWidths={setColumnWidths}
            handleChangeColumnOrder={handleOrderColumn}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default DetailSheet;

// Libraries
import { useState, useEffect, useMemo } from "react";
import { Controller } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import produce from "immer";
import map from "lodash/map";

// Services
import { productApi } from "_apis_/product";

// @Types
import { FormValuesProps } from "components/Popups/FormPopup";
import { InventorySheetDetailType } from "_types_/WarehouseType";
import { FacebookType } from "_types_/FacebookType";

// Context
import { getAllAttributesWarehouse } from "selectors/attributes";

// Hooks
import { useAppSelector } from "hooks/reduxHook";
import { useCancelToken } from "hooks/useCancelToken";
import useDebounce from "hooks/useDebounce";

// Components
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { MultiSelect } from "components/Selectors";
import DDataGrid from "components/DDataGrid";

// Constant & Utils
import {
  columnShowListProductStocking,
  detailWarehouseCheck,
  columnEditExtensionsWarehouseCheck,
} from "views/WarehouseView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { fDate } from "utils/dateUtil";
import { dd_MM_yyyy } from "constants/time";
import { handleParams } from "utils/formatParamsUtil";
import { compareStringSearch } from "utils/helpers";

// ---------------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const WarehouseCheck = (props: Props) => {
  const { control, setValue, watch } = props;
  const { newCancelToken } = useCancelToken();
  const attributesWarehouse = useAppSelector((state) =>
    getAllAttributesWarehouse(state.attributes)
  );
  const { listWarehouse: dataWarehouse } = attributesWarehouse;
  // State
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowListProductStocking.columnWidths
  );
  const [columnOrders, setColumnOrders] = useState<string[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [dataProduct, setDataProduct] = useState<InventorySheetDetailType[]>([]);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 400);

  // Form
  const { warehouse, list } = watch();

  useEffect(() => {
    if (warehouse) {
      getListProduct(
        handleParams({
          warehouse: warehouse === "all" ? "" : warehouse,
          limit: 100,
        })
      );
    }
  }, [warehouse]);

  const getListProduct = async (params: any) => {
    setLoading(true);
    const result: any = await productApi.get(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      "inventory/"
    );
    if (result && result.data) {
      const { results = [] } = result.data;
      let newList: InventorySheetDetailType[] = [];

      const newData = map(results, (item: any) => {
        newList = [
          ...newList,
          {
            ...detailWarehouseCheck,
            system_quantity: item.quantity,
            warehouse,
            variant_batch: getObjectPropSafely(() => item.variant_batch.id),
            isError: false,
            variant: getObjectPropSafely(() => item.variant_batch.variant.name),
            id: item.id,
          },
        ];

        return {
          ...item,
          variant_batch: getObjectPropSafely(() => item.variant_batch.batch_name),
          thumb_img: {
            url: getObjectPropSafely(() => item.variant_batch.variant.image.url),
            body: "",
            id: getObjectPropSafely(() => item.variant_batch.variant.image.id),
          },
          variant: getObjectPropSafely(() => item.variant_batch.variant.name),
          SKU_code: getObjectPropSafely(() => item.variant_batch.variant.SKU_code),
          expiry_date: getObjectPropSafely(() => item.variant_batch.expiry_date)
            ? fDate(
                getObjectPropSafely(() => item.variant_batch.expiry_date),
                dd_MM_yyyy
              )
            : "",
          system_quantity: item.quantity,
          isError: false,
        };
      });

      setDataProduct(newData);
      setValue("list", newList);

      setLoading(false);
    }
  };

  const handleData = (
    objValue: InventorySheetDetailType,
    data: InventorySheetDetailType[],
    prevData: InventorySheetDetailType[]
  ) => {
    const index = Object.keys(objValue)[0] as keyof InventorySheetDetailType;
    const subObject: any = objValue[index] || {};
    const objData = { ...data[parseInt(index)], ...subObject };
    const valueNote =
      getObjectPropSafely(() => subObject.note_show) ||
      getObjectPropSafely(() => objData.note_show.value);

    return map(prevData, (item) => {
      const newDifferent = getObjectPropSafely(() => objData.actual_quantity)
        ? +getObjectPropSafely(() => objData.actual_quantity) -
          +getObjectPropSafely(() => objData.system_quantity)
        : "";

      return objData.id === item.id
        ? {
            ...item,
            ...objData,
            different: newDifferent || 0,
            isError: !!newDifferent && !valueNote,
            note: valueNote,
            note_show: {
              value: valueNote || "",
              content: (
                <Stack>
                  <Typography variant="body2">{valueNote}</Typography>
                  {!!newDifferent && !valueNote ? (
                    <Typography variant="body2" color="error">
                      Nhập ghi chú
                    </Typography>
                  ) : null}
                </Stack>
              ),
            },
          }
        : item;
    });
  };

  const newDataProduct = useMemo(() => {
    return debounceSearch
      ? dataProduct.filter((item: any) => {
          return compareStringSearch(item.variant, debounceSearch);
        })
      : dataProduct;
  }, [debounceSearch, dataProduct]);

  const newList = useMemo(() => {
    return debounceSearch
      ? list.filter((item: any) => {
          return compareStringSearch(item.variant, debounceSearch);
        })
      : list;
  }, [debounceSearch, list]);

  const handleEditCell = async ({ changed }: any) => {
    const changeRows = handleData(changed, newDataProduct, dataProduct);
    const changeRowsList = handleData(changed, newList, list);
    const index = Object.keys(changed)[0];

    if (changed[index]) {
      setValue("list", changeRowsList);
      setDataProduct(changeRows);
    }
  };

  return (
    <Card sx={{ p: 4 }}>
      <Grid container sx={{ mb: 5 }} spacing={2}>
        <Grid item xs={7}>
          <Controller
            name="warehouse"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <MultiSelect
                zIndex={1303}
                title="Kho"
                size="medium"
                outlined
                fullWidth
                selectorId="warehouse"
                error={!!error}
                helperText={error?.message}
                options={dataWarehouse}
                onChange={field.onChange}
                defaultValue={field.value || ""}
                simpleSelect
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            fullWidth
            label="Tìm kiếm theo tên sản phẩm"
            sx={{ mt: 1 }}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container sx={{ mb: 5 }}>
        <DDataGrid
          heightProps={700}
          isLoadingTable={isLoading}
          data={newDataProduct}
          columns={columnShowListProductStocking.columnsShowHeader}
          columnWidths={columnWidths}
          columnOrders={columnOrders}
          isShowListToolbar={false}
          contentOptional={{
            arrColumnOptional: ["note_show"],
          }}
          columnEditExtensions={columnEditExtensionsWarehouseCheck}
          handleEditCell={handleEditCell}
          arrColumnThumbImg={["thumb_img"]}
          setColumnWidths={setColumnWidths}
          handleChangeColumnOrder={setColumnOrders}
        />
      </Grid>
    </Card>
  );
};

export default WarehouseCheck;

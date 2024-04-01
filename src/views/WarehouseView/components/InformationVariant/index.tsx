// Libraries
import { Controller, UseFormReturn } from "react-hook-form";
import filter from "lodash/filter";

// Context
import { useAppSelector } from "hooks/reduxHook";
import { getAllAttributesWarehouse } from "selectors/attributes";

// Components
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import { MultiSelect } from "components/Selectors";

// Types
import { SelectOptionType } from "_types_/SelectOptionType";
import { FormValuesProps } from "components/Popups/FormPopup";
import { TypeWarehouseSheet } from "_types_/WarehouseType";

// -------------------------------------------------------------------
interface Props extends UseFormReturn<FormValuesProps, object> {
  type: string;
}

const InformationVariant = (props: Props) => {
  const { control, type } = props;
  const attributesWarehouse = useAppSelector((state) =>
    getAllAttributesWarehouse(state.attributes)
  );

  const handleRemoveValueAll = (data: SelectOptionType[]) => {
    return filter(data, (item) => item.value !== "all");
  };

  const convertTitle = () => {
    switch (type) {
      case TypeWarehouseSheet.IMPORTS: {
        return "Lí do nhập kho";
      }
      case TypeWarehouseSheet.EXPORTS: {
        return "Lí do xuất kho";
      }
      case TypeWarehouseSheet.TRANSFER: {
        return "Lí do chuyển kho";
      }
      case TypeWarehouseSheet.STOCKTAKING: {
        return "Lí do kiểm kho";
      }
      default: {
        return "";
      }
    }
  };

  const convertOptions = () => {
    switch (type) {
      case TypeWarehouseSheet.IMPORTS: {
        return handleRemoveValueAll(attributesWarehouse.importReason);
      }
      case TypeWarehouseSheet.EXPORTS: {
        return handleRemoveValueAll(attributesWarehouse.exportReason);
      }
      case TypeWarehouseSheet.TRANSFER: {
        return handleRemoveValueAll(attributesWarehouse.transferReason);
      }
      case TypeWarehouseSheet.STOCKTAKING: {
        return handleRemoveValueAll(attributesWarehouse.stocktakingReason);
      }
      default: {
        return [];
      }
    }
  };

  const renderHtml = () => {
    return (
      <>
        <Grid item xs={12} md={12}>
          <Controller
            name="reason"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <MultiSelect
                zIndex={1303}
                style={selectorStyle}
                title={convertTitle()}
                size="medium"
                outlined
                fullWidth
                selectorId="reason"
                options={convertOptions()}
                onChange={(value) => field.onChange(value)}
                defaultValue={field.value || ""}
                simpleSelect
                error={!!error}
                helperText={error?.message}
                required
              />
            )}
          />
        </Grid>
      </>
    );
  };

  return (
    <Card sx={{ p: 3, pt: 6 }}>
      <Grid container rowSpacing={3}>
        <Grid item xs={12} md={12}>
          <Controller
            name="note"
            control={control}
            render={({ field }) => <TextField {...field} fullWidth label="Ghi chú" />}
          />
        </Grid>

        <Grid item container xs={12} md={12} direction="row" alignItems="center">
          <Grid item xs={12} md={5}>
            <Typography component="span" variant="body2">
              Đã xác nhận
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <Controller
              name="isConfirm"
              control={control}
              render={({ field }) => <Switch {...field} checked={field.value} />}
            />
          </Grid>
        </Grid>

        {type === TypeWarehouseSheet.IMPORTS ? (
          <Grid item container xs={12} md={12} direction="row" alignItems="center">
            <Controller
              name="order_id"
              control={control}
              render={({ field }) => <TextField {...field} fullWidth label="Nhập order" />}
            />
          </Grid>
        ) : null}

        {renderHtml()}
      </Grid>
    </Card>
  );
};

export default InformationVariant;

const selectorStyle = { width: "100%" };

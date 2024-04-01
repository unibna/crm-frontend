// Libraries
import { Controller, UseFormReturn } from "react-hook-form";

// Components
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { FormValuesProps } from "components/Popups/FormPopup";
import { MultiSelect } from "components/Selectors";

// @Types
import { SelectOptionType } from "_types_/SelectOptionType";

// Constants & Utils
import { optionStatus } from "views/CskhView/constants";

// ---------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {
  optionHandleBy: SelectOptionType[];
  optionChannel: SelectOptionType[];
  optionProduct: SelectOptionType[];
  optionHandleReason: SelectOptionType[];
  optionSolution: SelectOptionType[];
  optionSolutionDescription: SelectOptionType[];
  optionComment: SelectOptionType[];
}

const PopupOperation = (props: Props) => {
  const {
    control,
    optionHandleBy,
    optionChannel,
    optionProduct,
    optionHandleReason,
    optionSolution,
    optionSolutionDescription,
    optionComment,
  } = props;

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              type="number"
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              required={true}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="order_number"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Mã đơn hàng (nếu có)"
              placeholder="Nhập mã đơn hàng"
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Tình trạng"
              placeholder="Mô tả tình trạng"
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="note"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Ghi chú"
              placeholder="Nhập ghi chú"
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="link_jira"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Link Jira"
              placeholder="Nhập link Jira"
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="handle_by"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MultiSelect
              zIndex={1303}
              style={{ width: "100%" }}
              title="Chọn nhân viên xử lý"
              size="medium"
              outlined
              fullWidth
              selectorId="MuiOutlinedInput-root"
              error={!!error}
              helperText={error?.message}
              options={optionHandleBy}
              onChange={(value: any) => field.onChange(value)}
              defaultValue={field.value || ""}
              simpleSelect
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="status"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MultiSelect
              zIndex={1303}
              style={{ width: "100%" }}
              title="Chọn trạng thái"
              size="medium"
              outlined
              fullWidth
              selectorId="MuiOutlinedInput-root"
              error={!!error}
              helperText={error?.message}
              options={optionStatus}
              onChange={(value: any) => field.onChange(value)}
              defaultValue={field.value || ""}
              simpleSelect
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="channel"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MultiSelect
              zIndex={1303}
              style={{ width: "100%" }}
              title="Chọn kênh"
              size="medium"
              outlined
              fullWidth
              selectorId="MuiOutlinedInput-root"
              error={!!error}
              helperText={error?.message}
              options={optionChannel}
              onChange={(value: any) => field.onChange(value)}
              defaultValue={field.value || ""}
              simpleSelect
              required
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="product"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MultiSelect
              zIndex={1303}
              style={{ width: "100%" }}
              title="Chọn sản phẩm"
              size="medium"
              outlined
              fullWidth
              selectorId="MuiOutlinedInput-root"
              error={!!error}
              helperText={error?.message}
              options={optionProduct}
              onChange={(value: any) => field.onChange(value)}
              defaultValue={field.value || ""}
              simpleSelect
              required
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="handle_reason"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MultiSelect
              zIndex={1303}
              style={{ width: "100%" }}
              title="Phân loại"
              size="medium"
              outlined
              fullWidth
              selectorId="MuiOutlinedInput-root"
              error={!!error}
              helperText={error?.message}
              options={optionHandleReason}
              onChange={(value: any) => field.onChange(value)}
              defaultValue={field.value || ""}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="solution"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MultiSelect
              zIndex={1303}
              style={{ width: "100%" }}
              title="Hướng xử lý"
              size="medium"
              outlined
              fullWidth
              selectorId="MuiOutlinedInput-root"
              error={!!error}
              helperText={error?.message}
              options={optionSolution}
              onChange={(value: any) => field.onChange(value)}
              defaultValue={field.value || ""}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="solution_description"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MultiSelect
              zIndex={1303}
              style={{ width: "100%" }}
              title="Sản phẩm bù/tặng/đổi trả/mua thêm"
              size="medium"
              outlined
              fullWidth
              selectorId="MuiOutlinedInput-root"
              error={!!error}
              helperText={error?.message}
              options={optionSolutionDescription}
              onChange={(value: any) => field.onChange(value)}
              defaultValue={field.value || ""}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="comment"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MultiSelect
              zIndex={1303}
              style={{ width: "100%" }}
              title="Cảm nhận của KH"
              size="medium"
              outlined
              fullWidth
              selectorId="MuiOutlinedInput-root"
              error={!!error}
              helperText={error?.message}
              options={optionComment}
              onChange={(value: any) => field.onChange(value)}
              defaultValue={field.value || ""}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default PopupOperation;

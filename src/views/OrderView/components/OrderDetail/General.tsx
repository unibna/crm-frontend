//components
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { MultiSelect } from "components/Selectors";
import { TagInput, CommasField } from "components/Fields";
import { Span, MTextLine } from "components/Labels";
import { MDateTimeMobilePicker } from "components/Pickers";
import { UserTooltip } from "components/Tooltips";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { Section, TitleSection } from "components/Labels";
import { SxProps, Theme } from "@mui/material";
import Popover from "@mui/material/Popover";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

//utils
import vi from "locales/vi.json";
import { leadStore } from "store/redux/leads/slice";
import { filterIsShowOptions } from "utils/selectOptionUtil";
import { fDateTime } from "utils/dateUtil";
import reduce from "lodash/reduce";
import filter from "lodash/filter";

//types
import { FieldErrors } from "react-hook-form";
import { OrderFormType, OrderStatusValue } from "_types_/OrderType";
import { UserType } from "_types_/UserType";

//hooks
import { useCancelToken } from "hooks/useCancelToken";
import React, { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "hooks/reduxHook";

//icons
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

//apis
import { orderApi } from "_apis_/order.api";
import { dispatch } from "store";
import { toastError, toastWarning } from "store/redux/toast/slice";
import { CustomerType } from "_types_/CustomerType";
import useAuth from "hooks/useAuth";
import { AttributeType } from "_types_/AttributeType";
import { ORDER_STATUS } from "views/OrderView/constants/options";
import { matchMarketplaceUrlFromEcommerceCode } from "features/order/matchMarketplaceUrlFromEcommerceCode";
import { isMatchRoles, isReadAndWriteRole } from "utils/roleUtils";
import { ROLE_TAB, STATUS_ROLE_ORDERS } from "constants/rolesTab";

export interface GeneralProps {
  onChange: <T extends keyof OrderFormType>(key: T, value: OrderFormType[T]) => void;
  errors: FieldErrors<OrderFormType>;
  style?: React.CSSProperties;
  source?: AttributeType;
  is_ecommerce_source?: boolean;
  is_offline_channel?: boolean;
  ecommerce_code?: string;
  customer_offline_code?: string;
  note?: string;
  tags?: (number | string)[];
  status?: OrderStatusValue;
  disabled?: boolean;
  delivery_note?: string;
  loading?: boolean;
  cross_sale_amount?: number;
  defaultTagOptions?: {
    id: number;
    name: string;
  }[];
  order_key?: string;
  created?: string;
  created_by?: Partial<UserType>;
  appointment_date?: string;
  completed_time?: string;
  is_printed?: boolean;
  confirmDisabled?: boolean;
  defaultStatus?: OrderStatusValue;
  isAvailableInventory?: boolean;
  customer?: Partial<CustomerType>;
  cancelReason?: number | AttributeType;
  orderID?: string;
}

const LoadingSkeleton = () => {
  return (
    <Stack alignItems="center" width="100%" spacing={1}>
      <Skeleton width="100%" style={{ transform: "scale(1)" }} height={40} />
      <Skeleton width="100%" style={{ transform: "scale(1)" }} height={40} />
      <Skeleton width="100%" style={{ transform: "scale(1)" }} height={40} />
      <Skeleton width="100%" style={{ transform: "scale(1)" }} height={60} />
      <Skeleton width="100%" style={{ transform: "scale(1)" }} height={60} />
    </Stack>
  );
};

const General = ({
  onChange,
  errors,
  style,
  note,
  source,
  tags,
  status,
  delivery_note,
  disabled,
  loading,
  defaultTagOptions,
  cross_sale_amount,
  order_key,
  appointment_date,
  completed_time,
  created,
  created_by,
  ecommerce_code,
  customer_offline_code,
  is_ecommerce_source,
  is_printed,
  is_offline_channel,
  confirmDisabled,
  defaultStatus,
  isAvailableInventory,
  customer,
  cancelReason,
  orderID,
}: GeneralProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === created_by?.id;
  const isConfirmRole =
    !orderID ||
    isReadAndWriteRole(
      user?.is_superuser,
      user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.CONFIRM]
    ) ||
    (isOwner &&
      isMatchRoles(
        user?.is_superuser,
        user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.HANDLE]
      ));

  const { newCancelToken } = useCancelToken();
  const leadSlice = useAppSelector(leadStore);
  const [tagOptions, setTagOptions] = useState<{ id: number; name: string; is_shown?: boolean }[]>(
    []
  );
  const [anchorElConfirm, setAnchorElConfirm] = React.useState<HTMLButtonElement | null>(null);

  const getTags = useCallback(async () => {
    const result = await orderApi.get<{ id: number; name: string }>({
      endpoint: "tag/",
      params: { limit: 200, page: 1, is_show: true },
    });
    if (result?.data) {
      const newData = reduce(
        result.data.results,
        (prevArr, current: { is_shown: boolean; id: number; name: string }) => {
          return current.is_shown ? [...prevArr, current] : prevArr;
        },
        []
      );

      setTagOptions(newData);
    }
  }, []);

  const labels: { [key: string]: string } = ORDER_STATUS.reduce(
    (prev, current) => ({ ...prev, [current.value]: current.label }),
    {}
  );
  const colors = ORDER_STATUS.reduce((prev, current) => ({
    ...prev,
    [current.value]: current.color,
  }));

  const handleChangeSource = (value: string | number | (string | number)[]) => {
    const channel = leadSlice.attributes.channel.find(
      (item) => item.id.toString() === value.toString()
    );
    // nếu source là kênh thương mại điện tử thì show input thương mại điện tử
    const is_ecommerce_source = channel?.is_e_commerce;
    const isOfflineChannel = channel?.name === "Offline";

    // không cho tạo đơn với kênh thương mại điện tử
    if (is_ecommerce_source) {
      onChange("source", source);
      // onChange("is_ecommerce_source", true);

      // onChange("is_offline_channel", false);
      // onChange("customer_offline_code", undefined);
      dispatch(toastWarning({ message: "Không thể chọn kênh thương mại điện tử" }));
    } else if (isOfflineChannel) {
      onChange("source", channel);

      onChange("is_offline_channel", true);

      onChange("is_ecommerce_source", false);
      onChange("ecommerce_code", undefined);
    } else {
      onChange("source", channel);

      onChange("is_ecommerce_source", false);
      onChange("ecommerce_code", undefined);

      onChange("is_offline_channel", false);
      onChange("customer_offline_code", undefined);
    }
  };

  const handleChangeStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    // tồn khả dụng
    if (isAvailableInventory) {
      // không có customer
      if (!customer?.id) {
        dispatch(toastError({ message: "Vui lòng chọn khách hàng" }));
        return;
      }
      if (!isConfirmRole) {
        dispatch(toastError({ message: "Bạn không có quyền xác nhận đơn" }));
        return;
      }
      // xác nhận đơn
      if (e.target.checked) {
        // khi chưa có NCS hoặc NCS là người xác nhận đơn
        if (!customer?.customer_care_staff || customer?.customer_care_staff?.id === user?.id) {
          onChange("customer_staff_override", true);
          onChange("status", "completed");
          onChange("appointment_date", undefined);
        } else {
          // NCS không phải là người xác nhận đơn
          setAnchorElConfirm(e.currentTarget as any);
          // handleConfirmStatus();
        }
      } else {
        // huỷ xác nhận đơn
        onChange("status", defaultStatus || "draft");
        onChange("customer_staff_override", false);
      }
    } else {
      dispatch(
        toastWarning({ message: "Không thể xác nhận đơn vì có sản phẩm không đủ tồn kho khả dụng" })
      );
    }
  };

  const handleConfirmStatus = () => {
    onChange("status", "completed");
    onChange("customer_staff_override", true);
    onChange("appointment_date", undefined);
  };

  const handleClose = () => {
    setAnchorElConfirm(null);
  };

  useEffect(() => {
    if (defaultTagOptions) {
      setTagOptions(defaultTagOptions);
    } else {
      getTags();
    }
  }, [defaultTagOptions, getTags]);

  const { email, image, name } = created_by || {};
  const open = Boolean(anchorElConfirm);
  const colorValue = (status || "draft") as keyof typeof colors;
  const isControlOrderStatus = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.CONFIRM]
  );

  return (
    <Section elevation={3}>
      <TitleSection>{vi.general}</TitleSection>
      <Divider sx={{ my: 1 }} />
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <Grid container spacing={2} mt={0}>
          <Grid item xs={12} style={{ paddingTop: 8 }}>
            <Span color={colors[colorValue]} sx={styles.chip}>
              {labels[colorValue] || "---"}
            </Span>
          </Grid>
          {is_printed && (
            <Grid item xs={12} style={{ paddingTop: 8 }}>
              <Span color={"success"} sx={styles.chip}>
                Đã in
              </Span>
            </Grid>
          )}
          {cancelReason && (
            <Grid item xs={12}>
              <MTextLine label="Lý do huỷ đơn:" value={(cancelReason as AttributeType).name} />
            </Grid>
          )}
          {created && order_key !== vi.duplidate && (
            <Grid item xs={12}>
              <Stack direction="column" spacing={1}>
                <MTextLine label="Thời gian tạo đơn:" value={fDateTime(created)} />
                <MTextLine
                  label="Người tạo:"
                  value={<UserTooltip user={{ email, image, name }} />}
                />
                <MTextLine label="Thời gian xác nhận:" value={fDateTime(completed_time) || "---"} />
              </Stack>
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={status === "completed"}
                  onChange={handleChangeStatus}
                  name="status"
                  disabled={confirmDisabled || !isControlOrderStatus}
                />
              }
              label="Xác nhận đơn"
              sx={{ ".MuiTypography-root": { fontSize: "1rem", fontWeight: 500 } }}
            />
            {isControlOrderStatus && (
              <Popover
                id={"confirm-customer-staff-popover"}
                open={open}
                anchorEl={anchorElConfirm}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div style={wrapContentStyle}>
                  <h4 style={titleStyle}>Bạn không phải là người chăm sóc khách hàng</h4>
                  <DialogContentText id="alert-dialog-staff-confirm-description">
                    Xác nhận để thay đổi
                  </DialogContentText>
                  <Divider />
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      {vi.button.cancel}
                    </Button>
                    <LoadingButton
                      onClick={(e) => {
                        handleConfirmStatus();
                        handleClose();
                      }}
                      color="error"
                      variant="contained"
                    >
                      {vi.button.confirm}
                    </LoadingButton>
                  </DialogActions>
                </div>
              </Popover>
            )}
          </Grid>

          <Grid item xs={12}>
            <MDateTimeMobilePicker
              onChange={(date?: string) => onChange("appointment_date", date)}
              label={vi.callback_time}
              value={appointment_date ? new Date(appointment_date) : null}
              inputProps={{ size: "small", InputLabelProps: { shrink: true } }}
              dateProps={{ disablePast: true, disabled: status === "completed" }}
            />
          </Grid>

          <Grid item xs={12}>
            <CommasField
              InputLabelProps={{ shrink: true }}
              onChange={(value) => onChange("cross_sale_amount", value as number)}
              size="small"
              fullWidth
              label="Giá trị CrossSale"
              value={cross_sale_amount}
              error={!!errors.cross_sale_amount}
              helperText={errors.cross_sale_amount?.message}
              disabled={is_ecommerce_source}
              unit={1000}
            />
          </Grid>
          <Grid item xs={12}>
            <MultiSelect
              inputProps={{ InputLabelProps: { shrink: true } }}
              selectorId="selector-order-channel"
              options={filterIsShowOptions(leadSlice.attributes.channel)}
              onChange={handleChangeSource}
              defaultValue={source?.id || ""}
              simpleSelect
              outlined
              fullWidth
              error={!!errors.source}
              helperText={errors.source?.id?.message}
              disabled={disabled || is_ecommerce_source}
              title="Kênh bán hàng"
            />
          </Grid>
          {is_ecommerce_source && (
            <Grid item xs={12}>
              <TextField
                InputLabelProps={{ shrink: true }}
                value={ecommerce_code || ""}
                onChange={(e) => onChange("ecommerce_code", e.target.value)}
                size="small"
                fullWidth
                label="Mã thương mại điện tử"
                error={!!errors.ecommerce_code}
                disabled={disabled}
                helperText={errors.ecommerce_code?.message}
                autoComplete="off"
                InputProps={{
                  endAdornment: ecommerce_code ? (
                    <React.Fragment>
                      <ArrowForwardIcon
                        onClick={() =>
                          (window.location.href = matchMarketplaceUrlFromEcommerceCode(
                            ecommerce_code,
                            source
                          ))
                        }
                        sx={{
                          transform: "rotate(-45deg)",
                          backgroundColor: "primary.main",
                          fontSize: 14,
                          cursor: "pointer",
                          borderRadius: "50%",
                          color: "#fff",
                        }}
                      />
                    </React.Fragment>
                  ) : undefined,
                }}
              />
            </Grid>
          )}
          {is_offline_channel && (
            <Grid item xs={12}>
              <TextField
                InputLabelProps={{ shrink: true }}
                value={customer_offline_code || ""}
                onChange={(e) => onChange("customer_offline_code", e.target.value)}
                size="small"
                fullWidth
                label="Mã offline"
                error={!!errors.customer_offline_code}
                disabled={disabled}
                helperText={errors.customer_offline_code?.message}
                autoComplete="off"
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TagInput
              inputProps={{ InputLabelProps: { shrink: true } }}
              helperText={(errors?.tags as { message: string } | undefined)?.message}
              onSubmit={(value: (string | number)[]) => {
                onChange("tags", value);
              }}
              options={filter(tagOptions, (item) => !!item.is_shown)}
              returnType="id"
              value={tags}
              size="small"
              label="Thẻ đơn"
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              placeholder={vi.content}
              label={vi.internal_note}
              value={note || ""}
              onChange={(e) => onChange("note", e.target.value)}
              // disabled={disabled}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} style={style}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              placeholder={vi.content}
              label={vi.delivery_note}
              value={delivery_note || ""}
              onChange={(e) => onChange("delivery_note", e.target.value)}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      )}
    </Section>
  );
};

export default General;

const styles: { [key: string]: SxProps<Theme> } = {
  handler: {
    fontWeight: 600,
    fontSize: "0.8125rem",

    color: "primary.main",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  chip: {
    width: "fit-content",
    whiteSpace: "break-spaces",
    lineHeight: "150%",
    height: "auto",
    padding: "4px 8px",
  },
};

const iconStyle = { fontSize: 20 };
const wrapContentStyle: React.CSSProperties = { padding: "20px 20px 10px 20px" };
const titleStyle = { maxWidth: 500 };

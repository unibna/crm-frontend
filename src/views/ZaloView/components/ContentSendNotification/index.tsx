// Libraries
import { Controller, UseFormReturn } from "react-hook-form";

// Components
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FormValuesProps } from "components/Popups/FormPopup";
import { MDateTimeMobilePicker } from "components/Pickers";
import Image from "components/Images/Image";
import Stack from "@mui/material/Stack";

// Assets
import imageNotFound from "assets/images/image_not_found.png";

// -------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const ContentSendNotification = (props: Props) => {
  const { control, watch } = props;
  const { image_url, subtitle, title, action_url } = watch();

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <Card>
          <Box sx={{ position: "relative" }}>
            <Image src={image_url || imageNotFound} ratio="16/9" />
          </Box>

          <Box sx={{ p: 2 }} rowGap={2}>
            <Typography variant="body1">{title}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {subtitle}
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center">
              <Image
                src="https://res.cloudinary.com/dq5k2muhe/image/upload/v1656648183/online-shop_qepqot.png"
                sx={{ width: 50, height: 50 }}
              />
              <Typography
                variant="body1"
                sx={{ ml: 2, cursor: "pointer" }}
                onClick={() =>
                  action_url && window.open(action_url, "_blank", "noopener,noreferrer")
                }
              >
                Đặt hàng ngay
              </Typography>
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center">
              <Image
                src="https://res.cloudinary.com/dq5k2muhe/image/upload/v1656648335/customer-service_1_okwedl.png"
                sx={{ width: 50, height: 50 }}
              />
              <Typography variant="body1" sx={{ ml: 2 }}>
                Gặp tư vấn viên
              </Typography>
            </Stack>
          </Box>
        </Card>
      </Grid>
      <Grid item container xs={6} spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={!!error}
                helperText={error?.message}
                fullWidth
                label="Tên"
                placeholder="Nhập tên"
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={!!error}
                helperText={error?.message}
                fullWidth
                label="Tiêu đề"
                placeholder="Nhập tiêu đề"
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="subtitle"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={!!error}
                helperText={error?.message}
                fullWidth
                label="Tiêu đề phụ"
                placeholder="Nhập tiêu đề phụ"
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="image_url"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={!!error}
                helperText={error?.message}
                fullWidth
                label="Đường dẫn ảnh"
                placeholder="Nhập đường dẫn ảnh"
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="action_url"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={!!error}
                helperText={error?.message}
                fullWidth
                label="Đường dẫn"
                placeholder="Nhập đường dẫn"
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="scheduledTime"
            control={control}
            render={({ field, fieldState: { error } }) => {
              const {
                value: { time, isScheduledTime },
                onChange,
              } = field;

              return (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isScheduledTime}
                        onChange={(e) =>
                          onChange({
                            ...field.value,
                            isScheduledTime: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Lên lịch gửi"
                    sx={{ width: 150 }}
                  />
                  {isScheduledTime ? (
                    <MDateTimeMobilePicker
                      onChange={(date: Date) => onChange({ ...field.value, time: date })}
                      label="Thời gian hẹn để gửi"
                      value={time ? (new Date(time) as any) : null}
                      sx={{ mt: 2 }}
                    />
                  ) : null}
                </>
              );
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ContentSendNotification;

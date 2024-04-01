// Libraries
import { useCallback, useState } from "react";
import { Controller } from "react-hook-form";

// Services
import { userApi } from "_apis_/user.api";

// Redux
import { rolesStore } from "store/redux/roles/slice";

// Hooks
import { useAppSelector } from "hooks/reduxHook";
import usePopup from "hooks/usePopup";

// Components
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { UploadAvatar } from "components/Uploads";
import { FormHelperText, IconButton } from "@mui/material";
import { MultiSelect } from "components/Selectors";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// Constants & Utils
import { message } from "views/SettingsView/constants";
import { fData } from "utils/formatNumber";
import { statusNotification } from "constants/index";
import { getAllAttributesSetting } from "selectors/attributes";
import { InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// ------------------------------------------------------------------------

const PopupSkylinkAccount = (props: any) => {
  const { control, setValue, isEdit = false, watch } = props;
  const [isLoadingImage, setLoadingImage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { optionRole } = useAppSelector(rolesStore);
  const { departments } = useAppSelector((state) => getAllAttributesSetting(state.attributes));
  const { setNotifications } = usePopup();
  const { isChangePassword = true } = watch();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      setLoadingImage(true);
      const result: any = await userApi.upload(acceptedFiles[0], "image/");

      if (result && result?.data) {
        const { data } = result;

        setNotifications({
          message: message.UPLOAD_IMAGE,
          variant: statusNotification.SUCCESS,
        });

        setValue("imageApi", data.id);
        setValue("image", { id: data.id, url: data.image });
      }

      setLoadingImage(false);
    },
    [setValue]
  );

  return (
    <Grid container sx={{ py: 4, px: 6 }}>
      <Grid item container xs={5} md={5}>
        <Controller
          name="image"
          control={control}
          render={({ field, fieldState: { error } }) => {
            const checkError = !!error && !field.value;
            return (
              <div>
                <UploadAvatar
                  error={checkError}
                  file={field.value}
                  accept="image/*"
                  maxSize={3145728}
                  isLoading={isLoadingImage}
                  onDrop={handleDrop}
                  helperText={
                    <>
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: "auto",
                          display: "block",
                          textAlign: "center",
                          color: "text.secondary",
                        }}
                      >
                        Cho phép *.jpeg, *.jpg, *.png, *.gif
                        <br /> Tối đa {fData(3145728)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: "auto",
                          display: "block",
                          textAlign: "center",
                          color: "text.secondary",
                        }}
                      >
                        Hình ảnh được sử dụng để trình chiếu
                      </Typography>
                    </>
                  }
                />
                {checkError && (
                  <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                    {error?.message}
                  </FormHelperText>
                )}
              </div>
            );
          }}
        />
      </Grid>
      <Grid item container xs={7} md={7} rowSpacing={2}>
        <Grid item xs={12} md={12}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                required
                error={!!error}
                helperText={error?.message}
                label="Họ và tên"
                placeholder="Nhập họ và tên"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Controller
            name="department"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <MultiSelect
                zIndex={1303}
                style={{ width: "100%" }}
                title="Phòng ban"
                size="medium"
                outlined
                error={!!error}
                helperText={error?.message}
                options={departments}
                onChange={(value: any) => field.onChange(value)}
                defaultValue={field.value || ""}
                simpleSelect
                required
                selectorId="department-options"
              />
            )}
          />
        </Grid>
        {!isEdit && (
          <Grid item xs={12} md={12}>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="email"
                  required
                  error={!!error}
                  helperText={error?.message}
                  label="Email"
                  placeholder="Nhập email"
                />
              )}
            />
          </Grid>
        )}
        <Grid item xs={12} md={12}>
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                error={!!error}
                helperText={error?.message}
                label="SĐT"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Controller
            name="role"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <MultiSelect
                zIndex={1303}
                style={{ width: "100%" }}
                title="Quyền"
                size="medium"
                outlined
                error={!!error}
                helperText={error?.message}
                options={optionRole}
                onChange={(value: any) => field.onChange(value)}
                defaultValue={field.value || ""}
                simpleSelect
                required
                selectorId="role-options"
              />
            )}
          />
        </Grid>
        {isEdit && (
          <Grid item xs={12} md={12}>
            <Controller
              name="isChangePassword"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Đổi mật khẩu"
                  sx={{ width: 150 }}
                />
              )}
            />
          </Grid>
        )}
        {isChangePassword && (
          <Grid item xs={12} md={12}>
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  required
                  error={!!error}
                  helperText={error?.message}
                  label="Mật khẩu"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default PopupSkylinkAccount;

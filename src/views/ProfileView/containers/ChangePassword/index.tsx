// Libraries
import { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";

// Redux
import { updateUserAction } from "store/redux/users/action";

// Components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { FormProvider, RHFTextField } from "components/HookFormFields";
import LoadingButton from "@mui/lab/LoadingButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Hooks
import useAuth from "hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "hooks/reduxHook";
import usePopup from "hooks/usePopup";

// Constants & Utils
import { handleParams } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { message } from "views/ProfileView/constants";
import { statusNotification } from "constants/index";

// ----------------------------------------------------------------------

type FormValuesProps = {
  id?: string;
  roleId: number;
  newPassword: string;
  confirmNewPassword: string;
};

const ChangePassword = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { setNotifications } = usePopup();
  const [isShowPassword, setShowPassword] = useState(true);
  const [isShowConfirmPassword, setShowConfirmPassword] = useState(true);

  const UpdateUserSchema = Yup.object().shape({
    newPassword: Yup.string()
      .trim()
      .required("Vui lòng nhập mật khẩu")
      .min(6, "Vui lòng nhập nhập nhiều hơn 6 ký tự")
      .max(32, "Vui lòng nhập ít hơn 32 ký tự"),
    confirmNewPassword: Yup.string()
      .trim()
      .required("Vui lòng nhập mật khẩu")
      .min(6, "Vui lòng nhập nhập nhiều hơn 6 ký tự")
      .max(32, "Vui lòng nhập ít hơn 32 ký tự"),
  });

  const defaultValues = {
    id: user?.id || "",
    newPassword: "",
    confirmNewPassword: "",
    roleId: getObjectPropSafely(() => user?.group_permission?.id),
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = async (dataForm: FormValuesProps) => {
    if (dataForm.newPassword !== dataForm.confirmNewPassword) {
      setError("confirmNewPassword", { message: "Mật khẩu không trùng khớp" });

      return;
    }

    const objData: any = {
      password: dataForm.newPassword,
      group_permission: {
        id: dataForm.roleId,
      },
      id: dataForm.id,
    };

    const newObjData = handleParams(objData);

    dispatch(updateUserAction(newObjData));

    setNotifications({
      message: message.UPDATE_ACCOUNT_SUCCESS,
      variant: statusNotification.SUCCESS,
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container rowGap={3}>
              <RHFTextField
                name="newPassword"
                type={isShowPassword ? "password" : "text"}
                placeholder="Nhập mật khẩu mới"
                label="Mật khẩu mới"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!isShowPassword)}
                        // onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {isShowPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                name="confirmNewPassword"
                type={isShowConfirmPassword ? "password" : "text"}
                placeholder="Nhập lại mật khẩu mới"
                label="Xác nhận mật khẩu mới"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword(!isShowConfirmPassword)}
                        // onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {isShowConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained">
                Lưu
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ChangePassword;

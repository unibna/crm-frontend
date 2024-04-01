import * as Yup from "yup";
import { useState } from "react";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
// material
import { Stack, TextField, IconButton, InputAdornment } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
// hooks
import useAuth from "hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { isEnterPress } from "utils/keyBoardUtil";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";

//
interface LoginFormType {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(VALIDATION_MESSAGE.FORMAT_EMAIL)
      .required(VALIDATION_MESSAGE.REQUIRE_EMAIL),
    password: Yup.string().required(VALIDATION_MESSAGE.REQUIRE_PASSWORD),
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: yupResolver(LoginSchema),
  });

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleEnterPress = (e: any) => {
    if (isEnterPress(e)) handleSubmit((form) => login({ ...form }));
  };

  return (
    <>
      <form onSubmit={handleSubmit(login)}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email"
            onChange={(e) => setValue("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email?.message}
            onKeyPress={handleEnterPress}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            label="Mật khẩu"
            onChange={(e) => setValue("password", e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Stack>

        <Stack py={2} />

        <LoadingButton
          fullWidth
          type="submit"
          size="large"
          variant="contained"
          loading={isSubmitting}
        >
          Đăng nhập
        </LoadingButton>
      </form>
    </>
  );
}

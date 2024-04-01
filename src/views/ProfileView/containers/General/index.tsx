// Libraries
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import isEqual from "lodash/isEqual";
import { yupResolver } from "@hookform/resolvers/yup";

// Redux
import { updateUserAction } from "store/redux/users/action";

// Services
import { userApi } from "_apis_/user.api";

// Components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";
import { UploadAvatar } from "components/Uploads";
import { FormProvider, RHFTextField } from "components/HookFormFields";
import { MButton } from "components/Buttons";
import { Span } from "components/Labels";

// Hooks
import usePopup from "hooks/usePopup";
import useAuth from "hooks/useAuth";
import { useAppDispatch } from "hooks/reduxHook";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { fData } from "utils/formatNumber";
import { PHONE_REGEX, statusNotification } from "constants/index";
import { handleParams } from "utils/formatParamsUtil";
import { message } from "views/ProfileView/constants";
import { CustomFile } from "_types_/FileType";

// ----------------------------------------------------------------------

type FormValuesProps = {
  id?: string;
  email: string;
  phone: string | null;
  name: string | null;
  image:
    | {
        id: string;
        url: string;
      }
    | CustomFile
    | any;
  imageApi: string;
  role: string;
  roleId?: number;
};

const AccountGeneral = () => {
  const { user, updateProfile, logout } = useAuth();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { setNotifications, dataPopup } = usePopup();

  const [isLoadingImage, setLoadingImage] = useState(false);

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required("Vui lòng nhập tên").trim(),
    email: Yup.string()
      .trim()
      .email("Vui lòng nhập đúng định dạng email")
      .required("Vui lòng nhập email"),
    phone: Yup.string()
      .trim()
      //eslint-disable-next-line
      .matches(PHONE_REGEX, {
        message: "Vui lòng nhập đúng số điện thoại",
        excludeEmptyString: true,
      }),
    image: Yup.mixed(),
    imageApi: Yup.mixed(),
    role: Yup.string(),
  });

  const defaultValues = useMemo(() => {
    return {
      id: user?.id,
      email: user?.email || "",
      name: user?.name || "",
      phone: user?.phone || "",
      role: getObjectPropSafely(() => user?.group_permission?.name),
      roleId: getObjectPropSafely(() => user?.group_permission?.id),
      image: {
        id: getObjectPropSafely(() => user?.image?.id) || "",
        url: getObjectPropSafely(() => user?.image?.url) || "",
      },
      imageApi: getObjectPropSafely(() => user?.image?.id),
    };
  }, [user]);

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const { setValue, handleSubmit, control, reset, watch } = methods;
  const values = watch();

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const onSubmit = async (dataForm: FormValuesProps) => {
    const objData: any = {
      name: dataForm.name,
      phone: dataForm.phone,
      image:
        dataForm.imageApi !== getObjectPropSafely(() => dataPopup.defaultData?.imageApi)
          ? dataForm.imageApi
          : "",
      group_permission: {
        id: dataForm.roleId,
      },
      id: dataForm.id,
    };

    const newObjData = handleParams(objData);

    dispatch(updateUserAction(newObjData));

    updateProfile({
      name: dataForm.name || "",
      phone: dataForm.phone || "",
      image: dataForm.image,
    });

    setNotifications({
      message: message.UPDATE_ACCOUNT_SUCCESS,
      variant: statusNotification.SUCCESS,
    });
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      setLoadingImage(true);
      const result: any = await userApi.upload(acceptedFiles[0], "image/");

      if (result && result?.data) {
        const { data } = result;

        setNotifications({
          message: message.UPLOAD_IMAGE_SUCCESS,
          variant: statusNotification.SUCCESS,
        });

        setValue("imageApi", data.id);
        setValue("image", { id: data.id, url: data.image });
      }

      setLoadingImage(false);
    },
    [setValue]
  );

  const handleLogout = async () => {
    await logout?.();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item container xs={12} md={4}>
          <Card sx={{ py: 5, px: 9, textAlign: "center", width: "100%" }}>
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
            <Controller
              name="role"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Span
                  variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                  color="primary"
                  sx={{ mt: 3 }}
                >
                  {field.value}
                </Span>
              )}
            />
          </Card>
        </Grid>

        <Grid item container xs={12} md={8}>
          <Card sx={{ p: 3, width: "100%" }}>
            <Grid container rowGap={3}>
              <RHFTextField name="name" label="Tên" />
              <RHFTextField name="email" label="Email" disabled />
              <RHFTextField name="phone" label="Số điện thoại" />
            </Grid>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <MButton type="submit" variant="contained" disabled={isEqual(defaultValues, values)}>
                Lưu
              </MButton>
            </Stack>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <MButton variant="contained" color="error" onClick={handleLogout}>
                Đăng xuất
              </MButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default AccountGeneral;

// Libraries
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

// Redux
import { rolesStore } from "store/redux/roles/slice";

// Hooks
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";

// Components
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormDialog from "components/Dialogs/FormDialog";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import ControlPanel from "./ControlPanel";

// Constants &  Utils
import { LABEL_ROLE } from "constants/userRoles";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { standardString } from "utils/helpers";
import { Autocomplete, Stack, Typography } from "@mui/material";
import { DIRECTION_ROUTE_OPTIONS } from "constants/directionRouter";
import { RoleItemType } from "./ListRole";
interface FormInput {
  name: string;
  role: any;
  route: string;
  code: string;
}
interface Props {
  isOpen: boolean;
  buttonText?: string;
  title?: string;
  isLoadingButton?: boolean;
  isShowInputEmail?: boolean;
  dataPopup?: any;
  handleClose: () => void;
  hanldeSubmit: (form: FormInput) => void;
  roles: any;
}

const schema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên quyền").trim(),
  route: yup.string().required("Vui lòng nhập đường dẫn").trim(),
  code: yup.string().required("Vui lòng nhập mã nhóm"),
  // .min(4, "Nhập ít nhất 5 kí tự")
  // .max(20, "Nhập nhiều nhất 20 kí tự"),
});

const MutationRoleModal = (props: Props) => {
  const {
    roles,
    title,
    isOpen,
    buttonText = "",
    isLoadingButton = false,
    handleClose,
    hanldeSubmit,
  } = props;
  const {
    getValues,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  const values = getValues();
  const { user } = useAuth();
  const { roles: rolesContent, optionRole } = useAppSelector(rolesStore);
  const [roleItem, setRoleItem] = useState<RoleItemType>({
    label: "",
    value: "",
    data: "",
    route: "",
    code: "",
  });

  useEffect(() => {
    if (isOpen) {
      const optionDefault = optionRole.find(
        (item) =>
          item.label ===
          (getObjectPropSafely(() => user?.group_permission?.name) || LABEL_ROLE.ADMIN)
      );

      if (optionDefault) {
        setRoleItem({
          ...optionDefault,
          ...rolesContent?.[optionDefault.value],
          route: rolesContent?.[user?.group_permission?.id || ""]?.route || "",
        });
      }

      setValue("route", rolesContent?.[user?.group_permission?.id || ""]?.route);
    }

    clearErrors();
  }, [isOpen]);

  return (
    <FormDialog
      title={title}
      sizeTitle="h5"
      buttonText={buttonText}
      maxWidth="lg"
      onClose={handleClose}
      onSubmit={handleSubmit((form: FormInput) =>
      {
        hanldeSubmit({
          name: form.name,
          role: roleItem.data,
          route: form.route,
          code: form.code,
        })
      }
        
      )}
      isLoadingButton={isLoadingButton}
      open={isOpen}
    >
      <FormGroup>
        <Box p={2} pb={0}>
          <Typography fontWeight={700} mb={2}>
            Chi tiết quyền
          </Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              id="outlined-error-username"
              helperText={errors.name?.message}
              error={errors.name?.message ? true : false}
              label="Tên quyền"
              autoFocus
              required
              defaultValue=""
              onChange={(e) => {
                setValue("name", e.target.value, { shouldValidate: true });
                setValue("code", standardString(e.target.value).split(" ").join("-"), {
                  shouldValidate: true,
                });
              }}
              InputLabelProps={{ shrink: true }}
              placeholder="Nhập tên quyền"
              fullWidth
            />
            <TextField
              id="outlined-role-code"
              helperText={errors.code?.message}
              error={errors.code?.message ? true : false}
              label="Mã nhóm"
              required
              defaultValue=""
              value={values.code}
              onChange={(e) => setValue("code", e.target.value, { shouldValidate: true })}
              InputLabelProps={{ shrink: true }}
              placeholder="Nhập mã nhóm"
              fullWidth
            />
            <Autocomplete
              disablePortal
              id="route-autocomplete"
              options={DIRECTION_ROUTE_OPTIONS}
              renderInput={(params) => <TextField {...params} label="Đường dẫn mặc định" />}
              value={DIRECTION_ROUTE_OPTIONS.find((item) => item.value === roleItem?.route) || null}
              onChange={(e, route) =>
                setValue("route", route?.value?.toString() || "", { shouldValidate: true })
              }
              isOptionEqualToValue={(option, value) => option.value === value.value}
              fullWidth
            />
          </Stack>
        </Box>

        <Box p={2}>
          <ControlPanel roles={roles} roleItem={roleItem} setRoleItem={setRoleItem} isCreate />
        </Box>
      </FormGroup>
    </FormDialog>
  );
};

export default MutationRoleModal;

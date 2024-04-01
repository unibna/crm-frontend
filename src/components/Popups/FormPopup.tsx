// Libraries
import { memo, useEffect, useMemo } from "react";
import {
  Control,
  Controller,
  FieldValues,
  UseFormSetValue,
  UseFormWatch,
  UseFormReturn,
  ControllerRenderProps,
  ControllerFieldState,
  UseFormStateReturn,
} from "react-hook-form";
import isEqual from "lodash/isEqual";
import isArray from "lodash/isArray";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FormProvider } from "components/HookFormFields";
import map from "lodash/map";

// Components
import { styled } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import FormDialog from "components/Dialogs/FormDialog";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
import { UploadMultiFile } from "components/Uploads";
import MDatePicker from "components/Pickers/MDatePicker";
import { DatePickerView } from "@mui/lab/DatePicker/shared";
import { MultiSelect, MSelectColor } from "components/Selectors";
import { MDateTimeMobilePicker } from "components/Pickers";

// Constants & Utils
import { SelectOptionType } from "_types_/SelectOptionType";
import { TYPE_FORM_FIELD } from "constants/index";
import { GridSizeType } from "_types_/GridLayoutType";

//---------------------------------------------------------------

export const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));
export interface FormInput {
  [key: string]: any;
}

export interface Methods {
  control: Control<FieldValues, object>;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}
export interface FormValuesProps extends Partial<any> {
  taxes: boolean;
  inStock: boolean;
}

export interface PropsContentRender {
  type?: string;
  name: string;
  label?: string;
  typeInput?: string;
  placeholder?: string;
  nameOptional?: string;
  required?: boolean;
  disabled?: boolean;
  simpleSelect?: boolean;
  size?: "small" | "medium";
  content?: ({
    field,
    fieldState,
    formState,
  }: {
    field: ControllerRenderProps<FormValuesProps, string>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<FormValuesProps>;
  }) => JSX.Element;
  options?: SelectOptionType[];
  contentRender?: React.ReactNode;
  viewsDate?: DatePickerView[];
  renderOptionTitleFunc?: ({
    idx,
    option,
    onClick,
  }: {
    option: SelectOptionType;
    idx: number;
    onClick?: () => void;
  }) => React.ReactNode;
}
interface Props {
  fullScreen?: boolean;
  isOpen: boolean;
  transition?: boolean;
  isLoadingImage?: boolean;
  isDisabledSubmit?: boolean;
  isDisableSubmitOptional?: boolean;
  isShowFooter?: boolean;
  buttonText?: string;
  sizeTitle?: string;
  maxWidthForm?: GridSizeType;
  title?: string;
  zIndex?: number;
  style?: React.CSSProperties;
  defaultData?: any;
  isLoadingButton?: boolean;
  funcContentSchema?: (yup: typeof Yup) => any;
  funcContentRender: (
    methods: UseFormReturn<FormValuesProps, object>,
    optional: any
  ) => JSX.Element | PropsContentRender[];
  handleClose: () => void;
  handleSubmitPopup: (form: FormInput) => void;
  handleDropImage?: (
    acceptedFiles: File[],
    methods: UseFormReturn<FormValuesProps, object>
  ) => void;
  handleRemoveAllImage?: (methods: UseFormReturn<FormValuesProps, object>) => void;
  handleRemoveImage?: (
    file: { id: string; url: string },
    methods: UseFormReturn<FormValuesProps, object>
  ) => void;
  optionalContent?: JSX.Element;
  subTitle?: string;
}

const FormPopup = (props: Props) => {
  const {
    fullScreen,
    title,
    zIndex = 1302,
    isOpen,
    sizeTitle = "h5",
    subTitle,
    isLoadingImage = false,
    buttonText = "",
    defaultData = {},
    style = {},
    isLoadingButton = false,
    transition,
    isShowFooter = true,
    isDisabledSubmit,
    isDisableSubmitOptional = false,
    funcContentRender = () => [],
    funcContentSchema = () => {},
    maxWidthForm = "sm",
    handleClose,
    handleSubmitPopup,
    handleDropImage = (acceptedFiles, methods) => {},
    handleRemoveAllImage = (methods) => {},
    handleRemoveImage = (file: { id: string; url: string }, methods) => {},
    optionalContent,
  } = props;

  const NewProductSchema = Yup.object().shape(funcContentSchema(Yup));

  const defaultValues = useMemo(
    () => ({
      ...defaultData,
    }),
    [defaultData]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProductSchema),
  });

  const { control, handleSubmit, clearErrors, watch, reset, getValues } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
    clearErrors();
  }, [isOpen]);

  const renderHtml = () => {
    const valueComponent = funcContentRender({ ...methods }, { ...props });
    if (isArray(valueComponent) && valueComponent.length) {
      return map(valueComponent, (item: PropsContentRender, index: number) => {
        const {
          disabled = false,
          simpleSelect = true,
          type,
          size,
          name,
          label,
          placeholder,
          options = [],
          typeInput = "text",
          nameOptional = "",
          required = false,
          viewsDate = ["day", "year", "month"],
          contentRender,
          renderOptionTitleFunc,
          content = () => {},
        } = item;

        let component;
        switch (type) {
          case TYPE_FORM_FIELD.TEXTFIELD: {
            component = (
              <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    type={typeInput}
                    autoFocus={index === 0}
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                  />
                )}
              />
            );
            break;
          }
          case TYPE_FORM_FIELD.MULTIPLE_SELECT: {
            component = (
              <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <MultiSelect
                    zIndex={1303}
                    style={{ width: "100%" }}
                    title={label}
                    size="medium"
                    selectorId={`id${label}`}
                    fullWidth
                    outlined
                    error={!!error}
                    helperText={error?.message}
                    options={options}
                    onChange={field.onChange}
                    defaultValue={field.value}
                    simpleSelect={simpleSelect}
                    required={required}
                    contentRender={contentRender}
                    placeholder={placeholder}
                    renderOptionTitleFunc={renderOptionTitleFunc}
                  />
                )}
              />
            );
            break;
          }
          case TYPE_FORM_FIELD.UPLOAD_IMAGE: {
            component = (
              <div className="relative">
                {label && <LabelStyle>{label}</LabelStyle>}
                <Controller
                  name={name}
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    const checkError = !!error && field.value?.length === 0;

                    return (
                      <UploadMultiFile
                        accept="image/*"
                        files={field.value}
                        error={checkError}
                        helperText={
                          checkError && (
                            <FormHelperText error sx={{ px: 2 }}>
                              {error?.message}
                            </FormHelperText>
                          )
                        }
                        isMultiple={false}
                        showPreview
                        maxSize={2145728}
                        isLoadingBackground={isLoadingImage}
                        onDrop={(acceptedFiles: File[]) => handleDropImage(acceptedFiles, methods)}
                        onRemove={(file: { id: string; url: string }) =>
                          handleRemoveImage(file, methods)
                        }
                        onRemoveAll={() => handleRemoveAllImage(methods)}
                      />
                    );
                  }}
                />
              </div>
            );
            break;
          }
          case TYPE_FORM_FIELD.COLOR: {
            component = (
              <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Grid container direction="row" spacing={3} alignItems="center">
                      <Grid item xs={3} md={3}>
                        {label && <Typography variant="body2">{label}</Typography>}
                      </Grid>
                      <Grid item xs={2} md={2}>
                        <MSelectColor
                          color={field.value}
                          onChangeColor={(color: string) => field.onChange(color)}
                        />
                      </Grid>
                      <Grid item xs={7} md={7}>
                        {getValues(nameOptional) ? (
                          <Box>
                            <Chip
                              size="small"
                              label={getValues(nameOptional)}
                              sx={{
                                backgroundColor: field.value,
                                color: "#fff",
                              }}
                            />
                          </Box>
                        ) : null}
                      </Grid>
                    </Grid>
                    {!!error ? (
                      <Typography variant="body2" component="span" color="error" sx={{ mt: 1 }}>
                        {error?.message}
                      </Typography>
                    ) : null}
                  </>
                )}
              />
            );

            break;
          }
          case TYPE_FORM_FIELD.SWITCH: {
            component = (
              <Grid container direction="row" alignItems="center">
                <Typography component="span" variant="body2" sx={{ mr: 2 }}>
                  {label}
                </Typography>
                <Controller
                  name={name}
                  control={control}
                  render={({ field }) => <Switch {...field} checked={field.value} />}
                />
              </Grid>
            );

            break;
          }
          case TYPE_FORM_FIELD.DATE: {
            component = (
              <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <MDatePicker
                      views={viewsDate}
                      label={label}
                      minDate={"01/03/2022"}
                      // maxDate={"01/06/2025"}
                      value={field.value}
                      onChangeDate={(value: Date) => field.onChange(value)}
                      error={!!error}
                      helperText={error?.message}
                      size={size}
                    />
                  );
                }}
              />
            );

            break;
          }
          case TYPE_FORM_FIELD.DATE_TIME: {
            component = (
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <MDateTimeMobilePicker
                    onChange={(date: Date) => field.onChange(date)}
                    label={label}
                    value={field.value ? (new Date(field.value) as any) : null}
                  />
                )}
              />
            );
            break;
          }
          default: {
            component = (
              <Controller
                name={name}
                control={control}
                render={({ field, fieldState, formState }) => (
                  <>{content({ field, fieldState, formState })}</>
                )}
              />
            );
          }
        }

        return (
          <Box p={2} key={index}>
            <FormControl fullWidth>{component}</FormControl>
          </Box>
        );
      });
    } else {
      return valueComponent;
    }
  };

  return (
    <FormProvider methods={methods}>
      <FormDialog
        enableCloseByDropClick
        fullScreen={fullScreen}
        zIndex={zIndex}
        transition={transition}
        title={title}
        sizeTitle={sizeTitle}
        subTitle={subTitle}
        buttonText={buttonText}
        maxWidth={maxWidthForm}
        onClose={handleClose}
        onSubmit={handleSubmit(handleSubmitPopup)}
        isLoadingButton={isLoadingButton}
        open={isOpen}
        disabledSubmit={
          isDisabledSubmit + "" === "false"
            ? isDisabledSubmit
            : isDisableSubmitOptional
            ? isDisableSubmitOptional
            : isEqual(defaultValues, values)
        }
        isShowFooter={isShowFooter}
        sx={{ ...style }}
      >
        <FormGroup>{optionalContent || renderHtml()}</FormGroup>
      </FormDialog>
    </FormProvider>
  );
};

const areEqual = (prevProps: Props, nextProps: Props) => {
  if (
    !isEqual(prevProps.isOpen, nextProps.isOpen) ||
    !isEqual(prevProps.zIndex, nextProps.zIndex) ||
    !isEqual(prevProps.defaultData, nextProps.defaultData) ||
    !isEqual(prevProps.buttonText, nextProps.buttonText) ||
    !isEqual(prevProps.isLoadingButton, nextProps.isLoadingButton) ||
    !isEqual(prevProps.isShowFooter, nextProps.isShowFooter) ||
    !isEqual(prevProps.title, nextProps.title) ||
    !isEqual(prevProps.maxWidthForm, nextProps.maxWidthForm) ||
    !isEqual(prevProps.funcContentSchema, nextProps.funcContentSchema) ||
    !isEqual(prevProps.funcContentRender, nextProps.funcContentRender) ||
    !isEqual(prevProps.handleClose, nextProps.handleClose) ||
    !isEqual(prevProps.handleSubmitPopup, nextProps.handleSubmitPopup)
  ) {
    return false;
  }
  return true;
};

export default memo(FormPopup, areEqual);

// Libraries
import { yupResolver } from "@hookform/resolvers/yup";
import map from "lodash/map";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// MUI
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

// Components
import FormDialog from "components/Dialogs/FormDialog";

// Utils & Constants
import { formatOptionSelect } from "utils/selectOptionUtil";
import vi from "locales/vi.json";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import { EMPTY_OPTION } from "constants/index";
import { TRANSPORTATION_STATUS_OPTIONS } from "../../constant";

// Hooks
import { useAppSelector } from "hooks/reduxHook";

// Types
import { TRANSPORTATION_HANDLE_STATUS_TYPE } from "_types_/TransportationType";

// Redux
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { MTextLine, Span } from "components/Labels";
import { MDateTimeMobilePicker } from "components/Pickers";
import { MultiSelect } from "components/Selectors";
import { LabelStyle } from "components/Popups/FormPopup";
import { getAllAttributesTransporationCare } from "selectors/attributes";
import { userStore } from "store/redux/users/slice";
import { fDateTime } from "utils/dateUtil";
import { OPTIONS_REASON_CREATED } from "views/TransportationCareView/constant";

const formWidth = "md";
const buttonText = "Lưu";
let formTitle = "Cập nhật";

export interface TransportationCarForm {
  late_reason?: string | number;
  late_action?: string | number;
  wait_return_reason?: string | number;
  wait_return_action?: string | number;
  returning_reason?: string | number;
  returning_action?: string | number;
  returned_reason?: string | number;
  returned_action?: string | number;
  note?: string;
  handle_by?: string;
  appointment_date?: string;
  status?: string;
  late_created?: string;
  wait_return_created?: string;
  returning_created?: string;
  old_status?: string;
}

const transportationFormSchema = yup.object().shape(
  {
    handle_by: yup.string().required(VALIDATION_MESSAGE.REQUIRE_HANDLE_BY).trim(),
    late_reason: yup.mixed().when(["late_created", "status", "late_reason"], {
      is: (late_created: string, status: string, late_reason: string | number) => {
        return !!(
          late_created &&
          status === TRANSPORTATION_HANDLE_STATUS_TYPE.COMPLETED &&
          !late_reason
        );
      },
      then: (schema) => schema.required(VALIDATION_MESSAGE.REQUIRE_SELECT_REASON),
    }),
    late_action: yup.mixed().when(["late_created", "status", "late_action"], {
      is: (late_created: string, status: string, late_action: string | number) => {
        return !!(
          late_created &&
          status === TRANSPORTATION_HANDLE_STATUS_TYPE.COMPLETED &&
          !late_action
        );
      },
      then: (schema) => schema.required(VALIDATION_MESSAGE.REQUIRE_SELECT_ACTION),
    }),
    wait_return_reason: yup.mixed().when(["wait_return_created", "status", "wait_return_reason"], {
      is: (wait_return_created: string, status: string, wait_return_reason: string | number) => {
        return !!(
          wait_return_created &&
          status === TRANSPORTATION_HANDLE_STATUS_TYPE.COMPLETED &&
          !wait_return_reason
        );
      },
      then: (schema) => schema.required(VALIDATION_MESSAGE.REQUIRE_SELECT_REASON),
    }),
    wait_return_action: yup.mixed().when(["wait_return_created", "status", "wait_return_action"], {
      is: (wait_return_created: string, status: string, wait_return_action: string | number) => {
        return !!(
          wait_return_created &&
          status === TRANSPORTATION_HANDLE_STATUS_TYPE.COMPLETED &&
          !wait_return_action
        );
      },
      then: (schema) => schema.required(VALIDATION_MESSAGE.REQUIRE_SELECT_ACTION),
    }),
    returning_reason: yup.mixed().when(["returning_created", "status", "returning_reason"], {
      is: (returning_created: string, status: string, returning_reason: string | number) => {
        return !!(
          returning_created &&
          status === TRANSPORTATION_HANDLE_STATUS_TYPE.COMPLETED &&
          !returning_reason
        );
      },
      then: (schema) => schema.required(VALIDATION_MESSAGE.REQUIRE_SELECT_REASON),
    }),
    returning_action: yup.mixed().when(["returning_created", "status", "returning_action"], {
      is: (returning_created: string, status: string, returning_action: string | number) => {
        return !!(
          returning_created &&
          status === TRANSPORTATION_HANDLE_STATUS_TYPE.COMPLETED &&
          !returning_action
        );
      },
      then: (schema) => schema.required(VALIDATION_MESSAGE.REQUIRE_SELECT_ACTION),
    }),
    returned_reason: yup.mixed().when(["returned_created", "status", "returned_reason"], {
      is: (returned_created: string, status: string, returned_reason: string | number) => {
        return !!(
          returned_created &&
          status === TRANSPORTATION_HANDLE_STATUS_TYPE.COMPLETED &&
          !returned_reason
        );
      },
      then: (schema) => schema.required(VALIDATION_MESSAGE.REQUIRE_SELECT_REASON),
    }),
    returned_action: yup.mixed().when(["returned_created", "status", "returned_action"], {
      is: (returned_created: string, status: string, returned_action: string | number) => {
        return !!(
          returned_created &&
          status === TRANSPORTATION_HANDLE_STATUS_TYPE.COMPLETED &&
          !returned_action
        );
      },
      then: (schema) => schema.required(VALIDATION_MESSAGE.REQUIRE_SELECT_ACTION),
    }),
  },
  [
    ["late_reason", "late_reason"],
    ["late_action", "late_action"],
    ["wait_return_action", "wait_return_action"],
    ["wait_return_reason", "wait_return_reason"],
    ["returning_reason", "returning_reason"],
    ["returning_action", "returning_action"],
    ["returned_reason", "returned_reason"],
    ["returned_action", "returned_action"],
  ]
);

const Popup = ({
  row,
  onChange,
  onApplyChanges,
  onCancelChanges,
  open,
  updateHandleByDisabled = true,
  isNewTransportation,
}: {
  row: any;
  onChange: ({ name, value }: { name: string; value: any }) => void;
  onApplyChanges: () => void;
  onCancelChanges: () => void;
  open: boolean;
  updateHandleByDisabled?: boolean;
  isNewTransportation?: boolean;
}) => {
  const userSlice = useAppSelector(userStore);
  const {
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<TransportationCarForm>({
    resolver: yupResolver(transportationFormSchema),
  });

  const attributesTransporationCare = useAppSelector((state) =>
    getAllAttributesTransporationCare(state.attributes)
  );

  useEffect(() => {
    // Get default value
    reset({
      note: row.note || "",
      late_created: row?.late_created,
      wait_return_created: row?.wait_return_created,
      returning_created: row?.returning_created,
      late_reason: row?.late_reason?.id,
      late_action: row.late_action?.id,
      wait_return_reason: row.wait_return_reason?.id,
      wait_return_action: row.wait_return_action?.id,
      returning_reason: row.returning_reason?.id,
      returning_action: row.returning_action?.id,
      returned_reason: row.returned_reason?.id,
      returned_action: row.returned_action?.id,
      handle_by: row.handle_by?.id,
      appointment_date: row.appointment_date,
      status: isNewTransportation ? TRANSPORTATION_HANDLE_STATUS_TYPE.PENDING : row.status,
    });
  }, [row]);

  // this is react hook form data
  const {
    note,
    handle_by,
    appointment_date,
    status,
    late_action,
    late_reason,
    wait_return_reason,
    wait_return_action,
    returning_reason,
    returning_action,
    returned_reason,
    returned_action,
  } = watch();

  useEffect(() => {
    if (open) {
      checkStatusPrevSubmit();
    }
  }, [open]);

  const checkStatusPrevSubmit = () => {
    if (isNewTransportation === true) {
      onChange({ name: "status", value: "pending" });
    }
  };

  const arrayReasonsAndActionProps = [
    {
      label: "late_reason",
      defaultValue: late_reason,
      title: vi.late_reason,
      options: attributesTransporationCare.lateReason,
      disabled: !Boolean(row?.late_created),
    },
    {
      label: "late_action",
      defaultValue: late_action,
      title: vi.late_action,
      options: attributesTransporationCare.lateAction,
      disabled: !Boolean(row?.late_created),
    },

    {
      label: "wait_return_reason",
      defaultValue: wait_return_reason,
      title: vi.wait_return_reason,
      options: attributesTransporationCare.waitReturnReason,
      disabled: !Boolean(row?.wait_return_created),
    },
    {
      label: "wait_return_action",
      defaultValue: wait_return_action,
      title: vi.wait_return_action,
      options: attributesTransporationCare.waitReturnAction,
      disabled: !Boolean(row?.wait_return_created),
    },
    {
      label: "returning_reason",
      defaultValue: returning_reason,
      title: vi.returning_reason,
      options: attributesTransporationCare.returningReason,
      disabled: !Boolean(row?.returning_created),
    },
    {
      label: "returning_action",
      defaultValue: returning_action,
      title: vi.returning_action,
      options: attributesTransporationCare.returningAction,
      disabled: !Boolean(row?.returning_created),
    },
    {
      label: "returned_reason",
      defaultValue: returned_reason,
      title: vi.returned_reason,
      options: attributesTransporationCare.returnedReason,
      disabled: !Boolean(row?.returned_created),
    },
    {
      label: "returned_action",
      defaultValue: returned_action,
      title: vi.returned_action,
      options: attributesTransporationCare.returnedAction,
      disabled: !Boolean(row?.returned_created),
    },
  ];

  const dataRender = [
    {
      label: vi.late,
      keyCreated: "late_created",
      arrayComponent: arrayReasonsAndActionProps.slice(0, 2),
    },
    {
      label: vi.wait_return,
      keyCreated: "wait_return_created",
      arrayComponent: arrayReasonsAndActionProps.slice(2, 4),
    },
    {
      label: vi.returning,
      keyCreated: "returning_created",
      arrayComponent: arrayReasonsAndActionProps.slice(4, 6),
    },
    {
      label: vi.returned,
      keyCreated: "returned_created",
      arrayComponent: arrayReasonsAndActionProps.slice(6, 8),
    },
  ];

  return (
    <FormDialog
      open={open}
      title={formTitle}
      maxWidth={formWidth}
      buttonText={buttonText}
      onClose={onCancelChanges}
      onSubmit={handleSubmit(onApplyChanges)}
    >
      <Box sx={{ mb: 3 }}>
        <LabelStyle sx={{ mb: 2 }}>Thông tin xử lý</LabelStyle>
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6} md={4}>
            <MultiSelect
              simpleSelect
              outlined
              size="medium"
              options={[
                EMPTY_OPTION,
                ...TRANSPORTATION_STATUS_OPTIONS.filter(
                  (item) => item.value !== TRANSPORTATION_HANDLE_STATUS_TYPE.NEW
                ),
                { value: TRANSPORTATION_HANDLE_STATUS_TYPE.NEW, label: "Mới", disabled: true },
              ]}
              error={false}
              defaultValue={status}
              disabled={isNewTransportation === true ? true : false}
              title={vi.status_of_care}
              fullWidth
              onChange={(value) =>
                onChange({
                  name: "status",
                  value: value,
                })
              }
              selectorId="PROBLEM_Status"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <MultiSelect
              title="Người nhận xử lý"
              options={map(userSlice.telesaleUsers, formatOptionSelect)}
              onChange={(value) => onChange({ name: "handle_by", value: { id: value } })}
              label="handle-user"
              fullWidth
              defaultValue={handle_by}
              simpleSelect
              outlined
              size="medium"
              selectorId="handle-by-selector"
              disabled={updateHandleByDisabled}
              error={!!errors.handle_by?.message}
              helperText={errors.handle_by?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <MDateTimeMobilePicker
              onChange={(date) => onChange({ name: "appointment_date", value: date })}
              label={vi.callback_time}
              value={appointment_date ? (new Date(appointment_date) as any) : null}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              value={note}
              fullWidth
              name="note"
              variant="outlined"
              label="Ghi chú"
              multiline
              minRows={2}
              onChange={(e) =>
                e.target.value !== " " &&
                e.target.value !== "\n" &&
                onChange({ name: "note", value: e.target.value })
              }
            />
          </Grid>
        </Grid>
      </Box>

      {!isNewTransportation && (
        <Box>
          <LabelStyle sx={{ mb: 2 }}>Lí do và hướng xử lý</LabelStyle>
          {dataRender.map(
            (item) =>
              (row?.[item.keyCreated] || item.keyCreated === "returning_created") && (
                <Accordion expanded key={item.label}>
                  <AccordionSummary aria-controls="panel1bh-content" id="panel1bh-header">
                    <Stack direction="row" spacing={1.5}>
                      <Span
                        color={
                          OPTIONS_REASON_CREATED.find(
                            (_item) => `${_item.value}_created` === item.keyCreated
                          )?.color
                        }
                        sx={{ width: "fit-content" }}
                      >
                        {item.label}
                      </Span>
                      <Span color="default" sx={{ width: "fit-content" }}>
                        <MTextLine
                          label="Ngày tạo:"
                          value={
                            row?.[item.keyCreated] ? (
                              <b>{fDateTime(row?.[item.keyCreated])}</b>
                            ) : (
                              "---"
                            )
                          }
                        />
                      </Span>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={1.5}>
                      {(row?.[item.keyCreated] || item.keyCreated === "returning_created") &&
                        map(item.arrayComponent, (item, index) => (
                          <Grid item xs={12} sm={12} md={4} key={index}>
                            <MultiSelect
                              outlined
                              fullWidth
                              simpleSelect
                              size="medium"
                              label={item.label}
                              title={item.title}
                              // disabled={item.disabled || isNewTransportation}
                              defaultValue={item.defaultValue}
                              selectorId={`${item.label}-selector`}
                              options={[
                                EMPTY_OPTION,
                                ...map(item.options, (item) => ({
                                  value: item.id,
                                  label: item.label,
                                })),
                              ]}
                              onChange={(value) => {
                                onChange({ name: item.label, value: { id: value } });
                              }}
                              error={!!errors?.[item.label as keyof typeof errors]?.message}
                              helperText={errors?.[item.label as keyof typeof errors]?.message}
                            />
                          </Grid>
                        ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              )
          )}
        </Box>
      )}
    </FormDialog>
  );
};

export default Popup;

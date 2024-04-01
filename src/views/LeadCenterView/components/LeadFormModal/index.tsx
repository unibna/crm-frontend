// hooks
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { userStore } from "store/redux/users/slice";

//apis
import { phoneLeadApi } from "_apis_/lead.api";

// components
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import FormDialog from "components/Dialogs/FormDialog";
import { CDPColumn } from "./CDPColumn";

// types
import { PhoneLeadResType, PhoneLeadType } from "_types_/PhoneLeadType";

// utils
import { CustomerType } from "_types_/CustomerType";
import { SX_PADDING_FORM_FULL_WIDTH_MODAL } from "constants/index";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import vi from "locales/vi.json";
import find from "lodash/find";
import isEqual from "lodash/isEqual";
import { leadStore } from "store/redux/leads/slice";
import { isReadAndWriteRole } from "utils/roleUtils";
import AttributeController from "./AttributeController";
import LeadStatusController from "./LeadStatusController";
import { leadFormSchema } from "features/lead/validation";
import { transferLeadValue } from "features/lead/transferFormValue";
import SpamFormModal, { SpamForm } from "../SpamFormModal";
import { handleAddIntercept } from "features/lead/handleFilter";
import { dispatch } from "store";
import { toastInfo } from "store/redux/toast/slice";

interface Props {
  formProps: Partial<PhoneLeadResType>;
  tabName?: string;
  open?: boolean;
  onClose: () => void;
  id?: string;
  onApplyChanges?: (value: Partial<PhoneLeadType>) => void;
}

let defaultForm: Partial<PhoneLeadType> = {};
const formCDPID = "cdp-form-grid";

const LeadFormModal = memo(({ formProps, onApplyChanges, tabName, open, onClose }: Props) => {
  const { user } = useAuth();
  const leadSlice = useAppSelector(leadStore);
  const userSlice = useAppSelector(userStore);
  const [loading, setLoading] = useState(false);
  const [isLoadCDP, setLoadCDP] = useState(false);
  const [customer, setCustomer] = useState<Partial<CustomerType>>();
  const {
    handleSubmit,
    reset,
    getValues,
    watch,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<PhoneLeadType>({
    resolver: yupResolver(leadFormSchema),
    mode: "all",
  });

  const { phone, channel, name, bad_data_reason, data_status } = watch();

  const handleCloseForm = () => {
    clearErrors();
    onClose();
  };

  const handleUpdatePhoneLead = async (formData: Partial<PhoneLeadType>) => {
    setLoading(true);
    if (formProps?.id) {
      const params = {
        ...formData,
        id: formProps?.id,
      };
      const result = await phoneLeadApi.updatePhoneLead<PhoneLeadType>({
        id: formProps?.id,
        form: params,
      });
      if (result && result.data) {
        onApplyChanges && onApplyChanges(result.data);
        onClose();
      }
    }
    setLoading(false);
  };

  const handleCreatePhoneLead = async (formData: Partial<PhoneLeadType>) => {
    setLoading(true);
    const result = await phoneLeadApi.createPhoneLead<PhoneLeadType>({ form: formData });
    if (result && result.data) {
      onApplyChanges && onApplyChanges(result.data);
      onClose();
    }
    setLoading(false);
  };

  function handleFormatForm(formData: Partial<PhoneLeadType> = {}) {
    const { name, phone, lead_status } = formData;
    let fail_reason = formData.fail_reason;

    //nếu trạng thái khác "không mua" => fail_reason: undefined
    if (lead_status !== "5") {
      fail_reason = null;
    }
    if (formProps?.id) {
      const isOriginData = isEqual(formData, defaultForm);
      isOriginData ? onClose() : handleUpdatePhoneLead({ ...formData, fail_reason, name, phone });
    } else {
      handleCreatePhoneLead({ ...formData, fail_reason, name, phone });
    }
  }

  function handleChange(value: any, name?: keyof PhoneLeadType) {
    if (name) {
      //format value
      if (name === "phone") {
        setLoadCDP(false);
      }
      const valueFormat = transferLeadValue(value, name);
      //reset update lead status while sale not update handle_by
      if (name === "handle_by" && value === undefined) {
        reset({
          ...getValues(),
          [name]: valueFormat,
          handle_status: undefined,
          handle_reason: undefined,
          lead_status: undefined,
          order_information: undefined,
          bad_data_reason: undefined,
          fail_reason: undefined,
        });
      } else {
        // reset({ ...getValues(), [name]: valueFormat });
        setValue(name, valueFormat, { shouldValidate: true });
      }
    }
  }

  // handle thay đổi bad_data_reason
  const handleSubmitSpamForm = async (
    formData: PhoneLeadType,
    onChangeForm: React.Dispatch<React.SetStateAction<SpamForm>>
  ) => {
    const oldDataStatus = leadSlice.attributes?.data_status.find((item) => item.id === data_status);
    const oldBadDataReason = leadSlice.attributes?.bad_data_reason.find(
      (item) => item.id.toString() === formProps.bad_data_reason?.id?.toString()
    );
    const badDataReason = leadSlice.attributes?.bad_data_reason.find(
      (item) => item.id.toString() === bad_data_reason?.toString()
    );
    // nếu old là spam mà hiện tại không spam => show popup xoá spam
    if ((oldDataStatus?.is_spam || oldBadDataReason?.is_spam) && !badDataReason?.is_spam) {
      onChangeForm((prev) => ({
        ...prev,
        buttonText: "Xoá",
        open: true,
        title: "Xác nhận để xoá",
        content: `Bạn có muốn xoá số điện thoại ${phone} khỏi danh sách Spam không?`,
        type: "delete",
        data: phone || "",
        status: badDataReason?.name || "",
        leadForm: formData,
      }));
      return;
    }
    // nếu old không là spam mà hiện tại là spam => show thêm vào danh sách spam
    if (!oldDataStatus?.is_spam && !oldBadDataReason?.is_spam && badDataReason?.is_spam) {
      const resAddIntercept = await handleAddIntercept({
        status: badDataReason.name,
        type: "SDT",
        userId: user?.id,
        data: phone,
      });
      if (resAddIntercept) {
        dispatch(
          toastInfo({
            message: `Đã thêm số điện thoại ${phone} vào danh sách Spam`,
            duration: 5000,
          })
        );
      }
      handleFormatForm(formData);
      return;
    }

    handleFormatForm(formData);
  };

  const handleSubmitSpam = async (formState: SpamForm) => {
    if (formState.type === "delete") {
      handleFormatForm(formState.leadForm);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (open) {
      //prettier-ignore
      const { 
        channel, handle_status, handle_reason, fanpage, product, modified_by, fail_reason, id, phone, 
        lead_status, call_later_at, note, data_status,handle_by, name, order_information, tags,
      } = formProps;

      const isAddLeadRole = isReadAndWriteRole(
        user?.is_superuser,
        user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.ADD_LEAD]
      );
      // khi không phải mà manager(sale) thì chỉ được tạo lead với channel là Hotline
      const hotlineChannel = leadSlice.attributes.channel.find((item) => item.name === "Hotline");
      const isCreate = !formProps?.id;

      const formState = {
        id,
        phone,
        lead_status,
        call_later_at,
        note,
        name,
        tags,
        order_information,
        channel: isCreate ? (isAddLeadRole ? channel?.id : hotlineChannel?.id) : channel?.id,
        handle_status: handle_status,
        handle_reason: handle_reason?.id,
        fanpage: fanpage?.id,
        product: product?.id,
        modified_by: modified_by?.id,
        fail_reason: fail_reason?.id,
        data_status: data_status?.id,
        handle_by: handle_by?.id,
      };

      reset(formState);
      defaultForm = formState;
      if (phone) {
        setLoadCDP(true);
      }
    } else {
      reset({});
    }
  }, [
    open,
    formProps,
    leadSlice.attributes.channel,
    reset,
    user?.group_permission?.data,
    user?.is_superuser,
  ]);

  useEffect(() => {
    if (!open) {
      setCustomer(undefined);
    } else {
      setCustomer({ phone: phone, full_name: name });
    }
  }, [open, phone, name]);

  const isAddLeadRole = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.ADD_LEAD]
  );

  const isNewForm = !formProps?.id;

  const isAcceptAction =
    (isAddLeadRole && isNewForm) ||
    (tabName === "all"
      ? isReadAndWriteRole(
          user?.is_superuser,
          user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
        )
      : formProps.handle_by?.id === user?.id ||
        isReadAndWriteRole(
          user?.is_superuser,
          user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
        ));

  const channelInstance = find(
    leadSlice.attributes.channel,
    (item) => item?.id?.toString() === channel?.toString()
  );

  return (
    <SpamFormModal
      renderInput={(onChangeSpamForm) => (
        <FormDialog
          transition
          // maxWidth={formWidth}
          fullScreen
          buttonText={vi.button.save}
          title={vi.handle_phone}
          open={open || false}
          onClose={handleCloseForm}
          onSubmit={handleSubmit((form) => handleSubmitSpamForm(form, onChangeSpamForm))}
          isLoadingButton={loading}
          disabledSubmit={!isAcceptAction}
        >
          <Grid container spacing={1} px={SX_PADDING_FORM_FULL_WIDTH_MODAL}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ margin: 8, padding: 8 }}>
                <AttributeController
                  values={getValues()}
                  defaultValues={defaultForm}
                  handleChange={handleChange}
                  errors={errors}
                  tabName={tabName}
                  userSlice={userSlice}
                  setLoadCDP={setLoadCDP}
                  isLoadCDP={isLoadCDP}
                  setCustomer={setCustomer}
                  channel={channelInstance}
                />
                <LeadStatusController
                  tabName={tabName}
                  values={getValues()}
                  handleChange={handleChange}
                  channel={channelInstance}
                  customer={customer}
                  errors={errors}
                />
              </Paper>
            </Grid>
            <Grid id={formCDPID} item xs={12} md={6}>
              <CDPColumn phone={isLoadCDP ? phone : ""} />
            </Grid>
          </Grid>
        </FormDialog>
      )}
      onSubmit={handleSubmitSpam}
      phone={phone}
    />
  );
});

export default memo(LeadFormModal);

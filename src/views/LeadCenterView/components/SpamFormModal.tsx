import Typography from "@mui/material/Typography";
import { PhoneLeadType } from "_types_/PhoneLeadType";
import FormDialog from "components/Dialogs/FormDialog";
import { handleAddIntercept, handleDeleteIntercept } from "features/lead/handleFilter";
import useAuth from "hooks/useAuth";
import { useState } from "react";
import { dispatch } from "store";
import { toastInfo } from "store/redux/toast/slice";

export interface SpamForm {
  loading: boolean;
  error: boolean;
  open: boolean;
  title: string;
  content: string;
  buttonText: string;
  type: string;
  status: string;
  dataId?: number | string;
  leadForm?: PhoneLeadType;
  data: string;
}

type Props = {
  onSubmit: (formState: SpamForm) => Promise<boolean>;
  phone?: string;
  renderInput: (
    onChangeForm: React.Dispatch<React.SetStateAction<SpamForm>>
  ) => React.ReactNode | JSX.Element;
};

const SpamFormModal = ({ onSubmit, phone, renderInput }: Props) => {
  const { user } = useAuth();

  const [formState, setFormState] = useState<SpamForm>({
    loading: false,
    error: false,
    open: false,
    title: "",
    content: "",
    buttonText: "",
    type: "",
    status: "",
    dataId: "none",
    data: "",
  });

  const handleSubmitSpam = async () => {
    setFormState((prev) => ({ ...prev, loading: true }));
    if (formState.type === "delete") {
      const res = await onSubmit(formState);
      if (res) {
        const res = await handleDeleteIntercept({ data: [formState.data] });
        if (res) {
          dispatch(
            toastInfo({
              message: `Đã xoá số điện thoại ${phone} vào danh sách Spam`,
              duration: 5000,
            })
          );
        }
      }
      setFormState((prev) => ({ ...prev, open: false, loading: false }));
    }
  };

  return (
    <>
      <FormDialog
        {...formState}
        isLoadingButton={formState.loading}
        onClose={() => setFormState((prev) => ({ ...prev, open: false }))}
        onSubmit={handleSubmitSpam}
      >
        <Typography>{formState.content}</Typography>
      </FormDialog>
      {renderInput(setFormState)}
    </>
  );
};

export default SpamFormModal;

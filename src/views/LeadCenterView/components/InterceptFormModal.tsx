import FormPopup from "components/Popups/FormPopup";
import { TYPE_FORM_FIELD } from "constants/index";
import React, { useState } from "react";
import { SPAM_TYPE } from "../constants";
import useAuth from "hooks/useAuth";
import { dispatch } from "store";
import { toastError } from "store/redux/toast/slice";
import { handleAddIntercept } from "features/lead/handleFilter";

type Props = {
  label: string;
  onClose: () => void;
  open: boolean;
  type: SPAM_TYPE;
  onRefresh: () => void;
};

const InterceptFormModal = ({ type, label, onClose, open, onRefresh }: Props) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAddSpam = async ({ data }: { data: string }) => {
    setLoading(true);
    const res = await handleAddIntercept({ data, type, userId: user?.id });
    if (res) {
      onRefresh();
      onClose();
    } else {
      dispatch(toastError({ message: "Tạo spam không thành công. Vui lòng thử lại sau" }));
    }
    setLoading(false);
  };

  return (
    <FormPopup
      funcContentRender={() => [
        {
          type: TYPE_FORM_FIELD.TEXTFIELD,
          name: "data",
          label,
          placeholder: "Nhập dữ liệu...",
        },
      ]}
      isLoadingButton={loading}
      funcContentSchema={(yup) => ({ data: yup.string().required("Vui lòng nhập dữ liệu") })}
      handleClose={onClose}
      isOpen={open}
      handleSubmitPopup={handleAddSpam}
      buttonText="Thêm"
      title="Thêm dữ liệu Spam"
    />
  );
};

export default InterceptFormModal;

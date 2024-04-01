import { SelectOptionType } from "_types_/SelectOptionType";
import { SkycallType } from "_types_/SkycallType";
import vi from "locales/vi.json";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import FormPopup from "components/Popups/FormPopup";
import { TYPE_FORM_FIELD } from "constants/index";
import { memo, useState } from "react";
import yup from "yup";

const schema = (Yup: typeof yup) => ({
  business_call_type: Yup.string().required(`${VALIDATION_MESSAGE.REQUIRE_VOIP_TYPE}`),
});

interface Props {
  onClose: () => void;
  onApplyChanges: (value: Partial<SkycallType>) => Promise<boolean>;
  open: boolean;
  row?: Partial<SkycallType>;
  callAttributeOptions?: SelectOptionType[];
}

const FormVoipModal = ({
  open = false,
  onClose,
  onApplyChanges,
  row,
  callAttributeOptions,
}: Props) => {
  const { sky_call_note = "", business_call_type } = row || {};
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form: Partial<SkycallType>) => {
    setLoading(true);
    const result = await onApplyChanges({ ...row, ...form });
    setLoading(false);
    if (result) {
      onClose();
    }
  };

  return (
    <FormPopup
      transition
      isOpen={open}
      isLoadingButton={loading}
      title="Cập nhật loại cuộc gọi"
      funcContentSchema={schema}
      funcContentRender={() => [
        {
          type: TYPE_FORM_FIELD.MULTIPLE_SELECT,
          name: "business_call_type",
          label: vi.voip_type,
          placeholder: vi.voip_type,
          options: callAttributeOptions,
          simpleSelect: true,
        },
        { type: TYPE_FORM_FIELD.TEXTFIELD, name: "sky_call_note", label: vi.note },
      ]}
      buttonText={vi.button.create}
      defaultData={{ business_call_type, sky_call_note: sky_call_note }}
      handleClose={onClose}
      handleSubmitPopup={handleSubmit}
    />
  );
};

export default memo(FormVoipModal);

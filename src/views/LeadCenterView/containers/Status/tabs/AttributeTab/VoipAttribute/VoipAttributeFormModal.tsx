//components
import { CallAttribute } from ".";
import FormPopup from "components/Popups/FormPopup";

//utils
import vi from "locales/vi.json";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import { TYPE_FORM_FIELD } from "constants/index";
import Yup from "yup";

const schema = (yup: typeof Yup) => ({
  value: yup.string().required(VALIDATION_MESSAGE.REQUIRE_INPUT).trim(),
});

const VoipAttributeFormModal = ({
  isShowModal,
  item,
  setShowModal,
  onSubmit,
}: {
  isShowModal?: boolean;
  item?: CallAttribute;
  setShowModal: (open: boolean) => void;
  onSubmit: (item?: CallAttribute) => void;
}) => {
  const handleSubmitForm = (formData: CallAttribute) => {
    onSubmit({ ...item, ...formData });
    setShowModal(false);
  };

  return (
    <FormPopup
      transition
      handleClose={() => setShowModal(false)}
      isOpen={isShowModal || false}
      buttonText={item ? vi.button.update : vi.button.create}
      maxWidthForm="md"
      title={vi.voip_type}
      funcContentSchema={schema}
      handleSubmitPopup={handleSubmitForm}
      defaultData={{ value: item?.value }}
      funcContentRender={() => [
        {
          name: "value",
          label: "Thuộc tính",
          placeholder: "Thuộc tính",
          type: TYPE_FORM_FIELD.TEXTFIELD,
        },
      ]}
    />
  );
};

export default VoipAttributeFormModal;

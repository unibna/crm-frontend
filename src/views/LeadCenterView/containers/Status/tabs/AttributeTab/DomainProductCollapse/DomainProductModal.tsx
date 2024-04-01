import { MappingType } from "./DomainProductMapping";
import { useAppSelector } from "hooks/reduxHook";
import { leadStore } from "store/redux/leads/slice";
import vi from "locales/vi.json";
import FormPopup from "components/Popups/FormPopup";
import { TYPE_FORM_FIELD } from "constants/index";
import { filterIsShowOptions } from "utils/selectOptionUtil";
import Yup from "yup";

const schema = (yup: typeof Yup) => ({
  landing_page_url: yup.string().required("Vui lòng nhập đường dẫn").trim(),
  product: yup.string().required("Vui lòng nhập sản phẩm"),
});

const DomainProductModal = ({
  isShowModal,
  item,
  setShowModal,
  onSubmit,
}: {
  isShowModal?: boolean;
  item?: MappingType;
  setShowModal: (open: boolean) => void;
  onSubmit: (item?: MappingType) => Promise<void>;
}) => {
  const leadSlice = useAppSelector(leadStore);

  const handleSubmitForm = async (formData: MappingType) => {
    await onSubmit({ ...item, ...formData });
    !leadSlice.error && setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <FormPopup
      transition
      defaultData={{ landing_page_url: item?.landing_page_url, product: item?.product?.id }}
      funcContentSchema={schema}
      title="Đường dẫn sản phẩm"
      buttonText={item ? vi.button.update : vi.button.create}
      funcContentRender={() => [
        {
          name: "product",
          label: "Sản phẩm",
          placeholder: "Sản phẩm",
          type: TYPE_FORM_FIELD.MULTIPLE_SELECT,
          options: filterIsShowOptions(leadSlice.attributes.product),
        },
        {
          name: "landing_page_url",
          label: "Đường dẫn",
          placeholder: "Đường dẫn",
          type: TYPE_FORM_FIELD.TEXTFIELD,
        },
      ]}
      handleClose={handleClose}
      handleSubmitPopup={handleSubmitForm}
      isOpen={isShowModal || false}
    />
  );
};

export default DomainProductModal;

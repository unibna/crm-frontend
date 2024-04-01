import { MappingType } from "./SpamListLandiMapping";
import { useAppSelector } from "hooks/reduxHook";
import { leadStore } from "store/redux/leads/slice";
import vi from "locales/vi.json";
import FormPopup from "components/Popups/FormPopup";
import { TYPE_FORM_FIELD } from "constants/index";
import { filterIsShowOptions } from "utils/selectOptionUtil";
import Yup from "yup";
import { useEffect, useState } from "react";
import { phoneLeadApi } from "_apis_/lead.api";
import useIsMountedRef from "hooks/useIsMountedRef";
import { AttributeType } from "_types_/AttributeType";

const schema = (yup: typeof Yup) => ({
  landingpage_url: yup.string().required("Vui lòng nhập đường dẫn").trim(),
  product_name: yup.string().required("Vui lòng nhập tên sản phẩm"),
});

const SpamListLandiModal = ({
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
  const [listTenant, setListTenant] = useState<AttributeType[]>([]);
  const isMounted = useIsMountedRef();

  const handleSubmitForm = async (formData: MappingType) => {
    await onSubmit({ ...item, ...formData });
    !leadSlice.error && setShowModal(false);
  };
  const getListTenant = async () => {
    const res = await phoneLeadApi.getListTanet<AttributeType>({});
    if (res.data) {
      const { results = [] } = res.data;
      setListTenant(results.map((item) => ({ ...item, is_show: true })));
    }
  };
  useEffect(() => {
    if (isMounted.current) {
      getListTenant();
    }
  }, [isMounted]);
  const handleClose = () => {
    setShowModal(false);
  };
  return (
    <FormPopup
      transition
      defaultData={{
        landingpage_url: item?.landingpage_url,
        product_name: item?.product_name,
        product_id: item?.product_id,
        tenant: item?.tenant.id,
      }}
      funcContentSchema={schema}
      title="Danh sách Link Landipage"
      buttonText={item ? vi.button.update : vi.button.create}
      funcContentRender={() => [
        {
          name: "product_name",
          label: "Tên Sản phẩm",
          placeholder: "Tên Sản phẩm",
          type: TYPE_FORM_FIELD.TEXTFIELD,
        },
        {
          name: "landingpage_url",
          label: "Đường dẫn",
          placeholder: "Đường dẫn",
          type: TYPE_FORM_FIELD.TEXTFIELD,
        },
        {
          name: "tenant",
          label: "tenant",
          placeholder: "Chọn Tenant",
          type: TYPE_FORM_FIELD.MULTIPLE_SELECT,
          options: filterIsShowOptions(listTenant),
        },
      ]}
      handleClose={handleClose}
      handleSubmitPopup={handleSubmitForm}
      isOpen={isShowModal || false}
    />
  );
};

export default SpamListLandiModal;

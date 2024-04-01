import { orderApi } from "_apis_/order.api";
import { ROLE_TAB, STATUS_ROLE_ATTRIBUTE } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import AttributeItem from "./AttributeItem";
import { TYPE_FORM_FIELD } from "constants/index";
import vi from "locales/vi.json";
import { isMatchRoles, isReadAndWriteRole } from "utils/roleUtils";
import { AttributeCollapseIncludeFormModal } from "components/Collapses";

type AttributeControllerType = {
  data: { id: number; name: string }[];
  loading: boolean;
  setData: React.Dispatch<
    React.SetStateAction<{ data: { id: number; name: string }[]; loading: boolean }>
  >;
  attributeName: string;
  title: string;
  isActiveSwitch?: boolean;
};

const AttributeController = ({
  data,
  setData,
  loading,
  attributeName,
  title,
  isActiveSwitch,
}: AttributeControllerType) => {
  const { user } = useAuth();

  const handleCreateAttribute = async ({ name, type }: { type: string; name: string }) => {
    setData((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.create<{ id: number; name: string }>({
      endpoint: `${attributeName}/`,
      params: { name },
    });
    if (result?.data) {
      setData((prev) => ({ ...prev, data: [result.data, ...prev.data] }));
    }
    setData((prev) => ({ ...prev, loading: false }));
  };

  const handleUpdateAttribute = async (att: {
    type: string;
    name?: string;
    id: number | string;
    index: number;
    isShow?: boolean;
  }) => {
    const { id, index, name, type, isShow } = att;
    setData((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.update<{ id: number; name: string }>({
      endpoint: `${attributeName}/${id}/`,
      params: { name, is_shown: isShow },
    });
    if (result?.data) {
      const newAttributes = [...data];
      newAttributes.splice(index, 1, result.data);
      setData((prev) => ({ ...prev, data: newAttributes }));
    }
    setData((prev) => ({ ...prev, loading: false }));
  };

  const handleDeleteAttribute = async (att: { id: number; name: string; type: string }) => {
    const { id } = att;

    const index = data.findIndex((item) => item.id === id);

    setData((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.remove<{ id: number; name: string }>({
      endpoint: `${attributeName}/${id}/`,
    });
    if (result) {
      const newAttributes = [...data];
      newAttributes.splice(index, 1);
      setData((prev) => ({ ...prev, data: newAttributes }));
    }
    setData((prev) => ({ ...prev, loading: false }));
  };

  const handleSwitchAction = async ({
    id,
    index,
    is_shown,
    type,
  }: {
    type: string;
    is_shown: boolean;
    id: number;
    index: number;
  }) => {
    setData((prev) => ({ ...prev, loading: true }));
    await handleUpdateAttribute({ type, isShow: is_shown, id, index });
    setData((prev) => ({ ...prev, loading: false }));
  };

  const attributeRole =
    user?.group_permission?.data?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.ORDER];

  return (
    <AttributeCollapseIncludeFormModal
      attributeItem={({ row }) => (
        <AttributeItem
          handleActiveSwitch={isActiveSwitch ? handleSwitchAction : undefined}
          row={row}
          type={attributeName}
        />
      )}
      funcContentRender={() => [
        {
          type: TYPE_FORM_FIELD.TEXTFIELD,
          name: attributeName,
          label: vi.attribute,
          placeholder: vi.attribute,
        },
      ]}
      isAdd={isMatchRoles(user?.is_superuser, attributeRole)}
      isEdit={isReadAndWriteRole(user?.is_superuser, attributeRole)}
      state={{ loading, error: false, type: null }}
      formDefaultData={(row) => ({ [attributeName]: row?.name || "" })}
      handleCreateAction={handleCreateAttribute}
      handleDeleteAction={handleDeleteAttribute}
      handleEditAction={handleUpdateAttribute}
      data={data}
      title={title}
      type={attributeName}
    />
  );
};

export default AttributeController;

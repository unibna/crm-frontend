import vi from "locales/vi.json";
import useAuth from "hooks/useAuth";
import { ROLE_TAB, STATUS_ROLE_ATTRIBUTE } from "constants/rolesTab";
import { useCallback, useContext, useEffect, useState } from "react";
import { CDPContext } from "../..";
import { useCancelToken } from "hooks/useCancelToken";
import { customerApi } from "_apis_/customer.api";
import produce from "immer";
import { ErrorName } from "_types_/ResponseApiType";
import { AttributeCollapseIncludeFormModal } from "components/Collapses";
import Typography from "@mui/material/Typography";
import { TYPE_FORM_FIELD } from "constants/index";
import { isMatchRoles, isReadAndWriteRole } from "utils/roleUtils";

const Tags = () => {
  const cdpContext = useContext(CDPContext);
  const { user } = useAuth();

  const [tags, setTags] = useState<{
    tags: { id: number; name: string }[];
    loading: boolean;
  }>({ loading: false, tags: [] });
  const { newCancelToken } = useCancelToken();

  const handleAddTag = async (att: { type: string; name: string }) => {
    const { name, type } = att;
    await addTag(name);
  };

  const handleUpdateTag = async (att: { type: string; name: string; id: number | string }) => {
    const { name, type, id } = att;
    await updateTag(id, name);
  };

  const handleDeleteTag = async (att: { id: number; name: string; type: string }) => {
    const { name, id } = att;

    await deleteTag(id);
  };
  const getListTags = useCallback(
    async (search?: string) => {
      setTags((prev) => ({ ...prev, loading: true }));
      const result = await customerApi.get<{ id: number; name: string }>({
        endpoint: "tags/",
        params: {
          limit: 1000,
          page: 1,
          search,
          cancelToken: newCancelToken(),
        },
      });
      if (result.data) {
        setTags((prev) => ({ tags: result.data.results, loading: false }));
      } else {
        if ((result?.error?.name as ErrorName) === "CANCEL_REQUEST") {
          return;
        }
        setTags((prev) => ({ ...prev, loading: false }));
      }
    },
    [newCancelToken]
  );

  const addTag = async (tag: string) => {
    cdpContext
      ? cdpContext?.setTags((prev) => ({ ...prev, loading: true }))
      : setTags((prev) => ({ ...prev, loading: true }));
    const result = await customerApi.create<{ id: number; name: string }>({
      params: { name: tag },
      endpoint: "tags/",
    });
    if (result.data) {
      const { id, name } = result.data;
      cdpContext
        ? cdpContext?.setTags((prev) => ({ tags: [{ id, name }, ...prev.tags], loading: false }))
        : setTags((prev) => ({ tags: [{ id, name }, ...prev.tags], loading: false }));
    } else {
      cdpContext
        ? cdpContext?.setTags((prev) => ({ ...prev, loading: false }))
        : setTags((prev) => ({ ...prev, loading: false }));
    }
  };

  const updateTag = async (id: number | string, tag: string) => {
    cdpContext
      ? cdpContext?.setTags((prev) => ({ ...prev, loading: true }))
      : setTags((prev) => ({ ...prev, loading: true }));

    const result = await customerApi.update<{ id: number; name: string }>({
      endpoint: `tags/${id}/`,
      params: { name: tag },
    });
    if (result.data) {
      const { id, name } = result.data;
      const filters = produce(tags.tags, (draft) => {
        const todo = draft.find((item) => item.id === id);
        if (todo) {
          todo.name = name;
        }
      });
      cdpContext
        ? cdpContext?.setTags((prev) => ({ tags: filters, loading: false }))
        : setTags((prev) => ({ tags: filters, loading: false }));
    } else {
      cdpContext
        ? cdpContext?.setTags((prev) => ({ ...prev, loading: false }))
        : setTags((prev) => ({ ...prev, loading: false }));
    }
  };

  const deleteTag = async (id: number) => {
    cdpContext
      ? cdpContext?.setTags((prev) => ({ ...prev, loading: true }))
      : setTags((prev) => ({ ...prev, loading: true }));

    const result = await customerApi.removeById({ endpoint: `tags/${id}/` });
    if (result.data) {
      const deletedTodosObj = tags.tags.filter((item) => item.id !== id);
      cdpContext
        ? cdpContext?.setTags((prev) => ({ tags: deletedTodosObj, loading: false }))
        : setTags((prev) => ({ tags: deletedTodosObj, loading: false }));
    } else {
      cdpContext
        ? cdpContext?.setTags((prev) => ({ ...prev, loading: false }))
        : setTags((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (cdpContext?.tags) {
      setTags(cdpContext.tags);
    } else {
      getListTags();
    }
  }, [cdpContext?.tags, getListTags]);

  const attributeRole =
    user?.group_permission?.data?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.CDP];

  return (
    <AttributeCollapseIncludeFormModal
      attributeItem={({ row }) => <Typography fontSize={14}>{row.name}</Typography>}
      funcContentRender={() => [
        {
          type: TYPE_FORM_FIELD.TEXTFIELD,
          name: "tags",
          label: vi.attribute,
          placeholder: vi.attribute,
        },
      ]}
      isAdd={isMatchRoles(user?.is_superuser, attributeRole)}
      isEdit={isReadAndWriteRole(user?.is_superuser, attributeRole)}
      state={{ loading: tags.loading || false, error: false, type: null }}
      formDefaultData={(row) => ({ tags: row?.name || "" })}
      handleCreateAction={handleAddTag}
      handleDeleteAction={handleDeleteTag}
      handleEditAction={handleUpdateTag}
      data={tags.tags || []}
      title={vi.customer_tag}
      type={"tags"}
    />
  );
};

export default Tags;

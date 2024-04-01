import { useCallback, useEffect, useState } from "react";
import { orderApi } from "_apis_/order.api";
import AttributeController from "./AttributeController";
import vi from "locales/vi.json";

const Tags = () => {
  const [tags, setTags] = useState<{ data: { id: number; name: string }[]; loading: boolean }>({
    data: [],
    loading: false,
  });

  const getTags = useCallback(async () => {
    setTags((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.get<{ id: number; name: string }>({
      endpoint: "tag/",
      params: { limit: 200, page: 1 },
    });
    if (result?.data) {
      setTags((prev) => ({ ...prev, data: result.data.results }));
    }
    setTags((prev) => ({ ...prev, loading: false }));
  }, []);

  useEffect(() => {
    getTags();
  }, [getTags]);

  return (
    <AttributeController
      data={tags.data}
      loading={tags.loading}
      setData={setTags}
      attributeName="tag"
      title={vi.tag}
      isActiveSwitch
    />
  );
};

export default Tags;

import { orderApi } from "_apis_/order.api";
import vi from "locales/vi.json";
import { useCallback, useEffect, useState } from "react";
import AttributeController from "./AttributeController";

const CancelReason = () => {
  const [cancelReasons, setCancelReasons] = useState<{
    data: { id: number; name: string }[];
    loading: boolean;
  }>({
    data: [],
    loading: false,
  });

  const getData = useCallback(async () => {
    setCancelReasons((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.get<{ id: number; name: string }>({
      endpoint: "cancel_reason/",
      params: { limit: 200, page: 1 },
    });
    if (result?.data) {
      setCancelReasons((prev) => ({ ...prev, data: result.data.results }));
    }
    setCancelReasons((prev) => ({ ...prev, loading: false }));
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <AttributeController
      data={cancelReasons.data}
      loading={cancelReasons.loading}
      setData={setCancelReasons}
      attributeName="cancel_reason"
      title={vi.order_cancel_reason}
    />
  );
};

export default CancelReason;

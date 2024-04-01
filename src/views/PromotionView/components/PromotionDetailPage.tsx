//components
import LoadingScreen from "components/Loadings/LoadingScreen";
import { Page } from "components/Page";
import PromotionDialog from "./PromotionDialog";

//hooks
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//apis
import { orderApi } from "_apis_/order.api";

//types
import { PromotionType } from "_types_/PromotionType";

const PromotionDetailPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [promotion, setPromotion] = useState<PromotionType>();
  const [loading, setLoading] = useState(false);

  const getPromotionByID = useCallback(async () => {
    setLoading(true);
    const resPromotion = await orderApi.getId({ endpoint: `promotion/${id}/` });
    if (resPromotion.data) {
      const result = resPromotion.data as any;
      setPromotion(result);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    id && getPromotionByID();
  }, [id, getPromotionByID]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Page title="Chi tiết khuyến mãi">
      <PromotionDialog
        onApplyChanges={() => navigate(-1)}
        open
        row={promotion}
        tabName={promotion?.status}
        isPage
      />
    </Page>
  );
};

export default PromotionDetailPage;

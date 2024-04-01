import { lazadaApi } from "_apis_/lazada.api";
import { shopeeApi } from "_apis_/shopee.api";
import { tiktokApi } from "_apis_/tiktok/tiktok_shop.api";
import { dispatch } from "store";
import { toastError } from "store/redux/toast/slice";
import { toSimplest } from "utils/stringsUtil";

/**
 * Synchronize order from marketplace
 * @param {string} id - The order ID
 * @param {string} sourceName - The source name of the marketplace
 * @param {string} ecommerceCode - The ecommerce code of the marketplace
 */
export const handleSyncOrderFromMarketplace = async ({
  sourceName,
  ecommerceCode,
}: {
  sourceName?: string;
  ecommerceCode?: string;
}) => {
  let isSyncSuccess: boolean = false;

  // sync line_item
  if (toSimplest(sourceName).includes("tiktok")) {
    const syncRes = await tiktokApi.create<boolean>(
      { order_id: ecommerceCode },
      "lead/sync_orders"
    );
    isSyncSuccess = !!syncRes.data;
  } else if (toSimplest(sourceName).includes("lazada")) {
    const syncRes = await lazadaApi.create<boolean>(
      { ecommerce_code: ecommerceCode },
      "connectors/lazada-order"
    );
    isSyncSuccess = !!syncRes.data;
  } else if (toSimplest(sourceName).includes("shopee")) {
    const syncRes = await shopeeApi.create<boolean>(
      { order_id: ecommerceCode },
      "lead/sync_orders"
    );
    isSyncSuccess = !!syncRes.data;
  }
  if (!isSyncSuccess) {
    dispatch(toastError({ message: "Đồng bộ đơn hàng thất bại" }));
  }
  return { isSyncSuccess };
};

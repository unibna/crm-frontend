import { AttributeVariant } from "_types_/ProductType";
import find from "lodash/find";
import map from "lodash/map";
import reduce from "lodash/reduce";
import sum from "lodash/sum";

/**
 * Function to calculate the number of products that cannot be confirmed due to insufficient inventory
 * @param {AttributeVariant[]} products - An array of product objects
 * @returns {number} - The number of products that cannot be confirmed
 */
export const handleCheckInventory = (products: AttributeVariant[]) => {
  let crossSaleValue = 0;
  let isCrossSale = false;
  let totalQuantity: {
    [key: string]: { quantity: number; name: string | undefined; inventory: number };
  } = {};

  const getDenyConfirmOrder = reduce(
    products,
    (prev, parentProduct: AttributeVariant) => {
      const {
        total_inventory: parentTotalInventory = 0,
        quantity: parentQuantity = 0,
        inventory_available,
        is_cross_sale,
        total = 0,
        id: parentID = "",
        name,
        bundle_variants,
      } = parentProduct;

      if (is_cross_sale) {
        crossSaleValue += total * parentQuantity;
        isCrossSale = true;
      }

      // tính tồn kho
      const totalInventoryForOrderConfirm =
        parentTotalInventory - (inventory_available?.quality_confirm || 0);

      // vì đơn cho tạo nhiều sp cùng ID nên check số lượng tất cả sp cùng ID
      // đối với đơn bundle thì không tính
      if (!bundle_variants?.length) {
        totalQuantity = {
          ...totalQuantity,
          [parentID]: {
            quantity: bundle_variants?.length
              ? 0
              : (totalQuantity[parentID]?.quantity || 0) + parentQuantity,
            name,
            // nếu sp này có số lượng tồn kho thì không cần lấy lại
            inventory: totalQuantity[parentID]?.inventory || totalInventoryForOrderConfirm,
          },
        };
      }

      // nếu tồn kho thì check tiếp
      const isDenyConfirm = bundle_variants?.length
        ? false
        : parentQuantity > totalInventoryForOrderConfirm;

      if (isDenyConfirm) {
        return [...prev, 1];
      } else {
        // kiểm tra tồn kho của gift_variant
        const sumGiftVariant = map(parentProduct.promotion?.gift_variants, (item) => {
          const { quantity: giftQuantity = 0, variant } = item;
          const { id: giftID = "" } = variant || {};

          const { total_inventory: giftTotalInventory = 0, inventory_available } =
            item.variant || {};
          const totalInventoryForOrderConfirm =
            giftTotalInventory -
            (inventory_available?.quality_confirm || 0) -
            // trừ số lượng của sp cha nếu cùng SKU_code
            (parentProduct.SKU_code === item.variant?.SKU_code ? parentQuantity : 0);

          // check kho với sp khuyến mãi
          totalQuantity = {
            ...totalQuantity,
            [giftID]: {
              quantity: (totalQuantity[giftID]?.quantity || 0) + giftQuantity,
              name,
              // nếu sp này có số lượng tồn kho thì không cần lấy lại
              inventory: totalQuantity[giftID]?.inventory || totalInventoryForOrderConfirm,
            },
          };

          return giftQuantity > totalInventoryForOrderConfirm ? 1 : 0;
        });
        // kiểm tra tồn kho bundle_variants
        const sumBundleVariant = map(bundle_variants, (item) => {
          // lấy số lượng của bundle tính cho bundle_variant
          const {
            total_inventory = 0,
            inventory_available,
            SKU_code: bundle_SKU_code,
            id: bundleID = "",
          } = item.variant || {};

          const bundleQuantity = item.bundle_item_quantity || item.quantity || 0;

          // kiểm tra số lượng của bundle_variant với số lượng của promotion_variants
          // tìm những bundle_variant có cùng SKU_code với promotion_variant
          const matchVariant = parentProduct.promotion?.gift_variants?.find(
            (item) => item.variant?.SKU_code === bundle_SKU_code
          );

          const totalInventoryForOrderConfirm =
            total_inventory -
            (inventory_available?.quality_confirm || 0) -
            // nếu matchVariant tồn tại, trừ số lượng của the promotion_variant
            (matchVariant ? matchVariant?.quantity || 0 : 0);

          // check kho với sp khuyến mãi
          totalQuantity = {
            ...totalQuantity,
            [bundleID]: {
              quantity: (totalQuantity[bundleID]?.quantity || 0) + bundleQuantity,
              name,
              // nếu sp này có số lượng tồn kho thì không cần lấy lại
              inventory: totalQuantity[bundleID]?.inventory || totalInventoryForOrderConfirm,
            },
          };

          // nếu số lượng của bundle_variant * sl của sp cha mà > sl kho, thì cảnh báo và không cho xác nhận đơn
          return bundleQuantity > totalInventoryForOrderConfirm ? 1 : 0;
        });
        return [sum(sumGiftVariant), sum(sumBundleVariant), ...prev];
      }
    },
    []
  );

  // tìm sản phẩm có số lượng vượt tồn kho
  const productOverInventory = find(
    Object.keys(totalQuantity),
    (item) => totalQuantity[item].quantity > totalQuantity[item].inventory
  );

  return {
    isDenyConfirm: productOverInventory ? true : !!sum(getDenyConfirmOrder),
    crossSaleValue,
    isCrossSale,
    totalQuantity,
  };
};

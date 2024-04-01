//components
import FormDialog from "components/Dialogs/FormDialog";
import { ProductItem } from "components/ProductComponent";

//hooks
import React, { FC, useEffect, useState } from "react";
import useIsMountedRef from "hooks/useIsMountedRef";

//utils
import map from "lodash/map";

//types
import Typography from "@mui/material/Typography";
import { AttributeVariant } from "_types_/ProductType";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  lineItems: any[];
  loading?: boolean;
  totalQuantity: {
    [key: string]: { quantity: number; name: string | undefined; inventory: number };
  };
  isDenyConfirm?: boolean;
}

const ConfirmVariantModal: FC<Props> = ({
  open,
  setOpen,
  lineItems,
  onSubmit,
  loading,
  totalQuantity,
  isDenyConfirm,
}) => {
  const isMounted = useIsMountedRef();
  const [variantSummary, setVariantSummary] = useState<{ [key: string]: AttributeVariant }>({});

  useEffect(() => {
    if (open) {
      let variants: { [key: string]: AttributeVariant } = {};

      map(lineItems, (item) => {
        variants[item.id] = {
          ...item,
          quantity: (variants[item.id]?.quantity || 0) + item.quantity,
        };
        map(item.promotion?.gift_variants, (giftItem) => {
          variants[giftItem.variant.id] = {
            ...giftItem.variant,
            quantity: (variants[giftItem.variant.id]?.quantity || 0) + giftItem.quantity,
          };
        });
      });
      isMounted.current && setVariantSummary(variants);
    }
  }, [open, isMounted, lineItems]);

  return (
    <FormDialog
      maxWidth={"md"}
      buttonText={"Xác nhận"}
      title={"Xác nhận sản phẩm"}
      open={open}
      onSubmit={onSubmit}
      onClose={() => setOpen(false)}
      isLoadingButton={loading}
    >
      {isDenyConfirm ? (
        <Typography color="warning.main" fontSize={14}>
          KHÔNG THỂ XÁC NHẬN ĐƠN
        </Typography>
      ) : null}
      {map(Object.keys(totalQuantity), (item, index) => {
        return totalQuantity[item].quantity > totalQuantity[item].inventory ? (
          <Typography key={index} fontSize={13}>
            {`Sản phẩm: ${totalQuantity[item].name} có số lượng`}
            <Typography
              fontSize={13}
              component="span"
              color="warning.main"
            >{` ${totalQuantity[item].quantity}`}</Typography>
            <Typography
              fontSize={13}
              component="span"
            >{` vượt quá tồn kho ${totalQuantity[item].inventory}`}</Typography>
          </Typography>
        ) : null;
      })}
      {map(Object.keys(variantSummary), (item, index) => {
        return (
          <ProductItem
            key={index}
            product={variantSummary[item]}
            index={index}
            isShowPromotion={false}
            hiddenColumns={["price", "total", "cross_sale", "listed_price"]}
            isShowBundle={false}
          />
        );
      })}
    </FormDialog>
  );
};

export default ConfirmVariantModal;

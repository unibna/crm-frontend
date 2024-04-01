//hooks
import { memo } from "react";

//types
import { DGridType } from "_types_/DGridType";
import { SortType } from "_types_/SortType";

//components
import TableWrapper from "components/Tables/TableWrapper";
import CommasColumn from "./columns/CommasColumn";
import DiscountMethodColumn from "./columns/DiscountMethodColumn";
import PromotionCreateColumn from "./columns/PromotionCreateColumn";
import PromotionNameColumn from "./columns/PromotionNameColumn";
import PromotionNoteColumn from "./columns/PromotionNoteColumn";
import PromotionProductColumn from "./columns/PromotionProductColumn";
import PromotionRangeExpiry from "./columns/PromotionRangeExpiry";
import PromotionRequirementColumn from "./columns/PromotionRequirementColumn";
import PromotionStatusColumn from "./columns/PromotionStatusColumn";
import PromotionValueColumn from "./columns/PromotionValueColumn";

interface Props extends Partial<DGridType> {
  handleSorting?: (value: SortType[]) => void;
  isReport?: boolean;
  totalRow?: any;
  updateHandleByDisabled?: boolean;
  formPopup?: (contentProps: {
    row: any;
    onChange: ({ name, value }: { name: string; value: any }) => void;
    onApplyChanges: () => void;
    onCancelChanges: () => void;
    open: boolean;
  }) => JSX.Element;
  onRefresh?: () => void;
}
const PromotionTable = (props: Props) => {
  return (
    <TableWrapper {...props}>
      <PromotionNameColumn for={["name"]} />
      <PromotionRangeExpiry for={["date_start", "date_end"]} />
      <PromotionRequirementColumn for={["requirements"]} />
      <CommasColumn for={["discount_amount"]} />
      <DiscountMethodColumn for={["discount_method"]} />
      <PromotionProductColumn for={["applied_variant"]} />
      <PromotionValueColumn for={["value"]} />
      <PromotionNoteColumn for={["note"]} />
      <PromotionCreateColumn for={["created"]} />
      <PromotionStatusColumn for={["status"]} />
    </TableWrapper>
  );
};

export default memo(PromotionTable);

import useReselect from "hooks/useReselect";
import { AttributesState } from "store/redux/attributes/slice";

export const getAllAttributesShipping = useReselect(
  (state: AttributesState) => state.shipping,
  (list) => list
);

export const getAllAttributesWarehouse = useReselect(
  (state: AttributesState) => state.warehouse,
  (list) => list
);

export const getAllAttributesProduct = useReselect(
  (state: AttributesState) => state.product,
  (list) => list
);

export const getAllAttributesManageFile = useReselect(
  (state: AttributesState) => state.manageFile,
  (list) => list
);

export const getAllAttributesCskh = useReselect(
  (state: AttributesState) => state.cskh,
  (list) => list
);

export const getAllAttributesTransporationCare = useReselect(
  (state: AttributesState) => state.transportationCare,
  (list) => list
);

export const getAllAttributesSetting = useReselect(
  (state: AttributesState) => state.setting,
  (list) => list
);

export const getAllKeyMapReport = useReselect(
  (state: AttributesState) => state.keyMapReport,
  (list) => list
);

export const getAllAttributesDataFlow = useReselect(
  (state: AttributesState) => state.dataFlow,
  (list) => list
);

export const getAllFilterContentId = useReselect(
  (state: AttributesState) => state.content_id,
  (list) => list
);

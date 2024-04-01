import useReselect from "hooks/useReselect";
import { AirtableState } from "store/redux/airtable/slice";

export const getAirtable = useReselect(
  (state: AirtableState) => state.cskh,
  (state: AirtableState) => state.params,
  (cskh, params) => ({ cskh, params })
)
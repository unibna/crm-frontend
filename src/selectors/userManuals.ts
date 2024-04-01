import useReselect from "hooks/useReselect";
import { UserManualState } from "store/redux/usermanuals/slice";

export const getDataUserManuals = useReselect(
  (state: UserManualState) => state,
  (state) => state
);

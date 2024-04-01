import useReselect from "hooks/useReselect";
import { RoleState } from "store/redux/roles/slice";

export const getAllRoles = useReselect(
  (state: RoleState) => state.roles,
  (list) => list
);


export const getOptionRole = useReselect(
  (state: RoleState) => state.optionRole,
  (list) => list
);

export const getListRoles = useReselect(
  (state: RoleState) => state.listRoles,
  (list) => list
);
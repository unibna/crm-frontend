import useReselect from "hooks/useReselect";
import { UserState } from "store/redux/users/slice";

export const getAllUsers = useReselect(
  (state: UserState) => state.users,
  users => users
)

export const getAllUsersGroup = useReselect(
  (state: UserState) => state.usersGroup,
  users => users
)


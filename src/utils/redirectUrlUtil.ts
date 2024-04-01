import { ROLE_RENDER } from "constants/roleOptions";
import find from "lodash/find";
import map from "lodash/map";
import { PATH_DASHBOARD } from "routes/paths";
import { UserType } from "_types_/UserType";
import { isMatchRoles } from "./roleUtils";

export const redirectByPermission = (user: Partial<UserType> | null, keyRole: string) => {
  const objRoleRender: any = find(ROLE_RENDER, (item) => item.name === keyRole);

  const arrCheck = map(objRoleRender.roles, (item) => ({
    isRole: isMatchRoles(user?.is_superuser,user?.group_permission?.data?.[objRoleRender.name]?.[item.name]),
    endpoint: PATH_DASHBOARD[objRoleRender.name][item.name],
  }));

  return `/${
    find(arrCheck, (item: { isRole: boolean; endpoint: string }) => item.isRole)?.endpoint
  }`;
};

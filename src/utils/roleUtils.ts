import { ROLE_OPTION, ROLE_TYPE } from "constants/rolesTab";
import isArray from "lodash/isArray";
import some from "lodash/some";
import isPlainObject from "lodash/isPlainObject";
import isString from "lodash/isString";

/* nhận string - mãng string - object */
export const isMatchRoles = (isSuperuser: boolean = false, tabs: any = {}) => {
  if (isSuperuser) {
    return true;
  }

  switch (true) {
    case isString(tabs): {
      return [ROLE_OPTION.READ, ROLE_OPTION.READ_AND_WRITE].includes(tabs);
    }
    case isArray(tabs): {
      return some(tabs, (item: ROLE_TYPE) =>
        [ROLE_OPTION.READ, ROLE_OPTION.READ_AND_WRITE].includes(item)
      );
    }
    case isPlainObject(tabs): {
      return some(Object.values(tabs), (item: ROLE_TYPE) =>
        [ROLE_OPTION.READ, ROLE_OPTION.READ_AND_WRITE].includes(item)
      );
    }
    default:
      return false;
  }
};

export const isReadAndWriteRole = (isSuperuser: boolean = false, role?: ROLE_TYPE) =>
  isSuperuser || role === "READ_AND_WRITE";

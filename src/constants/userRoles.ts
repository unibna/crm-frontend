export const USER_ROLES = {
  ROLE_GUEST: "0",
  ROLE_ADMIN: "1",
  ROLE_SALES: "2",
  ROLE_LEADER_SALES: "3",
  ROLE_MARKETING: "4",
  ROLE_CONTENT: "5",
  ROLE_MARKETING_CLBT: "6",
  ROLE_QA: "7",
};

export const USER_ROLE_CODES = {
  ROLE_SALES: "telesale",
};

export const LABEL_ROLE = {
  ADMIN: "Admin",
};

export type TypeRoleFunc = "see" | "mutation" | null;

export interface LeadFuncType {
  handle_by: TypeRoleFunc;
  data_status: TypeRoleFunc;
  handle: TypeRoleFunc;
  report: TypeRoleFunc;
  attributes: TypeRoleFunc;
  accounts: TypeRoleFunc;
}

export interface AppFuncType {
  lead: LeadFuncType | null;
  cdp: { handle: TypeRoleFunc } | null;
  setting: { handle: TypeRoleFunc } | null;
}

export interface FuncAppByRoleType {
  [key: string]: AppFuncType;
}

export const APP_FUNC_NONE_ROLE: AppFuncType = {
  cdp: null,
  lead: null,
  setting: null,
};

export const APP_FUNC_ADMIN_ROLE: AppFuncType = {
  cdp: { handle: "mutation" },
  lead: {
    handle_by: "mutation",
    data_status: "mutation",
    handle: "mutation",
    accounts: "mutation",
    attributes: "mutation",
    report: "mutation",
  },
  setting: { handle: "mutation" },
};

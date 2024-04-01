// Libraries
import { useCallback, createContext, ReactNode, useEffect, useReducer } from "react";

// Services
import { authApi } from "_apis_/auth.api";

// Store & Hooks
import { useAppDispatch } from "hooks/reduxHook";
import { getPhoneLeadAttribute } from "store/redux/leads/attributes/actions";
import { getAllUserAction } from "store/redux/users/action";
import { getAllUsersGroup, getRolesAction } from "store/redux/roles/slice";
import {
  getListAttributesSkytable,
  getListAttributesWarehouse,
  getListAttributesShipping,
  getListOption,
  getListTags,
  getListVariantAttributes,
  getListWarehouse,
  getListKeyMapReport,
  getListAttributesDataFlow,
  getListFilterOption,
  getListFacebookFanpage,
  getListCustomer,
  getListAttribute,
  getListRule,
  getListAdAccount,
} from "store/redux/attributes/slice";

// Types
import { ActionMap, AuthState, JWTContextType } from "_types_/AuthenticationType";
import { UserType } from "_types_/UserType";

// Constants & Utils
import { deleteAllStorages, getStorage, setStorage } from "utils/asyncStorageUtil";
import { isMatchRoles } from "utils/roleUtils";
import { ROLE_TAB, STATUS_ROLE_SETTINGS } from "constants/rolesTab";

// ----------------------------------------------------------------------

enum Types {
  Initial = "INITIALIZE",
  Login = "LOGIN",
  Update_Profile = "UPDATE_PROFILE",
  Logout = "LOGOUT",
  Register = "REGISTER",
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: Partial<UserType> | null;
  };
  [Types.Login]: {
    user: Partial<UserType> | null;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: Partial<UserType> | null;
  };
  [Types.Update_Profile]: {
    user: Partial<UserType> | null;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case "INITIALIZE":
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  const dispatchStore = useAppDispatch();

  useEffect(() => {
    initialize();
  }, []);

  const getUsers = useCallback(async () => {
    dispatchStore(getAllUserAction());
  }, [dispatchStore]);

  const getToken = async () => {
    const refreshToken = getStorage("refresh-token");
    if (refreshToken) {
      const result = await authApi.refreshToken({ refresh: refreshToken });
      if (result.data) {
        const { access, refresh } = result.data;
        setStorage("access-token", access);
        setStorage("refresh-token", refresh);
        if (access) {
          getProfile();
        } else logout();
      } else {
        logout();
      }
    } else logout();
  };

  const permissionCallApi = async (data: Partial<UserType>) => {
    getUsers();

    if (
      isMatchRoles(data?.is_superuser, data?.group_permission?.data?.[ROLE_TAB.LEAD]) ||
      isMatchRoles(data?.is_superuser, data?.group_permission?.data?.[ROLE_TAB.SHIPPING]) ||
      isMatchRoles(data?.is_superuser, data?.group_permission?.data?.[ROLE_TAB.ORDERS]) ||
      isMatchRoles(data?.is_superuser, data?.group_permission?.data?.[ROLE_TAB.TRANSPORTATION])
    ) {
      await getPhoneLeadAttribute();
    }

    if (
      isMatchRoles(
        data?.is_superuser,
        data.group_permission?.data?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.ROLE]
      )
    ) {
      getRolesAction();
    }

    if (isMatchRoles(data?.is_superuser, data.group_permission?.data?.[ROLE_TAB.WAREHOUSE])) {
      getListWarehouse();
      getListAttributesWarehouse();
    }

    if (isMatchRoles(data?.is_superuser, data.group_permission?.data?.[ROLE_TAB.SHIPPING])) {
      getListAttributesShipping();
    }

    if (isMatchRoles(data?.is_superuser, data.group_permission?.data?.[ROLE_TAB.PRODUCT])) {
      getListTags();
      getListOption();
      getListVariantAttributes();
    }

    if (isMatchRoles(data?.is_superuser, data.group_permission?.data?.[ROLE_TAB.MANAGE_FILE])) {
      getAllUsersGroup();
    }

    if (isMatchRoles(data?.is_superuser, data.group_permission?.data?.[ROLE_TAB.CSKH])) {
      getListAttributesSkytable();
    }

    if (
      isMatchRoles(data?.is_superuser, data.group_permission?.data?.[ROLE_TAB.DASHBOARD]) ||
      isMatchRoles(data?.is_superuser, data.group_permission?.data?.[ROLE_TAB.MKT_DASHBOARD])
    ) {
      getListKeyMapReport();
    }

    if (isMatchRoles(data?.is_superuser, data.group_permission?.data?.[ROLE_TAB.DATA_FLOW])) {
      getListAttributesDataFlow();
    }

    if (
      isMatchRoles(data?.is_superuser, data.group_permission?.data?.[ROLE_TAB.DATA_FLOW]) ||
      isMatchRoles(data?.is_superuser, data.group_permission?.data?.[ROLE_TAB.CONTENT_ID]) ||
      isMatchRoles(data?.is_superuser, data.group_permission?.data?.[ROLE_TAB.CONTENT_DAILY])
    ) {
      getListFilterOption();
      getListFacebookFanpage();
      getListCustomer();
      getListAttribute();
      getListRule();
      getListAdAccount();
    }
  };

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await authApi.login({ email, password });
      const { data } = response;
      if (data) {
        setStorage("access-token", data.access);
        setStorage("refresh-token", data.refresh);
        const profile = await authApi.getProfile();
        if (profile.data) {
          await permissionCallApi(profile.data);

          dispatch({
            type: Types.Login,
            payload: {
              user: profile?.data,
            },
          });
        }
      }
    } catch (error) {
      Promise.reject(error);
    }
  };

  const logout = async () => {
    deleteAllStorages();
    // deleteStorage("access-token");
    // deleteStorage("refresh-token");
    dispatch({ type: Types.Logout });
  };

  const updateProfile = (user: Partial<UserType>) => {
    dispatch({
      type: Types.Update_Profile,
      payload: {
        user: {
          ...state.user,
          ...user,
        },
      },
    });
  };

  const getProfile = async () => {
    {
      const profileRes = await authApi.getProfile();
      const { data } = profileRes;
      if (data) {
        await permissionCallApi(data);

        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: true,
            user: data,
          },
        });
      } else {
        getToken();
      }
    }
  };

  const initialize = async () => {
    try {
      const accessToken = getStorage("access-token");
      dispatch({
        type: Types.Initial,
        payload: {
          isAuthenticated: true,
          user: null,
        },
      });

      if (accessToken) {
        getProfile();
      } else {
        logout();
      }
    } catch (err) {
      dispatch({
        type: Types.Initial,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        login,
        logout,
        updateProfile,
        initialize,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

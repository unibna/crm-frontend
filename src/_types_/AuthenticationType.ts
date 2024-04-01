import { UserType } from "./UserType";

// ----------------------------------------------------------------------

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: Partial<UserType> | null;
};

export type JWTContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: Partial<UserType> | null;
  method: "jwt";
  login: ({ email, password }: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (user: Partial<UserType>) => void;
  initialize: () => void;
};

export type AWSCognitoContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: Partial<UserType> | null;
  method: "cognito";
  login: ({ email, password }: { email: string; password: string }) => Promise<unknown>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<unknown>;
  logout: VoidFunction;
  updateProfile: VoidFunction;
};

export type Auth0ContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: Partial<UserType> | null;
  method: "auth0";
  login: () => Promise<void>;
  logout: VoidFunction;
  updateProfile: VoidFunction;
};

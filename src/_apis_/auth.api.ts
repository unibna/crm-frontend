import { APIConfig } from "_apis_";
import { UserType } from "_types_/UserType";

const endPoint = "/api";
const baseUrl = import.meta.env.REACT_APP_API_URL + endPoint;

const login = async (loginForm: { password: string; email: string }) => {
  try {
    const result = await APIConfig(baseUrl).post<{
      access: string;
      refresh: string;
    }>("/users/token/", loginForm);
    return result;
  } catch (error: any) {
    return error;
  }
};

const getProfile = async () => {
  try {
    const result = await APIConfig(baseUrl).get<Partial<UserType>>("/users/me/");
    return {
      data: result.data,
      message: result.statusText,
    };
  } catch (error) {
    return {
      message: "Không tìm thấy thông tin!",
      data: null,
    };
  }
};

const refreshToken = async ({ refresh }: { refresh: string }) => {
  try {
    const result = await APIConfig(baseUrl).post<{
      access: string;
      refresh: string;
    }>("/users/refresh/", { refresh });
    return result;
  } catch (error: any) {
    return error;
  }
};

export const authApi = {
  login,
  getProfile,
  refreshToken,
};

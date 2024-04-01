import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { store } from "store";
import { CancelRequest, NetworkError, ServerError, ValidationError } from "_types_/ResponseApiType";
import { deleteAllStorages, deleteStorage, getStorage, setStorage } from "utils/asyncStorageUtil";
import { toastError, toastWarning } from "store/redux/toast/slice";
import { RESPONSE_MESSAGES } from "assets/messages/response.messages";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import { handleResponseErrorMessage } from "utils/handleError";
import vi from "locales/vi.json";

let service: AxiosInstance;
let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// API Config
export const APIConfigNoToken = (baseUrl?: string) => {
  service = axios.create({
    baseURL: baseUrl ? baseUrl : import.meta.env.REACT_APP_API_URL + "/api",
    responseType: "json",
  });
  service.interceptors.response.use(handleSuccess, handleError);
  return service;
};

export const getAuthorizationHeaderFormData = () => {
  const headers = {
    Authorization: `Bearer ${getStorage("access-token")}`,
    // Accept: "text/plain, */*",
    "Content-Type": "multipart/form-data",
  };
  return headers;
};

export const APIConfig = (baseUrl?: string, config?: AxiosRequestConfig | undefined) => {
  service = axios.create({
    baseURL: baseUrl ? baseUrl : import.meta.env.REACT_APP_API_URL + "/api",
    responseType: "json",
    ...config,
    headers: {
      Authorization: `Bearer ${getStorage("access-token")}`,
      // Accept: "text/plain, */*",
      ...config?.headers,
    },
  });
  service.interceptors.response.use(handleSuccess, handleError);
  return service;
};

function awaitSaveStorage({ access, refresh }: { access: string; refresh: string }) {
  return new Promise((resolve) => {
    setStorage("access-token", access);
    setStorage("refresh-token", refresh);
    setTimeout(() => {
      resolve(vi.save_storage);
    }, 100);
  });
}

const refreshToken = (err: any) => {
  let originalRequest = err.config;
  if (isRefreshing) {
    return new Promise(function (resolve, reject) {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        originalRequest.headers["Authorization"] = "Bearer " + token;
        return axios(originalRequest);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  return new Promise(function (resolve, reject) {
    const refreshToken = getStorage("refresh-token");
    if (refreshToken) {
      isRefreshing = true;
      const newService = axios.create({
        baseURL: import.meta.env.REACT_APP_API_URL,
        responseType: "json",
      });
      return newService
        .post("/api/users/refresh/", {
          refresh: refreshToken,
          client: "react-app",
        })
        .then(async ({ data }) => {
          const { access, refresh } = data;

          await awaitSaveStorage({ access, refresh });

          service.defaults.headers["Authorization"] = `Bearer ${access}`;
          originalRequest.headers["Authorization"] = "Bearer " + access;
          processQueue(null, access);
          resolve(axios(originalRequest));
        })
        .catch((err) => {
          processQueue(err, null);
          if (document.location.pathname !== "/login") {
            resetStore();
          }
          reject(err);
        })
        .then(() => {
          isRefreshing = false;
        });
    } else {
      if (err.config.url === "/users/token/") {
        store.dispatch(
          toastError({
            message: VALIDATION_MESSAGE.CHECK_INFO_PLEASE,
          })
        );
      }
      reject(err);
      return;
    }
  });
};

const resetStore = () => {
  store.dispatch(toastWarning({ message: RESPONSE_MESSAGES.END_SESSION }));
  deleteAllStorages();
  // deleteStorage("access-token");
  // deleteStorage("refresh-token");
  redirectTo(document, "/login");
};

const handleError = (error: any) => {
  if (!error) {
    return Promise.reject(new CancelRequest(error));
  } else if (error.message === RESPONSE_MESSAGES.NETWORK_ERROR) {
    store.dispatch(
      toastError({
        message: RESPONSE_MESSAGES.ERROR_CONNECTION_SERVER,
      })
    );
    return Promise.reject(new ServerError(RESPONSE_MESSAGES.ERROR_CONNECTION_SERVER));
  } else if (!error?.response) {
    if (axios.isCancel(error)) {
      return Promise.reject(new CancelRequest(error));
    }
    return Promise.reject(new NetworkError(error));
  }

  const { status } = error.response;
  switch (status) {
    case 401: {
      //  1. Logout user if token refresh didn't work or user is disabled
      if (error.config.url === "/users/refresh/") {
        return resetStore();
      }
      // 2. Try request again with new token
      return refreshToken(error);
    }
    case 429: {
      store.dispatch(
        toastWarning({
          message: "Hệ thống hạn chế hành động này trong 5 phút. Xin thực hiện lại sau!",
        })
      );
      return Promise.reject(
        new ValidationError("Hệ thống hạn chế hành động này trong 5 phút. Xin thực hiện lại sau!")
      );
    }
    case 500:
    case 502:
    case 503:
    case 504: {
      store.dispatch(
        toastError({
          message: RESPONSE_MESSAGES.ERROR_CONNECTION_SERVER,
        })
      );
      return Promise.reject(new ServerError(RESPONSE_MESSAGES.ERROR_CONNECTION_SERVER));
    }
    default: {
      // switch (method) {
      //   case "post":
      //     store.dispatch(toastError({ message: RESPONSE_MESSAGES.CREATE_ERROR }));
      //     break;
      //   case "put":
      //   case "patch":
      //     store.dispatch(toastError({ message: RESPONSE_MESSAGES.UPDATE_ERROR }));
      //     break;
      //   case "delete":
      //     store.dispatch(toastError({ message: RESPONSE_MESSAGES.DELETE_ERROR }));
      //     break;
      //   default:
      //     break;
      // }
      const errorMessage = handleResponseErrorMessage(error?.response?.data);
      store.dispatch(toastError({ message: errorMessage, duration: 3000 }));

      return Promise.reject(error);
    }
  }
};

const handleSuccess = (response: any) => {
  const method = response?.config?.method;
  switch (method) {
    case "post":
      // store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.CREATE_SUCCESS }));
      break;
    case "put":
    case "patch":
      // store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.UPDATE_SUCCESS }));
      break;
    case "delete":
      // store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.DELETE_SUCCESS }));
      break;
    default:
      break;
  }
  return response;
};

const redirectTo = (document: any, path: string) => {
  document.location.href = path;
};

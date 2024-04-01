import { APIConfig, getAuthorizationHeaderFormData } from "_apis_";

export const uploadFile = async <T>({
  file,
  baseUrl,
  endpoint,
  name,
}: {
  file: File | Blob;
  baseUrl: string;
  endpoint: string;
  name: string;
}) => {
  try {
    const formData = new FormData();
    formData.append(name, file);
    const headers = getAuthorizationHeaderFormData();
    const result = await APIConfig(baseUrl).post<T>(endpoint, formData, {
      headers,
    });
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};
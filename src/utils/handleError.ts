export const handleResponseErrorMessage = (errors: any) => {
  if (Array.isArray(errors)) {
    return handleArrayError(errors);
  } else if (typeof errors === "object") {
    return handleObjectError(errors);
  }
  return "Lỗi không xác định";
};

const handleObjectError = (error: { message?: string }): string => {
  if (error.message) {
    return error.message;
  }
  const firstError: object | string | number = error[Object.keys(error)[0]];
  if (typeof firstError === "object") {
    return handleArrayError(firstError);
  }
  return firstError?.toString();
};

const handleArrayError = (error: any): string => {
  const firstError: object | string | number = error[0];
  if (typeof firstError === "object") {
    return handleObjectError(firstError);
  }
  return firstError?.toString();
};

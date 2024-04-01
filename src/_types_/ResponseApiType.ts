export interface MultiResponseType<T> {
  next?: string | null;
  previous?: string | null;
  count?: number;
  results: T[];
  total?: any;
  data?: T[];
}

export interface BaseResponseType<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface ErrorResponseType<T = any> {
  message?: string;
  data: null;
  status?: number;
  name?: T;
}

export const successResManyData = <T>(data: { items: T[]; total: number }) => {
  return { items: data.items, total: data.total };
};

export type ErrorName = "NETWORK_ERROR" | "SERVER_ERROR" | "VALIDATION_ERROR" | "CANCEL_REQUEST";

export const NETWORK_ERROR = "NETWORK_ERROR";
export const SERVER_ERROR = "SERVER_ERROR";
export const VALIDATION_ERROR = "VALIDATION_ERROR";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VALIDATION_ERROR";
  }
}

export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SERVER_ERROR";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NETWORK_ERROR";
  }
}

export class CancelRequest extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CANCEL_REQUEST";
  }
}

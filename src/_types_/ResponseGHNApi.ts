export interface GHNMultiResponseType<T> {
    code: number;
    data: T[];
    message: string;
}

export interface GHNBaseResponseType<T> {
    data: T;
}

export interface GHNErrorResponseType {
    code?: number;
    data: null;
    message?: string;
}
export interface GHNResponseType<T> {
    data: T;
    message: string;
    status?: number;
}

import { createSlice } from "@reduxjs/toolkit";
import { VariantNotificationType } from "contexts/ToastContext";
import { WritableDraft } from "immer/dist/types/types-external";
import { Renderable, ValueOrFunction } from "react-hot-toast";
import { RootState } from "store";

export interface ToastState {
  message: string;
  variant: VariantNotificationType;
  duration?: number;
  date: number;
  promise?: {
    promise: Promise<void>;
    loading: Renderable;
    success: ValueOrFunction<Renderable, any>;
    error: ValueOrFunction<Renderable, any>;
  };
}

const initialState: ToastState = {
  message: "",
  variant: null,
  date: new Date().getTime(),
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  // The reducers field lets us define reducers and generate associated actions
  reducers: {
    toastSuccess: (state: WritableDraft<ToastState>, action: any) => {
      const { message, duration = 2000 } = action.payload;
      state.message = message;
      state.duration = duration;
      state.variant = "success";
      state.date = new Date().getTime();
    },
    toastError: (state: WritableDraft<ToastState>, action: any) => {
      const { message, duration = 2000 } = action.payload;
      state.message = message;
      state.duration = duration;
      state.variant = "error";
      state.date = new Date().getTime();
    },
    toastWarning: (state: WritableDraft<ToastState>, action: any) => {
      const { message, duration = 2000 } = action.payload;
      state.message = message;
      state.duration = duration;
      state.variant = "warning";
      state.date = new Date().getTime();
    },
    toastInfo: (state: WritableDraft<ToastState>, action: any) => {
      const { message, duration = 2000 } = action.payload;
      state.message = message;
      state.duration = duration;
      state.variant = "info";
      state.date = new Date().getTime();
    },
    toastPromise: (state: WritableDraft<ToastState>, action: any) => {
      const { promise } = action.payload;
      state.message = "promise";
      state.duration = 2000;
      state.variant = "promise";
      state.promise = promise;
      state.date = new Date().getTime();
    },
    resetToast: (state: WritableDraft<ToastState>) => {
      state.message = "";
      state.variant = null;
    },
  },
});
export const { resetToast, toastError, toastInfo, toastSuccess, toastWarning, toastPromise } =
  toastSlice.actions;
export const toastStore = (state: RootState) => state.toasts;
export default toastSlice.reducer;

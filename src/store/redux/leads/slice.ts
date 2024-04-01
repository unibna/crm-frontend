import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";
import { PhoneLeadAttributeType } from "_types_/PhoneLeadType";
import { leadAttributeMutations } from "./attributes/mutations";

export interface PhoneLeadState {
  attributes: PhoneLeadAttributeType;
  loading: boolean;
  error: boolean;
  type: keyof PhoneLeadAttributeType | null;
}

const initialState: PhoneLeadState = {
  attributes: {
    fanpage: [],
    fail_reason: [],
    handle_reason: [],
    channel: [],
    product: [],
    data_status: [],
    bad_data_reason: [],
    tag: [],
  },
  loading: false,
  error: false,
  type: null,
};

export const phoneLeadSlice = createSlice({
  name: "leads",
  initialState,
  // The reducers field lets us define reducers and generate associated actions
  reducers: {
    ...leadAttributeMutations,
  },
});

export const leadStore = (state: RootState) => state.leads;
export default phoneLeadSlice.reducer;
export const {
  createdAttSuccess,
  deletedAttSuccess,
  getAttSuccess,
  updatedAttSuccess,
  createAttFailed,
  deleteAttFailed,
  deleteAttStart,
  getAttFailed,
  getAttStart,
  updateAttFailed,
  createAttStart,
  updateAttStart,
} = phoneLeadSlice.actions;

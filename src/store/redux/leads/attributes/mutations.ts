import { WritableDraft } from "immer/dist/internal";
import { PhoneLeadAttributeType } from "_types_/PhoneLeadType";
import { PhoneLeadState } from "../slice";
import produce from "immer";
import { AttributeType } from "_types_/AttributeType";

const getAttStart = (state: WritableDraft<PhoneLeadState>) => {
  state.error = false;
  state.loading = true;
  state.type = null;
};
const getAttSuccess = (
  state: WritableDraft<PhoneLeadState>,
  action: {
    payload: any;
    type: string;
  }
) => {
  const { atts } = action.payload;
  state.attributes = atts;
  state.error = false;
  state.loading = false;
  state.type = null;
};
const getAttFailed = (state: WritableDraft<PhoneLeadState>) => {
  state.error = true;
  state.loading = false;
  state.type = null;
};
const createAttStart = (
  state: WritableDraft<PhoneLeadState>,
  action: {
    payload: any;
    type: string;
  }
) => {
  state.error = false;
  state.loading = true;
  state.type = action.payload.type;
};
const createdAttSuccess = (
  state: WritableDraft<PhoneLeadState>,
  action: {
    payload: any;
    type: string;
  }
) => {
  const { type, id, name } = action.payload.att;
  state.attributes[type as keyof PhoneLeadAttributeType].unshift({ id, name });
  state.error = false;
  state.loading = false;
  state.type = null;
};
const createAttFailed = (state: WritableDraft<PhoneLeadState>) => {
  state.error = true;
  state.loading = false;
  state.type = null;
};
const updateAttStart = (
  state: WritableDraft<PhoneLeadState>,
  action: {
    payload: any;
    type: string;
  }
) => {
  state.error = false;
  state.loading = true;
  state.type = action.payload.type;
};
const updatedAttSuccess = (
  state: WritableDraft<PhoneLeadState>,
  action: {
    payload: any;
    type: string;
  }
) => {
  const { type, id, name, is_shown, is_e_commerce } = action.payload.att;
  const filters = produce(state.attributes[type as keyof PhoneLeadAttributeType], (draft) => {
    const todo: WritableDraft<WritableDraft<AttributeType>> | undefined = draft.find(
      (item) => item.id === id
    );
    if (todo) {
      todo.name = name;
      todo.is_shown = is_shown;
      todo!.is_e_commerce = is_e_commerce;
    }
  });
  state.attributes[type as keyof PhoneLeadAttributeType] = filters;
  state.error = false;
  state.loading = false;
  state.type = null;
};
const updateAttFailed = (state: WritableDraft<PhoneLeadState>) => {
  state.error = true;
  state.loading = false;
  state.type = null;
};
const deleteAttStart = (
  state: WritableDraft<PhoneLeadState>,
  action: {
    payload: any;
    type: string;
  }
) => {
  state.error = false;
  state.loading = true;
  state.type = action.payload.type;
};
const deletedAttSuccess = (
  state: WritableDraft<PhoneLeadState>,
  action: {
    payload: any;
    type: string;
  }
) => {
  const { type, id } = action.payload.att;
  const deletedTodosObj = state.attributes[type as keyof PhoneLeadAttributeType].filter(
    (item) => item.id !== id
  );
  state.attributes[type as keyof PhoneLeadAttributeType] = deletedTodosObj;
  state.error = false;
  state.loading = false;
  state.type = null;
};
const deleteAttFailed = (state: WritableDraft<PhoneLeadState>) => {
  state.error = true;
  state.loading = false;
  state.type = null;
};

export const leadAttributeMutations = {
  getAttStart,
  getAttFailed,
  createAttFailed,
  updateAttFailed,
  deleteAttFailed,
  updatedAttSuccess,
  deletedAttSuccess,
  deleteAttStart,
  updateAttStart,
  getAttSuccess,
  createdAttSuccess,
  createAttStart,
};

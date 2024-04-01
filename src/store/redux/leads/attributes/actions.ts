import { store } from "store";
import { phoneLeadApi } from "_apis_/lead.api";
import { PhoneLeadAttributeType } from "_types_/PhoneLeadType";
import {
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
} from "../slice";
import { ErrorResponseType, BaseResponseType } from "_types_/ResponseApiType";
import { AttributeType } from "_types_/AttributeType";

export const getPhoneLeadAttribute = async (params?: any) => {
  const { dispatch } = store;
  const result: BaseResponseType<PhoneLeadAttributeType | null> = await phoneLeadApi.findAttribute(
    params
  );
  if (result.data) {
    dispatch(getAttSuccess({ atts: result.data }));
  } else dispatch(getAttFailed());
};

export const createPhoneLeadAttribute = async ({ type, name }: { type: string; name: string }) => {
  const { dispatch } = store;
  dispatch(createAttStart({ type }));
  const result: ErrorResponseType | BaseResponseType<AttributeType> =
    await phoneLeadApi.createAttribute({ type, name });
  if (result.data) {
    const { id, name } = result.data;
    dispatch(createdAttSuccess({ att: { type, id, name } }));
  } else {
    dispatch(createAttFailed());
  }
};

export const updatePhoneLeadAttribute = async (params: {
  type: string;
  name?: string;
  id: number | string;
  is_shown?: boolean;
  is_e_commerce?: boolean;
}) => {
  const { type } = params;
  const { dispatch } = store;
  dispatch(updateAttStart({ type }));
  const result: ErrorResponseType | BaseResponseType<AttributeType> =
    await phoneLeadApi.updateAttribute(params);
  if (result.data) {
    const { id, name, is_shown, is_e_commerce } = result.data;
    dispatch(updatedAttSuccess({ att: { type, id, name, is_shown, is_e_commerce } }));
  } else {
    dispatch(updateAttFailed());
  }
};

export const deletePhoneLeadAttribute = async ({
  id,
  name,
  type,
}: {
  type: string;
  name: string;
  id: number | string;
}) => {
  const { dispatch } = store;
  dispatch(deleteAttStart({ type }));
  const result: ErrorResponseType | BaseResponseType<number> = await phoneLeadApi.deleteAttribute({
    type,
    name,
    id,
  });
  if (result.data) {
    // delete
    dispatch(deletedAttSuccess({ att: { type, id } }));
  } else {
    dispatch(deleteAttFailed());
  }
};

export const leadAttributeActions = {
  getPhoneLeadAttribute,
  createPhoneLeadAttribute,
  updatePhoneLeadAttribute,
  deletePhoneLeadAttribute,
};

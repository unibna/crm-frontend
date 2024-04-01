import { TYPE_FORM_FIELD } from "constants/index";

export const actionAttributeType = {
  ADD_GROUP_ATTRIBUTE: "ADD_GROUP_ATTRIBUTE",
  EDIT_GROUP_ATTRIBUTE: "EDIT_GROUP_ATTRIBUTE",
  DELETE_GROUP_ATTRIBUTE: "DELETE_GROUP_ATTRIBUTE",
  ADD_ATTRIBUTE: "ADD_ATTRIBUTE",
  EDIT_ATTRIBUTE: "EDIT_ATTRIBUTE",
  DELETE_ATTRIBUTE: "DELETE_ATTRIBUTE",
};

export const titlePopupAttribute = {
  ADD_GROUP_ATTRIBUTE: "Thêm nhóm thuộc tính",
  EDIT_GROUP_ATTRIBUTE: "Chỉnh sửa nhóm thuộc tính",
  ADD_ATTRIBUTE: "Thêm thuộc tính",
  EDIT_ATTRIBUTE: "Chỉnh sửa thuộc tính",
};

export const message = {
  [actionAttributeType.ADD_GROUP_ATTRIBUTE]: {
    ADD_SUCCESS: "Thêm nhóm thành công",
    ADD_FAILED: "Thêm thất bại",
  },
  [actionAttributeType.EDIT_GROUP_ATTRIBUTE]: {
    EDIT_SUCCESS: "Chỉnh sửa nhóm thành công",
    EDIT_FAILED: "Chỉnh sửa nhóm thất bại",
  },
  [actionAttributeType.DELETE_GROUP_ATTRIBUTE]: {
    DELETE_SUCCESS: "Xoá nhóm thành công",
    DELETE_FAILED: "Xoá nhóm thất bại",
  },
  [actionAttributeType.ADD_ATTRIBUTE]: {
    ADD_SUCCESS: "Thêm thành công",
    ADD_FAILED: "Thêm thất bại",
  },
  [actionAttributeType.EDIT_ATTRIBUTE]: {
    EDIT_SUCCESS: "Chỉnh sửa thành công",
    EDIT_FAILED: "Chỉnh sửa thất bại",
  },
  [actionAttributeType.DELETE_ATTRIBUTE]: {
    DELETE_SUCCESS: "Xoá thành công",
    DELETE_FAILED: "Xoá thất bại",
  },
};

const contentRenderOneGroupDefault = [
  {
    type: TYPE_FORM_FIELD.TEXTFIELD,
    name: "name",
    label: "Tên nhóm*",
    placeholder: "Nhập tên nhóm",
  },
];

const contentRenderOneAttributeDefault = [
  {
    type: TYPE_FORM_FIELD.TEXTFIELD,
    name: "name",
    label: "Tên thuộc tính*",
    placeholder: "Nhập tên thuộc tính",
  },
];

export const contentRenderDefault = {
  [titlePopupAttribute.ADD_GROUP_ATTRIBUTE]: contentRenderOneGroupDefault,
  [titlePopupAttribute.EDIT_GROUP_ATTRIBUTE]: contentRenderOneGroupDefault,
  [titlePopupAttribute.ADD_ATTRIBUTE]: contentRenderOneAttributeDefault,
  [titlePopupAttribute.EDIT_ATTRIBUTE]: contentRenderOneAttributeDefault,
};

export const buttonTextPopupAttribute = {
  [titlePopupAttribute.ADD_GROUP_ATTRIBUTE]: 'Thêm',
  [titlePopupAttribute.EDIT_GROUP_ATTRIBUTE]: 'OK',
  [titlePopupAttribute.ADD_ATTRIBUTE]: 'Thêm',
  [titlePopupAttribute.EDIT_ATTRIBUTE]: 'OK',
}
import { SelectOptionType } from '_types_/SelectOptionType';

export enum STATUS {
  PENDING_REVIEW = "PENDING_REVIEW",
  ENABLE = "ENABLE",
  REJECT = "REJECT",
  DISABLE = "DISABLE",
  DELETE = "DELETE",
  SUCCESS = "success",
  ERROR = "error",
}

export enum TEMPLATE_QUALITY {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
  UNDEFINED = "UNDEFINED",
}

export enum TEMPLATE_TAG {
  OTP = "OTP ",
  IN_TRANSACTION = "IN_TRANSACTION ",
  POST_TRANSACTION = "POST_TRANSACTION ",
  ACCOUNT_UPDATE = "ACCOUNT_UPDATE",
  GENERAL_UPDATE = "GENERAL_UPDATE",
  DEFAULT = "DEFAULT",
}

export enum TemplateDataType {
  STRING = "STRING",
  DATE = "DATE",
  NUMBER = "NUMBER"
}

export type TemplateItemType = {
  id: string;
  status: STATUS;
  template_name: string;
  created: string;
  template_id: string;
  template_quality: string;
  preview_url: string;
  price: string;
  template_tag: string;
};

export type TemplateDataRender = {
  type: TemplateDataType,
  name: string,
  value?: SelectOptionType,
  label: string,
  placeholder?: string,
  required?: boolean
}
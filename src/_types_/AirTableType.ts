export interface AirtableType {
  phone: any,
  note: string,
  channel_airtable: string[],
  product_airtable: string[],
  caculation: string,
  status_other: string,
  created_date: string,
  classify: string,
  status_airtable: string,
  solution: string[],
  created_time: string,
  created: string,
  customer_comment: string,
  handling_staff: string,
  description: string,
  present_time: string,
  compensation_product: string[],
}

export interface AttributeValue {
  value: string | number,
  label: string,
  extra?: any
}

export interface Attributes {
  value: string | number,
  label: string,
  attributeValue: AttributeValue[]
}

export interface DataRenderAttribute {
  id: number | string,
  title: string,
  dataItem: AttributeValue[],
  titlePopupAdd?: string,
  titlePopupEdit?: string
}
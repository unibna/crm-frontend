export interface ContentDailyDefaultType {
  ad_name?: string;
  "Hình ảnh (final)"?: string;
  cost?: number;
  engagements?: number;
  impressions?: number;
  reach?: number;
  views?: number;
  CPV?: number;
  CPE?: number;
  CPM?: number;
  CPR?: number;
}

export interface ContentDailyOverviewType extends ContentDailyDefaultType {
  campaign_name?: string;
  ad_name?: string;
  body?: string;

  content_id?: Partial<any>;
}

export interface ContentDailyPivotType extends ContentDailyDefaultType {
  campaign_name?: string;
  ad_name?: string;
  body?: string;

  content_id?: Partial<any>;
}

export type COLS_ORDER = "key_a_to_z" | "value_a_to_z" | "value_z_to_a";
export type RƠWS_ORDER = "key_a_to_z" | "value_a_to_z" | "value_z_to_a";
export interface COLUMN_DEF {
  field: string;
  hide: boolean;
  enableRowGroup: boolean;
  filter: string;
  enablePivot?: undefined;
  pivot?: undefined;
  headerName?: undefined;
  aggFunc?: undefined;
}

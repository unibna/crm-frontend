import { GeneralType } from "_types_/GeneralType";
export interface ContentIdDefaultType {
  total_expense?: number;
  total_qualified?: number;
  total_qualified_processed?: number;
  cost_per_total_qualified?: number;
  total_expense_per_total_revenue?: number;
  total_phone?: number;
  total_phone_processed?: number;
  total_revenue?: number;
  total_orders?: number;
  buy_rate?: number;
  kol_koc?: string[];
  ladi_phone?: number;
  ladi_qualified: number;
  total_buy_rate_processed?: number;
  cost_per_total_phone?: number;
  created_date?: string;
  impressions?: number;
  total_impressions?: number;
  total_engagements?: number;
  total_views?: number;
  total_clicks?: number;
  cpa_ranking?: string;
  cpr_ranking?: string;
  campaign_status?: number;

  classification?: Partial<any>;
  content_id?: Partial<any>;
  campaign?: Partial<any>;
  adgroup?: Partial<any>;
}

export interface ContentIdTotalType extends ContentIdDefaultType {
  product?: string;
  team?: string;
  ads_type?: string;
  content_type?: string[];
  status?: string;
  ad_name?: string;
  body?: string;
  created_date_show?: string;
  campaign_name?: string;
  adgroup_name?: string;
  total_expense?: number;
  total_qualified?: number;
  cost_per_total_qualified_avg?: number;
  total_expense_per_total_revenue?: number;
  total_processing?: number;
  ladi_processing?: number;
  comment_processing?: number;
  inbox_processing?: number;
  fb_ladi_qualified?: number;
  fb_ladi_processing?: number;
  fb_ladi_phone?: number;
  fb_total_qualified?: number;
  fb_total_phone?: number;
  fb_total_processing?: number;
  gg_total_qualified?: number;
  gg_total_processing?: number;
  gg_total_phone?: number;
  drive_url?: string;
  thumbnails?: string;
  ad_name_show?: string;
  processed_rate?: number;

  // columnShowTotalRevenueByCampaignObject
  time?: number;

  // columnShowSpendSegmentByCampaignObject
  total_revenue?: number;

  // columnShowContentIdTotalByProductDetailTeam
  cost?: number;
  spend?: number;
  spend_conversion?: number;
  spend_message?: number;
  spend_livestream?: number;

  // columnShowContentIdTotalByProductDetailObjective
  campaign_objective?: string;

  content_product?: Partial<any>;
}

export interface ContentIdFacebookType extends ContentIdDefaultType {
  content_creator?: string;
  content_designer?: string;
  digital_fb?: string;
  daily_budget?: number;
  cpl_1?: number;
  cpl_3?: number;
  cpl_7?: number;
  spend?: number;
  total_qualified?: number;
  total_revenue?: number;
  total_orders?: number;
  total_phone?: number;
  fb_pixel_complete_registration?: number;
  cost_per_fb_pixel_complete_registration?: number;
  comment_qualified?: number;
  comment?: number;
  cost_per_comment?: number;
  inbox_qualified?: number;
  "15s_watch_rate"?: number;
  avg_watch_time?: number;
  post_engagement?: number;
  kol_koc?: string[];
  video_view?: number;
  link_click?: number;
  reach?: number;
  engagement_rate?: number;
  view_rate?: number;
  clickthrough_rate?: number;
  messaging_conversation_started_7d?: number;
  cost_per_messaging_conversation_started_7d?: number;
  comment_phone?: number;
  inbox_phone?: number;
  body?: string;

  // columnShowContentIdFacebookByContentId
  product?: string;
  ad_name?: string;
  campaign_name?: string;

  // columnShowContentIdFacebookByDateDetail

  // columnShowContentIdFacebookPostDetail
  page_name?: string;
}

export interface ContentIdGoogleType extends ContentIdDefaultType {
  product?: string;
  team?: string;
  status?: string;
  ad_name?: string;
  cost?: number;
  cost_per_conversion?: number;
  conversion?: number;
  clicks?: number;
  drive_url?: string;
  kol_koc?: string[];

  // columnShowContentIdGoogleCampaignDetail
  campaign_name?: string;
  ladi_revenue?: number;
  ladi_orders?: number;
  campaign_budget?: number;
  campaign_start_date?: number;
  campaign_end_date?: number;
}

export interface ContentIdTiktokType extends ContentIdDefaultType {
  product?: string;
  team?: string;
  status?: string;
  ad_name?: string;
  spend?: number;
  cost_per_conversion?: number;
  conversion?: number;
  clicks?: number;
  phone_qualified?: number;
  phone_total?: number;
  cost_per_phone_total?: number;
  cost_per_phone_qualified?: number;

  // columnShowContentIdGoogleCampaignDetail
  campaign_name?: string;
  phone_revenue?: number;
  ladi_orders?: number;
  campaign_budget?: number;
  campaign_start_date?: number;
  campaign_end_date?: number;
  kol_koc?: string[];
}

export interface ContentIdPhoneLeadType extends ContentIdDefaultType {
  created?: string;
  ad_name?: string;
  phone?: string;
  phone_created?: string;
  lead_status?: string;
  phone_note?: string;
  phone_reason?: string;
  phone_order_number?: string;
  sender_name?: string;
  campaign_name?: string;
  adset_name?: string;
  is_seeding?: boolean;
  created_time?: string;
  message?: string;

  rule_name?: string;
  conversion_action_name?: string;
  customer_id?: string;
  uploaded_clicks?: string;
  successful?: string;
  error?: string;
}

export interface ContentIdAttachPhoneType extends GeneralType, ContentIdDefaultType {
  created?: string;
  phones?: string;
  phone?: string;
  type?: string;
  is_conversion_obj?: boolean;
  ad_id?: string;
  content_message?: string;
  content_id_final?: string;
  content_id_system?: string;
  page_name?: string;
}
export interface ContentIdType
  extends ContentIdDefaultType,
    ContentIdFacebookType,
    ContentIdGoogleType,
    ContentIdPhoneLeadType,
    ContentIdTotalType,
    ContentIdAttachPhoneType {}

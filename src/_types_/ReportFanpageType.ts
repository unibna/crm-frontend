export interface ReportFanpageType {
  comment: number;
  cost_per_comment: number;
  cost_per_fb_pixel_complete_registration: number;
  cost_per_messaging_conversation_started_7d: number;
  fb_pixel_complete_registration: number;
  messaging_conversation_started_7d: number;
  messaging_conversation_started_7d_and_comment: number;
  page_id: string;
  page_name: string;
  spend: number;
  total_adset: number;
  total_campaign: number;
  total_date: number;
}

export interface ReportMarketingType {
  post_id: string;
  total_date: number;
  spend: number;
  comment: number;
  messaging_conversation_started_7d: number;
  fb_pixel_complete_registration: number;
  messaging_conversation_started_7d_and_comment: number;
  cost_per_comment: number;
  cost_per_messaging_conversation_started_7d: number;
  cost_per_fb_pixel_complete_registration: number;
  picture: string;
  page_name: string;
  total_post_comments: number;
  total_post_comments_phone: number;
  rate_post_comments_phone: number;
}

export type SkycallType = {
  sky_call_id: string;
  call_status: "meet_call" | "miss_call" | "stop_at_IVR" | "stop_at_survey_IVR";
  record_url: string;
  third_party_type: string;
  third_party_id: string;
  duration: number;
  call_type: "callout" | "callin" | "internal";
  hotline_number: string;
  customer_number: string;
  date_from: string;
  date_to: string;
  business_call_type: string;
  sky_call_note: string;
  telephonist_name: string;
  modified_by_name?: string;
  modified?: string;
  additionalProp1: any;
};

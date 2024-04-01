export interface ReportRevenueType {
  created_date?: string;
  total_order?: number;
  revenue?: number;
  discount?: number;
  revenue_net?: number;
  aov?: number;
  avatar?: string;
  created_by?: string;
  cross_sale_amount?: number;
  cross_sale_order?: number;
  name: string;

  province?: string;
  source_name?: string;
  completed_date?: string;
  total_actual?: number;
  total_variant_actual?: number;
  total_variant_all?: number;
  discount_promotion?: number;
  discount_input?: number;
  fee_additional?: number;
  fee_delivery?: number;
  paid?: number;
  cost?: number;
  crm_revenue?: number;
  created_by_name?: string;

  // Product
  variant?: Partial<any>;
  variant_name?: string;
  variant_SKU_code?: string;
  variant_image?: string;
  total?: number;
  variant_total?: number;
  quantity?: number;
  c_inventory?: number;
  avg_orders?: number;
  eto_over?: number;
  available_inventory?: number;
}

export interface ReportByDateType extends ReportRevenueType {
  date?: string;
  order_count?: number;
  return_rate?: number;
  revenue_crm?: number;
  revenue_offline?: number;
  revenue_livestream?: number;
  revenue_ecom?: number;
  revenue_ads?: number;
  revenue_per_order?: number;
  total_spend?: number;
  fb_spend?: number;
  gg_spend?: number;
  tt_spend?: number;
  lead_assigned?: number;
  lead_done?: number;
  lead_qualified?: number;
  lead_buy?: number;
  lead_buy_rate?: number;
  lead_qualified_rate?: number;
  ads_phone?: number;
  ads_qualified_rate?: number;
  ads_buy_rate?: number;
  total_spend_per_revenue_ads?: number;
  total_spend_per_ads_qualified?: number;
  total_spend_per_revenue?: number;
  ads_qualified_processed?: number;
  ads_qualified?: number;
  provisional_revenue?: number;
}
export interface ReportByProductType {
  avg_orders: number;
  c_inventory: number;
  discount: number;
  eto_over: string;
  quantity: number;
  quantity_gift: number;
  total: number;
  variant: string;
  variant_SKU_code: string;
  variant_image: string;
  variant_name: string;
  variant_total: number;
}

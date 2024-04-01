interface Location {
  id: number;
  name: string;
  slug: string;
  label: string;
  code: string;
  type: string;
}

export interface WardType extends Location {
  district: number;
  province: number;
}

export interface DistrictType extends Location {
  province: number;
}

export interface ProvinceType extends Omit<Location, "type"> {
  type: string[];
}

export interface AddressType {
  id?: string;
  street?: string;
  location?: {
    district?: string;
    province?: string;
    ward?: string;
    district_id?: string;
    province_id?: string;
    ward_id?: string;
    code?: string;
  };
  is_default?: boolean;
  address?: string;
}

import { ROLE_TAB, ROLE_TYPE } from "constants/rolesTab";
import { AddressType } from "./AddressType";

export type RoleType = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";

export interface UserType {
  email: string;
  name: string;
  username: string;
  id: string;
  phone?: string;
  last_login?: string;
  role?: RoleType;
  password?: string;
  is_superuser?: boolean;
  is_active: boolean;
  is_online: boolean;
  full_name?: string;
  last_name?: string;
  group_user?: {
    id: string;
    name: string;
    extra: Partial<any>;
  }[];
  image?: {
    id: string;
    url: string;
  } | null;
  group_permission: {
    code?:
      | "guest"
      | "content"
      | "Team"
      | "kho"
      | "qa"
      | "Purchasing"
      | "telesale"
      | "marketing_collaborator"
      | "telesalelead"
      | "admin"
      | "marketing"
      | "Developer"
      | "admin"
      | "mktleader"
      | "Manager"
      | "Manager"
      | "telesale"
      | "sale_offline"
      | "lead_sale_offline";
    id: string;
    name: string;
    data?: {
      [key in ROLE_TAB]?: {
        [key: string]: ROLE_TYPE;
      };
    };
    route: string | null;
  } | null;
  addresses?: AddressType[];
  auto_assign_crm?: boolean;
  history_user?: string;
  auto_assign_lp?: boolean;
  auto_assign_missed?: boolean;
  auto_assign_pc?: boolean;
  auto_assign_harapos?: boolean;
  is_export_data?: boolean;
  department?: {
    id: string;
    name: string;
  };
}

export interface SaleOnlineDailyType {
  name: string;
  email: string;
  total: number;
  qualified: number;
}

// ----------------------------------------------------------------------

export type UserInvoice = {
  id: string;
  createdAt: Date | string | number;
  price: number;
};

export type CreditCard = {
  id: string;
  cardNumber: string;
  cardType: string;
};

export type Follower = {
  id: string;
  avatarUrl: string;
  name: string;
  country: string;
  isFollowed: boolean;
};

export type Gallery = {
  id: string;
  title: string;
  postAt: Date | string | number;
  imageUrl: string;
};

export type UserAddressBook = {
  id: string;
  name: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  zipCode: string;
};

export type Profile = {
  id: string;
  cover: string;
  position: string;
  follower: number;
  following: number;
  quote: string;
  country: string;
  email: string;
  company: string;
  school: string;
  role: string;
  facebookLink: string;
  instagramLink: string;
  linkedinLink: string;
  twitterLink: string;
};

export type UserManager = {
  id: string;
  avatarUrl: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  company: string;
  isVerified: boolean;
  status: string;
  role: string;
};

export type UserData = {
  id: string;
  avatarUrl: string;
  cover: string;
  name: string;
  follower: number;
  following: number;
  totalPost: number;
  position: string;
};

export type NotificationSettings = {
  activityComments: boolean;
  activityAnswers: boolean;
  activityFollows: boolean;
  applicationNews: boolean;
  applicationProduct: boolean;
  applicationBlog: boolean;
};

export type Friend = {
  id: string;
  avatarUrl: string;
  name: string;
  role: string;
};

export type UserPost = {
  id: string;
  author: {
    id: string;
    avatarUrl: string;
    name: string;
  };
  isLiked: boolean;
  createdAt: Date | string | number;
  media: string;
  message: string;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    author: {
      id: string;
      avatarUrl: string;
      name: string;
    };
    createdAt: Date | string | number;
    message: string;
  }[];
};

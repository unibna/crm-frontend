export interface FanpageType {
  page_id: string;
  status_sync?: string;
  name: string;
  page_access_token: string;
  sync_is_active?: boolean;
  fb_account: string;
}

export type FanpageTabName = "fanpage" | "comment" | "conversation" | "message" | "message";

export interface CommentType {
  id: string;
  comment_id: string;
  created_time: Date;
  message?: string;
  phone: string;
  fb_post: string;
}

export interface ConversationType {
  conversation_id: string;
  updated_time: Date;
  sender_name: string;
  sender_id: string;
  fb_page: string;
}

export interface MessageType {
  message_id: string;
  message: string;
  sender_name: string;
  sender_id: string;
  created_time: Date;
  phone: string;
  fb_conversations: string;
}

export type TypeInPost = "PP" | "AP" | "LP";

export interface PostType {
  post_id: string;
  status_sync: string;
  created_time: Date;
  updated_time: Date;
  message?: string;
  picture?: string;
  icon?: string;
  type?: TypeInPost;
  fb_page: string;
}

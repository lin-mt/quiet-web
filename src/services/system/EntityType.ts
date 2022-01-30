export interface BaseEntity {
  id: string;
  creator?: string;
  updater?: string;
  gmt_create?: string;
  gmt_update?: string;
}

export interface SerialEntity extends BaseEntity {
  serial_number: number;
}

export interface KeyEntity {
  key: string;
}

export interface ParentEntity<T> extends BaseEntity {
  parent_id: number;
  children: T[];
}

export interface QuietClient extends BaseEntity {
  client_id: string;
  client_name: string;
  resource_ids: string[];
  secret_required: string;
  client_secret: string;
  scoped: string;
  scope: string[];
  authorized_grant_types: string[];
  registered_redirect_uri: string[];
  access_token_validity_seconds: number;
  refresh_token_validity_seconds: number;
  auto_approve: string;
  remake: string;
}

export interface QuietRoute extends BaseEntity {
  environment: string;
  route_id: string;
  uri: string;
  order: number;
  predicates: string[];
  filters: string[];
}

export interface TokenInfo extends BaseEntity {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  token_expire_time: number;
}

export interface QuietUser extends BaseEntity {
  username: string;
  full_name: string;
  avatar?: string;
  gender?: string;
  phone_number?: string;
  email_address?: string;
  account_expired?: string;
  account_locked?: string;
  credentials_expired?: string;
  enabled: string;
  unread_count: number;
  authorities: QuietRole[];
}

export interface QuietRole extends BaseEntity {
  parent_id?: string;
  role_name: string;
  role_cn_name?: string;
  remark?: string;
}

export interface QuietUserRole extends BaseEntity {
  user_id: string;
  role_id: string;
}

export interface QuietDictionary extends ParentEntity<QuietDictionary> {
  type: string;
  key: string;
  label: string;
  remark?: string;
}

export interface QuietTeam extends BaseEntity {
  team_name: string;
  slogan?: string;
  product_owners?: QuietUser[];
  scrum_masters?: QuietUser[];
  members?: QuietUser[];
}

export interface QuietPermission extends BaseEntity {
  application_name: string;
  url_pattern: string;
  pre_filter_value?: string;
  pre_filter_filter_target?: string;
  pre_authorize_value?: string;
  post_filter_value?: string;
  post_authorize_value?: string;
}

export interface QuietDepartment extends BaseEntity {
  department_name: string;
  parent_id?: string;
  remark?: string;
}

export interface NoticeIconData extends BaseEntity {
  key: string;
  avatar: string;
  title: string;
  datetime: string;
  type: string;
  read?: boolean;
  description: string;
  click_close?: boolean;
  extra: any;
  status: string;
}

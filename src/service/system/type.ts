export interface BaseEntity {
  id?: string;
  creator?: string;
  updater?: string;
  gmt_create?: string;
  gmt_update?: string;
}

export interface SortableEntity extends BaseEntity {
  sort_num: number;
}

export interface ParentEntity<T extends BaseEntity> extends BaseEntity {
  parent_id?: string;
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
  account_expired?: boolean;
  account_locked?: boolean;
  credentials_expired?: boolean;
  enabled: boolean;
  unread_count: number;
  authorities: QuietRole[];
  permissions: Record<string, string[]>;
}

export interface QuietRole extends ParentEntity<QuietRole> {
  role_name: string;
  role_cn_name?: string;
  remark?: string;
}

export interface QuietUserRole extends BaseEntity {
  user_id: string;
  role_id: string;
}

export interface QuietDictType extends BaseEntity {
  service_id: string;
  key: string;
  name: string;
  enabled: boolean;
  remark?: string;
}

export interface QuietDict extends SortableEntity {
  type_id: string;
  key: string;
  name: string;
  enabled: boolean;
  remark?: string;
  type_name?: string;
  children?: QuietDict[];
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

export interface QuietHoliday extends BaseEntity {
  date_info: string;
  is_holiday: boolean;
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

export interface QuietDept extends ParentEntity<QuietDept> {
  dept_name: string;
  parent_id?: string;
  remark?: string;
}

export interface Header {
  first: string;
  second: string;
}

export interface UserMetadata {
  original_file_name: string;
}

export interface UploadResult {
  content_type: string;
  delete_path: string;
  detail_path: string;
  download_path: string;
  view_path: string;
  file_size: number;
  filename: string;
  headers: Header[];
  last_modified: string;
  tags: Record<string, string>;
  user_metadata: UserMetadata;
  object: string;
}

// enums
export enum Gender {
  MALE = '男',
  FEMALE = '女',
}

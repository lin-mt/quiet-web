// @ts-ignore
/* eslint-disable */

declare namespace SystemAPI {
  type BaseEntity = {
    id?: string;
    creator?: string;
    updater?: string;
    gmt_create?: string;
    gmt_update?: string;
  };

  type SerialEntity = BaseEntity & {
    serial_number: number;
  };

  type ParentEntity<T> = BaseEntity & {
    parent_id: number;
    children: T[];
  };

  type QuietClient = BaseEntity & {
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
  };

  type QuietRoute = BaseEntity & {
    environment: string;
    route_id: string;
    uri: string;
    order: number;
    predicates: string[];
    filters: string[];
  };

  type TokenInfo = BaseEntity & {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
    token_expire_time: number;
  };

  type QuietUser = BaseEntity & {
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
  };

  type QuietRole = BaseEntity & {
    parent_id?: string;
    role_name: string;
    role_cn_name?: string;
    remark?: string;
  };

  type QuietUserRole = BaseEntity & {
    user_id: string;
    role_id: string;
  };

  type QuietDictionary = ParentEntity<QuietDictionary> & {
    type: string;
    key: string;
    label: string;
    remark?: string;
  };

  type QuietTeam = BaseEntity & {
    team_name: string;
    slogan?: string;
    product_owners?: QuietUser[];
    scrum_masters?: QuietUser[];
    members?: QuietUser[];
  };

  type QuietPermission = BaseEntity & {
    application_name: string;
    url_pattern: string;
    pre_filter_value?: string;
    pre_filter_filter_target?: string;
    pre_authorize_value?: string;
    post_filter_value?: string;
    post_authorize_value?: string;
  };

  type QuietDepartment = BaseEntity & {
    department_name: string;
    parent_id?: string;
    remark?: string;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type NoticeIconData = BaseEntity & {
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
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}

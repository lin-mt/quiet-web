export interface BaseEntity {
  id: string;
  creator: string;
  updater: string;
  gmtCreate: string;
  gmtUpdate: string;
}

export interface SerialEntity extends BaseEntity {
  serialNumber: number;
}

export interface KeyEntity {
  key: string;
}

export interface ParentEntity<T> extends BaseEntity {
  parentId: number;
  children: T[];
}

export interface QuietClient extends BaseEntity {
  clientId: string;
  clientName: string;
  resourceIds: string[];
  secretRequired: string;
  clientSecret: string;
  scoped: string;
  scope: string[];
  authorizedGrantTypes: string[];
  registeredRedirectUri: string[];
  accessTokenValiditySeconds: number;
  refreshTokenValiditySeconds: number;
  autoApprove: string;
  remake: string;
}

export interface QuietRoute extends BaseEntity {
  environment: string;
  routeId: string;
  uri: string;
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
  fullName: string;
  avatar?: string;
  gender?: string;
  phoneNumber?: string;
  emailAddress?: string;
  accountExpired?: string;
  accountLocked?: string;
  credentialsExpired?: string;
  enabled: string;
  unreadCount: number;
  authorities: QuietRole[];
}

export interface QuietRole extends BaseEntity {
  parentId?: string;
  roleName: string;
  roleCnName?: string;
  remark?: string;
}

export interface QuietUserRole extends BaseEntity {
  userId: string;
  roleId: string;
}

export interface QuietDictionary extends ParentEntity<QuietDictionary> {
  type: string;
  key: string;
  label: string;
  remark?: string;
}

export interface QuietTeam extends BaseEntity {
  teamName: string;
  slogan?: string;
  productOwners?: QuietUser[];
  scrumMasters?: QuietUser[];
  members?: QuietUser[];
}

export interface QuietPermission extends BaseEntity {
  applicationName: string;
  urlPattern: string;
  preFilterValue?: string;
  preFilterFilterTarget?: string;
  preAuthorizeValue?: string;
  postFilterValue?: string;
  postAuthorizeValue?: string;
}

export interface QuietDepartment extends BaseEntity {
  departmentName: string;
  parentId?: string;
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
  clickClose?: boolean;
  extra: any;
  status: string;
}

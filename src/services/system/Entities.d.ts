declare namespace SystemEntities {
  export type BaseEntity = {
    id: string;
    creator: string;
    updater: string;
    gmtCreate: string;
    gmtUpdate: string;
  };

  export type QuietClient = BaseEntity & {
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
  };

  export type TokenInfo = BaseEntity & {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
    token_expire_time: number;
  };

  export type QuietUser = BaseEntity & {
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
  };

  export type QuietRole = BaseEntity & {
    parentId?: string;
    roleName: string;
    roleCnName?: string;
    remark?: string;
  };

  export type QuietDictionary = BaseEntity & {
    type: string;
    key: string;
    label: string;
    parentId?: string;
    remark?: string;
  };

  export type QuietTeam = BaseEntity & {
    teamName: string;
    slogan?: string;
    productOwners?: QuietUser[];
    scrumMasters?: QuietUser[];
    members?: QuietUser[];
  };

  export type QuietPermission = BaseEntity & {
    applicationName: string;
    urlPattern: string;
    preFilterValue?: string;
    preFilterFilterTarget?: string;
    preAuthorizeValue?: string;
    postFilterValue?: string;
    postAuthorizeValue?: string;
  };

  export type QuietDepartment = BaseEntity & {
    departmentName: string;
    parentId?: string;
    remark?: string;
  };

  export type NoticeIconData = BaseEntity & {
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
  };
}

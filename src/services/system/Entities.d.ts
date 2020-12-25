declare namespace SystemEntities {
  export type Dictionary = {
    code: string;
    value: string;
  };

  export type QuietUser = {
    id: string;
    username: string;
    avatar?: string;
    gender?: any;
    phoneNumber?: string;
    emailAddress?: string;
    accountExpired?: any;
    accountLocked?: any;
    credentialsExpired?: any;
    enabled: any;
    unreadCount: number;
  };

  export type QuietRole = {
    id: string;
    parentId?: string;
    roleName: string;
    roleCnName?: string;
    remark?: string;
  };

  export type QuietTeam = {
    id: string;
    teamName: string;
    slogan?: string;
  };

  export type QuietPermission = {
    id: string;
    applicationName: string;
    urlPattern: string;
    preFilterValue?: string;
    preFilterFilterTarget?: string;
    preAuthorizeValue?: string;
    postFilterValue?: string;
    postAuthorizeValue?: string;
  };

  export type QuietDepartment = {
    id: string;
    departmentName: string;
    parentId?: string;
    remark?: string;
  };

  export type NoticeIconData = {
    id: string;
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

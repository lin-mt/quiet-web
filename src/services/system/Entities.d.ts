declare namespace SystemEntities {

  export interface Dictionary {
    code: string,
    value: string
  }

  export interface QuiteUser {
    id: string;
    username: string
    avatar?: string
    gender?: any
    phoneNumber?: string
    emailAddress?: string
    accountExpired?: any
    accountLocked?: any
    credentialsExpired?: any
    enabled: any
    unreadCount: number
  }

  export interface QuiteRole {
    id: string;
    parentId?: string,
    roleName: string,
    roleCnName?: string,
    remarks?: string,
  }

  export interface QuitePermission {
    id: string;
    applicationName: string,
    urlPattern: string,
    preFilterValue?: string,
    preFilterFilterTarget?: string,
    preAuthorizeValue?: string,
    postFilterValue?: string,
    postAuthorizeValue?: string,
  }

  export interface QuiteDepartment {
    id: string;
    departmentName: string,
    parentId?: string,
    remark?: string,
  }

  export interface NoticeIconData {
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
  }
}

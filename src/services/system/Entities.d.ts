declare namespace SystemEntities {

  interface Dictionary {
    code: string,
    value: string
  }

  export interface QuiteUser {
    id: string;
    username: string
    avatar?: string
    gender?: Dictionary
    phoneNumber?: string
    emailAddress?: string
    accountExpired?: Dictionary
    accountLocked?: Dictionary
    credentialsExpired?: Dictionary
    enabled: Dictionary,
    unreadCount: number
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

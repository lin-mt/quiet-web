declare namespace SystemEntities {

  export interface QuiteUser {
    id: string;
    username: string
    avatar?: string
    gender?: string
    phoneNumber?: string
    emailAddress?: string
    accountNonExpired?: number
    accountNonLocked?: number
    credentialsNonExpired?: number
    enabled?: number
  }

  export interface LoginStateType {
    status?: 'ok' | 'error';
    type?: string;
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

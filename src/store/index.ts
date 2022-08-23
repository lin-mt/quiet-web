import defaultSettings from '../settings.json';
import { QuietUser } from '@/service/system/type';
export interface GlobalState {
  settings?: typeof defaultSettings;
  userInfo?: QuietUser;
  userLoading?: boolean;
}

const initialState: GlobalState = {
  settings: defaultSettings,
  userInfo: {
    id: '0',
    username: 'quiet',
    full_name: 'quiet',
    enabled: true,
    unread_count: 0,
    authorities: [],
    permissions: {},
  },
};

export default function store(state = initialState, action) {
  switch (action.type) {
    case 'update-settings': {
      const { settings } = action.payload;
      return {
        ...state,
        settings,
      };
    }
    case 'update-userInfo': {
      const { userInfo = initialState.userInfo, userLoading } = action.payload;
      return {
        ...state,
        userLoading,
        userInfo,
      };
    }
    default:
      return state;
  }
}

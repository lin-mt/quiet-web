import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { message, notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import type { ResponseError } from 'umi-request';
import { queryCurrent } from './services/system/QuietUser';
import type { Result } from '@/types/Result';
import { ResultType } from '@/types/Result';
import { LocalStorage, System, Url } from '@/constant';
import type { RequestOptionsInit } from 'umi-request';
import { request as umiReq } from 'umi';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';

const isDev = process.env.NODE_ENV === 'development';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  current_user?: SystemAPI.QuietUser;
  loading?: boolean;
  token_info?: SystemAPI.TokenInfo;
  fetchUserInfo?: () => Promise<SystemAPI.QuietUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await queryCurrent();
    } catch (error) {
      history.push(Url.Login);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== Url.Login) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      current_user: currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const retry = (response: Response, options: RequestOptionsInit) => {
  return umiReq(response.url, options);
};

const refreshToken = () => {
  const tokenInfoItem = localStorage.getItem(LocalStorage.TokenInfo);
  if (tokenInfoItem) {
    const tokenInfo = JSON.parse(tokenInfoItem);
    const refreshTokenData = {
      grant_type: System.GrantType.RefreshToken,
      refresh_token: tokenInfo.refresh_token,
    };
    return umiReq<SystemAPI.TokenInfo>('/api/system/oauth/token', {
      method: 'POST',
      params: refreshTokenData,
      headers: {
        Authorization: System.BasicCode,
      },
    });
  }
  return null;
};

/**
 * 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status } = response;
    notification.error({
      message: `请求出错`,
      description: `错误码 ${status}：${errorText}`,
    });
  }
  throw error;
};

const successMsgSet = new Set<string>();
const failureMsgSet = new Set<string>();
const warningMsgSet = new Set<string>();

export const request: RequestConfig = {
  errorHandler,
  requestInterceptors: [
    (url, options) => {
      if (url !== '/api/system/oauth/token') {
        const tokenInfoItem = localStorage.getItem(LocalStorage.TokenInfo);
        if (tokenInfoItem) {
          const tokenInfo = JSON.parse(tokenInfoItem);
          return {
            url,
            options: {
              ...options,
              headers: {
                Authorization: `${tokenInfo.token_type} ${tokenInfo.access_token}`,
              },
            },
          };
        }
      }
      return { url, options };
    },
  ],
  responseInterceptors: [
    async (response) => {
      if (response.status === 400) {
        const errorResp = await response.clone().json();
        if (
          errorResp &&
          errorResp.error &&
          errorResp.error === System.GrantType.InvalidRefreshTokenError
        ) {
          history.push('/login');
          notification.warn({
            message: '请重新登陆',
          });
          throw new Error();
        }
      }
      return response;
    },
    async (response, options) => {
      if (response.status === 401) {
        const tokenInfoItem = localStorage.getItem(LocalStorage.TokenInfo);
        if (tokenInfoItem) {
          const tokenInfo = JSON.parse(tokenInfoItem);
          const needRefreshToken =
            tokenInfo.refresh_token &&
            tokenInfo.token_expire_time < Date.parse(new Date().toString());
          if (needRefreshToken) {
            const newTokenInfo = await refreshToken();
            if (newTokenInfo) {
              newTokenInfo.token_expire_time =
                Date.parse(new Date().toString()) + tokenInfo.expires_in * 1000;
              localStorage.setItem(LocalStorage.TokenInfo, JSON.stringify(newTokenInfo));
              return retry(response, options);
            }
          }
        }
      }
      return response;
    },
    async (response) => {
      if (response.status === 200 && response.headers.get('content-type') === 'application/json') {
        const data: Result<any> = await response.clone().json();
        if (data) {
          if (data.result && data.message) {
            switch (data.result) {
              case ResultType.SUCCESS:
                successMsgSet.add(data.message);
                setTimeout(() => {
                  for (const msg of successMsgSet) {
                    message.success(msg);
                  }
                  successMsgSet.clear();
                }, successMsgSet.size * 500);
                break;
              case ResultType.WARNING:
                warningMsgSet.add(data.message);
                setTimeout(() => {
                  for (const msg of warningMsgSet) {
                    message.warn(msg);
                  }
                  warningMsgSet.clear();
                }, warningMsgSet.size * 500);
                break;
              case ResultType.FAILURE:
                failureMsgSet.add(
                  `${data.code ? `错误码：${data.code} ` : ` `}\r\n${data.message}`,
                );
                setTimeout(() => {
                  for (const msg of failureMsgSet) {
                    message.error(msg);
                  }
                  failureMsgSet.clear();
                }, failureMsgSet.size * 500);
                break;
              case ResultType.EXCEPTION:
                message.error({
                  content: (
                    <span>
                      {data.code ? `异常码：${data.code}` : ``}
                      <br /> 异常信息：{data.message}
                    </span>
                  ),
                });
                throw new Error(
                  `${data.code ? `异常码：${data.code}` : ``}\n异常信息：${data.message}`,
                );
              default:
            }
          }
        }
      }
      return response;
    },
  ],
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    // waterMarkProps: {
    // content: initialState?.currentUser?.full_name,
    // },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.current_user && location.pathname !== Url.Login) {
        history.push(Url.Login);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank" key={'openapi'}>
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key={'docs'}>
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

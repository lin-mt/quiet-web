import React from 'react';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { message, notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import type { ResponseError } from 'umi-request';
import { queryCurrent } from './services/system/QuiteUser';
import defaultSettings from '../config/defaultSettings';
import type { Result } from '@/types/Result';
import { ResultType } from '@/types/Result';
import { Constant as RC } from '@/constant/ResultCode';
import { Constant as RU } from '@/constant/RouteUrl';

/**
 * 获取用户信息比较慢的时候会展示一个 loading
 */
export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: SystemEntities.QuiteUser;
  fetchUserInfo?: () => Promise<Result<SystemEntities.QuiteUser> | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await queryCurrent();
    } catch (error) {
      history.push('/login');
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/login') {
    const result = await fetchUserInfo();
    const currentUser = result?.data;
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== '/login') {
        history.push('/login');
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

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

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求出错`,
      description: `错误码 ${status}：${errorText} ${url}`,
    });
  }
  throw error;
};

export const request: RequestConfig = {
  errorHandler,
  responseInterceptors: [
    async (response) => {
      const data: Result<any> = await response.clone().json();
      if (data) {
        if (data.result && data.message) {
          switch (data.result) {
            case ResultType.SUCCESS:
              message.success(data.message);
              break;
            case ResultType.WARNING:
              message.warning(data.message);
              break;
            case ResultType.FAILURE:
              message.error(`${data.code ? `错误码：${data.code} ` : ` `} ${data.message}`);
              // eslint-disable-next-line no-console
              console.error(data);
              throw new Error();
            case ResultType.EXCEPTION:
              message.error(`${data.code ? `异常码：${data.code} ` : ` `} ${data.message}`);
              // eslint-disable-next-line no-console
              console.error(data);
              throw new Error();
            default:
          }
        }
        if (data.code) {
          if (RC.NO_LOGIN === data.code && history.location.pathname !== RU.LOGIN) {
            history.push(RU.LOGIN);
          }
        }
      }
      return response;
    },
  ],
};

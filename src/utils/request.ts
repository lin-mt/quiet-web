import qs from 'qs';
import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-react';
import { BasicCode, LocalStorage, Security } from '@/constant/system';

enum ResultType {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  FAILURE = 'FAILURE',
  EXCEPTION = 'EXCEPTION',
}

export type Result<T> = {
  result: ResultType;
  code: string;
  message?: string;
  data: T;
};

export type PageResult<T> = {
  content: T[];
  total_pages: number;
  total_elements: number;
};

const successMsg = new Set<string>();
const failureMsg = new Set<string>();
const warningMsg = new Set<string>();

const req = axios.create();

req.defaults.baseURL = '/api';

const refreshToken = (): Promise<{ token_expire_time }> => {
  const tokenInfoItem = localStorage.getItem(LocalStorage.TokenInfo);
  if (tokenInfoItem) {
    const tokenInfo = JSON.parse(tokenInfoItem);
    const refreshTokenData = {
      grant_type: Security.RefreshToken,
      refresh_token: tokenInfo.refresh_token,
    };
    return axios.post('/api/system/oauth/token', {
      params: refreshTokenData,
      headers: {
        Authorization: BasicCode,
      },
    });
  }
  return Promise.reject('No refresh token information');
};

const retry = (response: AxiosResponse): AxiosPromise => {
  return axios(response.config);
};

req.interceptors.request.use((config) => {
  const tokenInfoItem = localStorage.getItem(LocalStorage.TokenInfo);
  if (tokenInfoItem) {
    const tokenInfo = JSON.parse(tokenInfoItem);
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `${tokenInfo.token_type} ${tokenInfo.access_token}`,
      },
    };
  }
  return config;
});

req.interceptors.response.use(
  (res) => {
    return res;
  },
  async function (error) {
    if (error.response.status === 401) {
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
            localStorage.setItem(
              LocalStorage.TokenInfo,
              JSON.stringify(newTokenInfo)
            );
            return retry(error.response);
          }
        }
      }
      Message.warning('登录信息已过期，请重新登录！');
      localStorage.removeItem(LocalStorage.UserStatus);
      window.location.href = '/login';
    }
    if (error.response.status === 500) {
      Message.error('服务器发生错误，请联系管理员');
    }
    return Promise.reject(error);
  }
);

req.interceptors.response.use((response) => {
  if (
    response.status === 200 &&
    response.headers['content-type'] === 'application/json'
  ) {
    const data: Result<unknown> = response.data;
    if (data) {
      if (data.result && data.message) {
        switch (data.result) {
          case ResultType.SUCCESS:
            successMsg.add(data.message);
            setTimeout(() => {
              successMsg.forEach((msg) => Message.success(msg));
              successMsg.clear();
            }, successMsg.size * 500);
            break;
          case ResultType.WARNING:
            warningMsg.add(data.message);
            setTimeout(() => {
              warningMsg.forEach((msg) => Message.warning(msg));
              warningMsg.clear();
            }, warningMsg.size * 500);
            break;
          case ResultType.FAILURE:
            failureMsg.add(
              `${data.code ? `错误码：${data.code} ` : ` `}\r\n${data.message}`
            );
            setTimeout(() => {
              failureMsg.forEach((msg) => Message.error(msg));
              failureMsg.clear();
            }, failureMsg.size * 500);
            break;
          case ResultType.EXCEPTION:
            Message.error(
              `${data.code ? `异常码：${data.code}` : ``}\n异常信息：${
                data.message
              }`
            );
            Promise.reject(
              `${data.code ? `异常码：${data.code}` : ``}\n异常信息：${
                data.message
              }`
            );
            break;
          default:
            return response;
        }
      }
    }
  }
  return response;
});

function GET<T>(
  url: string,
  params?: Record<string, unknown> | URLSearchParams
): Promise<T> {
  return req
    .get<Result<T>>(url, {
      method: 'GET',
      params: new URLSearchParams(
        qs.stringify(params, { allowDots: true, arrayFormat: 'comma' })
      ),
    })
    .then((resp) => resp.data.data);
}

function PAGE<T>(
  url: string,
  params?: Record<string, unknown> | URLSearchParams
): Promise<PageResult<T>> {
  return GET<PageResult<T>>(url, params).then((res) => {
    return res;
  });
}

function POST<T>(url: string, data?): Promise<T> {
  return req.post<Result<T>>(url, data).then((resp) => resp.data.data);
}

function DELETE<T>(url: string): Promise<T> {
  return req.delete<Result<T>>(url).then((resp) => {
    if (resp.data) {
      return resp.data.data;
    }
    return null;
  });
}

function PUT<T>(url: string, data?): Promise<T> {
  return req.put<Result<T>>(url, data).then((resp) => resp.data.data);
}

export { GET, PAGE, POST, DELETE, PUT };

export default req;

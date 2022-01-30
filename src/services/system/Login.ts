import { request } from 'umi';
import type { Result } from '@/types/Result';
import { LocalStorage, System } from '@/constant';
import type { TokenInfo } from '@/services/system/EntityType';

export interface LoginParams {
  username: string;
  secret_code: string;
  mobile: string;
  captcha: string;
  type: string;
}

export async function accountLogin(params: LoginParams) {
  return request<Result<any>>('/api/system/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function oauthToken(params: SystemAPI.LoginParams) {
  const oauthData = {
    ...params,
    grant_type: System.GrantType.Password,
  };
  return request<TokenInfo>('/api/system/oauth/token', {
    method: 'POST',
    params: oauthData,
    headers: {
      Authorization: System.BasicCode,
    },
  });
}

/** 发送验证码 POST /api/login/captcha */
export async function getFakeCaptcha(
  params: {
    // query
    /** 手机号 */
    phone?: string;
  },
  options?: Record<string, any>,
) {
  return request<SystemAPI.FakeCaptcha>('/api/login/captcha', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function outLogin() {
  const tokenInfoItem = localStorage.getItem(LocalStorage.TokenInfo);
  if (tokenInfoItem) {
    const tokenInfo = JSON.parse(tokenInfoItem);
    return request('/api/system/oauth/logout', {
      method: 'POST',
      params: {
        access_token: tokenInfo.access_token,
      },
    });
  }
  return null;
}

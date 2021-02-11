import { request } from 'umi';
import type { Result } from '@/types/Result';

export type LoginParams = {
  username: string;
  secretCode: string;
  mobile: string;
  captcha: string;
  type: string;
};

export async function accountLogin(params: LoginParams) {
  return request<Result<any>>('/api/system/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function oauthToken(params: LoginParams) {
  const oauthData = { ...params, password: params.secretCode, grant_type: 'password' };
  return request<SystemEntities.TokenInfo>('/api/system/oauth/token', {
    method: 'POST',
    params: oauthData,
    headers: {
      Authorization: 'Basic cXVpZXQtd2ViOnF1aWV0LXdlYi1wYXNzd29yZA==',
    },
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/api/system/login/outLogin');
}

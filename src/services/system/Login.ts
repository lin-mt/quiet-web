import { request } from 'umi';
import { Result } from '@/types/Result';

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

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/api/system/login/outLogin');
}

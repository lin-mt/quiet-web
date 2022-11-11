// 仅用于线上预览，实际使用中可以将此逻辑删除
import qs from 'query-string';
import { isSSR } from './is';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParamsType = Record<string, any>;

export function getQueryParams(): ParamsType {
  return qs.parseUrl(!isSSR ? window.location.href : '').query;
}

export function updateUrlParam(params) {
  const searchParams = new URLSearchParams();
  if (params) {
    for (const key in params) {
      if (params[key]) {
        searchParams.set(key, params[key]);
      }
    }
  }
  let url = window.location.pathname;
  if (searchParams.toString().length > 0) {
    url = url + '?' + searchParams.toString();
  }
  window.history.pushState(null, null, url);
}

export default function getUrlParams(): ParamsType {
  const params = qs.parseUrl(!isSSR ? window.location.href : '').query;
  const returnParams: ParamsType = {};
  Object.keys(params).forEach((p) => {
    if (params[p] === 'true') {
      returnParams[p] = true;
    }
    if (params[p] === 'false') {
      returnParams[p] = false;
    }
  });
  return returnParams;
}

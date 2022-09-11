import { ReactNode } from 'react';
import { HttpMethod } from '@/service/doc/type';

export function getOrDefault<V>(val: V, def: V): V {
  return val ? val : def;
}

export function expired(expired: boolean): string {
  return expired ? '过期' : '正常';
}

export function locked(locked: boolean) {
  return locked ? '锁定' : '正常';
}

export function enabled(enabled: boolean): string {
  return enabled ? '启用' : '禁用';
}

export function enumToSelectOptions(enumVal): {
  label: ReactNode | string;
  value: string | number;
}[] {
  const options = [];
  Object.entries(enumVal).forEach(([key, value]) => {
    options.push({ label: value, value: key });
  });
  return options;
}

export function booleanOptions(
  trueLabel: string,
  falseLabel: string
): {
  label: ReactNode | string;
  value: string | number;
}[] {
  const options = [];
  options.push({ label: trueLabel, value: true });
  options.push({ label: falseLabel, value: false });
  return options;
}

export function getMethodTagColor(method: string | HttpMethod): string {
  let input: HttpMethod;
  if (typeof method === 'string') {
    input = HttpMethod[method];
  } else {
    input = method;
  }
  let color: string;
  switch (input) {
    case HttpMethod.GET:
      color = 'green';
      break;
    case HttpMethod.HEAD:
      color = 'orange';
      break;
    case HttpMethod.DELETE:
      color = 'red';
      break;
    case HttpMethod.PUT:
      color = 'blue';
      break;
    case HttpMethod.POST:
    // case HttpMethod.CONNECT:
    case HttpMethod.OPTIONS:
    // case HttpMethod.TRACE:
    case HttpMethod.PATCH:
      color = 'orange';
      break;
    default:
      throw new Error('Error HttpMethod');
  }
  return color;
}

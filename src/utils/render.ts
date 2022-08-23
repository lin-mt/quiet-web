import { ReactNode } from 'react';

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
  return enabled ? '启用' : '封禁';
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

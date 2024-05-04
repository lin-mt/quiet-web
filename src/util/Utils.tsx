import { Tag } from 'antd';
import { ReactNode } from 'react';

export function planningStatusLabel(state?: string): string | undefined {
  switch (state) {
    case 'PLANNED':
      return '已规划';
    case 'ONGOING':
      return '进行中';
    case 'DONE':
      return '已完成';
    case 'ARCHIVED':
      return '已归档';
    default:
      return undefined;
  }
}

export type ApiMethodConst =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'TRACE';

export type ApiDocsState = 'DESIGN' | 'DEVELOPING' | 'TESTING' | 'COMPLETED';

export function planningStatusColor(status?: string): string | undefined {
  switch (status) {
    case 'PLANNED':
      return 'blue';
    case 'ONGOING':
      return 'green';
    case 'DONE':
      return 'purple';
    case 'ARCHIVED':
      return '';
    default:
      return undefined;
  }
}

export function methodTag(method: ApiMethodConst): ReactNode {
  switch (method) {
    case 'GET':
      return <Tag color="green">GET</Tag>;
    case 'HEAD':
      return <Tag color="cyan">HEAD</Tag>;
    case 'POST':
      return <Tag color="orange">POST</Tag>;
    case 'PUT':
      return <Tag color="purple">PUT</Tag>;
    case 'PATCH':
      return <Tag color="geekblue">PATCH</Tag>;
    case 'DELETE':
      return <Tag color="red">DELETE</Tag>;
    case 'OPTIONS':
      return <Tag color="default">OPTION</Tag>;
    case 'TRACE':
      return <Tag color="lime">TRACE</Tag>;
  }
}

export function apiDocsStateTag(state: ApiDocsState): ReactNode {
  switch (state) {
    case 'DESIGN':
      return <Tag color="lime">设计中</Tag>;
    case 'DEVELOPING':
      return <Tag color="processing">开发中</Tag>;
    case 'TESTING':
      return <Tag color="orange">测试中</Tag>;
    case 'COMPLETED':
      return <Tag color="success">已完成</Tag>;
  }
}

export enum PlanningStatus {
  PLANNED = 'PLANNED',
  ONGOING = 'ONGOING',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED',
}

export const IdName = { value: 'id', label: 'name' };
export const IdUsername = { value: 'id', label: 'username' };

export enum ApiMethod {
  POST = 'POST',
  GET = 'GET',
  DELETE = 'DELETE',
  PUT = 'PUT',
  HEAD = 'HEAD',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
}

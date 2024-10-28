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

export function toLabelValue<T extends Record<string, string | number>>(
  enumObj: T,
  disableFunc?: (key: string) => boolean,
): { label: string; value: string }[] {
  return Object.entries(enumObj)
    .filter(([, value]) => typeof value === 'string') // 过滤掉数字类型的反向映射
    .map(([key, value]) => ({
      label: value as string,
      value: key,
      disabled: disableFunc ? disableFunc(key) : false,
    }));
}

export enum TriggerAction {
  START_ITERATION = '开始迭代',
  END_ITERATION = '结束迭代',
  CREATE_REQUIREMENT = '创建需求',
  UPDATE_REQUIREMENT = '更新需求',
  UPDATE_REQUIREMENT_STATUS = '需求状态变更',
  DELETE_REQUIREMENT = '删除需求',
  CREATE_TASK = '创建任务',
  UPDATE_TASK = '更新任务',
  UPDATE_TASK_STEP = '任务状态变更',
  DELETE_TASK = '删除任务',
}

export enum RequirementStatus {
  TO_BE_PLANNED = '待规划',
  PLANNED = '规划中',
  PROCESSING = '处理中',
  DONE = '完成',
  CLOSED = '关闭',
}

export enum AutomationAction {
  CREATE_BRANCH = '创建分支',
  DELETE_BRANCH = '删除分支',
  CREATE_PR = '创建 PR',
  CLOSE_PR = '关闭 PR',
  DELETE_PR = '删除 PR',
  CREATE_ISSUE = '创建 issue',
  CLOSE_ISSUE = '关闭 issue',
  DELETE_ISSUE = '删除 issue',
  SEND_EMAIL = '发送邮件',
  FEI_SHU_NOTIFY = '发送飞书通知',
  DING_DING_NOTIFY = '发送钉钉通知',
  WORK_WEI_XIN_NOTIFY = '发送企业微信通知',
  INTERNAL_MESSAGE = '发送站内信',
}

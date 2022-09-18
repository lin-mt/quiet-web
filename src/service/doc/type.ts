/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseEntity, QuietUser, SortableEntity } from '@/service/system/type';

export enum FormParamType {
  TEXT = 'text',
  FILE = 'file',
}

export enum ApiState {
  UNFINISHED = '未完成',
  FINISHED = '已完成',
}

export enum HttpMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
}

export enum QueryParamType {
  STRING = 'string',
  INTEGER = 'integer',
  NUMBER = 'number',
}

export enum HttpProtocol {
  HTTP = 'http',
  HTTPS = 'https',
}

export enum Permission {
  GROUP_LEADER = '组长',
  DEVELOPER = '开发者',
  TESTER = '测试人员',
  VISITOR = '访客',
}

export interface DocProjectGroup extends SortableEntity {
  name: string;
  remark?: string;
}

export interface DocProjectGroupMember extends BaseEntity {
  group_id: string;
  user_id: string;
  username?: string;
  avatar?: string;
  permission: Permission;
}

export interface DocApi extends SortableEntity {
  name: string;
  path: string;
  method: HttpMethod;
  project_id: string;
  author_id: string;
  api_state: ApiState;
  api_group_id: string;
  visitor_ids: string[];
  remark: string;
  visitors: QuietUser[];
  api_group: DocApiGroup;
  author_full_name?: string;
  creator_full_name?: string;
  updater_full_name?: string;
  api_info?: DocApiInfo;
}

export interface FormParam {
  name: string;
  max_length: string;
  min_length: string;
  type: FormParamType;
  required: boolean;
  content_type: string;
  example: string;
  remark: string;
}

export interface Header {
  name: string;
  value: string;
  required: boolean;
  remark?: string;
}

export interface PathParam {
  name: string;
  example: string;
  remark: string;
}

export interface QueryParam {
  name: string;
  max: string;
  min: string;
  type: QueryParamType;
  required: boolean;
  example: string;
  remark: string;
}

export interface DocApiInfo extends BaseEntity {
  api_id: string;
  path_param: PathParam[];
  req_json_body: Record<string, any>;
  req_form: FormParam[];
  req_file: string;
  req_raw: string;
  req_query: QueryParam[];
  headers: Header[];
  resp_json_body: Record<string, any>;
  resp_raw: string;
}

export interface DocApiGroup extends SortableEntity {
  name: string;
  project_id: string;
  children: DocApi[];
}

export interface DocProject extends SortableEntity {
  name: string;
  base_path?: string;
  principal: string;
  group_id?: string;
  visitor_ids: string[];
  principal_name?: string;
  remark?: string;
  visitors: QuietUser[];
}

export interface DocProjectConfig extends BaseEntity {
  name: string;
  base_path: string;
  project_id: string;
  remark: string;
}

export interface Cookie {
  name: string;
  value: string;
}

export interface DocProjectEnv extends BaseEntity {
  name: string;
  project_id: string;
  protocol: HttpProtocol;
  domain?: string;
  headers?: Header[];
  cookies?: Cookie[];
}

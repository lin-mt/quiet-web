/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseEntity, QuietUser, SortableEntity } from '@/service/system/type';

export enum FormParamType {
  TEXT = 'TEXT',
  FILE = 'FILE',
}

export enum ApiState {
  UNFINISHED = 'UNFINISHED',
  FINISHED = 'FINISHED',
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
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  NUMBER = 'NUMBER',
}

export enum HttpProtocol {
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
}

export interface DocProjectGroup extends SortableEntity {
  name: string;
  remark?: string;
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

export interface MyDocProject {
  responsible_projects: DocProject[];
  accessible_projects: DocProject[];
}

export interface ApiDetail {
  api: DocApi;
  api_info?: DocApiInfo;
  visitors?: QuietUser[];
}

export interface Cookie {
  name: string;
  value: string;
}

export interface DocProjectEnv extends BaseEntity {
  name: string;
  project_id: string;
  protocol: HttpProtocol;
  base_path: string;
  headers?: Header[];
  cookies?: Cookie[];
}

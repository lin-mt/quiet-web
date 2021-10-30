import type { BaseEntity, QuietUser, SerialEntity } from '@/services/system/EntityType';
import type { HttpMethod } from '@/services/doc/Enums';
import type { DataNode } from 'rc-tree/lib/interface';
import type { ApiState } from '@/services/doc/Enums';
import type { FormParamType, QueryParamType } from '@/services/doc/Enums';
import type { HttpProtocol } from '@/services/doc/Enums';

export interface DocApi extends SerialEntity, DataNode {
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
  creator_full_name?: string;
}

export interface FormParam {
  name: string;
  max_length: string;
  min_length: string;
  type: FormParamType;
  required: boolean;
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

export interface DocApiGroup extends SerialEntity, DataNode {
  name: string;
  project_id: string;
  children: DocApi[];
}

export interface DocProject extends SerialEntity {
  name: string;
  principal: string;
  visitor_ids: string[];
  principal_name: string;
  remark: string;
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

export interface DocProjectEnvironment extends BaseEntity {
  name: string;
  project_id: string;
  protocol: HttpProtocol;
  base_path: string;
  headers?: Header[];
  cookies?: Cookie[];
}

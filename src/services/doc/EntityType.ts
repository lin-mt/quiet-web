import type {
  BaseEntity,
  ParentEntity,
  QuietUser,
  SerialEntity,
} from '@/services/system/EntityType';
import type { HttpMethod } from '@/services/doc/Enums';
import type { FieldType, FormDataType, QueryType } from '@/services/doc/Enums';
import type { DataNode } from 'rc-tree/lib/interface';
import type { ApiState } from '@/services/doc/Enums';

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
}

export interface DocApiBody extends ParentEntity<DocApiBody> {
  name: string;
  max_length: string;
  min_length: string;
  type: FieldType;
  required: boolean;
  example: string;
  remark: string;
}

export interface DocApiFormData extends BaseEntity {
  name: string;
  max_length: string;
  min_length: string;
  type: FormDataType;
  required: boolean;
  example: string;
  remark: string;
}

export interface DocApiGroup extends SerialEntity, DataNode {
  name: string;
  project_id: string;
  children: DocApi[];
}

export interface DocApiHeader extends BaseEntity {
  name: string;
  value: string;
  example: string;
  required: boolean;
  remark: string;
}

export interface DocApiPathParam extends SerialEntity {
  name: string;
  example: string;
  remark: string;
}

export interface DocApiQuery extends BaseEntity {
  name: string;
  max: string;
  min: string;
  type: QueryType;
  required: boolean;
  example: string;
  remark: string;
}

export interface DocApiResponse extends ParentEntity<DocApiResponse> {
  name: string;
  type: FieldType;
  not_null: boolean;
  example: string;
  remark: string;
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
  visitors?: QuietUser[];
  api_path_param?: DocApiPathParam[];
  api_body?: DocApiBody;
  api_form_data?: DocApiFormData[];
  api_header?: DocApiHeader[];
  api_query?: DocApiQuery[];
  api_response?: DocApiResponse;
}

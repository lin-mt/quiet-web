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
  url: string;
  method: HttpMethod;
  projectId: string;
  authorId: string;
  apiState: ApiState;
  apiGroupId: string;
  visitorIds: string[];
  remark: string;
  visitors: QuietUser[];
  apiGroup: DocApiGroup;
}

export interface DocApiBody extends ParentEntity<DocApiBody> {
  name: string;
  maxLength: string;
  minLength: string;
  type: FieldType;
  required: boolean;
  example: string;
  apiId: string;
  remark: string;
}

export interface DocApiFormData extends BaseEntity {
  name: string;
  maxLength: string;
  minLength: string;
  type: FormDataType;
  required: boolean;
  example: string;
  apiId: string;
  remark: string;
}

export interface DocApiGroup extends SerialEntity, DataNode {
  name: string;
  projectId: string;
  children: DocApi[];
}

export interface DocApiHeader extends BaseEntity {
  name: string;
  value: string;
  example: string;
  required: boolean;
  apiId: string;
  remark: string;
}

export interface DocApiPathParam extends SerialEntity {
  name: string;
  example: string;
  apiId: string;
  remark: string;
}

export interface DocApiQuery extends BaseEntity {
  name: string;
  maxLength: string;
  minLength: string;
  type: QueryType;
  required: boolean;
  example: string;
  apiId: string;
  remark: string;
}

export interface DocApiResponse extends ParentEntity<DocApiResponse> {
  name: string;
  type: FieldType;
  notNull: boolean;
  example: string;
  apiId: string;
  remark: string;
}

export interface DocProject extends SerialEntity {
  name: string;
  principal: string;
  visitorIds: string[];
  principalName: string;
  remark: string;
  visitors: QuietUser[];
}

export interface DocProjectConfig extends BaseEntity {
  name: string;
  baseUrl: string;
  projectId: string;
  remark: string;
}

export interface DocProjectHeader extends BaseEntity {
  name: string;
  value: string;
  projectId: string;
  remark?: string;
}

export interface MyDocProject {
  responsibleProjects: DocProject[];
  accessibleProjects: DocProject[];
}

export interface ApiDetail {
  api: DocApi;
  visitors?: QuietUser[];
  apiPathParam?: DocApiPathParam[];
  apiBody?: DocApiBody;
  apiFormData?: DocApiFormData[];
  apiHeader?: DocApiHeader[];
  apiQuery?: DocApiQuery[];
  apiResponse?: DocApiResponse;
}

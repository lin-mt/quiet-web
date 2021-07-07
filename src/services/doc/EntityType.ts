import type { BaseEntity, ParentEntity, SerialEntity } from '@/services/system/EntityType';
import type { HttpMethod } from '@/services/doc/Enums';
import type { FieldType, FormDataType, QueryType } from '@/services/doc/Enums';

export interface DocApi extends SerialEntity {
  name: string;
  url: string;
  method: HttpMethod;
  authorId: string;
  apiGroupId: string;
  accessor: string[];
  remark: string;
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

export interface DocApiGroup extends ParentEntity<DocApiGroup> {
  name: string;
  projectId: string;
}

export interface DocApiHeader extends BaseEntity {
  name: string;
  value: string;
  required: boolean;
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
  accessor: string[];
  principalName: string;
  remark: string;
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
  remark: string;
}

export interface MyDocProject {
  responsibleProjects: DocProject[];
  accessibleProjects: DocProject[];
}

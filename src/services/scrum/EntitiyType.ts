import type {
  BaseEntity,
  KeyEntity,
  ParentEntity,
  QuietTeam,
  SerialEntity,
} from '@/services/system/EntityType';

export interface AllTemplate {
  templateCreated: ScrumTemplate[];
  templateSelectable: ScrumTemplate[];
}

export interface ScrumProject extends BaseEntity {
  name: string;
  manager: string;
  templateId: string;
  description?: string;
  demandPrefix?: string;
  taskPrefix?: string;
  templateName?: string;
  buildTool?: string;
  managerName?: string;
  teams?: QuietTeam[];
}

export interface ScrumProjectDetail {
  project: ScrumProject;
  teams: QuietTeam[];
}

export interface MyScrumProject {
  projectManaged: ScrumProject[];
  projectInvolved: ScrumProject[];
}

export interface ScrumTemplate extends BaseEntity {
  name: string;
  enabled: boolean;
  remark?: string;
  taskSteps?: ScrumTaskStep[];
  priorities?: ScrumPriority[];
}

export interface ScrumTaskStep extends SerialEntity {
  name: string;
  templateId: string;
  remark?: string;
}

export interface ScrumPriority extends SerialEntity {
  name: string;
  colorHex?: string;
  templateId: string;
  remark?: string;
}

export interface ScrumDemand extends SerialEntity, ParentEntity<ScrumDemand> {
  title: string;
  type: string;
  projectId: string;
  priorityId: string;
  optimizeDemandId?: string;
  executorId?: string;
  startTime?: string;
  endTime?: string;
  remark?: string;
}

export interface ScrumIteration extends SerialEntity {
  name: string;
  versionId: string;
  planStartDate: string;
  planEndDate: string;
  startTime?: string;
  endTime?: string;
  remark?: string;
}

export interface ScrumVersion extends ParentEntity<ScrumVersion>, SerialEntity, KeyEntity {
  name: string;
  projectId: string;
  planStartDate: string;
  planEndDate: string;
  startTime?: string;
  endTime?: string;
  remark?: string;
  iterations?: ScrumIteration[];
}

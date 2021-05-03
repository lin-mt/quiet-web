export interface AllTemplate {
  templateCreated: ScrumTemplate[];
  templateSelectable: ScrumTemplate[];
}

export interface ScrumProject extends SystemEntities.BaseEntity {
  name: string;
  manager: string;
  templateId: string;
  description?: string;
  demandPrefix?: string;
  taskPrefix?: string;
  templateName?: string;
  buildTool?: string;
  managerName?: string;
  teams?: SystemEntities.QuietTeam[];
}

export interface ScrumProjectDetail {
  project: ScrumProject;
  teams: SystemEntities.QuietTeam[];
}

export interface MyScrumProject {
  projectManaged: ScrumProject[];
  projectInvolved: ScrumProject[];
}

export interface ScrumTemplate extends SystemEntities.BaseEntity {
  name: string;
  enabled: boolean;
  remark?: string;
  taskSteps?: ScrumTaskStep[];
  priorities?: ScrumPriority[];
}

export interface ScrumTaskStep extends SystemEntities.SerialEntity {
  name: string;
  templateId: string;
  remark?: string;
}

export interface ScrumPriority extends SystemEntities.SerialEntity {
  name: string;
  colorHex?: string;
  templateId: string;
  remark?: string;
}

export interface ScrumDemand
  extends SystemEntities.SerialEntity,
    SystemEntities.ParentEntity<ScrumDemand> {
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

export interface ScrumIteration extends SystemEntities.SerialEntity {
  name: string;
  versionId: string;
  planStartDate: string;
  planEndDate: string;
  startTime?: string;
  endTime?: string;
  remark?: string;
}

export interface ScrumVersion
  extends SystemEntities.ParentEntity<ScrumVersion>,
    SystemEntities.SerialEntity,
    SystemEntities.KeyEntity {
  name: string;
  projectId: string;
  planStartDate: string;
  planEndDate: string;
  startTime?: string;
  endTime?: string;
  remark?: string;
  iterations?: ScrumIteration[];
}

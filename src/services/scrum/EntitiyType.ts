import type {
  BaseEntity,
  KeyEntity,
  ParentEntity,
  QuietTeam,
  SerialEntity,
} from '@/services/system/EntityType';

export interface AllTemplate {
  template_created: ScrumTemplate[];
  template_selectable: ScrumTemplate[];
}

export interface ScrumProject extends BaseEntity {
  name: string;
  manager: string;
  template_id: string;
  description?: string;
  demand_prefix?: string;
  task_prefix?: string;
  template_name?: string;
  build_tool?: string;
  manager_name?: string;
  teams?: QuietTeam[];
}

export interface ScrumProjectDetail {
  project: ScrumProject;
  teams: QuietTeam[];
}

export interface MyScrumProject {
  project_managed: ScrumProject[];
  project_involved: ScrumProject[];
}

export interface ScrumTemplate extends BaseEntity {
  name: string;
  enabled: boolean;
  remark?: string;
  task_steps?: ScrumTaskStep[];
  priorities?: ScrumPriority[];
}

export interface ScrumTaskStep extends SerialEntity {
  name: string;
  template_id: string;
  remark?: string;
}

export interface ScrumPriority extends SerialEntity {
  name: string;
  color_hex: string;
  template_id: string;
  remark?: string;
}

export interface ScrumDemand extends SerialEntity, ParentEntity<ScrumDemand> {
  title: string;
  type: string;
  project_id: string;
  iteration_id?: string;
  priority_id: string;
  optimize_demand_id?: string;
  start_time?: string;
  end_time?: string;
  remark?: string;
}

export interface ScrumTask extends SerialEntity {
  title: string;
  type: string;
  demand_id: string;
  task_step_id: string;
  executor_id: string;
  participant?: string[];
  pre_task_ids?: string[];
  start_time?: string;
  end_time?: string;
  remark: string;
}

export interface ScrumIteration extends SerialEntity {
  name: string;
  version_id: string;
  plan_start_date: string;
  plan_end_date: string;
  start_time?: string;
  end_time?: string;
  remark?: string;
}

export interface ScrumVersion extends ParentEntity<ScrumVersion>, SerialEntity, KeyEntity {
  name: string;
  project_id: string;
  plan_start_date: string;
  plan_end_date: string;
  start_time?: string;
  end_time?: string;
  remark?: string;
  iterations?: ScrumIteration[];
}

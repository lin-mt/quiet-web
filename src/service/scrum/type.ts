import {
  BaseEntity,
  ParentEntity,
  QuietTeam,
  SortableEntity,
} from '../system/type';

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

export interface ScrumProjectGroup extends SortableEntity {
  name: string;
  remark?: string;
}

export interface ScrumTemplate extends BaseEntity {
  name: string;
  enabled: boolean;
  remark?: string;
  task_steps?: ScrumTaskStep[];
  priorities?: ScrumPriority[];
}

export interface ScrumTaskStep extends SortableEntity {
  name: string;
  template_id: string;
  remark?: string;
}

export interface ScrumPriority extends SortableEntity {
  name: string;
  color_hex: string;
  template_id: string;
  remark?: string;
}

export interface ScrumDemand extends SortableEntity, ParentEntity<ScrumDemand> {
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

export interface ScrumTask extends SortableEntity {
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

export interface ScrumIteration extends SortableEntity {
  name: string;
  version_id: string;
  plan_start_date: string;
  plan_end_date: string;
  start_time?: string;
  end_time?: string;
  remark?: string;
}

export interface ScrumVersion
  extends ParentEntity<ScrumVersion>,
    SortableEntity {
  name: string;
  project_id: string;
  plan_start_date: string;
  plan_end_date: string;
  start_time?: string;
  end_time?: string;
  remark?: string;
  iterations?: ScrumIteration[];
}

declare namespace ScrumEntities {
  import QuietTeam = SystemEntities.QuietTeam;

  export type ScrumProject = SystemEntities.BaseEntity & {
    name: string;
    manager: string;
    description?: string;
    demandPrefix?: string;
    taskPrefix?: string;
    templateId?: string;
    templateName?: string;
    buildTool?: string;
    managerName?: string;
    teams?: QuietTeam[];
  };

  export type ScrumProjectDetail = {
    project: ScrumEntities.ScrumProject;
    teams: SystemEntities.QuietTeam[];
  };

  export type ScrumTemplate = SystemEntities.BaseEntity & {
    name: string;
    enabled: boolean;
    remark?: string;
    taskSteps?: ScrumTaskStep[];
    priorities?: ScrumPriority[];
  };

  export type ScrumTaskStep = SystemEntities.SerialEntity & {
    name: string;
    templateId: string;
    remark?: string;
  };

  export type ScrumPriority = SystemEntities.SerialEntity & {
    name: string;
    colorHex?: string;
    templateId: string;
    remark?: string;
  };

  export type ScrumDemand = SystemEntities.SerialEntity &
    SystemEntities.ParentEntity<ScrumDemand> & {
      title: string;
      type: string;
      projectId: string;
      priorityId: string;
      iterationId?: string;
      optimizeDemandId?: string;
      executorId?: string;
      startTime?: string;
      endTime?: string;
      remark?: string;
    };

  export type ScrumIteration = SystemEntities.SerialEntity & {
    name: string;
    versionId: string;
    planStartDate: string;
    planEndDate: string;
    startTime?: string;
    endTime?: string;
    remark?: string;
  };

  export type ScrumVersion = SystemEntities.ParentEntity<ScrumVersion> &
    SystemEntities.SerialEntity &
    SystemEntities.KeyEntity & {
      name: string;
      projectId: string;
      planStartDate: string;
      planEndDate: string;
      startTime?: string;
      endTime?: string;
      remark?: string;
      iterations?: ScrumIteration[];
    };
}

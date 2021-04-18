declare namespace ScrumEntities {
  import QuietTeam = SystemEntities.QuietTeam;

  export type ScrumProject = SystemEntities.BaseEntity & {
    name: string;
    manager: string;
    description?: string;
    demandPrefix?: string;
    taskPrefix?: string;
    taskTemplateId?: string;
    buildTool?: string;
    managerName?: string;
    teams?: QuietTeam[];
  };

  export type ScrumTemplate = SystemEntities.BaseEntity & {
    name: string;
    enable: boolean;
    remark?: string;
    taskSteps?: ScrumTaskStep[];
  };

  export type ScrumTaskStep = SystemEntities.SerialEntity & {
    name: string;
    templateId: string;
    remark?: string;
  };
}

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

  export type ScrumTemplate = SystemEntities.BaseEntity & {
    name: string;
    enable: boolean;
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
}

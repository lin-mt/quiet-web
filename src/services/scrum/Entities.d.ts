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
}

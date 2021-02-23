declare namespace ScrumEntities {
  export type ScrumProject = SystemEntities.BaseEntity & {
    name: string;
    description?: string;
    demandPrefix?: string;
    taskPrefix?: string;
    taskTemplateId?: string;
    buildTool?: string;
  };
}

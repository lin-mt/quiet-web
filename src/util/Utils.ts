export function planningStatusLabel(state?: string): string | undefined {
  switch (state) {
    case 'PLANNED':
      return '已规划';
    case 'ONGOING':
      return '进行中';
    case 'DONE':
      return '已完成';
    case 'ARCHIVED':
      return '已归档';
    default:
      return undefined;
  }
}

export function planningStatusColor(status?: string): string | undefined {
  switch (status) {
    case 'PLANNED':
      return 'blue';
    case 'ONGOING':
      return 'green';
    case 'DONE':
      return 'purple';
    case 'ARCHIVED':
      return '';
    default:
      return undefined;
  }
}

export enum PlanningStatus {
  PLANNED = 'PLANNED',
  ONGOING = 'ONGOING',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED',
}

import type { ScrumDemand } from '@/services/scrum/EntitiyType';
import { Card, Typography } from 'antd';

interface DemandCardProps {
  demand: ScrumDemand;
  demandTypeLabels: Record<string, string>;
  priorityColors: Record<string, string>;
}

export default ({ demand, demandTypeLabels, priorityColors }: DemandCardProps) => {
  return (
    <Card
      size={'small'}
      hoverable={true}
      style={{
        fontSize: '12px',
        borderWidth: '1px 1px 1px 9px',
        borderStyle: 'solid',
        borderColor: `${priorityColors[demand.priorityId]}`,
        borderImage: 'initial',
        borderRadius: '3px',
      }}
      bodyStyle={{ padding: '9px' }}
    >
      <div>标题：{demand.title}</div>
      <div>类型：{demandTypeLabels[demand.type]}</div>
      <Typography.Paragraph ellipsis={{ rows: 1, tooltip: true }} style={{ margin: '0' }}>
        备注：{demand.remark}
      </Typography.Paragraph>
    </Card>
  );
};

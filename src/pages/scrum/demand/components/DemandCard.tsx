import type { ScrumDemand } from '@/services/scrum/EntitiyType';
import { Card, Typography } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import { PROJECT_DETAIL } from '@/constant/scrum/ModelNames';
import { DICTIONARY } from '@/constant/system/Modelnames';
import { useEffect, useState } from 'react';
import { DictionaryType } from '@/types/Type';

interface DemandCardProps {
  demand: ScrumDemand;
}

export default ({ demand }: DemandCardProps) => {
  const { projectId, priorityColors } = useModel(PROJECT_DETAIL);
  const { getDictionaryLabels } = useModel(DICTIONARY);
  const [demandLabels, setDemandLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    if (projectId) {
      getDictionaryLabels(DictionaryType.DemandType).then((labels) => {
        setDemandLabels(labels);
      });
    }
  }, [getDictionaryLabels, projectId]);

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
      <div>类型：{demandLabels[demand.type]}</div>
      <Typography.Paragraph ellipsis={{ rows: 1, tooltip: true }} style={{ margin: '0' }}>
        备注：{demand.remark}
      </Typography.Paragraph>
    </Card>
  );
};

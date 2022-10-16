import React from 'react';
import { Card, Space, Typography } from '@arco-design/web-react';
import { ScrumDemand } from '@/service/scrum/type';
import styled from 'styled-components';

export type DemandCardProps = {
  demand: ScrumDemand;
  type: string;
  priorityColor: string;
};

const DemandStyleCard = styled(Card)<{ color: string }>`
  font-size: 12px;
  border-width: 1px 1px 1px 9px;
  border-style: solid;
  border-color: ${(props) => props.color};
  border-image: initial;
  border-radius: 3px;
  transition: box-shadow 0.3s, border-color 0.3s;
  &:hover {
    box-shadow: 0 1px 2px -2px rgb(var(--gray-6)),
      0 3px 6px 0 rgb(var(--gray-5)), 0 5px 12px 4px rgb(var(--gray-3));
  }
`;

function DemandCard(props: DemandCardProps) {
  return (
    <DemandStyleCard
      hoverable
      size={'small'}
      bodyStyle={{ padding: 7 }}
      color={props.priorityColor}
    >
      <Space direction={'vertical'} size={3} style={{ width: '100%' }}>
        <Typography.Title
          copyable
          heading={6}
          style={{ marginBottom: 0, fontSize: 14 }}
        >
          {props.demand.title}
        </Typography.Title>
        <Typography.Text>
          类型：
          {props.type}
        </Typography.Text>
        <Typography.Text
          ellipsis={{ rows: 1, showTooltip: true }}
          style={{ marginBottom: 4 }}
        >
          备注：{props.demand.remark}
        </Typography.Text>
      </Space>
    </DemandStyleCard>
  );
}

export default DemandCard;

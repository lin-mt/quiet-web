import React, { useState } from 'react';
import {
  Card,
  Grid,
  Popconfirm,
  Space,
  Typography,
} from '@arco-design/web-react';
import { ScrumDemand } from '@/service/scrum/type';
import styled from 'styled-components';
import { IconDelete, IconEdit } from '@arco-design/web-react/icon';
import DemandForm from '@/components/scrum/DemandForm';
import { QuietFormProps } from '@/components/type';
import { deleteDemand, updateDemand } from '@/service/scrum/demand';

const { Row, Col } = Grid;

export type DemandCardProps = {
  demand: ScrumDemand;
  typeKey2Name: Record<string, string>;
  priorityId2Color: Record<string, string>;
  afterDelete?: () => void;
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

const DemandOperation = styled.div<{ danger: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  transition: all 0.1s;
  &:hover {
    color: ${(props) =>
      props.danger ? 'rgb(var(--danger-6))' : 'rgb(var(--primary-6))'};
    background-color: var(--color-fill-3);
  }
`;

function DemandCard(props: DemandCardProps) {
  const [demand, setDemand] = useState<ScrumDemand>(props.demand);
  const [demandFormProps, setDemandFormProps] =
    useState<QuietFormProps<ScrumDemand>>();

  function handleEditDemand() {
    setDemandFormProps({
      visible: true,
      title: '编辑需求',
      formValues: demand,
      onOk: (values) => {
        return updateDemand(values).then((resp) => {
          setDemand(resp);
          setDemandFormProps({ visible: false });
        });
      },
      onCancel: () => setDemandFormProps({ visible: false }),
    });
  }

  return (
    <DemandStyleCard
      size={'small'}
      bodyStyle={{ padding: 7 }}
      color={props.priorityId2Color[demand.priority_id]}
    >
      <Space direction={'vertical'} size={3} style={{ width: '100%' }}>
        <Row>
          <Col flex={'auto'}>
            <Typography.Title
              copyable
              heading={6}
              style={{ marginBottom: 0, fontSize: 14 }}
              ellipsis={{ rows: 1, showTooltip: true }}
            >
              {demand.title}
            </Typography.Title>
          </Col>
          <Col flex={'39px'}>
            <Space style={{ lineHeight: 1.5, fontSize: 14 }}>
              <DemandOperation onClick={handleEditDemand}>
                <IconEdit />
              </DemandOperation>
              <Popconfirm
                title={'确认删除该需求吗？'}
                onOk={() => {
                  deleteDemand(demand.id).then(() => {
                    if (props.afterDelete) {
                      props.afterDelete();
                    }
                  });
                }}
              >
                <DemandOperation danger>
                  <IconDelete />
                </DemandOperation>
              </Popconfirm>
            </Space>
          </Col>
        </Row>
        <Typography.Text>
          类型：
          {props.typeKey2Name[demand.type]}
        </Typography.Text>
        <Typography.Text
          ellipsis={{ rows: 1, showTooltip: true }}
          style={{ marginBottom: 4 }}
        >
          备注：{demand.remark}
        </Typography.Text>
      </Space>
      <DemandForm projectId={demand.project_id} {...demandFormProps} />
    </DemandStyleCard>
  );
}

export default DemandCard;

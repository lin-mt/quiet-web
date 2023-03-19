import React, { CSSProperties, useState } from 'react';
import {
  Card,
  Grid,
  Popconfirm,
  Space,
  Typography,
} from '@arco-design/web-react';
import { ScrumDemand } from '@/service/scrum/type';
import { IconDelete, IconEdit } from '@arco-design/web-react/icon';
import DemandForm from '@/components/scrum/DemandForm';
import { QuietFormProps } from '@/components/type';
import { deleteDemand, updateDemand } from '@/service/scrum/demand';
import styles from '@/components/scrum/DemandCard/style/index.module.less';

const { Row, Col } = Grid;

export type DemandCardProps = {
  demand: ScrumDemand;
  typeKey2Name: Record<string, string>;
  priorityId2Color: Record<string, string>;
  afterDelete?: () => void;
  afterUpdate?: (demand: ScrumDemand) => void;
  style?: CSSProperties;
};

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
          if (props.afterUpdate) {
            props.afterUpdate(resp);
          }
          setDemand(resp);
          setDemandFormProps({ visible: false });
        });
      },
      onCancel: () => setDemandFormProps({ visible: false }),
    });
  }

  return (
    <Card
      size={'small'}
      className={styles['demand-card']}
      style={{
        borderColor: props.priorityId2Color[demand.priority_id],
        ...props.style,
      }}
      bodyStyle={{ padding: 7 }}
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
              <div
                className={styles['demand-operation']}
                onClick={handleEditDemand}
              >
                <IconEdit />
              </div>
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
                <div className={styles['demand-operation-danger']}>
                  <IconDelete />
                </div>
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
    </Card>
  );
}

export default DemandCard;

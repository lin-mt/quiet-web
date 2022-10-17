import React, { ReactNode, useEffect, useState } from 'react';
import { ScrumDemand } from '@/service/scrum/type';
import { getIteration } from '@/service/scrum/iteration';
import {
  Card,
  Descriptions,
  Empty,
  List,
  Select,
  Typography,
} from '@arco-design/web-react';
import styles from '@/pages/scrum/demand-planning/style/index.module.less';
import DemandCard from '@/components/scrum/DemandCard';
import { listDemand } from '@/service/scrum/demand';

export type IterationPlanningProps = {
  iterationId: string;
  iterations: (
    | string
    | number
    | {
        label: ReactNode | string;
        value: string | number;
        disabled?: boolean;
      }
  )[];
  typeKey2Name: Record<string, string>;
  priorityId2Color: Record<string, string>;
};

function IterationPlanning(props: IterationPlanningProps) {
  const [iterationId, setIterationId] = useState<string>(props.iterationId);
  const [demands, setDemands] = useState<ScrumDemand[]>([]);
  const [description, setDescription] = useState([]);

  useEffect(() => {
    if (!props.iterationId) {
      return;
    }
    getIteration(props.iterationId).then((resp) => {
      setDescription([
        {
          label: '名称',
          value: resp.name,
        },
        {
          label: 'ID',
          value: <Typography.Text copyable>{resp.id}</Typography.Text>,
        },
        {
          label: '计划开始日期',
          value: resp.plan_start_date,
        },
        {
          label: '计划结束日期',
          value: resp.plan_end_date,
        },
        {
          label: '实际开始时间',
          value: resp.start_time,
        },
        {
          label: '实际结束时间',
          value: resp.end_time,
        },
        {
          label: '备注',
          value: resp.remark,
        },
      ]);
    });
    listDemand(props.iterationId).then((resp) => setDemands(resp));
  }, [props.iterationId]);

  return (
    <Card
      bordered
      title={'规划迭代'}
      bodyStyle={{ paddingTop: 10, paddingRight: 3 }}
      extra={
        <Select
          value={iterationId}
          options={props.iterations}
          placeholder={'请选择迭代'}
          style={{ width: 300 }}
          onChange={(value) => setIterationId(value)}
        />
      }
    >
      {!iterationId ? (
        <Empty description={'请选择规划迭代'} />
      ) : (
        <>
          <Descriptions
            border
            column={2}
            data={description}
            style={{ paddingRight: 17 }}
          />
          {Object.keys(props.priorityId2Color).length > 0 && (
            <List
              hoverable
              dataSource={demands}
              style={{ marginTop: 15, maxHeight: 466 }}
              className={styles['demand-pool-card']}
              render={(item, index) => {
                return (
                  <div style={{ marginBottom: 9, marginRight: 17 }} key={index}>
                    <DemandCard
                      demand={item}
                      typeKey2Name={props.typeKey2Name}
                      priorityId2Color={props.priorityId2Color}
                    />
                  </div>
                );
              }}
            />
          )}
        </>
      )}
    </Card>
  );
}

export default IterationPlanning;

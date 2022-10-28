import React, { useState } from 'react';
import { Modal, Space } from '@arco-design/web-react';
import VersionSelect from '@/components/scrum/VersionSelect';

export type NextIterationModalProp = {
  title?: string;
  currentId?: string;
  visible: boolean;
  projectId?: string;
  onOk?: (id: string) => void;
  onCancel?: () => void;
};

function NextIterationModal(props: NextIterationModalProp) {
  const [iterationId, setIterationId] = useState<string>();
  const [error, setError] = useState<boolean>();

  return (
    <Modal
      title={props.title}
      style={{ width: 600 }}
      visible={props.visible}
      onConfirm={() => {
        if (!iterationId) {
          setError(true);
        } else {
          props.onOk(iterationId);
        }
      }}
      onCancel={props.onCancel}
      afterClose={() => {
        setError(false);
        setIterationId(undefined);
      }}
    >
      <Space direction={'vertical'} style={{ width: '100%' }} size={'large'}>
        <div style={{ textAlign: 'center' }}>
          当前迭代中有未完成的需求，请选择要将未完成的需求移动到的下一个迭代。
        </div>
        {props.projectId ? (
          <VersionSelect
            error={error}
            disableIds={[props.currentId]}
            versionSelectable={false}
            iterationAsChildren={true}
            projectId={props.projectId}
            placeholder={'请选择未完成需求的下一个迭代'}
            onChange={(value) => setIterationId(value)}
          />
        ) : (
          '请选择项目'
        )}
      </Space>
    </Modal>
  );
}

export default NextIterationModal;

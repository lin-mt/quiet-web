import type { CSSProperties } from 'react';
import React, { useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { AppstoreAddOutlined } from '@ant-design/icons';
import ProjectForm from '@/pages/scrum/project/components/ProjectForm';
import { Form } from 'antd';
import { OperationType } from '@/types/Type';

export default () => {
  const addIconDefaultStyle = { fontSize: '36px' };

  const addIconOverStyle = {
    fontSize: '39px',
    color: '#1890ff',
  };
  const [projectForm] = Form.useForm();

  const [addIconStyle, setAddIconStyle] = useState<CSSProperties>(addIconDefaultStyle);
  const [projectFormVisible, setProjectFormVisible] = useState<boolean>(false);
  const [projectFormOperationType, setProjectFormOperationType] = useState<OperationType>();

  function handleMouseOver() {
    setAddIconStyle(addIconOverStyle);
  }

  function handleMouseLeave() {
    setAddIconStyle(addIconDefaultStyle);
  }

  function handleNewProjectClick() {
    setProjectFormVisible(true);
    setProjectFormOperationType(OperationType.CREATE);
  }

  return (
    <>
      <ProCard gutter={24} ghost style={{ marginBottom: '24px' }}>
        <ProCard
          layout={'center'}
          bordered={true}
          hoverable={true}
          style={{ height: '150px' }}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          onClick={handleNewProjectClick}
        >
          <AppstoreAddOutlined style={addIconStyle} />
        </ProCard>
        <ProCard bordered={true} hoverable={true}>
          Responsive
        </ProCard>
        <ProCard bordered={true} hoverable={true}>
          Responsive
        </ProCard>
        <ProCard bordered={true} hoverable={true}>
          Responsive
        </ProCard>
        <ProCard bordered={true} hoverable={true}>
          Responsive
        </ProCard>
      </ProCard>
      {projectFormVisible && (
        <ProjectForm
          visible={projectFormVisible}
          form={projectForm}
          operationType={projectFormOperationType}
          onCancel={() => setProjectFormVisible(false)}
        />
      )}
    </>
  );
};

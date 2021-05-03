import React, { useState } from 'react';
import { SettingFilled } from '@ant-design/icons';
import { Button, Form, Input, Popover, Select } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { updateProject } from '@/services/scrum/ScrumProject';
import type { ScrumProject } from '@/services/scrum/EntitiyType';

interface ProjectSettingProps {
  projectInfo: ScrumProject;
  form: FormInstance;
  afterSettingUpdate?: () => void;
}

const ProjectSetting: React.FC<ProjectSettingProps> = (props) => {
  const { Option } = Select;
  const { projectInfo, form, afterSettingUpdate } = props;
  const [projectSettingFormVisible, setProjectSettingFormVisible] = useState<boolean>(false);

  async function handleSettingUpdateClick() {
    const values = await form.validateFields();
    await updateProject({
      ...projectInfo,
      ...values,
      teamIds: projectInfo.teams?.map((team) => team.id),
    });
    if (afterSettingUpdate) {
      afterSettingUpdate();
    }
    setProjectSettingFormVisible(false);
  }

  return (
    <Popover
      placement={'bottom'}
      visible={projectSettingFormVisible}
      onVisibleChange={(visible) => setProjectSettingFormVisible(visible)}
      trigger={'click'}
      content={
        <Form form={form} name={'projectForm'} labelCol={{ span: 7 }}>
          <Form.Item label={'构建工具'} name={'buildTool'}>
            <Select placeholder={'请选择'} allowClear>
              <Option value="MAVEN">Maven</Option>
              <Option value="GRADLE">Gradle</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={'需求前缀'}
            name={'demandPrefix'}
            rules={[{ max: 6, message: '需求前缀长度不能超过 6' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label={'任务前缀'}
            name={'taskPrefix'}
            rules={[{ max: 6, message: '任务前缀长度不能超过 6' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label={' '} colon={false} style={{ margin: '0px' }}>
            <Button onClick={() => form.setFieldsValue(projectInfo)}>重置</Button>
            <Button type="primary" style={{ float: 'right' }} onClick={handleSettingUpdateClick}>
              修改
            </Button>
          </Form.Item>
        </Form>
      }
    >
      <SettingFilled
        style={{ width: '100%' }}
        key="setting"
        onClick={() => {
          form.setFieldsValue(projectInfo);
          setProjectSettingFormVisible(!projectSettingFormVisible);
        }}
      />
    </Popover>
  );
};

export default ProjectSetting;

import React, { useContext, useEffect } from 'react';
import { Button, Form, Input, Typography } from '@arco-design/web-react';
import UserSelect from '@/components/UserSelect';
import ProjectGroupSelect from '@/components/doc/ProjectGroupSelect';
import {
  ApiManagerContext,
  ApiManagerContextProps,
} from '@/pages/doc/api-manager';
import { IconSave } from '@arco-design/web-react/icon';
import { updateProject } from '@/service/doc/project';

const { useForm } = Form;

function Project() {
  const { setLoading, queryParams, projectInfo, setProjectInfo } =
    useContext<ApiManagerContextProps>(ApiManagerContext);
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue(projectInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(projectInfo)]);

  function handleOnSubmit() {
    setLoading(true);
    form.validate().then((value) => {
      updateProject(value)
        .then((res) => {
          setProjectInfo(res);
        })
        .finally(() => setLoading(false));
    });
  }

  return (
    <Form
      form={form}
      id={'setting-project-form'}
      style={{ width: 800 }}
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 21 }}
      initialValues={projectInfo}
      onSubmit={handleOnSubmit}
    >
      <Form.Item hidden field="id">
        <Input />
      </Form.Item>
      <Form.Item label={'项目ID'}>
        <Typography.Text copyable>{queryParams.project_id}</Typography.Text>
      </Form.Item>
      <Form.Item
        label="项目名称"
        field="name"
        rules={[
          { required: true, message: '请输入项目名称' },
          { maxLength: 30, message: '项目名称长度不能超过 30' },
        ]}
      >
        <Input placeholder="请输入项目名称" />
      </Form.Item>
      <Form.Item
        label="负责人"
        field="principal"
        rules={[{ required: true, message: '请选择项目负责人' }]}
      >
        <UserSelect placeholder="请选择项目负责人" />
      </Form.Item>
      <Form.Item
        label="基本路径"
        field="base_path"
        rules={[{ maxLength: 30, message: '基本路径长度不能超过 30' }]}
      >
        <Input placeholder="请输入基本路径" />
      </Form.Item>
      <Form.Item label="所属分组" field="group_id">
        <ProjectGroupSelect placeholder={'请选择项目分组'} />
      </Form.Item>
      <Form.Item
        label="备注"
        field="remark"
        rules={[{ maxLength: 100, message: '备注信息长度不能超过 100' }]}
      >
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 5 }}
          placeholder="请输入备注信息"
        />
      </Form.Item>
      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
        <Button type={'primary'} icon={<IconSave />} htmlType={'submit'}>
          保 存
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Project;

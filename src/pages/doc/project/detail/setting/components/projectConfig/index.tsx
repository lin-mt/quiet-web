import { Button, Form, Input } from 'antd';
import { DebounceSelect } from '@/pages/components/DebounceSelect';
import { listUsersByName } from '@/services/system/QuietUser';
import { useEffect, useState } from 'react';
import { getProjectInfo, updateProject } from '@/services/doc/DocProject';
import { SaveOutlined } from '@ant-design/icons';

interface ProjectConfigProp {
  projectId: string;
}

export default function ProjectConfig(props: ProjectConfigProp) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    getProjectInfo(props.projectId).then((info) => {
      form.setFieldsValue({
        ...info,
        principal: { value: info.principal, label: info.principal_name },
      });
    });
  }, [form, props.projectId]);

  async function findUserByName(name: string) {
    return listUsersByName(name).then((resp) => {
      return resp.map((user) => ({
        label: user.full_name,
        value: user.id,
      }));
    });
  }

  function handleProjectFormFinish(values: any) {
    setSubmitting(true);
    const submitValues = {
      ...values,
      principal: values.principal.value,
      visitor_ids: values.visitors?.map((user: { value: string }) => user.value),
    };
    updateProject({
      ...submitValues,
    }).then(() => setSubmitting(false));
  }

  return (
    <div style={{ width: 800 }}>
      <Form
        form={form}
        name={'projectConfigForm'}
        labelCol={{ span: 3 }}
        onFinish={handleProjectFormFinish}
      >
        <Form.Item label={'项目ID'} name={'id'}>
          <Input
            bordered={false}
            disabled={true}
            style={{ color: 'rgba(0, 0, 0, 0.85)', cursor: 'text', paddingLeft: 0 }}
          />
        </Form.Item>
        <Form.Item label={'接口基本路径'} name={'base_path'}>
          <Input placeholder="请输入基本路径" />
        </Form.Item>
        <Form.Item
          label={'项目名称'}
          name={'name'}
          rules={[
            { required: true, message: '请输入项目名称' },
            { max: 30, message: '项目名称长度不能超过 30' },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label={'负责人'}
          name={'principal'}
          rules={[{ required: true, message: '请选择文档负责人' }]}
        >
          <DebounceSelect placeholder={'请输入负责人用户名/姓名'} fetchOptions={findUserByName} />
        </Form.Item>
        <Form.Item label={'访问者'} name={'visitors'}>
          <DebounceSelect
            mode="multiple"
            placeholder={'请输入访问者用户名/姓名'}
            fetchOptions={findUserByName}
          />
        </Form.Item>
        <Form.Item
          label={'项目备注'}
          name={'remark'}
          rules={[{ max: 100, message: '备注信息长度不能超过 100' }]}
        >
          <Input.TextArea placeholder="请输入备注信息" rows={3} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button type={'primary'} htmlType={'submit'} loading={submitting} icon={<SaveOutlined />}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

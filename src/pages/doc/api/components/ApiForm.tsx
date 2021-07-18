import { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import type { DocApi, DocApiGroup } from '@/services/doc/EntityType';
import { saveApi, updateApi } from '@/services/doc/DocApi';
import { DebounceSelect } from '@/pages/components/DebounceSelect';
import { listApiGroupByProjectIdAndName } from '@/services/doc/DocApiGroup';

interface ApiFormProps {
  visible: boolean;
  projectId: string;
  onCancel: () => void;
  initApiGroups?: DocApiGroup[];
  updateInfo?: DocApi;
  afterAction?: () => void;
}

export default (props: ApiFormProps) => {
  const { visible, projectId, onCancel, initApiGroups, updateInfo, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (updateInfo) {
      form.setFieldsValue({
        ...updateInfo,
      });
    } else {
      form.setFieldsValue(undefined);
    }
  }, [form, updateInfo]);

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    const submitValues = {
      ...values,
      projectId,
      apiGroupIds: values.apiGroupIds?.map((temp: { value: string }) => temp.value),
    };
    if (updateInfo) {
      await updateApi({
        ...updateInfo,
        ...submitValues,
      });
    } else {
      await saveApi(submitValues);
    }
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function getTitle() {
    if (updateInfo) {
      return '更新接口';
    }
    return '新建接口';
  }

  function getSubmitButtonName() {
    if (updateInfo) {
      return '更新';
    }
    return '保存';
  }

  function handleModalCancel() {
    form.setFieldsValue(undefined);
    onCancel();
  }

  function listApiGroupByName(name: string) {
    return listApiGroupByProjectIdAndName(projectId, name).then((resp) => {
      return resp.map((apiGroup) => ({
        label: apiGroup.name,
        value: apiGroup.id,
      }));
    });
  }

  return (
    <Modal
      destroyOnClose
      width={500}
      title={getTitle()}
      visible={visible}
      onCancel={() => handleModalCancel()}
      footer={[
        <Button key={'cancel'} onClick={() => handleModalCancel()}>
          取消
        </Button>,
        <Button
          loading={submitting}
          key={'submit'}
          type={'primary'}
          htmlType={'submit'}
          onClick={handleSubmit}
        >
          {getSubmitButtonName()}
        </Button>,
      ]}
    >
      <Form
        form={form}
        name={'form'}
        labelCol={{ span: 5 }}
        initialValues={{
          apiGroupIds: initApiGroups?.map((apiGroup) => ({
            value: apiGroup.id,
            label: apiGroup.name,
          })),
          method: 'GET',
        }}
      >
        <Form.Item
          label={'接口名称'}
          name={'name'}
          rules={[
            { required: true, message: '请输入接口名称' },
            { max: 30, message: '接口名称长度不能超过 30' },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label={'接口地址'}
          name={'url'}
          rules={[
            { required: true, message: '请输入接口地址' },
            { max: 300, message: '接口地址长度不能超过 300', type: 'string' },
          ]}
        >
          <Input
            addonBefore={
              <Form.Item name="method" noStyle>
                <Select>
                  <Select.Option value={'GET'}>GET</Select.Option>
                  <Select.Option value={'HEAD'}>HEAD</Select.Option>
                  <Select.Option value={'POST'}>POST</Select.Option>
                  <Select.Option value={'PUT'}>PUT</Select.Option>
                  <Select.Option value={'DELETE'}>DELETE</Select.Option>
                  <Select.Option value={'CONNECT'}>CONNECT</Select.Option>
                  <Select.Option value={'OPTIONS'}>OPTIONS</Select.Option>
                  <Select.Option value={'TRACE'}>TRACE</Select.Option>
                  <Select.Option value={'PATCH'}>PATCH</Select.Option>
                </Select>
              </Form.Item>
            }
            placeholder="请输入"
          />
        </Form.Item>
        <Form.Item
          label={'接口分组'}
          name={'apiGroupIds'}
          rules={[{ max: 30, message: '接口分组不能超过 30', type: 'array' }]}
        >
          <DebounceSelect
            mode={'multiple'}
            placeholder="请输入分组名称"
            fetchOptions={listApiGroupByName}
          />
        </Form.Item>
        <Form.Item
          label={'备注'}
          name={'remark'}
          rules={[{ max: 300, message: '备注信息长度不能超过 300' }]}
        >
          <Input.TextArea placeholder="请输入备注信息" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

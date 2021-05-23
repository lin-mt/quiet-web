import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import { saveRoute, updateRoute } from '@/services/system/QuietRoute';
import { multipleSelectTagRender } from '@/utils/RenderUtils';
import type { QuietRoute } from '@/services/system/EntityType';
import { DictionarySelect } from '@/pages/components/DictionarySelect';
import { DictionaryType } from '@/types/Type';

type RouteFormProps = {
  visible: boolean;
  onCancel: () => void;
  updateInfo?: QuietRoute;
  afterAction?: () => void;
};

const RouteForm: React.FC<RouteFormProps> = (props) => {
  const { visible, onCancel, updateInfo, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [inputForSelectValues, setInputForSelectValues] = useState<string[]>();
  const [predicates, setPredicates] = useState<{ key: string; value: string; label: string }[]>();
  const [filters, setFilters] = useState<{ key: string; value: string; label: string }[]>();

  const [form] = Form.useForm();

  useEffect(() => {
    if (updateInfo) {
      setFilters(
        updateInfo.filters?.map((filter) => {
          return {
            key: filter,
            value: filter,
            label: filter,
          };
        }),
      );
      setPredicates(
        updateInfo.predicates?.map((predicate) => {
          return { key: predicate, value: predicate, label: predicate };
        }),
      );
      form.setFieldsValue(updateInfo);
    } else {
      form.setFieldsValue(undefined);
    }
  }, [form, updateInfo]);

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    const submitValues = {
      ...values,
      predicates: predicates?.map((predicate) => {
        return predicate.value;
      }),
      filters: filters?.map((filter) => {
        return filter.value;
      }),
    };
    if (updateInfo) {
      await updateRoute({
        ...updateInfo,
        ...submitValues,
      });
    } else {
      await saveRoute(submitValues);
    }
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function getTitle() {
    if (updateInfo) {
      return '更新网关路由配置';
    }
    return '新建网关路由配置';
  }

  function getSubmitButtonName() {
    if (updateInfo) {
      return '更新';
    }
    return '新增';
  }

  function handleModalCancel() {
    form.setFieldsValue(undefined);
    onCancel();
  }

  function buildOptionByInputValue(value: string) {
    setInputForSelectValues([value]);
  }

  function handlePredicateChange(value: any) {
    setPredicates(value);
    setInputForSelectValues([]);
  }

  function handleFiltersChange(value: any) {
    setFilters(value);
    setInputForSelectValues([]);
  }

  return (
    <Modal
      destroyOnClose
      width={560}
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
      <Form form={form} name={'routeForm'} labelCol={{ span: 5 }}>
        <Form.Item
          label={'网关路由ID'}
          name={'routeId'}
          rules={[
            { required: true, message: '请输入路由ID' },
            { max: 60, message: '路由ID长度不能超过 60' },
          ]}
        >
          <Input placeholder="请输入网关路由ID" />
        </Form.Item>
        <Form.Item
          label={'环境'}
          name={'environment'}
          rules={[{ required: true, message: '请选择路由生效的环境' }]}
        >
          <DictionarySelect
            type={DictionaryType.Environment}
            placeholder={'请选择路由生效的环境'}
          />
        </Form.Item>
        <Form.Item
          label={'URI'}
          name={'uri'}
          rules={[
            { required: true, message: '请输入 uri' },
            { max: 200, message: 'URI 长度不能超过 200' },
          ]}
        >
          <Input placeholder={'请输入 uri'} />
        </Form.Item>
        <Form.Item label="Predicates">
          <Select
            mode="multiple"
            labelInValue
            value={predicates}
            tagRender={multipleSelectTagRender}
            placeholder="请输入predicate配置"
            filterOption={false}
            onSearch={buildOptionByInputValue}
            onChange={handlePredicateChange}
            onBlur={() => setInputForSelectValues([])}
          >
            {inputForSelectValues?.map((value) => (
              <Select.Option key={value} value={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Filters">
          <Select
            mode="multiple"
            labelInValue
            value={filters}
            tagRender={multipleSelectTagRender}
            placeholder="请输入filter配置"
            filterOption={false}
            onSearch={buildOptionByInputValue}
            onChange={handleFiltersChange}
            onBlur={() => setInputForSelectValues([])}
          >
            {inputForSelectValues?.map((value) => (
              <Select.Option key={value} value={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={'备注'}
          name={'remark'}
          rules={[{ max: 300, message: '网关路由的备注信息长度不能超过 300' }]}
        >
          <Input placeholder={'请输入备注信息'} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RouteForm;

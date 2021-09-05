import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { STRING_FORMATS } from '@/pages/components/JsonSchemaEditor/constants';
import { EditorContext } from '@/pages/components/JsonSchemaEditor';
import { Checkbox, Col, Input, InputNumber, Row, Select, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './index.css';
import { useIntl } from 'umi';

interface SchemaStringProp {
  data: any;
}

export default (props: SchemaStringProp) => {
  const intl = useIntl();

  const { data } = props;
  const [checked, setChecked] = useState<boolean>(!_.isUndefined(props.data.enum));

  const format = STRING_FORMATS;

  const context = useContext(EditorContext);

  useEffect(() => {
    setChecked(!_.isUndefined(props.data.enum));
  }, [props.data.enum]);

  const changeOtherValue = (value: any, name: any, changeData: any) => {
    const newData = _.cloneDeep(changeData);
    newData[name] = value;
    context.changeCustomValue(newData);
  };

  const changeEnumOtherValue = (value: any, changeData: any) => {
    const arr = value.split('\n');
    const newData = _.cloneDeep(changeData);
    if (arr.length === 0 || (arr.length === 1 && !arr[0])) {
      delete newData.enum;
      delete newData.enumDesc;
      context.changeCustomValue(newData);
    } else {
      newData.enum = arr;
      context.changeCustomValue(newData);
    }
  };

  const changeEnumDescOtherValue = (value: any, changeData: any) => {
    const newData = _.cloneDeep(changeData);
    newData.enumDesc = value;
    context.changeCustomValue(newData);
  };

  const onChangeCheckBox = (boxChecked: boolean, changeData: any) => {
    setChecked(boxChecked);
    if (!boxChecked) {
      const newData = _.cloneDeep(changeData);
      delete newData.enum;
      delete newData.enumDesc;
      context.changeCustomValue(newData);
    }
  };

  return (
    <div>
      <div className="default-setting">
        {intl.formatMessage({ id: 'components.jsonSchemaEditor.base.setting' })}
      </div>
      <Row className="other-row" align="middle">
        <Col span={4} className="other-label">
          {intl.formatMessage({ id: 'components.jsonSchemaEditor.default' })}：
        </Col>
        <Col span={20}>
          <Input
            value={data.default}
            placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.default' })}
            onChange={(e) => changeOtherValue(e.target.value, 'default', data)}
          />
        </Col>
      </Row>
      <Row className="other-row" align="middle">
        <Col span={12}>
          <Row align="middle">
            <Col span={8} className="other-label">
              {intl.formatMessage({ id: 'components.jsonSchemaEditor.min.length' })}：
            </Col>
            <Col span={16}>
              <InputNumber
                style={{ width: '100%' }}
                value={data.minLength}
                placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.min.length' })}
                onChange={(e) => changeOtherValue(e, 'minLength', data)}
              />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row align="middle">
            <Col span={8} className="other-label">
              {intl.formatMessage({ id: 'components.jsonSchemaEditor.max.length' })}：
            </Col>
            <Col span={16}>
              <InputNumber
                style={{ width: '100%' }}
                value={data.maxLength}
                placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.max.length' })}
                onChange={(e) => changeOtherValue(e, 'maxLength', data)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="other-row" align="middle">
        <Col span={4} className="other-label">
          <span>
            Pattern&nbsp;
            <Tooltip title={intl.formatMessage({ id: 'components.jsonSchemaEditor.pattern' })}>
              <QuestionCircleOutlined />
            </Tooltip>
            &nbsp;：
          </span>
        </Col>
        <Col span={20}>
          <Input
            value={data.pattern}
            placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.pattern' })}
            onChange={(e) => changeOtherValue(e.target.value, 'pattern', data)}
          />
        </Col>
      </Row>
      <Row className="other-row" align="middle">
        <Col span={4} className="other-label">
          <span>
            {`${intl.formatMessage({ id: 'components.jsonSchemaEditor.enum' })} `}
            <Checkbox
              checked={checked}
              onChange={(e) => onChangeCheckBox(e.target.checked, data)}
            />
            &nbsp;：
          </span>
        </Col>
        <Col span={20}>
          <Input.TextArea
            value={data.enum && data.enum.length && data.enum.join('\n')}
            disabled={!checked}
            placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.enum.msg' })}
            autoSize={{ minRows: 2, maxRows: 6 }}
            onChange={(e) => changeEnumOtherValue(e.target.value, data)}
          />
        </Col>
      </Row>
      {checked && (
        <Row className="other-row" align="middle">
          <Col span={4} className="other-label">
            <span>{intl.formatMessage({ id: 'components.jsonSchemaEditor.enum.desc' })}：</span>
          </Col>
          <Col span={20}>
            <Input.TextArea
              value={data.enumDesc}
              disabled={!checked}
              placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.enum.desc.msg' })}
              autoSize={{ minRows: 2, maxRows: 6 }}
              onChange={(e) => changeEnumDescOtherValue(e.target.value, data)}
            />
          </Col>
        </Row>
      )}
      <Row className="other-row" align="middle">
        <Col span={4} className="other-label">
          <span>format：</span>
        </Col>
        <Col span={20}>
          <Select
            showSearch
            style={{ width: 200 }}
            value={data.format}
            allowClear={true}
            dropdownClassName="json-schema-react-editor-adv-modal-select"
            placeholder="Select a format"
            optionFilterProp="children"
            optionLabelProp="value"
            onChange={(e) => changeOtherValue(e, 'format', data)}
            filterOption={(input, option) =>
              option?.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {format.map((item) => {
              return (
                <Select.Option value={item.name} key={item.name}>
                  {item.name} <span className="format-items-title">{item.name}</span>
                </Select.Option>
              );
            })}
          </Select>
        </Col>
      </Row>
    </div>
  );
};

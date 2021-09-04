import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { EditorContext } from '@/pages/components/JsonSchemaEditor';
import { Checkbox, Col, Input, InputNumber, Row, Switch, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './index.css';
import { useIntl } from 'umi';

const { TextArea } = Input;

interface SchemaNumberProp {
  data: any;
}

const changeOtherValue = (value: any, name: any, changeData: any, change: any) => {
  const newData = _.cloneDeep(changeData);
  newData[name] = value;
  change(newData);
};

export default (props: SchemaNumberProp) => {
  const intl = useIntl();
  const { data } = props;

  const [checked, setChecked] = useState<boolean>(!_.isUndefined(props.data.enum));
  const [enumVal, setEnumVal] = useState(
    _.isUndefined(props.data.enum) ? '' : props.data.enum.join('\n'),
  );

  useEffect(() => {
    setEnumVal(_.isUndefined(props.data.enum) ? '' : props.data.enum.join('\n'));
  }, [props.data.enum]);

  const context = useContext(EditorContext);

  const onChangeCheckBox = (boxCchecked: boolean, changeData: any) => {
    setChecked(boxCchecked);
    if (!boxCchecked) {
      const newData = _.cloneDeep(changeData);
      delete newData.enum;
      setEnumVal('');
      context.changeCustomValue(newData);
    }
  };

  const changeEnumOtherValue = (value: any, changeData: any) => {
    setEnumVal(value);
    const newData = _.cloneDeep(changeData);
    const arr = value.split('\n');
    if (arr.length === 0 || (arr.length === 1 && !arr[0])) {
      delete newData.enum;
      context.changeCustomValue(newData);
    } else {
      newData.enum = arr.map((item: string | number) => +item);
      context.changeCustomValue(newData);
    }
  };

  const changeEnumDescOtherValue = (value: any, changeData: any) => {
    const newData = _.cloneDeep(changeData);
    newData.enumDesc = value;
    context.changeCustomValue(newData);
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
            onChange={(e) =>
              changeOtherValue(e.target.value, 'default', data, context.changeCustomValue)
            }
          />
        </Col>
      </Row>
      <Row className="other-row" align="middle">
        <Col span={12}>
          <Row align="middle">
            <Col span={13} className="other-label">
              <span>
                exclusiveMinimum&nbsp;
                <Tooltip
                  title={intl.formatMessage({
                    id: 'components.jsonSchemaEditor.exclusive.minimum',
                  })}
                >
                  <QuestionCircleOutlined style={{ width: '10px' }} />
                </Tooltip>
                &nbsp; :
              </span>
            </Col>
            <Col span={11}>
              <Switch
                checked={data.exclusiveMinimum}
                onChange={(e) =>
                  changeOtherValue(e, 'exclusiveMinimum', data, context.changeCustomValue)
                }
              />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row align="middle">
            <Col span={13} className="other-label">
              <span>
                exclusiveMaximum&nbsp;
                <Tooltip
                  title={intl.formatMessage({
                    id: 'components.jsonSchemaEditor.exclusive.maximum',
                  })}
                >
                  <QuestionCircleOutlined style={{ width: '10px' }} />
                </Tooltip>
                &nbsp; :
              </span>
            </Col>
            <Col span={11}>
              <Switch
                checked={data.exclusiveMaximum}
                onChange={(e) =>
                  changeOtherValue(
                    e,
                    'components.jsonSchemaEditor.exclusive.maximum',
                    data,
                    context.changeCustomValue,
                  )
                }
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="other-row" align="middle">
        <Col span={12}>
          <Row align="middle">
            <Col span={8} className="other-label">
              {intl.formatMessage({ id: 'components.jsonSchemaEditor.minimum' })}：
            </Col>
            <Col span={16}>
              <InputNumber
                value={data.minimum}
                placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.minimum' })}
                onChange={(e) => changeOtherValue(e, 'minimum', data, context.changeCustomValue)}
              />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row align="middle">
            <Col span={8} className="other-label">
              {intl.formatMessage({ id: 'components.jsonSchemaEditor.maximum' })}：
            </Col>
            <Col span={16}>
              <InputNumber
                value={data.maximum}
                placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.maximum' })}
                onChange={(e) => changeOtherValue(e, 'maximum', data, context.changeCustomValue)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="other-row" align="middle">
        <Col span={4} className="other-label">
          <span>
            {`${intl.formatMessage({ id: 'components.jsonSchemaEditor.enum' })} `}
            <Checkbox
              checked={checked}
              onChange={(e) => onChangeCheckBox(e.target.checked, data)}
            />{' '}
            :
          </span>
        </Col>
        <Col span={20}>
          <TextArea
            value={enumVal}
            disabled={!checked}
            placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.enum.msg' })}
            autoSize={{ minRows: 2, maxRows: 6 }}
            onChange={(e) => {
              changeEnumOtherValue(e.target.value, data);
            }}
          />
        </Col>
      </Row>
      {checked && (
        <Row className="other-row" align="middle">
          <Col span={4} className="other-label">
            <span>{intl.formatMessage({ id: 'components.jsonSchemaEditor.enum.desc' })} ：</span>
          </Col>
          <Col span={20}>
            <TextArea
              value={data.enumDesc}
              disabled={!checked}
              placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.enum.desc.msg' })}
              autoSize={{ minRows: 2, maxRows: 6 }}
              onChange={(e) => {
                changeEnumDescOtherValue(e.target.value, data);
              }}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

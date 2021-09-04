import { useContext } from 'react';
import { Col, InputNumber, Row, Switch, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { EditorContext } from '@/pages/components/JsonSchemaEditor';
import './index.css';
import _ from 'lodash';
import { useIntl } from 'umi';

interface SchemaArrayProp {
  data: any;
}

const changeOtherValue = (value: any, name: any, changeData: any, change: any) => {
  const newData = _.cloneDeep(changeData);
  newData[name] = value;
  change(newData);
};

export default (props: SchemaArrayProp) => {
  const intl = useIntl();

  const { data } = props;
  const context = useContext(EditorContext);

  return (
    <div>
      <div className="default-setting">
        {intl.formatMessage({ id: 'components.jsonSchemaEditor.base.setting' })}
      </div>
      <Row className="other-row" align="middle">
        <Col span={6} className="other-label">
          <span>
            uniqueItems&nbsp;
            <Tooltip title={intl.formatMessage({ id: 'components.jsonSchemaEditor.unique.items' })}>
              <QuestionCircleOutlined style={{ width: '10px' }} />
            </Tooltip>
            &nbsp; :
          </span>
        </Col>
        <Col span={18}>
          <Switch
            checked={data.uniqueItems}
            onChange={(e) => changeOtherValue(e, 'uniqueItems', data, context.changeCustomValue)}
          />
        </Col>
      </Row>
      <Row className="other-row" align="middle">
        <Col span={12}>
          <Row align="middle">
            <Col span={12} className="other-label">
              {intl.formatMessage({ id: 'components.jsonSchemaEditor.min.items' })}：
            </Col>
            <Col span={12}>
              <InputNumber
                value={data.minItems}
                placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.min.items' })}
                onChange={(e) => changeOtherValue(e, 'minItems', data, context.changeCustomValue)}
              />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row align="middle">
            <Col span={12} className="other-label">
              {intl.formatMessage({ id: 'components.jsonSchemaEditor.max.items' })}：
            </Col>
            <Col span={12}>
              <InputNumber
                value={data.maxItems}
                placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.max.items' })}
                onChange={(e) => changeOtherValue(e, 'maxItems', data, context.changeCustomValue)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

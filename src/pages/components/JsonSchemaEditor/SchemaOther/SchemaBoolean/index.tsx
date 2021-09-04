import { useContext } from 'react';
import { Col, Row, Select } from 'antd';
import _ from 'lodash';
import { EditorContext } from '@/pages/components/JsonSchemaEditor';
import './index.css';
import { useIntl } from 'umi';

const { Option } = Select;

interface SchemaBooleanProp {
  data: any;
}

const changeOtherValue = (value: any, name: any, changeData: any, change: any) => {
  const newData = _.cloneDeep(changeData);
  newData[name] = value;
  change(newData);
};

export default (props: SchemaBooleanProp) => {
  const intl = useIntl();

  const { data } = props;
  const context = useContext(EditorContext);
  let value;
  if (_.isUndefined(data.default)) {
    value = '';
  } else {
    value = data.default ? 'true' : 'false';
  }

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
          <Select
            value={value}
            onChange={(e) =>
              changeOtherValue(e === 'true', 'default', data, context.changeCustomValue)
            }
            style={{ width: 200 }}
          >
            <Option value="true">true</Option>
            <Option value="false">false</Option>
          </Select>
        </Col>
      </Row>
    </div>
  );
};

import { JSONPATH_JOIN_CHAR, SCHEMA_TYPE } from '@/pages/components/JsonSchemaEditor/constants';
import { Checkbox, Col, Input, Row, Select, Tooltip } from 'antd';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  EditOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import MockSelect from '../../MockSelect';
import type { CSSProperties } from 'react';
import { useContext, useEffect, useState } from 'react';
import { EditorContext } from '@/pages/components/JsonSchemaEditor';
import { useModel } from '@@/plugin-model/useModel';
import _ from 'lodash';
import { mapping } from '@/pages/components/JsonSchemaEditor/SchemaJson';
import './index.css';
import { useIntl } from 'umi';
import { JSON_SCHEMA_EDITOR } from '@/constant/doc/ModelNames';

interface SchemaArrayProp {
  data: any;
  name?: string;
  prefix: string[];
  showEdit: (prefix: any, editorName: any, propertyElement: any, type: undefined) => void;
  showAdv: (prefix1: any[], property: any) => void;
}

export default (props: SchemaArrayProp) => {
  const intl = useIntl();

  const { data, prefix, showAdv, showEdit } = props;

  const { open, changeTypeWithId, changeValueWithId, setOpenValueWithId, addChildFieldWithId } =
    useModel(JSON_SCHEMA_EDITOR);

  const [tagPaddingLeftStyle, setTagPaddingLeftStyle] = useState<CSSProperties>({});
  const [openVal, setOpenVal] = useState();

  const context = useContext(EditorContext);

  useEffect(() => {
    setOpenVal(open[context.schemaId]);
  }, [context.schemaId, open]);

  useEffect(() => {
    const { length } = props.prefix.filter((name) => name !== 'properties');
    setTagPaddingLeftStyle({
      paddingLeft: `${20 * (length + 1)}px`,
    });
  }, [props.prefix]);

  const getPrefix = () => {
    return prefix.concat('items');
  };

  // 修改数据类型
  const handleChangeType = (value: any) => {
    const keys = getPrefix().concat('type');
    changeTypeWithId(context.schemaId, { keys, value });
  };

  // 修改备注信息
  const handleChangeDesc = (e: any) => {
    const key = getPrefix().concat(`description`);
    changeValueWithId(context.schemaId, { keys: key, value: e.target.value });
  };

  // 修改mock信息
  const handleChangeMock = (e: any) => {
    const key = getPrefix().concat('mock');
    changeValueWithId(context.schemaId, { keys: key, value: e ? { mock: e } : '' });
  };

  const handleChangeTitle = (e: any) => {
    const key = getPrefix().concat('title');
    changeValueWithId(context.schemaId, { keys: key, value: e.target.value });
  };

  // 增加子节点
  const handleAddChildField = () => {
    const keyArr = getPrefix().concat('properties');
    addChildFieldWithId(context.schemaId, { keys: keyArr });
    setOpenValueWithId(context.schemaId, { key: keyArr, value: true });
  };

  const handleClickIcon = () => {
    // 数据存储在 properties.name.properties下
    const keyArr = getPrefix().concat('properties');
    setOpenValueWithId(context.schemaId, { key: keyArr });
  };

  const handleShowEdit = (name: string, type?: undefined) => {
    showEdit(getPrefix(), name, data.items[name], type);
  };

  const handleShowAdv = () => {
    showAdv(getPrefix(), data.items);
  };

  const getOpenValue = (jsonPath: any) => {
    return _.get(openVal, jsonPath);
  };

  const { items } = data;
  const prefixArray = prefix.concat('items');

  const prefixArrayStr = prefixArray.concat('properties').join(JSONPATH_JOIN_CHAR);
  const showIcon = getOpenValue([prefixArrayStr]);

  return !_.isUndefined(data.items) ? (
    <div className="array-type">
      <Row className="array-item-type" justify="space-around" align="middle">
        <Col span={8} className="col-item name-item col-item-name" style={tagPaddingLeftStyle}>
          <Row justify="space-around" align="middle">
            <Col flex={'16px'}>
              {items.type === 'object' ? (
                <span className="down-style" onClick={handleClickIcon}>
                  {showIcon ? (
                    <CaretDownOutlined className="icon-object" />
                  ) : (
                    <CaretRightOutlined className="icon-object" />
                  )}
                </span>
              ) : null}
            </Col>
            <Col flex={'auto'}>
              <Input addonAfter={<Checkbox disabled />} disabled value="Items" />
            </Col>
          </Row>
        </Col>
        <Col span={3} className="col-item col-item-type">
          <Select className="type-select-style" onChange={handleChangeType} value={items.type}>
            {SCHEMA_TYPE.map((item) => {
              return (
                <Select.Option value={item} key={item}>
                  {item}
                </Select.Option>
              );
            })}
          </Select>
        </Col>
        {context.isMock && (
          <Col span={3} className="col-item col-item-mock">
            <MockSelect
              schema={items}
              showEdit={() => handleShowEdit('mock', items.type)}
              onChange={handleChangeMock}
            />
          </Col>
        )}
        <Col span={context.isMock ? 4 : 5} className="col-item col-item-mock">
          <Input
            addonAfter={<EditOutlined onClick={() => handleShowEdit('title')} />}
            placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.title' })}
            value={items.title}
            onChange={handleChangeTitle}
          />
        </Col>
        <Col span={context.isMock ? 4 : 5} className="col-item col-item-desc">
          <Input
            addonAfter={<EditOutlined onClick={() => handleShowEdit('description')} />}
            placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.description' })}
            value={items.description}
            onChange={handleChangeDesc}
          />
        </Col>
        <Col span={context.isMock ? 2 : 3} className="col-item col-item-setting">
          <span className="adv-set" onClick={handleShowAdv}>
            <Tooltip
              placement="top"
              title={intl.formatMessage({ id: 'components.jsonSchemaEditor.adv.setting' })}
            >
              <SettingOutlined />
            </Tooltip>
          </span>

          {items.type === 'object' ? (
            <span onClick={handleAddChildField}>
              <Tooltip
                placement="top"
                title={intl.formatMessage({ id: 'components.jsonSchemaEditor.add.child.node' })}
              >
                <PlusOutlined className="plus" />
              </Tooltip>
            </span>
          ) : null}
        </Col>
      </Row>
      <div className="option-formStyle">{mapping(prefixArray, items, showEdit, showAdv)}</div>
    </div>
  ) : (
    <></>
  );
};

import type { CSSProperties } from 'react';
import { useContext, useEffect, useState } from 'react';
import { Row, Col, Select, Checkbox, Input, message, Tooltip } from 'antd';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import { SCHEMA_TYPE } from '@/pages/components/JsonSchemaEditor/constants';
import _ from 'lodash';
import DropPlus from '../DropPlus';
import FieldInput from '../../FieldInput';
import { EditorContext } from '@/pages/components/JsonSchemaEditor';
import MockSelect from '../../MockSelect';
import { mapping } from '@/pages/components/JsonSchemaEditor/SchemaJson';
import './index.css';
import { useIntl } from 'umi';
import { JSON_SCHEMA_EDITOR } from '@/constant/doc/ModelNames';

const { Option } = Select;

interface SchemaItemProp {
  data: any;
  name: string;
  prefix: string[];
  showEdit: (prefix: any, editorName: any, propertyElement: any, type: undefined) => void;
  showAdv: (prefix1: any[], property: any) => void;
}

export default (props: SchemaItemProp) => {
  const intl = useIntl();

  const { data, name, prefix, showAdv, showEdit } = props;

  const {
    open,
    changeTypeWithId,
    changeValueWithId,
    setOpenValueWithId,
    changeNameWithId,
    deleteItemWithId,
    enableRequireWithid,
    addFieldWithId,
  } = useModel(JSON_SCHEMA_EDITOR);

  const [tagPaddingLeftStyle, setTagPaddingLeftStyle] = useState<CSSProperties>({});
  const [openVal, setOpenVal] = useState();

  const context = useContext(EditorContext);

  useEffect(() => {
    const { length } = props.prefix.filter((datum) => datum !== 'properties');
    setTagPaddingLeftStyle({
      paddingLeft: `${20 * (length + 1)}px`,
    });
  }, [props.prefix]);

  useEffect(() => {
    setOpenVal(open[context.schemaId]);
  }, [context.schemaId, open]);

  const getPrefix = (): string[] => {
    return prefix.concat(name);
  };

  // 修改节点字段名
  const handleChangeName = (e: any) => {
    const { value } = e.target;

    if (data.properties[value] && typeof data.properties[value] === 'object') {
      message.error(`The field "${value}" already exists.`).then();
    }

    changeNameWithId(context.schemaId, { keys: prefix, name, value });
  };

  // 修改备注信息
  const handleChangeDesc = (e: { target: { value: any } }) => {
    const key = getPrefix().concat('description');
    changeValueWithId(context.schemaId, { keys: key, value: e.target.value });
  };

  // 修改mock 信息
  const handleChangeMock = (e: any) => {
    const key = getPrefix().concat('mock');
    changeValueWithId(context.schemaId, { keys: key, value: e ? { mock: e } : '' });
  };

  const handleChangeTitle = (e: { target: { value: any } }) => {
    const key = getPrefix().concat('title');
    changeValueWithId(context.schemaId, { keys: key, value: e.target.value });
  };

  // 修改数据类型
  const handleChangeType = (e: any) => {
    const keys = getPrefix().concat('type');
    changeTypeWithId(context.schemaId, { keys, value: e });
  };

  const handleDeleteItem = () => {
    deleteItemWithId(context.schemaId, { keys: getPrefix() });
    enableRequireWithid(context.schemaId, { keys: prefix, name, required: false });
  };

  /*
  展示备注编辑弹窗
  editorName: 弹窗名称 ['description', 'mock']
  type: 如果当前字段是object || array showEdit 不可用
  */
  const handleShowEdit = (editorName: string, type?: undefined) => {
    showEdit(getPrefix(), editorName, data.properties[name][editorName], type);
  };

  const handleShowAdv = () => {
    showAdv(getPrefix(), data.properties[name]);
  };

  //  增加子节点
  const handleAddField = () => {
    addFieldWithId(context.schemaId, { keys: prefix, name });
  };

  // 控制三角形按钮
  const handleClickIcon = () => {
    // 数据存储在 properties.xxx.properties 下
    const keyArr: string[] = getPrefix().concat('properties');
    setOpenValueWithId(context.schemaId, { key: keyArr });
  };

  // 修改是否必须
  const handleEnableRequire = (e: { target: { checked: any } }) => {
    const required = e.target.checked;
    enableRequireWithid(context.schemaId, { keys: prefix, name, required });
  };

  const prefixArray = prefix.concat(name);

  const value = data.properties[name];
  const show = _.get(openVal, prefix);
  const showIcon = _.get(openVal, prefix.concat(name, 'properties'));

  return show ? (
    <div>
      <Row justify="space-around" align="middle">
        <Col span={8} className="col-item name-item col-item-name" style={tagPaddingLeftStyle}>
          <Row justify="space-around" align="middle">
            <Col flex={'16px'}>
              {value.type === 'object' ? (
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
              <FieldInput
                addonAfter={
                  <Tooltip
                    placement="top"
                    title={intl.formatMessage({ id: 'components.jsonSchemaEditor.required' })}
                  >
                    <Checkbox
                      onChange={handleEnableRequire}
                      checked={
                        _.isUndefined(data.required) ? false : data.required.indexOf(name) !== -1
                      }
                    />
                  </Tooltip>
                }
                onChange={handleChangeName}
                value={name}
              />
            </Col>
          </Row>
        </Col>

        <Col span={3} className="col-item col-item-type">
          <Select className="type-select-style" onChange={handleChangeType} value={value.type}>
            {SCHEMA_TYPE.map((item) => {
              return (
                <Option value={item} key={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
        </Col>

        {context.isMock && (
          <Col span={3} className="col-item col-item-mock">
            <MockSelect
              schema={value}
              showEdit={() => handleShowEdit('mock', value.type)}
              onChange={handleChangeMock}
            />
          </Col>
        )}

        <Col span={context.isMock ? 4 : 5} className="col-item col-item-mock">
          <Input
            addonAfter={<EditOutlined onClick={() => handleShowEdit('title')} />}
            placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.title' })}
            value={value.title}
            onChange={handleChangeTitle}
          />
        </Col>

        <Col span={context.isMock ? 4 : 5} className="col-item col-item-desc">
          <Input
            addonAfter={<EditOutlined onClick={() => handleShowEdit('description')} />}
            placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.description' })}
            value={value.description}
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
          <span className="delete-item" onClick={handleDeleteItem}>
            <CloseOutlined className="close" />
          </span>
          {value.type === 'object' ? (
            <DropPlus prefix={prefix} name={name} />
          ) : (
            <span onClick={handleAddField}>
              <Tooltip
                placement="top"
                title={intl.formatMessage({ id: 'components.jsonSchemaEditor.add.sibling.node' })}
              >
                <PlusOutlined className="plus" />
              </Tooltip>
            </span>
          )}
        </Col>
      </Row>
      <div className="option-formStyle">{mapping(prefixArray, value, showEdit, showAdv)}</div>
    </div>
  ) : null;
};

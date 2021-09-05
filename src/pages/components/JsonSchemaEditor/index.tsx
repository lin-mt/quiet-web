import { createContext, useEffect, useState } from 'react';
import { useModel } from '@@/plugin-model/useModel';
import { JSONPATH_JOIN_CHAR, SCHEMA_TYPE } from '@/pages/components/JsonSchemaEditor/constants';
import { Input, Row, Tooltip, Col, Select, Checkbox, Button, Modal, message, Tabs } from 'antd';
import { handleSchema } from '@/pages/components/JsonSchemaEditor/utils';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import MockSelect from './MockSelect';
import SchemaOther from './SchemaOther';
import SchemaJson from './SchemaJson';
import _ from 'lodash';
import './index.css';
import { useIntl } from 'umi';
import { JSON_SCHEMA_EDITOR } from '@/constant/doc/ModelNames';
import Editor from '@monaco-editor/react';
import { createSchema } from 'genson-js';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface EditorContextType {
  getOpenValue: (keys: string[]) => any;
  changeCustomValue: (newValue: any) => void;
  isMock: boolean;
  schemaId: string;
}

export const EditorContext = createContext<EditorContextType>({
  changeCustomValue(): void {},
  getOpenValue(): any {},
  isMock: false,
  schemaId: '',
});

interface EditorProp {
  id: string;
  data?: string;
  onChange?: (e: any) => void;
  showEditor?: boolean;
  isMock?: boolean;
}

export default (props: EditorProp) => {
  const intl = useIntl();

  const {
    schema,
    open,
    initSchemaInfo,
    changeEditorSchemaWithId,
    changeTypeWithId,
    addChildFieldWithId,
    changeValueWithId,
    requireAllWithId,
  } = useModel(JSON_SCHEMA_EDITOR);

  const {
    id,
    showEditor = props.showEditor ? props.showEditor : false,
    isMock = props.isMock ? props.isMock : false,
    onChange = props.onChange ? props.onChange : () => {},
  } = props;

  const [stateVal, setStateVal] = useState<Record<string, any>>({
    visible: false,
    show: true,
    editVisible: false,
    description: '',
    descriptionKey: null,
    advVisible: false,
    itemKey: [],
    curItemCustomValue: null,
    checked: false,
    editorModalName: '', // 弹窗名称 description | mock
    mock: '',
  });
  const [jsonSchemaData, setJsonSchemaData] = useState<string | undefined>();
  const [jsonData, setJsonData] = useState<string | undefined>();
  const [importJsonType, setImportJsonType] = useState<string | null>(null);
  const [openVal, setOpenVal] = useState();
  const [schemaVal, setSchemaVal] = useState<any>();

  useEffect(() => {
    if (typeof props.data === 'string') {
      changeEditorSchemaWithId(id, { value: JSON.parse(props.data) });
    } else {
      initSchemaInfo(id);
    }
  }, []);

  useEffect(() => {
    if (onChange && !_.isEqual(schemaVal, schema[id])) {
      onChange(schema[id]);
    }
  }, [id, onChange, schema, schemaVal]);

  useEffect(() => {
    setOpenVal(open[id]);
  }, [id, open]);

  useEffect(() => {
    if (schema[id]) {
      setSchemaVal(schema[id]);
    }
  }, [id, schema]);

  // json 导入弹窗
  const showModal = () => {
    setStateVal((prevState) => {
      return { ...prevState, visible: true };
    });
  };

  const handleOk = () => {
    if (importJsonType !== 'schema') {
      if (!jsonData) {
        return;
      }
      let jsonObject = null;
      try {
        jsonObject = JSON.parse(jsonData);
      } catch (ex) {
        message.error('json 数据格式有误').then();
        return;
      }
      const jsonDataVal = createSchema(jsonObject);
      changeEditorSchemaWithId(id, { value: jsonDataVal });
    } else {
      if (!jsonSchemaData) {
        return;
      }
      let jsonObject = null;
      try {
        jsonObject = JSON.parse(jsonSchemaData);
      } catch (ex) {
        message.error('json 数据格式有误').then();
        return;
      }
      changeEditorSchemaWithId(id, { value: jsonObject });
    }
    setStateVal((prevState) => {
      return { ...prevState, visible: false };
    });
  };

  const handleCancel = () => {
    setStateVal((prevState) => {
      return { ...prevState, visible: false };
    });
  };

  // Editor 中的数据
  const handleParams = (e: string | undefined) => {
    if (!e) return;
    const jsonValue = handleSchema(JSON.parse(e));
    changeEditorSchemaWithId(id, {
      value: jsonValue,
    });
  };

  // 修改数据类型
  const handleChangeType = (key: any, value: any) => {
    changeTypeWithId(id, { keys: [key], value });
  };

  const handleImportJson = (e: string | undefined) => {
    if (!e) {
      setJsonData(undefined);
    }
    if (typeof e === 'string') {
      setJsonData(e);
    }
  };

  const handleImportJsonSchema = (e: string | undefined) => {
    if (!e) {
      setJsonSchemaData(undefined);
    }
    if (typeof e === 'string') {
      setJsonSchemaData(e);
    }
  };
  // 增加子节点
  const handleAddChildField = (key: any) => {
    addChildFieldWithId(id, { keys: [key] });
    setStateVal((prevState) => {
      return { ...prevState, show: true };
    });
  };

  const clickIcon = () => {
    setStateVal((prevState) => {
      return { ...prevState, show: !prevState.show };
    });
  };

  // 修改备注信息
  const handleChangeValue = (key: any, value: any) => {
    let valueDatum;
    if (key[0] === 'mock') {
      valueDatum = value ? { mock: value } : '';
    } else {
      valueDatum = value;
    }
    changeValueWithId(id, { keys: key, value: valueDatum });
  };

  // 备注/mock弹窗 点击ok 时
  const handleEditOk = (name: any) => {
    setStateVal((prevState) => {
      return { ...prevState, editVisible: false };
    });
    let value = stateVal[name];
    if (name === 'mock') {
      value = value ? { mock: value } : '';
    }
    changeValueWithId(id, { keys: stateVal.descriptionKey, value });
  };

  const handleEditCancel = () => {
    setStateVal((prevState) => {
      return { ...prevState, editVisible: false };
    });
  };

  /*
  展示弹窗modal
  prefix: 节点前缀信息
  name: 弹窗的名称 ['description', 'mock']
  value: 输入值
  type: 如果当前字段是object || array showEdit 不可用
*/
  const showEdit = (prefix: any, name: any, value: any, type?: any) => {
    if (type === 'object' || type === 'array') {
      return;
    }
    const descriptionKey = prefix.concat(name);
    let valDatum: any;
    if (name === 'mock') {
      valDatum = value ? value.mock : '';
    } else {
      valDatum = value;
    }
    setStateVal((prevState) => {
      return {
        ...prevState,
        editVisible: true,
        [name]: valDatum,
        descriptionKey,
        editorModalName: name,
      };
    });
  };

  // 修改备注/mock参数信息
  const changeDesc = (e: any, name: any) => {
    setStateVal((prevState) => {
      return { ...prevState, [name]: e };
    });
  };

  // 高级设置
  const handleAdvOk = () => {
    if (stateVal.itemKey.length === 0) {
      changeEditorSchemaWithId(id, {
        value: stateVal.curItemCustomValue,
      });
    } else {
      changeValueWithId(id, {
        keys: stateVal.itemKey,
        value: stateVal.curItemCustomValue,
      });
    }
    setStateVal((prevState) => {
      return { ...prevState, advVisible: false };
    });
  };

  const handleAdvCancel = () => {
    setStateVal((prevState) => {
      return { ...prevState, advVisible: false };
    });
  };

  const showAdv = (key: any, value: any) => {
    setStateVal((prevState) => {
      return {
        ...prevState,
        advVisible: true,
        itemKey: key,
        curItemCustomValue: value, // 当前节点的数据信息
      };
    });
  };

  //  修改弹窗中的json-schema 值
  const changeCustomValue = (newValue: any) => {
    setStateVal((prevState) => {
      return { ...prevState, curItemCustomValue: newValue };
    });
  };

  const changeCheckBox = (e: any) => {
    setStateVal((prevState) => {
      return { ...prevState, checked: e };
    });
    requireAllWithId(id, e);
  };

  const { visible, editVisible, advVisible, checked, editorModalName } = stateVal;

  const disabled = schemaVal && !(schemaVal.type === 'object' || schemaVal.type === 'array');

  return !schemaVal ? (
    <></>
  ) : (
    <EditorContext.Provider
      value={{
        getOpenValue: (keys) => {
          return _.get(openVal, keys.join(JSONPATH_JOIN_CHAR));
        },
        changeCustomValue,
        isMock,
        schemaId: id,
      }}
    >
      <div className="json-schema-react-editor">
        <Button className="import-json-button" type="primary" onClick={showModal}>
          {intl.formatMessage({ id: 'components.jsonSchemaEditor.import.json' })}
        </Button>
        <Modal
          maskClosable={false}
          visible={visible}
          width={700}
          title={intl.formatMessage({ id: 'components.jsonSchemaEditor.import.json' })}
          onOk={handleOk}
          onCancel={handleCancel}
          className="json-schema-react-editor-import-modal"
          okText={intl.formatMessage({ id: 'components.jsonSchemaEditor.ok' })}
          cancelText={intl.formatMessage({ id: 'components.jsonSchemaEditor.cancel' })}
        >
          <Tabs
            defaultActiveKey="json"
            onChange={(key) => {
              setImportJsonType(key);
            }}
          >
            <TabPane tab="JSON" key="json">
              <Editor
                height={500}
                language={'json'}
                options={{
                  scrollbar: {
                    verticalScrollbarSize: 5,
                  },
                  minimap: {
                    enabled: false,
                  },
                }}
                onChange={handleImportJson}
              />
            </TabPane>
            <TabPane tab="JSON-SCHEMA" key="schema">
              <Editor
                height={500}
                language={'json'}
                options={{
                  scrollbar: {
                    verticalScrollbarSize: 5,
                  },
                  minimap: {
                    enabled: false,
                  },
                }}
                onChange={handleImportJsonSchema}
              />
            </TabPane>
          </Tabs>
        </Modal>

        <Modal
          title={
            <div>
              {editorModalName
                ? intl.formatMessage({ id: `components.jsonSchemaEditor.${editorModalName}` })
                : ''}
              &nbsp;
              {editorModalName === 'mock' && (
                <Tooltip
                  title={intl.formatMessage({ id: 'components.jsonSchemaEditor.mock.link' })}
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/YMFE/json-schema-editor-visual/issues/38"
                  >
                    <QuestionCircleOutlined />
                  </a>
                </Tooltip>
              )}
            </div>
          }
          maskClosable={false}
          visible={editVisible}
          onOk={() => handleEditOk(editorModalName)}
          onCancel={handleEditCancel}
          okText={intl.formatMessage({ id: 'components.jsonSchemaEditor.ok' })}
          cancelText={intl.formatMessage({ id: 'components.jsonSchemaEditor.cancel' })}
        >
          <TextArea
            value={stateVal[editorModalName]}
            placeholder={
              editorModalName
                ? intl.formatMessage({ id: `components.jsonSchemaEditor.${editorModalName}` })
                : ''
            }
            onChange={(e) => changeDesc(e.target.value, editorModalName)}
            autoSize={{ minRows: 6, maxRows: 10 }}
          />
        </Modal>

        {advVisible && (
          <Modal
            title={intl.formatMessage({ id: 'components.jsonSchemaEditor.adv.setting' })}
            maskClosable={false}
            visible={advVisible}
            onOk={handleAdvOk}
            onCancel={handleAdvCancel}
            width={780}
            okText={intl.formatMessage({ id: 'components.jsonSchemaEditor.ok' })}
            cancelText={intl.formatMessage({ id: 'components.jsonSchemaEditor.cancel' })}
            className="json-schema-react-editor-adv-modal"
          >
            <SchemaOther data={JSON.stringify(stateVal.curItemCustomValue, null, 2)} />
          </Modal>
        )}

        <Row>
          {showEditor && (
            <Col span={8}>
              <Editor
                className={'pretty-editor'}
                value={JSON.stringify(schemaVal, null, 2)}
                language={'json'}
                options={{
                  scrollbar: {
                    verticalScrollbarSize: 5,
                  },
                  minimap: {
                    enabled: false,
                  },
                }}
                onChange={handleParams}
              />
            </Col>
          )}
          <Col span={showEditor ? 16 : 24} className="wrapper">
            <Row align="middle">
              <Col span={8} className="col-item name-item col-item-name">
                <Row justify="space-around" align="middle">
                  <Col flex={'16px'}>
                    {schemaVal.type === 'object' ? (
                      <span className="down-style" onClick={clickIcon}>
                        {stateVal.show ? (
                          <CaretDownOutlined className="icon-object" />
                        ) : (
                          <CaretRightOutlined className="icon-object" />
                        )}
                      </span>
                    ) : null}
                  </Col>
                  <Col flex={'auto'}>
                    <Input
                      addonAfter={
                        <Tooltip
                          placement="top"
                          title={intl.formatMessage({
                            id: 'components.jsonSchemaEditor.checked.all',
                          })}
                        >
                          <Checkbox
                            checked={checked}
                            disabled={disabled}
                            onChange={(e) => changeCheckBox(e.target.checked)}
                          />
                        </Tooltip>
                      }
                      disabled
                      value="root"
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={3} className="col-item col-item-type">
                <Select
                  className="type-select-style"
                  onChange={(e) => handleChangeType(`type`, e)}
                  value={schemaVal.type || 'object'}
                >
                  {SCHEMA_TYPE.map((item) => {
                    return (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    );
                  })}
                </Select>
              </Col>
              {props.isMock && (
                <Col span={3} className="col-item col-item-mock">
                  <MockSelect
                    schema={schemaVal}
                    showEdit={() => showEdit([], 'mock', schemaVal.mock, schemaVal.type)}
                    onChange={(value) => handleChangeValue(['mock'], value)}
                  />
                </Col>
              )}
              <Col span={props.isMock ? 4 : 5} className="col-item col-item-mock">
                <Input
                  addonAfter={
                    <EditOutlined onClick={() => showEdit([], 'title', schemaVal.title)} />
                  }
                  placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.title' })}
                  value={schemaVal.title}
                  onChange={(e) => handleChangeValue(['title'], e.target.value)}
                />
              </Col>
              <Col span={props.isMock ? 4 : 5} className="col-item col-item-desc">
                <Input
                  addonAfter={
                    <EditOutlined
                      onClick={() => showEdit([], 'description', schemaVal.description)}
                    />
                  }
                  placeholder={intl.formatMessage({
                    id: 'components.jsonSchemaEditor.description',
                  })}
                  value={schemaVal.description}
                  onChange={(e) => handleChangeValue(['description'], e.target.value)}
                />
              </Col>
              <Col span={2} className="col-item col-item-setting">
                <span className="adv-set" onClick={() => showAdv([], schemaVal)}>
                  <Tooltip
                    placement="top"
                    title={intl.formatMessage({ id: 'components.jsonSchemaEditor.adv.setting' })}
                  >
                    <SettingOutlined />
                  </Tooltip>
                </span>
                {schemaVal.type === 'object' ? (
                  <span onClick={() => handleAddChildField('properties')}>
                    <Tooltip
                      placement="top"
                      title={intl.formatMessage({
                        id: 'components.jsonSchemaEditor.add.child.node',
                      })}
                    >
                      <PlusOutlined className="plus" />
                    </Tooltip>
                  </span>
                ) : null}
              </Col>
            </Row>
            {stateVal.show && <SchemaJson showEdit={showEdit} showAdv={showAdv} />}
          </Col>
        </Row>
      </div>
    </EditorContext.Provider>
  );
};

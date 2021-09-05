import { Dropdown, Menu, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import { useIntl } from 'umi';
import { JSON_SCHEMA_EDITOR } from '@/constant/doc/ModelNames';
import { useContext } from 'react';
import { EditorContext } from '@/pages/components/JsonSchemaEditor';

interface DropPlusProp {
  prefix: string[];
  name: string;
}

export default (props: DropPlusProp) => {
  const intl = useIntl();

  const { prefix, name } = props;

  const { addFieldWithId, addChildFieldWithId, setOpenValueWithId } = useModel(JSON_SCHEMA_EDITOR);

  const context = useContext(EditorContext);

  const menu = (
    <Menu>
      <Menu.Item key={'sibling_node'}>
        <span onClick={() => addFieldWithId(context.schemaId, { keys: prefix, name })}>
          {intl.formatMessage({ id: 'components.jsonSchemaEditor.sibling.node' })}
        </span>
      </Menu.Item>
      <Menu.Item key={'child_node'}>
        <span
          onClick={() => {
            setOpenValueWithId(context.schemaId, {
              key: prefix.concat(name, 'properties'),
              value: true,
            });
            addChildFieldWithId(context.schemaId, { keys: prefix.concat(name, 'properties') });
          }}
        >
          {intl.formatMessage({ id: 'components.jsonSchemaEditor.child.node' })}
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Tooltip
      placement="top"
      title={intl.formatMessage({ id: 'components.jsonSchemaEditor.add.node' })}
    >
      <Dropdown overlay={menu}>
        <PlusOutlined style={{ color: '#2395f1' }} />
      </Dropdown>
    </Tooltip>
  );
};

import { Dropdown, Menu, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import { useIntl } from 'umi';
import { JSON_SCHEMA_EDITOR } from '@/constant/doc/ModelNames';

interface DropPlusProp {
  prefix: string[];
  name: string;
}

export default (props: DropPlusProp) => {
  const intl = useIntl();

  const { prefix, name } = props;

  const { addField, addChildField, setOpenValue } = useModel(JSON_SCHEMA_EDITOR);

  const menu = (
    <Menu>
      <Menu.Item key={'sibling_node'}>
        <span onClick={() => addField({ keys: prefix, name })}>
          {intl.formatMessage({ id: 'components.jsonSchemaEditor.sibling.node' })}
        </span>
      </Menu.Item>
      <Menu.Item key={'child_node'}>
        <span
          onClick={() => {
            setOpenValue({
              key: prefix.concat(name, 'properties'),
              value: true,
            });
            addChildField({ keys: prefix.concat(name, 'properties') });
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

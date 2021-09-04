import { Input, AutoComplete } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { MOCK_SOURCE } from '@/pages/components/JsonSchemaEditor/constants';
import { useIntl } from 'umi';

type MockSelectProp = {
  schema: any;
  showEdit: () => void;
  onChange: (e: any) => void;
};

export default (props: MockSelectProp) => {
  const intl = useIntl();
  const { schema } = props;
  const children = MOCK_SOURCE.map((item) => ({
    label: item.name,
    value: item.mock,
  }));

  return (
    <div>
      <AutoComplete
        className="certain-category-search"
        dropdownMatchSelectWidth={false}
        options={children}
        filterOption={true}
        value={schema.mock ? schema.mock.mock : ''}
        onChange={props.onChange}
        disabled={schema.type === 'object' || schema.type === 'array'}
      >
        <Input
          placeholder={intl.formatMessage({ id: 'components.jsonSchemaEditor.mock' })}
          addonAfter={
            <EditOutlined
              onClick={(e) => {
                e.stopPropagation();
                props.showEdit();
              }}
            />
          }
        />
      </AutoComplete>
    </div>
  );
};

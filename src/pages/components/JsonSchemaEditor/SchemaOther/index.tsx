import SchemaArray from './SchemaArray';
import SchemaBoolean from './SchemaBoolean';
import SchemaNumber from './SchemaNumber';
import SchemaString from './SchemaString';
import { useContext } from 'react';
import { EditorContext } from '@/pages/components/JsonSchemaEditor';
import './index.css';
import Editor from '@monaco-editor/react';
import { useIntl } from 'umi';

interface SchemaOtherProp {
  data: any;
}

const mapping = (data: any) => {
  switch (data.type) {
    case 'string':
      return <SchemaString data={data} />;
    case 'number':
      return <SchemaNumber data={data} />;
    case 'boolean':
      return <SchemaBoolean data={data} />;
    case 'integer':
      return <SchemaNumber data={data} />;
    case 'array':
      return <SchemaArray data={data} />;
    default:
      return <></>;
  }
};

const handleInputEditor = (e: string | undefined, change: any) => {
  if (!e) return;
  change(JSON.parse(e));
};

export default (props: SchemaOtherProp) => {
  const intl = useIntl();

  const { data } = props;
  const optionForm = mapping(JSON.parse(data));

  const context = useContext(EditorContext);

  return (
    <div>
      <div>{optionForm}</div>
      <div className="default-setting">
        {intl.formatMessage({ id: 'components.jsonSchemaEditor.all.setting' })}
      </div>
      <Editor
        value={data}
        height={300}
        language={'json'}
        options={{
          scrollbar: {
            verticalScrollbarSize: 5,
          },
          minimap: {
            enabled: false,
          },
        }}
        onChange={(e) => handleInputEditor(e, context.changeCustomValue)}
      />
    </div>
  );
};

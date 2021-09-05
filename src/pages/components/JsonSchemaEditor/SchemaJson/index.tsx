import SchemaArray from './SchemaArray';
import SchemaObject from './SchemaObject';
import { useModel } from '@@/plugin-model/useModel';
import { JSON_SCHEMA_EDITOR } from '@/constant/doc/ModelNames';
import { useContext, useEffect, useState } from 'react';
import { EditorContext } from '@/pages/components/JsonSchemaEditor';

export const mapping = (name: any, data: any, showEdit: any, showAdv: any) => {
  switch (data.type) {
    case 'array':
      return <SchemaArray prefix={name} data={data} showEdit={showEdit} showAdv={showAdv} />;
    case 'object':
      return (
        <SchemaObject
          prefix={name.concat('properties')}
          data={data}
          showEdit={showEdit}
          showAdv={showAdv}
        />
      );
    default:
      return null;
  }
};

interface SchemaJsonProp {
  showEdit: (prefix: any, editorName: any, propertyElement: any, type: undefined) => void;
  showAdv: (prefix1: any[], property: any) => void;
}

export default (props: SchemaJsonProp) => {
  const { schema } = useModel(JSON_SCHEMA_EDITOR);
  const { showAdv, showEdit } = props;

  const context = useContext(EditorContext);

  const [schemaVal, setSchemaVal] = useState<any>();

  useEffect(() => {
    if (schema[context.schemaId]) {
      setSchemaVal(schema[context.schemaId]);
    }
  }, [context.schemaId, schema]);

  const item = schemaVal ? mapping([], schemaVal, showEdit, showAdv) : '';
  return <div style={{ paddingTop: 8 }}>{item}</div>;
};

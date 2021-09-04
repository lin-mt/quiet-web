import SchemaArray from './SchemaArray';
import SchemaObject from './SchemaObject';
import { useModel } from '@@/plugin-model/useModel';
import { JSON_SCHEMA_EDITOR } from '@/constant/doc/ModelNames';

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

  const item = mapping([], schema, showEdit, showAdv);
  return <div style={{ paddingTop: 8 }}>{item}</div>;
};

import SchemaItem from '../SchemaItem';
import './index.css';

interface SchemaObjectProp {
  data: any;
  name?: string;
  prefix: string[];
  showEdit: (prefix: any, editorName: any, propertyElement: any, type: undefined) => void;
  showAdv: (prefix1: any[], property: any) => void;
}

export default (props: SchemaObjectProp) => {
  const { data, prefix, showEdit, showAdv } = props;
  return (
    <div>
      {Object.keys(data.properties).map((name) => {
        return (
          <SchemaItem
            key={name}
            data={data}
            name={name}
            prefix={prefix}
            showEdit={showEdit}
            showAdv={showAdv}
          />
        );
      })}
    </div>
  );
};

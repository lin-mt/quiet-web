import React from 'react';
import JsonSchemaEditor from '@quiet-front-end/json-schema-editor-arco';
import '@quiet-front-end/json-schema-editor-arco/dist/css/index.css';

export type QuietJsonSchemaEditorProps = {
  value?;
  onChange?;
};

function QuietJsonSchemaEditor(props: QuietJsonSchemaEditorProps) {
  const handleChange = (newValue) => {
    props.onChange && props.onChange(newValue);
  };

  return (
    <JsonSchemaEditor
      data={props.value}
      onChange={(v) => {
        handleChange(v);
      }}
    />
  );
}

export default QuietJsonSchemaEditor;

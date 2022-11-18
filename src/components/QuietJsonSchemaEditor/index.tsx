import React, { useEffect, useState } from 'react';
import JsonSchemaEditor from '@quiet-front-end/json-schema-editor-arco';
import '@quiet-front-end/json-schema-editor-arco/dist/css/index.css';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';

loader.config({ monaco });

export type QuietJsonSchemaEditorProps = {
  value?;
  onChange?;
};

function QuietJsonSchemaEditor(props: QuietJsonSchemaEditorProps) {
  const [value, setValue] = useState();

  const Fresh = (prop) => {
    return (
      <>
        <JsonSchemaEditor data={prop.data} mock onChange={prop.onChange} />
      </>
    );
  };

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return <Fresh data={value} onChange={props.onChange} />;
}

export default QuietJsonSchemaEditor;

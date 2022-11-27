import React from 'react';
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
  return <JsonSchemaEditor data={props.value} mock onChange={props.onChange} />;
}

export default QuietJsonSchemaEditor;

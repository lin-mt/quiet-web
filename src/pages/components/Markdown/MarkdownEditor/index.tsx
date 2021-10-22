import { useState } from 'react';
import { Editor } from '@bytemd/react';
import 'katex/dist/katex.css'; // for plugin-math
import 'bytemd/dist/index.css'; // bytemd 基础样式
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/xcode.css';
import { plugins } from '@/pages/components/Markdown/config';

interface MarkdownEditorProp {
  defaultValue: string;
  onChange?: (value: string) => void;
}

export default function MarkdownEditor(props: MarkdownEditorProp) {
  const [mdVal, setMdVal] = useState<string>(props.defaultValue);

  return (
    <Editor
      value={mdVal}
      plugins={plugins}
      onChange={(value) => {
        setMdVal(value);
        if (props.onChange) {
          props.onChange(value);
        }
      }}
    />
  );
}

import { useEffect, useState } from 'react';
import { Editor } from '@bytemd/react';
import 'katex/dist/katex.css'; // for plugin-math
import 'bytemd/dist/index.css'; // bytemd 基础样式
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/xcode.css';
import './index.css';
import zhHans from 'bytemd/locales/zh_Hans.json';
import { plugins } from '@/pages/components/Markdown/config';

interface MarkdownEditorProp {
  maxLength?: number;
  value?: string;
  onChange?: (value: string) => void;
}

export default function MarkdownEditor(props: MarkdownEditorProp) {
  const [mdVal, setMdVal] = useState<string>('');

  useEffect(() => {
    if (props.value) {
      setMdVal(props.value);
    }
  }, [props.value]);

  return (
    <Editor
      locale={zhHans}
      value={mdVal}
      maxLength={props.maxLength}
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

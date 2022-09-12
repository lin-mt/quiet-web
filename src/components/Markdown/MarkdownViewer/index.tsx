import { Viewer } from '@bytemd/react';
import 'katex/dist/katex.css'; // for plugin-math
import 'bytemd/dist/index.css'; // bytemd 基础样式
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/xcode.css';
import React, { useEffect, useState } from 'react';
import { plugins } from '@/components/Markdown/config';

interface MarkdownViewerProp {
  value: string;
}

export default function MarkdownViewer(props: MarkdownViewerProp) {
  const [mdVal, setMdVal] = useState<string>('');

  useEffect(() => {
    if (props.value) {
      setMdVal(props.value);
    }
  }, [props.value]);

  return <Viewer value={mdVal} plugins={plugins} />;
}

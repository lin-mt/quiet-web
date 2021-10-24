import { Viewer } from '@bytemd/react';
import 'katex/dist/katex.css'; // for plugin-math
import 'bytemd/dist/index.css'; // bytemd 基础样式
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/xcode.css';
import { plugins } from '@/pages/components/Markdown/config';

interface MarkdownViewerProp {
  value: string;
}

export default function MarkdownViewer(props: MarkdownViewerProp) {
  return <Viewer value={props.value} plugins={plugins} />;
}

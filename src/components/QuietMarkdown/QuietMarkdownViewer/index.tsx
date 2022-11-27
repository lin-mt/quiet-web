import React from 'react';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import remarkSlug from 'remark-slug';
import remarkMath from 'remark-math';
import remarkImages from 'remark-images';
import remarkGemoji from 'remark-gemoji';
import emoji from 'remark-emoji';
import ReactMarkdown from 'react-markdown';
import './index.css';
import './github.css';
import './markdown.css';
import 'katex/dist/katex.min.css';
import rehypeMermaid from '@/components/QuietMarkdown/QuietMarkdownViewer/plugin/mermaid';

export type QuietMarkdownViewerProp = {
  value: string;
};

function QuietMarkdownViewer(props: QuietMarkdownViewerProp) {
  const { value } = props;

  return (
    <ReactMarkdown
      className="markdown-body"
      rehypePlugins={[
        rehypeMermaid,
        rehypeKatex,
        [rehypeHighlight, { ignoreMissing: true }],
      ]}
      remarkPlugins={[
        remarkGfm,
        remarkToc,
        remarkSlug,
        remarkMath,
        remarkImages,
        remarkGemoji,
        [emoji, { emoticon: true }],
      ]}
    >
      {value}
    </ReactMarkdown>
  );
}

export default QuietMarkdownViewer;

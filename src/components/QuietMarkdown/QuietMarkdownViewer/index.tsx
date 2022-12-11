import React from 'react';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import remarkSlug from 'remark-slug';
import remarkMath from 'remark-math';
import remarkImages from 'remark-images';
import remarkGemoji from 'remark-gemoji';
import remarkMermaid from 'remark-mermaidjs';
import emoji from 'remark-emoji';
import ReactMarkdown from 'react-markdown';
import './index.css';
import './github.css';
import './markdown.css';
import 'katex/dist/katex.min.css';

export type QuietMarkdownViewerProp = {
  value: string;
};

function QuietMarkdownViewer(props: QuietMarkdownViewerProp) {
  const { value } = props;

  return (
    <ReactMarkdown
      className="markdown-body"
      rehypePlugins={[
        rehypeKatex,
        rehypeRaw,
        [rehypeHighlight, { ignoreMissing: true }],
      ]}
      remarkPlugins={[
        remarkGfm,
        remarkToc,
        remarkSlug,
        remarkMath,
        remarkImages,
        remarkGemoji,
        remarkMermaid,
        [emoji, { emoticon: true }],
      ]}
    >
      {value}
    </ReactMarkdown>
  );
}

export default QuietMarkdownViewer;

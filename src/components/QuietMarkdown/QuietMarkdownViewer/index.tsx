import React, { useEffect, useRef } from 'react';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import remarkSlug from 'remark-slug';
import remarkMath from 'remark-math';
import remarkImages from 'remark-images';
import remarkGemoji from 'remark-gemoji';
import emoji from 'remark-emoji';
import ReactMarkdown from 'react-markdown';
import mermaid from 'mermaid';
import './index.css';
import './markdown.css';
import 'katex/dist/katex.min.css';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import codeStyle from './github';

export type QuietMarkdownViewerProp = {
  value: string;
};

function QuietMarkdownViewer(props: QuietMarkdownViewerProp) {
  const { value } = props;
  let count = 0;
  const getCode = (arr = []) =>
    arr
      .map((dt) => {
        if (typeof dt === 'string') {
          return dt;
        }
        if (dt.props && dt.props.children) {
          return getCode(dt.props.children);
        }
        return false;
      })
      .filter(Boolean)
      .join('');

  return (
    <ReactMarkdown
      className="markdown-body"
      components={{
        // eslint-disable-next-line
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          if (
            typeof className === 'string' &&
            /^language-mermaid/.test(className.toLocaleLowerCase())
          ) {
            const code = getCode(children);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const mermaidRef = useRef(null);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const mermaidId = useRef(`mermaid-${count++}`);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
              if (mermaidRef.current) {
                try {
                  mermaidRef.current.innerHTML = mermaid.render(
                    mermaidId.current,
                    code,
                    () => null,
                    mermaidRef.current
                  );
                } catch (error) {
                  mermaidRef.current.innerHTML = error;
                }
              }
            }, [code, mermaidRef]);
            return (
              <code ref={mermaidRef}>
                <code id={mermaidId.current} />
              </code>
            );
          }
          return !inline && match ? (
            <SyntaxHighlighter
              style={codeStyle}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
      rehypePlugins={[rehypeKatex]}
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

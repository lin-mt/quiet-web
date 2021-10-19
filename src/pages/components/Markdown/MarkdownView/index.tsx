import ReactMarkdown from 'react-markdown';
import remarkSlug from 'remark-slug';
import remarkToc from 'remark-toc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github.css';
import 'github-markdown-css/github-markdown.css';

interface MarkdownViewProp {
  value: string;
}

export default function (props: MarkdownViewProp) {
  const remarkPlugins = [remarkSlug, remarkToc, remarkGfm];

  const rehypePlugins = [rehypeHighlight, rehypeRaw];

  return (
    <ReactMarkdown
      className="markdown-body"
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
    >
      {props.value}
    </ReactMarkdown>
  );
}

'use client';

import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { normalizeLlmMarkdown } from '@/lib/utils/normalizeLlmMarkdown';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="m-0 leading-relaxed">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-text-heading">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic">{children}</em>
  ),
  code: ({ children, className }) => {
    const isBlock = Boolean(className);

    if (isBlock) {
      return (
        <code
          className={[
            'block overflow-x-auto rounded-[--radius-md] bg-surface px-3 py-2',
            'font-mono text-xs text-text-heading border border-border',
            className,
          ].join(' ')}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        className={[
          'rounded-[--radius-sm] bg-surface px-1.5 py-0.5',
          'font-mono text-[0.8125rem] font-medium text-text-heading',
          'border border-border align-middle',
        ].join(' ')}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto">{children}</pre>
  ),
  ul: ({ children }) => (
    <ul className="my-1 list-disc space-y-1 pl-4">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-1 list-decimal space-y-1 pl-4">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2 hover:text-primary-hover"
    >
      {children}
    </a>
  ),
};

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const normalized = normalizeLlmMarkdown(content);

  return (
    <div
      data-testid="markdown-content"
      className={['markdown-content space-y-2', className].join(' ')}
    >
      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {normalized}
      </Markdown>
    </div>
  );
}

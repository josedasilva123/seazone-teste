import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  return (
    <div
      className={[
        'markdown-content space-y-2 [&_p]:m-0 [&_p+p]:mt-2',
        '[&_strong]:font-semibold',
        '[&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1',
        '[&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-1',
        '[&_li]:leading-relaxed',
        '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
        className,
      ].join(' ')}
    >
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  );
}

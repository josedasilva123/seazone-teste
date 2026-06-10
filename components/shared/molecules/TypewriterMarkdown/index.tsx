'use client';

import { useEffect, useState } from 'react';
import { splitMarkdownForTypewriter } from '@/lib/utils/markdownTypewriter';
import { MarkdownContent } from '../MarkdownContent';

interface TypewriterMarkdownProps {
  content: string;
  isStreaming?: boolean;
  charDelayMs?: number;
  className?: string;
}

export function TypewriterMarkdown({
  content,
  isStreaming = false,
  charDelayMs = 16,
  className = '',
}: TypewriterMarkdownProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (content.length < visibleCount) {
      setVisibleCount(content.length);
    }
  }, [content.length, visibleCount]);

  useEffect(() => {
    if (charDelayMs === 0) {
      setVisibleCount(content.length);
      return undefined;
    }

    let intervalId = 0;

    intervalId = window.setInterval(() => {
      setVisibleCount((current) => {
        if (current >= content.length) {
          window.clearInterval(intervalId);
          return current;
        }
        return current + 1;
      });
    }, charDelayMs);

    return () => window.clearInterval(intervalId);
  }, [content.length, charDelayMs]);

  const visibleText = content.slice(0, visibleCount);
  const { markdown, typing } = splitMarkdownForTypewriter(visibleText);
  const isTyping = visibleCount < content.length;
  const showCursor = isTyping || (isStreaming && visibleCount === content.length);

  return (
    <div
      data-testid="typewriter-markdown"
      className={['typewriter-markdown', className].filter(Boolean).join(' ')}
    >
      {markdown ? <MarkdownContent content={markdown} /> : null}
      {typing ? (
        <span className="whitespace-pre-wrap leading-relaxed">{typing}</span>
      ) : null}
      {showCursor ? (
        <span
          aria-hidden
          data-testid="typewriter-cursor"
          className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-text-muted align-middle"
        />
      ) : null}
    </div>
  );
}

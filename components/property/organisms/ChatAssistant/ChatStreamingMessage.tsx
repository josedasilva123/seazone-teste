'use client';

import { useEffect, useRef, useState } from 'react';
import { MarkdownContent } from '@/components/shared/molecules/MarkdownContent';

const IS_TEST = process.env.VITEST === 'true';
const REVEAL_INTERVAL_MS = IS_TEST ? 0 : 18;
const CHARS_PER_TICK = IS_TEST ? 10_000 : 2;

interface ChatStreamingMessageProps {
  content: string;
  isNetworkStreaming: boolean;
  onRevealComplete: () => void;
}

export function ChatStreamingMessage({
  content,
  isNetworkStreaming,
  onRevealComplete,
}: ChatStreamingMessageProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (revealedCount >= content.length) return;

    const timer = window.setInterval(() => {
      setRevealedCount((prev) => Math.min(prev + CHARS_PER_TICK, content.length));
    }, REVEAL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [content, revealedCount, content.length]);

  useEffect(() => {
    if (isNetworkStreaming || revealedCount < content.length || completedRef.current) return;

    completedRef.current = true;
    onRevealComplete();
  }, [isNetworkStreaming, revealedCount, content.length, onRevealComplete]);

  const isAnimating = isNetworkStreaming || revealedCount < content.length;

  if (!isAnimating) {
    return <MarkdownContent content={content} />;
  }

  return (
    <span className="whitespace-pre-wrap">
      {content.slice(0, revealedCount)}
      <span
        className="inline-block w-0.5 h-3.5 ml-0.5 bg-text-muted animate-pulse align-text-bottom"
        aria-hidden
      />
    </span>
  );
}

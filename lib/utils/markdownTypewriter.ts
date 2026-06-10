/**
 * Utilitários para efeito typewriter em conteúdo Markdown.
 * Separa trecho seguro (renderizável) do trecho em digitação (texto puro).
 */

function findUnclosedInlineCodeIndex(text: string): number {
  let i = 0;
  let inFence = false;
  let inInlineCode = false;
  let inlineCodeOpen = text.length;

  while (i < text.length) {
    if (text.startsWith('```', i)) {
      inFence = !inFence;
      i += 3;
      continue;
    }

    if (inFence) {
      i += 1;
      continue;
    }

    if (text[i] === '`') {
      if (!inInlineCode) {
        inInlineCode = true;
        inlineCodeOpen = i;
      } else {
        inInlineCode = false;
      }
      i += 1;
      continue;
    }

    i += 1;
  }

  return inInlineCode ? inlineCodeOpen : text.length;
}

function findUnclosedBoldIndex(text: string): number {
  let i = 0;
  let inFence = false;
  let inInlineCode = false;
  let boldOpen = text.length;
  let inBold = false;

  while (i < text.length) {
    if (text.startsWith('```', i)) {
      inFence = !inFence;
      i += 3;
      continue;
    }

    if (inFence) {
      i += 1;
      continue;
    }

    if (text[i] === '`') {
      inInlineCode = !inInlineCode;
      i += 1;
      continue;
    }

    if (inInlineCode) {
      i += 1;
      continue;
    }

    if (text.startsWith('**', i)) {
      if (!inBold) {
        inBold = true;
        boldOpen = i;
      } else {
        inBold = false;
      }
      i += 2;
      continue;
    }

    i += 1;
  }

  return inBold ? boldOpen : text.length;
}

function findUnclosedFenceIndex(text: string): number {
  let i = 0;
  let inFence = false;
  let fenceOpen = text.length;

  while (i < text.length) {
    if (text.startsWith('```', i)) {
      if (!inFence) {
        inFence = true;
        fenceOpen = i;
      } else {
        inFence = false;
      }
      i += 3;
      continue;
    }

    i += 1;
  }

  return inFence ? fenceOpen : text.length;
}

function findUnclosedLinkIndex(text: string): number {
  const linkOpen = text.lastIndexOf('[');
  if (linkOpen === -1) return text.length;

  const suffix = text.slice(linkOpen);
  if (/^\[[^\]]*\]\([^)]*\)/.test(suffix)) return text.length;
  if (/^\[[^\]]*\]?\(?[^)]*$/.test(suffix)) return linkOpen;

  return text.length;
}

function lineHasIncompleteMarkdown(line: string): boolean {
  if (line.startsWith('```')) return true;

  const backticks = (line.match(/`/g) ?? []).length;
  if (backticks % 2 !== 0) return true;

  const boldParts = line.split('**');
  if (boldParts.length >= 2 && boldParts.length % 2 === 0) return true;

  if (/\[[^\]]*$/.test(line)) return true;
  if (/\[[^\]]*\]\([^)]*$/.test(line)) return true;

  return false;
}

function findIncompleteLineCutIndex(text: string): number {
  const lastNewline = text.lastIndexOf('\n');
  if (lastNewline === -1) return text.length;

  const lineStart = lastNewline + 1;
  const lastLine = text.slice(lineStart);

  if (!lastLine || !lineHasIncompleteMarkdown(lastLine)) {
    return text.length;
  }

  return lineStart;
}

function findIncompleteLeadingMarkerIndex(text: string): number {
  if (text.startsWith('**') || text.startsWith('* ')) {
    return text.length;
  }

  if (text.startsWith('*')) {
    return 0;
  }

  return text.length;
}

function findIncompleteListItemStartIndex(text: string): number {
  const lastNewline = text.lastIndexOf('\n');
  const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
  const lastLine = text.slice(lineStart);

  if (lastLine === '*' || /^\*\s/.test(lastLine)) {
    if (lineHasIncompleteMarkdown(lastLine)) {
      return lineStart;
    }
  }

  return text.length;
}

/** Índice onde o texto pode ser cortado sem quebrar Markdown parcial. */
export function findSafeMarkdownCutIndex(text: string): number {
  if (!text) return 0;

  return Math.min(
    text.length,
    findUnclosedFenceIndex(text),
    findUnclosedInlineCodeIndex(text),
    findUnclosedBoldIndex(text),
    findUnclosedLinkIndex(text),
    findIncompleteLeadingMarkerIndex(text),
    findIncompleteListItemStartIndex(text),
    findIncompleteLineCutIndex(text),
  );
}

/** Extrai apenas o texto visível do sufixo incompleto, ocultando sintaxe Markdown. */
export function extractTypingPlainText(unsafeSuffix: string): string {
  if (!unsafeSuffix) return '';

  let text = unsafeSuffix.replace(/^\*\s+/, '').replace(/^\*$/, '');

  if (text.startsWith('[')) {
    const linkMatch = text.match(/^\[([^\]]*)\]?(?:\(([^)]*)?)?$/);
    if (linkMatch) return linkMatch[1] ?? '';
  }

  text = text.replace(/^\*\*/, '').replace(/^`/, '');
  text = text.replace(/\*\*$/, '').replace(/`$/, '');

  return text;
}

export function splitMarkdownForTypewriter(text: string): {
  markdown: string;
  typing: string;
} {
  const cutIndex = findSafeMarkdownCutIndex(text);

  return {
    markdown: text.slice(0, cutIndex),
    typing: extractTypingPlainText(text.slice(cutIndex)),
  };
}

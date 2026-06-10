import { describe, expect, it } from 'vitest';
import {
  extractTypingPlainText,
  findSafeMarkdownCutIndex,
  splitMarkdownForTypewriter,
} from './markdownTypewriter';

describe('findSafeMarkdownCutIndex', () => {
  it('mantém texto plano intacto', () => {
    const text = 'Olá, visitante!';
    expect(findSafeMarkdownCutIndex(text)).toBe(text.length);
  });

  it('corta antes de negrito incompleto', () => {
    const text = 'Centro **Capivari';
    expect(findSafeMarkdownCutIndex(text)).toBe(7);
  });

  it('aceita negrito completo', () => {
    const text = 'Centro **Capivari:** cidade.';
    expect(findSafeMarkdownCutIndex(text)).toBe(text.length);
  });

  it('corta antes de código inline incompleto', () => {
    const text = 'A senha é `paraty';
    expect(findSafeMarkdownCutIndex(text)).toBe(10);
  });

  it('corta antes de link incompleto', () => {
    const text = 'Visite [o site](https://sea';
    expect(findSafeMarkdownCutIndex(text)).toBe(7);
  });

  it('corta linha de lista incompleta', () => {
    const text = '* **Capivari:** centro.\n* **Baden';
    expect(findSafeMarkdownCutIndex(text)).toBe(24);
  });
});

describe('extractTypingPlainText', () => {
  it('remove marcadores de negrito incompleto', () => {
    expect(extractTypingPlainText('**Capivari')).toBe('Capivari');
  });

  it('remove marcador de lista e negrito', () => {
    expect(extractTypingPlainText('* **Baden Baden')).toBe('Baden Baden');
  });

  it('extrai rótulo de link incompleto', () => {
    expect(extractTypingPlainText('[o site')).toBe('o site');
  });

  it('remove backtick de código incompleto', () => {
    expect(extractTypingPlainText('`paraty')).toBe('paraty');
  });
});

describe('splitMarkdownForTypewriter', () => {
  it('separa markdown seguro do trecho digitado', () => {
    expect(splitMarkdownForTypewriter('Centro **Capivari')).toEqual({
      markdown: 'Centro ',
      typing: 'Capivari',
    });
  });

  it('retorna markdown completo quando não há trecho incompleto', () => {
    const text = '**Capivari:** centro da cidade.';
    expect(splitMarkdownForTypewriter(text)).toEqual({
      markdown: text,
      typing: '',
    });
  });
});

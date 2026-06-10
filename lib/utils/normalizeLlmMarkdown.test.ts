import { describe, it, expect } from 'vitest';
import { normalizeLlmMarkdown } from './normalizeLlmMarkdown';

describe('normalizeLlmMarkdown', () => {
  it('converte aspas tipográficas em backticks', () => {
    const input = 'A senha é \u2018paraty2024\u2019.';
    expect(normalizeLlmMarkdown(input)).toBe('A senha é `paraty2024`.');
  });

  it('converte bullets • em listas markdown', () => {
    const input = 'Opções:\n• Item um\n• Item dois';
    expect(normalizeLlmMarkdown(input)).toBe('Opções:\n- Item um\n- Item dois');
  });

  it('preserva backticks ASCII existentes', () => {
    const input = 'A senha do WiFi é `paraty2024`.';
    expect(normalizeLlmMarkdown(input)).toBe(input);
  });
});

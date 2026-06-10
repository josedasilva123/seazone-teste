const SMART_SINGLE_QUOTES = /[\u2018\u2019\u2032\u00B4]/g;

/**
 * Normaliza saídas de LLM para Markdown válido.
 * Corrige aspas tipográficas usadas no lugar de backticks e bullets "•".
 */
export function normalizeLlmMarkdown(text: string): string {
  let result = text.replace(/\r\n/g, '\n');

  result = result.replace(
    /[\u2018\u2019\u2032\u00B4]([^\u2018\u2019\u2032\u00B4\n`]+)[\u2018\u2019\u2032\u00B4]/g,
    '`$1`',
  );

  result = result.replace(/^(\s*)•\s+/gm, '$1- ');

  return result;
}

export function hasSmartQuotes(text: string): boolean {
  return SMART_SINGLE_QUOTES.test(text);
}

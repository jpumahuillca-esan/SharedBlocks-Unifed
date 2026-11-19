const BLOCKED_CONTAINERS = /<\s*(script|style|iframe|object|svg|math|template)\b[^>]*>[\s\S]*?<\/\s*\1\s*>/gi;
const ALLOWED_TAGS = new Set(['span', 'strong', 'b', 'em', 'i', 'u', 's']);
const SAFE_COLOR_RE =
  /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)|var\(--[a-zA-Z0-9_-]+\)|[a-zA-Z]{3,20})$/;

const extractSafeSpanStyle = (rawAttrs: string): string => {
  const styleMatch = rawAttrs.match(/style\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
  const rawStyle = styleMatch ? (styleMatch[1] ?? styleMatch[2] ?? '') : '';
  const colorMatch = rawStyle.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
  const color = colorMatch ? colorMatch[1].trim() : '';
  return color && SAFE_COLOR_RE.test(color) ? ` style="color: ${color}"` : '';
};

/**
 * Sanitiza HTML ligero de títulos enriquecidos de forma determinista tanto en SSR
 * como en cliente para evitar diferencias de hidratación en Vue.
 */
export const sanitizeTitleHtml = (value: unknown): { html: string; text: string } => {
  if (typeof value !== 'string' || !value) return { html: '', text: '' };

  const withoutDangerous = value.replace(BLOCKED_CONTAINERS, '');
  let result = '';
  let lastIndex = 0;
  const tagRe = /<\/?\s*([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g;
  const stack: string[] = [];

  for (const match of withoutDangerous.matchAll(tagRe)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) {
      result += withoutDangerous.slice(lastIndex, idx);
    }
    lastIndex = idx + match[0].length;

    const fullTag = match[0];
    const isClosing = fullTag.startsWith('</');
    const tag = match[1].toLowerCase();
    const attrs = match[2] || '';

    if (tag === 'br') {
      if (!isClosing) result += '<br>';
      continue;
    }

    if (tag === 'p' || tag === 'div') {
      if (isClosing && result.length > 0 && !result.endsWith('<br>')) {
        result += '<br>';
      } else if (!isClosing && result.length > 0 && !result.endsWith('<br>')) {
        result += '<br>';
      }
      continue;
    }

    if (!ALLOWED_TAGS.has(tag)) {
      continue;
    }

    if (isClosing) {
      const openIdx = stack.lastIndexOf(tag);
      if (openIdx !== -1) {
        stack.splice(openIdx, 1);
        result += `</${tag}>`;
      }
    } else {
      stack.push(tag);
      const safeAttrs = tag === 'span' ? extractSafeSpanStyle(attrs) : '';
      result += `<${tag}${safeAttrs}>`;
    }
  }

  if (lastIndex < withoutDangerous.length) {
    result += withoutDangerous.slice(lastIndex);
  }

  while (stack.length > 0) {
    const unclosed = stack.pop();
    if (unclosed) result += `</${unclosed}>`;
  }

  const html = result.replace(/^(?:<br>)+|(?:<br>)+$/g, '').trim();
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();

  return { html, text };
};

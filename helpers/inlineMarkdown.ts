/**
 * Utilidad liviana compartida para dividir párrafos por líneas en blanco (`\n\n`)
 * y resaltar fragmentos `**en negrita**` sin inyectar HTML crudo (`v-html`).
 */

export interface TextSegment {
  text: string;
  bold: boolean;
}

/** Divide una línea de texto en segmentos planos o en negrita (`**texto**`). */
export const parseInlineBold = (line: string): TextSegment[] => {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**') && part.length > 4
        ? { text: part.slice(2, -2), bold: true }
        : { text: part, bold: false },
    );
};

/** Divide un texto largo en párrafos (`\n\n`) con segmentos `**negrita**`. */
export const parseInlineBoldParagraphs = (raw?: string | null): TextSegment[][] => {
  const text = typeof raw === 'string' ? raw.trim() : '';
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(parseInlineBold);
};

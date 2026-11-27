/**
 * Formateador de texto y enlaces enriquecidos para el Chatbot Institucional ESAN
 */
import { appendChatbotUtm, isInternalUrl, type UtmTrackingParams } from './chatbotUtm';

export const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Renderiza el mensaje de texto enriquecido convirtiendo Markdown a HTML
 * Diferencia enlaces internos (para navegación SPA sin recargar) de enlaces externos
 */
export const formatMessage = (text: string, customUtm?: UtmTrackingParams): string => {
  if (!text) return '';
  let safeText = escapeHtml(text.replace(/\r\n/g, '\n'));

  // Si el modelo pegó viñetas en una sola línea (ej: "Perú.* Grado:...* Duración:" o "...entre ellas:•[Adm]"), separarlas en renglones
  safeText = safeText
    .replace(/([.!?])\s*\*\s+([A-ZÁÉÍÓÚÑ])/g, '$1\n* $2')
    .replace(/([.:!?])\s*•\s*/g, '$1\n* ');

  // 0. Proteger código inline (`...`) para no interpretar énfasis ni URLs dentro del fragmento
  const inlineCodeTokens: string[] = [];
  safeText = safeText.replace(/`([^`\n]+)`/g, (_, code) => {
    const token = `\uE000CHATCODE_${inlineCodeTokens.length}\uE001`;
    inlineCodeTokens.push(`<code class="chat-inline-code">${code}</code>`);
    return token;
  });

  // 1. Negrita antes de viñetas y cursivas
  safeText = safeText.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');

  // 2. Viñetas Markdown reales al inicio de línea -> bloques estructurados legibles (con espacio real para copiado)
  safeText = safeText.replace(
    /^[ \t]*[\*\-•]\s+(.+)$/gm,
    '<div class="chat-bullet-item"><span class="chat-bullet-dot">• </span><span>$1</span></div>'
  );

  // 3. Cursiva segura dentro de la misma línea (sin romper viñetas ni etiquetas)
  safeText = safeText.replace(/(^|[^\w*])\*([^\s*][^*\n]*?[^\s*]?)\*(?!\*)/g, '$1<em>$2</em>');

  // Función constructora de etiqueta <a> según sea SPA interna o externa
  const renderAnchor = (label: string, rawUrl: string): string => {
    const trackedUrl = appendChatbotUtm(rawUrl, customUtm);
    const internal = isInternalUrl(rawUrl);

    if (internal) {
      // Enlace SPA interno: data-spa-link para interceptación y transición in-place sin recargar página
      return `<a href="${trackedUrl}" data-spa-link="true" class="chat-inline-link chat-spa-link" title="Ir a ${label}">${label} <i class="las la-angle-right"></i></a>`;
    }

    // Enlace externo o descargable: nueva pestaña segura
    return `<a href="${trackedUrl}" target="_blank" rel="noopener noreferrer" class="chat-inline-link chat-external-link" title="Abrir enlace externo">${label} <i class="las la-external-link-alt"></i></a>`;
  };

  // 4. Enlaces Markdown explícitos [Texto](url o /ruta/)
  safeText = safeText.replace(
    /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/gi,
    (_, label, rawUrl) => renderAnchor(label, rawUrl)
  );

  // 5. URLs absolutas sueltas (http:// o https://) no contenidas en etiquetas <a> ni <code>
  safeText = safeText.replace(
    /(<a\b[^>]*>.*?<\/a>|<code\b[^>]*>.*?<\/code>)|(https?:\/\/[^\s<]+)/gi,
    (match, protectedTag, rawUrl) => {
      if (protectedTag) return protectedTag;
      const cleanUrl = rawUrl.replace(/[.,;!?]+$/, '');
      return renderAnchor(cleanUrl, cleanUrl);
    }
  );

  // 6. Rutas internas relativas sueltas (/universidad/pregrado/, 👉 /universidad/...) no contenidas en <a> ni <code>
  safeText = safeText.replace(
    /(<a\b[^>]*>.*?<\/a>|<code\b[^>]*>.*?<\/code>)|((^|[\s👉(])(\/(?:[a-zA-Z0-9_\-]+(?:\/[a-zA-Z0-9_\-]*)*\/?)))/gi,
    (match, protectedTag, _fullGroup, prefix, rawPath) => {
      if (protectedTag) return protectedTag;
      const cleanPath = (rawPath || '').replace(/[.,;!?]+$/, '');
      if (!cleanPath || cleanPath === '/') return match;
      return `${prefix || ''}${renderAnchor(cleanPath, cleanPath)}`;
    }
  );

  // 6b. Restaurar código inline (`...`)
  if (inlineCodeTokens.length > 0) {
    safeText = safeText.replace(/\uE000CHATCODE_(\d+)\uE001/g, (_, idx) => inlineCodeTokens[Number(idx)] ?? '');
  }

  // Limpiar saltos alrededor de bloques de lista y conservar separación limpia entre párrafos
  safeText = safeText
    .replace(/\n*(<div class="chat-bullet-item">)/g, '$1')
    .replace(/(<\/div>)\n+/g, '$1')
    .replace(/\n{2,}/g, '<div class="chat-paragraph-gap"></div>')
    .replace(/\n/g, '<br/>');

  return safeText;
};

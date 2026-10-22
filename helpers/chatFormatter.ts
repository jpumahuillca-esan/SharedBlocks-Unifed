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
  let safeText = escapeHtml(text);

  // 1. Formateo de estilo: negrita y cursiva
  safeText = safeText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

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

  // 2. Enlaces Markdown explícitos [Texto](url o /ruta/)
  safeText = safeText.replace(
    /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/gi,
    (_, label, rawUrl) => renderAnchor(label, rawUrl)
  );

  // 3. URLs absolutas sueltas (http:// o https://) no contenidas en etiquetas <a>
  safeText = safeText.replace(
    /(<a\b[^>]*>.*?<\/a>)|(https?:\/\/[^\s<]+)/gi,
    (match, anchor, rawUrl) => {
      if (anchor) return anchor;
      const cleanUrl = rawUrl.replace(/[.,;!?]+$/, '');
      return renderAnchor(cleanUrl, cleanUrl);
    }
  );

  // 4. Rutas internas relativas sueltas (/universidad/pregrado/, 👉 /universidad/...) no contenidas en <a>
  safeText = safeText.replace(
    /(<a\b[^>]*>.*?<\/a>)|((^|[\s👉(])(\/(?:[a-zA-Z0-9_\-]+(?:\/[a-zA-Z0-9_\-]*)*\/?)))/gi,
    (match, anchor, _fullGroup, prefix, rawPath) => {
      if (anchor) return anchor;
      const cleanPath = (rawPath || '').replace(/[.,;!?]+$/, '');
      if (!cleanPath || cleanPath === '/') return match;
      return `${prefix || ''}${renderAnchor(cleanPath, cleanPath)}`;
    }
  );

  return safeText.replace(/\n/g, '<br/>');
};

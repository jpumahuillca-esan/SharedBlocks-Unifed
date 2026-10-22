/**
 * Helpers y utilidades para tracking UTM en el Chatbot Institucional ESAN
 */

export interface UtmTrackingParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

/**
 * Verifica si una URL corresponde a un archivo estático descargable
 */
export const isDownloadableFile = (url: string): boolean => {
  if (!url) return false;
  const clean = url.split('?')[0].split('#')[0];
  return /\.(pdf|doc|docx|zip|rar|png|jpe?g|webp|xls|xlsx|ppt|pptx)$/i.test(clean);
};

/**
 * Verifica si una URL es una ruta interna del portal (SPA)
 */
export const isInternalUrl = (url: string): boolean => {
  if (!url) return false;
  if (isDownloadableFile(url)) return false;
  if (/^(mailto:|tel:|javascript:|#)/i.test(url)) return false;

  // Si es relativa (empieza con / pero no con //)
  if (url.startsWith('/') && !url.startsWith('//')) {
    return true;
  }

  // Si es absoluta pero pertenece a los dominios de ESAN o al host actual
  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      if (
        host === 'esan.edu.pe' ||
        host.endsWith('.esan.edu.pe') ||
        host === 'localhost' ||
        host === '127.0.0.1'
      ) {
        return true;
      }
      if (typeof window !== 'undefined' && host === window.location.hostname.toLowerCase()) {
        return true;
      }
    } catch {
      return false;
    }
  }

  return false;
};

/**
 * Agrega parámetros UTM de seguimiento a cualquier URL del portal para trazabilidad de conversiones
 */
export const appendChatbotUtm = (
  url: string,
  customUtm?: UtmTrackingParams
): string => {
  if (!url) return url;
  // Si es un documento o archivo directo (PDF, DOC), no alterar la URL
  if (isDownloadableFile(url)) {
    return url;
  }

  const source = customUtm?.source || 'chatbot';
  const medium = customUtm?.medium || 'referral';
  const campaign = customUtm?.campaign || 'esanbot';

  try {
    const isAbsolute = /^https?:\/\//i.test(url);
    const dummyOrigin = 'https://esan.edu.pe';
    const parsed = new URL(url, dummyOrigin);

    if (!parsed.searchParams.has('utm_source')) {
      parsed.searchParams.set('utm_source', source);
      parsed.searchParams.set('utm_medium', medium);
      parsed.searchParams.set('utm_campaign', campaign);
      if (customUtm?.term) parsed.searchParams.set('utm_term', customUtm.term);
      if (customUtm?.content) parsed.searchParams.set('utm_content', customUtm.content);
    }

    if (isAbsolute) {
      return parsed.toString();
    }
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`;
  }
};

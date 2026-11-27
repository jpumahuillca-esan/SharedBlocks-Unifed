import { PUBLIC_API_URL } from '../../../../config/apiConfig';
import { formatImageUrl } from '../../../../helpers/url';
import { toDisplayDate, toEventDateParts } from '../../events/_shared/date';

export const resolveCourseApiBase = (): string => {
  if (typeof window !== 'undefined' && (window as any).__NUXT__?.config?.public?.apiBase) {
    return String((window as any).__NUXT__.config.public.apiBase).replace(/\/+$/, '');
  }
  if (PUBLIC_API_URL) {
    return PUBLIC_API_URL.replace(/\/+$/, '');
  }
  return 'http://127.0.0.1:4000/api/public';
};

export const resolveCourseAssetUrl = (rawUrl?: string | null): string => {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) return '';
  const trimmed = rawUrl.trim();
  const inNuxt = typeof window !== 'undefined' && '__NUXT__' in window;
  if (inNuxt) {
    if (trimmed.startsWith('/storage/')) return trimmed;
    return trimmed.replace(
      /^https?:\/\/(?:127\.0\.0\.1|localhost|172\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+):8000\/storage\//i,
      '/storage/',
    );
  }
  return formatImageUrl(trimmed);
};

export const resolveCourseSyllabusHref = (item: Record<string, any>): string => {
  const pdf = resolveCourseAssetUrl(item?.syllabus_path || item?.syllabusUrl);
  if (pdf) return pdf;
  const baseUrl = typeof item?.url === 'string' && item.url ? item.url : typeof item?.href === 'string' && item.href ? item.href : '#';
  return baseUrl.includes('#') ? baseUrl : `${baseUrl}#temario`;
};

export const formatCourseDateBadge = (iso?: string | null): { day: string; month: string } | null =>
  iso ? toEventDateParts(iso) : null;

export const formatCourseType = (courseType?: string): string => {
  const labels: Record<string, string> = {
    curso: 'Curso',
    taller: 'Taller',
    certificacion: 'Certificación',
    idioma: 'Idioma',
    titulacion: 'Titulación',
  };
  return (courseType && labels[courseType]) || 'Programa ESAN';
};

export const resolveClassesLabel = (item: Record<string, any>): string => {
  if (typeof item?.schedule_text === 'string' && item.schedule_text.trim()) {
    return item.schedule_text.trim();
  }
  if (item?.start_date) {
    const formatted = toDisplayDate(item.start_date);
    if (formatted) return `Inicio ${formatted}`;
  }
  return '';
};

export const resolveDurationLabel = (item: Record<string, any>): string => {
  if (typeof item?.duration_label === 'string' && item.duration_label.trim()) {
    return item.duration_label.trim();
  }
  if (item?.hours) {
    return `${item.hours} horas académicas`;
  }
  return '';
};

import { ref } from 'vue';
import { PUBLIC_API_URL, PUBLIC_STORAGE_URL } from '../config/apiConfig';
import type { PostCardItem, EventCardItem } from '../components/block-beta/events/_shared/types';
import { toDisplayDate, toEventDateParts } from '../components/block-beta/events/_shared/date';
import { normalizeImageFocusProfiles } from '../helpers/imageFocus';

export interface FeedAcademicUnit {
  id: number;
  name: string;
  slug: string;
  full_slug?: string;
  parent_id?: number | null;
}

export interface FeedCategory {
  id: number;
  name: string;
  slug: string;
  academic_unit_id: number;
  type: string;
}

export interface PostsFeedFilters {
  academic_unit_id?: number | string | 'all';
  category_id?: number | string | 'all';
  type?: 'all' | 'news' | 'event' | 'calls' | string;
  limit?: number;
}

export interface RawPostEntity {
  id: number;
  title: string;
  slug: string;
  full_slug?: string;
  type: string;
  modality?: string | null;
  excerpt?: string;
  featured_image_path?: string | null;
  is_featured?: boolean;
  start_date?: string | null;
  end_date?: string | null;
  location?: string | null;
  action_url?: string | null;
  attachment_url?: string | null;
  target_audience?: string;
  views_count?: number;
  created_at?: string;
  category?: { id: number; name: string; slug?: string } | null;
  unit?: { id: number; name: string; slug: string; full_slug?: string } | null;
  academic_unit?: { id: number; name: string; slug: string; full_slug?: string } | null;
}

export function resolveStorageUrl(path?: string | null): string {
  if (!path) return '';
  const trimmed = path.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const baseUrl = (PUBLIC_STORAGE_URL || '').replace(/\/+$/, '');
  const cleanPath = trimmed.replace(/^\/+/, '');
  return `${baseUrl}/${cleanPath}`;
}

/**
 * Resuelve la URL canónica real del post respetando el enrutador multitenant de Nuxt 3 ([...slug].vue).
 * 1. Si existe action_url explícito que sea una URL válida (http://, https://, o ruta absoluta sin espacios), se usa con prioridad.
 * 2. Si el resource trae un `full_slug` directo (ej: /universidad/pregrado/noticia-1/), se usa directamente.
 * 3. Si pertenece a una Unidad Académica, se resuelve usando unit.full_slug o unit.slug (ej: /{unit.full_slug}/{post.slug}/).
 * 4. Si pertenece al Portal Central ('main') o no tiene unidad, se resuelve como /{post.slug}/.
 */
export function resolvePostHref(item: RawPostEntity): string {
  // 1. Si existe action_url explícito válido (enlace externo o ruta sin espacios)
  if (item.action_url && typeof item.action_url === 'string') {
    const trimmed = item.action_url.trim();
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      (trimmed.startsWith('/') && !trimmed.includes(' '))
    ) {
      return trimmed;
    }
  }

  // 2. Si el resource de la API ya provee el full_slug canónico
  const directFullSlug = item.full_slug || (item as any).full_slug;
  if (directFullSlug && typeof directFullSlug === 'string') {
    const trimmed = directFullSlug.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const clean = trimmed.replace(/^\/+|\/+$/g, '');
    return clean ? `/${clean}/` : '/';
  }

  if (!item.slug) return '#';
  const cleanPostSlug = item.slug.replace(/^\/+|\/+$/g, '');

  // 3. Si pertenece a una Unidad Académica, resolver con su full_slug o slug
  const unit = item.unit || item.academic_unit;
  const unitPath = unit?.full_slug || unit?.slug;
  if (unitPath && typeof unitPath === 'string') {
    const cleanUnit = unitPath.replace(/^\/+|\/+$/g, '');
    if (cleanUnit && cleanUnit !== 'main') {
      return `/${cleanUnit}/${cleanPostSlug}/`;
    }
  }

  return `/${cleanPostSlug}/`;
}

export function mapRawPostToCard(item: RawPostEntity, index = 0): PostCardItem {
  const rawDateStr = item.start_date || item.created_at || '';
  const isoDate = rawDateStr.length >= 10 ? rawDateStr.substring(0, 10) : '';
  const displayDate = isoDate ? (toDisplayDate(isoDate) || isoDate) : '';

  const badges: string[] = [];
  if (item.category?.name) badges.push(item.category.name);
  if (item.unit?.name && item.unit.name !== 'Portal Central') badges.push(item.unit.name);

  return {
    id: `post-${item.id || index}`,
    image: resolveStorageUrl(item.featured_image_path),
    imageAlt: item.title || '',
    imageFocusX: 50,
    imageFocusY: 50,
    imageFocusProfiles: normalizeImageFocusProfiles(),
    title: item.title || '',
    href: resolvePostHref(item),
    target: '_self',
    badges,
    date: displayDate,
    ctaLabel: 'Leer artículo',
  };
}

export function mapRawPostToEventCard(item: RawPostEntity, index = 0): EventCardItem {
  const rawDateStr = item.start_date || item.created_at || '';
  const isoDate = rawDateStr.length >= 10 ? rawDateStr.substring(0, 10) : '';
  const dateParts = isoDate ? toEventDateParts(isoDate) : null;

  const badges: string[] = [];
  if (item.category?.name) badges.push(item.category.name);

  return {
    id: `event-${item.id || index}`,
    date: isoDate,
    day: dateParts?.day || '',
    month: dateParts?.month || '',
    title: item.title || '',
    href: resolvePostHref(item),
    target: '_self',
    image: resolveStorageUrl(item.featured_image_path),
    imageAlt: item.title || '',
    imageFocusX: 50,
    imageFocusY: 50,
    imageFocusProfiles: normalizeImageFocusProfiles(),
    tag: item.modality === 'online' ? 'Virtual' : (item.modality === 'in_person' ? 'Presencial' : (item.type || '')),
    badges,
  };
}

export function usePostsFeed() {
  const items = ref<RawPostEntity[]>([]);
  const academicUnits = ref<FeedAcademicUnit[]>([]);
  const categories = ref<FeedCategory[]>([]);
  const pending = ref(false);
  const error = ref<string | null>(null);

  const fetchFilters = async () => {
    try {
      const res = await fetch(`${PUBLIC_API_URL}/news/filters`);
      if (res.ok) {
        const data = await res.json();
        academicUnits.value = data.academic_units || [];
        categories.value = data.categories || [];
        return data;
      }
    } catch (e: any) {
      console.warn('Error al cargar filtros de noticias:', e?.message);
    }
    return { academic_units: [], categories: [] };
  };

  const fetchFeed = async (filters: PostsFeedFilters = {}) => {
    pending.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams();
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.type && filters.type !== 'all') params.set('type', filters.type);
      if (filters.category_id && filters.category_id !== 'all') params.set('category_id', String(filters.category_id));
      if (filters.academic_unit_id !== undefined && filters.academic_unit_id !== null && filters.academic_unit_id !== '') {
        params.set('academic_unit_id', String(filters.academic_unit_id));
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`${PUBLIC_API_URL}/news${queryString}`);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

      const data = await res.json();
      const list = Array.isArray(data) ? data : (data?.data || []);
      items.value = list;
      return list;
    } catch (e: any) {
      error.value = e?.message || 'Error al conectar con la API de noticias';
      console.error('Error en usePostsFeed:', e);
      throw e;
    } finally {
      pending.value = false;
    }
  };

  return {
    items,
    academicUnits,
    categories,
    pending,
    error,
    fetchFeed,
    fetchFilters,
    resolvePostHref,
    mapRawPostToCard,
    mapRawPostToEventCard,
  };
}

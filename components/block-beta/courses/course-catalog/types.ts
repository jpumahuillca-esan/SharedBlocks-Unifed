/**
 * Contrato de datos y normalizador para CourseCatalogGrid.
 * Conectado dinámicamente a Fastify (/api/public/courses y /api/public/courses/categories)
 * manteniendo compatibilidad con configuraciones previas del constructor CMS.
 *
 * Figma: ESAN-University-v2
 *   - Cursos (Sidebar + 2 cols): 3146:7542 (1366) | 3552:11064 / 3552:12383 (768) | 3543:36303 (360)
 *   - Talleres Adolescentes (Top search + 3 cols + Alert): 2679:51659 (1366) | 3552:14528 (768) | 3547:43145 (360)
 */
import { normalizeBrandColorToken } from '../../../editor-beta/EditorBrandColor/brandColors';
import { normalizeLinkTarget, type LinkTarget } from '../../../../helpers/linkTarget';

export type CourseCatalogHeadingLevel = 1 | 2;
export type CourseStartFilterValue = '' | 'this_month' | 'next_month' | 'tbd';
export type CourseCatalogLayoutMode = 'sidebar-grid' | 'top-search-grid';
export type CourseCatalogColumns = 2 | 3;
export type CourseCatalogAlertVariant = 'info' | 'warning' | 'success' | 'error';

export interface CourseCatalogData {
  showBackLink: boolean;
  backLabel: string;
  backUrl: string;
  backTarget: LinkTarget;
  eyebrow: string;
  title: string;
  subtitle: string;
  headingLevel: CourseCatalogHeadingLevel;
  layoutMode: CourseCatalogLayoutMode;
  columns: CourseCatalogColumns;
  backgroundToken: string;
  searchPlaceholder: string;
  academic_unit_id: number | null;
  unit_slug: string;
  /** Campo legado (string simple o CSV); se sincroniza con `course_types`. */
  course_type: string;
  /** Selector múltiple de tipos (ej. ['curso', 'taller']). */
  course_types: string[];
  category_slug: string;
  perPage: number;
  showSearchFilter: boolean;
  showCategoryFilter: boolean;
  showModalityFilter: boolean;
  showStartDateFilter: boolean;
  primaryCtaLabel: string;
  syllabusCtaLabel: string;
  showBottomAlert: boolean;
  bottomAlertVariant: CourseCatalogAlertVariant;
  bottomAlertTitle: string;
  bottomAlertText: string;
  items: any[];
}

export interface CourseCategoryFacet {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface CourseModalityFacet {
  value: string;
  label: string;
  count: number;
}

export interface CourseStartDateFacets {
  all: number;
  this_month: number;
  next_month: number;
  tbd: number;
}

export const COURSE_TYPE_OPTIONS = [
  { value: 'curso', label: 'Cursos' },
  { value: 'taller', label: 'Talleres' },
  { value: 'certificacion', label: 'Certificaciones' },
  { value: 'idioma', label: 'Idiomas' },
  { value: 'titulacion', label: 'Titulación' },
] as const;

export const CATALOG_BACKGROUND_OPTIONS = [
  { value: '', label: 'Blanco por defecto' },
  { value: '--ds-color-background-light', label: 'Gris claro (#F1F5F9)' },
  { value: '--ds-color-esan-corp-second', label: 'Celeste ESAN (#B2DDEA)' },
] as const;

export const VALID_COURSE_TYPES = new Set<string>(COURSE_TYPE_OPTIONS.map((o) => o.value));

export const COURSE_CATALOG_RULES = {
  eyebrow: { maxLength: 80 },
  backLabel: { maxLength: 40 },
  title: { maxLength: 140 },
  subtitle: { maxLength: 240 },
  searchPlaceholder: { maxLength: 80 },
  primaryCtaLabel: { maxLength: 40 },
  syllabusCtaLabel: { maxLength: 40 },
  bottomAlertTitle: { maxLength: 120 },
  bottomAlertText: { maxLength: 400 },
  minPerPage: 3,
  maxPerPage: 24,
  defaultPerPage: 10,
} as const;

export const normalizeCourseTypesList = (rawTypes: unknown, rawLegacyType?: unknown): string[] => {
  const fromArray = Array.isArray(rawTypes)
    ? rawTypes.map((v) => String(v || '').trim().toLowerCase())
    : [];
  const fromLegacy = typeof rawLegacyType === 'string' && rawLegacyType.trim()
    ? rawLegacyType.split(',').map((v) => v.trim().toLowerCase())
    : [];
  const merged = (fromArray.length > 0 ? fromArray : fromLegacy).filter((v) => VALID_COURSE_TYPES.has(v));
  return Array.from(new Set(merged));
};

const normalizeCatalogBackground = (raw: unknown): string => {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed === '--ds-color-background-light' || trimmed === '--ds-color-esan-corp-second') {
    return trimmed;
  }
  return trimmed.startsWith('--ds-') ? normalizeBrandColorToken(trimmed) : '';
};

const normalizeAlertVariant = (raw: unknown): CourseCatalogAlertVariant =>
  raw === 'warning' || raw === 'success' || raw === 'error' ? raw : 'info';

export const normalizeCourseCatalogData = (raw: any): CourseCatalogData => {
  const courseTypes = normalizeCourseTypesList(raw?.course_types, raw?.course_type);
  const perPageNum = Number(raw?.perPage);
  const layoutMode: CourseCatalogLayoutMode =
    raw?.layoutMode === 'top-search-grid' ? 'top-search-grid' : 'sidebar-grid';
  const columns: CourseCatalogColumns =
    Number(raw?.columns) === 3 || (raw?.columns === undefined && layoutMode === 'top-search-grid')
      ? 3
      : 2;

  return {
    showBackLink: raw?.showBackLink !== false,
    backLabel:
      typeof raw?.backLabel === 'string'
        ? raw.backLabel.slice(0, COURSE_CATALOG_RULES.backLabel.maxLength)
        : 'Regresar',
    backUrl: typeof raw?.backUrl === 'string' ? raw.backUrl.trim() : '',
    backTarget: normalizeLinkTarget(raw?.backTarget),
    eyebrow:
      typeof raw?.eyebrow === 'string'
        ? raw.eyebrow.slice(0, COURSE_CATALOG_RULES.eyebrow.maxLength)
        : '',
    title:
      typeof raw?.title === 'string'
        ? raw.title.slice(0, COURSE_CATALOG_RULES.title.maxLength)
        : 'Explora nuestros cursos y talleres',
    subtitle:
      typeof raw?.subtitle === 'string'
        ? raw.subtitle.slice(0, COURSE_CATALOG_RULES.subtitle.maxLength)
        : '',
    headingLevel: raw?.headingLevel === 1 ? 1 : 2,
    layoutMode,
    columns,
    backgroundToken: normalizeCatalogBackground(raw?.backgroundToken),
    searchPlaceholder:
      typeof raw?.searchPlaceholder === 'string' && raw.searchPlaceholder.trim()
        ? raw.searchPlaceholder.trim().slice(0, COURSE_CATALOG_RULES.searchPlaceholder.maxLength)
        : 'Buscar curso por nombre',
    academic_unit_id: raw?.academic_unit_id ? Number(raw.academic_unit_id) : null,
    unit_slug: typeof raw?.unit_slug === 'string' ? raw.unit_slug.trim() : '',
    course_type: courseTypes.join(','),
    course_types: courseTypes,
    category_slug: typeof raw?.category_slug === 'string' ? raw.category_slug.trim() : '',
    perPage: Number.isFinite(perPageNum)
      ? Math.min(COURSE_CATALOG_RULES.maxPerPage, Math.max(COURSE_CATALOG_RULES.minPerPage, Math.round(perPageNum)))
      : COURSE_CATALOG_RULES.defaultPerPage,
    showSearchFilter: raw?.showSearchFilter !== false,
    showCategoryFilter: raw?.showCategoryFilter !== false,
    showModalityFilter: raw?.showModalityFilter !== false,
    showStartDateFilter: raw?.showStartDateFilter !== false,
    primaryCtaLabel:
      typeof raw?.primaryCtaLabel === 'string' && raw.primaryCtaLabel.trim()
        ? raw.primaryCtaLabel.trim().slice(0, COURSE_CATALOG_RULES.primaryCtaLabel.maxLength)
        : 'Conoce más',
    syllabusCtaLabel:
      typeof raw?.syllabusCtaLabel === 'string' && raw.syllabusCtaLabel.trim()
        ? raw.syllabusCtaLabel.trim().slice(0, COURSE_CATALOG_RULES.syllabusCtaLabel.maxLength)
        : 'Ver temario',
    showBottomAlert: raw?.showBottomAlert === true,
    bottomAlertVariant: normalizeAlertVariant(raw?.bottomAlertVariant),
    bottomAlertTitle:
      typeof raw?.bottomAlertTitle === 'string'
        ? raw.bottomAlertTitle.slice(0, COURSE_CATALOG_RULES.bottomAlertTitle.maxLength)
        : 'Importante:',
    bottomAlertText:
      typeof raw?.bottomAlertText === 'string'
        ? raw.bottomAlertText.slice(0, COURSE_CATALOG_RULES.bottomAlertText.maxLength)
        : 'Los cupos son limitados. La matrícula para cursos presenciales estará disponible hasta dos días antes del inicio de clases.',
    items: Array.isArray(raw?.items) ? raw.items : [],
  };
};

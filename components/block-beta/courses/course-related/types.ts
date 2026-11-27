import {
  normalizeImageFocus,
  normalizeImageFocusProfiles,
  type ImageFocusProfiles,
} from '../../../../helpers/imageFocus';
import { normalizeLinkTarget, type LinkTarget } from '../../../../helpers/linkTarget';
import { normalizeCourseTypesList } from '../course-catalog/types';

export type CourseRelatedSourceMode = 'api' | 'manual';

export interface CourseRelatedManualItem {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  imageFocusX: number;
  imageFocusY: number;
  imageFocusProfiles: ImageFocusProfiles;
  start_date: string;
  modality: string;
  schedule_text: string;
  duration_label: string;
  url: string;
  target: LinkTarget;
  syllabus_path: string;
}

export interface CourseRelatedData {
  title: string;
  sourceMode: CourseRelatedSourceMode;
  columns: 2 | 3;
  limit: number;
  academic_unit_id: number | null;
  unit_slug: string;
  course_type: string;
  course_types: string[];
  category_slug: string;
  primaryCtaLabel: string;
  syllabusCtaLabel: string;
  items: CourseRelatedManualItem[];
}

export const COURSE_RELATED_RULES = {
  title: { maxLength: 100 },
  primaryCtaLabel: { maxLength: 40 },
  syllabusCtaLabel: { maxLength: 40 },
  minLimit: 2,
  maxLimit: 12,
  defaultLimit: 6,
  maxManualItems: 8,
} as const;

export const DEFAULT_COURSE_RELATED_ITEMS: CourseRelatedManualItem[] = [
  {
    id: 'rel-1',
    title: 'MS Excel I, para la gestión empresarial',
    image: '',
    imageAlt: 'MS Excel I, para la gestión empresarial',
    imageFocusX: 50,
    imageFocusY: 50,
    imageFocusProfiles: normalizeImageFocusProfiles(undefined, 50, 50),
    start_date: '2026-10-02',
    modality: 'Presencial',
    schedule_text: 'Sábados de 9:00 am. a 12:15 pm.',
    duration_label: '8 clases - 24 horas académicas',
    url: '/universidad/extended-learning/cursos/',
    target: '',
    syllabus_path: '',
  },
  {
    id: 'rel-2',
    title: 'Experto en MS Project',
    image: '',
    imageAlt: 'Experto en MS Project',
    imageFocusX: 50,
    imageFocusY: 50,
    imageFocusProfiles: normalizeImageFocusProfiles(undefined, 50, 50),
    start_date: '2026-10-02',
    modality: 'Presencial',
    schedule_text: 'Sábados de 9:00 am. a 12:15 pm.',
    duration_label: '8 clases - 24 horas académicas',
    url: '/universidad/extended-learning/cursos/',
    target: '',
    syllabus_path: '',
  },
  {
    id: 'rel-3',
    title: 'Python - Nivel I',
    image: '',
    imageAlt: 'Python - Nivel I',
    imageFocusX: 50,
    imageFocusY: 50,
    imageFocusProfiles: normalizeImageFocusProfiles(undefined, 50, 50),
    start_date: '2026-10-16',
    modality: 'Virtual síncrona',
    schedule_text: 'Martes y jueves de 7:00 pm. a 10:00 pm.',
    duration_label: '8 clases - 24 horas académicas',
    url: '/universidad/extended-learning/cursos/python-nivel-i/',
    target: '',
    syllabus_path: '',
  },
];

export const normalizeCourseRelatedData = (raw: any): CourseRelatedData => {
  const source = raw && typeof raw === 'object' ? raw : {};
  const courseTypes = normalizeCourseTypesList(source.course_types, source.course_type);
  const parsedLimit = Number(source.limit);
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(COURSE_RELATED_RULES.maxLimit, Math.max(COURSE_RELATED_RULES.minLimit, Math.round(parsedLimit)))
    : COURSE_RELATED_RULES.defaultLimit;

  const items: CourseRelatedManualItem[] = Array.isArray(source.items)
    ? source.items.slice(0, COURSE_RELATED_RULES.maxManualItems).map((item: any, i: number) => {
        const focusX = normalizeImageFocus(item?.imageFocusX);
        const focusY = normalizeImageFocus(item?.imageFocusY);
        return {
          id: typeof item?.id === 'string' && item.id ? item.id : `rel-${i + 1}`,
          title: String(item?.title ?? '').slice(0, 160),
          image: typeof item?.image === 'string' ? item.image.trim() : typeof item?.image_url === 'string' ? item.image_url.trim() : '',
          imageAlt: typeof item?.imageAlt === 'string' ? item.imageAlt.trim() : '',
          imageFocusX: focusX,
          imageFocusY: focusY,
          imageFocusProfiles: normalizeImageFocusProfiles(item?.imageFocusProfiles, focusX, focusY),
          start_date: typeof item?.start_date === 'string' ? item.start_date.trim() : '',
          modality: typeof item?.modality === 'string' ? item.modality.trim() : '',
          schedule_text: typeof item?.schedule_text === 'string' ? item.schedule_text.trim() : '',
          duration_label: typeof item?.duration_label === 'string' ? item.duration_label.trim() : '',
          url: typeof item?.url === 'string' ? item.url.trim() : '',
          target: normalizeLinkTarget(item?.target),
          syllabus_path: typeof item?.syllabus_path === 'string' ? item.syllabus_path.trim() : '',
        };
      })
    : DEFAULT_COURSE_RELATED_ITEMS;

  return {
    title:
      typeof source.title === 'string'
        ? source.title.slice(0, COURSE_RELATED_RULES.title.maxLength)
        : 'Cursos relacionados',
    sourceMode: source.sourceMode === 'manual' ? 'manual' : 'api',
    columns: source.columns === 3 ? 3 : 2,
    limit,
    academic_unit_id: source.academic_unit_id ? Number(source.academic_unit_id) : null,
    unit_slug: typeof source.unit_slug === 'string' ? source.unit_slug.trim() : '',
    course_type: courseTypes.join(','),
    course_types: courseTypes,
    category_slug: typeof source.category_slug === 'string' ? source.category_slug.trim() : '',
    primaryCtaLabel:
      typeof source.primaryCtaLabel === 'string' && source.primaryCtaLabel.trim()
        ? source.primaryCtaLabel.trim().slice(0, COURSE_RELATED_RULES.primaryCtaLabel.maxLength)
        : 'Conoce más',
    syllabusCtaLabel:
      typeof source.syllabusCtaLabel === 'string' && source.syllabusCtaLabel.trim()
        ? source.syllabusCtaLabel.trim().slice(0, COURSE_RELATED_RULES.syllabusCtaLabel.maxLength)
        : 'Ver temario',
    items,
  };
};

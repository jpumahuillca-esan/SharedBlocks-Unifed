/**
 * Hidratación canónica de cursos/talleres/certificaciones/idiomas/titulación
 * hacia la plantilla modular Figma (HeroSlider + InfoKeyFacts + Breadcrumb +
 * CourseAbout + CourseFaculty + CourseGeneralInfo + CourseRelated + HeroLeadForm flotante).
 *
 * Única fuente de verdad compartida entre `CourseDetailLayout.vue` (sitio público
 * automático) y `CourseEditor.vue` (CMS cuando se inicializa o aplica plantilla).
 */
import type { SectionItem } from '../core/sectionTypes';
import { normalizeToSections } from '../core/sectionNormalize';
import { DEFAULT_COURSE_FACULTY_DATA } from '../components/block-beta/courses/course-faculty/types';
import { normalizeImageFocusProfiles } from './imageFocus';

export interface HydratableCourseSource {
  id?: number | string | null;
  academic_unit_id?: number | null;
  unit_name?: string | null;
  unit_slug?: string | null;
  unit_full_slug?: string | null;
  category_id?: number | null;
  category_name?: string | null;
  category_slug?: string | null;
  study_program_id?: number | null;
  program_name?: string | null;
  course_type?: string | null;
  title?: string | null;
  slug?: string | null;
  url?: string | null;
  public_url?: string | null;
  excerpt?: string | null;
  description?: string | null;
  modality?: string | null;
  duration_label?: string | null;
  hours?: number | null;
  start_date?: string | null;
  schedule_text?: string | null;
  price?: number | null;
  audience_target?: string | null;
  syllabus_path?: string | null;
  syllabus_json?: any[] | null;
  requirements_json?: any[] | null;
  featured_image?: string | null;
  image_url?: string | null;
  marketing_campaign_id?: number | null;
  instructors?: Array<{
    id?: number | string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    bio?: string | null;
    position_name?: string | null;
    academic_degree?: string | null;
    photo_url?: string | null;
    profile_url?: string | null;
  }> | null;
  related_courses?: Array<Record<string, any>> | null;
}

const DEFAULT_HERO_FALLBACK_IMAGE = '/storage/media/main/extended-learning/course-hero-arduino.png';

const MONTHS_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const DEFAULT_HIGHLIGHTS = [
  { id: 'hl-1', pictogram: 'faculty-group', text: 'Reconocida plana docente' },
  { id: 'hl-2', pictogram: 'virtual-classroom', text: 'Moderna infraestructura' },
  { id: 'hl-3', pictogram: 'business-hierarchy', text: 'Enfoque empresarial' },
  { id: 'hl-4', pictogram: 'idea-exchange', text: 'Metodología' },
];

const uid = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const formatSpanishCourseDate = (raw?: string | null): string => {
  if (!raw || typeof raw !== 'string') return '';
  const match = raw.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return raw.trim();
  const year = Number(match[1]);
  const monthIdx = Number(match[2]) - 1;
  const day = Number(match[3]);
  const monthName = MONTHS_ES[monthIdx];
  if (!monthName || !day || !year) return raw.trim();
  return `${day} de ${monthName} de ${year}`;
};

export const formatCoursePricePen = (raw: unknown): string => {
  if (raw === null || raw === undefined || raw === '') return '';
  const num = Number(raw);
  if (!Number.isFinite(num)) return '';
  return `S/ ${num.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}*`;
};

const htmlToCourseMarkdown = (raw?: string | null): string => {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, (_, _tag, inner) => `**${String(inner).trim()}**`)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const resolveSummaryText = (course: HydratableCourseSource): string => {
  const excerpt = String(course.excerpt || '').trim();
  if (excerpt) return excerpt;
  const plain = htmlToCourseMarkdown(course.description).replace(/\*\*/g, '').replace(/\n+/g, ' ').trim();
  if (!plain) return '';
  return plain.length <= 210 ? plain : `${plain.slice(0, 207).trimEnd()}...`;
};

const resolveEyebrow = (course: HydratableCourseSource): string => {
  const type = String(course.course_type || 'curso').toLowerCase();
  const mod = String(course.modality || '').trim().toUpperCase();
  if (type === 'taller') return mod ? `TALLER ${mod}` : 'TALLER ESPECIALIZADO';
  if (type === 'certificacion') return 'CERTIFICACIÓN INTERNACIONAL';
  if (type === 'idioma') return course.category_name ? String(course.category_name).toUpperCase() : 'PROGRAMA DE IDIOMAS';
  if (type === 'titulacion') return 'PROGRAMA DE TITULACIÓN';
  return mod ? `CURSO ${mod}` : 'CURSO ESPECIALIZADO';
};

const resolveAboutHeading = (course: HydratableCourseSource): string => {
  const type = String(course.course_type || 'curso').toLowerCase();
  if (type === 'taller') return 'Acerca del taller';
  if (type === 'idioma' || type === 'titulacion') return 'Acerca del programa';
  return 'Acerca del curso';
};

const resolveDurationText = (course: HydratableCourseSource): string => {
  const label = String(course.duration_label || '').trim();
  if (label) return label;
  const hrs = Number(course.hours);
  if (Number.isFinite(hrs) && hrs > 0) return `${hrs} horas académicas`;
  return '';
};

const cleanUnitPath = (fullSlug?: string | null, unitSlug?: string | null): string => {
  const raw = String(fullSlug || unitSlug || '').trim().replace(/^\/+|\/+$/g, '');
  if (!raw || raw === 'main') return '';
  return raw;
};

export const buildCourseBreadcrumbItems = (course: HydratableCourseSource) => {
  const items: Array<{ label: string; href?: string }> = [{ label: 'Inicio', href: '/' }];
  const unitPath = cleanUnitPath(course.unit_full_slug, course.unit_slug);

  if (unitPath === 'universidad' || unitPath.startsWith('universidad/')) {
    items.push({ label: 'Universidad', href: '/universidad/' });
  }

  const unitLabel = String(course.unit_name || '').trim();
  if (unitPath && unitPath !== 'universidad' && unitLabel && unitLabel.toLowerCase() !== 'universidad') {
    items.push({ label: unitLabel, href: `/${unitPath}/` });
  }

  if (course.category_name) {
    items.push({ label: String(course.category_name).trim() });
  }

  if (course.title) {
    items.push({ label: String(course.title).trim(), href: course.url || course.public_url || '' });
  }

  return items;
};

const buildHeroContent = (course: HydratableCourseSource, existing?: Record<string, any>) => {
  const prevSlide = Array.isArray(existing?.slides) && existing.slides[0] ? existing.slides[0] : {};
  const heroImage =
    String(course.image_url || course.featured_image || '').trim() ||
    String(prevSlide.image || '').trim() ||
    DEFAULT_HERO_FALLBACK_IMAGE;

  const hasSyllabus = Boolean(String(course.syllabus_path || '').trim());
  const secondaryAction = hasSyllabus
    ? {
        label: 'Descargar temario',
        url: String(course.syllabus_path).trim(),
        target: '_blank',
        icon: 'download',
        iconPosition: 'end',
      }
    : {
        label: 'Ver datos generales',
        url: '#datos-generales',
        target: '',
        icon: 'arrow-down',
        iconPosition: 'end',
      };

  return {
    ...(existing || {}),
    seoHeadingSource: 'title',
    seoHeadingText: 'ESAN',
    mode: 'single',
    contentAlign: 'bottom',
    contentWidth: 'wide',
    panelColorToken: existing?.panelColorToken || '--ds-color-esan-corp',
    overlayOpacity: existing?.overlayOpacity ?? 100,
    slides: [
      {
        ...prevSlide,
        id: prevSlide.id || 'hero-course-1',
        logo: null,
        logoAlt: '',
        eyebrow: resolveEyebrow(course),
        subtitle: '',
        title: String(course.title || prevSlide.title || 'Curso ESAN'),
        desc: resolveSummaryText(course) || prevSlide.desc || '',
        image: heroImage,
        imageAlt: String(course.title || 'Curso ESAN'),
        imageFocusX: 50,
        imageFocusY: 50,
        imageFocusProfiles: normalizeImageFocusProfiles(prevSlide.imageFocusProfiles, 50, 50),
        buttons: 'secondary',
        primary: prevSlide.primary || { label: 'Solicita información', url: '#solicitar-informacion', target: '', icon: '', iconPosition: 'end' },
        secondary: secondaryAction,
      },
    ],
  };
};

const buildKeyFactsContent = (course: HydratableCourseSource, existing?: Record<string, any>) => {
  const startText = formatSpanishCourseDate(course.start_date) || 'Próximo inicio por confirmar';
  const durationText = resolveDurationText(course) || 'Consultar duración';
  const modalityText = String(course.modality || '').trim() || 'Por confirmar';
  const priceText = formatCoursePricePen(course.price);
  const categoryText = String(course.category_name || course.program_name || '').trim();

  const fourthFact = priceText
    ? { id: 'kf-4', label: 'Inversión:', value: priceText }
    : categoryText
      ? { id: 'kf-4', label: 'Área:', value: categoryText }
      : { id: 'kf-4', label: 'Inversión:', value: 'Consultar' };

  return {
    ...(existing || {}),
    colorToken: existing?.colorToken || '--ds-color-esan-corp',
    items: [
      { id: 'kf-1', label: 'Inicio:', value: startText },
      { id: 'kf-2', label: 'Duración:', value: durationText },
      { id: 'kf-3', label: 'Modalidad', value: modalityText },
      fourthFact,
    ],
  };
};

const buildBreadcrumbContent = (course: HydratableCourseSource, existing?: Record<string, any>) => ({
  ...(existing || {}),
  mode: 'dynamic',
  academic_unit_id: course.academic_unit_id ?? null,
  includeCurrentPage: true,
  explicitIncludeCurrent: true,
  currentPage: String(course.title || ''),
  isBoxed: true,
  items: buildCourseBreadcrumbItems(course),
});

const buildCourseAboutContent = (course: HydratableCourseSource, existing?: Record<string, any>) => {
  const descParts: string[] = [];
  const mainDesc = htmlToCourseMarkdown(course.description) || String(course.excerpt || '').trim();
  if (mainDesc) descParts.push(mainDesc);
  if (course.audience_target && String(course.audience_target).trim()) {
    descParts.push(`**Dirigido a:** ${String(course.audience_target).trim()}`);
  }

  const reqItems = Array.isArray(course.requirements_json)
    ? course.requirements_json
        .map((r: any, idx: number) => ({
          id: `obj-req-${idx + 1}`,
          text: typeof r === 'string' ? r.trim() : String(r?.text || r?.title || '').trim(),
        }))
        .filter((o) => o.text.length > 0)
    : [];

  const sylItems = Array.isArray(course.syllabus_json)
    ? course.syllabus_json
        .map((m: any, idx: number) => {
          const t = String(m?.title || '').trim();
          const d = String(m?.content || m?.description || '').replace(/\s+/g, ' ').trim();
          const text = t && d ? `${t}: ${d}` : t || d;
          return { id: `obj-syl-${idx + 1}`, text };
        })
        .filter((o) => o.text.length > 0)
    : [];

  let objectivesTitle = '';
  let objectivesIntro = '';
  let objectives: Array<{ id: string; text: string }> = [];

  if (reqItems.length > 0) {
    objectivesTitle = course.course_type === 'titulacion' ? 'Requisitos y Modalidad de Titulación' : 'Objetivos y Requisitos';
    objectivesIntro = 'Puntos clave que el participante alcanzará y acreditará en este programa:';
    objectives = reqItems;
  } else if (sylItems.length > 0) {
    objectivesTitle = 'Estructura y Contenido';
    objectivesIntro = 'Módulos temáticos incluidos en el programa:';
    objectives = sylItems;
  }

  const highlights =
    Array.isArray(existing?.highlights) && existing.highlights.length > 0
      ? existing.highlights
      : DEFAULT_HIGHLIGHTS;

  return {
    ...(existing || {}),
    title: resolveAboutHeading(course),
    description: descParts.join('\n\n') || existing?.description || '',
    objectivesTitle,
    objectivesIntro,
    objectives,
    highlights,
  };
};

const mapInstructors = (course: HydratableCourseSource) =>
  Array.isArray(course.instructors)
    ? course.instructors.map((inst, i) => {
        const name =
          String(inst.full_name || `${inst.first_name || ''} ${inst.last_name || ''}`).trim() || 'Docente ESAN';
        const bio = String(inst.bio || inst.position_name || inst.academic_degree || '').trim();
        return {
          id: `teacher-${inst.id || i + 1}`,
          name,
          bio,
          image: String(inst.photo_url || '').trim(),
          imageAlt: name,
          imageFocusX: 50,
          imageFocusY: 30,
          imageFocusProfiles: normalizeImageFocusProfiles(undefined, 50, 30),
          profileUrl: String(inst.profile_url || '').trim(),
          profileTarget: '' as const,
        };
      })
    : [];

const buildGeneralInfoContent = (course: HydratableCourseSource, existing?: Record<string, any>) => {
  const rows: Array<{ id: string; label: string; value: string; valueStyle: 'auto' }> = [];

  rows.push({
    id: 'gi-start',
    label: 'Fecha de inicio',
    value: formatSpanishCourseDate(course.start_date) || 'Próximo inicio por confirmar',
    valueStyle: 'auto',
  });

  if (course.schedule_text && String(course.schedule_text).trim()) {
    rows.push({
      id: 'gi-schedule',
      label: 'Horario',
      value: String(course.schedule_text).trim(),
      valueStyle: 'auto',
    });
  }

  const duration = resolveDurationText(course);
  if (duration) {
    rows.push({ id: 'gi-duration', label: 'Duración', value: duration, valueStyle: 'auto' });
  }

  if (course.modality && String(course.modality).trim()) {
    rows.push({ id: 'gi-modality', label: 'Modalidad', value: String(course.modality).trim(), valueStyle: 'auto' });
  }

  rows.push({
    id: 'gi-price',
    label: 'Inversión*',
    value: formatCoursePricePen(course.price) || 'Consultar con un asesor',
    valueStyle: 'auto',
  });

  rows.push({
    id: 'gi-certificate',
    label: 'Certificado',
    value:
      'Los participantes que cumplan con el 80% de asistencia al curso y obtengan una nota mínima aprobatoria recibirán el certificado oficial emitido por Universidad ESAN.',
    valueStyle: 'auto',
  });

  const unitBrand = String(course.unit_name || 'Extended Learning').trim();
  const footnotes =
    existing?.footnotes ||
    `*ESAN otorga DESCUENTOS a alumnos, ex alumnos, graduados, participantes grupales y corporativos.\n**Una vez confirmado el inicio del curso por medio de un correo, no se podrá solicitar devoluciones, retiros o traslados. ${unitBrand} ESAN se reserva el derecho de modificar la plana docente por motivos de fuerza mayor, garantizando la calidad académica.`;

  return {
    ...(existing || {}),
    title: existing?.title || 'Datos Generales',
    rows,
    footnotes,
  };
};

const buildRelatedContent = (course: HydratableCourseSource, existing?: Record<string, any>) => {
  const type = String(course.course_type || 'curso').toLowerCase();
  const title =
    type === 'taller'
      ? 'Talleres relacionados'
      : type === 'idioma'
        ? 'Programas relacionados'
        : 'Cursos relacionados';

  const fallbackItems = Array.isArray(course.related_courses)
    ? course.related_courses.map((rel: any, idx: number) => ({
        id: `rel-${rel.id || idx + 1}`,
        title: String(rel.title || ''),
        image: String(rel.image_url || rel.image || ''),
        imageAlt: String(rel.title || 'Curso ESAN'),
        imageFocusX: 50,
        imageFocusY: 50,
        imageFocusProfiles: normalizeImageFocusProfiles(undefined, 50, 50),
        start_date: String(rel.start_date || ''),
        modality: String(rel.modality || ''),
        schedule_text: String(rel.schedule_text || ''),
        duration_label: String(rel.duration_label || (rel.hours ? `${rel.hours} horas académicas` : '')),
        url: String(rel.url || ''),
        target: '',
        syllabus_path: String(rel.syllabus_path || ''),
      }))
    : [];

  return {
    ...(existing || {}),
    title,
    sourceMode: 'api',
    columns: 2,
    limit: existing?.limit || 6,
    academic_unit_id: course.academic_unit_id ?? existing?.academic_unit_id ?? null,
    unit_slug: cleanUnitPath(course.unit_full_slug, course.unit_slug),
    course_type: type,
    course_types: [type],
    // No filtrar por categoría en la API si puede dejar < 2 tarjetas; las relacionadas por categoría ya vienen priorizadas en fallbackItems
    category_slug: '',
    primaryCtaLabel: existing?.primaryCtaLabel || 'Conoce más',
    syllabusCtaLabel: existing?.syllabusCtaLabel || 'Ver temario',
    items: fallbackItems.length > 0 ? fallbackItems : (Array.isArray(existing?.items) ? existing.items : []),
  };
};

const buildLeadFormContent = (course: HydratableCourseSource, existing?: Record<string, any>) => ({
  ...(existing || {}),
  themeColor: existing?.themeColor || '#e3173e',
  mainTitle:
    String(course.course_type || '').toLowerCase() === 'titulacion'
      ? 'Solicita más información'
      : 'Matricúlate en nuestros cursos',
  subTitle: existing?.subTitle || 'Déjanos tus datos para darte más información y te contactamos en breve',
  button_text: existing?.button_text || 'Enviar mi información',
  academic_unit_id: course.academic_unit_id ?? existing?.academic_unit_id ?? null,
  campaign_id: course.marketing_campaign_id ?? existing?.campaign_id ?? null,
  study_program_id: course.study_program_id ?? existing?.study_program_id ?? null,
  careerName: String(course.title || ''),
  show_phone: true,
  show_courses: true,
  showFloatingRedirect: existing?.showFloatingRedirect !== false,
});

/**
 * Toma secciones existentes (p. ej. de una Plantilla Maestra #9) e hidrata cada bloque
 * con los datos reales de la ficha del curso sin perder estilos ni diseño.
 */
export const hydrateCourseSections = (
  rawSections: unknown,
  course: HydratableCourseSource,
  options: { dropEmptyFaculty?: boolean } = {},
): SectionItem[] => {
  const sections = normalizeToSections(JSON.parse(JSON.stringify(rawSections || [])));
  const mappedInstructors = mapInstructors(course);

  return sections.map((section) => ({
    ...section,
    columns: section.columns.map((column) => ({
      ...column,
      blocks: column.blocks
        .filter((block) => !(options.dropEmptyFaculty && block.type === 'CourseFaculty' && mappedInstructors.length === 0))
        .map((block) => {
          switch (block.type) {
            case 'HeroSlider':
              return { ...block, content: buildHeroContent(course, block.content) };
            case 'InfoKeyFacts':
              return { ...block, content: buildKeyFactsContent(course, block.content) };
            case 'Breadcrumb':
              return { ...block, content: buildBreadcrumbContent(course, block.content) };
            case 'CourseAbout':
              return { ...block, content: buildCourseAboutContent(course, block.content) };
            case 'CourseFaculty':
              return {
                ...block,
                content: {
                  ...(block.content || {}),
                  title: block.content?.title || 'Docente',
                  teachers:
                    mappedInstructors.length > 0
                      ? mappedInstructors
                      : Array.isArray(block.content?.teachers) && block.content.teachers.length > 0
                        ? block.content.teachers
                        : DEFAULT_COURSE_FACULTY_DATA.teachers,
                },
              };
            case 'CourseGeneralInfo':
              return {
                ...block,
                anchorId: block.anchorId || 'datos-generales',
                content: buildGeneralInfoContent(course, block.content),
              };
            case 'CourseRelated':
              return { ...block, content: buildRelatedContent(course, block.content) };
            case 'HeroLeadForm':
              return { ...block, content: buildLeadFormContent(course, block.content) };
            default:
              return block;
          }
        }),
    })),
  }));
};

/**
 * Construye desde cero la estructura completa de secciones de Detalle de Curso
 * hidratada con los datos de `course` y columna flotante derecha + orden móvil tras Breadcrumb.
 */
export const buildHydratedCourseSections = (
  course: HydratableCourseSource,
  options: { includeFacultyWhenEmpty?: boolean } = {},
): SectionItem[] => {
  const breadcrumbId = uid('crs-bc');
  const instructors = mapInstructors(course);

  const flowBlocks: SectionItem['columns'][number]['blocks'] = [
    { id: uid('crs-hero'), type: 'HeroSlider', content: buildHeroContent(course) },
    { id: uid('crs-kf'), type: 'InfoKeyFacts', content: buildKeyFactsContent(course) },
    { id: breadcrumbId, type: 'Breadcrumb', content: buildBreadcrumbContent(course) },
    { id: uid('crs-about'), type: 'CourseAbout', content: buildCourseAboutContent(course) },
  ];

  if (instructors.length > 0 || options.includeFacultyWhenEmpty) {
    flowBlocks.push({
      id: uid('crs-fac'),
      type: 'CourseFaculty',
      content: {
        title: 'Docente',
        teachers: instructors.length > 0 ? instructors : DEFAULT_COURSE_FACULTY_DATA.teachers,
      },
    });
  }

  flowBlocks.push(
    {
      id: uid('crs-gi'),
      anchorId: 'datos-generales',
      type: 'CourseGeneralInfo',
      content: buildGeneralInfoContent(course),
    },
    {
      id: uid('crs-rel'),
      type: 'CourseRelated',
      content: buildRelatedContent(course),
    },
  );

  return [
    {
      id: uid('sec-course'),
      label: 'Detalle de Curso + Formulario Flotante',
      columns: [
        {
          id: uid('col-flow'),
          span: 12,
          behavior: 'static',
          offsetPx: 0,
          placement: 'flow',
          mobileAfterBlockId: null,
          blocks: flowBlocks,
        },
        {
          id: uid('col-float'),
          span: 4,
          behavior: 'sticky',
          offsetPx: 24,
          placement: 'float-end',
          mobileAfterBlockId: breadcrumbId,
          blocks: [
            {
              id: uid('crs-form'),
              type: 'HeroLeadForm',
              content: buildLeadFormContent(course),
            },
          ],
        },
      ],
      settings: {
        width: 'full',
        heightMode: 'auto',
        heightPx: null,
        behavior: 'static',
        offsetPx: 0,
        verticalAlign: 'stretch',
        gapPx: 24,
        paddingYPx: 0,
        paddingXPx: 0,
        background: null,
      },
    },
  ];
};

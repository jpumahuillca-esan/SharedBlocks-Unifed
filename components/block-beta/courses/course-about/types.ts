export interface CourseObjectiveItem {
  id: string;
  text: string;
}

export interface CourseHighlightCard {
  id: string;
  pictogram: string;
  text: string;
}

export interface CourseAboutData {
  title: string;
  description: string;
  objectivesTitle: string;
  objectivesIntro: string;
  objectives: CourseObjectiveItem[];
  highlights: CourseHighlightCard[];
}

export const COURSE_ABOUT_RULES = {
  title: { maxLength: 120 },
  description: { maxLength: 2400 },
  objectivesTitle: { maxLength: 120 },
  objectivesIntro: { maxLength: 1200 },
  objectiveText: { maxLength: 240 },
  highlightText: { maxLength: 90 },
  maxHighlights: 8,
} as const;

export const DEFAULT_COURSE_ABOUT_DATA: CourseAboutData = {
  title: 'Acerca del curso',
  description:
    'Arduino es una plataforma electrónica de código abierto basada en la filosofía de “hardware y software fácil de usar”. En este curso el estudiante aprenderá los conceptos básicos de la programación en Arduino que permitirá interactuar con el mundo real.\n\nEs ofrecido por **FabLab ESAN**, único Centro de Innovación Tecnológica autorizado por CONCYTEC e integrante de Fab Lab Network.',
  objectivesTitle: 'Objetivos del Curso',
  objectivesIntro: 'Al final de este curso, esperamos que cada estudiante logre lo siguiente:',
  objectives: [
    { id: 'obj-1', text: 'Adquirir conocimientos básicos en electrónica y programación con Arduino.' },
    { id: 'obj-2', text: 'Realizar proyectos simples y automatizar tareas básicas.' },
    { id: 'obj-3', text: 'Conocer los conceptos fundamentales de la tecnología Arduino.' },
    { id: 'obj-4', text: 'Desarrollar una base sólida para futuros aprendizajes en electrónica y programación.' },
  ],
  highlights: [
    { id: 'hl-1', pictogram: 'faculty-group', text: 'Reconocida plana docente' },
    { id: 'hl-2', pictogram: 'virtual-classroom', text: 'Moderna infraestructura' },
    { id: 'hl-3', pictogram: 'business-hierarchy', text: 'Enfoque empresarial' },
    { id: 'hl-4', pictogram: 'idea-exchange', text: 'Metodología' },
  ],
};

export const normalizeCourseAboutData = (raw: any): CourseAboutData => {
  const source = raw && typeof raw === 'object' ? raw : {};

  const objectives: CourseObjectiveItem[] = Array.isArray(source.objectives)
    ? source.objectives
        .map((item: any, i: number) => ({
          id: typeof item?.id === 'string' && item.id ? item.id : `obj-${i + 1}`,
          text: String(item?.text ?? '').slice(0, COURSE_ABOUT_RULES.objectiveText.maxLength),
        }))
    : DEFAULT_COURSE_ABOUT_DATA.objectives;

  const highlights: CourseHighlightCard[] = Array.isArray(source.highlights)
    ? source.highlights
        .slice(0, COURSE_ABOUT_RULES.maxHighlights)
        .map((item: any, i: number) => ({
          id: typeof item?.id === 'string' && item.id ? item.id : `hl-${i + 1}`,
          pictogram: typeof item?.pictogram === 'string' && item.pictogram.trim() ? item.pictogram.trim() : 'faculty-group',
          text: String(item?.text ?? '').slice(0, COURSE_ABOUT_RULES.highlightText.maxLength),
        }))
    : DEFAULT_COURSE_ABOUT_DATA.highlights;

  return {
    title:
      typeof source.title === 'string'
        ? source.title.slice(0, COURSE_ABOUT_RULES.title.maxLength)
        : DEFAULT_COURSE_ABOUT_DATA.title,
    description:
      typeof source.description === 'string'
        ? source.description.slice(0, COURSE_ABOUT_RULES.description.maxLength)
        : DEFAULT_COURSE_ABOUT_DATA.description,
    objectivesTitle:
      typeof source.objectivesTitle === 'string'
        ? source.objectivesTitle.slice(0, COURSE_ABOUT_RULES.objectivesTitle.maxLength)
        : DEFAULT_COURSE_ABOUT_DATA.objectivesTitle,
    objectivesIntro:
      typeof source.objectivesIntro === 'string'
        ? source.objectivesIntro.slice(0, COURSE_ABOUT_RULES.objectivesIntro.maxLength)
        : DEFAULT_COURSE_ABOUT_DATA.objectivesIntro,
    objectives,
    highlights,
  };
};

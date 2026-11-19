/**
 * Tipos y normalización para el bloque FaqAccordion (Preguntas Frecuentes).
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  defaultOpen?: boolean;
}

export interface FaqAccordionData {
  eyebrow?: string;
  title: string;
  desc?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  items: FaqItem[];
}

export const createFaqItemId = (): string =>
  `faq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: '¿Cuánto cuesta estudiar Administración?',
    answer: 'El costo de la carrera varía según la escala de pago asignada en el proceso de admisión. Contamos con diversas escalas y facilidades de financiamiento.',
    defaultOpen: false,
  },
  {
    id: 'faq-2',
    question: '¿Cómo se asigna mi escala de pago?',
    answer: 'La escala se determina mediante una evaluación socioeconómica familiar al momento de postular.',
    defaultOpen: false,
  },
  {
    id: 'faq-3',
    question: '¿Qué necesito para postular por examen regular?',
    answer: 'Haber culminado o estar cursando el quinto de secundaria, copia de DNI y completar la ficha de inscripción en línea.',
    defaultOpen: false,
  },
  {
    id: 'faq-4',
    question: '¿Cómo es el examen de admisión?',
    answer: 'Evalúa aptitud académica (razonamiento verbal y matemático) y conocimientos generales.',
    defaultOpen: false,
  },
  {
    id: 'faq-5',
    question: 'Horarios de clase',
    answer: 'Las clases se dictan en turnos regulares de lunes a viernes, con acceso a laboratorios y biblioteca.',
    defaultOpen: false,
  },
  {
    id: 'faq-6',
    question: '¿Qué es el Ciclo 0 y puedo convalidarlo?',
    answer: 'Es un ciclo de nivelación y pre-formación en Comunicaciones y Matemática que puedes convalidar mediante examen de suficiencia.',
    defaultOpen: false,
  },
];

export const buildFaqItem = (source: any): FaqItem => ({
  id: source?.id || createFaqItemId(),
  question: source?.question ?? source?.title ?? '',
  answer: source?.answer ?? source?.desc ?? source?.content ?? '',
  category: source?.category ?? '',
  defaultOpen: Boolean(source?.defaultOpen),
});

export const buildFaqAccordionData = (source: any): FaqAccordionData => ({
  eyebrow: source?.eyebrow ?? '',
  title: source?.title ?? 'Preguntas Frecuentes',
  desc: source?.desc ?? source?.description ?? '',
  showSearch: source?.showSearch !== false,
  searchPlaceholder: source?.searchPlaceholder || 'Busca tu pregunta (ej. becas, carreras, virtual, acreditación)...',
  items: Array.isArray(source?.items) ? source.items.map(buildFaqItem) : DEFAULT_FAQ_ITEMS,
});


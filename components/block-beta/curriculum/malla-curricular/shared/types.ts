/**
 * Tipos y datos por defecto para el bloque MallaCurricular.
 * Lámina Figma: [Section-Carreras-Pregradol] (node 2319:45659)
 */

export interface MallaCourse {
  id: string;
  name: string;
  credits?: string | number;
  badge?: string;
}

export interface MallaCycle {
  id: string;
  name: string;
  note?: string;
  courses: MallaCourse[];
}

export interface MallaYear {
  id: string;
  number: string;
  title: string;
  defaultOpen?: boolean;
  cycles: MallaCycle[];
}

export interface MallaCurricularData {
  eyebrow?: string;
  title: string;
  desc?: string;
  years: MallaYear[];
  showAlert?: boolean;
  alertText?: string;
  modalities?: Array<{ label: string; url?: string }>;
  showDownload?: boolean;
  downloadLabel?: string;
  downloadUrl?: string;
}

export const createMallaId = (prefix = 'malla'): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const DEFAULT_MALLA_YEARS: MallaYear[] = [
  {
    id: 'year-1',
    number: '01',
    title: 'Primer año',
    defaultOpen: true,
    cycles: [
      {
        id: 'cycle-0',
        name: 'Ciclo 0 (pre-formación)',
        note: 'Los cursos de Pre-Formación pueden ser convalidados por examen.',
        courses: [
          { id: 'c-0-1', name: 'Comunicaciones' },
          { id: 'c-0-2', name: 'Herramientas Digitales' },
          { id: 'c-0-3', name: 'Matemáticas' },
        ],
      },
      {
        id: 'cycle-1',
        name: 'Ciclo 1',
        courses: [
          { id: 'c-1-1', name: 'Gestión empresarial, finanzas y marketing' },
          { id: 'c-1-2', name: 'Análisis de Datos I' },
          { id: 'c-1-3', name: 'Comunicación y Literatura I' },
          { id: 'c-1-4', name: 'Filosofía y Ética' },
          { id: 'c-1-5', name: 'Pensamiento Crítico' },
          { id: 'c-1-6', name: 'Pre Cálculo' },
          { id: 'c-1-7', name: 'Taller: Desarrollo de Competencias Personales I' },
        ],
      },
      {
        id: 'cycle-2',
        name: 'Ciclo 2',
        courses: [
          { id: 'c-2-1', name: 'Cálculo I' },
          { id: 'c-2-2', name: 'Comportamiento Humano en las Organizaciones' },
          { id: 'c-2-3', name: 'Comunicación y Literatura II' },
          { id: 'c-2-4', name: 'Contabilidad General' },
          { id: 'c-2-5', name: 'Estadística y Probabilidades' },
          { id: 'c-2-6', name: 'Fundamentos de Marketing' },
          { id: 'c-2-7', name: 'Taller: Desarrollo de Competencias Profesionales I' },
          { id: 'c-2-8', name: 'Mérito de Complemento Curricular I' },
        ],
      },
    ],
  },
  {
    id: 'year-2',
    number: '02',
    title: 'Segundo año',
    defaultOpen: false,
    cycles: [
      {
        id: 'cycle-3',
        name: 'Ciclo 3',
        courses: [
          { id: 'c-3-1', name: 'Microeconomía' },
          { id: 'c-3-2', name: 'Costos y Presupuestos' },
          { id: 'c-3-3', name: 'Fundamentos de Finanzas' },
          { id: 'c-3-4', name: 'Métodos Cuantitativos para los Negocios' },
          { id: 'c-3-5', name: 'Derecho Empresarial' },
        ],
      },
      {
        id: 'cycle-4',
        name: 'Ciclo 4',
        courses: [
          { id: 'c-4-1', name: 'Macroeconomía' },
          { id: 'c-4-2', name: 'Gestión del Talento Humano' },
          { id: 'c-4-3', name: 'Finanzas Corporativas' },
          { id: 'c-4-4', name: 'Investigación de Mercados' },
          { id: 'c-4-5', name: 'Operaciones y Logística' },
        ],
      },
    ],
  },
  {
    id: 'year-3',
    number: '03',
    title: 'Tercer año',
    defaultOpen: false,
    cycles: [
      {
        id: 'cycle-5',
        name: 'Ciclo 5',
        courses: [
          { id: 'c-5-1', name: 'Estrategia Empresarial' },
          { id: 'c-5-2', name: 'Marketing Estratégico' },
          { id: 'c-5-3', name: 'Gestión de Procesos' },
          { id: 'c-5-4', name: 'Econometría Aplicada' },
        ],
      },
      {
        id: 'cycle-6',
        name: 'Ciclo 6',
        courses: [
          { id: 'c-6-1', name: 'Comercio y Negocios Internacionales' },
          { id: 'c-6-2', name: 'Evaluación Privada de Proyectos' },
          { id: 'c-6-3', name: 'Sistemas Integrados de Información (ERP)' },
          { id: 'c-6-4', name: 'Liderazgo y Negociación' },
        ],
      },
    ],
  },
  {
    id: 'year-4',
    number: '04',
    title: 'Cuarto año',
    defaultOpen: false,
    cycles: [
      {
        id: 'cycle-7',
        name: 'Ciclo 7',
        courses: [
          { id: 'c-7-1', name: 'Innovación y Modelos de Negocio' },
          { id: 'c-7-2', name: 'Dirección Comercial' },
          { id: 'c-7-3', name: 'Finanzas Internacionales' },
          { id: 'c-7-4', name: 'Curso Electivo I' },
        ],
      },
      {
        id: 'cycle-8',
        name: 'Ciclo 8',
        courses: [
          { id: 'c-8-1', name: 'Supply Chain Management' },
          { id: 'c-8-2', name: 'Business Analytics' },
          { id: 'c-8-3', name: 'Gestión del Cambio Organizacional' },
          { id: 'c-8-4', name: 'Curso Electivo II' },
        ],
      },
    ],
  },
  {
    id: 'year-5',
    number: '05',
    title: 'Quinto año',
    defaultOpen: false,
    cycles: [
      {
        id: 'cycle-9',
        name: 'Ciclo 9',
        courses: [
          { id: 'c-9-1', name: 'Seminario de Tesis I' },
          { id: 'c-9-2', name: 'Gerencia Estratégica Global' },
          { id: 'c-9-3', name: 'Ética y Responsabilidad Social Empresarial' },
          { id: 'c-9-4', name: 'Curso Electivo III' },
        ],
      },
      {
        id: 'cycle-10',
        name: 'Ciclo 10',
        courses: [
          { id: 'c-10-1', name: 'Seminario de Tesis II' },
          { id: 'c-10-2', name: 'Simulación de Negocios (Capstone)' },
          { id: 'c-10-3', name: 'Gobierno Corporativo' },
          { id: 'c-10-4', name: 'Curso Electivo IV' },
        ],
      },
    ],
  },
];

export const DEFAULT_MODALITIES = [
  { label: 'Presencial', url: '#' },
  { label: 'Semipresencial', url: '#' },
  { label: 'A distancia', url: '#' },
];

export const buildMallaCurricularData = (source: any): MallaCurricularData => ({
  eyebrow: source?.eyebrow ?? 'Diez ciclos y 200 créditos',
  title: source?.title ?? 'Malla curricular',
  desc:
    source?.desc ??
    source?.description ??
    'Diez ciclos organizados en cinco años, con un ciclo cero de nivelación en Comunicaciones y Matemática que puedes convalidar por examen.',
  years: Array.isArray(source?.years) && source.years.length ? source.years : DEFAULT_MALLA_YEARS,
  showAlert: source?.showAlert !== false,
  alertText: source?.alertText || 'El plan de estudios puede tener cambios y modificaciones.',
  modalities: Array.isArray(source?.modalities) && source.modalities.length ? source.modalities : DEFAULT_MODALITIES,
  showDownload: source?.showDownload !== false,
  downloadLabel: source?.downloadLabel || 'Descargar malla curricular',
  downloadUrl: source?.downloadUrl || '#',
});


export type CourseInfoValueStyle = 'auto' | 'display' | 'body';

export interface CourseGeneralInfoRow {
  id: string;
  label: string;
  value: string;
  valueStyle: CourseInfoValueStyle;
}

export interface CourseGeneralInfoData {
  title: string;
  rows: CourseGeneralInfoRow[];
  footnotes: string;
}

export const COURSE_GENERAL_INFO_RULES = {
  title: { maxLength: 100 },
  label: { maxLength: 80 },
  value: { maxLength: 800 },
  footnotes: { maxLength: 1600 },
  maxRows: 16,
} as const;

export const DEFAULT_COURSE_GENERAL_INFO_DATA: CourseGeneralInfoData = {
  title: 'Datos Generales',
  rows: [
    { id: 'info-1', label: 'Fecha de inicio', value: '31 de octubre de 2026', valueStyle: 'auto' },
    { id: 'info-2', label: 'Horario', value: 'Sábados de 9:00 am. a 12:30 pm.', valueStyle: 'auto' },
    { id: 'info-3', label: 'Duración', value: '08 clases - 24 horas académicas', valueStyle: 'auto' },
    { id: 'info-4', label: 'Inversión*', value: 'S/ 720.00*', valueStyle: 'auto' },
    {
      id: 'info-5',
      label: 'Certificado',
      value:
        'Los participantes que cumplan con el 80% de asistencia al curso y obtengan una nota mínima aprobatoria de once (11) recibirán el certificado de suficiencia y constancia de notas emitido por Universidad Esan.',
      valueStyle: 'auto',
    },
  ],
  footnotes:
    '*ESAN otorga DESCUENTOS a alumnos, ex alumnos, graduados, participantes grupales y corporativos.\n**Una vez confirmado el inicio del curso por medio de un correo, no se podrá solicitar devoluciones, retiros o traslados. El dictado de clases del curso se iniciará siempre que se alcance el número mínimo de alumnos matriculados. Extended Learning ESAN se reserva el derecho de modificar la plana docente, por motivos de fuerza mayor o por disponibilidad del profesor, garantizando que la calidad del curso no se vea afectada.',
};

const normalizeValueStyle = (val: unknown): CourseInfoValueStyle =>
  val === 'display' || val === 'body' ? val : 'auto';

export const normalizeCourseGeneralInfoData = (raw: any): CourseGeneralInfoData => {
  const source = raw && typeof raw === 'object' ? raw : {};

  const rows: CourseGeneralInfoRow[] = Array.isArray(source.rows)
    ? source.rows.slice(0, COURSE_GENERAL_INFO_RULES.maxRows).map((r: any, i: number) => ({
        id: typeof r?.id === 'string' && r.id ? r.id : `info-${i + 1}`,
        label: String(r?.label ?? '').slice(0, COURSE_GENERAL_INFO_RULES.label.maxLength),
        value: String(r?.value ?? '').slice(0, COURSE_GENERAL_INFO_RULES.value.maxLength),
        valueStyle: normalizeValueStyle(r?.valueStyle),
      }))
    : DEFAULT_COURSE_GENERAL_INFO_DATA.rows;

  return {
    title:
      typeof source.title === 'string'
        ? source.title.slice(0, COURSE_GENERAL_INFO_RULES.title.maxLength)
        : DEFAULT_COURSE_GENERAL_INFO_DATA.title,
    rows,
    footnotes:
      typeof source.footnotes === 'string'
        ? source.footnotes.slice(0, COURSE_GENERAL_INFO_RULES.footnotes.maxLength)
        : DEFAULT_COURSE_GENERAL_INFO_DATA.footnotes,
  };
};

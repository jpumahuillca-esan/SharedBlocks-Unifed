import { normalizeLinkTarget, type LinkTarget } from '../../../../../helpers/linkTarget';
import { normalizeBrandColorToken } from '../../../../editor-beta/EditorBrandColor/brandColors';
import { normalizeImageFocusProfiles, type ImageFocusProfiles } from '../../../../../helpers/imageFocus';

export interface InternationalSectionRow {
  id: string;
  title: string;
  text: string;
}

export interface InternationalSectionData {
  backgroundToken: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageFocusProfiles: ImageFocusProfiles;
  rows: InternationalSectionRow[];
  buttonText: string;
  buttonLink: string;
  buttonTarget: LinkTarget | '';
}

export const MAX_INTERNATIONAL_ROWS = 5;
export const DEFAULT_INTERNATIONAL_BACKGROUND = '--ds-color-university';

export const createInternationalRow = (index = 0): InternationalSectionRow => ({
  id: `international-row-${Date.now()}-${index}`,
  title: index === 0 ? 'Doble grado' : 'Nuevo programa',
  text: '',
});

export const DEFAULT_INTERNATIONAL_SECTION: InternationalSectionData = {
  backgroundToken: DEFAULT_INTERNATIONAL_BACKGROUND,
  eyebrow: 'Internacionalización',
  title: 'Estudia un año de tu carrera en otro país',
  description: 'Tenemos <strong>más de 130 convenios internacionales</strong> y tres tipos de programa. Al volver, convalidas los cursos que aprobaste.',
  image: '',
  imageAlt: '',
  imageFocusProfiles: normalizeImageFocusProfiles(undefined, 50, 50),
  rows: [
    { id: 'international-row-1', title: 'Doble grado', text: 'Dos semestres en <strong>International American University</strong>, en Estados Unidos. Terminas con el bachiller de ESAN y un Bachelor of Business Administration.' },
    { id: 'international-row-2', title: 'Intercambio', text: 'Uno o dos semestres en una universidad extranjera, desde el quinto ciclo y con créditos aprobados.' },
    { id: 'international-row-3', title: 'Programas cortos y Global Week', text: 'Cursos de 3 a 4 semanas en inglés, en verano o invierno, con profesores de otros países.' },
  ],
  buttonText: 'Conoce los programas internacionales',
  buttonLink: '',
  buttonTarget: '',
};

export const normalizeInternationalSection = (raw?: Partial<InternationalSectionData> | null): InternationalSectionData => {
  const source = raw ?? {};
  const rows = Array.isArray(source.rows) ? source.rows.slice(0, MAX_INTERNATIONAL_ROWS) : DEFAULT_INTERNATIONAL_SECTION.rows;
  return {
    ...DEFAULT_INTERNATIONAL_SECTION,
    ...source,
    backgroundToken: normalizeBrandColorToken(source.backgroundToken || DEFAULT_INTERNATIONAL_BACKGROUND),
    eyebrow: typeof source.eyebrow === 'string' ? source.eyebrow : DEFAULT_INTERNATIONAL_SECTION.eyebrow,
    title: typeof source.title === 'string' ? source.title : DEFAULT_INTERNATIONAL_SECTION.title,
    description: typeof source.description === 'string' ? source.description : DEFAULT_INTERNATIONAL_SECTION.description,
    image: typeof source.image === 'string' ? source.image : '',
    imageAlt: typeof source.imageAlt === 'string' ? source.imageAlt : '',
    imageFocusProfiles: normalizeImageFocusProfiles(source.imageFocusProfiles, 50, 50),
    rows: rows.map((row, index) => ({
      id: String(row?.id || `international-row-${index + 1}`),
      title: typeof row?.title === 'string' ? row.title : '',
      text: typeof row?.text === 'string' ? row.text : '',
    })),
    buttonText: typeof source.buttonText === 'string' ? source.buttonText : DEFAULT_INTERNATIONAL_SECTION.buttonText,
    buttonLink: typeof source.buttonLink === 'string' ? source.buttonLink : '',
    buttonTarget: normalizeLinkTarget(source.buttonTarget),
  };
};

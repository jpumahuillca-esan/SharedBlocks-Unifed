/**
 * Paleta institucional reutilizable para los bloques ARCIS.
 *
 * IMPORTANTE:
 * En la base de datos se guarda el TOKEN y nunca el hexadecimal.
 * Si Diseño modifica posteriormente el valor del token, las páginas
 * ya publicadas reciben automáticamente el nuevo color.
 */

export type BrandColorGroupId =
  | 'corporate'
  | 'university'
  | 'gsb';

export interface BrandColorOption {
  label: string;
  token: string;
}

export interface BrandColorGroup {
  id: BrandColorGroupId;
  label: string;
  colors: BrandColorOption[];
}

/**
 * Regla de Design System:
 *
 * Cuando estos colores se utilizan como fondo, el contenido textual
 * debe utilizar --ds-color-text-primary.
 */
export const DARK_TEXT_BACKGROUND_TOKENS = new Set<string>([
  '--ds-color-univ-communications',
  '--ds-color-univ-law',
  '--ds-color-univ-psychology',
]);

export const BRAND_COLOR_GROUPS: BrandColorGroup[] = [
  {
    id: 'corporate',
    label: 'ESAN Corporate',
    colors: [
      {
        label: 'Corporate',
        token: '--ds-color-esan-corp',
      },
      {
        label: 'Corporate Second',
        token: '--ds-color-esan-corp-second',
      },
      {
        label: 'Corporate Second On',
        token: '--ds-color-esan-corp-second-on',
      },
      {
        label: 'Corporate Third',
        token: '--ds-color-esan-corp-third',
      },
    ],
  },

  {
    id: 'university',
    label: 'ESAN University',
    colors: [
      {
        label: 'University',
        token: '--ds-color-university',
      },
      {
        label: 'Maestrías',
        token: '--ds-color-univ-maestrias',
      },
      {
        label: 'Management',
        token: '--ds-color-univ-management',
      },
      {
        label: 'Economics',
        token: '--ds-color-univ-economics',
      },
      {
        label: 'Communications',
        token: '--ds-color-univ-communications',
      },
      {
        label: 'Engineering',
        token: '--ds-color-univ-engineering',
      },
      {
        label: 'Law',
        token: '--ds-color-univ-law',
      },
      {
        label: 'Psychology',
        token: '--ds-color-univ-psychology',
      },
    ],
  },

  {
    id: 'gsb',
    label: 'ESAN GSB',
    colors: [
      {
        label: 'ME',
        token: '--ds-color-gsb-me',
      },
      {
        label: 'MBA Primary',
        token: '--ds-color-gsb-mba-primary',
      },
      {
        label: 'MBA Secondary',
        token: '--ds-color-gsb-mba-secondary',
      },
      {
        label: 'Doctorado',
        token: '--ds-color-gsb-doctorado',
      },
      {
        label: 'Doctorado Secondary',
        token: '--ds-color-gsb-doctorado-secondary',
      },
      {
        label: 'Ecosistema 01',
        token: '--ds-color-gsb-ecosistema-01',
      },
      {
        label: 'Ecosistema 02',
        token: '--ds-color-gsb-ecosistema-02',
      },
      {
        label: 'Ecosistema 03',
        token: '--ds-color-gsb-ecosistema-03',
      },
      {
        label: 'Ecosistema 04',
        token: '--ds-color-gsb-ecosistema-04',
      },
      {
        label: 'Ecosistema 05',
        token: '--ds-color-gsb-ecosistema-05',
      },
      {
        label: 'Ecosistema 06',
        token: '--ds-color-gsb-ecosistema-06',
      },
      {
        label: 'Ecosistema 07',
        token: '--ds-color-gsb-ecosistema-07',
      },
      {
        label: 'Ecosistema 08',
        token: '--ds-color-gsb-ecosistema-08',
      },
      {
        label: 'Ecosistema 09',
        token: '--ds-color-gsb-ecosistema-09',
      },
      {
        label: 'Ecosistema 10',
        token: '--ds-color-gsb-ecosistema-10',
      },
      {
        label: 'Ecosistema 11',
        token: '--ds-color-gsb-ecosistema-11',
      },
      {
        label: 'Ecosistema 12',
        token: '--ds-color-gsb-ecosistema-12',
      },
      {
        label: 'Ecosistema 13',
        token: '--ds-color-gsb-ecosistema-13',
      },
      {
        label: 'Ecosistema 14',
        token: '--ds-color-gsb-ecosistema-14',
      },
      {
        label: 'Ecosistema 15',
        token: '--ds-color-gsb-ecosistema-15',
      },
      {
        label: 'Ecosistema 16',
        token: '--ds-color-gsb-ecosistema-16',
      },
      {
        label: 'Ecosistema 17',
        token: '--ds-color-gsb-ecosistema-17',
      },
    ],
  },
];

export const DEFAULT_BRAND_COLOR_GROUP: BrandColorGroupId =
  'university';

export const DEFAULT_BRAND_COLOR_TOKEN =
  '--ds-color-univ-management';

const ALL_BRAND_COLOR_TOKENS = new Set(
  BRAND_COLOR_GROUPS.flatMap((group) =>
    group.colors.map((color) => color.token),
  ),
);

export const normalizeBrandColorToken = (
  value: unknown,
): string => {
  if (
    typeof value === 'string' &&
    ALL_BRAND_COLOR_TOKENS.has(value)
  ) {
    return value;
  }

  return DEFAULT_BRAND_COLOR_TOKEN;
};

export const getBrandColorGroup = (
  id: BrandColorGroupId,
): BrandColorGroup =>
  BRAND_COLOR_GROUPS.find(
    (group) => group.id === id,
  ) ??
  BRAND_COLOR_GROUPS.find(
    (group) =>
      group.id === DEFAULT_BRAND_COLOR_GROUP,
  )!;

/**
 * Determina automáticamente a qué grupo pertenece un token.
 *
 * Esto permite que la familia seleccionada sea estado únicamente
 * del editor y NO tengamos que guardarla en la base de datos.
 */
export const findBrandGroupByToken = (
  token: unknown,
): BrandColorGroup => {
  if (typeof token === 'string') {
    const group = BRAND_COLOR_GROUPS.find(
      (candidate) =>
        candidate.colors.some(
          (color) => color.token === token,
        ),
    );

    if (group) return group;
  }

  return getBrandColorGroup(
    DEFAULT_BRAND_COLOR_GROUP,
  );
};

/**
 * Color del contenido cuando el token se utiliza como fondo.
 */
export const resolveBrandContentToken = (
  token: string,
): string =>
  DARK_TEXT_BACKGROUND_TOKENS.has(token)
    ? '--ds-color-text-primary'
    : '--ds-color-text-inverse';
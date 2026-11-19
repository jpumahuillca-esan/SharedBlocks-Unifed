import { BRAND_COLOR_GROUPS } from '../../../../editor-beta/EditorBrandColor/brandColors';
import {
  normalizeImageFocus,
  normalizeImageFocusProfiles,
  type ImageFocusProfiles,
} from '../../../../../helpers/imageFocus';
import {
  normalizeLinkTarget,
  type LinkTarget,
} from '../../../../../helpers/linkTarget';

export interface CardInternationalItem {
  id: string;
  icon?: string;
  text: string;
}

export interface CardInternationalData {
  title: string;
  desc?: string;
  image?: string;
  imageAlt?: string;
  imageFocusX?: number;
  imageFocusY?: number;
  imageFocusProfiles?: ImageFocusProfiles;
  panelColorToken?: string;
  backgroundColor?: string;
  items?: CardInternationalItem[];
  buttonText?: string;
  buttonLink?: string;
  buttonTarget?: LinkTarget | '_self';
}

export interface CardInternationalIconOption {
  value: string;
  label: string;
}

export const CARD_INTERNATIONAL_ICON_OPTIONS: CardInternationalIconOption[] = [
  { value: 'pin-globe', label: 'Globo / Ubicación (ESAN)' },
  { value: 'handshake', label: 'Apretón de manos / Intercambio (ESAN)' },
  { value: 'grad-cap', label: 'Birrete / Doble Grado (ESAN)' },
  { value: 'alumni-group', label: 'Comunidad de alumnos (ESAN)' },
  { value: 'globe', label: 'Mundo (lineal)' },
  { value: 'award', label: 'Medalla / Reconocimiento' },
  { value: 'briefcase', label: 'Maletín profesional' },
  { value: 'graduation-cap', label: 'Birrete (lineal)' },
  { value: 'book-open', label: 'Libro abierto' },
  { value: 'users', label: 'Personas / Grupo' },
  { value: 'calendar', label: 'Calendario' },
  { value: 'star', label: 'Estrella' },
];

const DEFAULT_FOCUS_X = 50;
const DEFAULT_FOCUS_Y = 30;
export const DEFAULT_CARD_INTERNATIONAL_COLOR_TOKEN = '--ds-color-university';

const BRAND_TOKENS = new Set(
  BRAND_COLOR_GROUPS.flatMap((group) => group.colors.map((option) => option.token)),
);

const LEGACY_HEX_TO_TOKEN: Record<string, string> = {
  '#E3173E': '--ds-color-university',
  '#17245E': '--ds-color-univ-dpa',
  '#2E509B': '--ds-color-univ-management',
  '#0067B2': '--ds-color-graduate',
  '#00A79D': '--ds-color-execed',
};

const TOKEN_TO_LEGACY_HEX: Record<string, string> = Object.fromEntries(
  Object.entries(LEGACY_HEX_TO_TOKEN).map(([hex, token]) => [token, hex]),
);

export const resolveCardInternationalColorToken = (
  data?: Partial<CardInternationalData> | null,
): string => {
  const token = String(data?.panelColorToken ?? '').trim();
  if (token && BRAND_TOKENS.has(token)) return token;

  const legacyHex = String(data?.backgroundColor ?? '').trim().toUpperCase();
  if (legacyHex && LEGACY_HEX_TO_TOKEN[legacyHex]) {
    return LEGACY_HEX_TO_TOKEN[legacyHex];
  }

  return DEFAULT_CARD_INTERNATIONAL_COLOR_TOKEN;
};

export const resolveCardInternationalBackground = (
  data?: Partial<CardInternationalData> | null,
): string => {
  const token = String(data?.panelColorToken ?? '').trim();
  if (token && BRAND_TOKENS.has(token)) {
    return `var(${token})`;
  }

  const rawHex = String(data?.backgroundColor ?? '').trim();
  const mappedToken = rawHex ? LEGACY_HEX_TO_TOKEN[rawHex.toUpperCase()] : '';
  if (mappedToken) {
    return `var(${mappedToken})`;
  }

  if (rawHex) return rawHex;

  return `var(${DEFAULT_CARD_INTERNATIONAL_COLOR_TOKEN})`;
};

export const tokenToLegacyBackgroundHex = (token?: string): string | undefined => {
  const clean = String(token ?? '').trim();
  return clean ? TOKEN_TO_LEGACY_HEX[clean] : undefined;
};

export const DEFAULT_CARD_INTERNATIONAL_DATA: CardInternationalData = {
  title: 'Internacionalización',
  desc: 'Tenemos más de 130 convenios internacionales y tres tipos de programa. Al volver, convalidas los cursos que aprobaste.',
  image: '/storage/media/pregrado/2026/10/img_hero_esan_internacional_001.webp',
  imageAlt: 'Estudiantes de intercambio internacional ESAN',
  imageFocusX: DEFAULT_FOCUS_X,
  imageFocusY: DEFAULT_FOCUS_Y,
  imageFocusProfiles: normalizeImageFocusProfiles(undefined, DEFAULT_FOCUS_X, DEFAULT_FOCUS_Y),
  panelColorToken: DEFAULT_CARD_INTERNATIONAL_COLOR_TOKEN,
  backgroundColor: '#E3173E',
  items: [
    {
      id: 'item-1',
      icon: 'pin-globe',
      text: 'Internacionalización desde los primeros ciclos: Global Weeks, Summer & Winter Programs',
    },
    {
      id: 'item-2',
      icon: 'handshake',
      text: '+130 Intercambios internacionales',
    },
    {
      id: 'item-3',
      icon: 'grad-cap',
      text: '+11 oportunidades de Doble Grado',
    },
    {
      id: 'item-4',
      icon: 'alumni-group',
      text: '+300 alumnos han realizado programas de intercambio',
    },
  ],
  buttonText: 'Ver más de Internacionalización',
  buttonLink: '#',
  buttonTarget: '',
};

const normalizeItem = (item: any, index: number): CardInternationalItem => ({
  id: String(item?.id || `item-${index + 1}`),
  icon: typeof item?.icon === 'string' ? item.icon : 'pin-globe',
  text: typeof item?.text === 'string' ? item.text : '',
});

export const normalizeCardInternationalData = (
  raw?: Partial<CardInternationalData> | null,
): CardInternationalData => {
  const source = raw ?? {};
  const panelColorToken = resolveCardInternationalColorToken(source);
  const imageFocusX = normalizeImageFocus(source.imageFocusX ?? DEFAULT_FOCUS_X);
  const imageFocusY = normalizeImageFocus(source.imageFocusY ?? DEFAULT_FOCUS_Y);
  const rawItems = Array.isArray(source.items)
    ? source.items
    : (DEFAULT_CARD_INTERNATIONAL_DATA.items ?? []);

  return {
    title: typeof source.title === 'string' ? source.title : DEFAULT_CARD_INTERNATIONAL_DATA.title,
    desc: typeof source.desc === 'string' ? source.desc : (DEFAULT_CARD_INTERNATIONAL_DATA.desc ?? ''),
    image: typeof source.image === 'string' ? source.image : (DEFAULT_CARD_INTERNATIONAL_DATA.image ?? ''),
    imageAlt: typeof source.imageAlt === 'string' ? source.imageAlt : (DEFAULT_CARD_INTERNATIONAL_DATA.imageAlt ?? ''),
    imageFocusX,
    imageFocusY,
    imageFocusProfiles: normalizeImageFocusProfiles(source.imageFocusProfiles, imageFocusX, imageFocusY),
    panelColorToken,
    backgroundColor: tokenToLegacyBackgroundHex(panelColorToken) ?? (typeof source.backgroundColor === 'string' ? source.backgroundColor : '#E3173E'),
    items: rawItems.map(normalizeItem),
    buttonText: typeof source.buttonText === 'string' ? source.buttonText : (DEFAULT_CARD_INTERNATIONAL_DATA.buttonText ?? ''),
    buttonLink: typeof source.buttonLink === 'string' ? source.buttonLink : (DEFAULT_CARD_INTERNATIONAL_DATA.buttonLink ?? ''),
    buttonTarget: normalizeLinkTarget(source.buttonTarget),
  };
};

import {
  DEFAULT_BRAND_COLOR_TOKEN,
  normalizeBrandColorToken,
} from '../../../editor-beta/EditorBrandColor/brandColors';
import {
  normalizeLinkTarget,
  type LinkTarget,
} from '../../../../helpers/linkTarget';
import dpaManagementImg from '../../../../assets/images/dpa-faculty-management.jpg';
import dpaEngineeringImg from '../../../../assets/images/dpa-faculty-engineering.jpg';
import dpaLawImg from '../../../../assets/images/dpa-faculty-law.jpg';
import dpaPsychologyImg from '../../../../assets/images/dpa-faculty-psychology.jpg';

const DEFAULT_FACULTY_IMAGES = [
  dpaManagementImg,
  dpaEngineeringImg,
  dpaLawImg,
  dpaPsychologyImg,
];

const LEGACY_UNSPLASH_URLS = new Set([
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop',
]);

export type EcosystemDpaFocusMode = 'web' | 'tablet' | 'mobile';

export interface EcosystemDpaFocusPoint {
  x: number;
  y: number;
}

export type EcosystemDpaFocusProfiles = Record<
  EcosystemDpaFocusMode,
  EcosystemDpaFocusPoint
>;

export interface EcosystemDpaLink {
  id: string;
  label: string;
  href: string;
  target: LinkTarget;
}

export interface EcosystemDpaItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  imageAlt: string;
  imageFocusProfiles: EcosystemDpaFocusProfiles;
  imageFocusX: number;
  imageFocusY: number;
  href: string;
  target: LinkTarget;
  colorToken: string;
  links: EcosystemDpaLink[];
}

export interface EcosystemDpaData {
  eyebrow: string;
  title: string;
  desc: string;
  backgroundColor: string;
  items: EcosystemDpaItem[];
}

const normalizeImageFocus = (value: unknown): number => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 50;
  return Math.min(100, Math.max(0, n));
};

const normalizeFocusPoint = (
  raw: any,
  fallback: EcosystemDpaFocusPoint,
): EcosystemDpaFocusPoint => ({
  x: normalizeImageFocus(raw?.x ?? fallback.x),
  y: normalizeImageFocus(raw?.y ?? fallback.y),
});

export const newEcosystemDpaCardId = (): string =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `edpa-card-${crypto.randomUUID()}`
    : `edpa-card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const newEcosystemDpaLinkId = (): string =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `edpa-link-${crypto.randomUUID()}`
    : `edpa-link-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const normalizeEcosystemDpaLink = (
  raw: any,
  index = 0,
): EcosystemDpaLink => ({
  id: raw?.id || `edpa-link-${index}`,
  label: typeof raw?.label === 'string' ? raw.label.slice(0, 120) : '',
  href: typeof raw?.href === 'string' ? raw.href.trim() : '',
  target: normalizeLinkTarget(raw?.target),
});

export const normalizeEcosystemDpaItem = (
  raw: any,
  index = 0,
): EcosystemDpaItem => {
  const linksRaw = Array.isArray(raw?.links) ? raw.links : [];
  const baseFocus: EcosystemDpaFocusPoint = {
    x: normalizeImageFocus(raw?.imageFocusX),
    y: normalizeImageFocus(raw?.imageFocusY),
  };
  const profilesRaw = raw?.imageFocusProfiles ?? {};
  const webFocus = normalizeFocusPoint(profilesRaw.web, baseFocus);

  const rawImage = typeof raw?.image === 'string' ? raw.image.trim() : '';
  const fallbackImage = DEFAULT_FACULTY_IMAGES[index % DEFAULT_FACULTY_IMAGES.length] || dpaManagementImg;
  const resolvedImage = !rawImage || LEGACY_UNSPLASH_URLS.has(rawImage) ? fallbackImage : rawImage;

  return {
    id: raw?.id || `edpa-card-${index}`,
    title: typeof raw?.title === 'string' ? raw.title.slice(0, 100) : '',
    desc: typeof raw?.desc === 'string' ? raw.desc.slice(0, 180) : '',
    image: resolvedImage,
    imageAlt: typeof raw?.imageAlt === 'string' ? raw.imageAlt.slice(0, 140) : '',
    imageFocusProfiles: {
      web: webFocus,
      tablet: normalizeFocusPoint(profilesRaw.tablet, webFocus),
      mobile: normalizeFocusPoint(profilesRaw.mobile, webFocus),
    },
    imageFocusX: webFocus.x,
    imageFocusY: webFocus.y,
    href: typeof raw?.href === 'string' ? raw.href.trim() : '',
    target: normalizeLinkTarget(raw?.target),
    colorToken: normalizeBrandColorToken(
      !raw?.colorToken || raw?.colorToken === '--ds-color-univ-management'
        ? '--ds-color-univ-dpa'
        : raw.colorToken,
    ),
    links: linksRaw.map((l: any, li: number) =>
      normalizeEcosystemDpaLink(l, li),
    ),
  };
};

export const normalizeEcosystemDpaData = (raw: any): EcosystemDpaData => {
  const itemsRaw = Array.isArray(raw?.items) ? raw.items : [];
  return {
    eyebrow: typeof raw?.eyebrow === 'string' ? raw.eyebrow.slice(0, 80) : '',
    title: typeof raw?.title === 'string' ? raw.title.slice(0, 140) : '',
    desc: typeof raw?.desc === 'string' ? raw.desc.slice(0, 320) : '',
    backgroundColor:
      typeof raw?.backgroundColor === 'string' && raw.backgroundColor.trim()
        ? raw.backgroundColor.trim()
        : '#F1F5F9',
    items: itemsRaw.map((item: any, idx: number) =>
      normalizeEcosystemDpaItem(item, idx),
    ),
  };
};

export const createEmptyEcosystemDpaLink = (): EcosystemDpaLink => ({
  id: newEcosystemDpaLinkId(),
  label: 'Nueva carrera',
  href: '',
  target: '',
});

export const createEmptyEcosystemDpaItem = (): EcosystemDpaItem => ({
  id: newEcosystemDpaCardId(),
  title: 'Nueva facultad',
  desc: 'Descripción de la facultad',
  image: '',
  imageAlt: '',
  imageFocusProfiles: {
    web: { x: 50, y: 50 },
    tablet: { x: 50, y: 50 },
    mobile: { x: 50, y: 50 },
  },
  imageFocusX: 50,
  imageFocusY: 50,
  href: '',
  target: '',
  colorToken: DEFAULT_BRAND_COLOR_TOKEN,
  links: [createEmptyEcosystemDpaLink()],
});


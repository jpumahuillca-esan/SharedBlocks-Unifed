import {
  normalizeImageFocus,
  normalizeImageFocusProfiles,
  type ImageFocusProfiles,
} from '../../../../../helpers/imageFocus';
import {
  normalizeLinkTarget,
  type LinkTarget,
} from '../../../../../helpers/linkTarget';

export interface AudienceCardItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  imageAlt?: string;
  imageFocusX?: number;
  imageFocusY?: number;
  imageFocusProfiles?: ImageFocusProfiles;
  href?: string;
  target?: LinkTarget | '_self' | string;
}

export interface AudienceSwitcherData {
  title?: string;
  cards?: AudienceCardItem[];
}

export const createDefaultAudienceCards = (): AudienceCardItem[] => [
  normalizeAudienceCard(
    {
      id: 'as-1',
      title: 'Terminé el colegio',
      desc: 'Conoce la carreras de pregrado para empezar tu vida universitaria.',
      image: '/storage/media/main/2026/09/1790349849_banner-image-wide.webp',
      imageAlt: 'Estudiantes de pregrado ESAN',
      href: '#pregrado',
      target: '',
    },
    0,
  ),
  normalizeAudienceCard(
    {
      id: 'as-2',
      title: 'Ya trabajo',
      desc: 'Conoce las carreras universitarias para adultos con experiencia laboral.',
      image: '/storage/media/main/2026/09/1790349853_banner-image-wide-1.webp',
      imageAlt: 'Estudiantes DPA ESAN',
      href: '#dpa',
      target: '',
    },
    1,
  ),
];

export const normalizeAudienceCard = (
  raw: any,
  index = 0,
): AudienceCardItem => {
  const imageFocusX = normalizeImageFocus(raw?.imageFocusX);
  const imageFocusY = normalizeImageFocus(raw?.imageFocusY);

  return {
    id: String(raw?.id || `as-${index + 1}`),
    title: typeof raw?.title === 'string' ? raw.title : '',
    desc: typeof raw?.desc === 'string' ? raw.desc : '',
    image: typeof raw?.image === 'string' ? raw.image : '',
    imageAlt: typeof raw?.imageAlt === 'string' ? raw.imageAlt : '',
    imageFocusX,
    imageFocusY,
    imageFocusProfiles: normalizeImageFocusProfiles(
      raw?.imageFocusProfiles,
      imageFocusX,
      imageFocusY,
    ),
    href: typeof raw?.href === 'string' ? raw.href : '',
    target: normalizeLinkTarget(raw?.target),
  };
};

export const normalizeAudienceSwitcherData = (
  raw: unknown,
): Required<AudienceSwitcherData> => {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const rawCards = Array.isArray(data.cards) && data.cards.length > 0
    ? data.cards
    : createDefaultAudienceCards();

  return {
    title: typeof data.title === 'string' ? data.title : '¿En qué momento estás?',
    cards: rawCards.map((card, index) => normalizeAudienceCard(card, index)),
  };
};

import {
  normalizeImageFocus,
  normalizeImageFocusProfiles,
  type ImageFocusProfiles,
} from '../../../../helpers/imageFocus';
import {
  normalizeLinkTarget,
  type LinkTarget,
} from '../../../../helpers/linkTarget';
import defaultFgcuCampus from '../../../../assets/images/dpa-fgcu-campus.jpg';
import defaultIauCampus from '../../../../assets/images/dpa-iau-campus.jpg';
import defaultFgcuLogo from '../../../../assets/images/logos/logo-fgcu.svg';
import defaultIauLogo from '../../../../assets/images/logos/logo-iau.svg';

export interface ConvenioCardItem {
  id: string;
  image: string;
  imageAlt: string;
  imageFocusX: number;
  imageFocusY: number;
  imageFocusProfiles: ImageFocusProfiles;
  logo: string;
  logoAlt: string;
  logoHeight: number;
  desc: string;
}

export interface ConveniosButton {
  label: string;
  url: string;
  target: LinkTarget;
}

export interface ConveniosInternacionalesData {
  eyebrow: string;
  title: string;
  cards: ConvenioCardItem[];
  button: ConveniosButton;
}

export const newConvenioCardId = (): string =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `conv-card-${crypto.randomUUID()}`
    : `conv-card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const normalizeConvenioCard = (
  raw: any,
  index = 0,
): ConvenioCardItem => {
  const imageFocusX = normalizeImageFocus(raw?.imageFocusX);
  const imageFocusY = normalizeImageFocus(raw?.imageFocusY);
  const defaultCampus = index === 0 ? defaultFgcuCampus : defaultIauCampus;
  const defaultLogo = index === 0 ? defaultFgcuLogo : defaultIauLogo;
  const defaultLogoHeight = index === 0 ? 96 : 59;
  const logoHeightNum = Number(raw?.logoHeight);

  return {
    id: raw?.id || `conv-card-${index}`,
    image:
      typeof raw?.image === 'string' && raw.image.trim()
        ? raw.image
        : defaultCampus,
    imageAlt:
      typeof raw?.imageAlt === 'string'
        ? raw.imageAlt.slice(0, 140)
        : index === 0
          ? 'Campus de Florida Gulf Coast University'
          : 'Campus de International American University',
    imageFocusX,
    imageFocusY,
    imageFocusProfiles: normalizeImageFocusProfiles(raw?.imageFocusProfiles, {
      x: imageFocusX,
      y: imageFocusY,
    }),
    logo:
      typeof raw?.logo === 'string' && raw.logo.trim()
        ? raw.logo
        : defaultLogo,
    logoAlt:
      typeof raw?.logoAlt === 'string'
        ? raw.logoAlt.slice(0, 140)
        : index === 0
          ? 'logo de Florida Gulf Coast'
          : 'logo de International American University',
    logoHeight: Number.isFinite(logoHeightNum)
      ? Math.min(120, Math.max(32, logoHeightNum))
      : defaultLogoHeight,
    desc: typeof raw?.desc === 'string' ? raw.desc.slice(0, 420) : '',
  };
};

export const normalizeConveniosData = (
  raw: any,
): ConveniosInternacionalesData => {
  const cardsRaw = Array.isArray(raw?.cards) ? raw.cards : [];

  return {
    eyebrow:
      typeof raw?.eyebrow === 'string'
        ? raw.eyebrow.slice(0, 80)
        : 'internacionalización',
    title:
      typeof raw?.title === 'string'
        ? raw.title.slice(0, 140)
        : 'Convenios académicos internacionales',
    cards: cardsRaw.map((c: any, i: number) => normalizeConvenioCard(c, i)),
    button: {
      label:
        typeof raw?.button?.label === 'string'
          ? raw.button.label.slice(0, 80)
          : 'Descubre ESAN Internacional',
      url:
        typeof raw?.button?.url === 'string' ? raw.button.url.trim() : '',
      target: normalizeLinkTarget(raw?.button?.target),
    },
  };
};

export const createEmptyConvenioCard = (index = 0): ConvenioCardItem =>
  normalizeConvenioCard(
    {
      id: newConvenioCardId(),
      desc: 'Descripción del convenio académico internacional.',
    },
    index,
  );


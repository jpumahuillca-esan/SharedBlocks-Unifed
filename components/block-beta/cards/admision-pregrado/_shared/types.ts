import { normalizeImageFocus } from '../../../../../helpers/imageFocus';
import { normalizeLinkTarget, type LinkTarget } from '../../../../../helpers/linkTarget';

export type AdmissionCardCount = 2 | 3 | 4;

export interface AdmissionCard {
  id: string;
  image: string;
  imageAlt: string;
  /** Punto focal de la foto, en %. 50 y 50 es el centro (ver helpers/imageFocus.ts). */
  imageFocusX: number;
  imageFocusY: number;
  title: string;
  desc: string;
  href: string;
  /** `_blank` abre `href` en una pestaña nueva; vacío, en la misma página. */
  target: LinkTarget;
}

export interface AdmissionPregradoData {
  title: string;
  desc: string;
  linkLabel: string;
  linkUrl: string;
  /** `_blank` abre `linkUrl` en una pestaña nueva; vacío, en la misma página. */
  linkTarget: LinkTarget;
  cardCount: AdmissionCardCount;
  cards: AdmissionCard[];
}

export const normalizeAdmissionCardCount = (value: unknown): AdmissionCardCount => {
  const parsed = Number(value);
  if (parsed === 2) return 2;
  if (parsed === 4) return 4;
  return 3;
};

export const newAdmissionCardId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return 'admision-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
};

export const buildAdmissionCard = (source: any = {}): AdmissionCard => ({
  id: source?.id || newAdmissionCardId(),
  image: typeof source?.image === 'string' ? source.image : '',
  imageAlt: typeof source?.imageAlt === 'string' ? source.imageAlt : '',
  imageFocusX: normalizeImageFocus(source?.imageFocusX),
  imageFocusY: normalizeImageFocus(source?.imageFocusY),
  title: typeof source?.title === 'string' ? source.title : '',
  desc: typeof source?.desc === 'string' ? source.desc : '',
  href: typeof source?.href === 'string' ? source.href : '',
  target: normalizeLinkTarget(source?.target),
});

export const buildAdmissionPregradoData = (source: any = {}): AdmissionPregradoData => ({
  title: typeof source?.title === 'string' ? source.title : 'Admisión de pregrado',
  desc: typeof source?.desc === 'string' ? source.desc : '',
  linkLabel: typeof source?.linkLabel === 'string' ? source.linkLabel : '',
  linkUrl: typeof source?.linkUrl === 'string' ? source.linkUrl : '',
  linkTarget: normalizeLinkTarget(source?.linkTarget),
  cardCount: normalizeAdmissionCardCount(source?.cardCount),
  cards: Array.isArray(source?.cards)
    ? source.cards.map((card: any, index: number) => ({
        ...buildAdmissionCard(card),
        id: card?.id || 'admision-' + index,
      }))
    : [],
});

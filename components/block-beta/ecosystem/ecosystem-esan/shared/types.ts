import {
  DEFAULT_BRAND_COLOR_TOKEN,
  normalizeBrandColorToken,
} from '../../../../editor-beta/EditorBrandColor/brandColors';

import {
  ECOSYSTEM_ESAN_CONTENT_RULES,
} from './rules';

import {
  normalizeLinkTarget,
  type LinkTarget,
} from '../../../../../helpers/linkTarget';

/* ==========================================================================
   Tipos
   ========================================================================== */

export type EcosystemEsanColumns = 3 | 4;
export type EcosystemEsanFocusMode = 'web' | 'tablet' | 'mobile';

export interface EcosystemEsanFocusPoint {
  x: number;
  y: number;
}

export type EcosystemEsanFocusProfiles = Record<
  EcosystemEsanFocusMode,
  EcosystemEsanFocusPoint
>;

export interface EcosystemEsanLink {
  id: string;
  label: string;
  href: string;
  /** `_blank` abre `href` en una pestaña nueva; vacío, en la misma página. */
  target: LinkTarget;
}

export interface EcosystemEsanItem {
  id: string;

  title: string;
  desc: string;

  image: string;
  imageAlt: string;
  imageFocusProfiles: EcosystemEsanFocusProfiles;
  /** Compatibilidad con datos anteriores; reflejan el foco web. */
  imageFocusX: number;
  imageFocusY: number;

  href: string;

  /** `_blank` abre `href` en una pestaña nueva; vacío, en la misma página. */
  target: LinkTarget;

  /**
   * Token institucional.
   *
   * Ejemplo:
   * --ds-color-univ-management
   */
  colorToken: string;

  links: EcosystemEsanLink[];
}

export interface EcosystemEsanData {
  title: string;
  desc: string;

  columns: EcosystemEsanColumns;

  items: EcosystemEsanItem[];
}

/* ==========================================================================
   Helpers
   ========================================================================== */

const normalizeLimitedString = (
  value: unknown,
  maxLength: number,
): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.slice(0, maxLength);
};

const normalizeImageFocus = (value: unknown): number => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 50;
  }

  return Math.min(100, Math.max(0, number));
};

const normalizeImageFocusPoint = (
  raw: any,
  fallback: EcosystemEsanFocusPoint,
): EcosystemEsanFocusPoint => ({
  x: normalizeImageFocus(raw?.x ?? fallback.x),
  y: normalizeImageFocus(raw?.y ?? fallback.y),
});

/* ==========================================================================
   IDs
   ========================================================================== */

export const newEcosystemCardId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `eco-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
};

export const newEcosystemEsanLinkId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `eco-link-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
};

/* ==========================================================================
   Normalización
   ========================================================================== */

export const normalizeEcosystemEsanColumns = (
  value: unknown,
): EcosystemEsanColumns => {
  return Number(value) === 4 ? 4 : 3;
};

export const normalizeEcosystemEsanLink = (
  raw: any,
  index = 0,
): EcosystemEsanLink => ({
  id: raw?.id || `eco-link-${index}`,

  label: normalizeLimitedString(
    raw?.label,
    ECOSYSTEM_ESAN_CONTENT_RULES.link.label.maxLength,
  ),

  href: normalizeLimitedString(
    raw?.href,
    ECOSYSTEM_ESAN_CONTENT_RULES.link.href.maxLength,
  ),

  target: normalizeLinkTarget(raw?.target),
});

export const normalizeEcosystemEsanItem = (
  raw: any,
  index = 0,
): EcosystemEsanItem => {
  const legacyFocus = {
    x: normalizeImageFocus(raw?.imageFocusX),
    y: normalizeImageFocus(raw?.imageFocusY),
  };

  const imageFocusProfiles: EcosystemEsanFocusProfiles = {
    web: normalizeImageFocusPoint(raw?.imageFocusProfiles?.web, legacyFocus),
    tablet: normalizeImageFocusPoint(raw?.imageFocusProfiles?.tablet, legacyFocus),
    mobile: normalizeImageFocusPoint(raw?.imageFocusProfiles?.mobile, legacyFocus),
  };

  return {
    id: raw?.id || `eco-esan-${index}`,

    title: normalizeLimitedString(
      raw?.title,
      ECOSYSTEM_ESAN_CONTENT_RULES.card.title.maxLength,
    ),

    desc: normalizeLimitedString(
      raw?.desc,
      ECOSYSTEM_ESAN_CONTENT_RULES.card.desc.maxLength,
    ),

    image:
      typeof raw?.image === 'string'
        ? raw.image
        : '',

    imageAlt: normalizeLimitedString(
      raw?.imageAlt,
      ECOSYSTEM_ESAN_CONTENT_RULES.card.imageAlt.maxLength,
    ),

    imageFocusProfiles,
    imageFocusX: imageFocusProfiles.web.x,
    imageFocusY: imageFocusProfiles.web.y,

    href: normalizeLimitedString(
      raw?.href,
      ECOSYSTEM_ESAN_CONTENT_RULES.card.href.maxLength,
    ),

    target: normalizeLinkTarget(raw?.target),

    colorToken: normalizeBrandColorToken(
      raw?.colorToken ?? DEFAULT_BRAND_COLOR_TOKEN,
    ),

    links: Array.isArray(raw?.links)
      ? raw.links.map(
          (link: any, linkIndex: number) =>
            normalizeEcosystemEsanLink(link, linkIndex),
        )
      : [],
  };
};

export const normalizeEcosystemEsanData = (
  raw: any,
): EcosystemEsanData => ({
  title: normalizeLimitedString(
    raw?.title,
    ECOSYSTEM_ESAN_CONTENT_RULES.title.maxLength,
  ),

  desc: normalizeLimitedString(
    raw?.desc,
    ECOSYSTEM_ESAN_CONTENT_RULES.desc.maxLength,
  ),

  columns: normalizeEcosystemEsanColumns(
    raw?.columns,
  ),

  items: Array.isArray(raw?.items)
    ? raw.items.map(
        (item: any, index: number) =>
          normalizeEcosystemEsanItem(item, index),
      )
    : [],
});

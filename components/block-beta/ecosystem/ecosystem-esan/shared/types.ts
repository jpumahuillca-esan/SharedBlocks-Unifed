import {
  DEFAULT_BRAND_COLOR_TOKEN,
  normalizeBrandColorToken,
} from '../../../_shared/brandColors';

import {
  ECOSYSTEM_ESAN_CONTENT_RULES,
} from './rules';

/* ==========================================================================
   Tipos
   ========================================================================== */

export type EcosystemEsanColumns = 3 | 4;

export interface EcosystemEsanLink {
  id: string;
  label: string;
  href: string;
}

export interface EcosystemEsanItem {
  id: string;

  title: string;
  desc: string;

  image: string;
  imageAlt: string;

  href: string;

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
});

export const normalizeEcosystemEsanItem = (
  raw: any,
  index = 0,
): EcosystemEsanItem => ({
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

  href: normalizeLimitedString(
    raw?.href,
    ECOSYSTEM_ESAN_CONTENT_RULES.card.href.maxLength,
  ),

  colorToken: normalizeBrandColorToken(
    raw?.colorToken ?? DEFAULT_BRAND_COLOR_TOKEN,
  ),

  links: Array.isArray(raw?.links)
    ? raw.links.map(
        (link: any, linkIndex: number) =>
          normalizeEcosystemEsanLink(link, linkIndex),
      )
    : [],
});

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
/**
 * Modelo de datos para Banda de Detalles / Público Objetivo (InfoDetailsBand).
 * Soporta tarjetas en 2 columnas (`columns`, Landing Extended Learning `3464:28904`)
 * y texto narrativo con enlace (`narrative`, Talleres para Adolescentes `2679:51664`).
 */
import {
  DEFAULT_BRAND_COLOR_TOKEN,
  normalizeBrandColorToken,
} from '../../../editor-beta/EditorBrandColor/brandColors';
import { normalizeLinkTarget, type LinkTarget } from '../../../../helpers/linkTarget';

export interface DetailsBandItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export type DetailsBandContentWidth = 'full' | 'wide';
export type DetailsBandLayoutMode = 'columns' | 'narrative';

export interface DetailsBandData {
  eyebrow: string;
  title: string;
  colorToken: string;
  contentWidth: DetailsBandContentWidth;
  layoutMode: DetailsBandLayoutMode;
  items: DetailsBandItem[];
  bodyText: string;
  linkLabel: string;
  linkUrl: string;
  linkTarget: LinkTarget;
  linkIcon: string;
}

export const DEFAULT_DETAILS_COLOR_TOKEN = '--ds-color-esan-corp';

export const DETAILS_BAND_CONTENT_RULES = {
  eyebrow: { maxLength: 80 },
  title: { maxLength: 160 },
  bodyText: { maxLength: 1600 },
  linkLabel: { maxLength: 120 },
  item: {
    title: { maxLength: 100 },
    desc: { maxLength: 320 },
  },
  maxItems: 4,
} as const;

export const createDetailsItemId = (): string =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `db-item-${crypto.randomUUID()}`
    : `db-item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const normalizeDetailsBandItem = (raw: any, index = 0): DetailsBandItem => ({
  id: typeof raw?.id === 'string' && raw.id.trim() ? raw.id.trim() : `db-item-${index + 1}`,
  icon: typeof raw?.icon === 'string' ? raw.icon.trim() : '',
  title: typeof raw?.title === 'string' ? raw.title.slice(0, DETAILS_BAND_CONTENT_RULES.item.title.maxLength) : '',
  desc: typeof raw?.desc === 'string' ? raw.desc.slice(0, DETAILS_BAND_CONTENT_RULES.item.desc.maxLength) : '',
});

export const createEmptyDetailsBandItem = (): DetailsBandItem => ({
  id: createDetailsItemId(),
  icon: '',
  title: '',
  desc: '',
});

export const normalizeDetailsBandData = (raw: any): DetailsBandData => {
  const rawToken =
    typeof raw?.colorToken === 'string' && raw.colorToken.trim()
      ? raw.colorToken.trim()
      : DEFAULT_DETAILS_COLOR_TOKEN;

  // Preserva el rojo corporativo como defecto cuando el bloque aún no define token.
  const colorToken =
    rawToken === DEFAULT_DETAILS_COLOR_TOKEN
      ? DEFAULT_DETAILS_COLOR_TOKEN
      : normalizeBrandColorToken(rawToken || DEFAULT_BRAND_COLOR_TOKEN);

  return {
    eyebrow: typeof raw?.eyebrow === 'string' ? raw.eyebrow.slice(0, DETAILS_BAND_CONTENT_RULES.eyebrow.maxLength) : '',
    title: typeof raw?.title === 'string' ? raw.title.slice(0, DETAILS_BAND_CONTENT_RULES.title.maxLength) : '',
    colorToken,
    contentWidth: raw?.contentWidth === 'wide' ? 'wide' : 'full',
    layoutMode: raw?.layoutMode === 'narrative' ? 'narrative' : 'columns',
    items: Array.isArray(raw?.items)
      ? raw.items.slice(0, DETAILS_BAND_CONTENT_RULES.maxItems).map(normalizeDetailsBandItem)
      : [],
    bodyText:
      typeof raw?.bodyText === 'string'
        ? raw.bodyText.slice(0, DETAILS_BAND_CONTENT_RULES.bodyText.maxLength)
        : '',
    linkLabel:
      typeof raw?.linkLabel === 'string'
        ? raw.linkLabel.slice(0, DETAILS_BAND_CONTENT_RULES.linkLabel.maxLength)
        : '',
    linkUrl: typeof raw?.linkUrl === 'string' ? raw.linkUrl.trim() : '',
    linkTarget: normalizeLinkTarget(raw?.linkTarget),
    linkIcon: typeof raw?.linkIcon === 'string' ? raw.linkIcon.trim() : '',
  };
};

/**
 * Modelo de datos para Banda de Detalles / Público Objetivo (InfoDetailsBand).
 * Corresponde a las láminas Figma [Detalles] (3464:28904, 3543:42266) y [Reconocimiento] (3541:33418).
 */
import {
    DEFAULT_BRAND_COLOR_TOKEN,
    normalizeBrandColorToken,
} from '../../../editor-beta/EditorBrandColor/brandColors';

export interface DetailsBandItem {
    id: string;
    icon: string;
    title: string;
    desc: string;
}

export type DetailsBandContentWidth = 'full' | 'wide';

export interface DetailsBandData {
    eyebrow: string;
    title: string;
    colorToken: string;
    contentWidth: DetailsBandContentWidth;
    items: DetailsBandItem[];
}

export const DEFAULT_DETAILS_COLOR_TOKEN = '--ds-color-esan-corp';

export const DETAILS_BAND_CONTENT_RULES = {
    eyebrow: { maxLength: 80 },
    title: { maxLength: 160 },
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
    const rawToken = typeof raw?.colorToken === 'string' && raw.colorToken.trim()
        ? raw.colorToken.trim()
        : DEFAULT_DETAILS_COLOR_TOKEN;

    // Preserva el rojo corporativo como defecto cuando el bloque aún no define token.
    const colorToken = rawToken === DEFAULT_DETAILS_COLOR_TOKEN
        ? DEFAULT_DETAILS_COLOR_TOKEN
        : normalizeBrandColorToken(rawToken || DEFAULT_BRAND_COLOR_TOKEN);

    return {
        eyebrow: typeof raw?.eyebrow === 'string' ? raw.eyebrow.slice(0, DETAILS_BAND_CONTENT_RULES.eyebrow.maxLength) : '',
        title: typeof raw?.title === 'string' ? raw.title.slice(0, DETAILS_BAND_CONTENT_RULES.title.maxLength) : '',
        colorToken,
        contentWidth: raw?.contentWidth === 'wide' ? 'wide' : 'full',
        items: Array.isArray(raw?.items)
            ? raw.items.slice(0, DETAILS_BAND_CONTENT_RULES.maxItems).map(normalizeDetailsBandItem)
            : [],
    };
};

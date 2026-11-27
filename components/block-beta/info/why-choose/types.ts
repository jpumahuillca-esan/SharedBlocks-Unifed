/**
 * Modelo de datos para WhyChooseBand ([Section-Porque-Elegir]).
 * Figma: 3466:29596 (Desktop 1366) | 3543:42703 (Tablet 768) | 3543:34765 (Mobile 360)
 */
import {
    DEFAULT_BRAND_COLOR_TOKEN,
    normalizeBrandColorToken,
} from '../../../editor-beta/EditorBrandColor/brandColors';
import defaultBlueprintBg from '../../../../assets/images/esan-blueprint-bg.jpg';

export interface WhyChooseItem {
    id: string;
    pictogram: string;
    title: string;
    desc: string;
}

export interface WhyChooseData {
    eyebrow: string;
    title: string;
    desc: string;
    colorToken: string;
    backgroundImage: string;
    useDefaultBlueprint: boolean;
    overlayOpacity: number;
    image: string;
    imageAlt: string;
    imageFocusX: number;
    imageFocusY: number;
    hideImageOnTablet: boolean;
    items: WhyChooseItem[];
}

export const DEFAULT_BLUEPRINT_BG = defaultBlueprintBg;
export const DEFAULT_WHY_CHOOSE_BG_COLOR = '--ds-color-blue-dark-700';

export const createWhyChooseItemId = (): string =>
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? `wc-item-${crypto.randomUUID()}`
        : `wc-item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const normalizeWhyChooseItem = (raw: any, index = 0): WhyChooseItem => ({
    id: typeof raw?.id === 'string' && raw.id.trim() ? raw.id.trim() : `wc-item-${index + 1}`,
    pictogram: typeof raw?.pictogram === 'string' && raw.pictogram.trim() ? raw.pictogram.trim() : 'elearning',
    title: typeof raw?.title === 'string' ? raw.title.slice(0, 100) : '',
    desc: typeof raw?.desc === 'string' ? raw.desc.slice(0, 200) : '',
});

export const createEmptyWhyChooseItem = (): WhyChooseItem => ({
    id: createWhyChooseItemId(),
    pictogram: 'elearning',
    title: '',
    desc: '',
});

const clampNum = (val: unknown, fallback: number, min = 0, max = 100): number => {
    const n = Number(val);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
};

export const normalizeWhyChooseData = (raw: any): WhyChooseData => {
    const rawColor = typeof raw?.colorToken === 'string' && raw.colorToken.trim()
        ? raw.colorToken.trim()
        : DEFAULT_WHY_CHOOSE_BG_COLOR;

    const colorToken = rawColor === DEFAULT_WHY_CHOOSE_BG_COLOR
        ? DEFAULT_WHY_CHOOSE_BG_COLOR
        : normalizeBrandColorToken(rawColor || DEFAULT_BRAND_COLOR_TOKEN);

    return {
        eyebrow: typeof raw?.eyebrow === 'string' ? raw.eyebrow.slice(0, 80) : '',
        title: typeof raw?.title === 'string' ? raw.title.slice(0, 140) : '',
        desc: typeof raw?.desc === 'string' ? raw.desc.slice(0, 320) : '',
        colorToken,
        backgroundImage: typeof raw?.backgroundImage === 'string' ? raw.backgroundImage.trim() : '',
        useDefaultBlueprint: raw?.useDefaultBlueprint !== false,
        overlayOpacity: clampNum(raw?.overlayOpacity, 30, 0, 100),
        image: typeof raw?.image === 'string' ? raw.image.trim() : '',
        imageAlt: typeof raw?.imageAlt === 'string' ? raw.imageAlt.slice(0, 140) : '',
        imageFocusX: clampNum(raw?.imageFocusX, 50),
        imageFocusY: clampNum(raw?.imageFocusY, 50),
        hideImageOnTablet: raw?.hideImageOnTablet !== false,
        items: Array.isArray(raw?.items) ? raw.items.map(normalizeWhyChooseItem) : [],
    };
};

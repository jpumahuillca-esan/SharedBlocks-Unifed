/**
 * Modelo de datos para AcademicOffer ([Section-Categorias] / [Section-Carreras-Pregradol]).
 * Soporta tarjetas horizontales destacadas con subenlaces y grilla de tarjetas compactas Banner-ESAN-Ecosystem-v2.
 */
import { normalizeLinkTarget, type LinkTarget } from '../../../../helpers/linkTarget';
import {
    normalizeImageFocus,
    normalizeImageFocusProfiles,
    type ImageFocusProfiles,
} from '../../../../helpers/imageFocus';
import {
    DEFAULT_BRAND_COLOR_TOKEN,
    normalizeBrandColorToken,
} from '../../../editor-beta/EditorBrandColor/brandColors';
import {
    resolveBundledImageFallback,
    stripBundledAssetForStorage,
} from '../../../../helpers/bundledAssets';
import dpaManagementImg from '../../../../assets/images/dpa-faculty-management.jpg';
import dpaEngineeringImg from '../../../../assets/images/dpa-faculty-engineering.jpg';
import dpaLawImg from '../../../../assets/images/dpa-faculty-law.jpg';
import dpaPsychologyImg from '../../../../assets/images/dpa-faculty-psychology.jpg';

const DEFAULT_OFFER_IMAGES = [
    dpaManagementImg,
    dpaEngineeringImg,
    dpaLawImg,
    dpaPsychologyImg,
];

const OFFER_DEFAULT_ASSETS: Record<string, string> = {
    'dpa-faculty-management': dpaManagementImg,
    'dpa-faculty-engineering': dpaEngineeringImg,
    'dpa-faculty-law': dpaLawImg,
    'dpa-faculty-psychology': dpaPsychologyImg,
};

export type AcademicOfferCardLayout = 'featured' | 'compact';

export interface AcademicOfferSubLink {
    id: string;
    label: string;
    href: string;
    target: LinkTarget;
}

export interface AcademicOfferItem {
    id: string;
    variant: AcademicOfferCardLayout;
    title: string;
    desc: string;
    image: string;
    imageAlt: string;
    imageFocusProfiles: ImageFocusProfiles;
    imageFocusX: number;
    imageFocusY: number;
    href: string;
    target: LinkTarget;
    colorToken: string;
    links: AcademicOfferSubLink[];
}

export interface AcademicOfferData {
    eyebrow: string;
    title: string;
    desc: string;
    backgroundColor: string;
    items: AcademicOfferItem[];
}

export const DEFAULT_OFFER_COLOR_TOKEN = '--ds-color-esan-corp';

export const createOfferItemId = (): string =>
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? `ao-item-${crypto.randomUUID()}`
        : `ao-item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const createOfferLinkId = (): string =>
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? `ao-link-${crypto.randomUUID()}`
        : `ao-link-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const normalizeOfferSubLink = (raw: any, index = 0): AcademicOfferSubLink => ({
    id: typeof raw?.id === 'string' && raw.id.trim() ? raw.id.trim() : `ao-link-${index + 1}`,
    label: typeof raw?.label === 'string' ? raw.label.slice(0, 120) : '',
    href: typeof raw?.href === 'string' ? raw.href.trim() : '',
    target: normalizeLinkTarget(raw?.target),
});

export const normalizeOfferItem = (raw: any, index = 0): AcademicOfferItem => {
    const imageFocusX = normalizeImageFocus(raw?.imageFocusX);
    const imageFocusY = normalizeImageFocus(raw?.imageFocusY);
    const rawColor = typeof raw?.colorToken === 'string' && raw.colorToken.trim()
        ? raw.colorToken.trim()
        : DEFAULT_OFFER_COLOR_TOKEN;

    const colorToken = rawColor === DEFAULT_OFFER_COLOR_TOKEN
        ? DEFAULT_OFFER_COLOR_TOKEN
        : normalizeBrandColorToken(rawColor || DEFAULT_BRAND_COLOR_TOKEN);

    const links = Array.isArray(raw?.links)
        ? raw.links.map((link: any, li: number) => normalizeOfferSubLink(link, li))
        : [];

    const variant: AcademicOfferCardLayout =
        raw?.variant === 'featured' || raw?.variant === 'compact'
            ? raw.variant
            : links.length > 0
                ? 'featured'
                : 'compact';

    return {
        id: typeof raw?.id === 'string' && raw.id.trim() ? raw.id.trim() : `ao-item-${index + 1}`,
        variant,
        title: typeof raw?.title === 'string' ? raw.title.slice(0, 120) : '',
        desc: typeof raw?.desc === 'string' ? raw.desc.slice(0, 220) : '',
        image: resolveBundledImageFallback(
            raw?.image,
            DEFAULT_OFFER_IMAGES[index % DEFAULT_OFFER_IMAGES.length],
            OFFER_DEFAULT_ASSETS,
        ),
        imageAlt: typeof raw?.imageAlt === 'string' ? raw.imageAlt.slice(0, 140) : '',
        imageFocusProfiles: normalizeImageFocusProfiles(raw?.imageFocusProfiles, imageFocusX, imageFocusY),
        imageFocusX,
        imageFocusY,
        href: typeof raw?.href === 'string' ? raw.href.trim() : '',
        target: normalizeLinkTarget(raw?.target),
        colorToken,
        links,
    };
};

export const stripAcademicOfferBundledAssets = (data: AcademicOfferData): AcademicOfferData => ({
    ...data,
    items: Array.isArray(data.items)
        ? data.items.map((item) => ({
            ...item,
            image: stripBundledAssetForStorage(item.image, DEFAULT_OFFER_IMAGES),
        }))
        : [],
});

export const createEmptyOfferItem = (variant: AcademicOfferCardLayout = 'compact'): AcademicOfferItem => ({
    id: createOfferItemId(),
    variant,
    title: '',
    desc: '',
    image: '',
    imageAlt: '',
    imageFocusProfiles: normalizeImageFocusProfiles(undefined, 50, 50),
    imageFocusX: 50,
    imageFocusY: 50,
    href: '',
    target: '',
    colorToken: DEFAULT_OFFER_COLOR_TOKEN,
    links: [],
});

export const createEmptyOfferLink = (): AcademicOfferSubLink => ({
    id: createOfferLinkId(),
    label: '',
    href: '',
    target: '',
});

export const normalizeAcademicOfferData = (raw: any): AcademicOfferData => ({
    eyebrow: typeof raw?.eyebrow === 'string' ? raw.eyebrow.slice(0, 80) : '',
    title: typeof raw?.title === 'string' ? raw.title.slice(0, 140) : '',
    desc: typeof raw?.desc === 'string' ? raw.desc.slice(0, 320) : '',
    backgroundColor: typeof raw?.backgroundColor === 'string' && raw.backgroundColor.trim()
        ? raw.backgroundColor.trim()
        : '#F1F5F9',
    items: Array.isArray(raw?.items) ? raw.items.map(normalizeOfferItem) : [],
});

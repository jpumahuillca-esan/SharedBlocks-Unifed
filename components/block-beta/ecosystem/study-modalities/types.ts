import {
  DEFAULT_BRAND_COLOR_TOKEN,
  normalizeBrandColorToken,
} from '../../../editor-beta/EditorBrandColor/brandColors';
import defaultModalitiesBgImg from '../../../../assets/images/dpa-modalities-bg.jpg';

export interface StudyModalityBadge {
  id: string;
  label: string;
}

export interface StudyModalitiesData {
  title: string;
  subtitle: string;
  badges: StudyModalityBadge[];
  image: string;
  imageAlt: string;
  backgroundImage: string;
  backgroundOverlayOpacity: number;
  panelColorToken: string;
}

export const newStudyModalityBadgeId = (): string =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `smd-badge-${crypto.randomUUID()}`
    : `smd-badge-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const normalizeStudyModalitiesData = (raw: any): StudyModalitiesData => {
  const badgesRaw = Array.isArray(raw?.badges) ? raw.badges : [];
  const opacityNum = Number(raw?.backgroundOverlayOpacity);

  return {
    title:
      typeof raw?.title === 'string'
        ? raw.title.slice(0, 120)
        : 'Modalidades de estudios',
    subtitle:
      typeof raw?.subtitle === 'string'
        ? raw.subtitle.slice(0, 260)
        : 'Llevas tus clases desde el campus, desde casa o el lugar que escojas.',
    badges: badgesRaw.map((b: any, idx: number) => ({
      id: b?.id || `smd-badge-${idx}`,
      label: typeof b?.label === 'string' ? b.label.slice(0, 60) : '',
    })),
    image: typeof raw?.image === 'string' ? raw.image : '',
    imageAlt:
      typeof raw?.imageAlt === 'string' ? raw.imageAlt.slice(0, 140) : '',
    backgroundImage:
      typeof raw?.backgroundImage === 'string' && raw.backgroundImage.trim()
        ? raw.backgroundImage.trim()
        : defaultModalitiesBgImg,
    backgroundOverlayOpacity: Number.isFinite(opacityNum)
      ? Math.min(100, Math.max(0, opacityNum))
      : 20,
    panelColorToken: normalizeBrandColorToken(
      !raw?.panelColorToken || raw?.panelColorToken === '--ds-color-univ-management'
        ? '--ds-color-univ-dpa'
        : raw.panelColorToken,
    ),
  };
};

export const createEmptyStudyModalityBadge = (): StudyModalityBadge => ({
  id: newStudyModalityBadgeId(),
  label: 'NUEVA MODALIDAD',
});

export { DEFAULT_BRAND_COLOR_TOKEN };


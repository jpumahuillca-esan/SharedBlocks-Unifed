import {
  normalizeImageFocus,
  normalizeImageFocusProfiles,
  type ImageFocusProfiles,
} from '../../../../helpers/imageFocus';
import {
  normalizeLinkTarget,
  type LinkTarget,
} from '../../../../helpers/linkTarget';
import defaultAboutVideoImg from '../../../../assets/images/dpa-about-video.jpg';

const LEGACY_ABOUT_UNSPLASH =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop';

export interface AboutDpaButton {
  label: string;
  url: string;
  target: LinkTarget;
}

export interface AboutDpaData {
  eyebrow: string;
  title: string;
  description: string;
  primaryButton: AboutDpaButton;
  secondaryButton: AboutDpaButton;
  image: string;
  imageAlt: string;
  imageFocusX: number;
  imageFocusY: number;
  imageFocusProfiles: ImageFocusProfiles;
  videoUrl: string;
  duration: string;
  backgroundColor: string;
}

export const normalizeAboutDpaData = (raw: any): AboutDpaData => {
  const imageFocusX = normalizeImageFocus(raw?.imageFocusX);
  const imageFocusY = normalizeImageFocus(raw?.imageFocusY);

  return {
    eyebrow: typeof raw?.eyebrow === 'string' ? raw.eyebrow.slice(0, 80) : '',
    title:
      typeof raw?.title === 'string'
        ? raw.title.slice(0, 140)
        : '¿Qué es ESAN DPA?',
    description:
      typeof raw?.description === 'string'
        ? raw.description.slice(0, 600)
        : '',
    primaryButton: {
      label:
        typeof raw?.primaryButton?.label === 'string'
          ? raw.primaryButton.label.slice(0, 80)
          : '',
      url:
        typeof raw?.primaryButton?.url === 'string'
          ? raw.primaryButton.url.trim()
          : '',
      target: normalizeLinkTarget(raw?.primaryButton?.target),
    },
    secondaryButton: {
      label:
        typeof raw?.secondaryButton?.label === 'string'
          ? raw.secondaryButton.label.slice(0, 80)
          : '',
      url:
        typeof raw?.secondaryButton?.url === 'string'
          ? raw.secondaryButton.url.trim()
          : '',
      target: normalizeLinkTarget(raw?.secondaryButton?.target),
    },
    image:
      typeof raw?.image === 'string' &&
      raw.image.trim() &&
      raw.image.trim() !== LEGACY_ABOUT_UNSPLASH
        ? raw.image.trim()
        : defaultAboutVideoImg,
    imageAlt:
      typeof raw?.imageAlt === 'string' ? raw.imageAlt.slice(0, 140) : '',
    imageFocusX,
    imageFocusY,
    imageFocusProfiles: normalizeImageFocusProfiles(raw?.imageFocusProfiles, {
      x: imageFocusX,
      y: imageFocusY,
    }),
    videoUrl: typeof raw?.videoUrl === 'string' ? raw.videoUrl.trim() : '',
    duration:
      typeof raw?.duration === 'string' ? raw.duration.slice(0, 20) : '02:14',
    backgroundColor:
      typeof raw?.backgroundColor === 'string' && raw.backgroundColor.trim()
        ? raw.backgroundColor.trim()
        : '#FFFFFF',
  };
};


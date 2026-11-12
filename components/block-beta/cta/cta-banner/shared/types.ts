import {
  DEFAULT_BRAND_COLOR_TOKEN,
  normalizeBrandColorToken,
} from '../../../../editor-beta/EditorBrandColor/brandColors';
import {
  normalizeImageFocus,
  normalizeImageFocusProfiles,
  type ImageFocusProfiles,
} from '../../../../../helpers/imageFocus';
import { normalizeLinkTarget, type LinkTarget } from '../../../../../helpers/linkTarget';

export interface CtaBannerData {
  eyebrow?: string;
  /**
   * Si es true, el antetítulo se emite como <h2> para SEO y el título se emite como <p>
   * conservando su aspecto visual de h3. Por defecto (false), el título es el <h2>.
   */
  eyebrowAsH2?: boolean;
  title: string;
  desc: string;
  buttonLabel: string;
  buttonNegative: boolean;
  buttonUrl: string;
  buttonTarget: LinkTarget;
  panelColorToken: string;
  image: string;
  imageAlt: string;
  imageFocusX: number;
  imageFocusY: number;
  imageFocusProfiles: ImageFocusProfiles;
}

export const normalizeCtaBannerData = (source: any): CtaBannerData => {
  const imageFocusX = normalizeImageFocus(source?.imageFocusX);
  const imageFocusY = normalizeImageFocus(source?.imageFocusY);

  return {
    eyebrow: typeof source?.eyebrow === 'string' ? source.eyebrow : '',
    eyebrowAsH2: typeof source?.eyebrowAsH2 === 'boolean'
      ? source.eyebrowAsH2
      : source?.seoHeadingSource === 'eyebrow',
    title: typeof source?.title === 'string' ? source.title : '',
    desc: typeof source?.desc === 'string' ? source.desc : '',
    buttonLabel: typeof source?.buttonLabel === 'string' ? source.buttonLabel : '',
    buttonNegative: typeof source?.buttonNegative === 'boolean' ? source.buttonNegative : false,
    buttonUrl: typeof source?.buttonUrl === 'string' ? source.buttonUrl : '',
    buttonTarget: normalizeLinkTarget(source?.buttonTarget),
    panelColorToken: normalizeBrandColorToken(
      source?.panelColorToken ?? DEFAULT_BRAND_COLOR_TOKEN,
    ),
    image: typeof source?.image === 'string' ? source.image : '',
    imageAlt: typeof source?.imageAlt === 'string' ? source.imageAlt : '',
    imageFocusX,
    imageFocusY,
    imageFocusProfiles: normalizeImageFocusProfiles(
      source?.imageFocusProfiles,
      imageFocusX,
      imageFocusY,
    ),
  };
};

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

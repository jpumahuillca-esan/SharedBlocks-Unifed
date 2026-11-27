import type EditorBrandColor from './EditorBrandColor/EditorBrandColor.vue';
import type EditorFieldShell from './EditorFieldShell/EditorFieldShell.vue';
import type EditorFloatingPlacement from './EditorFloatingPlacement/EditorFloatingPlacement.vue';
import type EditorHint from './EditorHint/EditorHint.vue';
import type EditorIcon from './EditorIcon/EditorIcon.vue';
import type EditorImage from './EditorImage/EditorImage.vue';
import type EditorImageFocus from './EditorImageFocus/EditorImageFocus.vue';
import type EditorLinkTarget from './EditorLinkTarget/EditorLinkTarget.vue';
import type EditorPictogram from './EditorPictogram/EditorPictogram.vue';
import type EditorText from './EditorText/EditorText.vue';
import type EditorTextarea from './EditorTextarea/EditorTextarea.vue';
import type EditorUrl from './EditorUrl/EditorUrl.vue';

declare module 'vue' {
  export interface GlobalComponents {
    EditorBrandColor: typeof EditorBrandColor;
    EditorFieldShell: typeof EditorFieldShell;
    EditorFloatingPlacement: typeof EditorFloatingPlacement;
    EditorHint: typeof EditorHint;
    EditorIcon: typeof EditorIcon;
    EditorImage: typeof EditorImage;
    EditorImageFocus: typeof EditorImageFocus;
    EditorLinkTarget: typeof EditorLinkTarget;
    EditorPictogram: typeof EditorPictogram;
    EditorText: typeof EditorText;
    EditorTextarea: typeof EditorTextarea;
    EditorUrl: typeof EditorUrl;
  }
}

export {};

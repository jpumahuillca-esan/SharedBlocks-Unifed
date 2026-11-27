/**
 * Registro central y exportaciones homologadas de componentes de edición (`editor-beta`).
 *
 * Permite usar controles como `<EditorIcon />`, `<EditorPictogram />`,
 * `<EditorBrandColor />`, `<EditorText />`, etc. de dos maneras:
 *   1. Globalmente en cualquier `Editor.vue` o vista del CMS (vía `EditorBetaPlugin` en `main.ts`).
 *   2. Importación explícita desde `@shared/components/editor-beta` en módulos aislados o tests.
 */
import type { App, Plugin } from 'vue';
import EditorBrandColor from './EditorBrandColor/EditorBrandColor.vue';
import EditorFieldShell from './EditorFieldShell/EditorFieldShell.vue';
import EditorFloatingPlacement from './EditorFloatingPlacement/EditorFloatingPlacement.vue';
import EditorHint from './EditorHint/EditorHint.vue';
import EditorIcon from './EditorIcon/EditorIcon.vue';
import EditorImage from './EditorImage/EditorImage.vue';
import EditorImageFocus from './EditorImageFocus/EditorImageFocus.vue';
import EditorLinkTarget from './EditorLinkTarget/EditorLinkTarget.vue';
import EditorPictogram from './EditorPictogram/EditorPictogram.vue';
import EditorText from './EditorText/EditorText.vue';
import EditorTextarea from './EditorTextarea/EditorTextarea.vue';
import EditorUrl from './EditorUrl/EditorUrl.vue';

export const GLOBAL_EDITOR_COMPONENTS = {
  EditorBrandColor,
  EditorFieldShell,
  EditorFloatingPlacement,
  EditorHint,
  EditorIcon,
  EditorImage,
  EditorImageFocus,
  EditorLinkTarget,
  EditorPictogram,
  EditorText,
  EditorTextarea,
  EditorUrl,
} as const;

/** Registra todos los controles de `editor-beta` como componentes globales de Vue. */
export function registerGlobalEditors(app: App): App {
  for (const [name, component] of Object.entries(GLOBAL_EDITOR_COMPONENTS)) {
    if (!app.component(name)) {
      app.component(name, component);
    }
  }
  return app;
}

export const EditorBetaPlugin: Plugin = {
  install(app: App) {
    registerGlobalEditors(app);
  },
};

export {
  EditorBrandColor,
  EditorFieldShell,
  EditorFloatingPlacement,
  EditorHint,
  EditorIcon,
  EditorImage,
  EditorImageFocus,
  EditorLinkTarget,
  EditorPictogram,
  EditorText,
  EditorTextarea,
  EditorUrl,
};

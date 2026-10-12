import type { InjectionKey } from 'vue';

export interface DocsCodeNavigation {
  goToCodeMarker: (marker: string, occurrence?: number) => void;
}

export const docsCodeNavigationKey: InjectionKey<DocsCodeNavigation> =
  Symbol('docs-code-navigation');

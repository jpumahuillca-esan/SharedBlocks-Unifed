import {
  BRAND_COLOR_GROUPS,
  resolveBrandContentToken,
} from '../../../_shared/brandColors';

/**
 * El editor usa la paleta institucional compartida. Se conserva esta exportaciÃ³n
 * para los consumidores de SubHero que necesiten consultar sus tokens.
 */
export const SUBHERO_COLOR_OPTIONS = BRAND_COLOR_GROUPS.flatMap(
  (group) => group.colors
);

export const DEFAULT_PANEL_COLOR_TOKEN = '--ds-color-university';

export function resolvePanelColorToken(data: any): string {
  const token = data?.panelColorToken;

  if (
    typeof token === 'string' &&
    SUBHERO_COLOR_OPTIONS.some((option) => option.token === token)
  ) {
    return token;
  }

  // Compatibilidad temporal con bloques antiguos.
  if (data?.brand === 'management') {
    return '--ds-color-univ-management';
  }

  return DEFAULT_PANEL_COLOR_TOKEN;
}

export function resolvePanelContentToken(data: any): string {
  return resolveBrandContentToken(resolvePanelColorToken(data));
}

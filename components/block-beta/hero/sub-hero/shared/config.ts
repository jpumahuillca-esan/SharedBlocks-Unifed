export const SUBHERO_COLOR_OPTIONS = [
  {
    label: 'ESAN University',
    token: '--ds-color-university'
  },
  {
    label: 'ESAN Management',
    token: '--ds-color-univ-management'
  },
  {
    label: 'ESAN Economics',
    token: '--ds-color-univ-economics'
  },
  {
    label: 'ESAN Engineering',
    token: '--ds-color-univ-engineering'
  },
  {
    label: 'ESAN Law',
    token: '--ds-color-univ-law'
  },
  {
    label: 'ESAN Communications',
    token: '--ds-color-univ-communications'
  },
  {
    label: 'ESAN Psychology',
    token: '--ds-color-univ-psychology'
  }
] as const;

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
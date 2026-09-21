/**
 * Modelo del menú de la cabecera mega_menu_beta.
 *
 * Los datos son los mismos que usa HeaderMega, así que cambiar de una cabecera
 * a otra no pierde nada: el árbol sale del Menú Institucional que se vincula en
 * el panel de branding (useUnitBranding → loadMenuItems) y se guarda en
 * `config.menu_tree`, con lo que añade el editor de la cabecera:
 *
 *   nivel 1  entrada de la barra. `header_title`: título del panel.
 *   nivel 2  pestaña de la columna izquierda del panel. `layout`:
 *              'columns'       sus hijos son grupos con enlaces (niveles 3 y 4)
 *              'banner_split'  sus hijos son enlaces sueltos, y lleva un banner
 *   nivel 3  grupo (en columnas) o enlace (en lista con banner)
 *   nivel 4  enlace dentro de un grupo
 *
 * Aquí se normaliza para que las plantillas puedan dar por hecho cada campo.
 */

export interface MenuLink {
  id: string;
  title: string;
  /** Vacío si no navega: en el árbol del admin, "sin destino" se guarda como '#'. */
  url: string;
  children: MenuLink[];
}

export interface MenuTab extends MenuLink {
  layout: 'columns' | 'banner_split';
  bannerImage: string;
  bannerTitle: string;
  bannerUrl: string;
}

export interface MenuRoot extends MenuLink {
  /** Título del panel ("ESAN University"). Sin él, el de la entrada. */
  headerTitle: string;
  children: MenuTab[];
}

/** Enlace del topbar que el menú móvil añade debajo del principal. */
export interface SecondaryLink {
  id: string;
  label: string;
  url: string;
  children: Array<{ id: string; label: string; url: string }>;
}

const text = (value: unknown) => (typeof value === 'string' ? value : '');
const list = (value: unknown): any[] => (Array.isArray(value) ? value : []);

/** '#' es "sin destino" en el árbol del admin: se trata como vacío. */
const cleanUrl = (value: unknown) => {
  const url = text(value).trim();
  return url === '#' ? '' : url;
};

const toLink = (raw: any, fallbackId: string): MenuLink => ({
  id: String(raw?.id ?? fallbackId),
  title: text(raw?.title),
  url: cleanUrl(raw?.url),
  children: list(raw?.children).map((child: any, i: number) => toLink(child, `${fallbackId}-${i}`)),
});

/*
 * Mismo criterio que loadMenuItems cuando una pestaña todavía no tiene diseño
 * elegido: si alguno de sus hijos tiene hijos, son grupos (columnas); si no,
 * es una lista con banner.
 */
const toTab = (raw: any, fallbackId: string): MenuTab => {
  const link = toLink(raw, fallbackId);
  const layout = raw?.layout === 'columns' || raw?.layout === 'banner_split'
    ? raw.layout
    : link.children.some((child) => child.children.length) ? 'columns' : 'banner_split';

  return {
    ...link,
    layout,
    bannerImage: text(raw?.banner_image).trim(),
    bannerTitle: text(raw?.banner_title),
    bannerUrl: cleanUrl(raw?.banner_url),
  };
};

export const normalizeMenu = (raw: unknown): MenuRoot[] =>
  list(raw)
    .map((item: any, i: number) => {
      const link = toLink(item, `m-${i}`);
      return {
        ...link,
        headerTitle: text(item?.header_title),
        children: list(item?.children).map((tab: any, j: number) => toTab(tab, `m-${i}-${j}`)),
      };
    })
    .filter((item) => item.title.trim());

/** Enlaces del topbar (grupo del portal y el del otro lado), en ese orden. */
export const normalizeSecondary = (topbar: Record<string, any> | null | undefined): SecondaryLink[] =>
  [...list(topbar?.startItems), ...list(topbar?.endItems)]
    .map((item: any, i: number) => ({
      id: String(item?.id ?? `s-${i}`),
      label: text(item?.label),
      url: cleanUrl(item?.url),
      children: list(item?.children)
        .map((child: any, j: number) => ({
          id: String(child?.id ?? `s-${i}-${j}`),
          label: text(child?.label),
          url: cleanUrl(child?.url),
        }))
        .filter((child) => child.label.trim()),
    }))
    .filter((item) => item.label.trim());

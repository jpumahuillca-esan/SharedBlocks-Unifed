import { ref } from 'vue';
import { PUBLIC_API_URL } from '../config/apiConfig';
import type { BreadcrumbItem } from '../components/molecules/MoleculeBreadcrumb.vue';

export interface BreadcrumbAcademicUnit {
  id: number;
  name: string;
  slug: string;
  full_slug?: string;
  parent_id?: number | null;
}

export interface BreadcrumbConfig {
  mode: 'dynamic' | 'manual';
  academic_unit_id?: number | string | 'all';
  currentPage?: string;
  items: BreadcrumbItem[];
}

let memoryCachedUnits: BreadcrumbAcademicUnit[] = [];

export function useBreadcrumb() {
  const academicUnits = ref<BreadcrumbAcademicUnit[]>(memoryCachedUnits);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Consulta las Unidades Académicas para alimentar el selector y jerarquía.
   * Cuenta con múltiples capas de respaldo (Caché en memoria, Fastify Público,
   * API Laravel Admin y LocalStorage de sesión) para garantizar que jamás falle
   * aunque un servicio secundario esté temporalmente apagado en desarrollo.
   */
  const fetchAcademicUnits = async (): Promise<BreadcrumbAcademicUnit[]> => {
    if (academicUnits.value.length > 0) {
      return academicUnits.value;
    }

    // 1. Revisa caché global en window si existe
    if (typeof window !== 'undefined' && Array.isArray((window as any).__UNIFED_ACADEMIC_UNITS__) && (window as any).__UNIFED_ACADEMIC_UNITS__.length > 0) {
      academicUnits.value = (window as any).__UNIFED_ACADEMIC_UNITS__;
      memoryCachedUnits = academicUnits.value;
      return academicUnits.value;
    }

    loading.value = true;
    error.value = null;

    // Helper para guardar en todas las memorias
    const saveAndReturn = (list: BreadcrumbAcademicUnit[]): BreadcrumbAcademicUnit[] => {
      academicUnits.value = list;
      memoryCachedUnits = list;
      if (typeof window !== 'undefined') {
        (window as any).__UNIFED_ACADEMIC_UNITS__ = list;
        try {
          localStorage.setItem('academic_units_catalog', JSON.stringify(list));
        } catch (_) {}
      }
      return list;
    };

    // 2. Intento vía API Pública (Fastify back-public)
    try {
      const res = await fetch(`${PUBLIC_API_URL}/news/filters`);
      if (res.ok) {
        const data = await res.json();
        const list: BreadcrumbAcademicUnit[] = data.academic_units || [];
        if (list.length > 0) {
          return saveAndReturn(list);
        }
      }
    } catch (_) {}

    // 3. Intento vía API Backend Laravel (si estamos en el CMS Admin)
    if (typeof window !== 'undefined') {
      try {
        const adminUrl = (import.meta as any).env?.VITE_API_BASE_URL || '/api/';
        const res = await fetch(`${adminUrl.replace(/\/+$/, '')}/academic-units`, {
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          const list: BreadcrumbAcademicUnit[] = (data.data || data || []).map((u: any) => ({
            id: Number(u.id),
            name: u.name,
            slug: u.slug,
            full_slug: u.full_slug,
            parent_id: u.parent_id ? Number(u.parent_id) : null,
          }));
          if (list.length > 0) {
            return saveAndReturn(list);
          }
        }
      } catch (_) {}

      // 4. Intento desde LocalStorage (Catálogo previo o unidades de la sesión)
      try {
        const storedCatalog = localStorage.getItem('academic_units_catalog');
        if (storedCatalog) {
          const parsed = JSON.parse(storedCatalog);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return saveAndReturn(parsed);
          }
        }

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          if (Array.isArray(userObj.academic_units) && userObj.academic_units.length > 0) {
            const list = userObj.academic_units.map((u: any) => ({
              id: Number(u.id),
              name: u.name,
              slug: u.slug || '',
              full_slug: u.full_slug || (u.slug ? `${u.slug}/` : ''),
              parent_id: u.parent_id ? Number(u.parent_id) : null,
            }));
            return saveAndReturn(list);
          }
        }
      } catch (_) {}
    }

    loading.value = false;
    return [];
  };

  /**
   * Asegura que una URL/ruta termine siempre con '/'
   */
  const ensureTrailingSlash = (url?: string): string => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed === '#' || trimmed.startsWith('#') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
      return trimmed;
    }
    const [base, extra] = trimmed.split(/([?#].*)/, 2);
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    return extra ? `${normalizedBase}${extra}` : normalizedBase;
  };

  /**
   * Resuelve la ruta canónica para una unidad académica con '/' al final.
   * Si no posee full_slug en la base de datos, lo genera navegando sus ancestros.
   */
  const resolveUnitHref = (
    unit: BreadcrumbAcademicUnit,
    unitsList: BreadcrumbAcademicUnit[] = academicUnits.value
  ): string => {
    if (unit.slug === 'main' || !unit.slug) return '/';
    if (unit.full_slug) {
      const clean = unit.full_slug.replace(/^\/+|\/+$/g, '');
      if (clean && clean !== 'main') return `/${clean}/`;
    }
    const chain = resolveUnitAncestors(unit.id, unitsList);
    const parts = chain
      .filter((u) => u.slug && u.slug !== 'main')
      .map((u) => u.slug.replace(/^\/+|\/+$/g, ''));
    return parts.length > 0 ? `/${parts.join('/')}/` : '/';
  };

  /**
   * Construye la cadena de ancestros desde la raíz hasta la unidad seleccionada
   */
  const resolveUnitAncestors = (
    unitId: number | string,
    units: BreadcrumbAcademicUnit[]
  ): BreadcrumbAcademicUnit[] => {
    const idNum = Number(unitId);
    if (isNaN(idNum) || idNum <= 0) return [];

    const map = new Map<number, BreadcrumbAcademicUnit>();
    units.forEach((u) => map.set(Number(u.id), u));

    const chain: BreadcrumbAcademicUnit[] = [];
    let curr = map.get(idNum);
    const visited = new Set<number>();

    while (curr && !visited.has(curr.id)) {
      visited.add(curr.id);
      chain.unshift(curr);
      if (curr.parent_id && map.has(Number(curr.parent_id))) {
        curr = map.get(Number(curr.parent_id));
      } else {
        break;
      }
    }

    return chain;
  };

  /**
   * Construye la lista de migas respetando la regla:
   * 1. 'Inicio' como base (href: '/')
   * 2. Jerarquía de la Unidad Académica activa ('AcademicUnits')
   * 3. Página / Espacio actual al final (como .breadcrumb__current sin link)
   * 4. Previene duplicados si el título de la página coincide con la unidad final.
   */
  const buildBreadcrumbPath = (
    unitId: number | string | 'all' | undefined,
    currentPageTitle: string,
    unitsList: BreadcrumbAcademicUnit[] = academicUnits.value,
    includeCurrentPage: boolean = false
  ): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/' }
    ];

    const current = (currentPageTitle || '').trim();

    if (unitId && unitId !== 'all') {
      const chain = resolveUnitAncestors(unitId, unitsList);
      chain.forEach((unit, idx) => {
        // Si no es el Portal Central o root 'main', agregamos el nivel de la unidad
        if (unit.slug !== 'main' && unit.name !== 'Portal Central') {
          const isLastUnit = idx === chain.length - 1;
          // Si la página actual coincide con el nombre de la unidad final:
          // Si includeCurrentPage es false, se omite por SEO para no mostrar la página actual.
          // Si includeCurrentPage es true, se omite aquí para incluirse al final como terminal sin enlace.
          if (isLastUnit && current && unit.name.toLowerCase() === current.toLowerCase()) {
            return;
          }
          crumbs.push({
            label: unit.name,
            href: resolveUnitHref(unit, unitsList)
          });
        }
      });
    }

    if (includeCurrentPage && current) {
      crumbs.push({
        label: current
      });
    }

    return crumbs;
  };

  return {
    academicUnits,
    loading,
    error,
    fetchAcademicUnits,
    resolveUnitHref,
    resolveUnitAncestors,
    buildBreadcrumbPath,
    ensureTrailingSlash,
  };
}

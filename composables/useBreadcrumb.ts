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

export function useBreadcrumb() {
  const academicUnits = ref<BreadcrumbAcademicUnit[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Consulta las Unidades Académicas para alimentar el selector y jerarquía
   */
  const fetchAcademicUnits = async (): Promise<BreadcrumbAcademicUnit[]> => {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${PUBLIC_API_URL}/news/filters`);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const data = await res.json();
      const list: BreadcrumbAcademicUnit[] = data.academic_units || [];
      academicUnits.value = list;
      return list;
    } catch (e: any) {
      error.value = e?.message || 'Error al consultar unidades académicas';
      console.warn('[useBreadcrumb] No se pudo cargar unidades académicas:', e?.message);
      return [];
    } finally {
      loading.value = false;
    }
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
   * Resuelve la ruta canónica para una unidad académica con '/' al final
   */
  const resolveUnitHref = (unit: BreadcrumbAcademicUnit): string => {
    if (unit.slug === 'main' || !unit.slug) return '/';
    const cleanFull = (unit.full_slug || unit.slug || '').replace(/^\/+|\/+$/g, '');
    return cleanFull ? `/${cleanFull}/` : '/';
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
   */
  const buildBreadcrumbPath = (
    unitId: number | string | 'all' | undefined,
    currentPageTitle: string,
    unitsList: BreadcrumbAcademicUnit[] = academicUnits.value,
    includeCurrentPage: boolean = true
  ): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/' }
    ];

    if (unitId && unitId !== 'all') {
      const chain = resolveUnitAncestors(unitId, unitsList);
      chain.forEach((unit) => {
        // Si no es el Portal Central o root 'main', agregamos el nivel de la unidad
        if (unit.slug !== 'main' && unit.name !== 'Portal Central') {
          crumbs.push({
            label: unit.name,
            href: resolveUnitHref(unit)
          });
        }
      });
    }

    if (includeCurrentPage) {
      const current = (currentPageTitle || '').trim();
      if (current) {
        crumbs.push({
          label: current
        });
      }
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

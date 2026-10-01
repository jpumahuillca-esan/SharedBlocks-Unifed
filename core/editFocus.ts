/**
 * Enfoque de campos: del lienzo al editor.
 *
 * Al hacer clic sobre una pieza de un bloque en el lienzo del constructor
 * (el título, una tarjeta, la franja), el panel de edición se desplaza hasta el
 * campo que la controla, abre la tarjeta plegada que lo contiene y lo resalta.
 * En bloques grandes evita recorrer un editor larguísimo buscando el campo.
 *
 * El vínculo es una ruta al dato del bloque, escrita igual a los dos lados:
 *
 *   bloque (lienzo)   v-bind="edit('title')"          → data-edit="title"
 *   editor (panel)    data-edit-target="title"
 *
 * Las rutas pueden ser RELATIVAS (empiezan por "."). Una relativa se completa
 * con la del ancestro marcado más cercano, así una pieza que se repite no
 * necesita saber en qué posición está:
 *
 *   <CardAccordionItem edit-key="features.1">        → data-edit-target="features.1"
 *     <EcosystemCardFields>
 *       <input data-edit-target=".title">            → features.1.title
 *
 * Las marcas del bloque solo se pintan dentro del lienzo (EDIT_CANVAS_KEY): en
 * el sitio público `edit()` no devuelve nada y el HTML no cambia.
 *
 * Un bloque sin marcas sigue funcionando como siempre: se selecciona y el
 * editor se abre arriba del todo.
 */
import { inject, type InjectionKey, type Ref } from 'vue';

/*
 * Claves con Symbol.for y no Symbol: el lienzo importa este módulo por el
 * alias `@shared` y los bloques por ruta relativa. Si el empaquetador los
 * resolviera como dos módulos distintos (en Windows basta con que la letra de
 * unidad cambie de mayúscula), cada uno tendría su propio Symbol y la
 * inyección no los emparejaría nunca. Symbol.for devuelve el mismo en ambos.
 */

/** Lo provee el lienzo del constructor alrededor de cada bloque. */
export const EDIT_CANVAS_KEY: InjectionKey<boolean> = Symbol.for('esan.cms.editCanvas');

/**
 * Petición de enfoque en curso. `nonce` cambia en cada clic, así volver a
 * pulsar la misma pieza la vuelve a enfocar aunque la ruta sea igual.
 */
export interface EditFocusRequest {
  blockId: string;
  path: string;
  nonce: number;
}

/** Lo provee el panel de edición a su editor, para que los plegables se abran solos. */
export const EDIT_FOCUS_KEY: InjectionKey<Ref<EditFocusRequest | null>> = Symbol.for('esan.cms.editFocus');

const CANVAS_ATTR = 'data-edit';
const TARGET_ATTR = 'data-edit-target';

/**
 * Para usar en Block.vue y en las piezas que pinta: `v-bind="edit('title')"`.
 * Fuera del lienzo devuelve un objeto vacío.
 */
export const useEditTarget = () => {
  const inCanvas = inject(EDIT_CANVAS_KEY, false);
  return (path: string): Record<string, string> => (inCanvas ? { [CANVAS_ATTR]: path } : {});
};

/** ¿`path` es `key` o algo que cuelga de él? (`features.1.title` cuelga de `features.1`). */
export const isWithinPath = (path: string, key: string): boolean =>
  path === key || path.startsWith(`${key}.`);

/** Ruta completa de un elemento marcado, resolviendo las relativas hacia arriba. */
const resolvePath = (el: Element, attr: string, stop: Element): string => {
  let path = '';
  let node: Element | null = el;

  while (node && node !== stop.parentElement) {
    const own = node.getAttribute(attr);
    if (own) {
      if (own.startsWith('.')) {
        path = own + path;
      } else {
        return own + path;
      }
    }
    node = node.parentElement;
  }

  // Relativa sin ancestro absoluto: se le quita el punto inicial.
  return path.replace(/^\./, '');
};

/**
 * Pieza marcada que hay bajo el punto (x, y) dentro de un bloque.
 *
 * Se decide por posición y no por el elemento que recibe el clic: en el lienzo
 * los enlaces del bloque están inertes (pointer-events: none) para que nunca
 * se navegue, así que el clic sobre una tarjeta que es un enlace lo recibe el
 * contenedor de detrás. Gana la pieza marcada más pequeña que contiene el punto:
 * el título de una tarjeta antes que la tarjeta, y esta antes que la sección.
 */
export const findEditElementAtPoint = (container: Element, x: number, y: number): Element | null => {
  let best: Element | null = null;
  let bestArea = Infinity;

  for (const el of Array.from(container.querySelectorAll(`[${CANVAS_ATTR}]`))) {
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) continue;

    const area = rect.width * rect.height;
    if (area < bestArea) {
      best = el;
      bestArea = area;
    }
  }

  return best;
};

/** Ruta completa de una pieza marcada del lienzo. */
export const editPathOf = (el: Element, container: Element): string =>
  resolvePath(el, CANVAS_ATTR, container);

/** El elemento del panel cuya ruta coincide, o el del ancestro más cercano que la contenga. */
const findTarget = (panel: Element, path: string): HTMLElement | null => {
  let best: HTMLElement | null = null;
  let bestLength = -1;

  for (const el of Array.from(panel.querySelectorAll<HTMLElement>(`[${TARGET_ATTR}]`))) {
    const full = resolvePath(el, TARGET_ATTR, panel);
    if (isWithinPath(path, full) && full.length > bestLength) {
      best = el;
      bestLength = full.length;
    }
  }

  return best;
};

const FIELD_SELECTOR = 'input:not([type="hidden"]), textarea, select';

/**
 * Lleva el panel hasta el campo de `path`: lo desplaza suavemente al centro,
 * lo resalta y le pone el foco.
 *
 * Espera a que el campo exista, porque puede tardar: el editor se carga en
 * diferido la primera vez y la tarjeta que lo contiene se monta al abrirse.
 * Si pasado ese tiempo no aparece (un bloque o un campo sin marcar), no hace
 * nada y el panel queda como siempre.
 *
 * Devuelve una función para cancelar la espera.
 */
export const revealEditTarget = (panel: HTMLElement, path: string, timeoutMs = 1500): (() => void) => {
  let frame = 0;
  let cancelled = false;
  const start = performance.now();

  const attempt = () => {
    if (cancelled) return;

    const target = findTarget(panel, path);
    const exact = target && resolvePath(target, TARGET_ATTR, panel) === path;

    // Mientras quepa esperar, solo vale el campo exacto: su tarjeta puede estar
    // abriéndose. Agotado el tiempo, vale el ancestro más cercano.
    if (target && (exact || performance.now() - start > timeoutMs)) {
      highlight(target, panel);
      return;
    }
    if (performance.now() - start > timeoutMs) return;

    frame = requestAnimationFrame(attempt);
  };

  // Dos fotogramas antes del primer intento: lo que deba abrirse por esta misma
  // petición (la tarjeta plegada) lo hace en el ciclo de Vue en curso, y
  // buscando antes se encontraría la tarjeta aún cerrada.
  frame = requestAnimationFrame(() => {
    frame = requestAnimationFrame(attempt);
  });

  return () => {
    cancelled = true;
    cancelAnimationFrame(frame);
  };
};

const HIGHLIGHT_CLASS = 'is-edit-focused';

/** Aire sobre una tarjeta llevada arriba del panel, para que no quede pegada al borde. */
const SCROLL_MARGIN = 14;

const highlight = (target: HTMLElement, panel: HTMLElement) => {
  const isField = target.matches(FIELD_SELECTOR);

  // Un campo se centra; un grupo (una tarjeta abierta) se lleva arriba, para
  // que quepa su contenido y no solo su cabecera.
  //
  // Se desplaza SOLO el panel, a mano, y no con scrollIntoView: ese desplaza
  // todos los contenedores con scroll que tenga encima, también la página, y
  // el lienzo se movía bajo el cursor mientras duraba el desplazamiento suave.
  const panelRect = panel.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const offset = targetRect.top - panelRect.top + panel.scrollTop;
  const top = isField
    ? offset - (panel.clientHeight - targetRect.height) / 2
    : offset - SCROLL_MARGIN;
  panel.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

  // Se quita y se vuelve a poner para que la animación arranque de nuevo si
  // se pulsa otra vez la misma pieza.
  target.classList.remove(HIGHLIGHT_CLASS);
  void target.offsetWidth;
  target.classList.add(HIGHLIGHT_CLASS);
  window.setTimeout(() => target.classList.remove(HIGHLIGHT_CLASS), 1600);

  // El foco, sin su propio salto: el desplazamiento suave ya lo hace. Sin
  // campo de texto (una imagen) va al primer botón ("Cambiar imagen"); sin
  // nada enfocable se suelta el anterior, para no dejarlo en otro campo.
  const focusable = isField
    ? target
    : target.querySelector<HTMLElement>(FIELD_SELECTOR) ?? target.querySelector<HTMLElement>('button:not(:disabled)');

  if (focusable) {
    focusable.focus({ preventScroll: true });
  } else if (document.activeElement instanceof HTMLElement && panel.contains(document.activeElement)) {
    document.activeElement.blur();
  }
};

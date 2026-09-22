<template>
  <!--
    `arcis-scope` en la raíz, como el resto de piezas de branding: ni el lienzo
    del admin ni el layout de public-site envuelven la cabecera en uno.
  -->
  <div
    ref="root"
    class="arcis-scope mmb-host"
    @pointerleave="onHostPointerLeave"
    @pointerenter="cancelClose"
    @keydown.esc="closePanel"
  >
    <div class="mmb" :style="{ '--mmb-logo-height': `${logoHeight}px` }">
      <div class="mmb__bar">
        <component :is="linkTag" v-bind="getLinkProps(logoLink)" class="mmb__logo">
          <img class="mmb__logo-image" :src="logoSrc" alt="Universidad ESAN" />
        </component>

        <!-- Primer nivel. Solo en escritorio: en tableta y móvil va al menú lateral. -->
        <nav v-if="roots.length" class="mmb__nav" aria-label="Menú principal">
          <ul class="mmb__menu">
            <li
              v-for="item in roots"
              :key="item.id"
              class="mmb__menu-item"
              @pointerenter="onItemPointerEnter($event, item)"
            >
              <!--
                Con submenú es un control, no un enlace: abre el panel (con ratón
                basta pasar por encima). El destino de la entrada queda en el
                título del panel. <a> y no <button>, por decisión de proyecto.
              -->
              <a
                v-if="item.children.length"
                class="mmb__menu-link"
                :class="{ 'is-active': activeId === item.id }"
                role="button"
                tabindex="0"
                aria-haspopup="true"
                :aria-expanded="String(activeId === item.id)"
                @click="togglePanel(item.id)"
                @keydown="onControlKeydown($event, () => togglePanel(item.id))"
              >
                {{ item.title }}
                <AtomIcon name="chevron-down" :size="14" />
              </a>
              <component v-else :is="linkTag" v-bind="getLinkProps(item.url)" class="mmb__menu-link">
                {{ item.title }}
              </component>
            </li>
          </ul>
        </nav>

        <div class="mmb__actions">
          <component
            :is="linkTag"
            v-bind="getLinkProps(searchUrl)"
            class="mmb__search"
            aria-label="Buscar"
          >
            <AtomIcon name="search" :size="22" />
          </component>

          <a
            class="mmb__burger"
            role="button"
            tabindex="0"
            aria-label="Abrir menú"
            :aria-expanded="String(drawerOpen)"
            @click="drawerOpen = true"
            @keydown="onControlKeydown($event, () => (drawerOpen = true))"
          >
            <AtomIcon name="menu" :size="22" />
          </a>
        </div>
      </div>

      <Transition name="mmb-panel">
        <MegaPanel
          v-if="activeRoot"
          :root="activeRoot"
          :link-component="linkComponent"
          @close="closePanel"
        />
      </Transition>
    </div>
  </div>

  <Transition name="mmb-drawer">
    <MobileDrawer
      v-if="drawerOpen"
      :roots="roots"
      :secondary="secondary"
      :search-url="searchUrl"
      :link-component="linkComponent"
      @close="drawerOpen = false"
    />
  </Transition>
</template>

<script setup lang="ts">
/**
 * Cabecera con mega menú (beta).
 *
 * Escritorio: logo, entradas de primer nivel con flecha y el botón rojo de
 * búsqueda pegado al borde. Cada entrada con submenú abre un panel a todo el
 * ancho (MegaPanel). Tableta y móvil (por debajo de 1024px): logo, lupa y la
 * hamburguesa roja, que abre el menú lateral por niveles (MobileDrawer).
 *
 * Usa la misma arquitectura de datos que HeaderMega: el árbol sale del Menú
 * Institucional vinculado en el panel de branding (`config.menu_tree`, o la
 * prop `menu` si aún no se personalizó). Ver menu.ts.
 *
 * El menú lateral añade debajo los enlaces del topbar, que en móvil se ocultan
 * de la franja: los recibe por inyección (BRANDING_TOPBAR_KEY), no por props.
 */
import { ref, computed, watch, inject, onMounted, onBeforeUnmount } from 'vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import { useDynamicLink } from '../../../../composables/useDynamicLink';
import { BRANDING_TOPBAR_KEY } from '../../../../helpers/branding';
import defaultLogo from '../../../../assets/images/logos/logo-esan-official.svg';
import MegaPanel from './MegaPanel.vue';
import MobileDrawer from './MobileDrawer.vue';
import { normalizeMenu, normalizeSecondary, type MenuRoot } from './menu';

/**
 * Ancho de la cabecera por debajo del cual se usa el menú lateral. Es el mismo
 * punto de quiebre que usa la hoja ('lg' en breakpoints.scss, el de arcis-2):
 * si cambia uno, tiene que cambiar el otro.
 */
const COMPACT_BELOW = 1024;

/** Espera antes de cerrar el panel al salir con el ratón: evita que parpadee al rozar el borde. */
const CLOSE_DELAY = 180;

const props = defineProps<{
  config: Record<string, any>;
  menu?: any[];
  /** NuxtLink en public-site; sin él, un <a> normal. */
  linkComponent?: any;
  /* Lo pasa el lienzo del admin; la vista de dispositivo la resuelve el ancho del contenedor. */
  viewMode?: string;
}>();

const { linkTag, getLinkProps } = useDynamicLink(props.linkComponent);

const text = (value: unknown) => (typeof value === 'string' ? value : '');

const logoSrc = computed(() => text(props.config?.logoUrl).trim() || defaultLogo);
const logoLink = computed(() => text(props.config?.urlRedict).trim() || '/');
const searchUrl = computed(() => text(props.config?.searchUrl).trim());

/** Alto del logo en escritorio. En tableta y móvil la hoja lo reduce en proporción. */
const logoHeight = computed(() => {
  const value = Number(props.config?.logoHeight);
  return Number.isFinite(value) && value > 0 ? value : 36;
});

/* Mismo criterio que HeaderMega: el árbol personalizado manda; si no hay, el menú crudo. */
const roots = computed<MenuRoot[]>(() =>
  normalizeMenu(props.config?.menu_tree?.length ? props.config.menu_tree : props.menu),
);

const topbar = inject(BRANDING_TOPBAR_KEY, null);
const secondary = computed(() => normalizeSecondary(topbar?.value));

/* -------------------------------------------------------------------------
   Panel de escritorio
   ------------------------------------------------------------------------- */

const activeId = ref<string | null>(null);

const activeRoot = computed(
  () => roots.value.find((item) => item.id === activeId.value && item.children.length) ?? null,
);

let closeTimer: ReturnType<typeof setTimeout> | undefined;

const cancelClose = () => clearTimeout(closeTimer);

const closePanel = () => {
  cancelClose();
  activeId.value = null;
};

const togglePanel = (id: string) => {
  cancelClose();
  activeId.value = activeId.value === id ? null : id;
};

/*
 * Solo el ratón abre al pasar. En táctil, pointerenter llega junto con el toque
 * y abriría el panel justo antes de que el clic lo volviera a cerrar.
 */
const onItemPointerEnter = (event: PointerEvent, item: MenuRoot) => {
  if (event.pointerType !== 'mouse') return;
  cancelClose();
  activeId.value = item.children.length ? item.id : null;
};

const onHostPointerLeave = (event: PointerEvent) => {
  if (event.pointerType !== 'mouse' || !activeId.value) return;
  closeTimer = setTimeout(() => (activeId.value = null), CLOSE_DELAY);
};

/** Los controles son <a> sin href: Enter y Espacio los activan, como a un botón. */
const onControlKeydown = (event: KeyboardEvent, action: () => void) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  action();
};

/* Un clic fuera de la cabecera cierra el panel. */
const root = ref<HTMLElement | null>(null);

const onDocumentClick = (event: MouseEvent) => {
  if (activeId.value && root.value && !root.value.contains(event.target as Node)) closePanel();
};

/* -------------------------------------------------------------------------
   Menú lateral (tableta y móvil)
   ------------------------------------------------------------------------- */

const drawerOpen = ref(false);

/*
 * Con el menú abierto, la página de detrás no se desplaza: si no, el gesto de
 * recorrer el menú movería la página debajo.
 */
watch(drawerOpen, (open) => {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = open ? 'hidden' : '';
});

/*
 * Si la cabecera pasa a ancho de escritorio con el menú lateral abierto (girar
 * la tableta, o el lienzo del admin), se cierra: en escritorio no hay
 * hamburguesa para cerrarlo. Y al revés, el panel de escritorio no sigue
 * abierto en móvil.
 */
let observer: ResizeObserver | null = null;

const onResize = () => {
  const width = root.value?.clientWidth ?? 0;
  if (width >= COMPACT_BELOW) drawerOpen.value = false;
  else closePanel();
};

onMounted(() => {
  document.addEventListener('click', onDocumentClick);

  if (typeof ResizeObserver !== 'undefined' && root.value) {
    observer = new ResizeObserver(onResize);
    observer.observe(root.value);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
  observer?.disconnect();
  cancelClose();
  if (drawerOpen.value) document.body.style.overflow = '';
});
</script>

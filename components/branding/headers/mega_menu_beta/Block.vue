<template>
  <!--
    `arcis-scope` en la raíz, como el resto de piezas de branding: ni el lienzo
    del admin ni el layout de public-site envuelven la cabecera en uno.
  -->
  <div
    ref="root"
    v-bind="$attrs"
    class="arcis-scope mmb-host"
    :class="{ 'is-pinned': pinned, 'is-shown': shown, 'is-animated': animated }"
    @pointerleave="onHostPointerLeave"
    @pointerenter="cancelClose"
    @keydown.esc="closePanelAndRestoreFocus"
    @focusin="onHostFocusIn"
  >
    <!--
      Sin lupa, la barra necesita su propio margen a la derecha: ese borde lo
      cubría el botón rojo, que llega hasta el canto.
    -->
    <div
      class="mmb"
      :class="{ 'mmb--no-search': !searchUrl }"
      :style="{ '--mmb-logo-height': `${logoHeight}px` }"
    >
      <div class="mmb__bar">
        <component :is="linkTag" v-bind="getLinkProps(logoLink)" class="mmb__logo">
          <img class="mmb__logo-image" :src="logoSrc" :alt="logoAlt" />
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
                :aria-controls="panelId(item)"
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
          <!-- Sin destino no se dibuja: un botón de búsqueda que no busca engaña. -->
          <component
            v-if="searchUrl"
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

      <!--
        Todos los paneles se dibujan desde el principio y se muestran u ocultan
        con v-show, no con v-if: así sus enlaces ya vienen en el HTML que entrega
        el servidor y los buscadores los encuentran sin tener que pasar el ratón.

        La animación va en el contenedor y no en cada panel: se anima al abrir y
        al cerrar, pero pasar de una entrada a otra es un cambio seco, como
        antes. Con una transición por panel, los dos se fundirían uno sobre otro.
      -->
      <Transition name="mmb-panel">
        <div v-show="activeRoot" class="mmb-panels">
          <MegaPanel
            v-for="item in panelRoots"
            v-show="activeId === item.id"
            :id="panelId(item)"
            :key="item.id"
            :root="item"
            :open="activeId === item.id"
            :link-component="linkComponent"
            @close="closePanel"
          />
        </div>
      </Transition>
    </div>
  </div>

  <!--
    Con la barra fija (modo "aparece al subir") guarda su sitio en la página:
    sin él, todo lo de debajo subiría de golpe lo que mide la barra. Es una
    raíz hermana y no un hijo porque lo que se fija es la propia cabecera: su
    `.arcis-scope` lleva container-type, que encierra a los hijos fijos.
  -->
  <div v-if="pinned" ref="spacer" aria-hidden="true" :style="{ height: `${barHeight}px` }"></div>

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
 *
 * Al desplazar (`config.scrollBehavior`): 'static' deja la cabecera en su
 * sitio; 'reveal' la fija arriba escondida en cuanto sale de la pantalla y la
 * hace asomar al subir un poco. Ver "Comportamiento al desplazar".
 */
import { ref, computed, watch, inject, nextTick, onMounted, onBeforeUnmount } from 'vue';
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

/*
 * La plantilla tiene dos raíces —la cabecera y el menú lateral, que se fija a la
 * ventana—, así que Vue no sabe en cuál poner lo que llegue de fuera (una clase
 * del lienzo, por ejemplo) y lo descarta con un aviso. Se reparte a mano: todo
 * va a la cabecera, que es la raíz visible.
 */
defineOptions({ inheritAttrs: false });

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

/*
 * `logoLink` manda sobre `urlRedict`: es lo que pone el layout de public-site en
 * cada idioma (/en en inglés), por encima de lo que se haya escrito en el
 * editor, que guarda `urlRedict`.
 */
const logoLink = computed(
  () => text(props.config?.logoLink).trim() || text(props.config?.urlRedict).trim() || '/',
);

/*
 * Texto alternativo del logo. Cada unidad sube el suyo, así que no puede decir
 * siempre "Universidad ESAN": si no se escribe uno y hay logo propio, se
 * describe a dónde lleva, que es lo único que se sabe con certeza.
 */
const logoAlt = computed(() => {
  const custom = text(props.config?.logoAlt).trim();
  if (custom) return custom;
  return text(props.config?.logoUrl).trim() ? 'Inicio' : 'Universidad ESAN';
});

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

/* Solo las entradas con submenú tienen panel; las demás son enlaces directos. */
const panelRoots = computed(() => roots.value.filter((item) => item.children.length));

/*
 * Id del panel de cada entrada. Ahora que todos existen desde el principio, el
 * control puede apuntar al suyo con aria-controls.
 */
const panelId = (item: MenuRoot) => `mmb-panel-${item.id}`;

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
 * Cerrar con Esc devuelve el foco al control que abrió el panel: si se queda
 * dentro, al ocultarse el panel el foco se pierde y con teclado hay que volver
 * a recorrer la página desde el principio.
 *
 * Solo aquí, y no en closePanel: al cerrar con el ratón o al seguir un enlace,
 * mover el foco sería robárselo a quien está en otra parte.
 */
const closePanelAndRestoreFocus = () => {
  const id = activeId.value;
  closePanel();
  if (!id) return;

  nextTick(() => {
    root.value?.querySelector<HTMLElement>(`[aria-controls="mmb-panel-${id}"]`)?.focus();
  });
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

  // La barra cambia de alto con el tamaño (80px / 56px): el hueco la sigue.
  if (pinned.value && root.value) barHeight.value = root.value.offsetHeight;
};

/* -------------------------------------------------------------------------
   Comportamiento al desplazar

   'reveal' pasa por tres estados:
     en su sitio  mientras se ve el sitio de la cabecera en la página
     fija oculta  en cuanto ese sitio sale por arriba de la pantalla
     fija visible al subir REVEAL_TOLERANCE px; al volver a bajar, se oculta
   Vuelve a su sitio cuando, subiendo, se llega de nuevo a él: en ese punto la
   barra fija y su sitio coinciden, así que el cambio no se nota.
   ------------------------------------------------------------------------- */

/** Lo que hay que subir para que la barra asome: un roce del trackpad no la saca. */
const REVEAL_TOLERANCE = 8;

/*
 * En el lienzo del admin (el único que pasa viewMode) no se activa: lo que se
 * desplaza es la página del admin, y el lienzo encierra a los elementos fijos
 * (`contain: layout` en .window-content), así que la barra se fijaría dentro
 * de él.
 */
const revealEnabled = computed(() => props.config?.scrollBehavior === 'reveal' && !props.viewMode);

const pinned = ref(false);
const shown = ref(false);
/*
 * La transición se enciende después de fijar la barra: si estuviera activa en
 * ese momento, se la vería pasar de su sitio a escondida deslizándose.
 */
const animated = ref(false);
const barHeight = ref(0);
const spacer = ref<HTMLElement | null>(null);

let lastScrollY = 0;
let upDistance = 0;
let frame = 0;

const pin = () => {
  barHeight.value = root.value?.offsetHeight ?? 0;
  pinned.value = true;
  shown.value = false;
  upDistance = 0;
  // Dos fotogramas: el primero pinta la barra ya escondida, sin transición.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      if (pinned.value) animated.value = true;
    }),
  );
};

const unpin = () => {
  pinned.value = false;
  shown.value = false;
  animated.value = false;
};

/* Al esconderse, un panel abierto se quedaría flotando sin su barra. */
const hide = () => {
  if (!shown.value) return;
  shown.value = false;
  closePanel();
};

const updatePinState = () => {
  frame = 0;
  const host = root.value;
  const anchor = pinned.value ? spacer.value : host;
  if (!host || !anchor) return;

  const y = window.scrollY;
  const delta = y - lastScrollY;
  lastScrollY = y;

  // Dónde está la cabecera en la página; con la barra fija lo marca el hueco.
  const top = anchor.getBoundingClientRect().top + y;
  const bottom = top + host.offsetHeight;

  if (!pinned.value) {
    if (y > bottom) pin();
    return;
  }

  if (y <= top) {
    unpin();
  } else if (y < bottom) {
    // Asoma el hueco que guarda su sitio: la barra lo cubre en vez de dejarlo en blanco.
    shown.value = true;
  } else if (delta > 0) {
    upDistance = 0;
    hide();
  } else if (delta < 0) {
    upDistance -= delta;
    if (upDistance >= REVEAL_TOLERANCE) shown.value = true;
  }
};

/* Un cálculo por fotograma, por muchos eventos de scroll que lleguen. */
const onWindowScroll = () => {
  if (!frame) frame = requestAnimationFrame(updatePinState);
};

/* Con teclado, el foco puede entrar en la barra escondida: se muestra para que se vea dónde está. */
const onHostFocusIn = () => {
  if (pinned.value) shown.value = true;
};

const startReveal = () => {
  lastScrollY = window.scrollY;
  window.addEventListener('scroll', onWindowScroll, { passive: true });
  // Si la página se abre ya desplazada (recargar a media página), la barra se fija desde el principio.
  updatePinState();
};

const stopReveal = () => {
  window.removeEventListener('scroll', onWindowScroll);
  cancelAnimationFrame(frame);
  frame = 0;
  unpin();
};

watch(revealEnabled, (enabled: boolean) => {
  if (typeof window === 'undefined') return;
  if (enabled) startReveal();
  else stopReveal();
});

onMounted(() => {
  document.addEventListener('click', onDocumentClick);

  if (typeof ResizeObserver !== 'undefined' && root.value) {
    observer = new ResizeObserver(onResize);
    observer.observe(root.value);
  }

  if (revealEnabled.value) startReveal();
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
  observer?.disconnect();
  cancelClose();
  stopReveal();
  if (drawerOpen.value) document.body.style.overflow = '';
});
</script>

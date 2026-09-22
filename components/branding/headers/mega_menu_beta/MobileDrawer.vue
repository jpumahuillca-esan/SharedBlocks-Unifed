<template>
  <!--
    Raíz propia con `arcis-scope`, hermana de la cabecera y no dentro de ella:
    .arcis-scope es contenedor de consulta, y eso lo vuelve el bloque contenedor
    de sus descendientes `position: fixed` (ver base.scss). Dentro de la
    cabecera, el menú quedaría encerrado en el alto de la barra; aquí se fija a
    la ventana.
  -->
  <div class="arcis-scope mmb-drawer" @keydown.esc="$emit('close')">
    <div class="mmb-drawer__overlay" aria-hidden="true" @click="$emit('close')"></div>

    <div ref="panel" class="mmb-drawer__panel" role="dialog" aria-modal="true" aria-label="Menú principal">
      <!-- Barra: búsqueda y cerrar, en el mismo sitio que la lupa y la hamburguesa. -->
      <div class="mmb-drawer__bar">
        <component
          :is="linkTag"
          v-bind="getLinkProps(searchUrl)"
          class="mmb-drawer__search"
          aria-label="Buscar"
        >
          <AtomIcon name="search" :size="22" />
        </component>

        <a
          class="mmb-drawer__close"
          role="button"
          tabindex="0"
          aria-label="Cerrar menú"
          @click="$emit('close')"
          @keydown="onControlKeydown($event, () => $emit('close'))"
        >
          <AtomIcon name="x" :size="22" />
        </a>
      </div>

      <div class="mmb-drawer__body" @click="closeOnLink">
        <!-- Primer nivel: el menú principal y, debajo, los enlaces del topbar. -->
        <template v-if="!view">
          <ul class="mmb-drawer__list">
            <li v-for="root in roots" :key="root.id">
              <a
                v-if="root.children.length"
                class="mmb-drawer__item"
                role="button"
                tabindex="0"
                @click="push({ kind: 'root', root })"
                @keydown="onControlKeydown($event, () => push({ kind: 'root', root }))"
              >
                <span>{{ root.title }}</span>
                <AtomIcon name="chevron-right" :size="16" />
              </a>
              <component v-else :is="linkTag" v-bind="getLinkProps(root.url)" class="mmb-drawer__item">
                {{ root.title }}
              </component>
            </li>
          </ul>

          <ul v-if="secondary.length" class="mmb-drawer__list mmb-drawer__list--secondary">
            <li v-for="link in secondary" :key="link.id">
              <a
                v-if="link.children.length"
                class="mmb-drawer__item"
                role="button"
                tabindex="0"
                @click="push({ kind: 'secondary', link })"
                @keydown="onControlKeydown($event, () => push({ kind: 'secondary', link }))"
              >
                <span>{{ link.label }}</span>
                <AtomIcon name="chevron-right" :size="16" />
              </a>
              <component v-else :is="linkTag" v-bind="getLinkProps(link.url)" class="mmb-drawer__item">
                {{ link.label }}
              </component>
            </li>
          </ul>
        </template>

        <!-- Niveles interiores: "Volver", el título y la lista de ese nivel. -->
        <template v-else>
          <a
            class="mmb-drawer__back"
            role="button"
            tabindex="0"
            @click="pop"
            @keydown="onControlKeydown($event, pop)"
          >
            <AtomIcon name="chevron-left" :size="16" />
            Volver
          </a>

          <!-- Entrada del menú principal: título del panel y sus pestañas. -->
          <template v-if="view.kind === 'root'">
            <component
              :is="view.root.url ? linkTag : 'p'"
              v-bind="view.root.url ? getLinkProps(view.root.url) : {}"
              class="mmb-drawer__title"
            >
              {{ view.root.headerTitle || view.root.title }}
              <AtomIcon name="arrow-right" :size="16" />
            </component>

            <ul class="mmb-drawer__list">
              <li v-for="tab in view.root.children" :key="tab.id">
                <a
                  v-if="tab.children.length"
                  class="mmb-drawer__item"
                  role="button"
                  tabindex="0"
                  @click="push({ kind: 'tab', tab })"
                  @keydown="onControlKeydown($event, () => push({ kind: 'tab', tab }))"
                >
                  <span>{{ tab.title }}</span>
                  <AtomIcon name="chevron-right" :size="16" />
                </a>
                <component v-else :is="linkTag" v-bind="getLinkProps(tab.url)" class="mmb-drawer__item">
                  {{ tab.title }}
                </component>
              </li>
            </ul>
          </template>

          <!-- Pestaña: sus grupos con enlaces, o su lista (el banner no va en móvil). -->
          <template v-else-if="view.kind === 'tab'">
            <template v-if="view.tab.layout === 'columns'">
              <div v-for="group in view.tab.children" :key="group.id" class="mmb-drawer__group">
                <component
                  :is="group.url ? linkTag : 'p'"
                  v-bind="group.url ? getLinkProps(group.url) : {}"
                  class="mmb-drawer__group-title"
                >{{ group.title }}</component>

                <ul class="mmb-drawer__links">
                  <li v-for="link in group.children" :key="link.id">
                    <component :is="linkTag" v-bind="getLinkProps(link.url)" class="mmb-drawer__link">
                      {{ link.title }}
                    </component>
                  </li>
                </ul>
              </div>
            </template>

            <div v-else class="mmb-drawer__group">
              <component
                :is="view.tab.url ? linkTag : 'p'"
                v-bind="view.tab.url ? getLinkProps(view.tab.url) : {}"
                class="mmb-drawer__group-title"
              >{{ view.tab.title }}</component>

              <ul class="mmb-drawer__links">
                <li v-for="link in view.tab.children" :key="link.id">
                  <component :is="linkTag" v-bind="getLinkProps(link.url)" class="mmb-drawer__link">
                    {{ link.title }}
                  </component>
                </li>
              </ul>
            </div>
          </template>

          <!-- Enlace del topbar con opciones. -->
          <template v-else>
            <component
              :is="view.link.url ? linkTag : 'p'"
              v-bind="view.link.url ? getLinkProps(view.link.url) : {}"
              class="mmb-drawer__title"
            >{{ view.link.label }}</component>

            <ul class="mmb-drawer__list">
              <li v-for="child in view.link.children" :key="child.id">
                <component :is="linkTag" v-bind="getLinkProps(child.url)" class="mmb-drawer__item">
                  {{ child.label }}
                </component>
              </li>
            </ul>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Menú de la cabecera en tableta y móvil: panel lateral que entra por la
 * derecha, con un nivel a la vista y "Volver" para subir. Lo abre la
 * hamburguesa de la cabecera (Block.vue).
 *
 * Los niveles se apilan: la pila guarda qué se abrió en cada paso, y "Volver"
 * quita el último. Cerrar el menú la descarta entera, así que al volver a
 * abrirlo se empieza por el principio.
 */
import { ref, computed, nextTick, onMounted } from 'vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import { useDynamicLink } from '../../../../composables/useDynamicLink';
import type { MenuRoot, MenuTab, SecondaryLink } from './menu';

type DrawerView =
  | { kind: 'root'; root: MenuRoot }
  | { kind: 'tab'; tab: MenuTab }
  | { kind: 'secondary'; link: SecondaryLink };

const props = defineProps<{
  roots: MenuRoot[];
  secondary: SecondaryLink[];
  searchUrl: string;
  linkComponent?: any;
}>();

const emit = defineEmits<{ (e: 'close'): void }>();

const { linkTag, getLinkProps } = useDynamicLink(props.linkComponent);

const stack = ref<DrawerView[]>([]);
const view = computed(() => stack.value[stack.value.length - 1] ?? null);

const panel = ref<HTMLElement | null>(null);

/*
 * Al cambiar de nivel, el foco pasa al primer control del nivel nuevo: si no,
 * se queda en un elemento que ya no existe y el teclado vuelve al principio de
 * la página.
 */
const focusFirst = () =>
  nextTick(() => {
    const first = panel.value?.querySelector<HTMLElement>('.mmb-drawer__body a');
    first?.focus();
    panel.value?.querySelector('.mmb-drawer__body')?.scrollTo({ top: 0 });
  });

const push = (next: DrawerView) => {
  stack.value = [...stack.value, next];
  focusFirst();
};

const pop = () => {
  stack.value = stack.value.slice(0, -1);
  focusFirst();
};

/** Los controles son <a> sin href (nunca <button>): Enter y Espacio los activan. */
const onControlKeydown = (event: KeyboardEvent, action: () => void) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  action();
};

/* Al seguir un enlace, el menú se cierra: la página nueva no debe abrirse tapada. */
const closeOnLink = (event: MouseEvent) => {
  const link = (event.target as HTMLElement | null)?.closest('a[href]');
  if (link) emit('close');
};

/* Al abrir, el foco entra en el menú: con teclado, se sigue desde ahí. */
onMounted(() => {
  panel.value?.querySelector<HTMLElement>('.mmb-drawer__close')?.focus();
});
</script>

<template>
  <div class="mmb-panel" @click="closeOnLink">
    <div class="mmb-panel__inner">
      <!-- Título del panel con su filete rojo. Lleva al destino de la entrada. -->
      <div class="mmb-panel__head">
        <component
          :is="root.url ? linkTag : 'p'"
          v-bind="root.url ? getLinkProps(root.url) : {}"
          class="mmb-panel__title"
        >
          {{ root.headerTitle || root.title }}
          <AtomIcon name="arrow-right" :size="18" />
        </component>
      </div>

      <div class="mmb-panel__grid">
        <!-- Columna izquierda: pestañas (nivel 2). -->
        <ul class="mmb-panel__tabs">
          <li v-for="tab in root.children" :key="tab.id">
            <!--
              Con ratón, pasar por encima la activa y el clic navega. Con el dedo
              no hay "pasar por encima": el primer toque la activa (para ver su
              contenido) y el siguiente navega. Sin destino, es solo un control.
            -->
            <component
              :is="tab.url ? linkTag : 'a'"
              v-bind="tab.url ? getLinkProps(tab.url) : { role: 'button', tabindex: 0 }"
              class="mmb-panel__tab"
              :class="{ 'is-active': activeTab?.id === tab.id }"
              @pointerenter="onTabPointerEnter($event, tab.id)"
              @focus="activeTabId = tab.id"
              @click="onTabClick($event, tab)"
              @keydown="onTabKeydown($event, tab)"
            >
              <span>{{ tab.title }}</span>
              <AtomIcon name="chevron-right" :size="16" />
            </component>
          </li>
        </ul>

        <!-- Contenido de la pestaña activa. -->
        <div v-if="activeTab" class="mmb-panel__content">
          <!-- En columnas: cada grupo (nivel 3) con sus enlaces (nivel 4). -->
          <div v-if="activeTab.layout === 'columns'" class="mmb-panel__columns">
            <div v-for="group in activeTab.children" :key="group.id" class="mmb-panel__group">
              <component
                :is="group.url ? linkTag : 'p'"
                v-bind="group.url ? getLinkProps(group.url) : {}"
                class="mmb-panel__group-title"
              >{{ group.title }}</component>

              <ul v-if="group.children.length" class="mmb-panel__links">
                <li v-for="link in group.children" :key="link.id">
                  <component :is="linkTag" v-bind="getLinkProps(link.url)" class="mmb-panel__link">
                    {{ link.title }}
                  </component>
                </li>
              </ul>
            </div>
          </div>

          <!-- En lista con banner: el título de la pestaña, sus enlaces y el banner. -->
          <div v-else class="mmb-panel__split">
            <div class="mmb-panel__group">
              <component
                :is="activeTab.url ? linkTag : 'p'"
                v-bind="activeTab.url ? getLinkProps(activeTab.url) : {}"
                class="mmb-panel__group-title"
              >{{ activeTab.title }}</component>

              <ul v-if="activeTab.children.length" class="mmb-panel__links">
                <li v-for="link in activeTab.children" :key="link.id">
                  <component :is="linkTag" v-bind="getLinkProps(link.url)" class="mmb-panel__link">
                    {{ link.title }}
                  </component>
                </li>
              </ul>
            </div>

            <!--
              Sin imagen queda el recuadro gris de la maqueta con su rótulo: así el
              panel ya muestra dónde va el banner mientras no se sube.
            -->
            <component
              :is="activeTab.bannerUrl ? linkTag : 'div'"
              v-bind="activeTab.bannerUrl ? getLinkProps(activeTab.bannerUrl) : {}"
              class="mmb-panel__banner"
              :class="{ 'is-empty': !activeTab.bannerImage }"
            >
              <img
                v-if="activeTab.bannerImage"
                class="mmb-panel__banner-image"
                :src="activeTab.bannerImage"
                :alt="activeTab.bannerTitle"
                loading="lazy"
                decoding="async"
              />
              <p v-if="activeTab.bannerImage && activeTab.bannerTitle" class="mmb-panel__banner-title">
                {{ activeTab.bannerTitle }}
              </p>
              <p v-else-if="!activeTab.bannerImage" class="mmb-panel__banner-placeholder">Banner</p>
            </component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Panel del mega menú en escritorio: título con filete, pestañas a la izquierda
 * y, a la derecha, el contenido de la pestaña activa (columnas de grupos, o
 * lista con banner). Lo abre la cabecera (Block.vue) al elegir una entrada.
 */
import { ref, computed, watch } from 'vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import { useDynamicLink } from '../../../../composables/useDynamicLink';
import type { MenuRoot, MenuTab } from './menu';

const props = defineProps<{
  root: MenuRoot;
  linkComponent?: any;
}>();

const emit = defineEmits<{ (e: 'close'): void }>();

const { linkTag, getLinkProps } = useDynamicLink(props.linkComponent);

/* De entrada, la primera pestaña: el panel nunca se abre con la derecha vacía. */
const activeTabId = ref<string | null>(null);

watch(
  () => props.root.id,
  () => {
    activeTabId.value = props.root.children[0]?.id ?? null;
  },
  { immediate: true },
);

const activeTab = computed(
  () => props.root.children.find((tab) => tab.id === activeTabId.value) ?? props.root.children[0] ?? null,
);

/* Solo el ratón activa al pasar: en táctil, pointerenter llega junto con el toque. */
const onTabPointerEnter = (event: PointerEvent, id: string) => {
  if (event.pointerType === 'mouse') activeTabId.value = id;
};

const onTabClick = (event: MouseEvent, tab: MenuTab) => {
  // Sin destino, o primer toque en una pestaña no activa: solo se activa.
  if (!tab.url || activeTabId.value !== tab.id) {
    event.preventDefault();
    activeTabId.value = tab.id;
  }
};

/** La pestaña sin destino es un <a> sin href: Enter y Espacio la activan. */
const onTabKeydown = (event: KeyboardEvent, tab: MenuTab) => {
  if (tab.url || (event.key !== 'Enter' && event.key !== ' ')) return;
  event.preventDefault();
  activeTabId.value = tab.id;
};

/* Al seguir un enlace del panel, se cierra: si no, quedaría abierto sobre la página nueva. */
const closeOnLink = (event: MouseEvent) => {
  const link = (event.target as HTMLElement | null)?.closest('a[href]');
  if (link && !event.defaultPrevented) emit('close');
};
</script>

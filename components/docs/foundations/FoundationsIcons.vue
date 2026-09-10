<script setup lang="ts">
/**
 * FoundationsIcons — grid de íconos disponibles vía AtomIcon (ARCIS
 * Design System, Foundations > Icons), para la página de
 * Documentación. La lista de nombres se mantiene a mano en sincronía
 * con el mapa ICONS de components/atoms/AtomIcon.vue — si se agrega un
 * ícono nuevo ahí, hay que sumarlo acá también.
 */
import { ref } from 'vue';
import AtomIcon from '../../atoms/AtomIcon.vue';

const names = [
  'graduation-cap', 'book-open', 'briefcase', 'award', 'users', 'globe',
  'calendar', 'clock', 'map-pin', 'phone', 'mail', 'search', 'menu', 'x',
  'chevron-down', 'chevron-right', 'arrow-right', 'arrow-up-right', 'check',
  'check-circle', 'star', 'download', 'external-link', 'play', 'info',
  'alert-triangle', 'alert-circle', 'link', 'arrow-up', 'layout-grid',
  'list', 'user', 'file-text', 'credit-card', 'file-down', 'trending-up',
];

const copiedName = ref<string | null>(null);

const copy = async (name: string) => {
  try {
    await navigator.clipboard.writeText(name);
    copiedName.value = name;
    setTimeout(() => (copiedName.value = null), 1200);
  } catch {
    /* clipboard no disponible (ej. contexto no seguro) */
  }
};
</script>

<template>
  <div class="fi__grid">
    <button v-for="name in names" :key="name" type="button" class="fi__item" @click="copy(name)">
      <AtomIcon :name="name" :size="20" />
      <span class="fi__name">{{ copiedName === name ? 'Copiado' : name }}</span>
    </button>
  </div>
</template>

<style scoped>
.fi__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
}
.fi__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  border: 1px solid var(--docs-border);
  border-radius: 8px;
  background: var(--docs-bg);
  color: var(--docs-text);
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease;
}
.fi__item:hover {
  border-color: var(--docs-accent);
  background: var(--docs-bg-hover);
}
.fi__name {
  font-size: 10px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: var(--docs-text-subtle);
  text-align: center;
}
</style>

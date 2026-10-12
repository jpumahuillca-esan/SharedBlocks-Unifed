<script setup lang="ts">
import { inject } from 'vue';
import { docsCodeNavigationKey } from './DocsCodeNavigation';

withDefaults(defineProps<{
  marker: string;
  label: string;
  occurrence?: number;
  block?: boolean;
}>(), {
  occurrence: 0,
  block: false,
});

const navigation = inject(docsCodeNavigationKey);
</script>

<template>
  <component :is="block ? 'div' : 'span'" class="preview-code-sample" :class="{ 'is-block': block }">
    <slot />
    <button
      v-if="navigation"
      type="button"
      class="preview-code-sample__action"
      :aria-label="`Ver código de ${label}`"
      :title="`Ver código de ${label}`"
      @click.stop="navigation.goToCodeMarker(marker, occurrence)"
    >
      <i class="las la-code" aria-hidden="true"></i>
      <span>Ver código</span>
    </button>
  </component>
</template>

<style scoped>
.preview-code-sample {
  position: relative;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
.preview-code-sample.is-block {
  display: flex;
  width: 100%;
}
.preview-code-sample__action {
  position: absolute;
  z-index: 2;
  top: -10px;
  right: -8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  border: 1px solid #d9dce2;
  border-radius: 5px;
  background: #fff;
  color: #39465a;
  box-shadow: 0 2px 7px rgba(20, 28, 40, 0.14);
  font: inherit;
  font-size: 10px;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transform: translateY(2px);
  transition: opacity 120ms ease, transform 120ms ease, border-color 120ms ease, color 120ms ease;
}
.preview-code-sample:hover .preview-code-sample__action,
.preview-code-sample:focus-within .preview-code-sample__action {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
.preview-code-sample__action:hover,
.preview-code-sample__action:focus-visible {
  border-color: #e3173e;
  color: #e3173e;
}
.preview-code-sample__action i {
  font-size: 13px;
}
@media (hover: none) {
  .preview-code-sample__action {
    padding: 4px;
    opacity: 1;
    pointer-events: auto;
    transform: none;
  }
  .preview-code-sample__action span {
    display: none;
  }
}
</style>

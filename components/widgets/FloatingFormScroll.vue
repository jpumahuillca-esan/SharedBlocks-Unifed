<template>
  <transition name="fade-slide">
    <button
      v-show="visible"
      type="button"
      class="floating-widget floating-form-scroll"
      :class="position === 'bottom-left' ? 'pos-left' : 'pos-right'"
      :style="{ bottom }"
      :title="label"
      :aria-label="label"
      @click="$emit('click')"
    >
      <AtomIcon name="send" :size="22" :stroke-width="2" class="form-scroll-icon" />
    </button>
  </transition>
</template>

<script setup lang="ts">
import AtomIcon from '../atoms/AtomIcon.vue';

withDefaults(
  defineProps<{
    visible?: boolean;
    position?: 'bottom-left' | 'bottom-right';
    bottom?: string;
    label?: string;
  }>(),
  {
    visible: false,
    position: 'bottom-right',
    bottom: '24px',
    label: 'Ir al formulario de contacto',
  },
);

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<style scoped>
.floating-widget {
  position: fixed;
  pointer-events: auto;
  z-index: 1065;
}

.pos-right {
  right: var(--fw-edge, 22px);
}

.pos-left {
  left: var(--fw-edge, 22px);
}

.floating-form-scroll {
  width: var(--fw-size, 54px);
  height: var(--fw-size, 54px);
  border-radius: 50%;
  background-color: #ffffff;
  color: var(--ds-color-esan-corp, #e3173e);
  border: 2px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 12px rgba(9, 8, 31, 0.08), 0 0 0 1px rgba(9, 8, 31, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.floating-form-scroll:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 16px rgba(9, 8, 31, 0.14), 0 0 0 1px rgba(9, 8, 31, 0.08);
}

.form-scroll-icon {
  width: var(--fw-icon-sm, 22px);
  height: var(--fw-icon-sm, 22px);
  flex-shrink: 0;
  transform: translate(-1px, 1px);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}
</style>

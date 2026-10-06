<template>
  <transition name="fade-slide">
    <button
      v-if="visible"
      type="button"
      class="floating-widget floating-scrolltop shadow-sm"
      :class="position === 'bottom-left' ? 'pos-left' : 'pos-right'"
      :style="{ bottom }"
      @click="handleClick"
      title="Volver al inicio de la página"
      aria-label="Volver al inicio de la página"
    >
      <svg class="scrolltop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  </transition>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    visible?: boolean;
    position?: 'bottom-left' | 'bottom-right';
    bottom?: string;
  }>(),
  {
    visible: false,
    position: 'bottom-right',
    bottom: '24px'
  }
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const handleClick = () => {
  emit('click');
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>

<style scoped>
.floating-widget {
  position: fixed;
  pointer-events: auto;
  z-index: 1045;
}

.pos-right {
  right: var(--fw-edge, 22px);
}

.pos-left {
  left: var(--fw-edge, 22px);
}

.floating-scrolltop {
  width: var(--fw-size, 54px);
  height: var(--fw-size, 54px);
  border-radius: 50%;
  background-color: #1e293b;
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
}

.floating-scrolltop:hover {
  background-color: #e31140;
  transform: translateY(-3px);
  box-shadow: 0 4px 14px rgba(227, 17, 64, 0.4);
}

.scrolltop-icon {
  width: var(--fw-icon-sm, 24px);
  height: var(--fw-icon-sm, 24px);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}
</style>

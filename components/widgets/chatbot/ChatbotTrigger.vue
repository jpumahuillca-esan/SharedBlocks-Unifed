<template>
  <button
    v-if="!isOpen"
    type="button"
    class="chatbot-toggle-btn shadow-lg"
    @click="$emit('toggle')"
    title="Abrir Asistente Virtual ESAN"
    aria-label="Abrir Asistente Virtual ESAN"
  >
    <div class="chatbot-icon-inner">
      <i class="las la-robot fs-28"></i>
    </div>
    <span class="online-indicator"></span>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    isOpen?: boolean;
  }>(),
  {
    isOpen: false
  }
);

defineEmits<{
  (e: 'toggle'): void;
}>();
</script>

<style scoped>
.chatbot-toggle-btn {
  width: var(--fw-size, 54px);
  height: var(--fw-size, 54px);
  border-radius: 50%;
  background: linear-gradient(135deg, #e31140 0%, #c20b32 100%);
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(227, 17, 64, 0.45);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chatbot-toggle-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgba(227, 17, 64, 0.6);
}

.chatbot-icon-inner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.fs-28 {
  font-size: 28px;
}

.online-indicator {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background-color: #10b981;
  border: 2px solid #ffffff;
  border-radius: 50%;
}

@media (max-width: 576px) {
  .chatbot-toggle-btn .las {
    font-size: 22px;
  }
}
</style>

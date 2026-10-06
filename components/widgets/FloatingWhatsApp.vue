<template>
  <div
    v-if="isActive"
    class="floating-widget floating-whatsapp"
    :class="[
      position === 'bottom-left' ? 'pos-left' : 'pos-right',
      { 'with-pulse': showPulse !== false }
    ]"
    :style="{ bottom }"
  >
    <!-- Tooltip / Mensaje de Bienvenida -->
    <div
      v-if="tooltip && showTooltip"
      class="whatsapp-tooltip shadow-lg"
      @click="openWhatsApp"
    >
      <span>{{ tooltip }}</span>
      <button
        type="button"
        class="tooltip-close"
        @click.stop="showTooltip = false"
        title="Cerrar mensaje"
        aria-label="Cerrar mensaje"
      >
        &times;
      </button>
    </div>

    <!-- Botón Circular de WhatsApp -->
    <a
      :href="whatsappLink"
      target="_blank"
      rel="noopener noreferrer"
      class="whatsapp-btn shadow-lg"
      :title="tooltip || 'Contáctanos por WhatsApp'"
      aria-label="Contáctanos por WhatsApp"
    >
      <svg class="whatsapp-icon" viewBox="0 0 32 32" fill="currentColor">
        <path d="M16 2.5C8.544 2.5 2.5 8.544 2.5 16c0 2.656.764 5.132 2.08 7.232L2.5 29.5l6.452-2.024A13.432 13.432 0 0 0 16 29.5c7.456 0 13.5-6.044 13.5-13.5S23.456 2.5 16 2.5zm0 24.688c-2.316 0-4.48-.688-6.292-1.872l-.452-.296-4.148 1.3 1.332-4.04-.324-.488A11.127 11.127 0 0 1 4.812 16c0-6.168 5.02-11.188 11.188-11.188S27.188 9.832 27.188 16 22.168 27.188 16 27.188zm6.544-8.796c-.36-.18-2.124-1.048-2.452-1.168-.328-.12-.568-.18-.808.18-.24.36-.928 1.168-1.136 1.408-.208.24-.416.272-.776.092-.36-.18-1.52-.56-2.896-1.788-1.072-.956-1.796-2.14-2.004-2.5-.208-.36-.024-.556.156-.736.164-.16.36-.416.54-.624.18-.208.24-.36.36-.6.12-.24.06-.452-.03-.632-.09-.18-.808-1.948-1.108-2.668-.292-.7-.588-.604-.808-.616l-.688-.012c-.24 0-.628.09-.956.452-.328.36-1.256 1.228-1.256 2.996s1.284 3.476 1.464 3.716c.18.24 2.528 3.86 6.124 5.412.856.368 1.524.588 2.044.756.86.272 1.644.232 2.264.14.692-.104 2.124-.868 2.424-1.708.3-.84.3-1.56.212-1.708-.088-.148-.328-.24-.688-.42z"/>
      </svg>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = withDefaults(
  defineProps<{
    enabled?: boolean;
    phone?: string;
    message?: string;
    tooltip?: string;
    showPulse?: boolean;
    position?: 'bottom-left' | 'bottom-right';
    bottom?: string;
  }>(),
  {
    enabled: false,
    phone: '',
    message: '',
    tooltip: '',
    showPulse: true,
    position: 'bottom-right',
    bottom: '24px'
  }
);

const showTooltip = ref(true);

const cleanPhone = computed(() => {
  return String(props.phone || '').replace(/[^0-9]/g, '');
});

const isActive = computed(() => {
  return Boolean(props.enabled && cleanPhone.value !== '');
});

const whatsappLink = computed(() => {
  if (!cleanPhone.value) return '#';
  const rawMsg = props.message || '';
  const msgParam = rawMsg.trim() ? `?text=${encodeURIComponent(rawMsg.trim())}` : '';
  return `https://wa.me/${cleanPhone.value}${msgParam}`;
});

const openWhatsApp = () => {
  if (typeof window !== 'undefined' && whatsappLink.value !== '#') {
    window.open(whatsappLink.value, '_blank', 'noopener,noreferrer');
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

.floating-whatsapp {
  display: flex;
  align-items: center;
  gap: 12px;
}

.floating-whatsapp.pos-right {
  flex-direction: row-reverse;
}

.floating-whatsapp.pos-left {
  flex-direction: row;
}

.whatsapp-btn {
  width: var(--fw-size, 54px);
  height: var(--fw-size, 54px);
  border-radius: 50%;
  background-color: #25D366;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s ease;
  box-shadow: 0 4px 18px rgba(37, 211, 102, 0.45);
}

.whatsapp-btn:hover {
  transform: scale(1.08);
  color: #ffffff;
  box-shadow: 0 6px 22px rgba(37, 211, 102, 0.6);
}

.whatsapp-icon {
  width: var(--fw-icon, 28px);
  height: var(--fw-icon, 28px);
}

.with-pulse .whatsapp-btn {
  animation: pulse-wa 2.2s infinite;
}

@keyframes pulse-wa {
  0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
  70% { box-shadow: 0 0 0 16px rgba(37, 211, 102, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
}

.whatsapp-tooltip {
  background: #ffffff;
  color: #1e293b;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.08);
  white-space: nowrap;
  animation: tooltip-slide 0.35s ease-out;
}

.whatsapp-tooltip:hover {
  background: #f8fafc;
}

.tooltip-close {
  background: none;
  border: none;
  font-size: 1.1rem;
  line-height: 1;
  color: #94a3b8;
  cursor: pointer;
}

.tooltip-close:hover {
  color: #e31140;
}

@keyframes tooltip-slide {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 576px) {
  .whatsapp-tooltip {
    display: none;
  }
}
</style>

<template>
  <transition name="chat-window-anim">
    <div v-if="isOpen" class="chatbot-dialog shadow-2xl">
      <!-- Cabecera del Chat con Identidad Institucional ESAN -->
      <div class="chatbot-header d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2">
          <div class="chat-avatar position-relative">
            <div class="avatar-circle">
              <i class="las la-robot fs-20 text-white"></i>
            </div>
            <span class="online-dot"></span>
          </div>
          <div>
            <h6 class="mb-0 fw-bold fs-14 text-white">Asistente ESAN</h6>
            <small class="text-white-50 fs-11">Orientación y Admisión 24/7</small>
          </div>
        </div>

        <div class="chat-header-actions d-flex align-items-center">
          <button
            type="button"
            class="chat-btn-header"
            @click="$emit('close')"
            title="Cerrar chat"
            aria-label="Cerrar chat"
          >
            <i class="las la-times fs-18"></i>
          </button>
        </div>
      </div>

      <!-- CUERPO DE CONVERSACIÓN / CHAT CONTINUO -->
      <ChatbotMessages
        ref="messagesView"
        :messages="messages"
        :is-typing="isTyping"
        :suggestions="suggestions"
        @select-suggestion="onSuggestionSelected"
        @navigate-page="$emit('navigate-page', $event)"
      />

      <!-- Barra de Entrada y Envío -->
      <form
        class="chatbot-footer d-flex align-items-center gap-2"
        @submit.prevent="onFormSubmit"
      >
        <input
          v-model="internalQuery"
          type="text"
          class="chat-input"
          :placeholder="placeholder || 'Escribe tu consulta o pide una página...'"
          :disabled="isTyping"
          ref="inputField"
        />
        <button
          type="submit"
          class="chat-send-btn"
          :disabled="!internalQuery.trim() || isTyping"
          title="Enviar mensaje"
          aria-label="Enviar mensaje"
        >
          <i class="las la-paper-plane fs-18"></i>
        </button>
      </form>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import ChatbotMessages from './ChatbotMessages.vue';
import type { ChatMessageItem } from '../../../composables/useChatbot';

const props = defineProps<{
  isOpen: boolean;
  messages: ChatMessageItem[];
  isTyping: boolean;
  suggestions: string[];
  placeholder?: string;
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update:modelValue', val: string): void;
  (e: 'send-message', query?: string): void;
  (e: 'navigate-page', url: string): void;
}>();

const internalQuery = ref(props.modelValue || '');
const inputField = ref<HTMLInputElement | null>(null);
const messagesView = ref<InstanceType<typeof ChatbotMessages> | null>(null);

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined && val !== internalQuery.value) {
      internalQuery.value = val;
    }
  }
);

watch(internalQuery, (val) => {
  emit('update:modelValue', val);
});

const scrollToBottom = async () => {
  await nextTick();
  const el = messagesView.value?.containerRef;
  if (el) {
    el.scrollTop = el.scrollHeight;
  }
};

watch(
  () => props.messages.length,
  () => {
    scrollToBottom();
  }
);

watch(
  () => props.isTyping,
  () => {
    scrollToBottom();
  }
);

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      scrollToBottom();
      nextTick(() => {
        inputField.value?.focus();
      });
    }
  }
);

const onFormSubmit = () => {
  const q = internalQuery.value.trim();
  if (!q || props.isTyping) return;
  emit('send-message', q);
  internalQuery.value = '';
};

const onSuggestionSelected = (suggestionText: string) => {
  emit('send-message', suggestionText);
};
</script>

<style scoped>
.chatbot-dialog {
  position: absolute;
  bottom: calc(100% + 14px);
  right: 0;
  width: 400px;
  max-width: calc(100vw - 32px);
  height: 570px;
  max-height: calc(100vh - 120px);
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 16px 40px -8px rgba(15, 23, 42, 0.28), 0 0 1px 1px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1050;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.chatbot-header {
  background: linear-gradient(135deg, #a61c1c 0%, #7d1212 100%);
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
}

.chat-avatar {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-circle {
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.online-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: #10b981;
  border: 2px solid #a61c1c;
  border-radius: 50%;
}

.chat-btn-header {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-btn-header:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.chatbot-footer {
  padding: 12px 14px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13.5px;
  color: #1e293b;
  outline: none;
  transition: all 0.2s ease;
}

.chat-input:focus {
  border-color: #a61c1c;
  box-shadow: 0 0 0 3px rgba(166, 28, 28, 0.12);
}

.chat-input::placeholder {
  color: #94a3b8;
  font-size: 12.5px;
}

.chat-send-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: none;
  background: #a61c1c;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.chat-send-btn:hover:not(:disabled) {
  background: #8b1414;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(166, 28, 28, 0.3);
}

.chat-send-btn:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

/* Animaciones */
.chat-window-anim-enter-active,
.chat-window-anim-leave-active {
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.chat-window-anim-enter-from,
.chat-window-anim-leave-to {
  opacity: 0;
  transform: translateY(18px) scale(0.96);
}

@media (max-width: 576px) {
  .chatbot-dialog {
    position: fixed;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    height: 100dvh !important;
    max-height: 100dvh !important;
    border-radius: 0 !important;
  }
}
</style>

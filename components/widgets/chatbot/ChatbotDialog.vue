<template>
  <transition name="chat-window-anim">
    <div v-if="isOpen" class="chatbot-dialog shadow-2xl">
      <!-- Cabecera del Chat con Identidad ESAN -->
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

        <div class="chat-header-actions d-flex align-items-center gap-1">
          <!-- Botón para alternar formulario de información / leads -->
          <button
            type="button"
            class="chat-btn-mode"
            :class="{ 'btn-mode-active': showLeadForm }"
            @click="$emit('update:showLeadForm', !showLeadForm)"
            :title="showLeadForm ? 'Volver a la conversación' : 'Dejar datos para recibir información'"
          >
            <i :class="showLeadForm ? 'las la-comments' : 'las la-envelope'"></i>
            <span class="fs-11 fw-semibold">{{ showLeadForm ? 'Chat' : 'Recibir Info' }}</span>
          </button>

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

      <!-- MODO 1: CUERPO DE CONVERSACIÓN / CHAT -->
      <ChatbotMessages
        v-if="!showLeadForm"
        ref="messagesView"
        :messages="messages"
        :is-typing="isTyping"
        :suggestions="suggestions"
        @select-suggestion="onSuggestionSelected"
        @navigate-page="$emit('navigate-page', $event)"
      />

      <!-- MODO 2: FORMULARIO DE CAPTURA DE LEADS -->
      <ChatbotLeadForm
        v-else
        :lead-form="leadForm"
        :is-submitting="isSubmittingLead"
        :error="leadError"
        @submit="$emit('submit-lead')"
        @back-to-chat="$emit('update:showLeadForm', false)"
      />

      <!-- Barra de Entrada y Envío (Solo en modo Chat) -->
      <form
        v-if="!showLeadForm"
        class="chatbot-footer d-flex align-items-center gap-2"
        @submit.prevent="onFormSubmit"
      >
        <input
          v-model="internalQuery"
          type="text"
          class="chat-input"
          placeholder="Escribe tu consulta o pide una página..."
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
import ChatbotLeadForm from './ChatbotLeadForm.vue';
import type { ChatMessageItem, LeadFormData } from '../../../composables/useChatbot';

const props = defineProps<{
  isOpen: boolean;
  showLeadForm: boolean;
  messages: ChatMessageItem[];
  isTyping: boolean;
  suggestions: string[];
  leadForm: LeadFormData;
  isSubmittingLead: boolean;
  leadError?: string;
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update:showLeadForm', val: boolean): void;
  (e: 'update:modelValue', val: string): void;
  (e: 'send-message', query?: string): void;
  (e: 'submit-lead'): void;
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
  (open) => {
    if (open) {
      scrollToBottom();
      nextTick(() => {
        inputField.value?.focus();
      });
    }
  }
);

const onFormSubmit = () => {
  if (!internalQuery.value.trim() || props.isTyping) return;
  emit('send-message', internalQuery.value.trim());
};

const onSuggestionSelected = (sug: string) => {
  if (sug.toLowerCase().includes('recibir información') || sug.toLowerCase().includes('formulario de contacto')) {
    emit('update:showLeadForm', true);
    return;
  }
  emit('send-message', sug);
};

defineExpose({
  scrollToBottom
});
</script>

<style scoped>
.chatbot-dialog {
  width: 370px;
  height: 520px;
  background: #ffffff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.chatbot-header {
  background: linear-gradient(135deg, #e31140 0%, #c20b32 100%);
  padding: 12px 14px;
}

.avatar-circle {
  width: 34px;
  height: 34px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.online-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 9px;
  height: 9px;
  background: #10b981;
  border-radius: 50%;
  border: 1.5px solid #e31140;
}

.chat-btn-mode {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #ffffff;
  padding: 3px 8px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.chat-btn-mode:hover {
  background: rgba(255, 255, 255, 0.32);
}

.chat-btn-mode.btn-mode-active {
  background: #ffffff;
  color: #e31140;
  border-color: #ffffff;
}

.chat-btn-header {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 4px;
}

.chat-btn-header:hover {
  color: #ffffff;
}

.chatbot-footer {
  padding: 10px 14px;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
}

.chat-input {
  flex: 1;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  padding: 8px 14px;
  font-size: 0.82rem;
  outline: none;
}

.chat-input:focus {
  border-color: #e31140;
}

.chat-send-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e31140;
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.chat-send-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.chat-send-btn:not(:disabled):hover {
  background: #c20b32;
}

.chat-window-anim-enter-active,
.chat-window-anim-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.chat-window-anim-enter-from,
.chat-window-anim-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

@media (max-width: 576px) {
  .chatbot-dialog {
    width: calc(100vw - 32px);
    height: 75vh;
  }
}
</style>

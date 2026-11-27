<template>
  <div class="chatbot-body custom-scroll" ref="containerRef">
    <!-- Mensajes Históricos -->
    <div
      v-for="(msg, idx) in messages"
      :key="idx"
      class="chat-bubble-row"
      :class="msg.role === 'user' ? 'row-user' : 'row-bot'"
    >
      <div class="chat-bubble" :class="msg.role === 'user' ? 'bubble-user' : 'bubble-bot'">
        <div
          class="bubble-text"
          v-html="formatMessage(msg.content)"
          @click="onBubbleContentClick"
        ></div>
      </div>
    </div>

    <!-- Indicador de 'Escribiendo...' -->
    <div v-if="isTyping" class="chat-bubble-row row-bot">
      <div class="chat-bubble bubble-bot typing-bubble">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>

    <!-- Únicamente botones previos contextuales compactos (máx. 3), sin tarjetas ni listas abrumadoras -->
    <div v-if="visibleContextButtons.length > 0 && !isTyping" class="chat-suggestions-area mt-1">
      <span class="small text-muted d-block mb-1 fs-11">
        <i class="las la-tags text-danger"></i> Sugerido en esta página:
      </span>
      <div class="d-flex flex-wrap gap-1">
        <button
          v-for="(btn, bIdx) in visibleContextButtons"
          :key="`ctx-${bIdx}`"
          type="button"
          class="suggestion-chip suggestion-chip--context"
          @click="$emit('select-suggestion', btn.label)"
        >
          {{ btn.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  formatMessage,
  type ChatMessageItem,
  type ContextQuickButton
} from '../../../composables/useChatbot';

const props = defineProps<{
  messages: ChatMessageItem[];
  isTyping: boolean;
  suggestions: string[];
  contextButtons?: ContextQuickButton[];
}>();

const visibleContextButtons = computed(() => {
  return Array.isArray(props.contextButtons) ? props.contextButtons.slice(0, 3) : [];
});

const emit = defineEmits<{
  (e: 'select-suggestion', sug: string): void;
  (e: 'navigate-page', url: string): void;
}>();

const containerRef = ref<HTMLElement | null>(null);

/**
 * Intercepta clics en enlaces HTML dentro del texto de los mensajes.
 * Si es un enlace SPA interno, previene la recarga del navegador y emite navigate-page.
 */
const onBubbleContentClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement | null;
  if (!target) return;

  const anchor = target.closest('a');
  if (!anchor) return;

  const isSpa =
    anchor.dataset.spaLink === 'true' ||
    anchor.classList.contains('chat-spa-link');
  const href = anchor.getAttribute('href');

  if (isSpa && href) {
    event.preventDefault();
    emit('navigate-page', href);
  }
};

defineExpose({
  containerRef
});
</script>

<style scoped>
.chatbot-body {
  flex: 1 1 auto;
  min-height: 0;
  position: relative;
  padding: 14px;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-bubble-row {
  display: flex;
  width: 100%;
}

.row-user {
  justify-content: flex-end;
}

.row-bot {
  justify-content: flex-start;
}

.chat-bubble {
  max-width: 92%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 0.83rem;
  line-height: 1.48;
}

.bubble-user {
  background: #e31140;
  color: #ffffff;
  border-bottom-right-radius: 2px;
}

.bubble-bot {
  background: #ffffff;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 2px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

:deep(.chat-bullet-item) {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 5px;
  line-height: 1.42;
}

:deep(.chat-bullet-dot) {
  color: #e31140;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: -1px;
}

:deep(.chat-paragraph-gap) {
  height: 7px;
}

:deep(.chat-inline-code) {
  background: #f1f5f9;
  color: #0f172a;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.78rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

:deep(.chat-inline-link) {
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  transition: all 0.18s ease;
}

:deep(.chat-spa-link) {
  color: #c52b27;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(197, 43, 39, 0.08);
  text-decoration: none;
  border-bottom: 1.5px solid #c52b27;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin: 1px 2px;
  font-size: 0.82rem;
}

:deep(.chat-spa-link:hover) {
  background: rgba(197, 43, 39, 0.16);
  color: #991b1b;
  transform: translateX(1px);
}

:deep(.chat-external-link) {
  color: #0284c7;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.bubble-user :deep(.chat-inline-link) {
  color: #ffffff;
  text-decoration: underline;
}

/* TYPING DOTS */
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
}

.typing-bubble .dot {
  width: 6px;
  height: 6px;
  background: #94a3b8;
  border-radius: 50%;
  animation: typing-bounce 1.4s infinite ease-in-out both;
}

.typing-bubble .dot:nth-child(1) { animation-delay: -0.32s; }
.typing-bubble .dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing-bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* SUGERENCIAS CON ROJO ESAN */
.suggestion-chip {
  background: #ffffff;
  border: 1px solid #fecdd3;
  color: #e31140;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: normal;
  text-align: left;
  line-height: 1.3;
  max-width: 100%;
  word-break: break-word;
}

.suggestion-chip--context {
  background: #fff1f2;
  border-color: #fda4af;
  color: #be123c;
}

.suggestion-chip:hover {
  background: #fff1f2;
  border-color: #fda4af;
}

@media (max-width: 640px) {
  .chatbot-body {
    padding: 12px;
  }

  .chat-bubble {
    max-width: 90%;
    font-size: 0.86rem;
  }

  .suggestion-chip {
    font-size: 0.76rem;
    padding: 7px 11px;
  }
}

.custom-scroll::-webkit-scrollbar {
  width: 4px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #fca5a5;
  border-radius: 4px;
}
</style>

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
        <div class="bubble-text" v-html="formatMessage(msg.content)"></div>

        <!-- Tarjetas de Páginas Sugeridas / Encontradas en el Portal -->
        <div v-if="msg.suggestedPages && msg.suggestedPages.length > 0" class="suggested-pages-box mt-2">
          <span class="suggested-pages-title">
            <i class="las la-compass"></i> Páginas recomendadas de ESAN:
          </span>
          <div class="suggested-pages-list">
            <a
              v-for="(page, pIdx) in msg.suggestedPages"
              :key="pIdx"
              :href="page.url"
              class="page-suggestion-item"
              @click.prevent="$emit('navigate-page', page.url)"
            >
              <div class="page-item-icon">
                <i :class="page.icon || 'las la-file-alt'"></i>
              </div>
              <div class="page-item-content">
                <span class="page-item-title">{{ page.title }}</span>
                <small v-if="page.description" class="page-item-desc">{{ page.description }}</small>
              </div>
              <i class="las la-arrow-right page-item-arrow"></i>
            </a>
          </div>
        </div>
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

    <!-- Chips de Sugerencias Rápidas -->
    <div v-if="suggestions.length > 0 && !isTyping" class="chat-suggestions-area mt-2">
      <span class="small text-muted d-block mb-1 fs-11">Preguntas y acciones sugeridas:</span>
      <div class="d-flex flex-wrap gap-1">
        <button
          v-for="(sug, sIdx) in suggestions"
          :key="sIdx"
          type="button"
          class="suggestion-chip"
          @click="$emit('select-suggestion', sug)"
        >
          {{ sug }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formatMessage, type ChatMessageItem } from '../../../composables/useChatbot';

defineProps<{
  messages: ChatMessageItem[];
  isTyping: boolean;
  suggestions: string[];
}>();

defineEmits<{
  (e: 'select-suggestion', sug: string): void;
  (e: 'navigate-page', url: string): void;
}>();

const containerRef = ref<HTMLElement | null>(null);

defineExpose({
  containerRef
});
</script>

<style scoped>
.chatbot-body {
  flex: 1;
  padding: 14px;
  overflow-y: auto;
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
  max-width: 86%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 0.82rem;
  line-height: 1.45;
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

:deep(.chat-inline-link) {
  color: #e31140;
  font-weight: 600;
  text-decoration: underline;
}

.bubble-user :deep(.chat-inline-link) {
  color: #ffffff;
  text-decoration: underline;
}

/* TARJETAS DE PÁGINAS SUGERIDAS (CATÁLOGO DE RUTAS ESAN) */
.suggested-pages-box {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #fecdd3;
}

.suggested-pages-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: #e31140;
  margin-bottom: 6px;
  display: block;
}

.suggested-pages-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.page-suggestion-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #ffffff;
  border: 1px solid #fecdd3;
  border-left: 3px solid #e31140;
  border-radius: 8px;
  color: #1e293b;
  text-decoration: none;
  transition: all 0.2s ease;
}

.page-suggestion-item:hover {
  background: #fff1f2;
  border-color: #fda4af;
  transform: translateX(2px);
  color: #1e293b;
}

.page-item-icon {
  width: 26px;
  height: 26px;
  background: #fff1f2;
  color: #e31140;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.page-item-content {
  flex: 1;
  min-width: 0;
}

.page-item-title {
  font-size: 0.76rem;
  font-weight: 700;
  color: #0f172a;
  display: block;
  line-height: 1.2;
}

.page-item-desc {
  font-size: 0.68rem;
  color: #64748b;
  display: block;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-item-arrow {
  color: #e31140;
  font-size: 13px;
  flex-shrink: 0;
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
  padding: 5px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-chip:hover {
  background: #fff1f2;
  border-color: #fda4af;
}

.custom-scroll::-webkit-scrollbar {
  width: 4px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #fca5a5;
  border-radius: 4px;
}
</style>

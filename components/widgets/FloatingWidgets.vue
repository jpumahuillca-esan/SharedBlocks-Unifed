<template>
  <div class="floating-widgets-container" aria-live="polite">
    <!-- WIDGET 1: WHATSAPP FLOTANTE -->
    <FloatingWhatsApp
      v-if="isWhatsAppActive"
      :enabled="config?.whatsapp?.enabled"
      :phone="config?.whatsapp?.phone"
      :message="config?.whatsapp?.message"
      :tooltip="config?.whatsapp?.tooltip"
      :show-pulse="config?.whatsapp?.showPulse !== false"
      :position="config?.whatsapp?.position"
      :bottom="stackBottom.whatsapp"
    />

    <!-- WIDGET 2: BOTÓN VOLVER ARRIBA (SCROLL TO TOP) -->
    <FloatingScrollTop
      :visible="isScrollTopVisible"
      :position="config?.scrollTop?.position"
      :bottom="stackBottom.scrollTop"
      @click="scrollToTop"
    />

    <!-- WIDGET 3: CHATBOT FLOTANTE INTERACTIVO -->
    <div
      v-if="isChatbotActive"
      class="floating-widget floating-chatbot-wrapper"
      :class="chatbotPositionClass"
      :style="{ bottom: stackBottom.chatbot }"
    >
      <!-- Botón Gatillo del Chatbot -->
      <ChatbotTrigger
        :is-open="isChatOpen"
        @toggle="isChatOpen = true"
      />

      <!-- Ventana de Diálogo Flotante del Chatbot -->
      <ChatbotDialog
        :is-open="isChatOpen"
        v-model:show-lead-form="showLeadForm"
        v-model="inputQuery"
        :messages="chatMessages"
        :is-typing="isTyping"
        :suggestions="suggestions"
        :lead-form="leadForm"
        :is-submitting-lead="isSubmittingLead"
        :lead-error="leadError"
        @close="isChatOpen = false"
        @send-message="handleSendMessage"
        @submit-lead="handleSubmitLead"
        @navigate-page="navigateToPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import FloatingWhatsApp from './FloatingWhatsApp.vue';
import FloatingScrollTop from './FloatingScrollTop.vue';
import ChatbotTrigger from './chatbot/ChatbotTrigger.vue';
import ChatbotDialog from './chatbot/ChatbotDialog.vue';
import { useChatbot } from '../../composables/useChatbot';

const props = withDefaults(
  defineProps<{
    config?: Record<string, any> | null;
    academicUnitId?: number | string;
    chatbotApiUrl?: string;
    leadEndpoint?: string;
  }>(),
  {
    config: null,
    academicUnitId: 1,
    chatbotApiUrl: '',
    leadEndpoint: '/api/leads'
  }
);

const {
  isChatOpen,
  isTyping,
  inputQuery,
  showLeadForm,
  isSubmittingLead,
  leadError,
  leadForm,
  chatMessages,
  suggestions,
  sendMessage,
  submitLead
} = useChatbot();

const isScrolled = ref(false);

const isWhatsAppActive = computed(() => {
  const wa = props.config?.whatsapp;
  const clean = String(wa?.phone || '').replace(/[^0-9]/g, '');
  return Boolean(wa?.enabled && clean !== '');
});

const isScrollTopActive = computed(() => {
  return props.config?.scrollTop?.enabled !== false;
});

const isChatbotActive = computed(() => {
  return Boolean(props.config?.chatbot?.enabled);
});

const chatbotPositionClass = computed(() => {
  return props.config?.chatbot?.position === 'bottom-left' ? 'pos-left' : 'pos-right';
});

type WidgetKey = 'whatsapp' | 'chatbot' | 'scrollTop';
type WidgetSide = 'left' | 'right';

const STACK_ORDER: WidgetKey[] = ['whatsapp', 'chatbot', 'scrollTop'];

const sideOf = (key: WidgetKey): WidgetSide => {
  return props.config?.[key]?.position === 'bottom-left' ? 'left' : 'right';
};

const isScrollTopVisible = computed(() => {
  return (
    isScrollTopActive.value &&
    isScrolled.value &&
    !(isChatbotActive.value && isChatOpen.value && sideOf('chatbot') === sideOf('scrollTop'))
  );
});

const stackBottom = computed(() => {
  const visible: Record<WidgetKey, boolean> = {
    whatsapp: isWhatsAppActive.value,
    chatbot: isChatbotActive.value,
    scrollTop: isScrollTopVisible.value
  };

  const apilados: Record<WidgetSide, number> = { left: 0, right: 0 };
  const bottom = {} as Record<WidgetKey, string>;

  for (const key of STACK_ORDER) {
    const side = sideOf(key);
    bottom[key] = `calc(var(--fw-base) + ${apilados[side]} * (var(--fw-size) + var(--fw-gap)))`;
    if (visible[key]) apilados[side] += 1;
  }

  return bottom;
});

const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const navigateToPage = (url: string) => {
  if (typeof window === 'undefined' || !url) return;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    window.location.href = cleanUrl;
  }
};

const handleScroll = () => {
  if (typeof window !== 'undefined') {
    isScrolled.value = window.scrollY > 300;
  }
};

const resolvedChatbotApiUrl = computed(() => {
  if (props.chatbotApiUrl) return props.chatbotApiUrl;
  if (typeof window !== 'undefined') {
    const nuxtConfigUrl = (window as any)?.__NUXT__?.config?.public?.chatbotApiUrl;
    if (nuxtConfigUrl) return nuxtConfigUrl;
  }
  return 'http://127.0.0.1:5000/api/v1/chat';
});

const handleSendMessage = (query?: string) => {
  if (query) {
    inputQuery.value = query;
  }
  sendMessage(resolvedChatbotApiUrl.value);
};

const handleSubmitLead = () => {
  submitLead({
    endpoint: props.leadEndpoint,
    academicUnitId: props.academicUnitId
  });
};

const injectChatbotScript = () => {
  if (typeof window === 'undefined') return;
  const cb = props.config?.chatbot;
  if (!cb?.enabled || !cb?.scriptEmbed) return;

  const scriptCode = cb.scriptEmbed.trim();
  if (scriptCode && !document.getElementById('esan-custom-chatbot-script')) {
    try {
      if (scriptCode.startsWith('<script') && scriptCode.endsWith('</' + 'script>')) {
        const div = document.createElement('div');
        div.innerHTML = scriptCode;
        const scriptEl = div.querySelector('script');
        if (scriptEl) {
          const newScript = document.createElement('script');
          newScript.id = 'esan-custom-chatbot-script';
          Array.from(scriptEl.attributes).forEach((attr) =>
            newScript.setAttribute(attr.name, attr.value)
          );
          newScript.innerHTML = scriptEl.innerHTML;
          document.body.appendChild(newScript);
        }
      } else if (scriptCode.startsWith('http')) {
        const scriptEl = document.createElement('script');
        scriptEl.id = 'esan-custom-chatbot-script';
        scriptEl.src = scriptCode;
        scriptEl.async = true;
        document.body.appendChild(scriptEl);
      }
    } catch (e) {
      console.warn('No se pudo inyectar el script del chatbot:', e);
    }
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    injectChatbotScript();
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
.floating-widgets-container {
  --fw-size: 54px;
  --fw-base: 24px;
  --fw-gap: 12px;
  --fw-edge: 22px;
  --fw-icon: 28px;
  --fw-icon-sm: 24px;

  position: fixed;
  z-index: 1045;
  pointer-events: none;
  inset: 0;
}

.floating-widget {
  position: fixed;
  pointer-events: auto;
  z-index: 1045;
}

.pos-right {
  right: var(--fw-edge);
}

.pos-left {
  left: var(--fw-edge);
}

.floating-chatbot-wrapper.pos-right {
  right: var(--fw-edge);
}

.floating-chatbot-wrapper.pos-left {
  left: var(--fw-edge);
}

@media (max-width: 576px) {
  .floating-widgets-container {
    --fw-size: 44px;
    --fw-base: 16px;
    --fw-gap: 10px;
    --fw-edge: 14px;
    --fw-icon: 22px;
    --fw-icon-sm: 20px;
  }
}
</style>

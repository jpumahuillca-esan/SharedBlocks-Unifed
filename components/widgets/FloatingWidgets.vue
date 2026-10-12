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
        v-model="inputQuery"
        :messages="chatMessages"
        :is-typing="isTyping"
        :suggestions="suggestions"
        :placeholder="inputPlaceholder"
        @close="isChatOpen = false"
        @send-message="handleSendMessage"
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
import { useChatbot, appendChatbotUtm } from '../../composables/useChatbot';

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
    leadEndpoint: ''
  }
);

const {
  isChatOpen,
  isTyping,
  inputQuery,
  inputPlaceholder,
  chatMessages,
  suggestions,
  sendMessage
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
  if (props.config?.chatbot?.enabled !== undefined) {
    return Boolean(props.config.chatbot.enabled);
  }
  return true;
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
  const cb = props.config?.chatbot;
  const trackedUrl = appendChatbotUtm(url, {
    source: cb?.utm_source || 'chatbot',
    medium: cb?.utm_medium || 'referral',
    campaign: cb?.utm_campaign || cb?.campaign_slug || 'esanbot'
  });

  if (trackedUrl.startsWith('http://') || trackedUrl.startsWith('https://')) {
    window.open(trackedUrl, '_blank', 'noopener,noreferrer');
  } else {
    const cleanUrl = trackedUrl.startsWith('/') ? trackedUrl : `/${trackedUrl}`;
    try {
      if (typeof navigateTo === 'function') {
        navigateTo(cleanUrl);
        return;
      }
    } catch {
      // Fallback a redirección estándar si navigateTo no está disponible
    }
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
  return 'http://127.0.0.1:5005/api/v1/chat';
});

const resolvedLaravelApiUrl = computed(() => {
  if (typeof window !== 'undefined') {
    const nuxtConfigUrl = (window as any)?.__NUXT__?.config?.public?.laravelApiUrl;
    if (nuxtConfigUrl) return nuxtConfigUrl;
  }
  return 'http://127.0.0.1:8000';
});

const handleSendMessage = (query?: string) => {
  if (query) {
    inputQuery.value = query;
  }
  const cb = props.config?.chatbot;
  const resolvedLeadEndpoint =
    props.leadEndpoint || `${resolvedLaravelApiUrl.value}/api/public/leads`;

  sendMessage(resolvedChatbotApiUrl.value, {
    endpoint: resolvedLeadEndpoint,
    academicUnitId: props.academicUnitId || 1,
    campaignSlug: cb?.campaign_slug || 'esanbot',
    utmSource: cb?.utm_source || 'chatbot',
    utmMedium: cb?.utm_medium || 'chat_conversacional',
    utmCampaign: cb?.utm_campaign || 'esanbot'
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

    // Capturar y persistir atribución UTM de campañas (ej: referidos del Chatbot)
    try {
      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get('utm_source');
      if (utmSource) {
        sessionStorage.setItem(
          'esan_marketing_utm',
          JSON.stringify({
            utm_source: utmSource,
            utm_medium: params.get('utm_medium') || 'referral',
            utm_campaign: params.get('utm_campaign') || 'esanbot',
            utm_term: params.get('utm_term') || '',
            utm_content: params.get('utm_content') || '',
            timestamp: Date.now()
          })
        );
      }
    } catch (_) {}
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

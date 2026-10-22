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
import { useRouter } from 'vue-router';
import FloatingWhatsApp from './FloatingWhatsApp.vue';
import FloatingScrollTop from './FloatingScrollTop.vue';
import ChatbotTrigger from './chatbot/ChatbotTrigger.vue';
import ChatbotDialog from './chatbot/ChatbotDialog.vue';
import { useChatbot, appendChatbotUtm } from '../../composables/useChatbot';
import { isInternalUrl, isDownloadableFile } from '../../helpers/chatbotUtm';

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

let router: any = null;
try {
  router = useRouter();
} catch (_) {}

const navigateToPage = (url: string) => {
  if (typeof window === 'undefined' || !url) return;
  const cb = props.config?.chatbot;
  const trackedUrl = appendChatbotUtm(url, {
    source: cb?.utm_source || 'chatbot',
    medium: cb?.utm_medium || 'referral',
    campaign: cb?.utm_campaign || cb?.campaign_slug || 'esanbot'
  });

  // 1. Si es un archivo descargable (PDF, DOC), abrirlo directamente en nueva pestaña
  if (isDownloadableFile(trackedUrl)) {
    window.open(trackedUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  // 2. Si es una URL externa (WhatsApp, redes, dominios terceros), abrir en nueva pestaña
  if (!isInternalUrl(trackedUrl)) {
    window.open(trackedUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  // 3. Si es ruta interna, extraer pathname limpio para el enrutador SPA
  let routePath = trackedUrl;
  try {
    const dummyOrigin = window.location.origin || 'https://esan.edu.pe';
    const parsed = new URL(trackedUrl, dummyOrigin);
    routePath = parsed.pathname + parsed.search + parsed.hash;
  } catch (_) {}

  const cleanUrl = routePath.startsWith('/') ? routePath : `/${routePath}`;

  // Intento A: Vue Router push (transición SPA fluida in-place en Nuxt 3 y Vue 3)
  if (router && typeof router.push === 'function') {
    try {
      router.push(cleanUrl);
      return;
    } catch (_) {}
  }

  // Intento B: Nuxt 3 navigateTo
  try {
    if (typeof (navigateTo as any) === 'function') {
      (navigateTo as any)(cleanUrl);
      return;
    }
  } catch (_) {}

  // Intento C: Fallback solo si ningún router SPA está disponible
  window.location.href = cleanUrl;
};

const handleScroll = () => {
  if (typeof window !== 'undefined') {
    isScrolled.value = window.scrollY > 300;
  }
};

const resolvedChatbotApiUrl = computed(() => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // Si el usuario navega desde localhost / 127.0.0.1
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://127.0.0.1:5005/api/v1/chat';
    }
    // Si navega desde la IP de red local (ej: 172.59.1.134), apuntar al mismo host en el puerto 5005
    if (host) {
      return `http://${host}:5005/api/v1/chat`;
    }
  }
  if (props.chatbotApiUrl) return props.chatbotApiUrl;
  return 'http://127.0.0.1:5005/api/v1/chat';
});

const resolvedLaravelApiUrl = computed(() => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://127.0.0.1:8000';
    }
    if (host) {
      return `http://${host}:8000`;
    }
  }
  return 'http://127.0.0.1:8000';
});

const handleSendMessage = (query?: string) => {
  const queryToSend = (query || inputQuery.value || '').trim();
  if (!queryToSend) return;

  const cb = props.config?.chatbot;
  const resolvedLeadEndpoint =
    props.leadEndpoint || `${resolvedLaravelApiUrl.value}/api/public/leads`;

  sendMessage(
    resolvedChatbotApiUrl.value,
    {
      endpoint: resolvedLeadEndpoint,
      academicUnitId: props.academicUnitId || 1,
      campaignSlug: cb?.campaign_slug || 'esanbot',
      utmSource: cb?.utm_source || 'chatbot',
      utmMedium: cb?.utm_medium || 'chat_conversacional',
      utmCampaign: cb?.utm_campaign || 'esanbot'
    },
    queryToSend
  );
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

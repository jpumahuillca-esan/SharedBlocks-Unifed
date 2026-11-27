<template>
  <div class="floating-widgets-container" :class="{ 'is-chat-open': isChatOpen }" aria-live="polite">
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
      :position="scrollTopPosition"
      :bottom="stackBottom.scrollTop"
      @click="scrollToTop"
    />

    <!-- WIDGET 3: ACCESO DIRECTO AL FORMULARIO (SOLO CUANDO SALE DE VISTA) -->
    <FloatingFormScroll
      :visible="isFormScrollVisible"
      :position="formScrollPosition"
      :bottom="stackBottom.formScroll"
      @click="scrollToLeadForm"
    />

    <!-- WIDGET 4: CHATBOT FLOTANTE INTERACTIVO -->
    <div
      v-if="isChatbotActive"
      class="floating-widget floating-chatbot-wrapper"
      :class="[chatbotPositionClass, { 'is-chat-open': isChatOpen }]"
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
        :context-buttons="contextButtons"
        :position="config?.chatbot?.position"
        :placeholder="inputPlaceholder"
        @close="isChatOpen = false"
        @reset-chat="clearConversation"
        @send-message="handleSendMessage"
        @navigate-page="navigateToPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FloatingWhatsApp from './FloatingWhatsApp.vue';
import FloatingScrollTop from './FloatingScrollTop.vue';
import FloatingFormScroll from './FloatingFormScroll.vue';
import ChatbotTrigger from './chatbot/ChatbotTrigger.vue';
import ChatbotDialog from './chatbot/ChatbotDialog.vue';
import {
  useChatbot,
  appendChatbotUtm,
  type ChatbotPageContext
} from '../../composables/useChatbot';
import { isInternalUrl, isDownloadableFile } from '../../helpers/chatbotUtm';

const props = withDefaults(
  defineProps<{
    config?: Record<string, any> | null;
    academicUnitId?: number | string;
    chatbotApiUrl?: string;
    leadEndpoint?: string;
    pageContext?: ChatbotPageContext | null;
  }>(),
  {
    config: null,
    academicUnitId: 1,
    chatbotApiUrl: '',
    leadEndpoint: '',
    pageContext: null
  }
);

const {
  isChatOpen,
  isTyping,
  inputQuery,
  inputPlaceholder,
  chatMessages,
  suggestions,
  contextButtons,
  hydrateStorage,
  clearConversation,
  loadContextSuggestions,
  sendMessage
} = useChatbot();

const isScrolled = ref(false);
const isTabletOrMobile = ref(false);
const hasTargetForm = ref(false);
const isFormOutOfView = ref(false);
let observedFormEl: HTMLElement | null = null;
let formIntersectionObserver: IntersectionObserver | null = null;
let formDomObserver: MutationObserver | null = null;
let formSyncRaf: number | null = null;
let viewportMediaQuery: MediaQueryList | null = null;

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

type WidgetKey = 'whatsapp' | 'chatbot' | 'formScroll' | 'scrollTop';
type WidgetSide = 'left' | 'right';

const STACK_ORDER: WidgetKey[] = ['whatsapp', 'chatbot', 'formScroll', 'scrollTop'];

const scrollTopPosition = computed<'bottom-left' | 'bottom-right'>(() => {
  return props.config?.scrollTop?.position === 'bottom-right' ? 'bottom-right' : 'bottom-left';
});

const formScrollPosition = computed<'bottom-left' | 'bottom-right'>(() => {
  return props.config?.chatbot?.position === 'bottom-left' ? 'bottom-left' : 'bottom-right';
});

const sideOf = (key: WidgetKey): WidgetSide => {
  if (key === 'scrollTop') {
    return scrollTopPosition.value === 'bottom-right' ? 'right' : 'left';
  }
  if (key === 'formScroll') {
    return formScrollPosition.value === 'bottom-left' ? 'left' : 'right';
  }
  return props.config?.[key]?.position === 'bottom-left' ? 'left' : 'right';
};

const isScrollTopVisible = computed(() => {
  return (
    isScrollTopActive.value &&
    isScrolled.value &&
    !(isChatbotActive.value && isChatOpen.value && sideOf('chatbot') === sideOf('scrollTop'))
  );
});

const isFormScrollVisible = computed(() => {
  return (
    isTabletOrMobile.value &&
    hasTargetForm.value &&
    isFormOutOfView.value &&
    !(isChatbotActive.value && isChatOpen.value && sideOf('chatbot') === sideOf('formScroll'))
  );
});

const stackBottom = computed(() => {
  const visible: Record<WidgetKey, boolean> = {
    whatsapp: isWhatsAppActive.value,
    chatbot: isChatbotActive.value,
    formScroll: isFormScrollVisible.value,
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

const findTargetLeadForm = (): HTMLElement | null => {
  if (typeof document === 'undefined') return null;

  const isEligibleForm = (el: Element | null): el is HTMLElement => {
    if (!(el instanceof HTMLElement)) return false;
    if (el.dataset.leadFormRedirect === 'false') return false;
    if (el.closest('[aria-hidden="true"]')) return false;
    return true;
  };

  // 1. Priorizar el formulario asociado al alias explícito #contacto
  const contactoEl = document.getElementById('contacto');
  if (contactoEl) {
    const contactoCandidates = [
      contactoEl.closest('.lead-form'),
      contactoEl.parentElement?.querySelector('.lead-form') ?? null,
      contactoEl.nextElementSibling?.matches('.lead-form')
        ? contactoEl.nextElementSibling
        : contactoEl.nextElementSibling?.querySelector('.lead-form') ?? null,
    ];
    for (const candidate of contactoCandidates) {
      if (isEligibleForm(candidate)) return candidate;
    }
  }

  // 2. Respaldo automático: cualquier HeroLeadForm habilitado dentro de la página
  const root = document.querySelector('.page-content') || document;
  const forms = Array.from(root.querySelectorAll('.lead-form'));
  return forms.find((el) => isEligibleForm(el)) || null;
};

const cleanupFormObserver = () => {
  if (formIntersectionObserver) {
    formIntersectionObserver.disconnect();
    formIntersectionObserver = null;
  }
  observedFormEl = null;
};

const syncTargetLeadForm = () => {
  if (typeof window === 'undefined') return;

  const target = findTargetLeadForm();
  if (!target) {
    cleanupFormObserver();
    hasTargetForm.value = false;
    isFormOutOfView.value = false;
    return;
  }

  hasTargetForm.value = true;
  if (observedFormEl === target && formIntersectionObserver) return;

  cleanupFormObserver();
  observedFormEl = target;

  if (typeof IntersectionObserver !== 'function') {
    isFormOutOfView.value = window.scrollY > 300;
    return;
  }

  formIntersectionObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;
      isFormOutOfView.value = !entry.isIntersecting;
    },
    { threshold: 0 },
  );
  formIntersectionObserver.observe(target);
};

const scheduleSyncTargetLeadForm = () => {
  if (typeof window === 'undefined') return;
  if (formSyncRaf !== null) cancelAnimationFrame(formSyncRaf);
  formSyncRaf = requestAnimationFrame(() => {
    formSyncRaf = null;
    syncTargetLeadForm();
  });
};

const syncViewportBreakpoint = () => {
  if (typeof window === 'undefined') return;
  isTabletOrMobile.value = viewportMediaQuery
    ? viewportMediaQuery.matches
    : window.innerWidth < 1280;
};

const scrollToLeadForm = () => {
  if (typeof window === 'undefined') return;
  const target = findTargetLeadForm();
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const topOffset = 108;
  const destinationY = Math.max(0, Math.round(window.scrollY + rect.top - topOffset));
  window.scrollTo({ top: destinationY, behavior: 'smooth' });
};

const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

let route: any = null;
let router: any = null;
try {
  route = useRoute();
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

  // En pantalla completa móvil minimizamos el cajón al navegar para mostrar la página destino (el historial sigue vivo)
  if (window.innerWidth <= 640) {
    isChatOpen.value = false;
  }

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
  if (props.chatbotApiUrl && props.chatbotApiUrl.trim()) {
    return props.chatbotApiUrl.trim();
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://127.0.0.1:5005/api/v1/chat';
    }
    if (host) {
      return `http://${host}:5005/api/v1/chat`;
    }
  }
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

const syncMobileScrollLock = () => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const shouldLock = isChatOpen.value && window.innerWidth <= 640;
  if (shouldLock) {
    document.body.dataset.esanChatScrollLocked = '1';
    document.body.style.overflow = 'hidden';
  } else if (document.body.dataset.esanChatScrollLocked === '1') {
    delete document.body.dataset.esanChatScrollLocked;
    document.body.style.overflow = '';
  }
};

watch(isChatOpen, () => {
  syncMobileScrollLock();
});

watch(
  [() => props.pageContext, resolvedChatbotApiUrl],
  () => {
    if (typeof window !== 'undefined' && isChatbotActive.value) {
      loadContextSuggestions(resolvedChatbotApiUrl.value, props.pageContext);
    }
  },
  { deep: true }
);

onMounted(() => {
  if (typeof window !== 'undefined') {
    hydrateStorage();
    syncMobileScrollLock();
    if (isChatbotActive.value) {
      loadContextSuggestions(resolvedChatbotApiUrl.value, props.pageContext);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', syncMobileScrollLock, { passive: true });
    window.addEventListener('resize', syncViewportBreakpoint, { passive: true });
    if (typeof window.matchMedia === 'function') {
      viewportMediaQuery = window.matchMedia('(max-width: 1279.98px)');
      viewportMediaQuery.addEventListener?.('change', syncViewportBreakpoint);
    }
    syncViewportBreakpoint();
    handleScroll();
    injectChatbotScript();

    // Sincronizar detección de formulario en pantalla (#contacto / .lead-form)
    nextTick().then(syncTargetLeadForm);
    if (typeof MutationObserver === 'function') {
      const domRoot = document.querySelector('.page-content') || document.body;
      formDomObserver = new MutationObserver(scheduleSyncTargetLeadForm);
      formDomObserver.observe(domRoot, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-lead-form-redirect', 'id'],
      });
    }

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
    window.removeEventListener('resize', syncMobileScrollLock);
    window.removeEventListener('resize', syncViewportBreakpoint);
    viewportMediaQuery?.removeEventListener?.('change', syncViewportBreakpoint);
    viewportMediaQuery = null;
    cleanupFormObserver();
    if (formDomObserver) {
      formDomObserver.disconnect();
      formDomObserver = null;
    }
    if (formSyncRaf !== null) {
      cancelAnimationFrame(formSyncRaf);
      formSyncRaf = null;
    }
    if (typeof document !== 'undefined' && document.body.dataset.esanChatScrollLocked === '1') {
      delete document.body.dataset.esanChatScrollLocked;
      document.body.style.overflow = '';
    }
  }
});

if (route) {
  watch(
    () => route.fullPath,
    () => {
      nextTick().then(scheduleSyncTargetLeadForm);
    },
  );
}
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
  z-index: 1065;
  pointer-events: none;
  inset: 0;
}

.floating-widgets-container.is-chat-open,
.floating-chatbot-wrapper.is-chat-open {
  z-index: 1120;
}

.floating-widget {
  position: fixed;
  pointer-events: auto;
  z-index: 1065;
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

@media (max-width: 640px) {
  .floating-widgets-container {
    --fw-size: 44px;
    --fw-base: 16px;
    --fw-gap: 10px;
    --fw-edge: 14px;
    --fw-icon: 22px;
    --fw-icon-sm: 20px;
  }

  .floating-chatbot-wrapper.is-chat-open {
    inset: 0 !important;
    bottom: 0 !important;
  }
}
</style>

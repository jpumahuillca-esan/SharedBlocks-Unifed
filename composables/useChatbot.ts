import { ref, watch } from 'vue';
import { appendChatbotUtm, isInternalUrl, type UtmTrackingParams } from '../helpers/chatbotUtm';
import { formatMessage, escapeHtml } from '../helpers/chatFormatter';
import {
  useChatbotLead,
  type SuggestedPageItem,
  type ChatMessageItem,
  type LeadFormData,
  type ConversationalLeadStep,
  type LeadSubmitOptions
} from './useChatbotLead';

export {
  appendChatbotUtm,
  isInternalUrl,
  formatMessage,
  escapeHtml,
  type UtmTrackingParams,
  type SuggestedPageItem,
  type ChatMessageItem,
  type LeadFormData,
  type ConversationalLeadStep,
  type LeadSubmitOptions
};

export interface ChatbotPageContext {
  path?: string;
  title?: string;
  entityType?: string;
  academicUnitId?: number;
  tags?: string[];
  metaKeywords?: string;
  category?: string;
}

export interface ContextQuickButton {
  label: string;
  prompt: string;
  url?: string;
  kind?: 'query' | 'lead' | 'navigate';
}

const STORAGE_KEY = 'esan_chatbot_state_v1';
const SESSION_TTL_MS = 4 * 60 * 60 * 1000; // Mantiene el chat vivo hasta 4h de presencia activa
const MAX_STORED_MESSAGES = 50;

const DEFAULT_WELCOME_MESSAGE =
  '¡Hola! 👋 Soy **Arcis ESAN**.\n\n' +
  'Pregúntame sobre carreras, maestrías, cursos, noticias o empleabilidad, o elige una acción contextual abajo.';

const DEFAULT_SUGGESTED_PAGES: SuggestedPageItem[] = [
  {
    title: 'Facultad y Carreras de Pregrado',
    url: '/universidad/pregrado/',
    description: 'Carreras universitarias y oferta académica de pregrado',
    icon: 'las la-graduation-cap'
  },
  {
    title: 'Escuela de Negocios & MBA',
    url: '/escuela-de-negocios/mba/',
    description: 'Maestrías especializadas y programas de posgrado',
    icon: 'las la-award'
  }
];

const DEFAULT_SUGGESTIONS = [
  '🎓 Carreras de Pregrado',
  '💼 Información de MBA',
  '📚 Cursos y Talleres',
  '📩 Quiero recibir información'
];

export function useChatbot() {
  const isChatOpen = ref(false);
  const isTyping = ref(false);
  const inputQuery = ref('');
  const conversationId = ref<string>('');
  const isHydrated = ref(false);

  const chatMessages = ref<ChatMessageItem[]>([
    {
      role: 'assistant',
      content: DEFAULT_WELCOME_MESSAGE,
      suggestedPages: [...DEFAULT_SUGGESTED_PAGES]
    }
  ]);

  const suggestions = ref<string[]>([...DEFAULT_SUGGESTIONS]);
  const contextButtons = ref<ContextQuickButton[]>([]);
  const currentPageContext = ref<ChatbotPageContext | null>(null);
  let lastContextKey = '';

  const {
    leadStep,
    isSubmittingLead,
    leadError,
    leadForm,
    inputPlaceholder,
    resetLeadForm,
    submitLead,
    startConversationalLead,
    handleConversationalStep
  } = useChatbotLead(chatMessages, suggestions, isTyping);

  const serializeLeadForm = (): LeadFormData => ({
    firstName: leadForm.firstName,
    lastName: leadForm.lastName,
    documentType: leadForm.documentType,
    documentNumber: leadForm.documentNumber,
    email: leadForm.email,
    phone: leadForm.phone,
    program: leadForm.program,
    notes: leadForm.notes
  });

  const saveStateToStorage = () => {
    if (!isHydrated.value || typeof window === 'undefined') return;
    try {
      const payload = {
        savedAt: Date.now(),
        conversationId: conversationId.value,
        isChatOpen: isChatOpen.value,
        leadStep: leadStep.value,
        leadForm: serializeLeadForm(),
        chatMessages: chatMessages.value.slice(-MAX_STORED_MESSAGES),
        suggestions: suggestions.value
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (_) {}
  };

  const applyStoredPayload = (rawJson: string | null) => {
    if (!rawJson) return;
    try {
      const parsed = JSON.parse(rawJson);
      if (!parsed || typeof parsed !== 'object') return;
      if (typeof parsed.savedAt === 'number' && Date.now() - parsed.savedAt > SESSION_TTL_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      if (typeof parsed.conversationId === 'string') {
        conversationId.value = parsed.conversationId;
      }
      if (typeof parsed.isChatOpen === 'boolean') {
        isChatOpen.value = parsed.isChatOpen;
      }
      if (Array.isArray(parsed.chatMessages) && parsed.chatMessages.length > 0) {
        chatMessages.value = parsed.chatMessages;
      }
      if (Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0) {
        suggestions.value = parsed.suggestions;
      }
      if (typeof parsed.leadStep === 'string') {
        leadStep.value = parsed.leadStep as ConversationalLeadStep;
      }
      if (parsed.leadForm && typeof parsed.leadForm === 'object') {
        Object.assign(leadForm, {
          firstName: parsed.leadForm.firstName || '',
          lastName: parsed.leadForm.lastName || '',
          documentType: parsed.leadForm.documentType || 'dni',
          documentNumber: parsed.leadForm.documentNumber || '',
          email: parsed.leadForm.email || '',
          phone: parsed.leadForm.phone || '',
          program: parsed.leadForm.program || '',
          notes: parsed.leadForm.notes || ''
        });
      }
      isTyping.value = false;
      isSubmittingLead.value = false;
    } catch (_) {}
  };

  const hydrateStorage = () => {
    if (typeof window === 'undefined' || isHydrated.value) return;
    applyStoredPayload(localStorage.getItem(STORAGE_KEY));
    isHydrated.value = true;
  };

  const clearConversation = () => {
    resetLeadForm();
    conversationId.value = '';
    chatMessages.value = [
      {
        role: 'assistant',
        content: DEFAULT_WELCOME_MESSAGE,
        suggestedPages: [...DEFAULT_SUGGESTED_PAGES]
      }
    ];
    suggestions.value =
      contextButtons.value.length > 0
        ? contextButtons.value.map((b) => b.label)
        : [...DEFAULT_SUGGESTIONS];
    lastContextKey = '';
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
    }
    saveStateToStorage();
  };

  watch(
    [conversationId, isChatOpen, leadStep, chatMessages, suggestions],
    () => {
      saveStateToStorage();
    },
    { deep: true }
  );

  const resolvePageContextWithDom = (ctx?: ChatbotPageContext | null): ChatbotPageContext => {
    const base: ChatbotPageContext = { ...(ctx || {}) };
    if (typeof window !== 'undefined') {
      if (!base.path) base.path = window.location.pathname;
      if (!base.title && typeof document !== 'undefined') {
        base.title = document.title.replace(/\s*\|\s*Universidad ESAN$/i, '').trim();
      }
      if (!base.metaKeywords && typeof document !== 'undefined') {
        const metaEl = document.querySelector('meta[name="keywords"]');
        const content = metaEl?.getAttribute('content');
        if (content) base.metaKeywords = content;
      }
    }
    return base;
  };

  /**
   * Consulta reactiva de "Botones previos" y tarjetas asociadas a las MetaEtiquetas/Tags
   * de la página o noticia que el usuario está leyendo actualmente.
   */
  const loadContextSuggestions = async (apiUrl?: string, rawContext?: ChatbotPageContext | null) => {
    const resolvedCtx = resolvePageContextWithDom(rawContext);
    currentPageContext.value = resolvedCtx;

    const contextKey = `${resolvedCtx.path || ''}|${resolvedCtx.title || ''}|${(resolvedCtx.tags || []).join(',')}|${resolvedCtx.metaKeywords || ''}`;
    if (contextKey === lastContextKey) return;
    lastContextKey = contextKey;

    const cleanBaseUrl = (apiUrl || 'http://127.0.0.1:5005/api/v1/chat').replace(/\/+$/, '');
    try {
      const res = await fetch(`${cleanBaseUrl}/context-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageContext: resolvedCtx })
      });
      if (!res.ok) return;

      const json = await res.json();
      const payload = json?.data || json;
      const buttons: ContextQuickButton[] = Array.isArray(payload?.quickButtons) ? payload.quickButtons : [];
      const related: SuggestedPageItem[] = Array.isArray(payload?.relatedPages) ? payload.relatedPages : [];

      contextButtons.value = buttons;

      // Si el usuario aún no ha enviado mensajes propios (estado bienvenida), enriquecer bienvenida con enlace en línea
      const hasUserStarted = chatMessages.value.some((m) => m.role === 'user');
      if (!hasUserStarted && leadStep.value === 'idle') {
        const topMatch = related[0];
        if (chatMessages.value[0]) {
          chatMessages.value[0] = {
            ...chatMessages.value[0],
            content: payload?.contextSummary && topMatch
              ? `¡Hola! 👋 ${payload.contextSummary}\n\n• Relacionado: [${topMatch.title}](${topMatch.url})\n\nUsa uno de los accesos rápidos abajo o pregúntame directamente.`
              : DEFAULT_WELCOME_MESSAGE,
            suggestedPages: []
          };
        }
        if (buttons.length > 0) {
          suggestions.value = buttons.slice(0, 3).map((b) => b.label);
        }
      }
    } catch (_) {}
  };

  const resolvePromptForChip = (rawText: string): string => {
    const cleanText = rawText.trim();
    const matchedCtxBtn = contextButtons.value.find(
      (b) => b.label === cleanText || b.label.toLowerCase() === cleanText.toLowerCase()
    );
    return matchedCtxBtn?.prompt || cleanText;
  };

  const sendMessage = async (
    apiUrl?: string,
    options?: LeadSubmitOptions,
    customQuery?: string
  ) => {
    const incomingText = (customQuery !== undefined && customQuery !== null ? customQuery : inputQuery.value).trim();
    if (!incomingText || isTyping.value) return;

    const matchedCtxBtn = contextButtons.value.find((b) => b.label === incomingText);
    const displayMessage = incomingText;
    const rawQuery = resolvePromptForChip(incomingText);

    chatMessages.value.push({ role: 'user', content: displayMessage });
    inputQuery.value = '';

    const clean = rawQuery.toLowerCase().trim();

    if (leadStep.value !== 'idle') {
      await handleConversationalStep(rawQuery, options);
      return;
    }

    const wantsToRegister =
      matchedCtxBtn?.kind === 'lead' ||
      /^(s[ií]|✅ s[ií], registrarme|registrarme|deseo registrarme|inscribirme|dejar mis datos|quiero recibir informaci[oó]n|solicitar brochure|quiero que me contacten)$/i.test(
        clean
      ) ||
      clean.includes('quiero que me contacten') ||
      clean.includes('registrar mis datos') ||
      clean.includes('quiero recibir informacion') ||
      clean.includes('quiero recibir información') ||
      clean.includes('brochure por correo');

    if (wantsToRegister) {
      startConversationalLead();
      return;
    }

    isTyping.value = true;
    const cleanBaseUrl = (apiUrl || 'http://127.0.0.1:5005/api/v1/chat').replace(/\/+$/, '');
    const targetUrl = `${cleanBaseUrl}/message`;

    // Enviar historial reciente para sobrevivir a reinicios de backend o recargas de página
    const recentHistory = chatMessages.value
      .slice(-7, -1)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: rawQuery,
          conversationId: conversationId.value || undefined,
          history: recentHistory,
          pageContext: resolvePageContextWithDom(currentPageContext.value)
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const data = await res.json();
      const chatData = data.data || data;

      if (chatData?.conversationId) {
        conversationId.value = chatData.conversationId;
      }

      if (chatData?.suggestedPages && chatData.suggestedPages.length > 0) {
        const prog = chatData.suggestedPages.find(
          (p: SuggestedPageItem) => p.icon === 'las la-graduation-cap'
        );
        if (prog) {
          leadForm.program = prog.title;
        }
      }

      chatMessages.value.push({
        role: 'assistant',
        content: chatData?.reply || 'Disculpa, no pude procesar la respuesta en este momento.',
        suggestedPages: chatData?.suggestedPages || undefined
      });

      if (Array.isArray(chatData?.suggestions)) {
        suggestions.value = chatData.suggestions;
      }
    } catch (fetchErr: any) {
      console.error('❌ [useChatbot] Error al conectar con el microservicio de chatbot:', fetchErr);
      chatMessages.value.push({
        role: 'assistant',
        content:
          'El servicio de asistencia virtual está experimentando una breve intermitencia de conexión. Por favor reintenta en un instante o comunícate vía **WhatsApp** con nuestro equipo de admisión.'
      });
    } finally {
      isTyping.value = false;
    }
  };

  return {
    isChatOpen,
    isTyping,
    inputQuery,
    inputPlaceholder,
    conversationId,
    leadStep,
    isSubmittingLead,
    leadError,
    leadForm,
    chatMessages,
    suggestions,
    contextButtons,
    hydrateStorage,
    applyStoredPayload,
    clearConversation,
    loadContextSuggestions,
    sendMessage,
    submitLead,
    startConversationalLead,
    resetLeadForm,
    formatMessage,
    appendChatbotUtm
  };
}

import { ref } from 'vue';
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

// Re-exportar tipos y utilidades para compatibilidad absoluta con todos los componentes existentes
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

const DEFAULT_WELCOME_MESSAGE =
  '¡Hola! 👋 Bienvenido al portal de la **Universidad ESAN**.\n\n' +
  'Soy tu asistente virtual institucional. Puedes pedirme buscar cualquier página del portal (ej: *"Búscame la página de Pregrado"*, *"Administración"*, *"Nosotros"*) o pedirme registrarte para recibir información oficial.';

export function useChatbot() {
  const isChatOpen = ref(false);
  const isTyping = ref(false);
  const inputQuery = ref('');
  const conversationId = ref<string>('');

  const chatMessages = ref<ChatMessageItem[]>([
    {
      role: 'assistant',
      content: DEFAULT_WELCOME_MESSAGE,
      suggestedPages: [
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
      ]
    }
  ]);

  const suggestions = ref<string[]>([
    '🎓 Carreras de Pregrado',
    '💼 Información de MBA',
    '🏛️ Acerca de ESAN',
    '📩 Quiero recibir información'
  ]);

  // Delegar la gestión de leads al composable modular useChatbotLead
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

  /**
   * Manejador central de mensajes del Chatbot:
   * 1. Si está en captura de lead -> procesa el paso correspondiente.
   * 2. Si detecta intención de registro -> activa el flujo conversacional.
   * 3. Si es consulta abierta -> delega al microservicio de IA (Cerebro).
   */
  const sendMessage = async (
    apiUrl?: string,
    options?: LeadSubmitOptions,
    customQuery?: string
  ) => {
    const rawQuery = (customQuery !== undefined && customQuery !== null ? customQuery : inputQuery.value).trim();
    if (!rawQuery || isTyping.value) return;

    chatMessages.value.push({ role: 'user', content: rawQuery });
    inputQuery.value = '';

    const clean = rawQuery.toLowerCase().trim();

    // =========================================================================
    // CASO A: El usuario está dentro del flujo conversacional de lead
    // =========================================================================
    if (leadStep.value !== 'idle') {
      await handleConversationalStep(rawQuery, options);
      return;
    }

    // =========================================================================
    // CASO B: Usuario solicita registrarse o recibir información
    // =========================================================================
    const wantsToRegister =
      /^(s[ií]|✅ s[ií], registrarme|registrarme|deseo registrarme|inscribirme|dejar mis datos|quiero recibir informaci[oó]n|solicitar brochure|quiero que me contacten)$/i.test(
        clean
      ) ||
      clean.includes('quiero que me contacten') ||
      clean.includes('registrar mis datos') ||
      clean.includes('quiero recibir informacion') ||
      clean.includes('quiero recibir información');

    if (wantsToRegister) {
      startConversationalLead();
      return;
    }

    // =========================================================================
    // CASO C: Consulta General al Microservicio de IA (Cerebro del Bot)
    // =========================================================================
    isTyping.value = true;
    const cleanBaseUrl = (apiUrl || 'http://127.0.0.1:5005/api/v1/chat').replace(/\/+$/, '');
    const targetUrl = `${cleanBaseUrl}/message`;

    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: rawQuery,
          conversationId: conversationId.value || undefined
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

      // Si la consulta fue sobre una carrera o programa específico, guardar en leadForm.program
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
    sendMessage,
    submitLead,
    startConversationalLead,
    resetLeadForm,
    formatMessage,
    appendChatbotUtm
  };
}

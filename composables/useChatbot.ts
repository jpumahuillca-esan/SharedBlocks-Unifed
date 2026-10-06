import { ref, reactive } from 'vue';

export interface SuggestedPageItem {
  title: string;
  url: string;
  description?: string;
  category?: string;
  icon?: string;
}

export interface ChatMessageItem {
  role: 'user' | 'assistant';
  content: string;
  suggestedPages?: SuggestedPageItem[];
}

export interface LeadFormData {
  fullName: string;
  email: string;
  phone: string;
  program: string;
  notes: string;
}

export const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const formatMessage = (text: string): string => {
  if (!text) return '';
  const safeText = escapeHtml(text);
  return safeText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(
      /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/gi,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-inline-link">$1 <i class="las la-external-link-alt"></i></a>'
    )
    .replace(/\n/g, '<br/>');
};

const DEFAULT_WELCOME_MESSAGE =
  '¡Hola! 👋 Bienvenido al portal de la **Universidad ESAN**.\n\n' +
  'Soy tu asistente virtual institucional. Puedes pedirme buscar cualquier página (ej: *"Búscame la página de carreras"* o *"Admisión"*) o dejar tus datos para recibir información.';

export function useChatbot() {
  const isChatOpen = ref(false);
  const isTyping = ref(false);
  const inputQuery = ref('');
  const conversationId = ref<string>('');

  const showLeadForm = ref(false);
  const isSubmittingLead = ref(false);
  const leadError = ref('');

  const leadForm = reactive<LeadFormData>({
    fullName: '',
    email: '',
    phone: '',
    program: '',
    notes: ''
  });

  const chatMessages = ref<ChatMessageItem[]>([
    {
      role: 'assistant',
      content: DEFAULT_WELCOME_MESSAGE,
      suggestedPages: [
        {
          title: 'Admisión Pregrado',
          url: '/admision',
          description: 'Modalidades de examen e inscripción online',
          icon: 'las la-user-graduate'
        },
        {
          title: 'Carreras Profesionales',
          url: '/carreras',
          description: 'Facultades y carreras de pregrado ESAN',
          icon: 'las la-graduation-cap'
        }
      ]
    }
  ]);

  const suggestions = ref<string[]>([
    '🎓 Búscame la página de carreras',
    '📝 Página de admisión',
    '💳 Ver escalas y pensiones',
    '📩 Quiero recibir información'
  ]);

  const sendMessage = async (apiUrl?: string) => {
    const query = inputQuery.value.trim();
    if (!query || isTyping.value) return;

    chatMessages.value.push({ role: 'user', content: query });
    inputQuery.value = '';
    isTyping.value = true;

    const targetUrl = (apiUrl || 'http://127.0.0.1:5000/api/v1/chat') + '/message';

    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
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

      chatMessages.value.push({
        role: 'assistant',
        content: chatData?.reply || 'Disculpa, no pude procesar la respuesta en este momento.',
        suggestedPages: chatData?.suggestedPages || undefined
      });

      if (Array.isArray(chatData?.suggestions)) {
        suggestions.value = chatData.suggestions;
      }
    } catch {
      chatMessages.value.push({
        role: 'assistant',
        content:
          'El servicio de asistencia virtual está temporalmente no disponible. Si requieres atención inmediata, por favor contáctanos vía **WhatsApp** a través del botón verde en la esquina de tu pantalla.'
      });
    } finally {
      isTyping.value = false;
    }
  };

  const submitLead = async (options?: {
    endpoint?: string;
    academicUnitId?: number | string;
  }) => {
    leadError.value = '';
    if (!leadForm.fullName.trim()) {
      leadError.value = 'Por favor ingresa tu nombre completo.';
      return false;
    }
    if (!leadForm.email.trim() || !leadForm.email.includes('@')) {
      leadError.value = 'Por favor ingresa un correo electrónico válido.';
      return false;
    }
    if (!leadForm.phone.trim()) {
      leadError.value = 'Por favor ingresa un número de teléfono o WhatsApp.';
      return false;
    }

    isSubmittingLead.value = true;

    const names = leadForm.fullName.trim().split(' ');
    const firstName = names[0] || 'Interesado';
    const lastName = names.slice(1).join(' ') || '-';
    const programInterest = leadForm.program.trim() || 'Información General';

    const payload = {
      academic_unit_id: options?.academicUnitId || 1,
      first_name: firstName,
      last_name: lastName,
      email: leadForm.email.trim(),
      phone: leadForm.phone.trim(),
      payload: {
        origen: 'chatbot_web',
        interes: programInterest,
        notas: leadForm.notes.trim() || 'Solicitud desde el Asistente Virtual ESAN'
      }
    };

    try {
      const endpoint = options?.endpoint || '/api/leads';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok && res.status !== 201 && res.status !== 200) {
        throw new Error('Error al registrar en servidor');
      }

      showLeadForm.value = false;
      const registeredName = leadForm.fullName;
      const registeredEmail = leadForm.email;
      const registeredPhone = leadForm.phone;

      leadForm.fullName = '';
      leadForm.email = '';
      leadForm.phone = '';
      leadForm.program = '';
      leadForm.notes = '';

      chatMessages.value.push({
        role: 'assistant',
        content: `¡Muchas gracias, **${registeredName}**! 🎉\n\nHemos registrado tus datos correctamente. Te enviaremos información detallada a **${registeredEmail}** y un asesor de la Universidad ESAN podrá contactarte vía WhatsApp al **${registeredPhone}** para brindarte orientación personalizada.`
      });

      suggestions.value = [
        'Búscame la página de carreras',
        'Página de admisión',
        'Escalas y pensiones'
      ];
      return true;
    } catch (err: any) {
      console.error('Error al registrar lead:', err);
      leadError.value =
        'Ocurrió un inconveniente al enviar tus datos. Por favor inténtalo nuevamente o contáctanos por WhatsApp.';
      return false;
    } finally {
      isSubmittingLead.value = false;
    }
  };

  return {
    isChatOpen,
    isTyping,
    inputQuery,
    conversationId,
    showLeadForm,
    isSubmittingLead,
    leadError,
    leadForm,
    chatMessages,
    suggestions,
    sendMessage,
    submitLead,
    formatMessage
  };
}

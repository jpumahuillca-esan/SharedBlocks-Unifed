import { ref, reactive, computed, type Ref } from 'vue';

export interface SuggestedPageItem {
  title: string;
  url: string;
  description?: string;
  category?: string;
  icon?: string;
  brochureUrl?: string;
  modality?: string;
}

export interface ChatMessageItem {
  role: 'user' | 'assistant';
  content: string;
  suggestedPages?: SuggestedPageItem[];
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  documentType: 'dni' | 'ce' | 'passport';
  documentNumber: string;
  email: string;
  phone: string;
  program: string;
  notes: string;
}

export type ConversationalLeadStep =
  | 'idle'
  | 'confirm_registration'
  | 'ask_first_name'
  | 'ask_last_name'
  | 'ask_document_number'
  | 'ask_email'
  | 'ask_phone'
  | 'ask_program';

export interface LeadSubmitOptions {
  endpoint?: string;
  academicUnitId?: number | string;
  campaignSlug?: string;
  campaignId?: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

/**
 * Composable especializado en la captura paso a paso de prospectos (Leads)
 * y su envío seguro a la API de Laravel
 */
export function useChatbotLead(
  chatMessages: Ref<ChatMessageItem[]>,
  suggestions: Ref<string[]>,
  isTyping: Ref<boolean>
) {
  const leadStep = ref<ConversationalLeadStep>('idle');
  const isSubmittingLead = ref(false);
  const leadError = ref('');

  const leadForm = reactive<LeadFormData>({
    firstName: '',
    lastName: '',
    documentType: 'dni',
    documentNumber: '',
    email: '',
    phone: '',
    program: '',
    notes: ''
  });

  const inputPlaceholder = computed(() => {
    switch (leadStep.value) {
      case 'ask_first_name':
        return 'Escribe tus nombres (ej: Juan Carlos)...';
      case 'ask_last_name':
        return 'Escribe tus apellidos (ej: Pérez García)...';
      case 'ask_document_number':
        return 'Ingresa tu DNI o número de documento...';
      case 'ask_email':
        return 'Ingresa tu correo (ej: tunombre@correo.com)...';
      case 'ask_phone':
        return 'Ingresa tu celular o WhatsApp (ej: 987654321)...';
      case 'ask_program':
        return 'Programa de interés (o escribe "General")...';
      default:
        return 'Escribe tu consulta o pide una página...';
    }
  });

  const resetLeadForm = () => {
    leadForm.firstName = '';
    leadForm.lastName = '';
    leadForm.documentType = 'dni';
    leadForm.documentNumber = '';
    leadForm.email = '';
    leadForm.phone = '';
    leadForm.program = '';
    leadForm.notes = '';
    leadError.value = '';
    leadStep.value = 'idle';
  };

  /**
   * Envía el lead al backend oficial de Laravel (conectado a Campaña EsanBot y Autorespuesta)
   */
  const submitLead = async (options?: LeadSubmitOptions): Promise<boolean> => {
    isSubmittingLead.value = true;
    const programInterest = leadForm.program.trim() || 'Información General';

    const campaignSlug = options?.campaignSlug || 'esanbot';
    const utmSource = options?.utmSource || 'chatbot';
    const utmMedium = options?.utmMedium || 'chat_conversacional';
    const utmCampaign = options?.utmCampaign || 'esanbot';

    const payload = {
      academic_unit_id: options?.academicUnitId ? Number(options.academicUnitId) : 1,
      campaign_slug: campaignSlug,
      campaign_id: options?.campaignId || 2,
      first_name: leadForm.firstName.trim(),
      last_name: leadForm.lastName.trim(),
      document_type: leadForm.documentType || 'dni',
      document_number: leadForm.documentNumber.trim() || undefined,
      email: leadForm.email.trim(),
      phone: leadForm.phone.trim(),
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      marketing_metadata: {
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        referrer_type: 'direct_chatbot',
        provenance: 'Chatbot EsanBot Conversacional'
      },
      payload: {
        origen: 'chatbot_conversacional',
        interes: programInterest,
        notas: leadForm.notes.trim() || 'Capturado paso a paso en el Chatbot ESAN (EsanBot)'
      }
    };

    try {
      let endpoint = options?.endpoint;
      if (!endpoint || endpoint === '/api/leads' || endpoint.startsWith('/api/leads')) {
        const host =
          typeof window !== 'undefined' && (window as any)?.__NUXT__?.config?.public?.laravelApiUrl
            ? (window as any).__NUXT__.config.public.laravelApiUrl
            : 'http://127.0.0.1:8000';
        endpoint = `${host.replace(/\/+$/, '')}/api/public/leads`;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json().catch(() => null);

      if (!res.ok && res.status !== 201 && res.status !== 200) {
        console.error('Error del servidor al registrar lead:', resData);
        throw new Error(resData?.message || 'Error al registrar en servidor');
      }

      const clientName = leadForm.firstName.trim();
      const clientEmail = leadForm.email.trim();
      const clientPhone = leadForm.phone.trim();
      const chosenProgram = programInterest !== 'Información General' ? ` sobre **${programInterest}**` : '';

      resetLeadForm();

      const serverMsg = resData?.message || resData?.title;
      const customConfirmation = serverMsg
        ? `${serverMsg}\n\nEn breve un asesor educativo de la **Universidad ESAN** se comunicará contigo vía WhatsApp al **${clientPhone}** y te enviaremos la confirmación oficial${chosenProgram} a **${clientEmail}**.`
        : `Hemos registrado tus datos con éxito en el sistema institucional. En breve un asesor educativo de la **Universidad ESAN** se comunicará contigo vía WhatsApp al **${clientPhone}** y te enviaremos la información oficial${chosenProgram} a **${clientEmail}**.`;

      chatMessages.value.push({
        role: 'assistant',
        content:
          `¡Todo listo, **${clientName}**! 🎉\n\n` +
          `${customConfirmation}\n\n` +
          `Además, te enviamos un correo oficial de bienvenida ("*Gracias por registrarte con EsanBot*") a tu correo electrónico.\n\n` +
          `¡Muchos éxitos en tu camino profesional! ¿Deseas consultar alguna otra página del portal?`
      });

      suggestions.value = [
        '🎓 Carreras de Pregrado',
        '📝 Modalidades de admisión',
        '💳 Escalas y pensiones',
        '🏛️ Portal Central'
      ];
      return true;
    } catch (err: any) {
      console.error('Error al registrar lead:', err);
      chatMessages.value.push({
        role: 'assistant',
        content:
          'Ocurrió un inconveniente temporal al guardar tu registro en el sistema. Puedes comunicarte directamente vía **WhatsApp** a través del botón verde de la pantalla o volver a intentarlo más tarde.'
      });
      resetLeadForm();
      return false;
    } finally {
      isSubmittingLead.value = false;
    }
  };

  /**
   * Inicia el flujo conversacional paso a paso para recopilar datos de contacto
   */
  const startConversationalLead = (initialProgram?: string) => {
    if (initialProgram) {
      leadForm.program = initialProgram;
    }
    leadStep.value = 'ask_first_name';
    isTyping.value = true;

    setTimeout(() => {
      isTyping.value = false;
      chatMessages.value.push({
        role: 'assistant',
        content:
          '¡Con mucho gusto! Con unos breves datos podremos enviarte el folleto oficial y coordinar la atención con un asesor educativo de la Universidad ESAN.\n\n' +
          'Para comenzar, ¿cuáles son tus **nombres**?'
      });
      suggestions.value = ['Cancelar'];
    }, 600);
  };

  /**
   * Procesa el paso actual de la máquina de estados
   */
  const handleConversationalStep = async (rawQuery: string, options?: LeadSubmitOptions) => {
    const clean = rawQuery.toLowerCase().trim();

    // Cancelación en cualquier paso
    if (/^(cancelar|ya no|no gracias|detener|salir|stop|cancel)$/i.test(clean)) {
      resetLeadForm();
      chatMessages.value.push({
        role: 'assistant',
        content:
          'Entendido, cancelamos el registro de datos. Continuemos conversando. ¿Tienes alguna otra consulta sobre la Universidad ESAN?'
      });
      suggestions.value = ['🎓 Carreras de Pregrado', '💼 Información de MBA', '🏛️ Acerca de ESAN'];
      return;
    }

    isTyping.value = true;

    setTimeout(async () => {
      isTyping.value = false;

      // PASO 1: NOMBRES
      if (leadStep.value === 'ask_first_name') {
        if (rawQuery.length < 2) {
          chatMessages.value.push({
            role: 'assistant',
            content: 'Por favor indícame un nombre válido para poder registrarte:'
          });
          suggestions.value = ['Cancelar'];
          return;
        }
        leadForm.firstName = rawQuery;
        leadStep.value = 'ask_last_name';
        chatMessages.value.push({
          role: 'assistant',
          content: `Mucho gusto, **${leadForm.firstName}**. ¿Cuáles son tus **apellidos**?`
        });
        suggestions.value = ['Cancelar'];
        return;
      }

      // PASO 2: APELLIDOS
      if (leadStep.value === 'ask_last_name') {
        if (rawQuery.length < 2) {
          chatMessages.value.push({
            role: 'assistant',
            content: 'Por favor indícame tus apellidos para continuar:'
          });
          suggestions.value = ['Cancelar'];
          return;
        }
        leadForm.lastName = rawQuery;
        leadStep.value = 'ask_document_number';
        chatMessages.value.push({
          role: 'assistant',
          content: `Perfecto, **${leadForm.firstName}**. ¿Cuál es tu número de **DNI** o documento de identidad?`
        });
        suggestions.value = ['Cancelar'];
        return;
      }

      // PASO 3: DOCUMENTO DE IDENTIDAD
      if (leadStep.value === 'ask_document_number') {
        const cleanDoc = rawQuery.replace(/\s+/g, '');
        if (cleanDoc.length < 5 || cleanDoc.length > 20) {
          chatMessages.value.push({
            role: 'assistant',
            content:
              'Por favor ingresa un número de documento válido (8 dígitos si es DNI, o tu pasaporte / carné de extranjería):'
          });
          suggestions.value = ['Cancelar'];
          return;
        }
        leadForm.documentNumber = cleanDoc;
        leadForm.documentType = /^\d{8}$/.test(cleanDoc) ? 'dni' : 'passport';
        leadStep.value = 'ask_email';
        chatMessages.value.push({
          role: 'assistant',
          content: `Excelente. ¿A qué **correo electrónico** te gustaría que te enviemos la información académica y el folleto?`
        });
        suggestions.value = ['Cancelar'];
        return;
      }

      // PASO 4: CORREO ELECTRÓNICO
      if (leadStep.value === 'ask_email') {
        if (!rawQuery.includes('@') || !rawQuery.includes('.')) {
          chatMessages.value.push({
            role: 'assistant',
            content:
              'Por favor ingresa un correo electrónico válido (ejemplo: tunombre@correo.com) para garantizar que recibas la información:'
          });
          suggestions.value = ['Cancelar'];
          return;
        }
        leadForm.email = rawQuery;
        leadStep.value = 'ask_phone';
        chatMessages.value.push({
          role: 'assistant',
          content: `¿A qué número de **celular o WhatsApp** te puede contactar nuestro asesor educativo?`
        });
        suggestions.value = ['Cancelar'];
        return;
      }

      // PASO 5: TELÉFONO / WHATSAPP
      if (leadStep.value === 'ask_phone') {
        const digits = rawQuery.replace(/\D/g, '');
        if (digits.length < 7) {
          chatMessages.value.push({
            role: 'assistant',
            content:
              'Por favor indícame un número de celular o WhatsApp válido (mínimo 7 dígitos):'
          });
          suggestions.value = ['Cancelar'];
          return;
        }
        leadForm.phone = rawQuery;

        // Si ya teníamos un programa pre-detectado
        if (leadForm.program && leadForm.program !== 'General') {
          await submitLead(options);
          return;
        }

        leadStep.value = 'ask_program';
        chatMessages.value.push({
          role: 'assistant',
          content:
            `¡Casi listo! Por último, ¿cuál es tu **carrera o programa de interés**? (ej: Pregrado, Administración, MBA).\n\n` +
            `Si aún no lo has definido o estás explorando opciones, puedes responder *"General"*:`
        });
        suggestions.value = ['Administración', 'Pregrado', 'MBA', 'General', 'Cancelar'];
        return;
      }

      // PASO 6: PROGRAMA DE INTERÉS Y ENVÍO FINAL
      if (leadStep.value === 'ask_program') {
        leadForm.program = rawQuery;
        await submitLead(options);
        return;
      }
    }, 500);
  };

  return {
    leadStep,
    isSubmittingLead,
    leadError,
    leadForm,
    inputPlaceholder,
    resetLeadForm,
    submitLead,
    startConversationalLead,
    handleConversationalStep
  };
}

import { ref, reactive, computed, watch } from 'vue';
import { PublicLeadService } from '../services/public-lead.service';
import type { DynamicFormField, PublicLeadPayload } from '../types/lead.types';

export interface DynamicLeadFormProps {
  data?: Record<string, any>;
  config?: Record<string, any>;
  careerName?: string;
  apiBaseUrl?: string;
}

const DEFAULT_FALLBACK_FIELDS: DynamicFormField[] = [
  { name: 'first_name', label: 'Nombres', type: 'text', placeholder: 'Nombres', required: true, col_span: 6 },
  { name: 'last_name', label: 'Apellidos', type: 'text', placeholder: 'Apellidos', required: true, col_span: 6 },
  {
    name: 'document_type',
    label: 'Tipo Doc',
    type: 'select',
    required: true,
    col_span: 6,
    options: [
      { label: 'DNI', value: 'DNI' },
      { label: 'Carné de Extranjería (CE)', value: 'CE' },
      { label: 'Pasaporte (PAS)', value: 'PAS' },
    ],
  },
  { name: 'document_number', label: 'N° Documento', type: 'text', placeholder: 'Documento', required: true, col_span: 6 },
  { name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'ejemplo@esan.edu.pe', required: true, col_span: 6 },
  { name: 'phone', label: 'Celular', type: 'tel', placeholder: '999 999 999', required: true, col_span: 6 },
];

export function useDynamicLeadForm(props: DynamicLeadFormProps) {
  const isSubmitting = ref(false);
  const aceptaCondiciones = ref(false);
  const aceptaPublicidad = ref(false);

  // Normalización defensiva de props (soporta canvas del builder :data y consumo directo :config)
  const cfg = computed(() => {
    const source = (props.data && Object.keys(props.data).length > 0) ? props.data : (props.config || {});
    return {
      academic_unit_id: source.academic_unit_id ?? null,
      campaign_id: source.campaign_id ?? null,
      study_program_id: source.study_program_id ? Number(source.study_program_id) : null,
      mainTitle: source.mainTitle || '¡TRANSFORMA TU FUTURO!',
      subTitle: source.subTitle || '',
      button_text: source.button_text || 'ENVIAR SOLICITUD',
      condition: source.condition || 'https://www.ue.edu.pe/pregrado/politica-de-privacidad',
      success_title: source.success_title || '¡Solicitud enviada!',
      success_message: source.success_message || '',
      cod_form_old: source.cod_form_old || 0,
      fields: Array.isArray(source.fields) ? (source.fields as DynamicFormField[]) : [],
    };
  });

  const activeFields = computed<DynamicFormField[]>(() => {
    return cfg.value.fields.length > 0 ? cfg.value.fields : DEFAULT_FALLBACK_FIELDS;
  });

  // Almacén reactivo de datos capturados
  const formValues = reactive<Record<string, any>>({});

  const initValues = () => {
    activeFields.value.forEach((field) => {
      if (!(field.name in formValues)) {
        formValues[field.name] = field.type === 'select' && field.options?.length ? field.options[0].value : '';
      }
    });
  };

  watch(() => cfg.value.fields, initValues, { immediate: true, deep: true });

  const sanitizeField = (name: string, type: string) => {
    if (type === 'tel' || name === 'phone') {
      formValues[name] = String(formValues[name] || '').replace(/\D/g, '').slice(0, 9);
    }
    if (name === 'document_number') {
      formValues[name] = String(formValues[name] || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
    }
  };

  const notify = async (icon: 'success' | 'warning' | 'error', title: string, text: string) => {
    if (typeof window === 'undefined') return;
    const Swal = (await import('sweetalert2')).default;
    await Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#E3173E',
    });
  };

  /**
   * Extractor semántico tolerante a fallos:
   * Mapea claves sinónimas hacia los atributos raíz de la tabla leads
   * y envía el resto en payload JSON.
   */
  const extractPayload = (currentSlug: string, recaptchaToken: string): PublicLeadPayload => {
    // 1. Extraer nombres
    const firstName = String(formValues.first_name || formValues.nombres || formValues.name || '').trim();

    // 2. Extraer y unificar apellidos
    let lastName = String(formValues.last_name || formValues.apellidos || '').trim();
    if (!lastName && (formValues.apellido_paterno || formValues.apellido_materno)) {
      lastName = `${formValues.apellido_paterno || ''} ${formValues.apellido_materno || ''}`.trim();
    }

    // 3. Extraer y normalizar tipo de documento
    const rawDocType = String(formValues.document_type || formValues.type_document || formValues.tipo_documento || 'dni')
      .trim()
      .toLowerCase();
    const docType = rawDocType === 'pas' ? 'passport' : rawDocType;

    // 4. Extraer número de documento
    const docNumber = String(
      formValues.document_number || formValues.numero_documento || formValues.document || ''
    ).trim();

    // 5. Contacto
    const email = String(formValues.email || formValues.correo || '').trim();
    const phone = String(formValues.phone || formValues.celular || formValues.telefono || '').trim();

    // 6. Programa de Estudio
    let studyProgramId = cfg.value.study_program_id ? Number(cfg.value.study_program_id) : null;
    if (!studyProgramId) {
      const rawProg = formValues.study_program_id || formValues.carrera_id || formValues.programa_id;
      if (rawProg && !isNaN(Number(rawProg))) {
        studyProgramId = Number(rawProg);
      }
    }

    return {
      academic_unit_id: cfg.value.academic_unit_id,
      campaign_id: cfg.value.campaign_id,
      study_program_id: studyProgramId,
      first_name: firstName,
      last_name: lastName,
      document_type: docType,
      document_number: docNumber,
      email,
      phone,
      slug_carrera: currentSlug,
      recaptcha_token: recaptchaToken,
      payload: {
        ...formValues,
        study_program_id: studyProgramId,
        programa_origen: props.careerName || '',
        acepta_condiciones: aceptaCondiciones.value,
        acepta_publicidad: aceptaPublicidad.value,
        url_slug: currentSlug,
        cod_form_old: cfg.value.cod_form_old,
      },
    };
  };

  const submit = async () => {
    if (!aceptaCondiciones.value) {
      await notify('warning', 'Atención', 'Debes aceptar las condiciones de tratamiento de datos personales.');
      return;
    }

    isSubmitting.value = true;
    try {
      let recaptchaToken = 'public_bypass';
      if (typeof window !== 'undefined' && (window as any).grecaptcha) {
        try {
          recaptchaToken = await (window as any).grecaptcha.execute(undefined, { action: 'submit_lead' });
        } catch (_) {}
      }

      const segments = typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean) : [];
      const currentSlug = segments.length > 0 ? segments[segments.length - 1] : '';

      const payload = extractPayload(currentSlug, recaptchaToken);

      const res = await PublicLeadService.submit(
        payload,
        cfg.value.academic_unit_id || currentSlug,
        props.apiBaseUrl
      );

      // Ejecución de respuesta post-conversión
      if (res.action.type === 'redirect' && res.action.redirect_url) {
        window.location.href = res.action.redirect_url;
        return;
      }

      if (res.action.type === 'download' && res.action.download_url) {
        const a = document.createElement('a');
        a.href = res.action.download_url;
        a.target = '_blank';
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      await notify('success', res.action.title || cfg.value.success_title, res.action.message || res.message);
    } catch (err: any) {
      await notify('error', 'Error', err.message || 'No fue posible procesar tus datos.');
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    cfg,
    activeFields,
    formValues,
    isSubmitting,
    aceptaCondiciones,
    aceptaPublicidad,
    sanitizeField,
    submit,
  };
}
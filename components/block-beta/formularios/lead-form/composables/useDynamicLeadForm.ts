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
  {
    name: 'document_type',
    label: 'Tipo Doc',
    type: 'select',
    required: true,
    col_span: 6,
    options: [
      { label: 'DNI', value: 'dni' },
      { label: 'Carné de Extranjería (CE)', value: 'ce' },
      { label: 'Pasaporte (PAS)', value: 'pas' },
    ],
  },
  {
    name: 'document_number',
    label: 'N° Documento',
    type: 'text',
    placeholder: '8 dígitos para DNI',
    required: true,
    validation_rule: 'doc_dynamic',
    max_length: 8,
    col_span: 6,
  },
  { name: 'first_name', label: 'Nombres', type: 'text', placeholder: 'Tus nombres', required: true, validation_rule: 'only_letters', col_span: 6 },
  { name: 'last_name', label: 'Apellidos', type: 'text', placeholder: 'Tus apellidos', required: true, validation_rule: 'only_letters', col_span: 6 },
  { name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'ejemplo@esan.edu.pe', required: true, validation_rule: 'email', col_span: 6 },
  { name: 'phone', label: 'Celular', type: 'tel', placeholder: '999 999 999', required: true, validation_rule: 'phone_pe', max_length: 9, col_span: 6 },
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
      external_campaign_id: source.external_campaign_id || null,
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

  const getDocType = (): string => {
    return String(formValues.document_type || formValues.tipo_documento || 'dni').toLowerCase();
  };

  const resolveFieldType = (field: DynamicFormField): string => {
    if (field.type === 'tel' || field.validation_rule === 'phone_pe') return 'tel';
    if (field.type === 'email' || field.validation_rule === 'email') return 'email';
    return field.type || 'text';
  };

  const resolveMaxlength = (field: DynamicFormField): number | undefined => {
    const isDocField = field.name === 'document_number' || field.validation_rule === 'doc_dynamic';
    if (isDocField) {
      const dt = getDocType();
      if (dt === 'dni') return 8;
      if (dt === 'ruc') return 11;
      return 12; // CE o Pasaporte
    }
    if (field.validation_rule === 'dni') return 8;
    if (field.validation_rule === 'phone_pe') return 9;
    if (field.validation_rule === 'ce' || field.validation_rule === 'passport') return 12;
    if (field.max_length != null && field.max_length > 0) return Number(field.max_length);
    return undefined;
  };

  const resolveMinlength = (field: DynamicFormField): number | undefined => {
    const isDocField = field.name === 'document_number' || field.validation_rule === 'doc_dynamic';
    if (isDocField) {
      const dt = getDocType();
      if (dt === 'dni') return 8;
      if (dt === 'ruc') return 11;
      if (dt === 'ce') return 8;
      if (dt === 'pas' || dt === 'passport') return 6;
    }
    if (field.validation_rule === 'dni') return 8;
    if (field.validation_rule === 'phone_pe') return 9;
    if (field.min_length != null && field.min_length > 0) return Number(field.min_length);
    return undefined;
  };

  const resolveInputmode = (field: DynamicFormField): 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' | undefined => {
    const isDocField = field.name === 'document_number' || field.validation_rule === 'doc_dynamic';
    if (isDocField) {
      const dt = getDocType();
      if (dt === 'dni' || dt === 'ruc') return 'numeric';
      return 'text';
    }
    if (field.validation_rule === 'dni' || field.validation_rule === 'phone_pe' || field.validation_rule === 'only_numbers' || field.type === 'tel') {
      return 'numeric';
    }
    if (field.validation_rule === 'email' || field.type === 'email') return 'email';
    return undefined;
  };

  const resolvePlaceholder = (field: DynamicFormField): string => {
    const isDocField = field.name === 'document_number' || field.validation_rule === 'doc_dynamic';
    if (isDocField) {
      const dt = getDocType();
      if (dt === 'dni') return 'DNI de 8 dígitos';
      if (dt === 'ruc') return 'RUC de 11 dígitos';
      if (dt === 'ce') return 'Carné de Extranjería (hasta 12 car.)';
      if (dt === 'pas' || dt === 'passport') return 'N° Pasaporte (hasta 12 car.)';
      return field.placeholder || 'N° Documento';
    }
    return field.placeholder || '';
  };

  const sanitizeField = (name: string, type: string) => {
    const fieldDef = activeFields.value.find((f) => f.name === name);
    const isDocField = name === 'document_number' || fieldDef?.validation_rule === 'doc_dynamic';

    if (isDocField) {
      const dt = getDocType();
      if (dt === 'dni') {
        formValues[name] = String(formValues[name] || '').replace(/\D/g, '').slice(0, 8);
      } else if (dt === 'ruc') {
        formValues[name] = String(formValues[name] || '').replace(/\D/g, '').slice(0, 11);
      } else {
        formValues[name] = String(formValues[name] || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
      }
      return;
    }

    if (fieldDef?.validation_rule === 'dni') {
      formValues[name] = String(formValues[name] || '').replace(/\D/g, '').slice(0, 8);
      return;
    }

    if (type === 'tel' || fieldDef?.validation_rule === 'phone_pe' || name === 'phone') {
      formValues[name] = String(formValues[name] || '').replace(/\D/g, '').slice(0, 9);
      return;
    }

    if (fieldDef?.validation_rule === 'only_numbers') {
      formValues[name] = String(formValues[name] || '').replace(/\D/g, '');
      if (fieldDef.max_length) formValues[name] = formValues[name].slice(0, fieldDef.max_length);
      return;
    }

    if (fieldDef?.validation_rule === 'only_letters') {
      formValues[name] = String(formValues[name] || '').replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
      if (fieldDef.max_length) formValues[name] = formValues[name].slice(0, fieldDef.max_length);
      return;
    }

    if (fieldDef?.validation_rule === 'ce' || fieldDef?.validation_rule === 'passport' || fieldDef?.validation_rule === 'alphanumeric') {
      formValues[name] = String(formValues[name] || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, fieldDef.max_length || 12);
      return;
    }

    if (fieldDef?.max_length != null && fieldDef.max_length > 0) {
      formValues[name] = String(formValues[name] || '').slice(0, fieldDef.max_length);
    }
  };

  // Re-sanitizar document_number cuando el usuario cambia el tipo de documento en el selector
  watch(() => formValues.document_type, () => {
    if ('document_number' in formValues) {
      sanitizeField('document_number', 'text');
    }
  });

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

    const externalCampaignId = formValues.external_campaign_id || cfg.value.external_campaign_id || null;

    return {
      academic_unit_id: cfg.value.academic_unit_id,
      campaign_id: cfg.value.campaign_id,
      external_campaign_id: externalCampaignId,
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
        external_campaign_id: externalCampaignId,
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

    // Validación de campos requeridos
    for (const field of activeFields.value) {
      if (field.required) {
        const val = String(formValues[field.name] || '').trim();
        if (!val) {
          await notify('warning', 'Campo Obligatorio', `Por favor completa el campo "${field.label}".`);
          return;
        }
      }
    }

    // Validación específica de Tipo de Documento y N° de Documento
    const hasDocNum = 'document_number' in formValues || activeFields.value.some((f) => f.name === 'document_number');
    if (hasDocNum) {
      const dt = getDocType();
      const docNum = String(formValues.document_number || '').trim();
      if (docNum) {
        if (dt === 'dni' && (docNum.length !== 8 || !/^\d{8}$/.test(docNum))) {
          await notify('warning', 'Validación de DNI', 'El DNI debe contener exactamente 8 dígitos numéricos.');
          return;
        }
        if (dt === 'ruc' && (docNum.length !== 11 || !/^\d{11}$/.test(docNum))) {
          await notify('warning', 'Validación de RUC', 'El RUC debe contener exactamente 11 dígitos numéricos.');
          return;
        }
        if (dt === 'ce' && (docNum.length < 4 || docNum.length > 12)) {
          await notify('warning', 'Validación de Carné de Extranjería', 'El Carné de Extranjería debe contener entre 4 y 12 caracteres alfanuméricos.');
          return;
        }
        if ((dt === 'pas' || dt === 'passport') && (docNum.length < 4 || docNum.length > 12)) {
          await notify('warning', 'Validación de Pasaporte', 'El Pasaporte debe contener entre 4 y 12 caracteres alfanuméricos.');
          return;
        }
      }
    }

    // Validación de Teléfono Celular (9 dígitos para Perú)
    const phoneVal = String(formValues.phone || '').trim();
    if (phoneVal && (phoneVal.length !== 9 || !/^\d{9}$/.test(phoneVal))) {
      await notify('warning', 'Validación de Teléfono', 'El teléfono celular debe contener exactamente 9 dígitos numéricos.');
      return;
    }

    // Validación de Formato de Correo
    const emailVal = String(formValues.email || '').trim();
    if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      await notify('warning', 'Validación de Correo', 'Por favor ingresa un correo electrónico válido.');
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
    resolveFieldType,
    resolveMaxlength,
    resolveMinlength,
    resolveInputmode,
    resolvePlaceholder,
    submit,
  };
}
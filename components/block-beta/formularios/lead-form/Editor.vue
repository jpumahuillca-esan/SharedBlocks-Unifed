<template>
  <div class="lf-editor">
    <!--
      Solo con el formulario en una columna FLOTANTE de la sección. Desde 1280px
      flota sobre el contenido; por debajo entra en el flujo como un bloque más, y
      aquí se decide debajo de cuál de los bloques de la sección.
    -->
    <section v-if="placement" class="lf-callout" data-edit-target="mobile_placement">
      <div class="lf-callout__head">
        <i class="las la-thumbtack"></i>
        <strong>Flotante a la {{ placement.side === 'start' ? 'izquierda' : 'derecha' }}</strong>
      </div>

      <label class="lf-label" for="lead-mobile-after">En tableta y móvil, mostrar debajo de</label>
      <select
        id="lead-mobile-after"
        class="form-select form-select-sm"
        :value="mobileAfterValue"
        @change="onMobileAfterChange"
      >
        <option :value="MOBILE_AFTER_START">Al inicio de la sección</option>
        <option v-for="anchor in placement.anchors" :key="anchor.id" :value="anchor.id">
          {{ anchor.label }}
        </option>
        <option value="">Al final de la sección</option>
      </select>
      <p class="lf-hint">Desde 1280px flota sobre el contenido y acompaña al scroll. Por debajo se coloca en este punto.</p>
    </section>

    <!-- Textos -->
    <section class="lf-section">
      <h6 class="lf-title">Textos</h6>

      <EditorText v-model="localForm.mainTitle" data-edit-target="mainTitle" label="Título principal" label-class="lf-label" />
      <EditorTextarea v-model="localForm.subTitle" data-edit-target="subTitle" label="Subtítulo" label-class="lf-label" :rows="2" />
      <EditorText v-model="localForm.button_text" data-edit-target="button_text" label="Texto del botón" label-class="lf-label" />
    </section>

    <!-- Integración: de dónde salen los campos y adónde llega el lead -->
    <section class="lf-section">
      <h6 class="lf-title">Integración</h6>

      <div class="lf-field-group">
        <label class="lf-label" for="lead-campaign">Campaña de marketing</label>
        <div class="lf-select-row">
          <select
            id="lead-campaign"
            class="form-select form-select-sm"
            v-model="localForm.campaign_id"
            data-edit-target="campaign_id"
            @change="handleCampaignChange"
            :disabled="loadingCampaigns"
          >
            <option :value="null">Ninguna (respuesta genérica)</option>
            <option v-for="c in campaigns" :key="c.id" :value="c.id">
              {{ c.name }} ({{ c.academic_period || 'General' }})
            </option>
          </select>
          <button class="lf-reload" type="button" @click="fetchCampaigns" :disabled="loadingCampaigns" title="Recargar campañas" aria-label="Recargar campañas">
            <i class="las la-sync" :class="{ 'la-spin': loadingCampaigns }"></i>
          </button>
        </div>
        <p class="lf-hint">Al elegir una campaña, los campos del formulario se reconstruyen según sus preguntas.</p>
      </div>

      <div class="lf-field-group">
        <div class="lf-label-row">
          <label class="lf-label" for="lead-program">Programa de estudio / carrera</label>
          <span v-if="selectedProgram" class="lf-pill">ID #{{ selectedProgram.id }}</span>
        </div>
        <div class="lf-select-row">
          <select
            id="lead-program"
            class="form-select form-select-sm"
            v-model="localForm.study_program_id"
            data-edit-target="study_program_id"
            :disabled="loadingPrograms"
          >
            <option :value="null">General (hereda de la campaña)</option>
            <option v-for="p in studyPrograms" :key="p.id" :value="p.id">
              {{ p.name }}
            </option>
          </select>
          <button class="lf-reload" type="button" @click="fetchStudyPrograms" :disabled="loadingPrograms" title="Recargar programas" aria-label="Recargar programas">
            <i class="las la-sync" :class="{ 'la-spin': loadingPrograms }"></i>
          </button>
        </div>
        <p class="lf-hint">Para que el lead y los correos reciban el nombre y el brochure del programa.</p>
      </div>

      <div class="lf-field-group">
        <label class="lf-label" for="lead-external">ID de campaña externa (CRM) <span class="lf-optional">Opcional</span></label>
        <input
          id="lead-external"
          type="text"
          class="form-control form-control-sm font-monospace"
          v-model="localForm.external_campaign_id"
          data-edit-target="external_campaign_id"
          placeholder="Ej: CMP-SF-2026-001"
        />
        <p class="lf-hint">Sobrescribe el ID de campaña del CRM. En blanco, hereda el de la campaña vinculada.</p>
      </div>

      <EditorText v-model="localForm.cod_form_old" data-edit-target="cod_form_old" label="ID de formulario legacy" label-class="lf-label" placeholder="Ej: 45" />
    </section>

    <!-- Campos que el formulario muestra ahora (solo lectura: salen de la campaña o del preset) -->
    <section class="lf-section">
      <div class="lf-title-row">
        <h6 class="lf-title">Campos del formulario <span class="lf-count">{{ localForm.fields.length }}</span></h6>
        <span v-if="selectedCampaign" class="lf-pill lf-pill--brand" :title="selectedCampaign.name">Campaña: {{ selectedCampaign.name }}</span>
        <span v-else class="lf-pill">Preset estándar ESAN</span>
      </div>

      <ul class="lf-fields">
        <li v-for="(f, idx) in localForm.fields" :key="idx" class="lf-fields__item">
          <div class="lf-fields__main">
            <strong>{{ f.label }}</strong>
            <span v-if="f.required" class="lf-req" title="Obligatorio">*</span>
          </div>
          <div class="lf-fields__meta">
            <code>{{ f.name }}</code>
            <span class="lf-chip">{{ f.type }}</span>
            <span v-if="f.validation_rule && f.validation_rule !== 'none'" class="lf-chip lf-chip--rule">
              {{ f.validation_rule === 'doc_dynamic' ? 'Doc dinámico' : f.validation_rule }}
            </span>
            <span v-if="f.max_length" class="lf-chip">{{ f.max_length }} car.</span>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch, onMounted } from 'vue';
import HttpClient from '@/helpers/http-client';
import { useAuthStore } from '@/stores/auth';
import { BLOCK_PLACEMENT_KEY } from '../../../../core/blockPlacement';
import { MOBILE_AFTER_START } from '../../../../core/sectionTypes';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import type { DynamicFormField } from './types/lead.types';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

/*
 * Colocación del bloque en la sección (core/blockPlacement.ts): solo existe si
 * el formulario está en una columna flotante. Sin inspector no hay contexto.
 */
const placementRef = inject(BLOCK_PLACEMENT_KEY, null);
const placement = computed(() => placementRef?.value ?? null);

/**
 * Un bloque elegido que ya no existe (se borró o se movió de columna) cuenta
 * como "al final", que es lo que hace el sitio; así el select nunca queda
 * mostrando una opción que no está en la lista.
 */
const mobileAfterValue = computed(() => {
  const current = placement.value?.mobileAfterBlockId ?? '';
  if (current === MOBILE_AFTER_START) return current;
  return placement.value?.anchors.some((a) => a.id === current) ? current : '';
});

const onMobileAfterChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  placement.value?.setMobileAfter(value || null);
};

const authStore = useAuthStore();
const campaigns = ref<any[]>([]);
const loadingCampaigns = ref(false);
const studyPrograms = ref<any[]>([]);
const loadingPrograms = ref(false);

const DEFAULT_FIELDS: DynamicFormField[] = [
  {
    name: 'document_type',
    label: 'Tipo de Documento',
    type: 'select',
    placeholder: '-- Seleccionar Tipo --',
    required: true,
    validation_rule: 'none',
    max_length: null,
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
  { name: 'first_name', label: 'Nombres', type: 'text', placeholder: 'Tus nombres', required: true, validation_rule: 'only_letters', max_length: 100, col_span: 6 },
  { name: 'last_name', label: 'Apellido Paterno', type: 'text', placeholder: 'Apellido paterno', required: true, validation_rule: 'only_letters', max_length: 100, col_span: 6 },
  { name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'correo@ejemplo.com', required: true, validation_rule: 'email', max_length: 150, col_span: 6 },
  { name: 'phone', label: 'Teléfono Celular', type: 'tel', placeholder: '999 999 999', required: true, validation_rule: 'phone_pe', max_length: 9, col_span: 6 },
];

const build = (source: any) => ({
  // Guardamos la unidad académica directamente en el contenido del bloque
  academic_unit_id: props.modelValue?.academic_unit_id ?? authStore.academicUnitId ?? null,
  campaign_id: props.modelValue?.campaign_id ?? null,
  external_campaign_id: props.modelValue?.external_campaign_id ?? null,
  study_program_id: props.modelValue?.study_program_id ? Number(props.modelValue.study_program_id) : null,
  mainTitle: props.modelValue?.mainTitle || '¡TRANSFORMA TU FUTURO! DA EL PRIMER PASO',
  subTitle: props.modelValue?.subTitle || 'Déjanos tus datos y un asesor resolverá todas tus consultas.',
  button_text: props.modelValue?.button_text || 'Enviar Solicitud',
  condition: props.modelValue?.condition || 'https://www.ue.edu.pe/pregrado/politica-de-privacidad',
  success_title: props.modelValue?.success_title || '¡Solicitud recibida!',
  success_message: props.modelValue?.success_message || 'Un asesor se pondrá en contacto muy pronto.',
  cod_form_old: props.modelValue?.cod_form_old || '',
  fields: Array.isArray(props.modelValue?.fields) && props.modelValue.fields.length > 0 
    ? [...props.modelValue.fields] 
    : [...DEFAULT_FIELDS]
});

const localForm = ref(build(props.modelValue));

/*
 * Contenido que llega desde fuera: deshacer/rehacer del constructor, una
 * plantilla o una revisión. Sin esto el panel se quedaba con lo que mostraba y,
 * peor, la siguiente edición volvía a emitir ese estado viejo encima del
 * restaurado. Mismo patrón (y misma guardia contra el bucle) que el resto de
 * editores.
 */
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return;
    const next = build(newVal);
    if (JSON.stringify(next) === JSON.stringify(localForm.value)) return;
    localForm.value = next;
  },
  { deep: true },
);

watch(localForm, (val) => emit('update:modelValue', { ...val }), { deep: true });

const selectedCampaign = computed(() => {
  return campaigns.value.find((c) => c.id === localForm.value.campaign_id) || null;
});

const selectedProgram = computed(() => {
  if (!localForm.value.study_program_id) return null;
  return studyPrograms.value.find((p) => p.id === Number(localForm.value.study_program_id)) || null;
});

const handleCampaignChange = () => {
  const camp = selectedCampaign.value;

  if (!camp) {
    // Si no hay campaña seleccionada, queda vinculado a la unidad del editor
    localForm.value.academic_unit_id = authStore.academicUnitId || null;
    localForm.value.fields = [...DEFAULT_FIELDS];
    return;
  }

  // 1. Sincroniza el academic_unit_id desde la campaña seleccionada
  localForm.value.academic_unit_id = camp.academic_unit_id;

  // 2. Si la campaña tiene external_campaign_id y no se configuró uno manual en el bloque, lo sugiere
  if (camp.external_campaign_id && !localForm.value.external_campaign_id) {
    localForm.value.external_campaign_id = camp.external_campaign_id;
  }

  // 2. Sincroniza o sugiere el programa de estudio de la campaña si está disponible
  if (camp.study_program_id && !localForm.value.study_program_id) {
    localForm.value.study_program_id = Number(camp.study_program_id);
  }

  // 3. Sincroniza los campos configurados en la campaña
  let parsedConfig: any = camp.form_config;
  if (typeof parsedConfig === 'string') {
    try { parsedConfig = JSON.parse(parsedConfig); } catch { parsedConfig = { fields: [] }; }
  }

  if (Array.isArray(parsedConfig?.fields) && parsedConfig.fields.length > 0) {
    localForm.value.fields = parsedConfig.fields.map((f: any) => ({
      name: f.name,
      label: f.label || f.name,
      type: f.type || 'text',
      placeholder: f.placeholder || '',
      required: Boolean(f.required),
      col_span: f.col_span || 6,
      validation_rule: f.validation_rule || (f.name === 'document_number' ? 'doc_dynamic' : f.name === 'phone' ? 'phone_pe' : (f.name === 'first_name' || f.name === 'last_name') ? 'only_letters' : f.type === 'email' ? 'email' : 'none'),
      max_length: f.max_length != null ? Number(f.max_length) : (f.name === 'document_number' ? 8 : f.name === 'phone' ? 9 : null),
      min_length: f.min_length != null ? Number(f.min_length) : null,
      options: f.options || []
    }));
  } else {
    localForm.value.fields = [...DEFAULT_FIELDS];
  }
};

const fetchCampaigns = async () => {
  loadingCampaigns.value = true;
  try {
    const res = await HttpClient.get('marketing/campaigns');
    campaigns.value = res.data?.data || res.data || [];
  } catch (e) {
    console.error('Error al listar campañas:', e);
  } finally {
    loadingCampaigns.value = false;
  }
};

const fetchStudyPrograms = async () => {
  loadingPrograms.value = true;
  try {
    const unitId = localForm.value.academic_unit_id || authStore.academicUnitId;
    const res = await HttpClient.get('study-programs/selection', {
      params: { academic_unit_id: unitId }
    });
    studyPrograms.value = res.data?.data || res.data || [];
  } catch (e) {
    console.error('Error al listar programas de estudio:', e);
  } finally {
    loadingPrograms.value = false;
  }
};

watch(() => localForm.value.academic_unit_id, (newUnit) => {
  if (newUnit) {
    fetchStudyPrograms();
  }
});

onMounted(() => {
  fetchCampaigns();
  fetchStudyPrograms();
});
</script>

<style scoped>
/*
 * Editor del formulario de captación. Secciones planas, sin cajas dentro de
 * cajas: el panel ya trae su propio relleno y, con tarjetas anidadas, los
 * controles quedaban en ~230px (selectores cortados, etiquetas partidas en dos).
 * Los colores salen de la paleta del editor (--ed-*), declarada en PageEditor.
 */
.lf-editor {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.lf-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.lf-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--ed-border, #e6e9ef);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ed-text, #1f2733);
}

/* Título con insignia: el filete lo lleva la fila y no el título. */
.lf-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--ed-border, #e6e9ef);
}

.lf-title-row .lf-title {
  flex: 1 1 auto;
  min-width: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.lf-count {
  padding: 1px 7px;
  border-radius: 999px;
  background: var(--ed-surface-muted, #f4f6fa);
  color: var(--ed-muted, #6b7688);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0;
}

.lf-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* `:deep`: las etiquetas de EditorText/EditorTextarea las dibuja el componente hijo, que los estilos con ámbito no alcanzan. */
.lf-editor :deep(.lf-label) {
  display: block;
  margin: 0 0 2px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ed-text, #1f2733);
}

.lf-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.lf-optional {
  margin-left: 4px;
  font-size: 10.5px;
  font-weight: 500;
  color: var(--ed-muted, #6b7688);
}

.lf-hint {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--ed-muted, #6b7688);
}

.lf-select-row {
  display: flex;
  align-items: stretch;
  gap: 6px;
}

.lf-select-row .form-select {
  flex: 1 1 auto;
  min-width: 0;
}

.lf-reload {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  border: 1px solid var(--ed-border-strong, #c6cedb);
  border-radius: var(--ed-radius-sm, 7px);
  background: var(--ed-surface, #fff);
  color: var(--ed-muted, #6b7688);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.lf-reload:hover:not(:disabled) {
  background: var(--ed-surface-muted, #f4f6fa);
  color: var(--ed-text, #1f2733);
}

.lf-reload:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Colocación flotante: aviso destacado, con el color informativo del editor. */
.lf-callout {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border: 1px solid var(--ed-info, #0d6efd);
  border-radius: var(--ed-radius-sm, 7px);
  background: var(--ed-info-soft, rgba(13, 110, 253, 0.07));
}

.lf-callout__head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--ed-text, #1f2733);
}

.lf-callout__head i {
  color: var(--ed-info, #0d6efd);
}

.lf-pill {
  flex: none;
  max-width: 100%;
  overflow: hidden;
  padding: 2px 9px;
  border-radius: 999px;
  background: var(--ed-surface-muted, #f4f6fa);
  border: 1px solid var(--ed-border, #e6e9ef);
  color: var(--ed-muted, #6b7688);
  font-size: 10.5px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lf-pill--brand {
  background: var(--ed-accent-soft, rgba(227, 17, 64, 0.09));
  border-color: transparent;
  color: var(--ed-accent, #e31140);
}

/* Lista de campos: etiqueta arriba y sus datos técnicos debajo, cada fila con aire. */
.lf-fields {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  max-height: 320px;
  overflow-y: auto;
  list-style: none;
  border: 1px solid var(--ed-border, #e6e9ef);
  border-radius: var(--ed-radius-sm, 7px);
  background: var(--ed-surface, #fff);
}

.lf-fields__item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 9px 12px;
}

.lf-fields__item + .lf-fields__item {
  border-top: 1px solid var(--ed-border, #e6e9ef);
}

.lf-fields__main {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 13px;
  color: var(--ed-text, #1f2733);
}

.lf-req {
  color: var(--ed-accent, #e31140);
  font-weight: 700;
}

.lf-fields__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
}

.lf-fields__meta code {
  margin-right: 2px;
  padding: 0;
  background: none;
  color: var(--ed-muted, #6b7688);
  font-size: 11px;
}

.lf-chip {
  padding: 1px 7px;
  border-radius: 4px;
  background: var(--ed-surface-muted, #f4f6fa);
  border: 1px solid var(--ed-border, #e6e9ef);
  color: var(--ed-muted, #6b7688);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10.5px;
}

.lf-chip--rule {
  background: var(--ed-info-soft, rgba(13, 110, 253, 0.07));
  border-color: transparent;
  color: var(--ed-info, #0d6efd);
}
</style>

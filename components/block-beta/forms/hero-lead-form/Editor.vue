<template>
  <div class="arcis-form-editor card border-0 shadow-sm mb-3">
    <div class="card-body p-3">
      <h6 class="fw-bold mb-3 d-flex align-items-center gap-2" style="color: var(--arcis-color-global-main);">
        <i class="las la-sliders-h fs-18"></i> Configuración del Bloque de Captación
      </h6>

      <!-- Selector de Campaña Dinámica -->
      <div class="p-3 rounded mb-3 border" style="background-color: var(--neutrals-50); border-color: var(--neutrals-300);">
        <label class="small fw-bold d-block mb-1" style="color: var(--arcis-color-text-primary);">
          Vincular Campaña de Marketing
        </label>
        
        <div class="d-flex gap-2">
          <select 
            class="form-select form-select-sm"
            v-model="localForm.campaign_id" 
            @change="handleCampaignChange"
            :disabled="loadingCampaigns"
          >
            <option :value="null">-- Ninguna (Respuesta Genérica / Fallback) --</option>
            <option v-for="c in campaigns" :key="c.id" :value="c.id">
              {{ c.name }} ({{ c.academic_period || 'General' }})
            </option>
          </select>
          <button class="btn btn-sm btn-outline-secondary" type="button" @click="fetchCampaigns" :disabled="loadingCampaigns" title="Recargar campañas">
            <i class="las la-sync" :class="{ 'la-spin': loadingCampaigns }"></i>
          </button>
        </div>

        <small class="text-muted d-block mt-1" style="font-size: 0.72rem;">
          Al seleccionar una campaña, los campos del formulario se reconstruirán automáticamente según las preguntas configuradas.
        </small>
      </div>

      <!-- Selector de Programa de Estudio / Carrera -->
      <div class="p-3 rounded mb-3 border" style="background-color: var(--neutrals-50); border-color: var(--neutrals-300);">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <label class="small fw-bold mb-0" style="color: var(--arcis-color-text-primary);">
            Vincular Programa de Estudio / Carrera
          </label>
          <span v-if="selectedProgram" class="badge bg-primary text-white small" style="font-size: 0.7rem;">
            ID #{{ selectedProgram.id }}
          </span>
        </div>
        
        <div class="d-flex gap-2">
          <select 
            class="form-select form-select-sm"
            v-model="localForm.study_program_id" 
            :disabled="loadingPrograms"
          >
            <option :value="null">-- General (Sin programa fijo / Auto-heredar de Campaña) --</option>
            <option v-for="p in studyPrograms" :key="p.id" :value="p.id">
              {{ p.name }}
            </option>
          </select>
          <button class="btn btn-sm btn-outline-secondary" type="button" @click="fetchStudyPrograms" :disabled="loadingPrograms" title="Recargar programas">
            <i class="las la-sync" :class="{ 'la-spin': loadingPrograms }"></i>
          </button>
        </div>

        <small class="text-muted d-block mt-1" style="font-size: 0.72rem;">
          Permite vincular este formulario a una carrera o posgrado específico para que el lead y las plantillas Blade de correo reciban automáticamente el nombre y brochure del programa.
        </small>
      </div>

      <!-- Inspección de Campos Inyectados -->
      <div class="p-2 rounded mb-3 border" style="background-color: var(--neutrals-100);">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="small fw-bold" style="color: var(--arcis-color-text-secondary);">
            Campos del Formulario Activo ({{ localForm.fields.length }})
          </span>
          <span v-if="selectedCampaign" class="badge bg-danger text-white">Campaña: {{ selectedCampaign.name }}</span>
          <span v-else class="badge bg-secondary text-white">Preset Estándar ESAN</span>
        </div>

        <ul class="list-group list-group-flush border rounded bg-white" style="max-height: 180px; overflow-y: auto;">
          <li v-for="(f, idx) in localForm.fields" :key="idx" class="list-group-item d-flex justify-content-between align-items-center py-1 px-2 small">
            <div>
              <strong>{{ f.label }}</strong> 
              <code class="text-muted ms-1">({{ f.name }})</code>
            </div>
            <div class="d-flex align-items-center gap-1">
              <span class="badge bg-light text-dark border">{{ f.type }}</span>
              <span v-if="f.required" class="badge bg-danger">Requerido</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- Controles de Textos y Títulos -->
      <div class="row g-2 mb-3">
        <div class="col-12">
          <label class="small text-muted mb-1">Título Principal</label>
          <input type="text" class="form-control form-control-sm" v-model="localForm.mainTitle" />
        </div>
        <div class="col-12">
          <label class="small text-muted mb-1">Subtítulo Descriptivo</label>
          <textarea class="form-control form-control-sm" rows="2" v-model="localForm.subTitle"></textarea>
        </div>
        <div class="col-6">
          <label class="small text-muted mb-1">Texto del Botón</label>
          <input type="text" class="form-control form-control-sm" v-model="localForm.button_text" />
        </div>
        <div class="col-6">
          <label class="small text-muted mb-1">ID Formulario Legacy</label>
          <input type="text" class="form-control form-control-sm" v-model="localForm.cod_form_old" placeholder="Ej: 45" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import HttpClient from '@/helpers/http-client';
import { useAuthStore } from '@/stores/auth';
import type { DynamicFormField } from './types/lead.types';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const authStore = useAuthStore();
const campaigns = ref<any[]>([]);
const loadingCampaigns = ref(false);
const studyPrograms = ref<any[]>([]);
const loadingPrograms = ref(false);

const DEFAULT_FIELDS: DynamicFormField[] = [
  { name: 'first_name', label: 'Nombres', type: 'text', placeholder: 'Tus nombres', required: true, col_span: 6 },
  { name: 'last_name', label: 'Apellido Paterno', type: 'text', placeholder: 'Apellido paterno', required: true, col_span: 6 },
  //{ name: 'apellido_materno', label: 'Apellido Materno', type: 'text', placeholder: 'Apellido materno', required: true, col_span: 6 },
  { name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'correo@ejemplo.com', required: true, col_span: 6 },
  { name: 'phone', label: 'Teléfono Celular', type: 'tel', placeholder: '999 999 999', required: true, col_span: 6 },
  { name: 'document_number', label: 'N° Documento (DNI/CE)', type: 'text', placeholder: 'Documento', required: true, col_span: 6 },
];

const localForm = ref({
  // Guardamos la unidad académica directamente en el contenido del bloque
  academic_unit_id: props.modelValue?.academic_unit_id ?? authStore.academicUnitId ?? null,
  campaign_id: props.modelValue?.campaign_id ?? null,
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
<template>
  <div class="cert-programs-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado de sección</h6>

    <EditorText
      v-model="localData.eyebrow"
      data-edit-target="eyebrow"
      class="mb-2"
      label="Antetítulo (opcional)"
      :maxlength="rules.eyebrow.maxLength"
      placeholder="Extended Learning"
    />

    <EditorText
      v-model="localData.title"
      data-edit-target="title"
      class="mb-3"
      label="Título de la sección"
      :maxlength="rules.title.maxLength"
      placeholder="Certificaciones disponibles:"
    />

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Programas / Niveles (Acordeón)</h6>
      <span class="badge bg-secondary">{{ localData.programs.length }}/{{ rules.maxPrograms }}</span>
    </div>
    <p class="cp-hint">
      Cada ítem despliega descripción, metodología, acciones, listados y tabla general.
    </p>

    <CardAccordionItem
      v-for="(prog, pIdx) in localData.programs"
      :key="prog.id"
      :edit-key="`programs.${pIdx}`"
      :title="`${prog.number || ''} ${prog.title || `Programa ${pIdx + 1}`}`.trim()"
      :index="pIdx"
      :total="localData.programs.length"
      :open="openIndex === pIdx"
      remove-label="Quitar certificación"
      @toggle="toggle(pIdx)"
      @move="moveProgram(pIdx, $event)"
      @remove="removeProgram(pIdx)"
    >
      <div>
        <div class="row g-2 mb-2">
          <div class="col-4">
            <EditorText
              v-model="prog.number"
              data-edit-target=".number"
              label="N°"
              :maxlength="rules.program.number.maxLength"
              placeholder="01"
            />
          </div>
          <div class="col-8 d-flex align-items-end">
            <div class="form-check form-switch mb-1">
              <input
                :id="`cp-open-${prog.id}`"
                v-model="prog.defaultOpen"
                type="checkbox"
                class="form-check-input"
              />
              <label :for="`cp-open-${prog.id}`" class="form-check-label small fw-semibold">
                Abierto por defecto
              </label>
            </div>
          </div>
        </div>

        <EditorText
          v-model="prog.title"
          data-edit-target=".title"
          class="mb-2"
          label="Título del programa / nivel"
          :maxlength="rules.program.title.maxLength"
          placeholder="Certificación en analítica empresarial..."
        />

        <EditorTextarea
          v-model="prog.description"
          data-edit-target=".description"
          class="mb-2"
          label="Descripción introductoria (opcional)"
          :rows="3"
          :maxlength="rules.program.description.maxLength"
          hint="Separa párrafos con Enter doble. Usa **texto** para resaltar en negrita."
        />

        <EditorText
          v-model="prog.methodologyTitle"
          data-edit-target=".methodologyTitle"
          class="mb-2"
          label="Subtítulo de Metodología (opcional)"
          :maxlength="rules.program.methodologyTitle.maxLength"
          placeholder="Metodología"
        />

        <EditorTextarea
          v-model="prog.methodologyText"
          data-edit-target=".methodologyText"
          class="mb-3"
          label="Texto de Metodología (opcional)"
          :rows="2"
          :maxlength="rules.program.methodologyText.maxLength"
        />

        <!-- Botón / Enlace de calendario y enlace secundario -->
        <div class="cp-subbox mb-3">
          <span class="cp-subbox__label">Acciones dentro del acordeón</span>

          <EditorText
            v-model="prog.calendarLabel"
            data-edit-target=".calendarLabel"
            class="mb-2"
            label="Etiqueta calendario (opcional)"
            :maxlength="rules.program.actionLabel.maxLength"
            placeholder="Ver calendario de clases"
          />

          <div v-if="prog.calendarLabel" class="mb-2">
            <EditorUrl
              v-model="prog.calendarUrl"
              v-model:target="prog.calendarTarget"
              class="mb-2"
              label="URL del calendario / PDF"
              placeholder="/storage/media/...pdf o https://..."
            />

            <label class="form-label small fw-semibold mb-1">Estilo del botón calendario</label>
            <div class="btn-group w-100" role="group">
              <button
                type="button"
                class="btn btn-sm"
                :class="prog.calendarVariant === 'link' ? 'btn-secondary' : 'btn-outline-secondary'"
                @click="prog.calendarVariant = 'link'"
              >
                Enlace con ícono
              </button>
              <button
                type="button"
                class="btn btn-sm"
                :class="prog.calendarVariant === 'outline' ? 'btn-secondary' : 'btn-outline-secondary'"
                @click="prog.calendarVariant = 'outline'"
              >
                Botón outline (CFA)
              </button>
            </div>
          </div>

          <EditorText
            v-model="prog.secondaryActionLabel"
            data-edit-target=".secondaryActionLabel"
            class="mb-2"
            label="Segundo enlace con flecha (opcional)"
            :maxlength="rules.program.actionLabel.maxLength"
            placeholder="Beneficios de la certificación"
          />

          <EditorUrl
            v-if="prog.secondaryActionLabel"
            v-model="prog.secondaryActionUrl"
            v-model:target="prog.secondaryActionTarget"
            label="URL segundo enlace"
            placeholder="#beneficios o /universidad/..."
          />
        </div>

        <!-- Secciones de listas con viñeta cuadrada roja -->
        <div class="cp-subbox mb-3">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="cp-subbox__label m-0">Listas con viñeta roja</span>
            <button
              v-if="prog.bulletSections.length < rules.maxBulletSections"
              type="button"
              class="btn btn-xs btn-outline-danger py-0 px-2"
              style="font-size: 11px;"
              @click="addBulletSection(prog)"
            >
              + Lista
            </button>
          </div>

          <div
            v-for="(sec, sIdx) in prog.bulletSections"
            :key="sec.id"
            class="cp-nested-card mb-2"
          >
            <div class="d-flex justify-content-between align-items-center mb-1">
              <strong class="small">Lista {{ sIdx + 1 }}</strong>
              <button
                type="button"
                class="btn btn-link btn-sm text-danger p-0"
                title="Quitar lista"
                @click="prog.bulletSections.splice(sIdx, 1)"
              >
                <i class="las la-trash"></i>
              </button>
            </div>

            <EditorText
              v-model="sec.title"
              class="mb-2"
              label="Título de la lista"
              :maxlength="rules.program.sectionTitle.maxLength"
              placeholder="Objetivos de aprendizaje / Cursos y Talleres"
            />

            <label class="form-label small fw-semibold mb-1">Ítems (uno por línea)</label>
            <textarea
              :value="sec.items.join('\n')"
              class="form-control form-control-sm"
              rows="4"
              placeholder="Un ítem por línea..."
              @input="updateBulletItems(sec, ($event.target as HTMLTextAreaElement).value)"
            ></textarea>
          </div>
        </div>

        <!-- Tabla de Información general -->
        <div class="cp-subbox">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="cp-subbox__label m-0">Tabla de Información General</span>
            <button
              v-if="prog.infoRows.length < rules.maxInfoRows"
              type="button"
              class="btn btn-xs btn-outline-danger py-0 px-2"
              style="font-size: 11px;"
              @click="addInfoRow(prog)"
            >
              + Fila
            </button>
          </div>

          <EditorText
            v-model="prog.infoTitle"
            data-edit-target=".infoTitle"
            class="mb-2"
            label="Título de tabla"
            :maxlength="rules.program.infoTitle.maxLength"
            placeholder="Información general"
          />

          <div
            v-for="(row, rIdx) in prog.infoRows"
            :key="row.id"
            class="cp-nested-card mb-2"
          >
            <div class="d-flex justify-content-between align-items-center mb-1">
              <strong class="small text-truncate">{{ row.label || `Fila ${rIdx + 1}` }}</strong>
              <button
                type="button"
                class="btn btn-link btn-sm text-danger p-0"
                title="Quitar fila"
                @click="prog.infoRows.splice(rIdx, 1)"
              >
                <i class="las la-trash"></i>
              </button>
            </div>

            <EditorText
              v-model="row.label"
              class="mb-1"
              label="Etiqueta izquierda"
              :maxlength="rules.program.rowLabel.maxLength"
              placeholder="Inversión:"
            />

            <EditorTextarea
              v-model="row.value"
              class="mb-1"
              label="Valor"
              :rows="2"
              :maxlength="rules.program.rowValue.maxLength"
              hint="Para viñetas (ej. CFA Standard/Premium), escribe una opción por línea iniciando con '- '."
            />

            <select v-model="row.valueStyle" class="form-select form-select-sm">
              <option value="auto">Estilo automático</option>
              <option value="display">Destacado (18px Display)</option>
              <option value="body">Párrafo (16px Base)</option>
              <option value="bullets">Lista con viñetas (multilínea)</option>
            </select>
          </div>
        </div>
      </div>
    </CardAccordionItem>

    <button
      v-if="localData.programs.length < rules.maxPrograms"
      type="button"
      class="btn btn-sm btn-danger w-100 mt-1 mb-3"
      @click="addProgram"
    >
      <i class="las la-plus me-1"></i> Agregar certificación / nivel
    </button>

    <hr />

    <!-- Banda de Formas de Pago (PowerPay) -->
    <div class="form-check form-switch mb-2">
      <input
        id="cp-show-payment"
        v-model="localData.showPaymentMethods"
        type="checkbox"
        class="form-check-input"
      />
      <label for="cp-show-payment" class="form-check-label small fw-bold text-uppercase">
        Mostrar Formas de Pago (PowerPay)
      </label>
    </div>

    <div v-if="localData.showPaymentMethods" class="ps-2 border-start border-2 mb-3">
      <EditorText
        v-model="localData.paymentLabel"
        data-edit-target="paymentLabel"
        class="mb-2"
        label="Etiqueta izquierda"
        :maxlength="rules.paymentLabel.maxLength"
        placeholder="Formas de pago:"
      />

      <EditorTextarea
        v-model="localData.paymentText"
        data-edit-target="paymentText"
        class="mb-2"
        label="Descripción del medio de pago"
        :rows="2"
        :maxlength="rules.paymentText.maxLength"
        placeholder="Realiza tu pago con Power Pay en 3 cuotas sin intereses"
      />

      <EditorImage
        v-model="paymentLogoProxy"
        data-edit-target="paymentLogo"
        class="mb-2"
        label="Logo de medio de pago (opcional, usa PowerPay por defecto)"
      />

      <EditorText
        v-model="localData.paymentLogoAlt"
        label="Texto alternativo del logo"
        :maxlength="rules.paymentLogoAlt.maxLength"
        placeholder="PowerPay"
      />
    </div>

    <hr />

    <EditorTextarea
      v-model="localData.footnotes"
      data-edit-target="footnotes"
      label="Notas legales al pie (**)"
      :rows="4"
      :maxlength="rules.footnotes.maxLength"
      hint="Cada salto de línea genera una nota independiente al pie del bloque."
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import { stripBundledAssetForStorage } from '../../../../helpers/bundledAssets';
import {
  CERTIFICATION_PROGRAMS_RULES,
  POWERPAY_DEFAULT_LOGO,
  createEmptyCertificationProgram,
  normalizeCertificationProgramsData,
  resolvePaymentLogoUrl,
  type CertificationBulletSection,
  type CertificationProgramItem,
  type CertificationProgramsData,
} from './types';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);
const rules = CERTIFICATION_PROGRAMS_RULES;

const localData = reactive<CertificationProgramsData>(
  normalizeCertificationProgramsData(props.modelValue),
);
const openIndex = ref<number | null>(0);
let syncing = false;

const paymentLogoProxy = computed({
  get: () => resolvePaymentLogoUrl(localData.paymentLogo),
  set: (val: string) => {
    localData.paymentLogo = stripBundledAssetForStorage(val, [POWERPAY_DEFAULT_LOGO]);
  },
});

watch(
  () => props.modelValue,
  (val) => {
    const next = normalizeCertificationProgramsData(val);
    if (JSON.stringify(next) === JSON.stringify(localData)) return;
    syncing = true;
    Object.assign(localData, next);
    syncing = false;
  },
  { deep: true },
);

watch(
  localData,
  (val) => {
    if (syncing) return;
    emit('update:modelValue', JSON.parse(JSON.stringify(val)));
  },
  { deep: true },
);

const toggle = (idx: number) => {
  openIndex.value = openIndex.value === idx ? null : idx;
};

const addProgram = () => {
  if (localData.programs.length >= rules.maxPrograms) return;
  localData.programs.push(createEmptyCertificationProgram(localData.programs.length));
  openIndex.value = localData.programs.length - 1;
};

const removeProgram = (idx: number) => {
  localData.programs.splice(idx, 1);
  if (openIndex.value === idx) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > idx) openIndex.value -= 1;
};

const moveProgram = (idx: number, delta: number) => {
  const target = idx + delta;
  if (target < 0 || target >= localData.programs.length) return;
  const [moved] = localData.programs.splice(idx, 1);
  localData.programs.splice(target, 0, moved);
  openIndex.value = target;
};

const addBulletSection = (prog: CertificationProgramItem) => {
  if (prog.bulletSections.length >= rules.maxBulletSections) return;
  prog.bulletSections.push({
    id: `cert-sec-${Date.now().toString(36)}`,
    title: 'Objetivos de aprendizaje',
    items: ['Nuevo ítem'],
  });
};

const updateBulletItems = (sec: CertificationBulletSection, raw: string) => {
  sec.items = raw
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+$/, ''))
    .filter((line) => line.trim().length > 0);
};

const addInfoRow = (prog: CertificationProgramItem) => {
  if (prog.infoRows.length >= rules.maxInfoRows) return;
  prog.infoRows.push({
    id: `cert-row-${Date.now().toString(36)}`,
    label: 'Campo:',
    value: 'Detalle',
    valueStyle: 'auto',
  });
};
</script>

<style scoped>
.cp-hint {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
}

.cp-subbox {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 10px;
}

.cp-subbox__label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #475569;
  margin-bottom: 8px;
}

.cp-nested-card {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 8px;
}
</style>

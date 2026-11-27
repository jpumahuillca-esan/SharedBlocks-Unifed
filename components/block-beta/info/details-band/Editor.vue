<template>
  <div class="db-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado</h6>

    <EditorText
      v-model="localData.eyebrow"
      data-edit-target="eyebrow"
      class="mb-2"
      label="Antetítulo (opcional)"
      :maxlength="rules.eyebrow.maxLength"
      placeholder="Extended Learning"
    />

    <EditorTextarea
      v-model="localData.title"
      data-edit-target="title"
      class="mb-3"
      label="Título de la franja"
      :rows="2"
      :maxlength="rules.title.maxLength"
      placeholder="¿A quién va dirigido Extended Learning?"
    />

    <hr />

    <h6 class="fw-bold small text-uppercase mb-2">Apariencia y disposición</h6>

    <EditorBrandColor
      v-model="localData.colorToken"
      data-edit-target="colorToken"
      class="mb-3"
      label="Color de fondo"
    />

    <div class="mb-3">
      <label class="form-label small fw-bold d-block">Ancho de lectura en escritorio</label>
      <div class="btn-group w-100" role="group" aria-label="Ancho de lectura">
        <button
          v-for="opt in WIDTH_OPTIONS"
          :key="opt.value"
          type="button"
          class="btn btn-sm"
          :class="localData.contentWidth === opt.value ? 'btn-secondary' : 'btn-outline-secondary'"
          @click="localData.contentWidth = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
      <p class="db-hint mt-1">
        "Compacto (838px)" deja el espacio libre a la derecha cuando se combina bajo un Hero con formulario flotante.
      </p>
    </div>

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Perfiles / Puntos clave</h6>
      <span class="badge bg-secondary">{{ localData.items.length }}/{{ rules.maxItems }}</span>
    </div>
    <p class="db-hint">
      Se muestran en 2 columnas en PC/Tablet y apilados en móvil.
    </p>

    <CardAccordionItem
      v-for="(item, index) in localData.items"
      :key="item.id"
      :edit-key="`items.${index}`"
      :title="item.title || `Detalle ${index + 1}`"
      :index="index"
      :total="localData.items.length"
      :open="openIndex === index"
      remove-label="Quitar detalle"
      @toggle="toggle(index)"
      @move="moveItem(index, $event)"
      @remove="removeItem(index)"
    >
      <div>
        <EditorIcon
          v-model="item.icon"
          data-edit-target=".icon"
          class="mb-2"
          label="Ícono (opcional)"
          hint="Opcional (32×32 px). Déjalo vacío para ocultarlo."
        />

        <EditorText
          v-model="item.title"
          data-edit-target=".title"
          class="mb-2"
          label="Título"
          :maxlength="rules.item.title.maxLength"
          placeholder="A futuros profesionales"
        />

        <EditorTextarea
          v-model="item.desc"
          data-edit-target=".desc"
          class="mb-1"
          label="Descripción"
          :rows="3"
          :maxlength="rules.item.desc.maxLength"
          placeholder="Si eres estudiante y deseas fortalecer tus habilidades..."
        />
      </div>
    </CardAccordionItem>

    <button
      type="button"
      class="btn btn-sm btn-danger w-100 mt-2"
      :disabled="localData.items.length >= rules.maxItems"
      @click="addItem"
    >
      <i class="las la-plus me-1"></i> Agregar detalle
    </button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import EditorIcon from '../../../editor-beta/EditorIcon/EditorIcon.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import {
  DETAILS_BAND_CONTENT_RULES,
  createEmptyDetailsBandItem,
  normalizeDetailsBandData,
  type DetailsBandContentWidth,
} from './types';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const rules = DETAILS_BAND_CONTENT_RULES;
const localData = reactive(normalizeDetailsBandData(props.modelValue));
const openIndex = ref<number | null>(0);

const WIDTH_OPTIONS: Array<{ value: DetailsBandContentWidth; label: string }> = [
  { value: 'full', label: 'Completo (100%)' },
  { value: 'wide', label: 'Compacto (838px)' },
];

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addItem = () => {
  if (localData.items.length >= rules.maxItems) return;
  localData.items.push(createEmptyDetailsBandItem());
  openIndex.value = localData.items.length - 1;
};

const removeItem = (index: number) => {
  localData.items.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveItem = (index: number, delta: number) => {
  const target = index + delta;
  if (target < 0 || target >= localData.items.length) return;
  const [moved] = localData.items.splice(index, 1);
  localData.items.splice(target, 0, moved);
  if (openIndex.value === index) openIndex.value = target;
};

watch(
  localData,
  (val) => emit('update:modelValue', JSON.parse(JSON.stringify(val))),
  { deep: true },
);
</script>

<style scoped>
.db-hint {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
}
</style>

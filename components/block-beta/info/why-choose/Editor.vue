<template>
  <div class="wc-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado</h6>

    <EditorText
      v-model="localData.eyebrow"
      data-edit-target="eyebrow"
      class="mb-2"
      label="Antetítulo (opcional)"
      :maxlength="80"
      placeholder="Extended Learning"
    />

    <EditorTextarea
      v-model="localData.title"
      data-edit-target="title"
      class="mb-2"
      label="Título"
      :rows="2"
      :maxlength="140"
      placeholder="Por qué elegir estos cursos"
    />

    <EditorTextarea
      v-model="localData.desc"
      data-edit-target="desc"
      class="mb-3"
      label="Subtítulo / descripción"
      :rows="3"
      :maxlength="320"
      placeholder="Aprenderás con casos reales, cerca de las empresas y con un programa de habilidades blandas."
    />

    <hr />

    <h6 class="fw-bold small text-uppercase mb-2">Fondo e imagen lateral</h6>

    <EditorBrandColor
      v-model="localData.colorToken"
      data-edit-target="colorToken"
      class="mb-2"
      label="Color de superficie"
    />
    <button
      v-if="localData.colorToken !== DEFAULT_WHY_CHOOSE_BG_COLOR"
      type="button"
      class="btn btn-sm btn-outline-secondary w-100 mb-3"
      @click="localData.colorToken = DEFAULT_WHY_CHOOSE_BG_COLOR"
    >
      Restaurar azul institucional oscuro (#1A2B3C)
    </button>

    <div class="form-check form-switch mb-2">
      <input
        id="wc-default-blueprint"
        v-model="localData.useDefaultBlueprint"
        type="checkbox"
        class="form-check-input"
      />
      <label for="wc-default-blueprint" class="form-check-label small fw-semibold">
        Usar textura wireframe ESAN por defecto
      </label>
    </div>

    <div class="mb-2">
      <div class="d-flex justify-content-between small fw-semibold mb-1">
        <label for="wc-overlay-opacity">Opacidad de la textura de fondo</label>
        <span>{{ localData.overlayOpacity }}%</span>
      </div>
      <input
        id="wc-overlay-opacity"
        v-model.number="localData.overlayOpacity"
        type="range"
        class="form-range"
        min="0"
        max="100"
        step="5"
      />
    </div>

    <EditorImage
      v-model="localData.backgroundImage"
      fit="cover"
      noun="textura"
      :height="72"
      class="mb-3"
      label="Textura de fondo personalizada (opcional)"
      @select="$emit('select-image', { item: localData, field: 'backgroundImage' })"
    />

    <EditorImage
      v-model="localData.image"
      v-model:alt="localData.imageAlt"
      data-edit-target="image"
      alt-edit-target="imageAlt"
      class="mb-2"
      label="Fotografía derecha (Desktop) / inferior (Móvil)"
      @select="$emit('select-image', { item: localData, field: 'image' })"
    />

    <div class="form-check form-switch mb-3">
      <input
        id="wc-hide-tablet-img"
        v-model="localData.hideImageOnTablet"
        type="checkbox"
        class="form-check-input"
      />
      <label for="wc-hide-tablet-img" class="form-check-label small">
        Ocultar fotografía en Tablet (Figma 768px)
      </label>
    </div>

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Razones / Beneficios (2×2)</h6>
      <span class="badge bg-secondary">{{ localData.items.length }}</span>
    </div>
    <p class="wc-hint">
      Usa pictogramas del sistema de diseño (AtomPictogram, 64×64 px).
    </p>

    <CardAccordionItem
      v-for="(item, index) in localData.items"
      :key="item.id"
      :edit-key="`items.${index}`"
      :title="item.title || `Razón ${index + 1}`"
      :index="index"
      :total="localData.items.length"
      :open="openIndex === index"
      remove-label="Quitar razón"
      @toggle="toggle(index)"
      @move="moveItem(index, $event)"
      @remove="removeItem(index)"
    >
      <div>
        <EditorPictogram
          v-model="item.pictogram"
          data-edit-target=".pictogram"
          class="mb-3"
          label="Pictograma"
          :optional="false"
          preview-surface="dark"
        />

        <EditorText
          v-model="item.title"
          data-edit-target=".title"
          class="mb-2"
          label="Título"
          :maxlength="100"
          placeholder="Cursos cortos"
        />

        <EditorTextarea
          v-model="item.desc"
          data-edit-target=".desc"
          class="mb-1"
          label="Descripción"
          :rows="2"
          :maxlength="200"
          placeholder="Aprende rápido y aplica de inmediato."
        />
      </div>
    </CardAccordionItem>

    <button
      type="button"
      class="btn btn-sm btn-danger w-100 mt-2"
      @click="addItem"
    >
      <i class="las la-plus me-1"></i> Agregar beneficio
    </button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorPictogram from '../../../editor-beta/EditorPictogram/EditorPictogram.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import {
  DEFAULT_WHY_CHOOSE_BG_COLOR,
  createEmptyWhyChooseItem,
  normalizeWhyChooseData,
} from './types';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = reactive(normalizeWhyChooseData(props.modelValue));
const openIndex = ref<number | null>(0);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addItem = () => {
  localData.items.push(createEmptyWhyChooseItem());
  openIndex.value = localData.items.length - 1;
};

const removeItem = (index: number) => {
  localData.items.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveItem = (index: number, dir: number) => {
  const target = index + dir;
  if (target < 0 || target >= localData.items.length) return;
  const [moved] = localData.items.splice(index, 1);
  localData.items.splice(target, 0, moved);
  openIndex.value = target;
};

watch(
  localData,
  (val) => emit('update:modelValue', JSON.parse(JSON.stringify(val))),
  { deep: true },
);
</script>

<style scoped>
.wc-hint {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
}

.wc-pictogram-preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  border-radius: 6px;
  background-color: #1A2B3C;
}
</style>

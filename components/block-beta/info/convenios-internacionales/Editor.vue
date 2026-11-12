<template>
  <div class="conv-dpa-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado</h6>

    <EditorText
      v-model="localData.eyebrow"
      data-edit-target="eyebrow"
      class="mb-2"
      label="Antetítulo"
      :maxlength="80"
      placeholder="internacionalización"
    />

    <EditorTextarea
      v-model="localData.title"
      data-edit-target="title"
      class="mb-3"
      label="Título"
      :rows="2"
      :maxlength="140"
      placeholder="Convenios académicos internacionales"
    />

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Tarjetas de Convenios</h6>
      <span class="badge bg-secondary">{{ localData.cards.length }}</span>
    </div>

    <CardAccordionItem
      v-for="(card, index) in localData.cards"
      :key="card.id"
      :edit-key="`cards.${index}`"
      :title="card.logoAlt || `Convenio ${index + 1}`"
      :index="index"
      :total="localData.cards.length"
      :open="openIndex === index"
      remove-label="Quitar convenio"
      @toggle="toggle(index)"
      @move="moveCard(index, $event)"
      @remove="removeCard(index)"
    >
      <div>
        <EditorImage
          v-model="card.image"
          v-model:alt="card.imageAlt"
          data-edit-target=".image"
          alt-edit-target=".imageAlt"
          class="mb-3"
          label="Fotografía superior (Campus)"
          @select="$emit('select-image', { item: card, field: 'image' })"
        />

        <EditorImage
          v-model="card.logo"
          v-model:alt="card.logoAlt"
          data-edit-target=".logo"
          alt-edit-target=".logoAlt"
          class="mb-2"
          label="Logo de la Universidad"
          @select="$emit('select-image', { item: card, field: 'logo' })"
        />

        <div class="mb-3">
          <label class="form-label small fw-bold">
            Altura máxima del logo ({{ card.logoHeight }}px)
          </label>
          <input
            v-model.number="card.logoHeight"
            type="range"
            min="36"
            max="110"
            step="2"
            class="form-range"
          />
        </div>

        <EditorTextarea
          v-model="card.desc"
          data-edit-target=".desc"
          label="Descripción del convenio"
          :rows="4"
          :maxlength="420"
          placeholder="Cursa electivos convalidables dentro de la malla del DPA..."
        />
      </div>
    </CardAccordionItem>

    <button
      type="button"
      class="btn btn-sm btn-danger w-100 mt-2 mb-3"
      @click="addCard"
    >
      <i class="las la-plus me-1"></i> Agregar convenio
    </button>

    <hr />

    <h6 class="fw-bold small text-uppercase mb-2">Botón Inferior</h6>

    <EditorText
      v-model="localData.button.label"
      data-edit-target="button.label"
      class="mb-2"
      label="Texto del botón"
      :maxlength="80"
      placeholder="Descubre ESAN Internacional"
    />

    <EditorUrl
      v-model="localData.button.url"
      v-model:target="localData.button.target"
      label="URL del botón"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import {
  normalizeConveniosData,
  createEmptyConvenioCard,
} from './types';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'select-image', payload: { item: any; field: string }): void;
}>();

const localData = reactive(normalizeConveniosData(props.modelValue));
const openIndex = ref<number | null>(0);

watch(
  localData,
  (val) => {
    emit('update:modelValue', JSON.parse(JSON.stringify(val)));
  },
  { deep: true },
);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addCard = () => {
  localData.cards.push(createEmptyConvenioCard(localData.cards.length));
  openIndex.value = localData.cards.length - 1;
};

const removeCard = (index: number) => {
  localData.cards.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
};

const moveCard = (index: number, dir: -1 | 1) => {
  const target = index + dir;
  if (target < 0 || target >= localData.cards.length) return;
  const [moved] = localData.cards.splice(index, 1);
  localData.cards.splice(target, 0, moved);
  openIndex.value = target;
};
</script>

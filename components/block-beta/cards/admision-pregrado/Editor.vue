<template>
  <div class="admision-pregrado-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado</h6>

    <EditorText
      v-model="localData.title"
      data-edit-target="title"
      class="mb-2"
      label="Título"
      placeholder="Admisión de pregrado"
    />

    <EditorTextarea
      v-model="localData.desc"
      data-edit-target="desc"
      class="mb-3"
      label="Descripción"
      :rows="2"
      placeholder="Texto de apoyo para la sección"
    />

    <EditorText
      v-model="localData.linkLabel"
      data-edit-target="linkLabel"
      class="mb-2"
      label="Texto del enlace de la sección"
      placeholder="Conoce más"
    />

    <EditorUrl
      v-model="localData.linkUrl"
      v-model:target="localData.linkTarget"
      data-edit-target="linkUrl"
      class="mb-3"
      label="Destino del enlace"
      placeholder="/admision/pregrado o https://"
    />
    <p class="ap-hint">
      El enlace de la sección aparece cuando tiene texto y destino.
    </p>

    <hr />

    <h6 class="fw-bold small text-uppercase mb-1">Carrusel</h6>
    <p class="ap-hint">Tarjetas visibles a la vez en escritorio.</p>
    <div class="ap-count-options">
      <button
        v-for="option in [2, 3, 4]"
        :key="option"
        type="button"
        class="ap-count-option"
        :class="{ 'is-selected': localData.cardCount === option }"
        :aria-pressed="localData.cardCount === option"
        @click="localData.cardCount = option as AdmissionCardCount"
      >
        <span class="ap-count-preview">
          <span v-for="index in option" :key="index" class="ap-count-chip"></span>
        </span>
        <span>{{ option }}</span>
      </button>
    </div>
    <p class="ap-hint mt-2">
      Puedes agregar todas las tarjetas que necesites; las que no entren se alcanzan deslizando.
    </p>

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Tarjetas</h6>
      <span class="badge bg-secondary">{{ localData.cards.length }}</span>
    </div>

    <CardAccordionItem
      v-for="(card, index) in localData.cards"
      :key="card.id"
      :edit-key="'cards.' + index"
      :title="card.title || 'Tarjeta sin título'"
      :index="index"
      :total="localData.cards.length"
      :open="openIndex === index"
      remove-label="Quitar tarjeta"
      @toggle="toggle(index)"
      @move="moveCard(index, $event)"
      @remove="removeCard(index)"
    >
      <div>
        <EditorImage
          v-model="card.image"
          v-model:alt="card.imageAlt"
          v-model:focus-x="card.imageFocusX"
          v-model:focus-y="card.imageFocusY"
          focus-ratio="16 / 10"
          data-edit-target=".image"
          alt-edit-target=".imageAlt"
          class="mb-2"
          ratio="16 / 10"
          select-label="Seleccionar imagen"
          alt-label="Texto alternativo de la imagen"
          alt-placeholder="Describe brevemente la imagen"
          @select="emit('select-image', { item: card, field: 'image' })"
        />

        <EditorText
          v-model="card.title"
          data-edit-target=".title"
          class="mb-2"
          label="Título de la tarjeta"
          placeholder="Vida universitaria"
        />

        <EditorTextarea
          v-model="card.desc"
          data-edit-target=".desc"
          class="mb-2"
          label="Descripción"
          :rows="2"
          placeholder="Carreras de ciencias administrativas"
        />

        <EditorUrl
          v-model="card.href"
          v-model:target="card.target"
          data-edit-target=".href"
          label="Destino de la tarjeta"
        />
        <p class="ap-hint mt-1">Toda la tarjeta será el enlace. Si el destino queda vacío, no será clicable.</p>
      </div>
    </CardAccordionItem>

    <div v-if="!localData.cards.length" class="ap-empty">
      Todavía no hay tarjetas. Agrega una para configurar su imagen, textos y destino.
    </div>

    <button type="button" class="btn btn-sm btn-danger w-100 mt-2" @click="addCard">
      <i class="las la-plus me-1"></i> Agregar tarjeta
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import {
  buildAdmissionCard,
  buildAdmissionPregradoData,
  type AdmissionCardCount,
} from './_shared/types';

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref(buildAdmissionPregradoData(props.modelValue));
const openIndex = ref<number | null>(null);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addCard = () => {
  localData.value.cards.push(buildAdmissionCard());
  openIndex.value = localData.value.cards.length - 1;
};

const removeCard = (index: number) => {
  localData.value.cards.splice(index, 1);

  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveCard = (index: number, delta: number) => {
  const target = index + delta;
  const cards = localData.value.cards;
  if (target < 0 || target >= cards.length) return;

  [cards[index], cards[target]] = [cards[target], cards[index]];

  if (openIndex.value === index) openIndex.value = target;
  else if (openIndex.value === target) openIndex.value = index;
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue || JSON.stringify(newValue) === JSON.stringify(localData.value)) return;
    localData.value = buildAdmissionPregradoData(newValue);
  },
  { deep: true },
);

watch(
  localData,
  (newValue) => emit('update:modelValue', JSON.parse(JSON.stringify(newValue))),
  { deep: true },
);
</script>

<style scoped>
.ap-hint {
  margin: 0 0 8px;
  color: #6b7688;
  font-size: 11.5px;
  line-height: 1.45;
}

.ap-count-options {
  display: flex;
  gap: 8px;
}

.ap-count-option {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border: 1px solid #d6dce5;
  border-radius: 6px;
  background: #fff;
  color: #475569;
  font-size: 12px;
  cursor: pointer;
}

.ap-count-option.is-selected {
  border-color: #e3173e;
  background: #fff5f6;
  color: #b80f30;
}

.ap-count-preview {
  display: flex;
  gap: 3px;
  width: 36px;
  height: 20px;
}

.ap-count-chip {
  flex: 1;
  border-radius: 2px;
  background: #cbd5e1;
}

.ap-count-option.is-selected .ap-count-chip {
  background: #e3173e;
}

.ap-empty {
  padding: 12px;
  border: 1px dashed #c6cedb;
  border-radius: 6px;
  color: #6b7688;
  font-size: 12px;
  text-align: center;
}
</style>

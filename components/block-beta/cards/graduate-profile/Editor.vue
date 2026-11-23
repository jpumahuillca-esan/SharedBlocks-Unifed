<template>
  <div class="graduate-profile-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Encabezado</h6>
    <EditorText v-model="localData.title" data-edit-target="title" label="Título de la sección" placeholder="Perfil del egresado" class="mb-3" />

    <hr />
    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Tarjetas del perfil</h6>
      <button type="button" class="btn btn-sm btn-outline-primary" @click="addCard">+ Agregar</button>
    </div>
    <p class="gp-hint">Las tarjetas aparecen en dos columnas y se iguala su altura dentro de cada fila.</p>

    <CardAccordionItem
      v-for="(card, cardIndex) in localData.cards"
      :key="card.id"
      :edit-key="`cards.${cardIndex}`"
      :title="card.title || `Tarjeta ${cardIndex + 1}`"
      :index="cardIndex"
      :total="localData.cards.length"
      :open="openCard === cardIndex"
      item-label="Tarjeta"
      @toggle="openCard = openCard === cardIndex ? null : cardIndex"
      @move="moveCard(cardIndex, $event)"
      @remove="removeCard(cardIndex)"
    >
      <EditorText v-model="card.title" data-edit-target=".title" label="Título de la tarjeta" class="mb-2" />
      <EditorTextarea v-model="card.intro" data-edit-target=".intro" label="Texto introductorio" :rows="2" class="mb-3" />

      <div class="d-flex align-items-center justify-content-between mb-1">
        <label class="form-label m-0">Textos del cuerpo</label>
        <button type="button" class="btn btn-sm btn-outline-secondary" @click="addItem(cardIndex)">+ Agregar texto</button>
      </div>
      <div v-for="(item, itemIndex) in card.items" :key="item.id" class="gp-item-editor">
        <div class="d-flex align-items-center justify-content-between mb-1">
          <small class="text-muted">Texto {{ itemIndex + 1 }}</small>
          <button type="button" class="btn btn-sm btn-link text-danger p-0" @click="removeItem(cardIndex, itemIndex)">Quitar</button>
        </div>
        <EditorTextarea v-model="item.text" :data-edit-target="`.items.${itemIndex}.text`" :rows="3" placeholder="Describe un resultado o campo laboral" />
      </div>
    </CardAccordionItem>

    <div v-if="!localData.cards.length" class="gp-empty">Agrega una tarjeta para configurar el perfil.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import { createGraduateProfileCard, createGraduateProfileItem, normalizeGraduateProfile, type GraduateProfileData } from './shared/types';

const props = defineProps<{ modelValue?: Partial<GraduateProfileData>; availableSections?: Array<{ id: string; title?: string }> }>();
const emit = defineEmits<{ (event: 'update:modelValue', value: GraduateProfileData): void }>();
const localData = ref(normalizeGraduateProfile(props.modelValue));
const openCard = ref<number | null>(0);

const addCard = () => {
  localData.value.cards.push(createGraduateProfileCard());
  openCard.value = localData.value.cards.length - 1;
};
const removeCard = (index: number) => {
  localData.value.cards.splice(index, 1);
  if (openCard.value === index) openCard.value = null;
  else if (openCard.value !== null && openCard.value > index) openCard.value -= 1;
};
const moveCard = (index: number, delta: -1 | 1) => {
  const target = index + delta;
  if (target < 0 || target >= localData.value.cards.length) return;
  [localData.value.cards[index], localData.value.cards[target]] = [localData.value.cards[target], localData.value.cards[index]];
  if (openCard.value === index) openCard.value = target;
};
const addItem = (cardIndex: number) => localData.value.cards[cardIndex].items.push(createGraduateProfileItem(localData.value.cards[cardIndex].items.length));
const removeItem = (cardIndex: number, itemIndex: number) => localData.value.cards[cardIndex].items.splice(itemIndex, 1);

watch(() => props.modelValue, (value) => {
  const next = normalizeGraduateProfile(value);
  if (JSON.stringify(next) !== JSON.stringify(localData.value)) localData.value = next;
}, { deep: true });
watch(localData, (value) => emit('update:modelValue', JSON.parse(JSON.stringify(value))), { deep: true });
</script>

<style scoped>
.gp-hint { margin: 0 0 8px; color: #6b7688; font-size: 11.5px; line-height: 1.45; }
.gp-item-editor { padding-block: 8px; border-top: 1px solid #e2e6ec; }
.gp-empty { padding: 12px; border: 1px dashed #c6cedb; border-radius: 6px; color: #6b7688; font-size: 12px; text-align: center; }
</style>

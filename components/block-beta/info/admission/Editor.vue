<template>
  <div class="admission-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Encabezado</h6>
    <EditorText v-model="localData.eyebrow" data-edit-target="eyebrow" label="Antetítulo" placeholder="Admisión 2027-I" class="mb-2" />
    <EditorText v-model="localData.title" data-edit-target="title" label="Título" placeholder="Postula en 4 pasos" class="mb-2" />
    <EditorTextarea v-model="localData.description" data-edit-target="description" label="Descripción" :rows="2" class="mb-3" />

    <hr />
    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Fechas de admisión</h6>
      <button type="button" class="btn btn-sm btn-outline-primary" @click="addScheduleItem">+ Agregar</button>
    </div>
    <CardAccordionItem
      v-for="(item, index) in localData.schedule"
      :key="item.id"
      :edit-key="`schedule.${index}`"
      :title="item.label || `Fecha ${index + 1}`"
      :index="index"
      :total="localData.schedule.length"
      :open="openSchedule === index"
      item-label="Fecha"
      @toggle="openSchedule = openSchedule === index ? null : index"
      @move="moveItem(localData.schedule, index, $event, 'schedule')"
      @remove="removeItem(localData.schedule, index, 'schedule')"
    >
      <EditorText v-model="item.label" data-edit-target=".label" label="Etapa" class="mb-2" />
      <EditorText v-model="item.value" data-edit-target=".value" label="Fecha o información" />
    </CardAccordionItem>

    <hr />
    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Pasos para postular</h6>
      <button type="button" class="btn btn-sm btn-outline-primary" @click="addStep">+ Agregar</button>
    </div>
    <EditorText v-model="localData.stepsTitle" data-edit-target="stepsTitle" label="Título del grupo" class="mb-2" />
    <CardAccordionItem
      v-for="(step, index) in localData.steps"
      :key="step.id"
      :edit-key="`steps.${index}`"
      :title="step.title || `Paso ${index + 1}`"
      :index="index"
      :total="localData.steps.length"
      :open="openStep === index"
      item-label="Paso"
      @toggle="openStep = openStep === index ? null : index"
      @move="moveItem(localData.steps, index, $event, 'steps')"
      @remove="removeItem(localData.steps, index, 'steps')"
    >
      <EditorText v-model="step.title" data-edit-target=".title" label="Título del paso" class="mb-2" />
      <EditorTextarea v-model="step.description" data-edit-target=".description" label="Descripción" :rows="2" class="mb-2" />
      <EditorText v-model="step.linkLabel" data-edit-target=".linkLabel" label="Texto del enlace (opcional)" class="mb-2" />
      <EditorUrl v-model="step.linkUrl" v-model:target="step.linkTarget" data-edit-target=".linkUrl" label="Destino del enlace" />
      <p class="admission-editor__hint mt-1">El enlace solo aparece si tiene texto. Puedes completar el destino cuando lo tengas.</p>
    </CardAccordionItem>

    <hr />
    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Modalidades</h6>
      <button type="button" class="btn btn-sm btn-outline-primary" @click="addModality">+ Agregar</button>
    </div>
    <EditorText v-model="localData.modalitiesTitle" data-edit-target="modalitiesTitle" label="Título del grupo" class="mb-2" />
    <CardAccordionItem
      v-for="(item, index) in localData.modalities"
      :key="item.id"
      :edit-key="`modalities.${index}`"
      :title="item.label || `Modalidad ${index + 1}`"
      :index="index"
      :total="localData.modalities.length"
      :open="openModality === index"
      item-label="Modalidad"
      @toggle="openModality = openModality === index ? null : index"
      @move="moveItem(localData.modalities, index, $event, 'modalities')"
      @remove="removeItem(localData.modalities, index, 'modalities')"
    >
      <EditorText v-model="item.label" data-edit-target=".label" label="Texto del botón" class="mb-2" />
      <EditorUrl v-model="item.url" v-model:target="item.target" data-edit-target=".url" label="Destino" />
    </CardAccordionItem>

    <hr />
    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Tarjetas de admisión</h6>
      <button type="button" class="btn btn-sm btn-outline-primary" @click="addCard">+ Agregar</button>
    </div>
    <EditorText v-model="localData.cardsTitle" data-edit-target="cardsTitle" label="Título del grupo (opcional)" class="mb-2" />
    <CardAccordionItem
      v-for="(card, index) in localData.cards"
      :key="card.id"
      :edit-key="`cards.${index}`"
      :title="card.title || `Tarjeta ${index + 1}`"
      :index="index"
      :total="localData.cards.length"
      :open="openCard === index"
      item-label="Tarjeta"
      @toggle="openCard = openCard === index ? null : index"
      @move="moveItem(localData.cards, index, $event, 'cards')"
      @remove="removeItem(localData.cards, index, 'cards')"
    >
      <EditorBrandColor v-model="card.backgroundToken" data-edit-target=".backgroundToken" label="Color de fondo" class="mb-2" />
      <EditorImage
        v-model="card.image"
        v-model:alt="card.imageAlt"
        data-edit-target=".image"
        alt-edit-target=".imageAlt"
        label="Imagen"
        noun="imagen"
        alt-label="Texto alternativo"
        alt-placeholder="Describe la imagen de la tarjeta"
        :focus-values="card.imageFocusProfiles"
        :focus-modes="imageFocusModes"
        focus-crop-preview
        class="mb-2"
        @select="emit('select-image', { item: card, field: 'image' })"
        @update:focus-values="saveImageFocusProfiles(card, $event)"
      />
      <EditorText v-model="card.eyebrow" data-edit-target=".eyebrow" label="Antetítulo" class="mb-2" />
      <EditorText v-model="card.title" data-edit-target=".title" label="Título" class="mb-2" />
      <EditorTextarea v-model="card.description" data-edit-target=".description" label="Descripción" :rows="3" class="mb-2" />
      <EditorText v-model="card.buttonLabel" data-edit-target=".buttonLabel" label="Texto del botón" class="mb-2" />
      <EditorUrl v-model="card.buttonUrl" v-model:target="card.buttonTarget" data-edit-target=".buttonUrl" label="Destino del botón" />
    </CardAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import { createImageFocusModes, saveImageFocusProfiles } from '../../../../helpers/imageFocus';
import {
  createAdmissionCard,
  createAdmissionModality,
  createAdmissionScheduleItem,
  createAdmissionStep,
  normalizeAdmissionData,
  type AdmissionData,
} from './shared/types';

const props = defineProps<{ modelValue?: Partial<AdmissionData>; availableSections?: Array<{ id: string; title?: string }> }>();
const emit = defineEmits<{
  (event: 'update:modelValue', value: AdmissionData): void;
  (event: 'select-image', payload: { item: any; field: string }): void;
}>();
const localData = ref(normalizeAdmissionData(props.modelValue));
const openSchedule = ref<number | null>(null);
const openStep = ref<number | null>(null);
const openModality = ref<number | null>(null);
const openCard = ref<number | null>(null);
const imageFocusModes = createImageFocusModes('16 / 9');

const addScheduleItem = () => { localData.value.schedule.push(createAdmissionScheduleItem()); openSchedule.value = localData.value.schedule.length - 1; };
const addStep = () => { localData.value.steps.push(createAdmissionStep()); openStep.value = localData.value.steps.length - 1; };
const addModality = () => { localData.value.modalities.push(createAdmissionModality()); openModality.value = localData.value.modalities.length - 1; };
const addCard = () => { localData.value.cards.push(createAdmissionCard()); openCard.value = localData.value.cards.length - 1; };

type ListKey = 'schedule' | 'steps' | 'modalities' | 'cards';
const setOpenIndex = (key: ListKey, index: number | null) => {
  if (key === 'schedule') openSchedule.value = index;
  else if (key === 'steps') openStep.value = index;
  else if (key === 'modalities') openModality.value = index;
  else openCard.value = index;
};
const removeItem = <T,>(list: T[], index: number, key: ListKey) => {
  list.splice(index, 1);
  const open = key === 'schedule' ? openSchedule.value : key === 'steps' ? openStep.value : key === 'modalities' ? openModality.value : openCard.value;
  if (open === index) setOpenIndex(key, null);
  else if (open !== null && open > index) setOpenIndex(key, open - 1);
};
const moveItem = <T,>(list: T[], index: number, delta: number, key: ListKey) => {
  const target = index + delta;
  if (target < 0 || target >= list.length) return;
  [list[index], list[target]] = [list[target], list[index]];
  const open = key === 'schedule' ? openSchedule.value : key === 'steps' ? openStep.value : key === 'modalities' ? openModality.value : openCard.value;
  if (open === index) setOpenIndex(key, target);
  else if (open === target) setOpenIndex(key, index);
};

watch(() => props.modelValue, (value) => {
  const next = normalizeAdmissionData(value);
  if (JSON.stringify(next) !== JSON.stringify(localData.value)) localData.value = next;
}, { deep: true });
watch(localData, (value) => emit('update:modelValue', JSON.parse(JSON.stringify(value))), { deep: true });
</script>

<style scoped>
.admission-editor__hint { margin-bottom: 0; color: #6b7688; font-size: 11.5px; line-height: 1.45; }
</style>

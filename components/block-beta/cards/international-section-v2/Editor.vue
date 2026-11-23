<template>
  <div class="international-section-v2-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Apariencia</h6>
    <EditorBrandColor v-model="localData.backgroundToken" label="Fondo de la sección" class="mb-3" />

    <hr />
    <h6 class="fw-bold small text-uppercase mb-1">Encabezado</h6>
    <EditorText v-model="localData.eyebrow" label="Antetítulo" placeholder="Internacionalización" class="mb-2" />
    <EditorText v-model="localData.title" label="Título" placeholder="Estudia un año de tu carrera en otro país" class="mb-3" />

    <hr />
    <h6 class="fw-bold small text-uppercase mb-1">Contenido</h6>
    <label class="form-label">Descripción</label>
    <div class="isv2-editor__toolbar mb-1">
      <button type="button" class="btn btn-sm btn-light" aria-label="Negrita" title="Negrita" @mousedown.prevent="formatBold"><strong>B</strong></button>
      <span class="small text-muted">Selecciona el texto y presiona Ctrl + B para ponerlo en negrita.</span>
    </div>
    <div
      ref="descriptionEditor"
      class="form-control form-control-sm isv2-editor__richtext mb-3"
      contenteditable="true"
      role="textbox"
      aria-multiline="true"
      aria-label="Descripción enriquecida"
      data-edit-target="description"
      @input="updateDescription"
      @keydown.ctrl.b.prevent="formatBold"
    ></div>

    <EditorImage
      v-model="localData.image"
      v-model:alt="localData.imageAlt"
      label="Imagen de la sección"
      noun="imagen"
      alt-label="Texto alternativo de la imagen"
      alt-placeholder="Estudiante en un programa internacional"
      :focus-values="localData.imageFocusProfiles"
      :focus-modes="imageFocusModes"
      focus-crop-preview
      :focus-sliders="false"
      data-edit-target="image"
      alt-edit-target="imageAlt"
      class="mb-3"
      @select="emit('select-image', { item: localData, field: 'image' })"
      @update:focus-values="saveImageFocusProfiles(localData, $event)"
    />

    <hr />
    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Programas</h6>
      <button type="button" class="btn btn-sm btn-outline-primary" :disabled="localData.rows.length >= MAX_INTERNATIONAL_ROWS" @click="addRow">+ Agregar</button>
    </div>
    <p class="small text-muted">Máximo {{ MAX_INTERNATIONAL_ROWS }} filas.</p>
    <CardAccordionItem
      v-for="(row, index) in localData.rows"
      :key="row.id"
      :edit-key="`rows.${index}`"
      :title="row.title || `Programa ${index + 1}`"
      :index="index"
      :total="localData.rows.length"
      :open="openIndex === index"
      item-label="Programa"
      @toggle="openIndex = openIndex === index ? null : index"
      @move="moveRow(index, $event)"
      @remove="removeRow(index)"
    >
      <EditorText v-model="row.title" data-edit-target=".title" label="Título del programa" class="mb-2" />
      <RichTextField v-model="row.text" data-edit-target=".text" label="Descripción del programa" hint="Selecciona el texto y presiona Ctrl + B para ponerlo en negrita." />
    </CardAccordionItem>

    <hr />
    <h6 class="fw-bold small text-uppercase mb-1">Botón</h6>
    <EditorText v-model="localData.buttonText" label="Texto del botón" class="mb-2" />
    <EditorUrl v-model="localData.buttonLink" v-model:target="localData.buttonTarget" label="Enlace del botón" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import RichTextField from './RichTextField.vue';
import { createImageFocusModes, saveImageFocusProfiles } from '../../../../helpers/imageFocus';
import { createInternationalRow, MAX_INTERNATIONAL_ROWS, normalizeInternationalSection, type InternationalSectionData } from './shared/types';

const props = defineProps<{ modelValue?: Partial<InternationalSectionData>; availableSections?: Array<{ id: string; title?: string }> }>();
const emit = defineEmits<{ (event: 'update:modelValue', value: InternationalSectionData): void; (event: 'select-image', payload: { item: any; field: string }): void }>();
const localData = ref(normalizeInternationalSection(props.modelValue));
const openIndex = ref<number | null>(0);
const descriptionEditor = ref<HTMLElement | null>(null);
const imageFocusModes = createImageFocusModes('840 / 292');

const syncDescriptionEditor = async () => {
  await nextTick();
  if (descriptionEditor.value && descriptionEditor.value.innerHTML !== localData.value.description) {
    descriptionEditor.value.innerHTML = localData.value.description;
  }
};
const updateDescription = () => {
  localData.value.description = descriptionEditor.value?.innerHTML ?? '';
};
const formatBold = () => {
  descriptionEditor.value?.focus();
  document.execCommand('bold');
  updateDescription();
};
const addRow = () => {
  if (localData.value.rows.length >= MAX_INTERNATIONAL_ROWS) return;
  localData.value.rows.push(createInternationalRow(localData.value.rows.length));
  openIndex.value = localData.value.rows.length - 1;
};
const removeRow = (index: number) => {
  localData.value.rows.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};
const moveRow = (index: number, delta: -1 | 1) => {
  const target = index + delta;
  if (target < 0 || target >= localData.value.rows.length) return;
  [localData.value.rows[index], localData.value.rows[target]] = [localData.value.rows[target], localData.value.rows[index]];
  if (openIndex.value === index) openIndex.value = target;
};

watch(() => props.modelValue, (value) => {
  const next = normalizeInternationalSection(value);
  if (JSON.stringify(next) !== JSON.stringify(localData.value)) localData.value = next;
}, { deep: true });
watch(() => localData.value.description, syncDescriptionEditor, { immediate: true });
watch(localData, (value) => emit('update:modelValue', JSON.parse(JSON.stringify(value))), { deep: true });
</script>

<style scoped>
.isv2-editor__toolbar { display: flex; align-items: center; gap: 8px; }
.isv2-editor__richtext { min-height: 88px; overflow-y: auto; }
.isv2-editor__richtext:focus { border-color: #86b7fe; outline: 0; box-shadow: 0 0 0 .15rem rgba(13, 110, 253, .15); }
</style>

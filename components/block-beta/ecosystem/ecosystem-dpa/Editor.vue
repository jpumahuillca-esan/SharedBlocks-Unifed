<template>
  <div class="edpa-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado</h6>

    <EditorText
      v-model="localData.eyebrow"
      data-edit-target="eyebrow"
      class="mb-3"
      label="Antetítulo (opcional)"
      :maxlength="80"
      placeholder="ESAN DPA"
    />

    <EditorTextarea
      v-model="localData.title"
      data-edit-target="title"
      class="mb-3"
      label="Título"
      :rows="2"
      :maxlength="140"
      placeholder="Elige tu carrera"
    />

    <EditorTextarea
      v-model="localData.desc"
      data-edit-target="desc"
      class="mb-3"
      label="Descripción"
      :rows="3"
      :maxlength="320"
      placeholder="8 carreras de 10 semestres, con título a nombre de la Nación. Entra a cada una para ver su plan de estudios y sus modalidades."
    />

    <div class="mb-3" data-edit-target="backgroundColor">
      <label class="form-label small fw-bold">Fondo de la sección</label>
      <select v-model="localData.backgroundColor" class="form-select form-select-sm">
        <option value="#F1F5F9">Gris suave (#F1F5F9 — Figma)</option>
        <option value="#FFFFFF">Blanco (#FFFFFF)</option>
        <option value="transparent">Transparente</option>
      </select>
    </div>

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Facultades / Categorías</h6>
      <span class="badge bg-secondary">{{ localData.items.length }}</span>
    </div>

    <p class="edpa-hint">
      Cada facultad se muestra en formato horizontal en PC/Tablet con su grilla de carreras en 2 columnas.
    </p>

    <CardAccordionItem
      v-for="(item, index) in localData.items"
      :key="item.id"
      :edit-key="`items.${index}`"
      :title="item.title || `Facultad ${index + 1}`"
      :index="index"
      :total="localData.items.length"
      :open="openIndex === index"
      remove-label="Quitar facultad"
      @toggle="toggle(index)"
      @move="moveItem(index, $event)"
      @remove="removeItem(index)"
    >
      <div>
        <EditorText
          v-model="item.title"
          data-edit-target=".title"
          class="mb-3"
          label="Título de facultad"
          :maxlength="100"
          placeholder="ESAN Management"
        />

        <EditorTextarea
          v-model="item.desc"
          data-edit-target=".desc"
          class="mb-3"
          label="Descripción corta"
          :rows="2"
          :maxlength="180"
          placeholder="Carreras de ciencias administrativas"
        />

        <EditorBrandColor
          v-model="item.colorToken"
          data-edit-target=".colorToken"
          class="mb-3"
        />

        <EditorImage
          v-model="item.image"
          v-model:alt="item.imageAlt"
          :focus-values="item.imageFocusProfiles"
          :focus-modes="focusModes"
          focus-crop-preview
          data-edit-target=".image"
          alt-edit-target=".imageAlt"
          class="mb-3"
          label="Imagen lateral"
          @select="$emit('select-image', { item, field: 'image' })"
          @update:focus-values="updateFocusProfiles(item, $event)"
        />

        <EditorUrl
          v-model="item.href"
          v-model:target="item.target"
          data-edit-target=".href"
          class="mb-3"
          label="Enlace de la facultad"
        />

        <hr />

        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="fw-bold small text-uppercase">Carreras ({{ item.links.length }})</span>
        </div>

        <div
          v-for="(link, li) in item.links"
          :key="link.id"
          class="p-2 mb-2 rounded border bg-white"
        >
          <div class="d-flex justify-content-between align-items-center mb-1">
            <small class="fw-bold text-muted">Carrera {{ li + 1 }}</small>
            <button
              type="button"
              class="btn btn-sm btn-link text-danger p-0 text-decoration-none"
              title="Eliminar carrera"
              @click="removeLink(item, li)"
            >
              <i class="las la-trash"></i>
            </button>
          </div>

          <EditorText
            v-model="link.label"
            :data-edit-target="`.links.${li}.label`"
            class="mb-2"
            label="Nombre de la carrera"
            :maxlength="120"
            placeholder="Administración con mención en Dirección de Empresas"
          />

          <EditorUrl
            v-model="link.href"
            v-model:target="link.target"
            label="URL de la carrera"
          />
        </div>

        <button
          type="button"
          class="btn btn-sm btn-outline-danger w-100 mt-1"
          @click="addLink(item)"
        >
          <i class="las la-plus me-1"></i> Agregar carrera
        </button>
      </div>
    </CardAccordionItem>

    <button
      type="button"
      class="btn btn-sm btn-danger w-100 mt-2"
      @click="addItem"
    >
      <i class="las la-plus me-1"></i> Agregar facultad
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import {
  normalizeEcosystemDpaData,
  createEmptyEcosystemDpaItem,
  createEmptyEcosystemDpaLink,
  type EcosystemDpaItem,
  type EcosystemDpaFocusProfiles,
} from './types';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'select-image', payload: { item: any; field: string }): void;
}>();

const localData = reactive(normalizeEcosystemDpaData(props.modelValue));
const openIndex = ref<number | null>(0);

const focusModes = [
  { key: 'web', label: 'Web', ratio: '390 / 250' },
  { key: 'tablet', label: 'Tablet', ratio: '200 / 250' },
  { key: 'mobile', label: 'Móvil', ratio: '328 / 204' },
];

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

const addItem = () => {
  localData.items.push(createEmptyEcosystemDpaItem());
  openIndex.value = localData.items.length - 1;
};

const removeItem = (index: number) => {
  localData.items.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
};

const moveItem = (index: number, dir: -1 | 1) => {
  const target = index + dir;
  if (target < 0 || target >= localData.items.length) return;
  const [moved] = localData.items.splice(index, 1);
  localData.items.splice(target, 0, moved);
  openIndex.value = target;
};

const addLink = (item: EcosystemDpaItem) => {
  item.links.push(createEmptyEcosystemDpaLink());
};

const removeLink = (item: EcosystemDpaItem, li: number) => {
  item.links.splice(li, 1);
};

const updateFocusProfiles = (
  item: EcosystemDpaItem,
  profiles: EcosystemDpaFocusProfiles,
) => {
  item.imageFocusProfiles = profiles;
  item.imageFocusX = profiles.web.x;
  item.imageFocusY = profiles.web.y;
};
</script>

<style scoped>
.edpa-hint {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
}
</style>

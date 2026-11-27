<template>
  <div class="ao-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado</h6>

    <EditorText
      v-model="localData.eyebrow"
      data-edit-target="eyebrow"
      class="mb-2"
      label="Antetítulo (opcional)"
      :maxlength="80"
      placeholder="Nuestra oferta académica"
    />

    <EditorTextarea
      v-model="localData.title"
      data-edit-target="title"
      class="mb-2"
      label="Título"
      :rows="2"
      :maxlength="140"
      placeholder="Nuestra oferta académica"
    />

    <EditorTextarea
      v-model="localData.desc"
      data-edit-target="desc"
      class="mb-3"
      label="Descripción (opcional)"
      :rows="2"
      :maxlength="320"
      placeholder="Explora nuestros programas y categorías."
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
      <h6 class="fw-bold small text-uppercase m-0">Tarjetas / Categorías</h6>
      <span class="badge bg-secondary">{{ localData.items.length }}</span>
    </div>
    <p class="ao-hint">
      Las tarjetas "Destacadas" ocupan el ancho completo con subenlaces; las "Compactas" se agrupan en grilla (3 cols PC / 2 Tablet / 1 Móvil).
    </p>

    <CardAccordionItem
      v-for="(item, index) in localData.items"
      :key="item.id"
      :edit-key="`items.${index}`"
      :title="`${item.variant === 'featured' ? '★ ' : ''}${item.title || `Tarjeta ${index + 1}`}`"
      :index="index"
      :total="localData.items.length"
      :open="openIndex === index"
      remove-label="Quitar tarjeta"
      @toggle="toggle(index)"
      @move="moveItem(index, $event)"
      @remove="removeItem(index)"
    >
      <div>
        <div class="mb-3">
          <label class="form-label small fw-bold d-block">Formato de tarjeta</label>
          <div class="btn-group w-100" role="group" aria-label="Formato de tarjeta">
            <button
              v-for="opt in VARIANT_OPTIONS"
              :key="opt.value"
              type="button"
              class="btn btn-sm"
              :class="item.variant === opt.value ? 'btn-secondary' : 'btn-outline-secondary'"
              @click="item.variant = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <EditorText
          v-model="item.title"
          data-edit-target=".title"
          class="mb-2"
          label="Título"
          :maxlength="120"
          placeholder="Cursos y Talleres"
        />

        <EditorTextarea
          v-model="item.desc"
          data-edit-target=".desc"
          class="mb-3"
          label="Descripción corta (opcional)"
          :rows="2"
          :maxlength="220"
          placeholder="Desarrolla nuevas habilidades y potencia tu crecimiento."
        />

        <EditorBrandColor
          v-model="item.colorToken"
          class="mb-3"
          label="Color de acento"
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
          label="Fotografía"
          @select="$emit('select-image', { item, field: 'image' })"
          @update:focus-values="updateFocusProfiles(item, $event)"
        />

        <EditorUrl
          v-model="item.href"
          v-model:target="item.target"
          data-edit-target=".href"
          class="mb-3"
          label="Enlace de la tarjeta"
        />

        <template v-if="item.variant === 'featured'">
          <hr />
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="fw-bold small text-uppercase">Subenlaces ({{ item.links.length }})</span>
          </div>

          <div
            v-for="(link, li) in item.links"
            :key="link.id"
            class="p-2 mb-2 rounded border bg-white"
          >
            <div class="d-flex justify-content-between align-items-center mb-1">
              <small class="fw-bold text-muted">Enlace {{ li + 1 }}</small>
              <button
                type="button"
                class="btn btn-sm btn-link text-danger p-0 text-decoration-none"
                title="Eliminar subenlace"
                @click="removeLink(item, li)"
              >
                <i class="las la-trash"></i>
              </button>
            </div>

            <EditorText
              v-model="link.label"
              :data-edit-target="`.links.${li}.label`"
              class="mb-2"
              label="Texto del enlace"
              :maxlength="120"
              placeholder="Informática para la Gestión"
            />

            <EditorUrl
              v-model="link.href"
              v-model:target="link.target"
              label="URL destino"
            />
          </div>

          <button
            type="button"
            class="btn btn-sm btn-outline-danger w-100 mt-1"
            @click="addLink(item)"
          >
            <i class="las la-plus me-1"></i> Agregar subenlace
          </button>
        </template>
      </div>
    </CardAccordionItem>

    <div class="d-grid gap-2 mt-2">
      <button type="button" class="btn btn-sm btn-outline-danger" @click="addItem('featured')">
        <i class="las la-plus me-1"></i> Agregar tarjeta destacada
      </button>
      <button type="button" class="btn btn-sm btn-danger" @click="addItem('compact')">
        <i class="las la-plus me-1"></i> Agregar tarjeta compacta
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import type { ImageFocusProfiles } from '../../../../helpers/imageFocus';
import {
  createEmptyOfferItem,
  createEmptyOfferLink,
  normalizeAcademicOfferData,
  stripAcademicOfferBundledAssets,
  type AcademicOfferCardLayout,
  type AcademicOfferItem,
} from './types';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'select-image', payload: { item: any; field: string }): void;
}>();

const localData = reactive(normalizeAcademicOfferData(props.modelValue));
const openIndex = ref<number | null>(0);

const VARIANT_OPTIONS: Array<{ value: AcademicOfferCardLayout; label: string }> = [
  { value: 'featured', label: 'Destacada (horizontal)' },
  { value: 'compact', label: 'Compacta (grilla)' },
];

const focusModes = [
  { key: 'web', label: 'Web', ratio: '16 / 9' },
  { key: 'tablet', label: 'Tablet', ratio: '16 / 10' },
  { key: 'mobile', label: 'Móvil', ratio: '16 / 9' },
];

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addItem = (variant: AcademicOfferCardLayout) => {
  localData.items.push(createEmptyOfferItem(variant));
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

const addLink = (item: AcademicOfferItem) => {
  item.links.push(createEmptyOfferLink());
};

const removeLink = (item: AcademicOfferItem, li: number) => {
  item.links.splice(li, 1);
};

const updateFocusProfiles = (item: AcademicOfferItem, profiles: ImageFocusProfiles) => {
  item.imageFocusProfiles = profiles;
  item.imageFocusX = profiles.web.x;
  item.imageFocusY = profiles.web.y;
};

watch(
  localData,
  (val) => emit('update:modelValue', stripAcademicOfferBundledAssets(JSON.parse(JSON.stringify(val)))),
  { deep: true },
);
</script>

<style scoped>
.ao-hint {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
}
</style>

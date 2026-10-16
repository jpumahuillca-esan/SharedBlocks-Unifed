<template>
  <div class="kf-editor">
    <div class="d-flex align-items-center justify-content-between mb-1" data-edit-target="items">
      <h6 class="fw-bold small text-uppercase m-0">Datos</h6>
      <span class="badge bg-secondary">{{ localData.items.length }}/{{ KEY_FACTS_MAX_ITEMS }}</span>
    </div>
    <p class="kf-hint">Un dato sin valor no se muestra. Máximo {{ KEY_FACTS_MAX_ITEMS }}.</p>

    <CardAccordionItem
      v-for="(item, index) in localData.items"
      :edit-key="`items.${index}`"
      :key="item.id"
      :title="item.label || item.value"
      :index="index"
      :total="localData.items.length"
      :open="openIndex === index"
      remove-label="Quitar dato"
      @toggle="toggle(index)"
      @move="moveItem(index, $event)"
      @remove="removeItem(index)"
    >
      <div>
        <EditorText
          v-model="item.label"
          data-edit-target=".label"
          class="mb-2"
          label="Rótulo"
          hint="Texto pequeño sobre el dato. Vacío lo oculta."
          placeholder="Duración:"
        />

        <EditorTextarea
          v-model="item.value"
          data-edit-target=".value"
          class="mb-2"
          label="Dato"
          :rows="2"
          placeholder="10 semestres académicos"
        />
      </div>
    </CardAccordionItem>

    <button
      type="button"
      class="btn btn-sm btn-danger w-100 mt-1"
      :disabled="localData.items.length >= KEY_FACTS_MAX_ITEMS"
      @click="addItem"
    >
      <i class="las la-plus me-1"></i> Agregar dato
    </button>

    <hr />

    <h6 class="fw-bold small text-uppercase mb-1">Apariencia</h6>

    <EditorBrandColor
      v-model="localData.colorToken"
      data-edit-target="colorToken"
      class="mb-2"
      label="Color de la franja"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Editor de los datos clave.
 *
 * La lista admite hasta KEY_FACTS_MAX_ITEMS datos: pasado ese tope el botón de
 * agregar se desactiva, y `build` recorta lo que llegue de más (por ejemplo,
 * de un dato guardado a mano) para que el panel y el bloque muestren lo mismo.
 */
import { ref, watch } from 'vue';
/*
 * El acordeón viene de la familia `events`, igual que en `mapamundi` y
 * `testimonials`: ver la nota de mapamundi/Editor.vue sobre subirlo a un
 * lugar común.
 */
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import { normalizeBrandColorToken } from '../../../editor-beta/EditorBrandColor/brandColors';
import { KEY_FACTS_MAX_ITEMS } from './types';

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue']);

const newItemId = () => `kf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const buildItem = (source: any) => ({
  id: source?.id || newItemId(),
  label: source?.label ?? '',
  value: source?.value ?? '',
});

const build = (source: any) => ({
  items: (Array.isArray(source?.items) ? source.items : []).slice(0, KEY_FACTS_MAX_ITEMS).map(buildItem),
  colorToken: normalizeBrandColorToken(source?.colorToken),
});

const localData = ref(build(props.modelValue));

/* Un solo dato abierto a la vez, para que el panel no crezca sin fin. */
const openIndex = ref<number | null>(null);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addItem = () => {
  if (localData.value.items.length >= KEY_FACTS_MAX_ITEMS) return;
  localData.value.items.push(buildItem({}));
  // El dato nuevo se abre solo: es el que se va a rellenar.
  openIndex.value = localData.value.items.length - 1;
};

const removeItem = (index: number) => {
  localData.value.items.splice(index, 1);

  // El panel abierto se corrige para no quedar apuntando a otro dato.
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveItem = (index: number, delta: number) => {
  const target = index + delta;
  const list = localData.value.items;
  if (target < 0 || target >= list.length) return;

  [list[index], list[target]] = [list[target], list[index]];

  // El panel abierto viaja con su dato.
  if (openIndex.value === index) openIndex.value = target;
  else if (openIndex.value === target) openIndex.value = index;
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return;
    if (JSON.stringify(newVal) === JSON.stringify(localData.value)) return;
    localData.value = build(newVal);
  },
  { deep: true },
);

watch(
  localData,
  (newVal) => emit('update:modelValue', JSON.parse(JSON.stringify(newVal))),
  { deep: true },
);
</script>

<style scoped>
.kf-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}
</style>

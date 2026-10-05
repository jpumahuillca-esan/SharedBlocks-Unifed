<template>
  <div class="awards-editor">
    <!-- Sin `card-count`: la fila muestra todos sus logos, no hay columnas que elegir. -->
    <CardSectionHeaderEditor
      :desc="localData.desc"
      :title="localData.title"
      :link-label="localData.linkLabel"
      :link-url="localData.linkUrl"
      :link-target="localData.linkTarget"
      @update:desc="localData.desc = $event"
      @update:title="localData.title = $event"
      @update:link-label="localData.linkLabel = $event"
      @update:link-url="localData.linkUrl = $event"
      @update:link-target="localData.linkTarget = $event"
    />

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Reconocimientos</h6>
      <span class="badge bg-secondary">{{ localData.awards.length }} / {{ MAX_AWARDS }}</span>
    </div>
    <p class="aw-hint">
      Hasta {{ MAX_AWARDS }} logos. En escritorio se ven todos en una fila; en
      teléfono, dos a la vez y el resto deslizando. Mientras un reconocimiento
      no tenga imagen, en su lugar se ve un recuadro gris.
    </p>

    <CardAccordionItem
      v-for="(award, index) in localData.awards"
      :edit-key="`awards.${index}`"
      :key="award.id"
      :title="headLabel(award)"
      :index="index"
      :total="localData.awards.length"
      :open="openIndex === index"
      remove-label="Quitar reconocimiento"
      @toggle="toggle(index)"
      @move="moveAward(index, $event)"
      @remove="removeAward(index)"
    >
      <div>
        <!-- `contain`: un logo recortado deja de leerse. -->
        <EditorImage
          v-model="award.image"
          v-model:alt="award.imageAlt"
          data-edit-target=".image"
          alt-edit-target=".imageAlt"
          label="Logo"
          fit="contain"
          alt-hint="El nombre del reconocimiento, tal como se lee en el logo. Lo usan los buscadores y los lectores de pantalla."
          alt-hint-position="top"
          alt-placeholder="N.º 1 en QS Executive MBA Rankings 2026"
          @select="$emit('select-image', { item: award, field: 'image' })"
        />
      </div>
    </CardAccordionItem>

    <button
      type="button"
      class="btn btn-sm btn-danger w-100"
      :disabled="isFull"
      @click="addAward"
    >
      <i class="las la-plus me-1"></i>
      {{ isFull ? `Máximo ${MAX_AWARDS} reconocimientos` : 'Agregar reconocimiento' }}
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor de los reconocimientos destacados.
 *
 * El encabezado es el mismo fragmento que usan las secciones de `events`. Cada
 * reconocimiento es solo un logo y su texto alternativo.
 */
import { ref, computed, watch } from 'vue';
import CardSectionHeaderEditor from '../../events/_shared/CardSectionHeaderEditor.vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';

/** Tope de la maqueta. El bloque aplica el mismo (ver Block.vue). */
const MAX_AWARDS = 4;

interface AwardItem {
  id: string;
  image: string;
  imageAlt: string;
}

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const newAwardId = () => `aw-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const buildAward = (source: any): AwardItem => ({
  id: source?.id || newAwardId(),
  image: source?.image ?? '',
  imageAlt: source?.imageAlt ?? '',
});

const build = (source: any) => ({
  title: source?.title ?? '',
  desc: source?.desc ?? '',
  linkLabel: source?.linkLabel ?? '',
  linkUrl: source?.linkUrl ?? '',
  linkTarget: normalizeLinkTarget(source?.linkTarget),
  awards: Array.isArray(source?.awards)
    ? source.awards.slice(0, MAX_AWARDS).map(buildAward)
    : [],
});

const localData = ref(build(props.modelValue));

const isFull = computed(() => localData.value.awards.length >= MAX_AWARDS);

/*
 * La cabecera de cada panel nombra el reconocimiento por su texto alternativo:
 * es lo único escrito que tiene. Sin él, dice qué le falta.
 */
const headLabel = (award: AwardItem) =>
  award.imageAlt.trim() || (award.image ? 'Sin texto alternativo' : 'Sin imagen');

/*
 * Acordeón de un solo panel abierto, como en el resto de editores de la
 * familia `events`.
 */
const openIndex = ref<number | null>(null);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addAward = () => {
  if (isFull.value) return;

  localData.value.awards.push(buildAward({}));
  // El reconocimiento nuevo se abre solo: es el que se va a rellenar.
  openIndex.value = localData.value.awards.length - 1;
};

const removeAward = (index: number) => {
  localData.value.awards.splice(index, 1);

  // El índice abierto se corrige para no quedar apuntando a otro reconocimiento.
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveAward = (index: number, delta: number) => {
  const target = index + delta;
  const list = localData.value.awards;
  if (target < 0 || target >= list.length) return;

  [list[index], list[target]] = [list[target], list[index]];

  // El panel abierto viaja con su reconocimiento.
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
.aw-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}
</style>

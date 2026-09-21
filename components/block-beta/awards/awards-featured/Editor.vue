<template>
  <div class="awards-editor">
    <!-- Sin `card-count`: la fila muestra todos sus logos, no hay columnas que elegir. -->
    <CardSectionHeaderEditor
      :desc="localData.desc"
      :title="localData.title"
      :link-label="localData.linkLabel"
      :link-url="localData.linkUrl"
      @update:desc="localData.desc = $event"
      @update:title="localData.title = $event"
      @update:link-label="localData.linkLabel = $event"
      @update:link-url="localData.linkUrl = $event"
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
        <label class="form-label">Logo</label>
        <div class="aw-image-preview mb-2">
          <img v-if="award.image" :src="award.image" alt="" />
          <span v-else class="text-muted small">Sin imagen</span>
        </div>
        <div class="d-flex gap-2 mb-2">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary flex-grow-1"
            @click="$emit('select-image', { item: award, field: 'image' })"
          >
            <i class="las la-image me-1"></i>
            {{ award.image ? 'Cambiar imagen' : 'Subir imagen' }}
          </button>
          <button
            v-if="award.image"
            type="button"
            class="btn btn-sm btn-outline-danger"
            title="Quitar imagen"
            @click="award.image = ''"
          >
            <i class="las la-trash"></i>
          </button>
        </div>

        <label class="form-label">Texto alternativo</label>
        <p class="aw-hint">
          El nombre del reconocimiento, tal como se lee en el logo. Lo usan los
          buscadores y los lectores de pantalla.
        </p>
        <input
          v-model="award.imageAlt"
          type="text"
          class="form-control form-control-sm"
          placeholder="N.º 1 en QS Executive MBA Rankings 2026"
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

.aw-image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  padding: 8px;
  border: 1px dashed #c6cedb;
  border-radius: 7px;
  background: #fff;
  overflow: hidden;
}

/* `contain` y no `cover`, a diferencia de la vista previa de eventos: una foto
   aguanta el recorte, pero un logo recortado deja de leerse. */
.aw-image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>

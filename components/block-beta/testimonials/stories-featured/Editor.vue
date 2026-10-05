<template>
  <div class="st-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Encabezado</h6>

    <EditorTextarea v-model="localData.title" data-edit-target="title" class="mb-2" label="Título" :rows="2" />

    <EditorTextarea
      v-model="localData.subtitle"
      data-edit-target="subtitle"
      class="mb-2"
      label="Línea de apoyo"
      hint="Texto corto bajo el título. Déjalo vacío para ocultarlo."
      :rows="2"
    />

    <EditorText
      v-model="localData.linkLabel"
      data-edit-target="linkLabel"
      class="mb-2"
      label="Texto del enlace"
      hint="Vacío oculta el enlace del encabezado."
      placeholder="Conoce más historias"
    />

    <EditorUrl
      v-model="localData.linkUrl"
      v-model:target="localData.linkTarget"
      data-edit-target="linkUrl"
      class="mb-2"
      label="Destino del enlace"
    />

    <label class="form-label">Tarjetas visibles a la vez</label>
    <select v-model.number="localData.cardCount" data-edit-target="cardCount" class="form-select form-select-sm mb-2">
      <option :value="2">2 tarjetas</option>
      <option :value="3">3 tarjetas</option>
      <option :value="4">4 tarjetas</option>
    </select>
    <p class="st-hint">
      En pantallas angostas las tarjetas conservan su tamaño y el resto se
      alcanza deslizando hacia la derecha.
    </p>

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Historias</h6>
      <span class="badge bg-secondary">{{ localData.cards.length }}</span>
    </div>
    <p class="st-hint">
      Agrega las que necesites. Se ven {{ localData.cardCount }} a la vez y el
      resto se alcanza deslizando el carril.
    </p>

    <CardAccordionItem
      v-for="(card, index) in localData.cards"
      :edit-key="`cards.${index}`"
      :key="card.id"
      :title="card.name"
      :index="index"
      :total="localData.cards.length"
      :open="openIndex === index"
      remove-label="Quitar historia"
      @toggle="toggle(index)"
      @move="moveCard(index, $event)"
      @remove="removeCard(index)"
    >
      <div>
        <EditorText
          v-model="card.name"
          data-edit-target=".name"
          class="mb-2"
          label="Nombre"
          hint="Se muestra sobre la foto."
        />

        <EditorTextarea v-model="card.role" data-edit-target=".role" class="mb-2" label="Cargo o programa" :rows="2" />

        <EditorImage
          v-model="card.image"
          v-model:alt="card.imageAlt"
          v-model:focus-x="card.imageFocusX"
          v-model:focus-y="card.imageFocusY"
          focus-ratio="3 / 4"
          data-edit-target=".image"
          alt-edit-target=".imageAlt"
          class="mb-2"
          label="Foto"
          noun="foto"
          hint="Se recorta en vertical (3:4). Elige una imagen alta."
          @select="$emit('select-image', { item: card, field: 'image' })"
        />

        <EditorUrl
          v-model="card.videoUrl"
          data-edit-target=".videoUrl"
          class="mb-2"
          label="Video"
          placeholder="https://www.youtube.com/watch?v=..."
          :hint="videoHint(card.videoUrl)"
          hint-position="bottom"
          :hint-tone="videoWarning(card.videoUrl) ? 'warn' : 'default'"
        />

        <EditorUrl
          v-model="card.href"
          v-model:target="card.target"
          data-edit-target=".href"
          class="mb-2"
          label="Destino de la historia"
        />

        <EditorText
          v-model="card.ctaLabel"
          data-edit-target=".ctaLabel"
          label="Texto del enlace"
          placeholder="Ver historia"
        />
      </div>
    </CardAccordionItem>

    <button type="button" class="btn btn-sm btn-danger w-100 mt-2" @click="addCard">
      <i class="las la-plus me-1"></i> Agregar historia
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor de la sección de historias destacadas.
 */
import { ref, watch } from 'vue';
/*
 * El acordeón viene de la familia `events`. Es una pieza de interfaz del panel
 * sin nada específico de aquella familia, y duplicarla solo para no cruzar
 * carpetas dejaría dos copias que hay que mantener a la par. Cuando una tercera
 * familia lo necesite, conviene subirlo a block-beta/_shared/.
 */
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import { toVideoSource } from '../../../../helpers/video';
import { normalizeImageFocus } from '../../../../helpers/imageFocus';
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';
import {
  newStoryId,
  normalizeStoryCardCount,
  type StoryCardItem,
} from '../_shared/types';

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const buildCard = (source: any): StoryCardItem => ({
  id: source?.id || newStoryId(),
  name: source?.name ?? '',
  role: source?.role ?? '',
  image: source?.image ?? '',
  imageAlt: source?.imageAlt ?? '',
  imageFocusX: normalizeImageFocus(source?.imageFocusX),
  imageFocusY: normalizeImageFocus(source?.imageFocusY),
  videoUrl: source?.videoUrl ?? '',
  href: source?.href ?? '',
  target: normalizeLinkTarget(source?.target),
  ctaLabel: source?.ctaLabel ?? 'Ver historia',
});

const build = (source: any) => ({
  title: source?.title ?? '',
  subtitle: source?.subtitle ?? '',
  linkLabel: source?.linkLabel ?? '',
  linkUrl: source?.linkUrl ?? '',
  linkTarget: normalizeLinkTarget(source?.linkTarget),
  cardCount: normalizeStoryCardCount(source?.cardCount),
  cards: Array.isArray(source?.cards) ? source.cards.map(buildCard) : [],
});

const localData = ref(build(props.modelValue));

/*
 * El enlace se acepta en cualquiera de sus formas, así que conviene decir en el
 * panel si el que se pegó se reconoció — de lo contrario el fallo solo se ve al
 * pulsar un botón de reproducir que no aparece.
 */
const videoWarning = (url: string) => Boolean(url?.trim()) && toVideoSource(url).kind === 'none';

const videoHint = (url: string) => {
  if (!url?.trim()) return 'Opcional. Sin enlace, el botón de reproducir queda decorativo.';
  if (toVideoSource(url).kind === 'none') {
    return 'No se reconoce este enlace. Se aceptan YouTube, Vimeo o un archivo .mp4/.webm.';
  }
  return 'Enlace reconocido. El video se reproduce dentro de la tarjeta.';
};

/*
 * Acordeón de un solo panel abierto: con varias historias desplegadas a la vez
 * habría que recorrer todo el panel para llegar al botón de agregar.
 */
const openIndex = ref<number | null>(null);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addCard = () => {
  localData.value.cards.push(buildCard({}));
  // La historia nueva se abre sola: es la que se va a rellenar.
  openIndex.value = localData.value.cards.length - 1;
};

const removeCard = (index: number) => {
  localData.value.cards.splice(index, 1);

  // El índice abierto se corrige para no quedar apuntando a otra historia.
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveCard = (index: number, delta: number) => {
  const target = index + delta;
  const list = localData.value.cards;
  if (target < 0 || target >= list.length) return;

  [list[index], list[target]] = [list[target], list[index]];

  // El panel abierto viaja con su historia.
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
.st-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}
</style>

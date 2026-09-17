<template>
  <div class="st-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Encabezado</h6>

    <label class="form-label">Título</label>
    <textarea v-model="localData.title" class="form-control form-control-sm mb-2" rows="2"></textarea>

    <label class="form-label">Línea de apoyo</label>
    <p class="st-hint">Texto corto bajo el título. Déjalo vacío para ocultarlo.</p>
    <textarea v-model="localData.subtitle" class="form-control form-control-sm mb-2" rows="2"></textarea>

    <label class="form-label">Texto del enlace</label>
    <p class="st-hint">Vacío oculta el enlace del encabezado.</p>
    <input
      v-model="localData.linkLabel"
      type="text"
      class="form-control form-control-sm mb-2"
      placeholder="Conoce más historias"
    />

    <label class="form-label">Destino del enlace</label>
    <input
      v-model="localData.linkUrl"
      type="text"
      class="form-control form-control-sm mb-2"
      placeholder="/ruta o https://"
    />

    <label class="form-label">Tarjetas visibles a la vez</label>
    <select v-model.number="localData.cardCount" class="form-select form-select-sm mb-2">
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
        <label class="form-label">Nombre</label>
        <p class="st-hint">Se muestra sobre la foto.</p>
        <input v-model="card.name" type="text" class="form-control form-control-sm mb-2" />

        <label class="form-label">Cargo o programa</label>
        <textarea v-model="card.role" class="form-control form-control-sm mb-2" rows="2"></textarea>

        <label class="form-label">Foto</label>
        <p class="st-hint">Se recorta en vertical (3:4). Elige una imagen alta.</p>
        <div class="st-image-preview mb-2">
          <img v-if="card.image" :src="card.image" alt="" />
          <span v-else class="text-muted small">Sin imagen</span>
        </div>
        <div class="d-flex gap-2 mb-2">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary flex-grow-1"
            @click="$emit('select-image', { item: card, field: 'image' })"
          >
            <i class="las la-image me-1"></i>
            {{ card.image ? 'Cambiar foto' : 'Subir foto' }}
          </button>
          <button
            v-if="card.image"
            type="button"
            class="btn btn-sm btn-outline-danger"
            title="Quitar foto"
            @click="card.image = ''"
          >
            <i class="las la-trash"></i>
          </button>
        </div>

        <label class="form-label">Texto alternativo</label>
        <input v-model="card.imageAlt" type="text" class="form-control form-control-sm mb-2" />

        <label class="form-label">Video</label>
        <input
          v-model="card.videoUrl"
          type="text"
          class="form-control form-control-sm"
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <p class="st-hint mt-1" :class="{ 'st-hint--warn': videoWarning(card.videoUrl) }">
          {{ videoHint(card.videoUrl) }}
        </p>

        <label class="form-label">Destino de la historia</label>
        <input
          v-model="card.href"
          type="text"
          class="form-control form-control-sm mb-2"
          placeholder="/ruta o https://"
        />

        <label class="form-label">Texto del enlace</label>
        <input
          v-model="card.ctaLabel"
          type="text"
          class="form-control form-control-sm"
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
import { toVideoSource } from '../../../../helpers/video';
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
  videoUrl: source?.videoUrl ?? '',
  href: source?.href ?? '',
  ctaLabel: source?.ctaLabel ?? 'Ver historia',
});

const build = (source: any) => ({
  title: source?.title ?? '',
  subtitle: source?.subtitle ?? '',
  linkLabel: source?.linkLabel ?? '',
  linkUrl: source?.linkUrl ?? '',
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

.st-hint--warn {
  color: #b02a37;
}

.st-image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  border: 1px dashed #c6cedb;
  border-radius: 7px;
  background: #f4f6fa;
  overflow: hidden;
}

.st-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

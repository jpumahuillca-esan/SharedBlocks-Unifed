<template>
  <div class="image-grid-editor">
    <!--
      Con `eyebrow` el fragmento ofrece la etiqueta superior; sin `card-count` no
      ofrece columnas: la rejilla es siempre de tres, dos en tableta y una en
      teléfono.
    -->
    <CardSectionHeaderEditor
      :eyebrow="localData.eyebrow"
      :title="localData.title"
      :desc="localData.desc"
      :link-label="localData.linkLabel"
      :link-url="localData.linkUrl"
      @update:eyebrow="localData.eyebrow = $event"
      @update:title="localData.title = $event"
      @update:desc="localData.desc = $event"
      @update:link-label="localData.linkLabel = $event"
      @update:link-url="localData.linkUrl = $event"
    />

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Tarjetas</h6>
      <span class="badge bg-secondary">{{ localData.cards.length }}</span>
    </div>
    <p class="ig-hint">
      Tres por fila en escritorio y dos en tableta; en teléfono se deslizan de a
      una. Con un múltiplo de seis ninguna fila queda a medias.
    </p>

    <CardAccordionItem
      v-for="(card, index) in localData.cards"
      :key="card.id"
      :title="card.title"
      :index="index"
      :total="localData.cards.length"
      :open="openIndex === index"
      remove-label="Quitar tarjeta"
      @toggle="toggle(index)"
      @move="moveCard(index, $event)"
      @remove="removeCard(index)"
    >
      <div>
        <label class="form-label">Imagen</label>
        <div class="ig-image-preview mb-2">
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
            {{ card.image ? 'Cambiar imagen' : 'Subir imagen' }}
          </button>
          <button
            v-if="card.image"
            type="button"
            class="btn btn-sm btn-outline-danger"
            title="Quitar imagen"
            @click="card.image = ''"
          >
            <i class="las la-trash"></i>
          </button>
        </div>

        <label class="form-label">Texto alternativo</label>
        <p class="ig-hint">
          Qué se ve en la foto. Lo usan los buscadores y los lectores de pantalla.
        </p>
        <input
          v-model="card.imageAlt"
          type="text"
          class="form-control form-control-sm mb-2"
          placeholder="Estudiantes conversando en el jardín del campus"
        />

        <label class="form-label">Título</label>
        <input
          v-model="card.title"
          type="text"
          class="form-control form-control-sm mb-2"
          placeholder="Vida universitaria"
        />

        <label class="form-label">Descripción</label>
        <p class="ig-hint">Una línea corta: en escritorio, más larga se parte en dos.</p>
        <textarea
          v-model="card.desc"
          class="form-control form-control-sm mb-2"
          rows="2"
          placeholder="Descripción de la categoría"
        ></textarea>

        <label class="form-label">Destino</label>
        <p class="ig-hint">Toda la tarjeta es el enlace. Vacío, no lleva a ningún sitio.</p>
        <input
          v-model="card.href"
          type="text"
          class="form-control form-control-sm"
          placeholder="/ruta o https://"
        />
      </div>
    </CardAccordionItem>

    <button type="button" class="btn btn-sm btn-danger w-100" @click="addCard">
      <i class="las la-plus me-1"></i> Agregar tarjeta
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor de la rejilla de tarjetas con imagen.
 *
 * El encabezado es el mismo fragmento que usan `events` y `awards`, aquí con la
 * etiqueta superior. Cada tarjeta es una foto, su título, una línea de apoyo y
 * el destino del enlace.
 */
import { ref, watch } from 'vue';
import CardSectionHeaderEditor from '../../events/_shared/CardSectionHeaderEditor.vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';

interface ImageGridCard {
  id: string;
  image: string;
  imageAlt: string;
  title: string;
  desc: string;
  href: string;
}

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const newCardId = () => `ig-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const buildCard = (source: any): ImageGridCard => ({
  id: source?.id || newCardId(),
  image: source?.image ?? '',
  imageAlt: source?.imageAlt ?? '',
  title: source?.title ?? '',
  desc: source?.desc ?? '',
  href: source?.href ?? '',
});

const build = (source: any) => ({
  eyebrow: source?.eyebrow ?? '',
  title: source?.title ?? '',
  desc: source?.desc ?? '',
  linkLabel: source?.linkLabel ?? '',
  linkUrl: source?.linkUrl ?? '',
  cards: Array.isArray(source?.cards) ? source.cards.map(buildCard) : [],
});

const localData = ref(build(props.modelValue));

/*
 * Acordeón de un solo panel abierto, como en el resto de editores de tarjetas.
 */
const openIndex = ref<number | null>(null);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addCard = () => {
  localData.value.cards.push(buildCard({}));
  // La tarjeta nueva se abre sola: es la que se va a rellenar.
  openIndex.value = localData.value.cards.length - 1;
};

const removeCard = (index: number) => {
  localData.value.cards.splice(index, 1);

  // El índice abierto se corrige para no quedar apuntando a otra tarjeta.
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveCard = (index: number, delta: number) => {
  const target = index + delta;
  const list = localData.value.cards;
  if (target < 0 || target >= list.length) return;

  [list[index], list[target]] = [list[target], list[index]];

  // El panel abierto viaja con su tarjeta.
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
.ig-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

/* Misma proporción que la tarjeta en escritorio, para ver el encuadre real. */
.ig-image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16 / 10;
  border: 1px dashed #c6cedb;
  border-radius: 7px;
  background: #fff;
  overflow: hidden;
}

.ig-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

<template>
  <div class="events-editor">
    <CardSectionHeaderEditor
      :desc="localData.desc"
      :title="localData.title"
      :link-label="localData.linkLabel"
      :link-url="localData.linkUrl"
      :card-count="localData.cardCount"
      @update:desc="localData.desc = $event"
      @update:title="localData.title = $event"
      @update:link-label="localData.linkLabel = $event"
      @update:link-url="localData.linkUrl = $event"
      @update:card-count="localData.cardCount = $event"
    />

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Eventos</h6>
      <span class="badge bg-secondary">{{ localData.cards.length }}</span>
    </div>
    <p class="ev-hint">
      Agrega los que necesites. Se ven {{ localData.cardCount }} a la vez y el
      resto se alcanza deslizando el carrusel.
    </p>

    <CardAccordionItem
      v-for="(card, index) in localData.cards"
      :key="card.id"
      :title="card.title"
      :index="index"
      :total="localData.cards.length"
      :open="openIndex === index"
      remove-label="Quitar evento"
      @toggle="toggle(index)"
      @move="moveCard(index, $event)"
      @remove="removeCard(index)"
    >
      <div>
        <!--
          Sin selector de formato: esta sección usa siempre la tarjeta con imagen,
          así que no hay nada que elegir.
        -->
        <label class="form-label">Título</label>
        <textarea v-model="card.title" class="form-control form-control-sm mb-2" rows="2"></textarea>

        <label class="form-label">Fecha del evento</label>
        <input v-model="card.date" type="date" class="form-control form-control-sm" />
        <p class="ev-hint mt-1">
          <template v-if="preview(card.date)">
            En la tarjeta se verá
            <strong>{{ preview(card.date)!.day }} {{ preview(card.date)!.month }}</strong>.
          </template>
          <template v-else-if="card.day || card.month">
            Sin fecha elegida. Se conserva lo anterior:
            <strong>{{ card.day }} {{ card.month }}</strong>.
          </template>
          <template v-else>
            Elige una fecha y se mostrará como día y mes abreviado.
          </template>
        </p>

        <label class="form-label">Destino</label>
        <input
          v-model="card.href"
          type="text"
          class="form-control form-control-sm mb-2"
          placeholder="/ruta o https://"
        />

        <label class="form-label">Imagen</label>
        <div class="ev-image-preview mb-2">
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
        <input v-model="card.imageAlt" type="text" class="form-control form-control-sm mb-2" />

        <BadgeListEditor :badges="card.badges" />
      </div>
    </CardAccordionItem>

    <button type="button" class="btn btn-sm btn-danger w-100" @click="addCard">
      <i class="las la-plus me-1"></i> Agregar evento
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor de la sección de eventos destacados.
 */
import { ref, watch } from 'vue';
import CardSectionHeaderEditor from '../_shared/CardSectionHeaderEditor.vue';
import BadgeListEditor from '../_shared/BadgeListEditor.vue';
import CardAccordionItem from '../_shared/CardAccordionItem.vue';
import { newCardId, normalizeCardCount, type EventCardItem } from '../_shared/types';
import { toEventDateParts } from '../_shared/date';

/** Vista previa de cómo quedará la fecha en el bloque de la tarjeta. */
const preview = (iso: string) => toEventDateParts(iso ?? '');

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const buildCard = (source: any): EventCardItem => ({
  id: source?.id || newCardId(),
  date: source?.date ?? '',
  day: source?.day ?? '',
  month: source?.month ?? '',
  title: source?.title ?? '',
  href: source?.href ?? '',
  image: source?.image ?? '',
  imageAlt: source?.imageAlt ?? '',
  tag: source?.tag ?? '',
  badges: Array.isArray(source?.badges) ? [...source.badges] : [],
});

const build = (source: any) => ({
  desc: source?.desc ?? '',
  title: source?.title ?? '',
  linkLabel: source?.linkLabel ?? '',
  linkUrl: source?.linkUrl ?? '',
  cardCount: normalizeCardCount(source?.cardCount),
  cards: Array.isArray(source?.cards) ? source.cards.map(buildCard) : [],
});

const localData = ref(build(props.modelValue));

/*
 * Acordeón de un solo panel abierto: con varias tarjetas desplegadas a la vez
 * habría que recorrer todo el panel para llegar al botón de agregar.
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
.ev-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

.ev-image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  border: 1px dashed #c6cedb;
  border-radius: 7px;
  background: #f4f6fa;
  overflow: hidden;
}

.ev-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

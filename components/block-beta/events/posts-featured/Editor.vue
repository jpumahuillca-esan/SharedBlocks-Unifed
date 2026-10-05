<template>
  <div class="posts-editor">
    <CardSectionHeaderEditor
      :desc="localData.desc"
      :title="localData.title"
      :link-label="localData.linkLabel"
      :link-url="localData.linkUrl"
      :link-target="localData.linkTarget"
      :card-count="localData.cardCount"
      @update:desc="localData.desc = $event"
      @update:title="localData.title = $event"
      @update:link-label="localData.linkLabel = $event"
      @update:link-url="localData.linkUrl = $event"
      @update:link-target="localData.linkTarget = $event"
      @update:card-count="localData.cardCount = $event"
    />

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Publicaciones</h6>
      <span class="badge bg-secondary">{{ localData.cards.length }}</span>
    </div>
    <p class="ps-hint">
      Agrega las que necesites. Se ven {{ localData.cardCount }} a la vez y el
      resto se alcanza deslizando el carrusel.
    </p>

    <CardAccordionItem
      v-for="(card, index) in localData.cards"
      :edit-key="`cards.${index}`"
      :key="card.id"
      :title="card.title"
      :index="index"
      :total="localData.cards.length"
      :open="openIndex === index"
      remove-label="Quitar publicación"
      @toggle="toggle(index)"
      @move="moveCard(index, $event)"
      @remove="removeCard(index)"
    >
      <div>
        <EditorTextarea v-model="card.title" data-edit-target=".title" class="mb-2" label="Título" :rows="2" />

        <EditorImage
          v-model="card.image"
          v-model:alt="card.imageAlt"
          v-model:focus-x="card.imageFocusX"
          v-model:focus-y="card.imageFocusY"
          focus-ratio="16 / 9"
          data-edit-target=".image"
          alt-edit-target=".imageAlt"
          class="mb-2"
          @select="$emit('select-image', { item: card, field: 'image' })"
        />

        <EditorUrl v-model="card.href" v-model:target="card.target" data-edit-target=".href" class="mb-2" label="Destino" />

        <label class="form-label">Fecha</label>
        <input v-model="card.date" data-edit-target=".date" type="date" class="form-control form-control-sm" />
        <p class="ps-hint mt-1">
          <template v-if="preview(card.date)">
            En la tarjeta se verá <strong>{{ preview(card.date) }}</strong>.
          </template>
          <template v-else-if="card.date">
            Se conserva lo anterior: <strong>{{ card.date }}</strong>.
          </template>
          <template v-else>
            Elige una fecha y se mostrará en formato día, mes y año.
          </template>
        </p>

        <EditorText
          v-model="card.ctaLabel"
          data-edit-target=".ctaLabel"
          class="mb-2"
          label="Texto del enlace"
          placeholder="Leer artículo"
        />

        <BadgeListEditor :badges="card.badges" data-edit-target=".badges" />
      </div>
    </CardAccordionItem>

    <button type="button" class="btn btn-sm btn-danger w-100" @click="addCard">
      <i class="las la-plus me-1"></i> Agregar publicación
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor de la sección de publicaciones destacadas.
 */
import { ref, watch } from 'vue';
import CardSectionHeaderEditor from '../_shared/CardSectionHeaderEditor.vue';
import BadgeListEditor from '../_shared/BadgeListEditor.vue';
import CardAccordionItem from '../_shared/CardAccordionItem.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import { newCardId, normalizeCardCount, type PostCardItem } from '../_shared/types';
import { toDisplayDate } from '../_shared/date';
import { normalizeImageFocus } from '../../../../helpers/imageFocus';
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';

/** Vista previa de cómo quedará la fecha en la tarjeta. */
const preview = (iso: string) => toDisplayDate(iso ?? '');

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const buildCard = (source: any): PostCardItem => ({
  id: source?.id || newCardId(),
  image: source?.image ?? '',
  imageAlt: source?.imageAlt ?? '',
  imageFocusX: normalizeImageFocus(source?.imageFocusX),
  imageFocusY: normalizeImageFocus(source?.imageFocusY),
  title: source?.title ?? '',
  href: source?.href ?? '',
  target: normalizeLinkTarget(source?.target),
  date: source?.date ?? '',
  ctaLabel: source?.ctaLabel ?? 'Leer artículo',
  badges: Array.isArray(source?.badges) ? [...source.badges] : [],
});

const build = (source: any) => ({
  desc: source?.desc ?? '',
  title: source?.title ?? '',
  linkLabel: source?.linkLabel ?? '',
  linkUrl: source?.linkUrl ?? '',
  linkTarget: normalizeLinkTarget(source?.linkTarget),
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
.ps-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}
</style>

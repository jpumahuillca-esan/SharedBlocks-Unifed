<template>
  <div class="ec-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Encabezado</h6>

    <label class="form-label">Título</label>
    <textarea v-model="localData.title" class="form-control form-control-sm mb-2" rows="2"></textarea>

    <label class="form-label">Descripción</label>
    <textarea v-model="localData.desc" class="form-control form-control-sm mb-2" rows="3"></textarea>

    <hr />

    <!-- Escuelas grandes -->
    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Escuelas</h6>
      <span class="badge bg-secondary">{{ localData.features.length }}</span>
    </div>
    <p class="ec-hint">Las tarjetas grandes de la columna izquierda.</p>

    <CardAccordionItem
      v-for="(card, index) in localData.features"
      :key="card.id"
      :title="card.title"
      :index="index"
      :total="localData.features.length"
      :open="isOpen('features', index)"
      remove-label="Quitar escuela"
      @toggle="toggle('features', index)"
      @move="move('features', index, $event)"
      @remove="remove('features', index)"
    >
      <EcosystemCardFields :card="card" @select-image="$emit('select-image', $event)" />
    </CardAccordionItem>

    <button type="button" class="btn btn-sm btn-outline-secondary w-100" @click="add('features')">
      <i class="las la-plus me-1"></i> Agregar escuela
    </button>

    <hr />

    <!-- Franja -->
    <h6 class="fw-bold small text-uppercase mb-1">Franja de facultades</h6>
    <p class="ec-hint">
      Encabeza el grupo de la derecha. Siempre va en el rojo institucional.
    </p>

    <label class="form-label">Título</label>
    <input
      v-model="localData.bar.title"
      type="text"
      class="form-control form-control-sm mb-2"
      placeholder="ESAN University"
    />

    <label class="form-label">Descripción</label>
    <input
      v-model="localData.bar.desc"
      type="text"
      class="form-control form-control-sm mb-2"
      placeholder="Carreras de pregrado, postgrado y para gente que trabaja (DPA)"
    />

    <label class="form-label">Destino</label>
    <input
      v-model="localData.bar.href"
      type="text"
      class="form-control form-control-sm mb-2"
      placeholder="/ruta o https://"
    />

    <hr />

    <!-- Facultades -->
    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Facultades</h6>
      <span class="badge bg-secondary">{{ localData.faculties.length }}</span>
    </div>
    <p class="ec-hint">Las tarjetas del grupo de la derecha.</p>

    <CardAccordionItem
      v-for="(card, index) in localData.faculties"
      :key="card.id"
      :title="card.title"
      :index="index"
      :total="localData.faculties.length"
      :open="isOpen('faculties', index)"
      remove-label="Quitar facultad"
      @toggle="toggle('faculties', index)"
      @move="move('faculties', index, $event)"
      @remove="remove('faculties', index)"
    >
      <EcosystemCardFields :card="card" @select-image="$emit('select-image', $event)" />
    </CardAccordionItem>

    <button type="button" class="btn btn-sm btn-danger w-100" @click="add('faculties')">
      <i class="las la-plus me-1"></i> Agregar facultad
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor de la sección del ecosistema académico.
 *
 * Dos listas con la misma forma de tarjeta, así que comparten los campos
 * (EcosystemCardFields) y las operaciones de lista. Lo que cambia es de qué
 * grupo salen.
 */
import { ref, watch } from 'vue';
/*
 * El acordeón viene de la familia `events`. Tercer bloque que lo reutiliza así:
 * toca subirlo a block-beta/_shared/.
 */
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EcosystemCardFields from '../_shared/EcosystemCardFields.vue';
import {
  newEcosystemCardId,
  normalizeEcosystemCard,
  type EcosystemCardItem,
} from '../_shared/types';

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

/** Las dos listas de tarjetas de la sección. */
type CardList = 'features' | 'faculties';

const buildCard = (source: any): EcosystemCardItem => ({
  ...normalizeEcosystemCard(source),
  id: source?.id || newEcosystemCardId(),
});

const build = (source: any) => ({
  title: source?.title ?? '',
  desc: source?.desc ?? '',
  features: Array.isArray(source?.features) ? source.features.map(buildCard) : [],
  bar: {
    title: source?.bar?.title ?? '',
    desc: source?.bar?.desc ?? '',
    href: source?.bar?.href ?? '',
  },
  faculties: Array.isArray(source?.faculties) ? source.faculties.map(buildCard) : [],
});

const localData = ref(build(props.modelValue));

/*
 * Un solo panel abierto por lista. Se guarda de qué lista es, porque abrir una
 * facultad no debe cerrar la escuela que se estaba mirando ni al revés.
 */
const openPanel = ref<Record<CardList, number | null>>({
  features: null,
  faculties: null,
});

const isOpen = (list: CardList, index: number) => openPanel.value[list] === index;

const toggle = (list: CardList, index: number) => {
  openPanel.value[list] = openPanel.value[list] === index ? null : index;
};

const add = (list: CardList) => {
  localData.value[list].push(buildCard({}));
  // La tarjeta nueva se abre sola: es la que se va a rellenar.
  openPanel.value[list] = localData.value[list].length - 1;
};

const remove = (list: CardList, index: number) => {
  localData.value[list].splice(index, 1);

  // El índice abierto se corrige para no quedar apuntando a otra tarjeta.
  const open = openPanel.value[list];
  if (open === index) openPanel.value[list] = null;
  else if (open !== null && open > index) openPanel.value[list] = open - 1;
};

const move = (list: CardList, index: number, delta: number) => {
  const target = index + delta;
  const cards = localData.value[list];
  if (target < 0 || target >= cards.length) return;

  [cards[index], cards[target]] = [cards[target], cards[index]];

  // El panel abierto viaja con su tarjeta.
  const open = openPanel.value[list];
  if (open === index) openPanel.value[list] = target;
  else if (open === target) openPanel.value[list] = index;
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
.ec-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}
</style>

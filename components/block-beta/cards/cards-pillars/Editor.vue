<template>
  <div class="cards-pillars-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado</h6>
    <label class="form-label">Título de la sección</label>
    <input
      v-model="localData.title"
      data-edit-target="title"
      type="text"
      class="form-control form-control-sm mb-1"
      placeholder="Nuestros pilares"
      :maxlength="rules.title.maxLength"
    />
    <div class="cp-limit mb-3">
      <span>Máximo {{ rules.title.maxLength }} caracteres.</span>
      <span>{{ localData.title.length }}/{{ rules.title.maxLength }}</span>
    </div>

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Tarjetas</h6>
      <span class="badge bg-secondary">{{ localData.cards.length }}</span>
    </div>
    <p class="cp-hint">
      En escritorio se distribuyen hasta en cinco columnas; en pantallas más estrechas se reorganizan.
    </p>

    <CardAccordionItem
      v-for="(card, index) in localData.cards"
      :key="card.id"
      :edit-key="'cards.' + index"
      :title="card.title || 'Pilar sin título'"
      :index="index"
      :total="localData.cards.length"
      :open="openIndex === index"
      remove-label="Quitar tarjeta"
      @toggle="toggle(index)"
      @move="moveCard(index, $event)"
      @remove="removeCard(index)"
    >
      <div>
        <label class="form-label">Icono</label>
        <div class="d-flex align-items-center gap-2 mb-3">
          <span class="cp-icon-preview" aria-hidden="true">
            <AtomIcon :name="card.icon" :size="22" />
          </span>
          <select
            v-model="card.icon"
            data-edit-target=".icon"
            class="form-select form-select-sm"
          >
            <option v-for="name in ICON_SUGGESTIONS" :key="name" :value="name">
              {{ name }}
            </option>
          </select>
        </div>

        <label class="form-label">Título de la tarjeta</label>
        <input
          v-model="card.title"
          data-edit-target=".title"
          type="text"
          class="form-control form-control-sm mb-1"
          placeholder="Nombre del pilar"
          :maxlength="rules.card.title.maxLength"
        />
        <div class="cp-limit mb-3">
          <span>Máximo {{ rules.card.title.maxLength }} caracteres.</span>
          <span>{{ card.title.length }}/{{ rules.card.title.maxLength }}</span>
        </div>
      </div>
    </CardAccordionItem>

    <div v-if="!localData.cards.length" class="cp-empty">
      No hay tarjetas. Agrega una para empezar a configurar los pilares.
    </div>

    <button type="button" class="btn btn-sm btn-danger w-100 mt-2" @click="addCard">
      <i class="las la-plus me-1"></i> Agregar tarjeta
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import { ICON_SUGGESTIONS } from '../../../../helpers/iconOptions';
import { buildCardsPillarsData, buildPillarCard } from './_shared/types';
import { CARDS_PILLARS_CONTENT_RULES } from './_shared/rules';

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue']);

const rules = CARDS_PILLARS_CONTENT_RULES;
const localData = ref(buildCardsPillarsData(props.modelValue));
const openIndex = ref<number | null>(null);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addCard = () => {
  localData.value.cards.push(buildPillarCard({ title: 'Nuevo pilar' }));
  openIndex.value = localData.value.cards.length - 1;
};

const removeCard = (index: number) => {
  localData.value.cards.splice(index, 1);

  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveCard = (index: number, delta: number) => {
  const target = index + delta;
  const cards = localData.value.cards;
  if (target < 0 || target >= cards.length) return;

  [cards[index], cards[target]] = [cards[target], cards[index]];

  if (openIndex.value === index) openIndex.value = target;
  else if (openIndex.value === target) openIndex.value = index;
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue || JSON.stringify(newValue) === JSON.stringify(localData.value)) return;
    localData.value = buildCardsPillarsData(newValue);
  },
  { deep: true },
);

watch(
  localData,
  (newValue) => emit('update:modelValue', JSON.parse(JSON.stringify(newValue))),
  { deep: true },
);
</script>

<style scoped>
.cp-hint {
  margin: 0 0 8px;
  color: #6b7688;
  font-size: 11.5px;
  line-height: 1.45;
}

.cp-limit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: #6b7688;
  font-size: 11.5px;
  line-height: 1.45;
}

.cp-icon-preview {
  display: inline-flex;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: transparent;
  color: #e3173e;
}

.cp-empty {
  padding: 12px;
  border: 1px dashed #c6cedb;
  border-radius: 6px;
  color: #6b7688;
  font-size: 12px;
  text-align: center;
}
</style>

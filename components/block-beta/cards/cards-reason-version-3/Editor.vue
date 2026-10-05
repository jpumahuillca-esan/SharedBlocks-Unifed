<template>
  <div class="cards-r3-editor">
    <!-- Encabezado de la sección -->
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado</h6>
    <p class="cr3-hint">
      El encabezado se centra sobre las tarjetas. Deja un campo vacío si deseas ocultarlo.
    </p>

    <EditorText
      v-model="localData.eyebrow"
      data-edit-target="eyebrow"
      class="mb-2"
      label="Etiqueta superior (Eyebrow - opcional)"
      placeholder="Ej: ¿POR QUÉ ESAN?"
    />

    <EditorText
      v-model="localData.title"
      data-edit-target="title"
      class="mb-2"
      label="Título principal"
      hint="Título de la sección. Lleva siempre el guion rojo de acento debajo."
      placeholder="¿Por qué elegir a ESAN?"
    />

    <EditorTextarea
      v-model="localData.desc"
      data-edit-target="desc"
      class="mb-3"
      label="Descripción de apoyo (opcional)"
      :rows="2"
      placeholder="Descripción o subtítulo complementario"
    />

    <hr class="my-3" />

    <!-- Listado de razones/métricas -->
    <div class="d-flex align-items-center justify-content-between mb-2">
      <div class="d-flex align-items-center gap-2">
        <h6 class="fw-bold small text-uppercase m-0">Tarjetas de Razones</h6>
        <span class="badge bg-secondary">{{ localData.cards.length }}</span>
      </div>
      <button
        type="button"
        class="btn btn-sm btn-outline-primary"
        @click="addCard"
      >
        <i class="las la-plus me-1"></i> Agregar tarjeta
      </button>
    </div>

    <p class="cr3-hint">
      En escritorio se distribuyen en 4 columnas por fila; en tableta en 2x2 y en móvil en 1 columna.
    </p>

    <CardAccordionItem
      v-for="(card, index) in localData.cards"
      :edit-key="`cards.${index}`"
      :key="card.id"
      :title="`${card.number} - ${card.label || 'Sin descripción'}`"
      :index="index"
      :total="localData.cards.length"
      :open="openIndex === index"
      remove-label="Quitar tarjeta"
      @toggle="toggle(index)"
      @move="moveCard(index, $event)"
      @remove="removeCard(index)"
    >
      <div>
        <!-- Cifra o número destacado -->
        <EditorText
          v-model="card.number"
          data-edit-target=".number"
          class="mb-2"
          label="Cifra o indicador destacado"
          hint="Aparece en rojo y con tamaño grande (ej: 1º, 3º, 11, +130, 95%)."
          placeholder="Ej: 1º"
        />

        <!-- Texto explicativo -->
        <EditorTextarea
          v-model="card.label"
          data-edit-target=".label"
          class="mb-2"
          label="Texto explicativo / Razón"
          :rows="2"
          placeholder="Ej: Ranking Merco Empresas 2025 - Sector Educación"
        />

        <!-- Enlace de destino -->
        <!-- El interruptor "Link interno / Página externa" reemplaza al antiguo "Abrir en nueva pestaña". -->
        <EditorUrl
          v-model="card.href"
          v-model:target="card.target"
          data-edit-target=".href"
          label="Enlace de destino (opcional)"
          placeholder="/reconocimientos o https://"
        />
      </div>
    </CardAccordionItem>

    <div v-if="localData.cards.length === 0" class="text-center py-3 text-muted small border rounded">
      No hay tarjetas agregadas. Haz clic en "Agregar tarjeta".
    </div>

    <button
      v-if="localData.cards.length > 0"
      type="button"
      class="btn btn-sm btn-outline-secondary w-100 mt-2"
      @click="addCard"
    >
      <i class="las la-plus me-1"></i> Agregar otra tarjeta
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor para el bloque Cards Reason Version 3.
 *
 * Permite gestionar el encabezado y las tarjetas con métricas/razones,
 * número en rojo y texto descriptivo.
 */
import { ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import { buildReasonCard, buildCardsReasonVersion3Data, type CardReasonItem } from './types';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(['update:modelValue']);

const localData = ref(buildCardsReasonVersion3Data(props.modelValue));

const openIndex = ref<number | null>(null);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addCard = () => {
  const newCard = buildReasonCard({
    number: '+100',
    label: 'Nueva razón o reconocimiento',
  });
  localData.value.cards.push(newCard);
  openIndex.value = localData.value.cards.length - 1;
};

const removeCard = (index: number) => {
  localData.value.cards.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveCard = (index: number, delta: number) => {
  const target = index + delta;
  const list = localData.value.cards;
  if (target < 0 || target >= list.length) return;

  [list[index], list[target]] = [list[target], list[index]];

  if (openIndex.value === index) openIndex.value = target;
  else if (openIndex.value === target) openIndex.value = index;
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return;
    if (JSON.stringify(newVal) === JSON.stringify(localData.value)) return;
    localData.value = buildCardsReasonVersion3Data(newVal);
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
.cr3-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}
</style>

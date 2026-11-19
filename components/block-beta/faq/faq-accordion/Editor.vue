<template>
  <div class="faq-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado</h6>

    <EditorText
      v-model="localData.eyebrow"
      data-edit-target="eyebrow"
      class="mb-2"
      label="Antetítulo"
      placeholder="— Preguntas y Respuestas"
    />

    <EditorText
      v-model="localData.title"
      data-edit-target="title"
      class="mb-2"
      label="Título principal"
      placeholder="Preguntas Frecuentes"
    />

    <EditorTextarea
      v-model="localData.desc"
      data-edit-target="desc"
      class="mb-2"
      label="Descripción (opcional)"
      :rows="2"
      placeholder="Encuentra respuestas a las dudas más comunes sobre la carrera."
    />

    <hr class="my-3" />

    <h6 class="fw-bold small text-uppercase mb-2">Buscador</h6>

    <div class="form-check form-switch mb-2">
      <input
        id="faq-show-search"
        v-model="localData.showSearch"
        type="checkbox"
        class="form-check-input"
      />
      <label for="faq-show-search" class="form-check-label small fw-semibold">
        Mostrar barra de búsqueda
      </label>
    </div>

    <EditorText
      v-if="localData.showSearch"
      v-model="localData.searchPlaceholder"
      class="mb-2"
      label="Texto marcador de búsqueda"
      placeholder="Busca tu pregunta (ej. becas, carreras, virtual, acreditación)..."
    />

    <hr class="my-3" />

    <div class="d-flex align-items-center justify-content-between mb-2">
      <h6 class="fw-bold small text-uppercase m-0">Preguntas y Respuestas</h6>
      <span class="badge bg-secondary">{{ localData.items.length }}</span>
    </div>

    <p class="small text-muted mb-2">
      Agrega las preguntas frecuentes del programa. Los usuarios podrán buscarlas o desplegarlas.
    </p>

    <div class="faq-items-list mb-3">
      <CardAccordionItem
        v-for="(item, index) in localData.items"
        :key="item.id"
        :edit-key="`items.${index}`"
        :title="item.question || `Pregunta ${index + 1}`"
        :index="index"
        :total="localData.items.length"
        :open="openIndex === index"
        @toggle="toggleItem(index)"
        @move-up="moveItem(index, -1)"
        @move-down="moveItem(index, 1)"
        @remove="removeItem(index)"
      >
        <div class="p-2">
          <EditorText
            v-model="item.question"
            label="Pregunta"
            placeholder="¿Cuánto cuesta estudiar Administración?"
            class="mb-2"
          />

          <EditorTextarea
            v-model="item.answer"
            label="Respuesta"
            :rows="4"
            placeholder="Escribe la respuesta detallada..."
            class="mb-2"
          />

          <div class="form-check form-switch mt-2">
            <input
              :id="`faq-default-open-${item.id}`"
              v-model="item.defaultOpen"
              type="checkbox"
              class="form-check-input"
            />
            <label :for="`faq-default-open-${item.id}`" class="form-check-label small">
              Abierto por defecto
            </label>
          </div>
        </div>
      </CardAccordionItem>
    </div>

    <button
      type="button"
      class="btn btn-outline-primary btn-sm w-100"
      @click="addItem"
    >
      <i class="las la-plus me-1"></i> Agregar pregunta
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import {
  buildFaqAccordionData,
  createFaqItemId,
  type FaqAccordionData,
  type FaqItem,
} from './shared/types';

const props = defineProps<{
  modelValue: Partial<FaqAccordionData> | any;
}>();

const emit = defineEmits(['update:modelValue']);

const localData = ref<FaqAccordionData>(buildFaqAccordionData(props.modelValue));
const openIndex = ref<number | null>(0);

const toggleItem = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addItem = () => {
  const newItem: FaqItem = {
    id: createFaqItemId(),
    question: '',
    answer: '',
    defaultOpen: false,
  };
  localData.value.items.push(newItem);
  openIndex.value = localData.value.items.length - 1;
};

const removeItem = (index: number) => {
  localData.value.items.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value--;
};

const moveItem = (index: number, delta: number) => {
  const target = index + delta;
  if (target < 0 || target >= localData.value.items.length) return;
  const item = localData.value.items.splice(index, 1)[0];
  localData.value.items.splice(target, 0, item);
  if (openIndex.value === index) openIndex.value = target;
};

watch(
  localData,
  (val) => {
    emit('update:modelValue', JSON.parse(JSON.stringify(val)));
  },
  { deep: true },
);

watch(
  () => props.modelValue,
  (val) => {
    if (JSON.stringify(val) !== JSON.stringify(localData.value)) {
      localData.value = buildFaqAccordionData(val);
    }
  },
  { deep: true },
);
</script>

<style scoped>
.faq-editor {
  padding: 8px 0;
}
.faq-items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>


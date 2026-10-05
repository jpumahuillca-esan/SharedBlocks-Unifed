<template>
  <div class="cards-v2-editor">
    <!-- Encabezado de la sección -->
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado y Diseño</h6>
    <p class="cv2-hint">
      Configura el fondo del bloque y los textos de cabecera. Deja un campo vacío si no deseas mostrarlo.
    </p>

    <!-- Color de fondo de la sección -->
    <label class="form-label">Color de fondo del bloque</label>
    <p class="cv2-hint">Selecciona el color de fondo para la sección.</p>
    <div class="d-flex align-items-center gap-2 mb-3">
      <span
        class="cv2-bg-preview"
        :style="{ backgroundColor: localData.backgroundColor || '#F1F5F9' }"
        aria-hidden="true"
      ></span>
      <select v-model="localData.backgroundColor" data-edit-target="backgroundColor" class="form-select form-select-sm">
        <option value="#F1F5F9">Gris claro (#F1F5F9)</option>
        <option value="#FFFFFF">Blanco (#FFFFFF)</option>
      </select>
    </div>

    <EditorText
      v-model="localData.eyebrow"
      data-edit-target="eyebrow"
      class="mb-2"
      label="Etiqueta superior (Eyebrow)"
      hint='Texto corto en color institucional (ej. "+ PREGRADO").'
      placeholder="+ PREGRADO"
    />

    <!-- Selector único de color institucional para el Eyebrow (texto y punto) -->
    <div v-if="localData.eyebrow" class="mb-3">
      <EditorBrandColor
        v-model="localData.eyebrowColorToken"
        data-edit-target="eyebrowColorToken"
        label="Color del antetítulo (texto y punto)"
      />
    </div>

    <EditorText
      v-model="localData.title"
      data-edit-target="title"
      class="mb-2"
      label="Título principal"
      hint="Título de la sección. Lleva siempre el guion rojo de acento debajo."
      placeholder="Carreras universitarias en ciencias administrativas"
    />

    <EditorTextarea
      v-model="localData.desc"
      data-edit-target="desc"
      class="mb-3"
      label="Descripción de apoyo (opcional)"
      :rows="2"
      placeholder="Descripción o subtítulo opcional de la sección"
    />

    <hr class="my-3" />

    <!-- Listado de tarjetas -->
    <div class="d-flex align-items-center justify-content-between mb-2">
      <div class="d-flex align-items-center gap-2">
        <h6 class="fw-bold small text-uppercase m-0">Tarjetas</h6>
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

    <p class="cv2-hint">
      Se distribuyen centradas en 3 columnas en escritorio, 2 en tableta y 1 en móvil.
    </p>

    <CardAccordionItem
      v-for="(card, index) in localData.cards"
      :edit-key="`cards.${index}`"
      :key="card.id"
      :title="card.title || 'Tarjeta sin título'"
      :index="index"
      :total="localData.cards.length"
      :open="openIndex === index"
      remove-label="Quitar tarjeta"
      @toggle="toggle(index)"
      @move="moveCard(index, $event)"
      @remove="removeCard(index)"
    >
      <div>
        <!-- Selección de ícono -->
        <label class="form-label">Ícono</label>
        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="cv2-icon-preview" aria-hidden="true">
            <AtomIcon :name="card.icon || 'graduation-cap'" :size="18" />
          </span>
          <select v-model="card.icon" data-edit-target=".icon" class="form-select form-select-sm">
            <option v-for="name in ICON_SUGGESTIONS" :key="name" :value="name">
              {{ name }}
            </option>
          </select>
        </div>

        <!-- Título de la tarjeta -->
        <EditorText
          v-model="card.title"
          data-edit-target=".title"
          class="mb-2"
          label="Título de la tarjeta"
          placeholder="Ej: Administración y Finanzas"
        />

        <!-- Descripción corta opcional -->
        <EditorText
          v-model="card.desc"
          data-edit-target=".desc"
          class="mb-2"
          label="Descripción corta (opcional)"
          hint="Texto complementario visible bajo el título."
          placeholder="Ej: Descripción corta"
        />

        <!-- Enlace de destino -->
        <!-- El interruptor "Link interno / Página externa" reemplaza al antiguo "Abrir en nueva pestaña". -->
        <EditorUrl
          v-model="card.href"
          v-model:target="card.target"
          data-edit-target=".href"
          label="Enlace de destino (URL)"
          placeholder="/carreras/administracion-y-finanzas"
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
 * Editor para el bloque Cards Version 2.
 *
 * Permite gestionar la etiqueta superior, título, descripción y la lista
 * de tarjetas individuales con ícono, textos y enlaces.
 */
import { ref, watch } from 'vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import { ICON_SUGGESTIONS } from '../../../../helpers/iconOptions';
import { buildCard, buildCardsVersion2Data, type CardVersion2Item } from './types';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(['update:modelValue']);

const localData = ref(buildCardsVersion2Data(props.modelValue));

const openIndex = ref<number | null>(null);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addCard = () => {
  const newCard = buildCard({
    title: 'Nueva carrera / especialidad',
    icon: 'graduation-cap',
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
    localData.value = buildCardsVersion2Data(newVal);
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
.cv2-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

.cv2-bg-preview {
  display: inline-block;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
}

.cv2-icon-preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: #f1f5f9;
  color: #0f172a;
  flex-shrink: 0;
}
</style>

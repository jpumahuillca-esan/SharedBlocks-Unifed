<template>
  <div class="cards-dpa-editor">
    <!-- SECCIÓN 1: ENCABEZADO Y TEXTOS -->
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado de Sección</h6>
    <p class="editor-hint">
      Configura el logo institucional, título H2, descripción y enlace derecho.
    </p>

    <!-- Logo DPA (Imagen) -->
    <div class="mb-3">
      <label class="form-label small fw-semibold">Logo institucional (Imagen)</label>
      <EditorImage
        v-model="localData.logoImage"
        v-model:alt="localData.logoAlt"
        data-edit-target="logoImage"
        alt-edit-target="logoAlt"
        class="mb-2"
        :height="70"
        empty-text="Seleccionar logo (ESAN DPA)"
        alt-placeholder="Texto alternativo del logo"
        @select="$emit('select-image', { item: localData, field: 'logoImage' })"
      />
      <div v-if="localData.logoImage" class="d-flex align-items-center gap-2 mt-1">
        <label class="small text-muted mb-0">Altura (px):</label>
        <input
          v-model.number="localData.logoHeight"
          type="number"
          min="24"
          max="120"
          class="form-control form-control-sm"
          style="width: 80px;"
        />
      </div>
    </div>

    <!-- Título H2 -->
    <EditorText
      v-model="localData.title"
      data-edit-target="title"
      class="mb-2"
      label="Título de la sección (H2)"
      hint="Titular principal de la sección. Lleva un guion de acento debajo."
      placeholder="Carreras para gente que trabaja"
    />

    <!-- Descripción P -->
    <EditorTextarea
      v-model="localData.desc"
      data-edit-target="desc"
      class="mb-3"
      label="Descripción (Párrafo)"
      :rows="3"
      placeholder="Texto de apoyo para explicar las características de las carreras."
    />

    <!-- Enlace lateral derecho -->
    <div class="p-2 border rounded bg-light mb-3">
      <label class="form-label small fw-semibold mb-1">Enlace lateral derecho</label>
      <EditorText
        v-model="localData.linkLabel"
        data-edit-target="linkLabel"
        class="mb-2"
        label="Texto del enlace"
        placeholder="Descubre más de ESAN DPA"
      />
      <EditorUrl
        v-model="localData.linkUrl"
        v-model:target="localData.linkTarget"
        data-edit-target="linkUrl"
        label="Destino (URL)"
        placeholder="/programas/dpa"
      />
    </div>

    <hr class="my-3" />

    <!-- SECCIÓN 2: FONDO Y ESTILO -->
    <h6 class="fw-bold small text-uppercase mb-2">Fondo del Bloque</h6>
    <p class="editor-hint">
      Elige si deseas fondo mixto (imagen con degradado), degradado puro o color sólido.
    </p>

    <div class="mb-3">
      <label class="form-label small fw-semibold">Tipo de fondo</label>
      <select v-model="localData.bgType" class="form-select form-select-sm">
        <option value="overlay">Mixto (Imagen con degradado encima)</option>
        <option value="gradient">Degradado institucional</option>
        <option value="color">Color sólido</option>
      </select>
    </div>

    <!-- Imagen de fondo (si es overlay) -->
    <div v-if="localData.bgType === 'overlay'" class="mb-3">
      <label class="form-label small fw-semibold">Fotografía de fondo</label>
      <EditorImage
        v-model="localData.backgroundImage"
        data-edit-target="backgroundImage"
        :height="100"
        empty-text="Seleccionar foto de fondo"
        @select="$emit('select-image', { item: localData, field: 'backgroundImage' })"
      />
    </div>

    <!-- Colores de degradado (si es overlay o gradient) -->
    <div v-if="localData.bgType === 'overlay' || localData.bgType === 'gradient'" class="mb-3">
      <label class="form-label small fw-semibold">Tonalidad del degradado</label>
      <div class="d-flex flex-column gap-2">
        <div class="d-flex align-items-center gap-2">
          <span class="small text-muted" style="width: 50px;">Inicio:</span>
          <input
            v-model="localData.gradientStart"
            type="text"
            class="form-control form-control-sm font-monospace"
            placeholder="rgba(11, 27, 61, 0.94)"
          />
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="small text-muted" style="width: 50px;">Fin:</span>
          <input
            v-model="localData.gradientEnd"
            type="text"
            class="form-control form-control-sm font-monospace"
            placeholder="rgba(22, 44, 94, 0.88)"
          />
        </div>
      </div>
      <!-- Presets rápidos -->
      <div class="d-flex gap-1 mt-2">
        <button
          type="button"
          class="btn btn-xs btn-outline-secondary"
          @click="applyGradientPreset('dpa')"
        >
          Azul DPA (Oficial)
        </button>
        <button
          type="button"
          class="btn btn-xs btn-outline-secondary"
          @click="applyGradientPreset('dark')"
        >
          Azul Noche Profundo
        </button>
        <button
          type="button"
          class="btn btn-xs btn-outline-secondary"
          @click="applyGradientPreset('esan')"
        >
          Azul ESAN Real
        </button>
      </div>
    </div>

    <!-- Color sólido (si es color) -->
    <div v-if="localData.bgType === 'color'" class="mb-3">
      <label class="form-label small fw-semibold">Color de fondo</label>
      <input
        v-model="localData.backgroundColor"
        type="color"
        class="form-control form-control-color w-100"
      />
    </div>

    <hr class="my-3" />

    <!-- SECCIÓN 3: TARJETAS (CARDS) -->
    <div class="d-flex align-items-center justify-content-between mb-2">
      <div class="d-flex align-items-center gap-2">
        <h6 class="fw-bold small text-uppercase m-0">Tarjetas de Carreras</h6>
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
    <p class="editor-hint">
      Se distribuyen en 4 columnas en escritorio, 2 en tableta y 1 en móvil.
    </p>

    <!-- Lista de tarjetas con acordeón -->
    <CardAccordionItem
      v-for="(card, index) in localData.cards"
      :key="card.id"
      :edit-key="`cards.${index}`"
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
        <!-- Fotografía de la tarjeta (con punto focal) -->
        <label class="form-label small fw-semibold">Fotografía del programa</label>
        <EditorImage
          v-model="card.image"
          v-model:alt="card.imageAlt"
          v-model:focus-x="card.imageFocusX"
          v-model:focus-y="card.imageFocusY"
          data-edit-target=".image"
          class="mb-2"
          :height="100"
          :focus-height="120"
          focus-sliders
          empty-text="Seleccionar fotografía"
          alt-placeholder="Descripción de la imagen"
          @select="$emit('select-image', { item: card, field: 'image' })"
        />

        <!-- Título -->
        <EditorText
          v-model="card.title"
          data-edit-target=".title"
          class="mb-2"
          label="Título de la carrera"
          placeholder="Ej: ESAN Management"
        />

        <!-- Descripción corta -->
        <EditorText
          v-model="card.desc"
          data-edit-target=".desc"
          class="mb-2"
          label="Descripción o área"
          placeholder="Ej: Carreras de ciencias administrativas"
        />

        <!-- Enlace -->
        <EditorUrl
          v-model="card.url"
          v-model:target="card.target"
          data-edit-target=".url"
          label="Enlace de destino (URL)"
          placeholder="/carreras/administracion"
        />
      </div>
    </CardAccordionItem>

    <div
      v-if="localData.cards.length === 0"
      class="text-center py-3 text-muted small border rounded"
    >
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
import { ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import { buildCardItem, buildCardsDpaData, type CardsDpaData } from './types';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref<CardsDpaData>(buildCardsDpaData(props.modelValue));
const openIndex = ref<number | null>(null);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addCard = () => {
  localData.value.cards.push(
    buildCardItem(
      {
        title: 'Nueva Carrera',
        desc: 'Descripción del área académica',
        url: '',
      },
      localData.value.cards.length
    )
  );
  openIndex.value = localData.value.cards.length - 1;
};

const removeCard = (index: number) => {
  localData.value.cards.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value--;
};

const moveCard = (index: number, direction: 'up' | 'down') => {
  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= localData.value.cards.length) return;
  const temp = localData.value.cards[index];
  localData.value.cards[index] = localData.value.cards[target];
  localData.value.cards[target] = temp;
  openIndex.value = target;
};

const applyGradientPreset = (preset: 'dpa' | 'dark' | 'esan') => {
  if (preset === 'dpa') {
    localData.value.gradientStart = 'rgba(11, 27, 61, 0.94)';
    localData.value.gradientEnd = 'rgba(22, 44, 94, 0.88)';
  } else if (preset === 'dark') {
    localData.value.gradientStart = 'rgba(8, 16, 36, 0.96)';
    localData.value.gradientEnd = 'rgba(14, 27, 56, 0.92)';
  } else if (preset === 'esan') {
    localData.value.gradientStart = 'rgba(16, 37, 85, 0.93)';
    localData.value.gradientEnd = 'rgba(28, 55, 120, 0.85)';
  }
};

watch(
  localData,
  (val) => {
    emit('update:modelValue', JSON.parse(JSON.stringify(val)));
  },
  { deep: true }
);
</script>

<style scoped>
.cards-dpa-editor {
  display: flex;
  flex-direction: column;
}
.editor-hint {
  font-size: 0.78rem;
  color: #64748b;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}
.btn-xs {
  font-size: 0.72rem;
  padding: 2px 6px;
}
</style>


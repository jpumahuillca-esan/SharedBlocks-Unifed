<template>
  <div>
    <EditorText v-model="card.title" data-edit-target=".title" class="mb-2" label="Título" />

    <EditorTextarea
      v-model="card.desc"
      data-edit-target=".desc"
      class="mb-2"
      label="Descripción"
      hint="Opcional. Vacía, no se muestra."
      :rows="2"
    />

    <label class="form-label">Color</label>
    <p class="ecf-hint">
      Son los colores de marca del sistema. No hay selector libre a propósito:
      así, si la marca corrige un tono, las páginas ya publicadas lo siguen solas.
    </p>
    <select v-model="card.color" data-edit-target=".color" class="form-select form-select-sm mb-1">
      <option v-for="option in ECOSYSTEM_COLORS" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <div class="ecf-swatches mb-2">
      <button
        v-for="option in ECOSYSTEM_COLORS"
        :key="option.value"
        type="button"
        class="ecf-swatch"
        :class="{ 'is-active': card.color === option.value }"
        :style="{ background: `var(${option.token})` }"
        :title="option.label"
        :aria-label="option.label"
        :aria-pressed="card.color === option.value ? 'true' : 'false'"
        @click="card.color = option.value"
      ></button>
    </div>

    <!-- Al pulsar la foto en el lienzo se resalta y enfoca el botón de elegir imagen. -->
    <EditorImage
      v-model="card.image"
      v-model:alt="card.imageAlt"
      :focus-values="card.imageFocusProfiles"
      :focus-modes="imageFocusModes"
      :focus-ratio="imageRatio"
      focus-crop-preview
      data-edit-target=".image"
      alt-edit-target=".imageAlt"
      class="mb-2"
      @select="$emit('select-image', { item: card, field: 'image' })"
      @update:focus-values="saveImageFocusProfiles(card, $event)"
    />

    <EditorUrl v-model="card.href" v-model:target="card.target" data-edit-target=".href" label="Destino" />
  </div>
</template>

<script setup lang="ts">
/**
 * Campos de una tarjeta del ecosistema, en el panel del editor.
 *
 * Las escuelas y las facultades tienen exactamente el mismo dato, así que
 * comparten formulario en lugar de repetirlo en las dos listas.
 *
 * La tarjeta llega por referencia y se edita en sitio: es el mismo objeto de la
 * lista del editor, que es quien avisa del cambio hacia arriba.
 */
import { computed } from 'vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import {
  createImageFocusModes,
  saveImageFocusProfiles,
} from '../../../../helpers/imageFocus';
import { ECOSYSTEM_COLORS, type EcosystemCardItem } from './types';

const props = defineProps<{
  card: EcosystemCardItem;
  /**
   * Proporción de la caja de la foto en el bloque (`12 / 5` las escuelas grandes,
   * `16 / 9` las facultades): la vista previa del punto focal la usa.
   */
  imageRatio?: string;
}>();

const imageFocusModes = computed(() =>
  createImageFocusModes(props.imageRatio || '16 / 9'),
);

defineEmits(['select-image']);
</script>

<style scoped>
.ecf-hint {
  margin: 0 0 6px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

/* Muestrario: el nombre del color dice poco, el color se reconoce de un vistazo. */
.ecf-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ecf-swatch {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.ecf-swatch:hover {
  transform: scale(1.12);
}

.ecf-swatch.is-active {
  border-color: #1f2733;
}
</style>

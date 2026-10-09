<template>
  <div class="cta-banner-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Contenido</h6>
    <p class="cta-banner-editor__hint">
      El texto aparece en el panel azul y la imagen a la derecha. En escritorio,
      recomendamos una imagen horizontal de aproximadamente 592 × 266 px.
    </p>

    <EditorTextarea
      v-model="localData.title"
      data-edit-target="title"
      class="mb-2"
      label="Título"
      :rows="2"
      placeholder="Expande tus habilidades con Extended Learning"
    />

    <EditorTextarea
      v-model="localData.desc"
      data-edit-target="desc"
      class="mb-3"
      label="Descripción"
      :rows="3"
      placeholder="Aprende con programas prácticos, diseñados para impulsar tu camino y adaptarse a tus objetivos."
    />

    <EditorText
      v-model="localData.buttonLabel"
      data-edit-target="buttonLabel"
      class="mb-2"
      label="Texto del botón"
      placeholder="Inscríbete ahora"
    />
    <div class="form-check form-switch mb-3">
      <input
        :id="buttonNegativeSwitchId"
        v-model="localData.buttonNegative"
        data-edit-target="buttonNegative"
        class="form-check-input"
        type="checkbox"
        role="switch"
      />
      <label class="form-check-label" :for="buttonNegativeSwitchId">
        Botón blanco (estilo negativo)
      </label>
    </div>
    <EditorUrl
      v-model="localData.buttonUrl"
      v-model:target="localData.buttonTarget"
      data-edit-target="buttonUrl"
      class="mb-3"
      label="Destino del botón"
      placeholder="/ruta o https://"
    />

    <EditorBrandColor
      v-model="localData.panelColorToken"
      data-edit-target="panelColorToken"
      class="mb-3"
      label="Color del panel"
    />

    <hr />

    <h6 class="fw-bold small text-uppercase mb-1">Imagen</h6>
    <p class="cta-banner-editor__hint">
      El encuadre se adapta al ancho disponible. Puedes mover el punto focal en la vista previa.
    </p>
    <EditorImage
      v-model="localData.image"
      v-model:alt="localData.imageAlt"
      v-model:focus-x="localData.imageFocusX"
      v-model:focus-y="localData.imageFocusY"
      data-edit-target="image"
      alt-edit-target="imageAlt"
      alt-only-with-image
      alt-label="Texto alternativo"
      alt-placeholder="Personas aprendiendo en un aula"
      alt-hint="Describe la imagen si aporta información; déjalo vacío si es decorativa."
      focus-ratio="592 / 266"
      :focus-height="150"
      label=""
      @select="selectImage"
      @remove="resetImageExtras"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import { nextFieldId } from '../../../editor-beta/_shared/fieldUtils';
import { normalizeCtaBannerData } from './shared/types';

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: any): void;
  (event: 'select-image', payload: { item: any; field: string }): void;
}>();

const localData = ref(normalizeCtaBannerData(props.modelValue));
const buttonNegativeSwitchId = nextFieldId('cta-banner-button-negative');

const selectImage = () => {
  emit('select-image', { item: localData.value, field: 'image' });
};

const resetImageExtras = () => {
  localData.value.imageAlt = '';
  localData.value.imageFocusX = 50;
  localData.value.imageFocusY = 50;
};

watch(
  () => props.modelValue,
  (value) => {
    if (!value) return;
    const normalized = normalizeCtaBannerData(value);
    if (JSON.stringify(normalized) === JSON.stringify(localData.value)) return;
    localData.value = normalized;
  },
  { deep: true },
);

watch(
  localData,
  (value) => emit('update:modelValue', { ...value }),
  { deep: true },
);
</script>

<style scoped>
.cta-banner-editor__hint {
  margin: 0 0 8px;
  color: #6b7688;
  font-size: 11.5px;
  line-height: 1.45;
}
</style>

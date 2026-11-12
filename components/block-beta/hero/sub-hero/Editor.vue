<template>
  <div class="sh-editor">
    <!-- LOGO SUPERIOR (OPCIONAL) -->
    <div class="sh-optional mb-3">
      <div class="sh-optional__head">
        <label class="form-label m-0">Logo superior (opcional)</label>
        <button
          v-if="isLogoOpen"
          type="button"
          class="sh-optional__drop"
          title="Quitar logo"
          @click="clearLogo"
        >
          <i class="las la-times"></i>
        </button>
      </div>

      <template v-if="isLogoOpen">
        <EditorImage
          v-model="localData.logo"
          v-model:alt="localData.logoAlt"
          fit="contain"
          noun="logo"
          :height="72"
          alt-only-with-image
          alt-label="Texto alternativo del logo"
          alt-placeholder="ESAN DPA - Carreras para gente que trabaja"
          data-edit-target="logo"
          alt-edit-target="logoAlt"
          hint="Tamaño de referencia Figma: 240×63 px en Desktop/Tablet y 200×48 px en Mobile."
          @select="selectLogo"
        />
        <button
          v-if="localData.logo !== DEFAULT_HERO_DPA_LOGO"
          type="button"
          class="btn btn-sm btn-outline-primary w-100 mt-1"
          @click="applyDefaultDpaLogo"
        >
          <i class="las la-magic me-1"></i> Usar logo oficial ESAN DPA
        </button>
      </template>
      <button
        v-else
        type="button"
        class="btn btn-sm btn-outline-secondary w-100"
        @click="openLogo"
      >
        <i class="las la-plus me-1"></i> Agregar logo
      </button>
    </div>

    <!-- ANTETÍTULO -->
    <EditorText
      v-model="localData.eyebrow"
      data-edit-target="eyebrow"
      class="mb-2"
      label="Antetítulo"
      placeholder="ESAN UNIVERSITY"
      :maxlength="rules.eyebrow.maxLength"
    />

    <!-- H1 -->
    <div class="form-check form-switch mb-3">
      <input
        id="subhero-eyebrow-h1"
        v-model="localData.eyebrowAsH1"
        data-edit-target="eyebrowAsH1"
        class="form-check-input"
        type="checkbox"
        :disabled="!localData.eyebrow.trim()"
      />
      <label class="form-check-label sh-switch-label" for="subhero-eyebrow-h1">
        Usar antetítulo como H1
      </label>
      <p class="sh-hint mt-1">
        Si se activa, el título mantiene su diseño pero deja de ser H1.
      </p>
    </div>

    <!-- TÍTULO -->
    <EditorTextarea
      v-model="localData.title"
      data-edit-target="title"
      class="mb-3"
      label="Título"
      :rows="2"
      placeholder="Explora nuestras 17 carreras universitarias"
      :maxlength="rules.title.maxLength"
    />

    <!-- DESCRIPCIÓN -->
    <EditorTextarea
      v-model="localData.desc"
      data-edit-target="desc"
      class="mb-3"
      label="Descripción"
      :rows="2"
      placeholder="Ingresa una descripción complementaria"
      :maxlength="rules.desc.maxLength"
    />

    <!-- COLOR -->
    <EditorBrandColor
      v-model="localData.panelColorToken"
      data-edit-target="panelColorToken"
      class="mb-3"
    />

    <!-- IMAGEN -->
    <!--
      Con imagen, la vista previa es el enfocador: se ve el recorte real mientras
      se mueve el punto. El alt solo se pide cuando ya hay imagen que describir.
    -->
    <EditorImage
      v-model="localData.image"
      v-model:alt="localData.imageAlt"
      :focus-values="localData.imageFocusProfiles"
      :focus-modes="imageFocusModes"
      data-edit-target="image"
      alt-edit-target="imageAlt"
      :focus-height="130"
      focus-crop-preview
      :focus-sliders="false"
      alt-only-with-image
      alt-label="Texto alternativo de la imagen"
      alt-placeholder="Ej. Estudiantes de ESAN en el campus"
      :alt-maxlength="IMAGE_ALT_MAX_LENGTH"
      alt-hint="Describe la imagen si aporta información. Déjalo vacío si es decorativa."
      @select="selectImage"
      @update:focus-values="saveImageFocusProfiles(localData, $event)"
      @remove="resetImageExtras"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import {
  createImageFocusModes,
  normalizeImageFocus,
  normalizeImageFocusProfiles,
  saveImageFocusProfiles,
} from '../../../../helpers/imageFocus';
import {
  DEFAULT_HERO_DPA_LOGO,
  DEFAULT_HERO_DPA_LOGO_ALT,
  normalizeHeroLogo,
} from '../_shared/types';
import { resolvePanelColorToken } from './shared/config';
import { SUBHERO_CONTENT_RULES } from './shared/rule';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: any): void;
  (
    event: 'select-image',
    payload: {
      item: any;
      field: string;
    }
  ): void;
}>();

const rules = SUBHERO_CONTENT_RULES;
const IMAGE_ALT_MAX_LENGTH = 150;
const imageFocusModes = createImageFocusModes({
  web: '880 / 360',
  tablet: '16 / 9',
  mobile: '328 / 200',
});

const build = (source: any) => {
  const eyebrow = source?.eyebrow ?? '';
  const imageFocusX = normalizeImageFocus(source?.imageFocusX);
  const imageFocusY = normalizeImageFocus(source?.imageFocusY);

  return {
    logo: normalizeHeroLogo(source?.logo),
    logoAlt: source?.logoAlt ?? '',
    eyebrow,
    eyebrowAsH1:
      eyebrow.trim().length > 0 &&
      source?.eyebrowAsH1 === true,
    title: source?.title ?? '',
    desc: source?.desc ?? '',
    panelColorToken: resolvePanelColorToken(source),
    image: source?.image ?? '',
    imageAlt: source?.imageAlt ?? '',
    imageFocusX,
    imageFocusY,
    imageFocusProfiles: normalizeImageFocusProfiles(
      source?.imageFocusProfiles,
      imageFocusX,
      imageFocusY,
    ),
  };
};

const localData = ref(build(props.modelValue));
const logoOpenOverride = ref<boolean | null>(null);
const isLogoOpen = computed(() => logoOpenOverride.value ?? Boolean(localData.value.logo));

const applyDefaultDpaLogo = () => {
  localData.value.logo = DEFAULT_HERO_DPA_LOGO;
  if (!localData.value.logoAlt) {
    localData.value.logoAlt = DEFAULT_HERO_DPA_LOGO_ALT;
  }
};

const openLogo = () => {
  logoOpenOverride.value = true;
  if (!localData.value.logo) {
    applyDefaultDpaLogo();
  }
};

const clearLogo = () => {
  localData.value.logo = '';
  localData.value.logoAlt = '';
  logoOpenOverride.value = false;
};

const selectLogo = () => {
  emit('select-image', {
    item: localData.value,
    field: 'logo',
  });
};

const selectImage = () => {
  emit('select-image', {
    item: localData.value,
    field: 'image'
  });
};

/*
 * Al quitar la imagen, EditorImage ya vacía `image`; aquí se limpia lo que
 * dependía de ella: el texto alternativo y el punto focal.
 */
const resetImageExtras = () => {
  localData.value.imageAlt = '';
  localData.value.imageFocusX = 50;
  localData.value.imageFocusY = 50;
  localData.value.imageFocusProfiles = normalizeImageFocusProfiles();
};

/* Si se borra el antetítulo no puede mantenerse activo como H1. */
watch(
  () => localData.value.eyebrow,
  (eyebrow) => {
    if (!eyebrow.trim()) {
      localData.value.eyebrowAsH1 = false;
    }
  }
);

/* Bloque → Editor */
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) return;

    const normalized = build(newValue);

    if (
      JSON.stringify(normalized) ===
      JSON.stringify(localData.value)
    ) {
      return;
    }

    localData.value = normalized;
  },
  {
    deep: true
  }
);

/* Editor → Bloque */
watch(
  localData,
  (newValue) => {
    emit(
      'update:modelValue',
      JSON.parse(JSON.stringify(newValue))
    );
  },
  {
    deep: true
  }
);
</script>

<style scoped>
.sh-hint {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--bs-secondary-color);
}

.sh-switch-label {
  font-size: 12.5px;
  font-weight: 500;
}

.sh-optional__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.sh-optional__drop {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: #6b7688;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.sh-optional__drop:hover {
  background: #dc3545;
  color: #fff;
}
</style>

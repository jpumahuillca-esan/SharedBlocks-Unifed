<template>
  <div class="sh-editor">

    <!-- =====================================================
         ANTETÍTULO
         ===================================================== -->

    <label class="form-label">
      Antetítulo
    </label>

    <input
      v-model="localData.eyebrow"
      type="text"
      class="form-control form-control-sm mb-1"
      placeholder="ESAN UNIVERSITY"
    />

    <p class="sh-hint mb-3">
      Máximo 1 línea en el SubHero.
    </p>


    <!-- =====================================================
         TÍTULO
         ===================================================== -->

    <label class="form-label">
      Título
    </label>

    <textarea
      v-model="localData.title"
      class="form-control form-control-sm mb-1"
      rows="2"
      placeholder="Explora nuestras 17 carreras universitarias"
    ></textarea>

    <p class="sh-hint mb-3">
      Máximo 2 líneas en el SubHero.
    </p>


    <!-- =====================================================
         DESCRIPCIÓN
         ===================================================== -->

    <label class="form-label">
      Descripción
    </label>

    <textarea
      v-model="localData.desc"
      class="form-control form-control-sm mb-1"
      rows="2"
      placeholder="Ingresa una descripción complementaria"
    ></textarea>

    <p class="sh-hint mb-3">
      Máximo 2 líneas en el SubHero.
    </p>


    <!-- =====================================================
         COLOR DEL PANEL
         ===================================================== -->

    <label class="form-label">
      Color del panel
    </label>

    <div class="sh-color-picker mb-3">

      <button
        v-for="option in colorOptions"
        :key="option.token"
        type="button"
        class="sh-color-option"
        :class="{
          'is-active':
            localData.panelColorToken === option.token
        }"
        @click="
          localData.panelColorToken = option.token
        "
      >

        <!-- Color real proveniente del Design System -->
        <span
          class="sh-color-option__swatch"
          :style="{
            backgroundColor: `var(${option.token})`
          }"
          aria-hidden="true"
        ></span>


        <!-- Nombre corto -->
        <span class="sh-color-option__label">
          {{ option.label }}
        </span>


        <!-- Seleccionado -->
        <span
          v-if="
            localData.panelColorToken === option.token
          "
          class="sh-color-option__check"
          aria-hidden="true"
        >
          <i class="las la-check"></i>
        </span>

      </button>

    </div>


    <!-- =====================================================
         IMAGEN
         ===================================================== -->

    <label class="form-label">
      Imagen
    </label>

    <div class="sh-image-preview mb-2">

      <img
        v-if="localData.image"
        :src="localData.image"
        alt=""
      />

      <span
        v-else
        class="text-muted small"
      >
        Sin imagen
      </span>

    </div>


    <!-- =====================================================
         ACCIONES DE IMAGEN
         ===================================================== -->

    <div class="d-flex gap-2">

      <button
        type="button"
        class="btn btn-sm btn-outline-secondary flex-grow-1"
        @click="$emit('select-image', {
          item: localData,
          field: 'image'
        })"
      >

        <i class="las la-image me-1"></i>

        {{
          localData.image
            ? 'Cambiar imagen'
            : 'Subir imagen'
        }}

      </button>


      <button
        v-if="localData.image"
        type="button"
        class="btn btn-sm btn-outline-danger"
        title="Quitar imagen"
        @click="localData.image = ''"
      >

        <i class="las la-trash"></i>

      </button>

    </div>

  </div>
</template>


<script setup lang="ts">

import { ref, watch } from 'vue';


/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

const props = defineProps<{
  modelValue: any;

  availableSections?: Array<{
    id: string;
    title: string;
  }>;
}>();


/*
|--------------------------------------------------------------------------
| EMITS
|--------------------------------------------------------------------------
*/

const emit = defineEmits([
  'update:modelValue',
  'select-image'
]);


/*
|--------------------------------------------------------------------------
| TOKENS DE COLOR DISPONIBLES
|--------------------------------------------------------------------------
|
| Acá únicamente definimos qué tokens del
| Design System puede seleccionar el editor.
|
| No guardamos HEX.
| No creamos variantes CSS del SubHero.
|
| Para añadir otro color en el futuro:
|
| {
|   label: 'Economics',
|   token: '--ds-color-univ-economics'
| }
|
| Y nada más.
|
*/

const colorOptions = [

  {
    label: 'University',
    token: '--ds-color-university'
  },

  {
    label: 'Management',
    token: '--ds-color-univ-management'
  }

] as const;


/*
|--------------------------------------------------------------------------
| TOKEN POR DEFECTO
|--------------------------------------------------------------------------
*/

const DEFAULT_PANEL_COLOR_TOKEN =
  '--ds-color-university';


/*
|--------------------------------------------------------------------------
| NORMALIZAR TOKEN
|--------------------------------------------------------------------------
|
| Mantiene compatibilidad con bloques antiguos
| que todavía tengan:
|
| brand: 'university'
| brand: 'management'
|
*/

const normalizePanelColorToken = (
  source: any
): string => {

  /*
  |--------------------------------------------------------------------------
  | FORMATO ACTUAL
  |--------------------------------------------------------------------------
  */

  if (
    typeof source?.panelColorToken === 'string'
    &&
    source.panelColorToken.startsWith('--')
  ) {
    return source.panelColorToken;
  }


  /*
  |--------------------------------------------------------------------------
  | FORMATO ANTERIOR
  |--------------------------------------------------------------------------
  */

  if (
    source?.brand === 'management'
  ) {
    return '--ds-color-univ-management';
  }


  return DEFAULT_PANEL_COLOR_TOKEN;

};


/*
|--------------------------------------------------------------------------
| NORMALIZAR DATA
|--------------------------------------------------------------------------
*/

const build = (
  source: any
) => ({

  eyebrow:
    source?.eyebrow ?? '',

  title:
    source?.title ?? '',

  desc:
    source?.desc ?? '',

  panelColorToken:
    normalizePanelColorToken(source),

  image:
    source?.image ?? ''

});


/*
|--------------------------------------------------------------------------
| ESTADO LOCAL
|--------------------------------------------------------------------------
*/

const localData = ref(
  build(
    props.modelValue
  )
);


/*
|--------------------------------------------------------------------------
| DATOS EXTERNOS → EDITOR
|--------------------------------------------------------------------------
*/

watch(

  () =>
    props.modelValue,

  (newVal) => {

    if (!newVal) {
      return;
    }


    if (
      JSON.stringify(newVal)
      ===
      JSON.stringify(localData.value)
    ) {
      return;
    }


    localData.value =
      build(newVal);

  },

  {
    deep: true
  }

);


/*
|--------------------------------------------------------------------------
| EDITOR → BLOQUE
|--------------------------------------------------------------------------
*/

watch(

  localData,

  (newVal) => {

    emit(
      'update:modelValue',

      JSON.parse(
        JSON.stringify(newVal)
      )
    );

  },

  {
    deep: true
  }

);

</script>


<style scoped>

/* =========================================================================
   TEXTO DE AYUDA
   ========================================================================= */

.sh-hint {
  margin: 0;

  font-size: 11.5px;

  line-height: 1.45;

  color:
    var(--bs-secondary-color);
}


/* =========================================================================
   SELECTOR DE COLOR
   ========================================================================= */

.sh-color-picker {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 8px;
}


/* =========================================================================
   OPCIÓN
   ========================================================================= */

.sh-color-option {
  display: flex;

  align-items: center;

  min-width: 0;

  gap: 8px;

  padding: 8px 9px;

  border:
    1px solid
    var(--bs-border-color);

  border-radius:
    var(--bs-border-radius);

  background:
    var(--bs-body-bg);

  color:
    var(--bs-body-color);

  text-align: left;

  cursor: pointer;

  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}


/* =========================================================================
   HOVER
   ========================================================================= */

.sh-color-option:hover {
  background:
    var(--bs-tertiary-bg);
}


/* =========================================================================
   ACTIVO
   ========================================================================= */

.sh-color-option.is-active {
  border-color:
    var(--bs-secondary-color);

  background:
    var(--bs-tertiary-bg);

  box-shadow:
    0 0 0 1px
    var(--bs-border-color);
}


/* =========================================================================
   SWATCH
   ========================================================================= */

.sh-color-option__swatch {
  width: 24px;

  height: 24px;

  flex:
    0 0 24px;

  border-radius:
    var(--bs-border-radius-sm);

  border:
    1px solid
    var(--bs-border-color);
}


/* =========================================================================
   LABEL
   ========================================================================= */

.sh-color-option__label {
  min-width: 0;

  flex-grow: 1;

  font-size: 12.5px;

  font-weight: 600;

  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;
}


/* =========================================================================
   CHECK
   ========================================================================= */

.sh-color-option__check {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 20px;

  height: 20px;

  flex:
    0 0 20px;

  border-radius: 50%;

  background:
    var(--bs-body-color);

  color:
    var(--bs-body-bg);

  font-size: 12px;
}


/* =========================================================================
   PREVIEW DE IMAGEN
   ========================================================================= */

.sh-image-preview {
  display: flex;

  align-items: center;

  justify-content: center;

  width: 100%;

  height: 130px;

  border:
    1px dashed
    var(--bs-border-color);

  border-radius:
    var(--bs-border-radius);

  background:
    var(--bs-tertiary-bg);

  overflow: hidden;
}


.sh-image-preview img {
  display: block;

  width: 100%;

  height: 100%;

  object-fit: cover;
}


/* =========================================================================
   PANEL MUY ANGOSTO
   ========================================================================= */

@media (max-width: 340px) {

  .sh-color-picker {
    grid-template-columns: 1fr;
  }

}

</style>
<template>

  <section
    class="subhero"
    :style="panelColorStyle"
  >

    <!-- =====================================================
         CAPA VISUAL
         ===================================================== -->

    <div class="subhero__background">

      <!--
        Panel de color para desktop/tablet.

        Recibe directamente el token seleccionado
        desde el editor.
      -->
      <div
        class="subhero__brand"
        :style="panelColorStyle"
      ></div>


      <!-- ===================================================
           IMAGEN
           =================================================== -->

      <div class="subhero__media">

        <img
          v-if="image"
          :src="image"
          alt=""
        />

      </div>

    </div>


    <!-- =====================================================
         CONTENIDO
         ===================================================== -->

    <div class="subhero__inner">

      <div class="subhero__columns">

        <!-- =================================================
             COLUMNA DE TEXTO
             ================================================= -->

        <div class="subhero__content">

          <AtomEyebrow
            v-if="eyebrow"
            variant="inverse"
            class="subhero__eyebrow"
          >
            {{ eyebrow }}
          </AtomEyebrow>


          <AtomHeading
            v-if="title"
            as="h1"
            size="h1"
            weight="semibold"
            class="subhero__title"
          >
            {{ title }}
          </AtomHeading>


          <AtomText
            v-if="desc"
            size="body-lg"
            class="subhero__desc"
          >
            {{ desc }}
          </AtomText>

        </div>


        <!-- =================================================
             COLUMNA VACÍA
             ================================================= -->

        <div
          class="subhero__empty"
          aria-hidden="true"
        ></div>

      </div>

    </div>

  </section>

</template>


<script setup lang="ts">

import { computed } from 'vue';

import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomText from '../../../atoms/AtomText.vue';


/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

const props = defineProps<{
  data: any;
}>();


/*
|--------------------------------------------------------------------------
| TOKEN POR DEFECTO
|--------------------------------------------------------------------------
*/

const DEFAULT_PANEL_COLOR_TOKEN =
  '--ds-color-university';


/*
|--------------------------------------------------------------------------
| DATOS
|--------------------------------------------------------------------------
*/

const eyebrow = computed(
  () => props.data?.eyebrow ?? ''
);


const title = computed(
  () => props.data?.title ?? ''
);


const desc = computed(
  () => props.data?.desc ?? ''
);


const image = computed(
  () => props.data?.image ?? ''
);


/*
|--------------------------------------------------------------------------
| TOKEN DEL PANEL
|--------------------------------------------------------------------------
*/

const panelColorToken = computed(() => {

  const token =
    props.data?.panelColorToken;


  /*
  |--------------------------------------------------------------------------
  | FORMATO ACTUAL
  |--------------------------------------------------------------------------
  */

  if (
    typeof token === 'string'
    &&
    /^--ds-color-[a-z0-9-]+$/i.test(token)
  ) {
    return token;
  }


  /*
  |--------------------------------------------------------------------------
  | COMPATIBILIDAD TEMPORAL
  |--------------------------------------------------------------------------
  */

  if (
    props.data?.brand === 'management'
  ) {
    return '--ds-color-univ-management';
  }


  return DEFAULT_PANEL_COLOR_TOKEN;

});


/*
|--------------------------------------------------------------------------
| COLOR DINÁMICO
|--------------------------------------------------------------------------
*/

const panelColorStyle = computed(() => ({

  backgroundColor:
    `var(${panelColorToken.value})`

}));

</script>
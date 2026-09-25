<template>
  <div class="subhero__inner">
    <div class="subhero__columns">
      <div class="subhero__content">

        <!--
          SWITCH ACTIVADO:
          el antetítulo pasa a ser el H1.

          AtomEyebrow mantiene exactamente
          sus estilos visuales.
        -->
        <h1
          v-if="eyebrow && eyebrowAsH1"
          class="subhero__eyebrow-heading"
        >
          <AtomEyebrow
            variant="inverse"
            class="subhero__eyebrow"
          >
            {{ eyebrow }}
          </AtomEyebrow>
        </h1>

        <!--
          SWITCH DESACTIVADO:
          comportamiento normal.
        -->
        <AtomEyebrow
          v-else-if="eyebrow"
          variant="inverse"
          class="subhero__eyebrow"
        >
          {{ eyebrow }}
        </AtomEyebrow>

        <!--
          Por defecto:
          h1

          Si eyebrow es H1:
          div

          AtomHeading mantiene exactamente
          el mismo diseño visual.
        -->
        <AtomHeading
          v-if="title"
          :as="eyebrowAsH1 ? 'div' : 'h1'"
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

      <div
        class="subhero__empty"
        aria-hidden="true"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AtomEyebrow from '../../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../../atoms/AtomHeading.vue';
import AtomText from '../../../../atoms/AtomText.vue';

withDefaults(
  defineProps<{
    eyebrow: string;
    eyebrowAsH1?: boolean;
    title: string;
    desc: string;
  }>(),
  {
    eyebrowAsH1: false
  }
);
</script>
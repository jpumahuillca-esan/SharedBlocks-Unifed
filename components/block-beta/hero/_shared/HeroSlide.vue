<template>
  <div class="hero__slide">
    <div class="hero__media">
      <!-- Sin imagen no se emite <img>: un src vacío da un icono roto. -->
      <img v-if="image" :src="image" :alt="imageAlt || ''" :loading="eager ? 'eager' : 'lazy'" />
    </div>

    <div class="hero__inner">
      <div class="hero__content">
        <AtomText v-if="eyebrow" size="sm" class="hero__eyebrow">
          {{ eyebrow }}
        </AtomText>

        <!--
          El título de TODAS las diapositivas es un párrafo con aspecto de
          titular. El <h1> de la portada es uno solo y vive fuera, en Block.vue,
          independiente de qué diapositiva esté a la vista.

          El aspecto no cambia: `as` solo sustituye la etiqueta, el tamaño lo
          sigue poniendo el átomo.
        -->
        <AtomHeading
          v-if="title"
          as="p"
          size="h1"
          weight="bold"
          class="hero__title"
        >
          {{ title }}
        </AtomHeading>

        <!-- Opcional, según la maqueta. -->
        <AtomText v-if="desc" size="sm" class="hero__desc">
          {{ desc }}
        </AtomText>

        <div v-if="primary.label || secondary.label" class="hero__actions">
          <AtomButton v-if="primary.label" variant="primary" :href="primary.url || undefined">
            {{ primary.label }}
          </AtomButton>

          <!-- Opcional, según la maqueta. -->
          <AtomButton
            v-if="secondary.label"
            variant="secondary"
            negative
            :href="secondary.url || undefined"
          >
            {{ secondary.label }}
          </AtomButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Una diapositiva de la portada: foto de fondo y, sobre ella, el bloque de
 * texto con sus acciones.
 *
 * Se compone de átomos (AtomHeading, AtomText, AtomButton) en lugar de marcado
 * plano: el tamaño de un titular, la familia de un párrafo y la forma de un
 * botón se deciden en un solo sitio para toda la librería. La hoja de estilos
 * solo aporta el encuadre y el color, que es lo que depende de ir sobre foto.
 *
 * No usa AtomEyebrow a propósito: ese átomo impone mayúsculas y un punto
 * decorativo que la maqueta de la portada no lleva.
 */
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import type { HeroAction } from './types';

withDefaults(
  defineProps<{
    eyebrow: string;
    title: string;
    desc: string;
    image: string;
    imageAlt: string;
    primary: HeroAction;
    secondary: HeroAction;
    /** La primera se carga de inmediato: está a la vista al abrir la página. */
    eager?: boolean;
  }>(),
  { eager: false },
);
</script>

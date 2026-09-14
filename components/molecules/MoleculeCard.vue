<script setup lang="ts">
/**
 * MoleculeCard — Card (ARCIS Design System).
 *
 * Vive en components/molecules/ y no en components/atoms/ porque, a
 * diferencia de un átomo, está compuesta de otros átomos (AtomHeading
 * para el título, AtomText para el texto) — es la primera pieza de
 * Elementos que necesita esta capa intermedia.
 *
 * Envuelve las clases .card, .card--{variante} y .card__{elemento}
 * portadas en assets/styles/elements/_cards.scss. No redeclara estilos propios.
 *
 * Tres variantes, cada una con su estructura de DOM real (no son solo
 * un cambio de clase — webunificada arma cada una distinto):
 * - "default": imagen opcional envuelta en .card__media (4:3), cuerpo
 *   con eyebrow/título/texto/acciones.
 * - "service": sin imagen, número de paso + título + texto, sin
 *   envoltura .card__body (única variante autorizada a numeración
 *   secuencial, según la nota de webunificada).
 * - "image": imagen de fondo a sangre con overlay oscuro (el <img> va
 *   directo dentro de la card, no dentro de .card__media).
 */
import { computed } from 'vue';
import AtomHeading from '../atoms/AtomHeading.vue';
import AtomText from '../atoms/AtomText.vue';

type CardVariant = 'default' | 'service' | 'image';

const props = withDefaults(defineProps<{
  variant?: CardVariant;
  image?: string;
  imageAlt?: string;
  title?: string;
  text?: string;
  /** Solo variante "service": número de paso, ej. "01". */
  number?: string;
  /** Si la card es clickeable/navegable, renderiza <a> en vez de <article>. */
  href?: string;
}>(), {
  variant: 'default',
});

const classes = computed(() => ['card', `card--${props.variant}`]);
const tag = computed(() => (props.href ? 'a' : 'article'));
</script>

<template>
  <component :is="tag" :href="href" :class="classes">
    <!-- Variante "image": el <img> va directo, sin envoltura .card__media -->
    <img v-if="variant === 'image' && image" :src="image" :alt="imageAlt || ''" loading="lazy" />

    <!-- Variante "service": sin .card__body, sin imagen -->
    <template v-if="variant === 'service'">
      <span v-if="number" class="card-service__number">{{ number }}</span>
      <AtomHeading v-if="title" :level="4" class="card__title">{{ title }}</AtomHeading>
      <AtomText v-if="text" class="card__text">{{ text }}</AtomText>
      <slot />
    </template>

    <!-- Variantes "default" e "image": cuerpo envuelto en .card__body -->
    <template v-else>
      <div v-if="variant === 'default' && image" class="card__media">
        <img :src="image" :alt="imageAlt || ''" loading="lazy" />
      </div>

      <div class="card__body">
        <slot name="eyebrow" />
        <AtomHeading v-if="title" :level="4" class="card__title">{{ title }}</AtomHeading>
        <AtomText v-if="text" class="card__text">{{ text }}</AtomText>
        <slot />
        <div v-if="$slots.actions" class="card__link">
          <slot name="actions" />
        </div>
      </div>
    </template>
  </component>
</template>

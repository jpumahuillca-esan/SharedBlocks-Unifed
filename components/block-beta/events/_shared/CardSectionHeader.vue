<template>
  <div v-if="eyebrow || title || desc || linkLabel" class="card-section__header">
    <!--
      Título, guion y descripción van juntos en su propia columna: así el enlace
      de la derecha se alinea con el pie del bloque y no queda flotando entre
      líneas.
    -->
    <div v-if="eyebrow || title || desc" class="card-section__heading">
      <!-- Opcional. Cuando está, es el titular de la sección (h2). -->
      <AtomEyebrow v-if="eyebrow" as="h2" v-bind="edit('eyebrow')">{{ eyebrow }}</AtomEyebrow>

      <!--
        Un solo h2 por encabezado: si la etiqueta ya lo es, el título queda en
        <p>; sin etiqueta, el título es el h2. El aspecto es el mismo en los dos
        casos (ver .card-section__title en _card-section.scss).
      -->
      <component :is="eyebrow ? 'p' : 'h2'" v-if="title" class="card-section__title" v-bind="edit('title')">{{ title }}</component>

      <!-- Guion rojo bajo el título. Adorno: acompaña siempre al título. -->
      <span v-if="title" class="card-section__rule" aria-hidden="true"></span>

      <!-- Opcional. -->
      <AtomText v-if="desc" size="body-compact" class="card-section__desc" v-bind="edit('desc')">{{ desc }}</AtomText>
    </div>

    <!-- El "Button Link" del sistema; en pequeño, al tamaño del texto de apoyo. -->
    <AtomButton v-if="linkLabel" variant="link" size="sm" class="card-section__link" :href="linkUrl || '#'" v-bind="edit('linkLabel')">
      {{ linkLabel }}
      <AtomIcon name="arrow-right" :size="16" />
    </AtomButton>
  </div>
</template>

<script setup lang="ts">
/**
 * Encabezado de una sección de tarjetas: título con su guion rojo debajo,
 * descripción opcional y enlace de "ver todos".
 *
 * Lo comparten las dos secciones. Cada parte desaparece si se deja vacía, así
 * que el encabezado completo se puede quitar sin tocar nada más.
 *
 * La etiqueta superior es opcional y solo la pasa quien la necesita
 * (`cards/image-grid`): las secciones de `events` y `awards` no la llevan.
 */
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import { useEditTarget } from '../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

defineProps<{
  /** Opcional: etiqueta corta sobre el título. */
  eyebrow?: string;
  title: string;
  /** Opcional. */
  desc: string;
  linkLabel: string;
  linkUrl: string;
}>();
</script>

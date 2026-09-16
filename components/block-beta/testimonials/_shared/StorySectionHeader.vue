<template>
  <header v-if="title || subtitle || linkLabel" class="story-section__header">
    <div class="story-section__heading">
      <span class="story-section__rule" aria-hidden="true"></span>

      <!--
        Nivel y tamaño son cosas distintas, igual que en MoleculeEventCard: la
        sección es un h2 dentro de la página, y `size` es obligatorio porque
        AtomHeading fija el tamaño en línea y así gana sobre la hoja.
      -->
      <AtomHeading
        v-if="title"
        :level="2"
        size="h2"
        weight="bold"
        class="story-section__title"
      >
        {{ title }}
      </AtomHeading>

      <AtomText v-if="subtitle" size="body" class="story-section__subtitle">
        {{ subtitle }}
      </AtomText>
    </div>

    <!-- `negative` es lo que el sistema ofrece para un enlace sobre fondo
         oscuro: evita tener que fijarle el color desde la hoja. -->
    <AtomButton
      v-if="linkLabel"
      variant="link"
      negative
      class="story-section__link"
      :href="linkUrl || '#'"
    >
      {{ linkLabel }}
      <AtomIcon name="arrow-right" :size="16" />
    </AtomButton>
  </header>
</template>

<script setup lang="ts">
/**
 * Encabezado de la sección de historias: título, línea de apoyo y enlace de
 * "ver todas". Cada parte desaparece si se deja vacía.
 *
 * Se compone de átomos (AtomHeading, AtomText, AtomButton, AtomIcon) en lugar
 * de marcado plano: el tamaño de un titular, la familia de un párrafo y la
 * forma de un enlace se deciden en un solo sitio para toda la librería, y esta
 * sección no tiene por qué volver a decidirlos. La hoja de estilos solo les
 * ajusta el color, que es lo único que depende de ir sobre el fondo de marca.
 *
 * A diferencia del encabezado de `events`, aquí el enlace NO se duplica en un
 * pie: en el diseño móvil no baja hasta el final de la sección, solo se coloca
 * debajo de la línea de apoyo, alineado a la izquierda. Eso lo resuelve un
 * cambio de dirección del flex en la hoja de estilos, sin marcado repetido.
 */
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';

defineProps<{
  title: string;
  subtitle: string;
  linkLabel: string;
  linkUrl: string;
}>();
</script>

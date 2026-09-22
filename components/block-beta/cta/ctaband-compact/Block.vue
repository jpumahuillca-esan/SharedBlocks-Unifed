<template>
  <div class="ctaband ctaband--compact">
    <div v-if="data.icon" class="ctaband__icon">
      <AtomIcon :name="data.icon" :size="22" />
    </div>

    <div class="ctaband__text">
      <p v-if="data.title" class="ctaband__text-title">{{ data.title }}</p>
      <p v-if="data.desc" class="ctaband__text-desc">{{ data.desc }}</p>
    </div>

    <!-- El "Button Link" del sistema. -->
    <AtomButton v-if="data.linkLabel" variant="link" class="ctaband__link" :href="data.linkUrl || '#'">
      {{ data.linkLabel }}
      <AtomIcon name="arrow-right" :size="16" />
    </AtomButton>
  </div>
</template>

<script setup lang="ts">
/**
 * CTA Band — variante compacta.
 *
 * Porte de la subsección "Compacta (inline)" del CTA Band de webunificada.
 * Banner delgado y bordeado, pensado para insertar dentro de una columna de
 * contenido, no a todo el ancho como las otras variantes.
 *
 * Conserva su arquitectura original: un enlace único con flecha, no un área de
 * acciones con botones.
 */
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';

defineProps<{ data: any }>();
</script>

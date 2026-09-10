<script setup lang="ts">
/**
 * AtomAvatar — átomo de avatar (ARCIS Design System, Elementos > Avatars).
 *
 * Envuelve las clases .avatar, .avatar--sm, .avatar--lg, .avatar__status
 * y .avatar__status--online portadas en assets/styles/elements/_avatars.scss.
 * No redeclara estilos propios.
 *
 * Sin `image`, cae en el fallback de iniciales (prop `initials`, ej. "MT"
 * o "+5" para el resto de un grupo apilado) — mismo comportamiento que
 * webunificada, donde el <span class="avatar"> simplemente lleva texto
 * cuando no hay <img> adentro.
 */
import { computed } from 'vue';

type AvatarSize = 'sm' | 'md' | 'lg';
type AvatarStatus = 'online' | 'offline';

const props = withDefaults(defineProps<{
  size?: AvatarSize;
  image?: string;
  imageAlt?: string;
  initials?: string;
  status?: AvatarStatus;
}>(), {
  size: 'md',
});

const classes = computed(() => ['avatar', props.size !== 'md' ? `avatar--${props.size}` : null]);
const statusClasses = computed(() => [
  'avatar__status',
  props.status === 'online' ? 'avatar__status--online' : null,
]);
</script>

<template>
  <span :class="classes">
    <img v-if="image" :src="image" :alt="imageAlt || ''" loading="lazy" />
    <template v-else>{{ initials }}</template>
    <span v-if="status" :class="statusClasses"></span>
  </span>
</template>

<script setup lang="ts">
/**
 * AtomAvatarGroup — contenedor de avatares apilados (ARCIS Design System,
 * Elementos > Avatars > Grupo apilado).
 *
 * Envuelve ".avatar-group" portada en assets/styles/elements/_avatars.scss
 * (margen negativo + borde blanco en cada ".avatar" hijo directo, para el
 * efecto de superposición). Solo aplica el contenedor: los avatares van
 * como AtomAvatar en el slot, igual que en webunificada.
 */
</script>

<template>
  <div class="avatar-group">
    <slot />
  </div>
</template>

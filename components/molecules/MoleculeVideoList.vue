<script setup lang="ts">
/**
 * MoleculeVideoList — lista de miniaturas compactas + texto (ARCIS
 * Design System, Elementos > Video preview > variante "list"), para
 * playlists o "related videos".
 *
 * Vive en components/molecules/ y no en components/atoms/ porque
 * compone el átomo AtomIcon (play fijo en cada miniatura) — mismo
 * criterio que MoleculeBreadcrumb.
 *
 * Envuelve las clases .video-list, .video-list__* portadas en
 * assets/styles/elements/_video-preview.scss. No redeclara estilos
 * propios.
 */
import AtomIcon from '../atoms/AtomIcon.vue';

export interface VideoListItem {
  thumb: string;
  thumbAlt?: string;
  title: string;
  /** ej. "12:03 · Emprendimiento". */
  meta?: string;
  href?: string;
}

defineProps<{
  items: VideoListItem[];
}>();
</script>

<template>
  <div class="video-list">
    <a v-for="(item, index) in items" :key="index" class="video-list__item" :href="item.href || '#'">
      <span class="video-list__thumb">
        <img :src="item.thumb" :alt="item.thumbAlt || ''" loading="lazy" />
        <span class="video-list__play">
          <AtomIcon name="play" :size="28" />
        </span>
      </span>
      <span class="video-list__body">
        <span class="video-list__title">{{ item.title }}</span>
        <span v-if="item.meta" class="video-list__meta">{{ item.meta }}</span>
      </span>
    </a>
  </div>
</template>

<script setup lang="ts">
/**
 * PreviewAvatars — muestra AtomAvatar/AtomAvatarGroup juntos (Elementos >
 * Avatars de webunificada): tamaños, con imagen y estado, grupo apilado.
 * Solo vista previa, no se usa en bloques reales.
 */
import AtomAvatar from '../atoms/AtomAvatar.vue';
import AtomAvatarGroup from '../atoms/AtomAvatarGroup.vue';
import PreviewCodeSample from '../docs/PreviewCodeSample.vue';

const photo1 = 'https://i.pravatar.cc/96?img=12';
const photo2 = 'https://i.pravatar.cc/96?img=32';
const photo3 = 'https://i.pravatar.cc/96?img=48';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Tamaños</span>
      <div class="preview-row-wrap">
        <PreviewCodeSample marker='<AtomAvatar size="sm" initials="MT" />' label="Avatar pequeño">
          <AtomAvatar size="sm" initials="MT" />
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomAvatar initials="MT" />' label="Avatar mediano">
          <AtomAvatar initials="MT" />
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomAvatar size="lg" initials="MT" />' label="Avatar grande">
          <AtomAvatar size="lg" initials="MT" />
        </PreviewCodeSample>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Con imagen y estado</span>
      <div class="preview-row-wrap">
        <PreviewCodeSample marker='<AtomAvatar image="/foto1.jpg" status="online" />' label="Avatar con estado en línea">
          <AtomAvatar :image="photo1" status="online" />
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomAvatar image="/foto2.jpg" status="offline" />' label="Avatar con estado desconectado">
          <AtomAvatar :image="photo2" status="offline" />
        </PreviewCodeSample>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Grupo apilado</span>
      <div class="preview-row-wrap">
        <PreviewCodeSample marker="<AtomAvatarGroup>" label="Grupo de avatares">
        <AtomAvatarGroup>
          <AtomAvatar size="sm" :image="photo1" />
          <AtomAvatar size="sm" :image="photo2" />
          <AtomAvatar size="sm" :image="photo3" />
          <AtomAvatar size="sm" initials="+5" />
        </AtomAvatarGroup>
        </PreviewCodeSample>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
}
.preview-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.preview-group__label {
  font-size: 10px;
  font-family: monospace;
  color: #999;
  text-transform: uppercase;
}
.preview-row-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
</style>

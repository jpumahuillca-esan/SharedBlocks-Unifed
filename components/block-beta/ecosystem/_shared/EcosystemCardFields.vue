<template>
  <div>
    <label class="form-label">Título</label>
    <input v-model="card.title" type="text" class="form-control form-control-sm mb-2" />

    <label class="form-label">Descripción</label>
    <p class="ecf-hint">Opcional. Vacía, no se muestra.</p>
    <textarea v-model="card.desc" class="form-control form-control-sm mb-2" rows="2"></textarea>

    <label class="form-label">Color</label>
    <p class="ecf-hint">
      Son los colores de marca del sistema. No hay selector libre a propósito:
      así, si la marca corrige un tono, las páginas ya publicadas lo siguen solas.
    </p>
    <select v-model="card.color" class="form-select form-select-sm mb-1">
      <option v-for="option in ECOSYSTEM_COLORS" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <div class="ecf-swatches mb-2">
      <button
        v-for="option in ECOSYSTEM_COLORS"
        :key="option.value"
        type="button"
        class="ecf-swatch"
        :class="{ 'is-active': card.color === option.value }"
        :style="{ background: `var(${option.token})` }"
        :title="option.label"
        :aria-label="option.label"
        :aria-pressed="card.color === option.value ? 'true' : 'false'"
        @click="card.color = option.value"
      ></button>
    </div>

    <label class="form-label">Imagen</label>
    <div class="ecf-image-preview mb-2">
      <img v-if="card.image" :src="card.image" alt="" />
      <span v-else class="text-muted small">Sin imagen</span>
    </div>
    <div class="d-flex gap-2 mb-2">
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary flex-grow-1"
        @click="$emit('select-image', { item: card, field: 'image' })"
      >
        <i class="las la-image me-1"></i>
        {{ card.image ? 'Cambiar imagen' : 'Subir imagen' }}
      </button>
      <button
        v-if="card.image"
        type="button"
        class="btn btn-sm btn-outline-danger"
        title="Quitar imagen"
        @click="card.image = ''"
      >
        <i class="las la-trash"></i>
      </button>
    </div>

    <label class="form-label">Texto alternativo</label>
    <input v-model="card.imageAlt" type="text" class="form-control form-control-sm mb-2" />

    <label class="form-label">Destino</label>
    <input
      v-model="card.href"
      type="text"
      class="form-control form-control-sm"
      placeholder="/ruta o https://"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Campos de una tarjeta del ecosistema, en el panel del editor.
 *
 * Las escuelas y las facultades tienen exactamente el mismo dato, así que
 * comparten formulario en lugar de repetirlo en las dos listas.
 *
 * La tarjeta llega por referencia y se edita en sitio: es el mismo objeto de la
 * lista del editor, que es quien avisa del cambio hacia arriba.
 */
import { ECOSYSTEM_COLORS, type EcosystemCardItem } from './types';

defineProps<{ card: EcosystemCardItem }>();

defineEmits(['select-image']);
</script>

<style scoped>
.ecf-hint {
  margin: 0 0 6px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

/* Muestrario: el nombre del color dice poco, el color se reconoce de un vistazo. */
.ecf-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ecf-swatch {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.ecf-swatch:hover {
  transform: scale(1.12);
}

.ecf-swatch.is-active {
  border-color: #1f2733;
}

.ecf-image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  border: 1px dashed #c6cedb;
  border-radius: 7px;
  background: #f4f6fa;
  overflow: hidden;
}

.ecf-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

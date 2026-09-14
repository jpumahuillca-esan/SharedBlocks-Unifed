<template>
  <div class="card-section-header-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Encabezado</h6>
    <p class="cs-hint">
      El título va a la izquierda y el enlace a la derecha. Deja vacío
      cualquiera de los dos para ocultarlo.
    </p>

    <label class="form-label">Título de la sección</label>
    <input
      :value="title"
      type="text"
      class="form-control form-control-sm mb-2"
      @input="$emit('update:title', ($event.target as HTMLInputElement).value)"
    />

    <label class="form-label">Texto del enlace</label>
    <input
      :value="linkLabel"
      type="text"
      class="form-control form-control-sm mb-2"
      placeholder="Ver todos"
      @input="$emit('update:linkLabel', ($event.target as HTMLInputElement).value)"
    />

    <label class="form-label">Destino del enlace</label>
    <input
      :value="linkUrl"
      type="text"
      class="form-control form-control-sm"
      placeholder="/ruta o https://"
      @input="$emit('update:linkUrl', ($event.target as HTMLInputElement).value)"
    />

    <hr />

    <h6 class="fw-bold small text-uppercase mb-1">Tarjetas visibles a la vez</h6>
    <p class="cs-hint">
      Cuántas se ven sin desplazar. Puedes agregar todas las que quieras: las
      que no entren quedan al alcance deslizando el carrusel.
    </p>

    <div class="count-options">
      <button
        v-for="option in [2, 3, 4]"
        :key="option"
        type="button"
        class="count-option"
        :class="{ 'is-selected': cardCount === option }"
        @click="$emit('update:cardCount', option as CardCount)"
      >
        <span class="count-preview">
          <span v-for="i in option" :key="i" class="count-chip"></span>
        </span>
        <span class="count-label">{{ option }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Fragmento de editor para el encabezado y el número de columnas.
 *
 * Lo comparten las dos secciones. A diferencia del editor de acciones de los
 * CTA, aquí los valores se emiten en lugar de mutarse en sitio porque son
 * campos sueltos y no objetos.
 */
import type { CardCount } from './types';

defineProps<{
  title: string;
  linkLabel: string;
  linkUrl: string;
  cardCount: CardCount;
}>();

defineEmits<{
  (e: 'update:title', value: string): void;
  (e: 'update:linkLabel', value: string): void;
  (e: 'update:linkUrl', value: string): void;
  (e: 'update:cardCount', value: CardCount): void;
}>();
</script>

<style scoped>
.cs-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

.count-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.count-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 9px 6px;
  border: 1px solid #dde3ec;
  border-radius: 7px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.count-option:hover {
  border-color: #e31140;
}

.count-option.is-selected {
  border-color: #e31140;
  box-shadow: 0 0 0 2px rgba(227, 17, 64, 0.15);
}

.count-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 18px;
}

.count-chip {
  width: 8px;
  height: 14px;
  border-radius: 2px;
  background: #e31140;
}

.count-label {
  font-size: 11px;
  font-weight: 700;
  color: #495057;
}
</style>

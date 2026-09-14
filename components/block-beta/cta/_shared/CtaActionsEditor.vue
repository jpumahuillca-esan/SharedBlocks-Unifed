<template>
  <div class="cta-actions-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Botones</h6>

    <p class="cta-hint">
      Elige cuántos botones muestra el CTA. El principal es el botón lleno y el
      secundario va delineado. Si dejas el texto de un botón vacío, ese botón no
      se dibuja aunque esté activado.
    </p>

    <!-- Selector de cantidad: tres opciones con vista previa de cómo queda -->
    <div class="count-options mb-3">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="count-option"
        :class="{ 'is-selected': buttonCount === option.value }"
        @click="$emit('update:buttonCount', option.value)"
      >
        <span class="count-preview">
          <span v-if="option.value === 0" class="count-preview__none">—</span>
          <template v-else>
            <span class="count-chip is-primary"></span>
            <span v-if="option.value === 2" class="count-chip is-secondary"></span>
          </template>
        </span>
        <span class="count-label">{{ option.label }}</span>
      </button>
    </div>

    <template v-if="buttonCount === 0">
      <p class="cta-note">
        <i class="las la-eye-slash me-1"></i>
        Este CTA se mostrará sin botones. Los textos que hayas escrito se
        conservan por si vuelves a activarlos.
      </p>
    </template>

    <template v-else>
      <div class="action-card">
        <div class="action-card__head">
          <span class="action-dot is-primary"></span>
          <strong>Botón principal</strong>
        </div>
        <input
          v-model="primary.label"
          type="text"
          class="form-control form-control-sm mb-2"
          placeholder="Texto del botón"
        />
        <input
          v-model="primary.url"
          type="text"
          class="form-control form-control-sm"
          placeholder="Destino: /ruta o https://"
        />
      </div>

      <div v-if="buttonCount === 2" class="action-card">
        <div class="action-card__head">
          <span class="action-dot is-secondary"></span>
          <strong>Botón secundario</strong>
        </div>
        <input
          v-model="secondary.label"
          type="text"
          class="form-control form-control-sm mb-2"
          placeholder="Texto del botón"
        />
        <input
          v-model="secondary.url"
          type="text"
          class="form-control form-control-sm"
          placeholder="Destino: /ruta o https://"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * Fragmento de editor para el área de acciones de un CTA.
 *
 * Lo comparten las variantes que tienen botones. Los objetos de acción se
 * reciben y se mutan en sitio: forman parte del `localData` del editor padre,
 * que es quien emite el cambio hacia el constructor.
 *
 * Cambiar la cantidad no borra lo escrito: el bloque simplemente deja de
 * dibujar lo que sobra, así que se puede volver atrás sin perder el texto.
 */
import type { CtaAction, CtaButtonCount } from './types';

defineProps<{
  primary: CtaAction;
  secondary: CtaAction;
  buttonCount: CtaButtonCount;
}>();

defineEmits<{ (e: 'update:buttonCount', value: CtaButtonCount): void }>();

const options: { value: CtaButtonCount; label: string }[] = [
  { value: 0, label: 'Sin botones' },
  { value: 1, label: 'Un botón' },
  { value: 2, label: 'Dos botones' },
];
</script>

<style scoped>
.cta-hint {
  margin: 0 0 10px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

/* Selector de cantidad */
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

/* Vista previa de la disposición resultante */
.count-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 18px;
}

.count-preview__none {
  color: #aab2bf;
  font-weight: 700;
}

.count-chip {
  width: 20px;
  height: 9px;
  border-radius: 3px;
}

.count-chip.is-primary {
  background: #e31140;
}

.count-chip.is-secondary {
  border: 1px solid #e31140;
  background: transparent;
}

.count-label {
  font-size: 10.5px;
  font-weight: 600;
  line-height: 1.2;
  color: #495057;
  text-align: center;
}

/* Tarjetas de cada botón */
.action-card {
  padding: 10px;
  margin-bottom: 8px;
  border: 1px solid #dde3ec;
  border-radius: 7px;
}

.action-card:last-child {
  margin-bottom: 0;
}

.action-card__head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 12px;
}

.action-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.action-dot.is-primary {
  background: #e31140;
}

.action-dot.is-secondary {
  border: 1px solid #e31140;
  background: transparent;
}

.cta-note {
  margin: 0;
  padding: 9px 10px;
  border: 1px dashed #c6cedb;
  border-radius: 7px;
  background: #f4f6fa;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}
</style>

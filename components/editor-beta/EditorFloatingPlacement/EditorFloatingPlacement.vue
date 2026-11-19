<template>
  <section
    v-if="effectivePlacement"
    :class="compact ? 'fp-compact' : 'fp-callout'"
    data-edit-target="mobile_placement"
  >
    <div v-if="!compact" class="fp-callout__head">
      <i class="las la-thumbtack"></i>
      <strong>Flotante a la {{ effectivePlacement.side === 'start' ? 'izquierda' : 'derecha' }}</strong>
    </div>

    <label :class="compact ? 'fp-label fp-label--compact' : 'fp-label'" :for="selectId">
      En tableta y móvil, mostrar:
    </label>
    <select
      :id="selectId"
      class="form-select form-select-sm"
      :value="mobileAfterValue"
      @change="onMobileAfterChange"
    >
      <option :value="MOBILE_AFTER_START">Al inicio de la sección (encima de todo)</option>
      <option v-for="anchor in effectivePlacement.anchors" :key="anchor.id" :value="anchor.id">
        Debajo de: {{ anchor.label }}
      </option>
      <option :value="MOBILE_AFTER_END">Al final de la sección (al fondo)</option>
    </select>
    <p v-if="!compact" class="fp-hint">
      Desde 1280px flota al costado acompañando al scroll. Por debajo entra en el flujo en esta posición.
    </p>
  </section>
</template>

<script setup lang="ts">
/**
 * Selector de orden en tableta/móvil (< 1280px) para cualquier bloque o columna
 * flotante (`float-start` / `float-end`).
 *
 * Acepta el contexto por prop o por `BLOCK_PLACEMENT_KEY` inyectado desde el
 * inspector derecho, de modo que funcione tanto en el panel del bloque como en
 * la configuración de columna de la sección sin duplicar lógica.
 */
import { computed, inject, useId } from 'vue';
import {
  BLOCK_PLACEMENT_KEY,
  resolveEffectiveMobileAfter,
  type BlockPlacementContext,
} from '../../../core/blockPlacement';
import { MOBILE_AFTER_END, MOBILE_AFTER_START } from '../../../core/sectionTypes';

const props = withDefaults(
  defineProps<{
    placement?: BlockPlacementContext | null;
    compact?: boolean;
  }>(),
  {
    placement: undefined,
    compact: false,
  },
);

const injectedPlacement = inject(BLOCK_PLACEMENT_KEY, null);
const effectivePlacement = computed(() =>
  props.placement !== undefined ? props.placement : (injectedPlacement?.value ?? null),
);

const selectId = `fp-mobile-after-${useId()}`;

const mobileAfterValue = computed(() => {
  const ctx = effectivePlacement.value;
  if (!ctx) return '';
  return resolveEffectiveMobileAfter(ctx.side, ctx.mobileAfterBlockId, ctx.anchors);
});

const onMobileAfterChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  effectivePlacement.value?.setMobileAfter(value || null);
};
</script>

<style scoped>
.fp-callout {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border: 1px solid var(--ed-info, #0d6efd);
  border-radius: var(--ed-radius-sm, 7px);
  background: var(--ed-info-soft, rgba(13, 110, 253, 0.07));
}

.fp-callout__head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--ed-text, #1f2733);
}

.fp-callout__head i {
  color: var(--ed-info, #0d6efd);
}

.fp-compact {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fp-label {
  display: block;
  margin: 0 0 2px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ed-text, #1f2733);
}

.fp-label--compact {
  margin-bottom: 0;
  font-size: 11.5px;
}

.fp-hint {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--ed-muted, #6b7688);
}
</style>

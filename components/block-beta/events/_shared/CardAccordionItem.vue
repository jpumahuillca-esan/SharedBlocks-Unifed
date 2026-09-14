<template>
  <div class="card-acc" :class="{ 'is-open': open }">
    <button type="button" class="card-acc__head" :aria-expanded="open" @click="$emit('toggle')">
      <i class="las card-acc__caret" :class="open ? 'la-angle-down' : 'la-angle-right'"></i>

      <span class="card-acc__index">{{ index + 1 }}</span>
      <span class="card-acc__title">{{ title || 'Sin título' }}</span>

      <!-- Las acciones no deben abrir ni cerrar el panel -->
      <span class="card-acc__actions" @click.stop>
        <button
          type="button"
          class="card-acc__btn"
          title="Subir"
          :disabled="index === 0"
          @click="$emit('move', -1)"
        >
          <i class="las la-arrow-up"></i>
        </button>
        <button
          type="button"
          class="card-acc__btn"
          title="Bajar"
          :disabled="index === total - 1"
          @click="$emit('move', 1)"
        >
          <i class="las la-arrow-down"></i>
        </button>
        <button
          type="button"
          class="card-acc__btn is-danger"
          :title="removeLabel"
          @click="$emit('remove')"
        >
          <i class="las la-trash"></i>
        </button>
      </span>
    </button>

    <div v-if="open" class="card-acc__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Una tarjeta plegable en la lista del editor.
 *
 * Con varias tarjetas abiertas a la vez el panel se vuelve interminable y hay
 * que recorrerlo entero para llegar al botón de agregar. Plegadas, la lista
 * cabe de un vistazo.
 *
 * El contenido se destruye al cerrar (v-if y no v-show) para no montar todos
 * los campos de todas las tarjetas a la vez.
 */
withDefaults(
  defineProps<{
    title: string;
    index: number;
    total: number;
    open: boolean;
    removeLabel?: string;
  }>(),
  { removeLabel: 'Quitar' },
);

defineEmits<{
  (e: 'toggle'): void;
  (e: 'move', delta: number): void;
  (e: 'remove'): void;
}>();
</script>

<style scoped>
.card-acc {
  margin-bottom: 6px;
  border: 1px solid #dde3ec;
  border-radius: 7px;
  overflow: hidden;
}

.card-acc.is-open {
  border-color: #c6cedb;
}

.card-acc__head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: #f4f6fa;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.card-acc__head:hover {
  background: #eef1f6;
}

.card-acc.is-open .card-acc__head {
  background: #fff;
  border-bottom: 1px solid #dde3ec;
}

.card-acc__caret {
  flex-shrink: 0;
  font-size: 12px;
  color: #6b7688;
}

.card-acc__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #dde3ec;
  color: #495057;
  font-size: 10px;
  font-weight: 700;
}

.card-acc__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12.5px;
  font-weight: 600;
  color: #1f2733;
}

.card-acc__actions {
  display: flex;
  flex-shrink: 0;
  gap: 2px;
}

.card-acc__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: #6b7688;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.card-acc__btn:hover:not(:disabled) {
  background: #dde3ec;
  color: #1f2733;
}

.card-acc__btn.is-danger:hover:not(:disabled) {
  background: #dc3545;
  color: #fff;
}

.card-acc__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.card-acc__body {
  padding: 12px 10px;
}
</style>

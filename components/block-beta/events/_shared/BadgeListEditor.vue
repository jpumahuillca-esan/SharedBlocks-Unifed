<template>
  <div class="badge-list-editor">
    <div class="d-flex align-items-center justify-content-between mb-1">
      <label class="form-label m-0">{{ label }}</label>
      <button type="button" class="btn btn-sm btn-outline-secondary" @click="add">
        <i class="las la-plus me-1"></i> Agregar
      </button>
    </div>

    <p class="bl-hint">{{ hint }}</p>

    <p v-if="!badges.length" class="bl-empty">{{ emptyText }}</p>

    <div v-for="(badge, i) in badges" :key="i" class="input-group input-group-sm mb-1">
      <input
        :value="badge"
        type="text"
        class="form-control"
        :placeholder="placeholder"
        @input="update(i, ($event.target as HTMLInputElement).value)"
      />
      <button
        type="button"
        class="btn btn-outline-secondary"
        title="Subir"
        :disabled="i === 0"
        @click="move(i, -1)"
      >
        <i class="las la-arrow-up"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary"
        title="Bajar"
        :disabled="i === badges.length - 1"
        @click="move(i, 1)"
      >
        <i class="las la-arrow-down"></i>
      </button>
      <button type="button" class="btn btn-outline-danger" title="Quitar" @click="remove(i)">
        <i class="las la-trash"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor de una lista de textos sueltos dentro de otra ficha: las etiquetas de
 * una tarjeta de evento, las viñetas de una tarjeta de valor...
 *
 * El arreglo se recibe y se muta en sitio: forma parte del `localData` del
 * editor padre, que es quien emite el cambio hacia el constructor. Mismo
 * criterio que el editor de acciones de los CTA.
 *
 * Los rótulos son props con el texto de las etiquetas por defecto, así que
 * quien ya lo usaba no cambia; otro bloque solo tiene que decir cómo llama a
 * los suyos, en vez de clonar el componente para cambiarle tres palabras.
 */
const props = withDefaults(defineProps<{
  badges: string[];
  label?: string;
  hint?: string;
  placeholder?: string;
  emptyText?: string;
}>(), {
  label: 'Etiquetas',
  hint: 'Puedes poner tantas como necesites. Se muestran sobre la tarjeta, una al lado de otra.',
  placeholder: 'Texto de la etiqueta',
  emptyText: 'Sin etiquetas.',
});

const add = () => props.badges.push('');

const remove = (index: number) => props.badges.splice(index, 1);

const update = (index: number, value: string) => {
  props.badges[index] = value;
};

const move = (index: number, delta: number) => {
  const target = index + delta;
  if (target < 0 || target >= props.badges.length) return;

  [props.badges[index], props.badges[target]] = [props.badges[target], props.badges[index]];
};
</script>

<style scoped>
.bl-hint {
  margin: 0 0 6px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

.bl-empty {
  margin: 0 0 6px;
  font-size: 11.5px;
  color: #aab2bf;
}
</style>

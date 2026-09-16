<template>
  <div class="card-section-header-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Encabezado</h6>
    <p class="cs-hint">
      El título va a la izquierda y el enlace a la derecha. Deja vacío
      cualquiera de los dos para ocultarlo.
    </p>

    <label class="form-label">Título de la sección</label>
    <p class="cs-hint">Lleva siempre el guion rojo debajo.</p>
    <input
      :value="title"
      type="text"
      class="form-control form-control-sm mb-2"
      @input="$emit('update:title', ($event.target as HTMLInputElement).value)"
    />

    <!-- Descripción — opcional -->
    <div class="cs-optional">
      <div class="cs-optional__head">
        <label class="form-label m-0">Descripción</label>
        <button
          v-if="showDesc"
          type="button"
          class="cs-optional__drop"
          title="Quitar descripción"
          @click="removeDesc"
        >
          <i class="las la-times"></i>
        </button>
      </div>

      <textarea
        v-if="showDesc"
        :value="desc"
        class="form-control form-control-sm"
        rows="2"
        placeholder="Descubre todos los eventos de los que puedes ser parte."
        @input="$emit('update:desc', ($event.target as HTMLTextAreaElement).value)"
      ></textarea>
      <button
        v-else
        type="button"
        class="btn btn-sm btn-outline-secondary w-100"
        @click="descOpen = true"
      >
        <i class="las la-plus me-1"></i> Agregar descripción
      </button>
    </div>

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
import { ref, computed } from 'vue';
import type { CardCount } from './types';

const props = defineProps<{
  title: string;
  desc: string;
  linkLabel: string;
  linkUrl: string;
  cardCount: CardCount;
}>();

const emit = defineEmits<{
  (e: 'update:title', value: string): void;
  (e: 'update:desc', value: string): void;
  (e: 'update:linkLabel', value: string): void;
  (e: 'update:linkUrl', value: string): void;
  (e: 'update:cardCount', value: CardCount): void;
}>();

/*
 * Descripción opcional.
 *
 * El campo se muestra si se pidió o si ya trae texto. Hace falta el estado
 * aparte: al pulsar "Agregar" el valor está vacío, y si solo se mirara el dato
 * el campo se cerraría solo antes de poder escribir. Es estado del panel, no se
 * guarda.
 */
const descOpen = ref(false);

const showDesc = computed(() => descOpen.value || Boolean(props.desc));

/** Se limpia el dato además de plegar: si no, la sección seguiría dibujándolo. */
const removeDesc = () => {
  descOpen.value = false;
  emit('update:desc', '');
};
</script>

<style scoped>
.cs-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

/* Campo opcional: encabezado con su botón de quitar, y debajo el campo o el
   botón de agregar. Mismo patrón que el editor del hero. */
.cs-optional {
  margin-bottom: 12px;
}

.cs-optional__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.cs-optional__drop {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: #6b7688;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.cs-optional__drop:hover {
  background: #dc3545;
  color: #fff;
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

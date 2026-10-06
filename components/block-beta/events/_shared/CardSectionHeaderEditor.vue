<template>
  <div class="card-section-header-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Encabezado</h6>
    <p class="cs-hint">
      El título va a la izquierda y el enlace a la derecha. Deja vacío
      cualquiera de los dos para ocultarlo.
    </p>

    <!-- Solo si la sección lo pide, igual que las columnas más abajo. -->
    <template v-if="eyebrow !== undefined">
      <EditorText
        :model-value="eyebrow"
        data-edit-target="eyebrow"
        class="mb-2"
        :label="eyebrowLabel || 'Etiqueta superior'"
        :hint="eyebrowHint || 'Texto corto sobre el título. Se muestra en mayúsculas.'"
        placeholder="Comunidad y vida ESAN"
        @update:model-value="$emit('update:eyebrow', $event)"
      />
    </template>

    <slot name="title">
      <EditorText
        :model-value="title"
        data-edit-target="title"
        class="mb-2"
        label="Título de la sección"
        hint="Lleva siempre el guion rojo debajo."
        @update:model-value="$emit('update:title', $event)"
      />

    </slot>

    <!-- Descripción — opcional -->
    <div class="cs-optional" data-edit-target="desc">
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

      <EditorTextarea
        v-if="showDesc"
        :model-value="desc"
        :rows="2"
        placeholder="Descubre todos los eventos de los que puedes ser parte."
        @update:model-value="$emit('update:desc', $event)"
      />
      <button
        v-else
        type="button"
        class="btn btn-sm btn-outline-secondary w-100"
        @click="descOpen = true"
      >
        <i class="las la-plus me-1"></i> Agregar descripción
      </button>
    </div>

    <EditorText
      :model-value="linkLabel"
      data-edit-target="linkLabel"
      class="mb-2"
      label="Texto del enlace"
      placeholder="Ver todos"
      @update:model-value="$emit('update:linkLabel', $event)"
    />

    <EditorUrl
      :model-value="linkUrl"
      :target="linkTarget"
      data-edit-target="linkUrl"
      label="Destino del enlace"
      @update:model-value="$emit('update:linkUrl', $event)"
      @update:target="$emit('update:linkTarget', $event)"
    />

    <!--
      Solo si la sección lo pide: `awards` reusa este encabezado pero no elige
      columnas, porque su fila tiene como mucho cuatro logos y los muestra todos.
    -->
    <template v-if="cardCount !== undefined">
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
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * Fragmento de editor para el encabezado y el número de columnas.
 *
 * Lo comparten las dos secciones de `events` y la de `awards`, que solo usa el
 * encabezado (no pasa `cardCount`). A diferencia del editor de acciones de los
 * CTA, aquí los valores se emiten en lugar de mutarse en sitio porque son
 * campos sueltos y no objetos.
 */
import { ref, computed } from 'vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import type { CardCount } from './types';

const props = defineProps<{
  /** Opcional: sin él, el panel no ofrece la etiqueta superior. */
  eyebrow?: string;
  eyebrowLabel?: string;
  eyebrowHint?: string;
  title: string;
  desc: string;
  linkLabel: string;
  linkUrl: string;
  /** `_blank` abre el enlace en una pestaña nueva; vacío, en la misma página. */
  linkTarget?: string;
  /** Opcional: sin él, el panel no ofrece elegir columnas. */
  cardCount?: CardCount;
}>();

const emit = defineEmits<{
  (e: 'update:eyebrow', value: string): void;
  (e: 'update:title', value: string): void;
  (e: 'update:desc', value: string): void;
  (e: 'update:linkLabel', value: string): void;
  (e: 'update:linkUrl', value: string): void;
  (e: 'update:linkTarget', value: string): void;
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

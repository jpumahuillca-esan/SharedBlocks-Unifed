<template>
  <div class="editor-link-target">
    <div class="form-check form-switch m-0">
      <input
        :id="switchId"
        class="form-check-input"
        type="checkbox"
        role="switch"
        :checked="isExternal"
        @change="onChange"
      />
      <label class="form-check-label editor-link-target__label" :for="switchId">
        {{ isExternal ? 'Página externa' : 'Link interno' }}
      </label>
    </div>

    <EditorHint after>
      {{ isExternal ? 'Se abre en una pestaña nueva (_blank).' : 'Se abre en la misma página.' }}
    </EditorHint>
  </div>
</template>

<script setup lang="ts">
/**
 * Interruptor del destino de un enlace.
 *
 * Apagado se llama "Link interno": el enlace se abre en la misma página, que es
 * lo normal. Encendido se llama "Página externa": el enlace lleva a otra página
 * y se abre en una pestaña nueva, con `target="_blank"`.
 *
 * El valor es el mismo `target` que luego lee el bloque: `'_blank'` o `''`. No
 * hay más estados a propósito (ver helpers/linkTarget.ts).
 *
 * Va debajo de un campo de destino (EditorUrl lo trae); suelto no tiene sentido.
 */
import { computed } from 'vue';
import EditorHint from '../EditorHint/EditorHint.vue';
import { LINK_TARGET_BLANK } from '../../../helpers/linkTarget';
import { nextFieldId } from '../_shared/fieldUtils';

const model = defineModel<string>({ default: '' });

const switchId = nextFieldId('ed-link-target');

const isExternal = computed(() => model.value === LINK_TARGET_BLANK);

const onChange = (event: Event) => {
  model.value = (event.target as HTMLInputElement).checked ? LINK_TARGET_BLANK : '';
};
</script>

<style scoped>
.editor-link-target__label {
  font-size: 12px;
  font-weight: 600;
  color: #1f2733;
}
</style>

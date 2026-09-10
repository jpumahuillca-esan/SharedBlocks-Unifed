<script setup lang="ts">
/**
 * PreviewForms — muestra las piezas de formulario juntas (Elementos >
 * Formularios de webunificada): campos, checkbox/radio y estado de
 * error. Solo vista previa, no se usa en bloques reales.
 */
import { ref } from 'vue';
import MoleculeFormField from '../molecules/MoleculeFormField.vue';
import AtomFormCheck from '../atoms/AtomFormCheck.vue';

const nombre = ref('');
const programa = ref('');
const mensaje = ref('');
const email = ref('maria.torres@');
const acepta = ref(true);
const modalidad = ref('presencial');

const programas = [
  { value: 'mba', label: 'MBA' },
  { value: 'finanzas', label: 'Maestría en Finanzas' },
  { value: 'marketing', label: 'Maestría en Marketing' },
];
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Campos</span>
      <div class="preview-row-wrap">
        <MoleculeFormField
          id="pv-name"
          label="Nombre completo"
          placeholder="Ej. María Torres"
          help="Tal como figura en tu documento de identidad."
          v-model="nombre"
        />
        <MoleculeFormField
          as="select"
          id="pv-program"
          label="Programa de interés"
          placeholder="Selecciona un programa"
          :options="programas"
          v-model="programa"
        />
      </div>
      <div class="preview-row-wrap">
        <MoleculeFormField
          as="textarea"
          id="pv-message"
          label="Mensaje"
          placeholder="Cuéntanos en qué podemos ayudarte"
          v-model="mensaje"
          style="max-width: 480px; width: 100%"
        />
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Checkbox &amp; Radio</span>
      <div class="preview-row-wrap">
        <AtomFormCheck v-model="acepta">Acepto la política de privacidad</AtomFormCheck>
        <AtomFormCheck type="radio" name="pv-modalidad" value="presencial" v-model="modalidad">Presencial</AtomFormCheck>
        <AtomFormCheck type="radio" name="pv-modalidad" value="virtual" v-model="modalidad">Virtual</AtomFormCheck>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Estado de error</span>
      <div class="preview-row-wrap">
        <MoleculeFormField
          id="pv-email"
          label="Correo electrónico"
          type="email"
          error="Ingresa un correo electrónico válido."
          v-model="email"
        />
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
  gap: 12px;
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
  align-items: flex-start;
  gap: 16px;
}
</style>

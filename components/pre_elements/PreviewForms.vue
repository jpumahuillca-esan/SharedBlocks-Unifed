<script setup lang="ts">
/**
 * PreviewForms — muestra las piezas de formulario juntas (Elementos >
 * Formularios): campo de texto, dropdown, etiqueta flotante, buscador,
 * área de texto, checkbox/radio y el grupo completo.
 *
 * Sigue la lámina de formularios del Figma grupo por grupo y estado por
 * estado. El estado de foco va con la prop `state="focus"` porque en una
 * guía impresa nada tiene el foco de verdad; los demás son reales.
 *
 * Solo vista previa, no se usa en bloques reales.
 */
import { reactive, ref } from 'vue';
import MoleculeFormField from '../molecules/MoleculeFormField.vue';
import AtomFormCheck from '../atoms/AtomFormCheck.vue';

/* Un valor por campo, para que cada ejemplo se pueda escribir por separado. */
const campo = reactive({
  in1: '', in2: 'Ej. María Torres', in3: 'Ej. María Torres', in4: 'Ej. María Torres',
  sel1: '', sel2: '', sel3: 'mba', sel4: 'mba',
  fl1: '', fl2: 'Placeholder', fl3: 'Placeholder', fl4: 'Placeholder', fl5: 'Martin Santos',
  se1: '', se2: '', se3: 'Carreras universitarias',
  ta1: '', ta2: 'Escribe tu mensaje', ta3: 'Escribe tu mensaje', ta4: 'Escribe tu mensaje',
  fg1: '', fg2: '',
});

const acepta = ref(true);
const noAcepta = ref(false);
const modalidad = ref('virtual');

const programas = [
  { value: 'mba', label: 'MBA' },
  { value: 'finanzas', label: 'Maestría en Finanzas' },
  { value: 'marketing', label: 'Maestría en Marketing' },
];
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Input text</span>
      <div class="preview-col">
        <MoleculeFormField id="pv-in-1" placeholder="Ej. María Torres" v-model="campo.in1" />
        <MoleculeFormField id="pv-in-2" state="focus" v-model="campo.in2" />
        <MoleculeFormField id="pv-in-3" v-model="campo.in3" />
        <MoleculeFormField id="pv-in-4" error v-model="campo.in4" />
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Dropdown</span>
      <div class="preview-col">
        <MoleculeFormField
          as="select"
          id="pv-sel-1"
          placeholder="Seleccionar"
          :options="programas"
          v-model="campo.sel1"
        />
        <MoleculeFormField
          as="select"
          id="pv-sel-2"
          placeholder="Seleccionar"
          state="focus"
          :options="programas"
          v-model="campo.sel2"
        />
        <MoleculeFormField
          as="select"
          id="pv-sel-3"
          placeholder="Seleccionar"
          :options="programas"
          v-model="campo.sel3"
        />
        <MoleculeFormField
          as="select"
          id="pv-sel-4"
          placeholder="Seleccionar"
          error
          :options="programas"
          v-model="campo.sel4"
        />
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Etiqueta flotante</span>
      <div class="preview-col">
        <MoleculeFormField
          variant="floating"
          id="pv-fl-1"
          label="Placeholder"
          placeholder="Placeholder"
          status="info"
          v-model="campo.fl1"
        />
        <MoleculeFormField
          variant="floating"
          id="pv-fl-2"
          label="Placeholder"
          status="info"
          v-model="campo.fl2"
        />
        <MoleculeFormField
          variant="floating"
          id="pv-fl-3"
          label="Placeholder"
          success
          v-model="campo.fl3"
        />
        <MoleculeFormField
          variant="floating"
          id="pv-fl-4"
          label="Placeholder"
          error
          v-model="campo.fl4"
        />
        <MoleculeFormField
          variant="floating"
          id="pv-fl-5"
          label="Nombres y apellidos"
          error="Ingresa tu nombre tal como figura en tu documento."
          v-model="campo.fl5"
        />
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Search bar</span>
      <div class="preview-col">
        <MoleculeFormField
          variant="search"
          id="pv-se-1"
          label="Buscar"
          placeholder="Buscar"
          v-model="campo.se1"
        />
        <MoleculeFormField
          variant="search"
          id="pv-se-2"
          label="Buscar"
          placeholder="Buscar"
          state="focus"
          v-model="campo.se2"
        />
        <MoleculeFormField variant="search" id="pv-se-3" label="Buscar" v-model="campo.se3" />
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Textarea</span>
      <div class="preview-col">
        <MoleculeFormField
          as="textarea"
          id="pv-ta-1"
          placeholder="Escribe tu mensaje"
          v-model="campo.ta1"
        />
        <MoleculeFormField as="textarea" id="pv-ta-2" state="focus" v-model="campo.ta2" />
        <MoleculeFormField as="textarea" id="pv-ta-3" v-model="campo.ta3" />
        <MoleculeFormField as="textarea" id="pv-ta-4" error v-model="campo.ta4" />
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Checkbox &amp; Radio</span>
      <div class="preview-col preview-col--tight">
        <AtomFormCheck v-model="noAcepta">Placeholder</AtomFormCheck>
        <AtomFormCheck v-model="acepta">Placeholder</AtomFormCheck>
      </div>
      <div class="preview-col preview-col--tight">
        <AtomFormCheck type="radio" name="pv-modalidad" value="presencial" v-model="modalidad">
          Placeholder
        </AtomFormCheck>
        <AtomFormCheck type="radio" name="pv-modalidad" value="virtual" v-model="modalidad">
          Placeholder
        </AtomFormCheck>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Form group</span>
      <div class="preview-col">
        <MoleculeFormField
          as="select"
          id="pv-fg-1"
          label="Label"
          placeholder="Seleccionar"
          required
          :options="programas"
          v-model="campo.fg1"
        />
        <MoleculeFormField
          id="pv-fg-2"
          placeholder="Ej. María Torres"
          help="Tal como figura en tu documento de identidad."
          v-model="campo.fg2"
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
.preview-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* Todos los campos al mismo ancho, como en la lámina. */
  align-items: stretch;
  max-width: 360px;
}
.preview-col--tight {
  align-items: flex-start;
  gap: 8px;
}
</style>

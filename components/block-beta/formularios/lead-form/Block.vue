<template>
  <div class="lead-form">
    <div class="lead-form__header">
      <AtomHeading :level="3" size="h5" class="lead-form__title" v-bind="edit('mainTitle')">{{ cfg.mainTitle }}</AtomHeading>
      <AtomText v-if="cfg.subTitle" size="body-compact" class="lead-form__subtitle" v-bind="edit('subTitle')">{{ cfg.subTitle }}</AtomText>
    </div>

    <form @submit.prevent="submit" class="lead-form__form">
      <input type="hidden" name="academic_unit_id" :value="cfg.academic_unit_id" />
      <input type="hidden" name="campaign_id" :value="cfg.campaign_id" />
      <input type="hidden" name="study_program_id" :value="cfg.study_program_id" />
      <input type="hidden" name="cod_form_old" :value="cfg.cod_form_old" />

      <!-- Trampa Anti-Bot Honeypot: Campo señuelo oculto para bots y scrapers -->
      <input
        type="text"
        name="_hp_website"
        v-model="formValues._hp_website"
        style="display:none !important; visibility:hidden !important; position:absolute; left:-9999px;"
        tabindex="-1"
        autocomplete="off"
      />

      <!--
        Grilla propia de dos columnas y no la de Bootstrap: `.arcis-scope * {
        margin: 0; padding: 0 }` (base.scss) borra los gutters de `.row` según el
        orden en que se carguen las hojas, y el formulario se veía distinto en el
        admin y en el sitio. Además la grilla de Bootstrap decide por el ancho de
        la VENTANA, y este formulario vive en tarjetas angostas (flotando, en una
        columna) donde dos campos cortos (DNI / Teléfono) deben ir lado a lado.
      -->
      <div class="lead-form__fields" v-bind="edit('campaign_id')">
        <!-- Render dinámico total del esquema configurado en la campaña -->
        <template v-for="(field, idx) in activeFields" :key="field.name || idx">
          <div :class="['lead-form__field', field.col_span === 12 ? 'lead-form__field--full' : null]">
            <!--
              Cada campo es un MoleculeFormField: él pone el control que toque
              según el tipo. Variante "placeholder": no hay etiqueta encima, el
              nombre del campo (con su asterisco si es obligatorio) se lee dentro
              del campo y, en los selectores, es el texto de la opción vacía. La
              etiqueta viaja como aria-label, así que el lector de pantalla sigue
              sabiendo qué es cada campo. Los campos son dinámicos: lo que cambia
              es la presentación, no el contrato (nombre, tipo, requerido, ancho).
            -->
            <MoleculeFormField
              variant="placeholder"
              :as="field.type === 'select' ? 'select' : field.type === 'textarea' ? 'textarea' : 'input'"
              :type="resolveFieldType(field)"
              :id="'lead-' + (field.name || idx)"
              :label="field.label"
              :placeholder="resolveShownPlaceholder(field)"
              :options="field.options || []"
              :required="field.required"
              :maxlength="resolveMaxlength(field)"
              :minlength="resolveMinlength(field)"
              :inputmode="resolveInputmode(field)"
              v-model="formValues[field.name]"
              @update:model-value="sanitizeField(field.name, field.type)"
            />
          </div>
        </template>

        <!-- Checkboxes legales -->
        <div class="lead-form__row lead-form__legal">
          <AtomFormCheck id="legal_cond" v-model="aceptaCondiciones" multiline size="sm" required>
            <span>
              Acepto las
              <!--
                El enlace vive dentro de la etiqueta: sin parar el clic, abriría
                el enlace Y marcaría la casilla a la vez.
              -->
              <a :href="cfg.condition" target="_blank" rel="noopener" class="lead-form__link" @click.stop>condiciones de tratamiento de mis datos personales</a>.
            </span>
          </AtomFormCheck>

          <AtomFormCheck id="legal_pub" v-model="aceptaPublicidad" multiline size="sm">
            <span>
              Autorizo el envío de información sobre programas académicos y actividades
              institucionales de ESAN.
            </span>
          </AtomFormCheck>
        </div>

        <!-- Botón de envío -->
        <div class="lead-form__row lead-form__actions">
          <AtomButton
            variant="primary"
            size="sm"
            class="lead-form__submit"
            v-bind="edit('button_text')"
            :disabled="isSubmitting"
            @click="submit"
          >
            {{ isSubmitting ? 'PROCESANDO...' : cfg.button_text }}
          </AtomButton>
        </div>

        <!--
          Atribución que Google exige cuando su distintivo no se muestra.
          El sitio lo oculta para que no abra una franja vacía a la derecha.
        -->
        <div class="lead-form__row">
          <AtomText size="body-sm" color="secondary" class="lead-form__recaptcha">
            Este sitio está protegido por reCAPTCHA y se aplican la
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" class="lead-form__link">Política de Privacidad</a>
            y los
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener" class="lead-form__link">Términos de Servicio</a>
            de Google.
          </AtomText>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomFormCheck from '../../../atoms/AtomFormCheck.vue';
import MoleculeFormField from '../../../molecules/MoleculeFormField.vue';
import { useDynamicLeadForm, type DynamicLeadFormProps } from './composables/useDynamicLeadForm';
import { useEditTarget } from '../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

const props = withDefaults(defineProps<DynamicLeadFormProps>(), {
  data: () => ({}),
  config: () => ({}),
  careerName: '',
  apiBaseUrl: '',
});

const {
  cfg,
  activeFields,
  formValues,
  isSubmitting,
  aceptaCondiciones,
  aceptaPublicidad,
  sanitizeField,
  resolveFieldType,
  resolveMaxlength,
  resolveMinlength,
  resolveInputmode,
  resolveShownPlaceholder,
  submit,
} = useDynamicLeadForm(props);
</script>

<style scoped>
/*
 * Solo queda lo propio de este bloque: la tarjeta que envuelve al formulario y
 * el enlace legal. Campos, etiquetas, casillas y botón los pone el sistema de
 * diseño (assets/styles/elements/_forms.scss y _buttons.scss) a través de los
 * átomos, así que ya no se declaran acá.
 */
.lead-form {
  font-family: var(--ds-font-family-base);
  color: var(--ds-color-text-secondary);
  background: var(--ds-color-background-default);
  border: var(--ds-border-width-sm) solid var(--ds-color-border-subtle);
  /* Esquinas casi rectas, como el diseño: 4px y no los 16px de --ds-radius-md. */
  border-radius: var(--ds-radius-xs);
  /*
   * Relleno propio de la tarjeta, igual por los cuatro lados. No usa
   * --ds-container-padding-x: ese token es el relleno lateral de la página y
   * vale 0 desde 1300px, lo que dejaba los campos pegados al borde.
   */
  padding: var(--ds-spacing-md);
  box-shadow: var(--ds-shadow-md);
  /*
   * Ritmo vertical común a todos los bloques (ver
   * assets/styles/section-rhythm.scss). Margen y no relleno: es una tarjeta con
   * borde y sombra, y el relleno la agrandaría en vez de separarla. Además la
   * sombra necesita ese aire para no quedar cortada contra el bloque vecino.
   */
  margin-block: var(--ds-spacing-xxl);
}

.lead-form__header {
  margin-bottom: var(--ds-spacing-sm);
}

.lead-form__title {
  margin: 0 0 var(--ds-spacing-xxs) 0;
}

.lead-form__subtitle {
  margin: 0;
}

/* El grupo del sistema trae ancho máximo propio; acá cada campo llena su columna. */
.lead-form :deep(.form-group) {
  max-width: none;
}

/*
 * Campos compactos: sin etiqueta encima, el texto va dentro del campo, así que
 * se baja a 14px y el relleno vertical a 8px (unos 36px de alto). A tamaño
 * normal (16px, 46px de alto) el formulario quedaba largo y pesado para una
 * tarjeta que flota sobre el contenido. Con las esquinas pasa igual: 4px.
 */
.lead-form :deep(.form-input),
.lead-form :deep(.form-select.form-select--arcis) {
  padding-block: var(--ds-space-2);
  font-size: var(--ds-text-body-compact);
  /* Igual que la tarjeta: 4px, no los 8px de --ds-radius-sm. */
  border-radius: var(--ds-radius-xs);
}

/*
 * Dos columnas siempre. Un campo de media fila (col_span 6, que es lo que trae
 * la configuración por defecto) ocupa una; uno de fila completa (col_span 12),
 * las dos. Sin etiquetas encima, el hueco entre campos es corto y parejo.
 */
.lead-form__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ds-space-3);
}

.lead-form__field {
  min-width: 0;
}

.lead-form__field--full,
.lead-form__row {
  grid-column: 1 / -1;
}

.lead-form__legal {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
  /* Un respiro entre los campos y las cláusulas. */
  margin-top: var(--ds-space-1);
  font-size: var(--ds-text-body-sm);
}

.lead-form__actions {
  margin-top: var(--ds-space-1);
}

/* En la cláusula legal el enlace lleva el color del texto, subrayado (así se ve en el diseño). */
.lead-form__link {
  color: inherit;
  text-decoration: underline;
}

.lead-form__submit {
  width: 100%;
}

.lead-form__recaptcha {
  margin-bottom: 0;
}
</style>

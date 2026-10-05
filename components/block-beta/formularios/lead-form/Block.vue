<template>
  <div class="lead-form">
    <div class="lead-form__header">
      <AtomHeading :level="3" size="h3" class="lead-form__title" v-bind="edit('mainTitle')">{{ cfg.mainTitle }}</AtomHeading>
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

      <div class="row g-3" v-bind="edit('campaign_id')">
        <!-- Render dinámico total del esquema configurado en la campaña -->
        <template v-for="(field, idx) in activeFields" :key="field.name || idx">
          <div :class="field.col_span === 12 ? 'col-12' : 'col-12 col-md-6'">
            <!--
              Cada campo es un MoleculeFormField: él pone la etiqueta (con el
              asterisco rojo si es obligatorio), el control que toque según el
              tipo y el hueco del texto de ayuda. Antes esto era markup propio
              con clases .arcis-* que repetían el sistema de diseño a mano.
            -->
            <MoleculeFormField
              :as="field.type === 'select' ? 'select' : field.type === 'textarea' ? 'textarea' : 'input'"
              :type="resolveFieldType(field)"
              :id="'lead-' + (field.name || idx)"
              :label="field.label"
              :placeholder="resolvePlaceholder(field)"
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
        <div class="col-12 mt-3 lead-form__legal">
          <AtomFormCheck id="legal_cond" v-model="aceptaCondiciones" multiline required>
            <span>
              Acepto las
              <!--
                El enlace vive dentro de la etiqueta: sin parar el clic, abriría
                el enlace Y marcaría la casilla a la vez.
              -->
              <a :href="cfg.condition" target="_blank" rel="noopener" class="lead-form__link" @click.stop>condiciones de tratamiento de mis datos personales</a>.
            </span>
          </AtomFormCheck>

          <AtomFormCheck id="legal_pub" v-model="aceptaPublicidad" multiline>
            <span>
              Autorizo el envío de información sobre programas académicos y actividades
              institucionales de ESAN.
            </span>
          </AtomFormCheck>
        </div>

        <!-- Botón de envío -->
        <div class="col-12 mt-4">
          <AtomButton
            variant="primary"
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
        <div class="col-12 mt-3">
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
  resolvePlaceholder,
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
  border-radius: var(--ds-radius-md);
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

.lead-form__legal {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-xxs);
  font-size: var(--ds-text-body-sm);
}

.lead-form__link {
  color: var(--ds-color-text-brand);
  text-decoration: underline;
}

.lead-form__submit {
  width: 100%;
}

.lead-form__recaptcha {
  margin-bottom: 0;
}
</style>

<template>
  <div class="arcis-lead-wrapper">
    <div class="arcis-form-header mb-4">
      <h3 class="arcis-form-title">{{ cfg.mainTitle }}</h3>
      <p v-if="cfg.subTitle" class="arcis-form-subtitle">{{ cfg.subTitle }}</p>
    </div>

    <form @submit.prevent="submit" class="arcis-lead-form">
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

      <div class="row g-3">
        <!-- Render dinámico total del esquema configurado en la campaña -->
        <template v-for="(field, idx) in activeFields" :key="field.name || idx">
          <div :class="field.col_span === 12 ? 'col-12' : 'col-12 col-md-6'">
            <label class="arcis-label">
              {{ field.label }} <span v-if="field.required" class="arcis-required">*</span>
            </label>

            <!-- 1. Selects (Tipo Doc, Carreras, Sedes) -->
            <select
              v-if="field.type === 'select'"
              v-model="formValues[field.name]"
              class="arcis-select"
              :required="field.required"
            >
              <option value="" disabled>{{ field.placeholder || '-- Seleccionar --' }}</option>
              <option v-for="(opt, optIdx) in field.options" :key="optIdx" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>

            <!-- 2. Textarea (Consultas, Comentarios) -->
            <textarea
              v-else-if="field.type === 'textarea'"
              v-model="formValues[field.name]"
              class="arcis-textarea"
              :placeholder="field.placeholder"
              :required="field.required"
              rows="3"
            ></textarea>

            <!-- 3. Controles Estándar (text, email, tel, date, number) -->
            <input
              v-else
              :type="field.type"
              v-model="formValues[field.name]"
              class="arcis-input"
              :placeholder="field.placeholder"
              :required="field.required"
              @input="sanitizeField(field.name, field.type)"
            />
          </div>
        </template>

        <!-- Checkboxes Legales ARCIS -->
        <div class="col-12 mt-3">
          <div class="arcis-checkbox-group">
            <input 
              type="checkbox" 
              id="legal_cond" 
              v-model="aceptaCondiciones" 
              class="arcis-checkbox"
              required 
            />
            <label for="legal_cond" class="arcis-checkbox-label">
              Acepto las <a :href="cfg.condition" target="_blank" class="arcis-link">condiciones de tratamiento de mis datos personales</a>.
            </label>
          </div>

          <div class="arcis-checkbox-group mt-2">
            <input 
              type="checkbox" 
              id="legal_pub" 
              v-model="aceptaPublicidad" 
              class="arcis-checkbox" 
            />
            <label for="legal_pub" class="arcis-checkbox-label">
              Autorizo el envío de información sobre programas académicos y actividades institucionales de ESAN.
            </label>
          </div>
        </div>

        <!-- Botón de Envío -->
        <div class="col-12 mt-4">
          <button type="submit" class="arcis-btn-submit" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ isSubmitting ? 'PROCESANDO...' : cfg.button_text }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useDynamicLeadForm, type DynamicLeadFormProps } from './composables/useDynamicLeadForm';

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
  submit,
} = useDynamicLeadForm(props);
</script>

<style scoped>
.arcis-lead-wrapper {
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

.arcis-form-title {
  font-family: var(--ds-font-family-display);
  font-size: var(--ds-text-h3);
  font-weight: var(--ds-weight-bold);
  color: var(--ds-color-text-primary);
  margin: 0 0 var(--ds-spacing-xxs) 0;
  line-height: 1.2;
}

.arcis-form-subtitle {
  font-size: var(--ds-text-body-compact);
  color: var(--ds-color-text-secondary);
  margin: 0;
}

.arcis-label {
  display: block;
  font-size: var(--ds-text-body-sm);
  font-weight: var(--ds-weight-semibold);
  color: var(--ds-color-text-secondary);
  margin-bottom: var(--ds-space-1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.arcis-required {
  color: var(--ds-color-text-brand);
}

.arcis-input,
.arcis-select,
.arcis-textarea {
  width: 100%;
  padding: 10px 14px;
  font-size: var(--ds-text-body-compact);
  font-family: var(--ds-font-family-base);
  color: var(--ds-color-text-primary);
  background-color: var(--ds-color-background-light);
  border: var(--ds-border-width-sm) solid var(--ds-color-border-subtle);
  border-radius: var(--ds-radius-sm);
  transition: border-color var(--ds-ease-base), background-color var(--ds-ease-base);
}

.arcis-input:focus,
.arcis-select:focus,
.arcis-textarea:focus {
  outline: none;
  background-color: var(--ds-color-background-default);
  border-color: var(--ds-color-border-focus);
  box-shadow: 0 0 0 3px rgba(227, 23, 62, 0.15);
}

.arcis-checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: var(--ds-spacing-xxs);
}

.arcis-checkbox {
  margin-top: 3px;
  accent-color: var(--ds-color-action-primary);
  width: 16px;
  height: 16px;
}

.arcis-checkbox-label {
  font-size: var(--ds-text-body-sm);
  line-height: 1.4;
  color: var(--ds-color-text-secondary);
}

.arcis-link {
  color: var(--ds-color-text-brand);
  text-decoration: underline;
}

.arcis-btn-submit {
  width: 100%;
  background-color: var(--ds-color-action-primary);
  color: var(--ds-color-text-inverse);
  border: none;
  border-radius: var(--ds-radius-sm);
  padding: 12px 24px;
  font-size: var(--ds-text-body-compact);
  font-weight: var(--ds-weight-bold);
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: var(--ds-shadow-sm);
  transition: background-color var(--ds-ease-fast), transform var(--ds-ease-fast);
}

.arcis-btn-submit:hover:not(:disabled) {
  background-color: var(--ds-color-action-primary-hover);
  transform: translateY(-1px);
}

.arcis-btn-submit:disabled {
  background-color: var(--ds-color-background-blend);
  cursor: not-allowed;
}
</style>
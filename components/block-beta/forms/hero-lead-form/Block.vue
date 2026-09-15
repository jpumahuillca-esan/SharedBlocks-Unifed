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
  font-family: var(--font-body, 'Inter', sans-serif);
  color: var(--arcis-color-text-secondary, #333333);
  background: var(--neutrals-0, #FFFFFF);
  border: var(--border-width-sm, 1px) solid var(--neutrals-300, #E0E0E0);
  border-radius: var(--radius-md, 16px);
  padding: var(--space-6, 32px);
  box-shadow: var(--shadow-md, 0 8px 32px rgba(0, 0, 0, 0.10));
}

.arcis-form-title {
  font-family: var(--font-display, 'Bricolage Grotesque', sans-serif);
  font-size: var(--text-h3, 24px);
  font-weight: var(--weight-bold, 700);
  color: var(--arcis-color-text-primary, #000000);
  margin: 0 0 var(--space-2, 8px) 0;
  line-height: 1.2;
}

.arcis-form-subtitle {
  font-size: var(--text-sm, 14px);
  color: var(--neutrals-600, #757575);
  margin: 0;
}

.arcis-label {
  display: block;
  font-size: var(--text-xs, 12px);
  font-weight: var(--weight-semibold, 600);
  color: var(--arcis-color-text-secondary, #333333);
  margin-bottom: var(--space-1, 4px);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.arcis-required {
  color: var(--arcis-color-global-main, #E3173E);
}

.arcis-input,
.arcis-select,
.arcis-textarea {
  width: 100%;
  padding: 10px 14px;
  font-size: var(--text-sm, 14px);
  font-family: var(--font-body, 'Inter', sans-serif);
  color: var(--arcis-color-text-primary, #000000);
  background-color: var(--neutrals-50, #FAFAFA);
  border: var(--border-width-sm, 1px) solid var(--neutrals-300, #E0E0E0);
  border-radius: var(--radius-sm, 8px);
  transition: border-color var(--ease-base, 250ms ease), background-color var(--ease-base, 250ms ease);
}

.arcis-input:focus,
.arcis-select:focus,
.arcis-textarea:focus {
  outline: none;
  background-color: var(--neutrals-0, #FFFFFF);
  border-color: var(--arcis-color-global-main, #E3173E);
  box-shadow: 0 0 0 3px rgba(227, 23, 62, 0.15);
}

.arcis-checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2, 8px);
}

.arcis-checkbox {
  margin-top: 3px;
  accent-color: var(--arcis-color-global-main, #E3173E);
  width: 16px;
  height: 16px;
}

.arcis-checkbox-label {
  font-size: var(--text-xs, 12px);
  line-height: 1.4;
  color: var(--neutrals-700, #616161);
}

.arcis-link {
  color: var(--arcis-color-global-main, #E3173E);
  text-decoration: underline;
}

.arcis-btn-submit {
  width: 100%;
  background-color: var(--arcis-color-global-main, #E3173E);
  color: var(--arcis-color-text-inverse, #FFFFFF);
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 12px 24px;
  font-size: var(--text-sm, 14px);
  font-weight: var(--weight-bold, 700);
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: var(--shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.06));
  transition: background-color var(--ease-fast, 150ms ease), transform var(--ease-fast, 150ms ease);
}

.arcis-btn-submit:hover:not(:disabled) {
  background-color: var(--arcis-color-global-dark, #AE0800);
  transform: translateY(-1px);
}

.arcis-btn-submit:disabled {
  background-color: var(--neutrals-400, #BDBDBD);
  cursor: not-allowed;
}
</style>
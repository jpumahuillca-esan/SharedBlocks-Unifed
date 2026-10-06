<template>
  <div class="chatbot-lead-container custom-scroll">
    <div class="lead-form-header">
      <div class="lead-form-icon">
        <i class="las la-user-check"></i>
      </div>
      <h6 class="fw-bold mb-1 fs-14 text-dark">¿Deseas recibir información?</h6>
      <p class="text-muted fs-12 mb-0">
        Déjanos tus datos de contacto y un asesor de la Universidad ESAN te enviará información detallada.
      </p>
    </div>

    <form class="lead-form-body" @submit.prevent="$emit('submit')">
      <!-- Nombres y Apellidos en dos columnas -->
      <div class="row g-2 mb-2">
        <div class="col-6">
          <label class="form-label fs-11 fw-semibold text-dark mb-1">Nombres *</label>
          <input
            v-model="leadForm.firstName"
            type="text"
            class="form-control form-control-sm custom-lead-input"
            placeholder="Ej: Juan"
            required
          />
        </div>
        <div class="col-6">
          <label class="form-label fs-11 fw-semibold text-dark mb-1">Apellidos *</label>
          <input
            v-model="leadForm.lastName"
            type="text"
            class="form-control form-control-sm custom-lead-input"
            placeholder="Ej: Pérez"
            required
          />
        </div>
      </div>

      <!-- Documento de Identidad -->
      <div class="row g-2 mb-2">
        <div class="col-5">
          <label class="form-label fs-11 fw-semibold text-dark mb-1">Tipo Doc. *</label>
          <select v-model="leadForm.documentType" class="form-select form-select-sm custom-lead-input">
            <option value="dni">DNI</option>
            <option value="ce">C.E.</option>
            <option value="passport">Pasaporte</option>
          </select>
        </div>
        <div class="col-7">
          <label class="form-label fs-11 fw-semibold text-dark mb-1">N° de Documento *</label>
          <input
            v-model="leadForm.documentNumber"
            type="text"
            class="form-control form-control-sm custom-lead-input"
            :maxlength="leadForm.documentType === 'dni' ? 8 : 20"
            :placeholder="leadForm.documentType === 'dni' ? '8 dígitos' : 'N° documento'"
            required
          />
        </div>
      </div>

      <div class="form-group mb-2">
        <label class="form-label fs-11 fw-semibold text-dark mb-1">Correo Electrónico *</label>
        <input
          v-model="leadForm.email"
          type="email"
          class="form-control form-control-sm custom-lead-input"
          placeholder="correo@ejemplo.com"
          required
        />
      </div>

      <div class="form-group mb-2">
        <label class="form-label fs-11 fw-semibold text-dark mb-1">Teléfono o WhatsApp *</label>
        <input
          v-model="leadForm.phone"
          type="tel"
          class="form-control form-control-sm custom-lead-input"
          placeholder="999 888 777"
          required
        />
      </div>

      <div class="form-group mb-2">
        <label class="form-label fs-11 fw-semibold text-dark mb-1">
          Programa o Facultad de interés <span class="text-muted fw-normal">(Opcional)</span>
        </label>
        <input
          v-model="leadForm.program"
          type="text"
          class="form-control form-control-sm custom-lead-input"
          placeholder="Ej: Pregrado, MBA, DPA o Información General"
        />
      </div>

      <div class="form-group mb-3">
        <label class="form-label fs-11 fw-semibold text-dark mb-1">
          Consulta o Mensaje <span class="text-muted fw-normal">(Opcional)</span>
        </label>
        <textarea
          v-model="leadForm.notes"
          rows="2"
          class="form-control form-control-sm custom-lead-input"
          placeholder="¿Deseas información o el brochure de algún programa?"
        ></textarea>
      </div>

      <div v-if="error" class="alert alert-danger p-2 fs-11 mb-2">
        {{ error }}
      </div>

      <div class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-sm btn-light flex-1"
          @click="$emit('back-to-chat')"
          :disabled="isSubmitting"
        >
          Volver al chat
        </button>
        <button
          type="submit"
          class="btn btn-sm btn-esan-primary flex-1"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Enviando...</span>
          <span v-else><i class="las la-paper-plane me-1"></i> Enviar datos</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { LeadFormData } from '../../../composables/useChatbot';

defineProps<{
  leadForm: LeadFormData;
  isSubmitting: boolean;
  error?: string;
}>();

defineEmits<{
  (e: 'submit'): void;
  (e: 'back-to-chat'): void;
}>();
</script>

<style scoped>
.chatbot-lead-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #ffffff;
}

.lead-form-header {
  text-align: center;
  margin-bottom: 12px;
}

.lead-form-icon {
  width: 40px;
  height: 40px;
  background: #fff1f2;
  color: #e31140;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 6px;
}

.custom-lead-input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.8rem;
  padding: 6px 10px;
  box-sizing: border-box;
}

.custom-lead-input:focus {
  border-color: #e31140;
  box-shadow: 0 0 0 2px rgba(227, 17, 64, 0.15);
  outline: none;
}

.form-label {
  display: block;
}

.btn-esan-primary {
  background: #e31140;
  color: #ffffff;
  border: none;
  font-weight: 600;
  transition: background 0.2s ease;
}

.btn-esan-primary:hover:not(:disabled) {
  background: #c20b32;
  color: #ffffff;
}

.flex-1 {
  flex: 1;
}

.custom-scroll::-webkit-scrollbar {
  width: 4px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #fca5a5;
  border-radius: 4px;
}
</style>

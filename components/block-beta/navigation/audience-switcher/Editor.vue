<template>
  <div class="audience-switcher-editor">
    <div class="mb-3">
      <label class="form-label fw-bold">Título del bloque</label>
      <input
        v-model="model.title"
        type="text"
        class="form-control"
        placeholder="¿En qué momento estás?"
      />
    </div>

    <div class="mb-3">
      <label class="form-label fw-bold">Tarjetas de navegación</label>
      <div
        v-for="(card, i) in model.cards"
        :key="card.id || i"
        class="border rounded p-3 mb-2 bg-light"
      >
        <div class="d-flex justify-content-between align-items-center mb-2">
          <strong>Tarjeta {{ i + 1 }}</strong>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger"
            @click="removeCard(i)"
          >
            <i class="las la-trash"></i>
          </button>
        </div>

        <div class="mb-2">
          <label class="form-label form-label-sm">Título</label>
          <input v-model="card.title" type="text" class="form-control form-control-sm" />
        </div>

        <div class="mb-2">
          <label class="form-label form-label-sm">Descripción</label>
          <textarea v-model="card.desc" class="form-control form-control-sm" rows="2"></textarea>
        </div>

        <div class="mb-2">
          <label class="form-label form-label-sm">URL de Imagen</label>
          <input v-model="card.image" type="text" class="form-control form-control-sm" />
        </div>

        <div class="mb-2">
          <label class="form-label form-label-sm">Enlace (href)</label>
          <input v-model="card.href" type="text" class="form-control form-control-sm" placeholder="#pregrado" />
        </div>
      </div>

      <button
        type="button"
        class="btn btn-sm btn-outline-primary w-100 mt-2"
        @click="addCard"
      >
        <i class="las la-plus me-1"></i> Añadir Tarjeta
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { AudienceSwitcherData, AudienceCardItem } from './shared/types';

const props = defineProps<{
  modelValue: AudienceSwitcherData;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: AudienceSwitcherData): void;
}>();

const model = computed({
  get: () => props.modelValue || {},
  set: (val) => emit('update:modelValue', val),
});

if (!Array.isArray(model.value.cards)) {
  model.value.cards = [];
}

const addCard = () => {
  const newCard: AudienceCardItem = {
    id: `as-${Date.now()}`,
    title: 'Nueva opción',
    desc: 'Descripción de la opción',
    image: '',
    href: '#',
    target: '_self',
  };
  model.value.cards.push(newCard);
};

const removeCard = (idx: number) => {
  model.value.cards.splice(idx, 1);
};
</script>


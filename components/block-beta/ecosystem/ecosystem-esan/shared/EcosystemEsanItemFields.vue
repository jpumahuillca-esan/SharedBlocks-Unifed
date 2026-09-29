<template>
  <div>
    <label class="form-label">
      Título
    </label>

    <input
      v-model="item.title"
      type="text"
      class="form-control form-control-sm mb-2"
      placeholder="ESAN Management"
    />

    <label class="form-label">
      Descripción
    </label>

    <p class="eesf-hint">
      Opcional. Si queda vacía no se mostrará.
    </p>

    <textarea
      v-model="item.desc"
      class="form-control form-control-sm mb-3"
      rows="2"
      placeholder="Carreras de ciencias administrativas"
    ></textarea>

    <BrandColorPicker
      v-model="item.colorToken"
      class="mb-3"
    />

    <label class="form-label">
      Imagen
    </label>

    <div class="eesf-image-preview mb-2">
      <img
        v-if="item.image"
        :src="item.image"
        alt=""
      />

      <span
        v-else
        class="text-muted small"
      >
        Sin imagen
      </span>
    </div>

    <div class="d-flex gap-2 mb-2">
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary flex-grow-1"
        @click="
          $emit(
            'select-image',
            {
              item,
              field: 'image',
            },
          )
        "
      >
        <i class="las la-image me-1"></i>

        {{
          item.image
            ? 'Cambiar imagen'
            : 'Subir imagen'
        }}
      </button>

      <button
        v-if="item.image"
        type="button"
        class="btn btn-sm btn-outline-danger"
        title="Quitar imagen"
        @click="removeImage"
      >
        <i class="las la-trash"></i>
      </button>
    </div>

    <label class="form-label">
      Texto alternativo
    </label>

    <input
      v-model="item.imageAlt"
      type="text"
      class="form-control form-control-sm mb-3"
      placeholder="Describe brevemente la imagen"
    />

    <label class="form-label">
      Destino de la tarjeta
    </label>

    <input
      v-model="item.href"
      type="text"
      class="form-control form-control-sm mb-3"
      placeholder="/ruta o https://"
    />

    <hr />

    <div
      class="d-flex align-items-center justify-content-between mb-1"
    >
      <h6
        class="fw-bold small text-uppercase m-0"
      >
        Carreras / enlaces
      </h6>

      <span class="badge bg-secondary">
        {{ item.links.length }}
      </span>
    </div>

    <p class="eesf-hint">
      Puedes agregar todos los enlaces que necesite esta categoría.
    </p>

    <div
      v-for="(link, index) in item.links"
      :key="link.id"
      class="eesf-link"
    >
      <div
        class="d-flex align-items-center justify-content-between mb-2"
      >
        <strong class="small">
          Enlace {{ number(index) + 1 }}
        </strong>

        <div class="btn-group btn-group-sm">
          <button
            type="button"
            class="btn btn-outline-secondary"
            title="Subir"
            :disabled="index === 0"
            @click="
              moveLink(
                index,
                -1,
              )
            "
          >
            <i class="las la-arrow-up"></i>
          </button>

          <button
            type="button"
            class="btn btn-outline-secondary"
            title="Bajar"
            :disabled="
              index ===
              item.links.length - 1
            "
            @click="
              moveLink(
                index,
                1,
              )
            "
          >
            <i class="las la-arrow-down"></i>
          </button>

          <button
            type="button"
            class="btn btn-outline-danger"
            title="Quitar enlace"
            @click="
              removeLink(index)
            "
          >
            <i class="las la-trash"></i>
          </button>
        </div>
      </div>

      <label class="form-label">
        Texto
      </label>

      <input
        v-model="link.label"
        type="text"
        class="form-control form-control-sm mb-2"
        placeholder="Administración y Finanzas"
      />

      <label class="form-label">
        Destino
      </label>

      <input
        v-model="link.href"
        type="text"
        class="form-control form-control-sm"
        placeholder="/ruta o https://"
      />
    </div>

    <button
      type="button"
      class="btn btn-sm btn-outline-secondary w-100"
      @click="addLink"
    >
      <i class="las la-plus me-1"></i>

      Agregar carrera / enlace
    </button>
  </div>
</template>

<script setup lang="ts">
import BrandColorPicker from '../../../_shared/BrandColorPicker.vue';

import {
  newEcosystemEsanLinkId,
  type EcosystemEsanItem,
} from './types';

const props = defineProps<{
  item: EcosystemEsanItem;
}>();

defineEmits([
  'select-image',
]);

const addLink = () => {
  props.item.links.push({
    id:
      newEcosystemEsanLinkId(),

    label: '',
    href: '',
  });
};

const removeLink = (
  index: number,
) => {
  props.item.links.splice(
    index,
    1,
  );
};

const moveLink = (
  index: number,
  delta: number,
) => {
  const target =
    index + delta;

  const list =
    props.item.links;

  if (
    target < 0 ||
    target >= list.length
  ) {
    return;
  }

  [
    list[index],
    list[target],
  ] = [
    list[target],
    list[index],
  ];
};

const removeImage = () => {
  props.item.image = '';
  props.item.imageAlt = '';
};
</script>

<style scoped>
.eesf-hint {
  margin: 0 0 6px;

  color: #6b7688;

  font-size: 11.5px;
  line-height: 1.45;
}

.eesf-image-preview {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100px;

  overflow: hidden;

  border: 1px dashed #c6cedb;
  border-radius: 7px;

  background: #f4f6fa;
}

.eesf-image-preview img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.eesf-link {
  margin-bottom: 10px;

  padding: 10px;

  border:
    1px solid #dde3ec;

  border-radius: 7px;

  background: #f8f9fb;
}
</style>
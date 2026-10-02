<template>
  <div class="ees-editor">
    <!-- ================================================================
         Encabezado
         ================================================================ -->

    <h6 class="fw-bold small text-uppercase mb-2">
      Encabezado
    </h6>

    <label class="form-label">
      Título
    </label>

    <textarea
      v-model="localData.title"
      data-edit-target="title"
      class="form-control form-control-sm mb-1"
      rows="2"
      :maxlength="rules.title.maxLength"
      placeholder="En ESAN University conviertes tu talento en oportunidades"
    ></textarea>

    <div class="ees-limit mb-3">
      <span>
        Máximo {{ rules.title.maxLength }} caracteres.
      </span>

      <span class="ees-limit__counter">
        {{ localData.title.length }}/{{ rules.title.maxLength }}
      </span>
    </div>

    <label class="form-label">
      Descripción
    </label>

    <textarea
      v-model="localData.desc"
      data-edit-target="desc"
      class="form-control form-control-sm mb-1"
      rows="3"
      :maxlength="rules.desc.maxLength"
      placeholder="Encuentra la carrera que se adapte a tu vocación"
    ></textarea>

    <div class="ees-limit mb-3">
      <span>
        Máximo {{ rules.desc.maxLength }} caracteres.
      </span>

      <span class="ees-limit__counter">
        {{ localData.desc.length }}/{{ rules.desc.maxLength }}
      </span>
    </div>

    <hr />

    <!-- ================================================================
         Distribución
         ================================================================ -->

    <h6 class="fw-bold small text-uppercase mb-1">
      Distribución
    </h6>

    <p class="ees-hint">
      El diseño contempla actualmente composiciones de tres o cuatro columnas.
    </p>

    <label class="form-label">
      Columnas
    </label>

    <select
      v-model.number="localData.columns"
      data-edit-target="columns"
      class="form-select form-select-sm mb-3"
    >
      <option :value="3">
        3 columnas
      </option>

      <option :value="4">
        4 columnas
      </option>
    </select>

    <hr />

    <!-- ================================================================
         Categorías
         ================================================================ -->

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">
        Categorías
      </h6>

      <span class="badge bg-secondary">
        {{ localData.items.length }}
      </span>
    </div>

    <p class="ees-hint">
      Cada categoría contiene una tarjeta y su propia lista de carreras o enlaces.
    </p>

    <CardAccordionItem
      v-for="(item, index) in localData.items"
      :edit-key="`items.${index}`"
      :key="item.id"
      :title="item.title || `Categoría ${index + 1}`"
      :index="index"
      :total="localData.items.length"
      :open="openIndex === index"
      remove-label="Quitar categoría"
      @toggle="toggle(index)"
      @move="moveItem(index, $event)"
      @remove="removeItem(index)"
    >
      <div>
        <!-- ============================================================
             Título del card
             ============================================================ -->

        <label class="form-label">
          Título
        </label>

        <input
          v-model="item.title"
          data-edit-target=".title"
          type="text"
          class="form-control form-control-sm mb-1"
          :maxlength="rules.card.title.maxLength"
          placeholder="ESAN Management"
        />

        <div class="ees-limit mb-3">
          <span>
            Máximo {{ rules.card.title.maxLength }} caracteres.
          </span>

          <span class="ees-limit__counter">
            {{ item.title.length }}/{{ rules.card.title.maxLength }}
          </span>
        </div>

        <!-- ============================================================
             Descripción del card
             ============================================================ -->

        <label class="form-label">
          Descripción
        </label>

        <textarea
          v-model="item.desc"
          data-edit-target=".desc"
          class="form-control form-control-sm mb-1"
          rows="3"
          :maxlength="rules.card.desc.maxLength"
          placeholder="Carreras de ciencias administrativas"
        ></textarea>

        <div class="ees-limit mb-3">
          <span>
            Máximo {{ rules.card.desc.maxLength }} caracteres.
          </span>

          <span class="ees-limit__counter">
            {{ item.desc.length }}/{{ rules.card.desc.maxLength }}
          </span>
        </div>

        <!-- ============================================================
             Color institucional
             ============================================================ -->

        <BrandColorPicker
          v-model="item.colorToken"
          data-edit-target=".colorToken"
          class="mb-3"
        />

        <!-- ============================================================
             Imagen
             ============================================================ -->

        <label class="form-label">
          Imagen
        </label>

        <EcosystemEsanImageFocus
          v-if="item.image"
          :image="item.image"
          v-model:focus-x="item.imageFocusX"
          v-model:focus-y="item.imageFocusY"
          class="mb-2"
        />

        <div v-else class="ees-image-preview mb-2">
          <button
            type="button"
            class="ees-image-empty"
            data-edit-target=".image"
            @click="selectImage(item)"
          >
            <span class="ees-image-empty__icon">
              <i class="las la-image"></i>
            </span>

            <strong>
              Selecciona una imagen
            </strong>

            <span>
              Haz clic para elegir una imagen para este card.
            </span>
          </button>
        </div>

        <p class="ees-hint mb-2">
          Referencia web: 410 × 155 px. Para pantallas de alta densidad, usa
          820 × 310 px o más. En móvil se recorta en vertical; ajusta el punto
          focal para mantener visible lo importante.
        </p>

        <div
          v-if="item.image"
          class="d-flex gap-2 mb-2"
        >
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary flex-grow-1"
            data-edit-target=".image"
            @click="selectImage(item)"
          >
            <i class="las la-image me-1"></i>
            Cambiar imagen
          </button>

          <button
            type="button"
            class="btn btn-sm btn-outline-danger"
            title="Quitar imagen"
            @click="removeImage(item)"
          >
            <i class="las la-trash"></i>
          </button>
        </div>

        <!-- ============================================================
             Texto alternativo
             ============================================================ -->

        <label class="form-label">
          Texto alternativo
        </label>

        <input
          v-model="item.imageAlt"
          data-edit-target=".imageAlt"
          type="text"
          class="form-control form-control-sm mb-1"
          :maxlength="rules.card.imageAlt.maxLength"
          placeholder="Describe brevemente la imagen"
        />

        <div class="ees-limit mb-3">
          <span>
            Máximo {{ rules.card.imageAlt.maxLength }} caracteres.
          </span>

          <span class="ees-limit__counter">
            {{ item.imageAlt.length }}/{{ rules.card.imageAlt.maxLength }}
          </span>
        </div>

        <!-- ============================================================
             Destino del card
             ============================================================ -->

        <label class="form-label">
          Destino de la tarjeta
        </label>

        <input
          v-model="item.href"
          data-edit-target=".href"
          type="text"
          class="form-control form-control-sm mb-3"
          :maxlength="rules.card.href.maxLength"
          placeholder="/ruta o https://"
        />

        <hr />

        <!-- ============================================================
             Carreras / enlaces
             ============================================================ -->

        <div class="d-flex align-items-center justify-content-between mb-1">
          <h6 class="fw-bold small text-uppercase m-0">
            Carreras / enlaces
          </h6>

          <span class="badge bg-secondary">
            {{ item.links.length }}
          </span>
        </div>

        <p class="ees-hint">
          Puedes agregar todos los enlaces que necesite esta categoría.
        </p>

        <div
          v-for="(link, linkIndex) in item.links"
          :data-edit-target="`.links.${linkIndex}`"
          :key="link.id"
          class="ees-link-card"
        >
          <div class="d-flex align-items-center justify-content-between mb-2">
            <strong class="small">
              Enlace {{ linkIndex + 1 }}
            </strong>

            <div class="btn-group btn-group-sm">
              <button
                type="button"
                class="btn btn-outline-secondary"
                title="Mover arriba"
                :disabled="linkIndex === 0"
                @click="moveLink(item, linkIndex, -1)"
              >
                <i class="las la-arrow-up"></i>
              </button>

              <button
                type="button"
                class="btn btn-outline-secondary"
                title="Mover abajo"
                :disabled="linkIndex === item.links.length - 1"
                @click="moveLink(item, linkIndex, 1)"
              >
                <i class="las la-arrow-down"></i>
              </button>

              <button
                type="button"
                class="btn btn-outline-danger"
                title="Quitar enlace"
                @click="removeLink(item, linkIndex)"
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
            data-edit-target=".label"
            type="text"
            class="form-control form-control-sm mb-1"
            :maxlength="rules.link.label.maxLength"
            placeholder="Administración y Finanzas"
          />

          <div class="ees-limit mb-3">
            <span>
              Máximo {{ rules.link.label.maxLength }} caracteres.
            </span>

            <span class="ees-limit__counter">
              {{ link.label.length }}/{{ rules.link.label.maxLength }}
            </span>
          </div>

          <label class="form-label">
            Destino
          </label>

          <input
            v-model="link.href"
            data-edit-target=".href"
            type="text"
            class="form-control form-control-sm"
            :maxlength="rules.link.href.maxLength"
            placeholder="/ruta o https://"
          />
        </div>

        <button
          type="button"
          class="btn btn-sm btn-outline-secondary w-100"
          @click="addLink(item)"
        >
          <i class="las la-plus me-1"></i>
          Agregar carrera / enlace
        </button>
      </div>
    </CardAccordionItem>

    <!-- ================================================================
         Agregar categoría
         ================================================================ -->

    <button
      type="button"
      class="btn btn-sm btn-danger w-100 mt-2"
      @click="addItem"
    >
      <i class="las la-plus me-1"></i>
      Agregar categoría
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
} from 'vue';

import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import BrandColorPicker from '../../_shared/BrandColorPicker.vue';
import EcosystemEsanImageFocus from './shared/EcosystemEsanImageFocus.vue';

import {
  newEcosystemCardId,
  newEcosystemEsanLinkId,
  normalizeEcosystemEsanData,
  normalizeEcosystemEsanItem,
  type EcosystemEsanData,
  type EcosystemEsanItem,
} from './shared/types';

import {
  ECOSYSTEM_ESAN_CONTENT_RULES,
} from './shared/rules';

const props = defineProps<{
  modelValue: any;

  availableSections?: Array<{
    id: string;
    title: string;
  }>;
}>();

const emit = defineEmits([
  'update:modelValue',
  'select-image',
]);

const rules =
  ECOSYSTEM_ESAN_CONTENT_RULES;

/* ==========================================================================
   Colores iniciales
   ========================================================================== */

const COLOR_SEQUENCE = [
  '--ds-color-univ-management',
  '--ds-color-univ-engineering',
  '--ds-color-univ-economics',
  '--ds-color-univ-law',
  '--ds-color-univ-communications',
  '--ds-color-univ-psychology',
];

/* ==========================================================================
   Build
   ========================================================================== */

const buildItem = (
  source: any,
  index = 0,
): EcosystemEsanItem => {
  const item =
    normalizeEcosystemEsanItem(
      source,
      index,
    );

  if (!source?.id) {
    item.id =
      newEcosystemCardId();
  }

  return item;
};

const build = (
  source: any,
): EcosystemEsanData => {
  const data =
    normalizeEcosystemEsanData(
      source,
    );

  return {
    ...data,

    items: data.items.map(
      (item, index) =>
        buildItem(
          item,
          index,
        ),
    ),
  };
};

/* ==========================================================================
   Estado
   ========================================================================== */

const localData =
  ref<EcosystemEsanData>(
    build(
      props.modelValue,
    ),
  );

const openIndex =
  ref<number | null>(null);

/* ==========================================================================
   Accordion
   ========================================================================== */

const toggle = (
  index: number,
) => {
  openIndex.value =
    openIndex.value === index
      ? null
      : index;
};

/* ==========================================================================
   Categorías
   ========================================================================== */

const addItem = () => {
  const index =
    localData.value.items.length;

  const colorToken =
    COLOR_SEQUENCE[
      index % COLOR_SEQUENCE.length
    ];

  localData.value.items.push(
    buildItem({
      id:
        newEcosystemCardId(),

      title: '',
      desc: '',

      image: '',
      imageAlt: '',
      imageFocusX: 50,
      imageFocusY: 50,

      href: '',

      colorToken,

      links: [],
    }),
  );

  openIndex.value =
    localData.value.items.length - 1;
};

const removeItem = (
  index: number,
) => {
  localData.value.items.splice(
    index,
    1,
  );

  if (
    openIndex.value === index
  ) {
    openIndex.value = null;
  } else if (
    openIndex.value !== null &&
    openIndex.value > index
  ) {
    openIndex.value -= 1;
  }
};

const moveItem = (
  index: number,
  delta: number,
) => {
  const target =
    index + delta;

  const list =
    localData.value.items;

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

  if (
    openIndex.value === index
  ) {
    openIndex.value =
      target;
  } else if (
    openIndex.value === target
  ) {
    openIndex.value =
      index;
  }
};

/* ==========================================================================
   Imagen
   ========================================================================== */

const selectImage = (
  item: EcosystemEsanItem,
) => {
  emit(
    'select-image',
    {
      item,
      field: 'image',
    },
  );
};

const removeImage = (
  item: EcosystemEsanItem,
) => {
  item.image = '';
  item.imageAlt = '';
  item.imageFocusX = 50;
  item.imageFocusY = 50;
};

/* ==========================================================================
   Links
   ========================================================================== */

const addLink = (
  item: EcosystemEsanItem,
) => {
  item.links.push({
    id:
      newEcosystemEsanLinkId(),

    label: '',
    href: '',
  });
};

const removeLink = (
  item: EcosystemEsanItem,
  index: number,
) => {
  item.links.splice(
    index,
    1,
  );
};

const moveLink = (
  item: EcosystemEsanItem,
  index: number,
  delta: number,
) => {
  const target =
    index + delta;

  if (
    target < 0 ||
    target >= item.links.length
  ) {
    return;
  }

  [
    item.links[index],
    item.links[target],
  ] = [
    item.links[target],
    item.links[index],
  ];
};

/* ==========================================================================
   Props -> Editor
   ========================================================================== */

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      return;
    }

    if (
      JSON.stringify(
        newValue,
      ) ===
      JSON.stringify(
        localData.value,
      )
    ) {
      return;
    }

    localData.value =
      build(
        newValue,
      );
  },
  {
    deep: true,
  },
);

/* ==========================================================================
   Editor -> CMS
   ========================================================================== */

watch(
  localData,
  (newValue) => {
    emit(
      'update:modelValue',
      JSON.parse(
        JSON.stringify(
          newValue,
        ),
      ),
    );
  },
  {
    deep: true,
  },
);
</script>

<style scoped>
.ees-hint {
  margin: 0 0 8px;

  color: #6b7688;

  font-size: 11.5px;
  line-height: 1.45;
}

/* ==========================================================================
   Límites de contenido
   ========================================================================== */

.ees-limit {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;

  gap: 12px;

  color: #6b7688;

  font-size: 11.5px;
  line-height: 1.45;
}

.ees-limit__counter {
  flex: 0 0 auto;

  color: #8591a2;

  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  text-align: right;
}

/* ==========================================================================
   Preview de imagen
   ========================================================================== */

.ees-image-preview {
  width: 100%;
  height: 110px;

  overflow: hidden;

  border: 1px dashed #c6cedb;
  border-radius: 7px;

  background: #f4f6fa;
}

.ees-image-preview img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;
}

/*
 * El lienzo vacío existe solamente dentro
 * del área del preview de imagen.
 */
.ees-image-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 4px;

  width: 100%;
  height: 100%;

  padding: 12px;

  border: 0;

  background: transparent;
  color: #6b7688;

  text-align: center;

  cursor: pointer;

  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.ees-image-empty:hover {
  background: #edf1f6;
}

.ees-image-empty__icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 34px;
  height: 34px;

  margin-bottom: 2px;

  border-radius: 7px;

  background: #e3e8ef;

  font-size: 19px;
}

.ees-image-empty strong {
  color: #3e4755;

  font-size: 12px;
  font-weight: 700;
}

.ees-image-empty > span:last-child {
  max-width: 220px;

  font-size: 10.5px;
  line-height: 1.35;
}

/* ==========================================================================
   Links
   ========================================================================== */

.ees-link-card {
  margin-bottom: 10px;
  padding: 10px;

  border: 1px solid #dde3ec;
  border-radius: 7px;

  background: #f8f9fb;
}
</style>

<template>
  <div class="ees-editor">
    <!-- ================================================================
         Encabezado
         ================================================================ -->

    <h6 class="fw-bold small text-uppercase mb-2">
      Encabezado
    </h6>

    <EditorTextarea
      v-model="localData.title"
      data-edit-target="title"
      class="mb-3"
      label="Título"
      :rows="2"
      :maxlength="rules.title.maxLength"
      placeholder="En ESAN University conviertes tu talento en oportunidades"
    />

    <EditorTextarea
      v-model="localData.desc"
      data-edit-target="desc"
      class="mb-3"
      label="Descripción"
      :rows="3"
      :maxlength="rules.desc.maxLength"
      placeholder="Encuentra la carrera que se adapte a tu vocación"
    />

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

        <EditorText
          v-model="item.title"
          data-edit-target=".title"
          class="mb-3"
          label="Título"
          :maxlength="rules.card.title.maxLength"
          placeholder="ESAN Management"
        />

        <!-- ============================================================
             Descripción del card
             ============================================================ -->

        <EditorTextarea
          v-model="item.desc"
          data-edit-target=".desc"
          class="mb-3"
          label="Descripción"
          :rows="3"
          :maxlength="rules.card.desc.maxLength"
          placeholder="Carreras de ciencias administrativas"
        />

        <!-- ============================================================
             Color institucional
             ============================================================ -->

        <EditorBrandColor
          v-model="item.colorToken"
          data-edit-target=".colorToken"
          class="mb-3"
        />

        <!-- ============================================================
             Imagen, punto focal y texto alternativo
             ============================================================ -->

        <EditorImage
          v-model="item.image"
          v-model:alt="item.imageAlt"
          v-model:focus-x="item.imageFocusX"
          v-model:focus-y="item.imageFocusY"
          data-edit-target=".image"
          alt-edit-target=".imageAlt"
          class="mb-3"
          variant="dropzone"
          :height="110"
          hint-position="bottom"
          hint="Referencia web: 410 × 155 px. Para pantallas de alta densidad, usa 820 × 310 px o más. En móvil se recorta en vertical; ajusta el punto focal para mantener visible lo importante."
          dropzone-text="Haz clic para elegir una imagen para este card."
          alt-placeholder="Describe brevemente la imagen"
          :alt-maxlength="rules.card.imageAlt.maxLength"
          @select="selectImage(item)"
          @remove="resetImageExtras(item)"
        />

        <!-- ============================================================
             Destino del card
             ============================================================ -->

        <EditorUrl
          v-model="item.href"
          v-model:target="item.target"
          data-edit-target=".href"
          class="mb-3"
          label="Destino de la tarjeta"
          :maxlength="rules.card.href.maxLength"
          :counter="false"
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

          <EditorText
            v-model="link.label"
            data-edit-target=".label"
            class="mb-3"
            label="Texto"
            :maxlength="rules.link.label.maxLength"
            placeholder="Administración y Finanzas"
          />

          <EditorUrl
            v-model="link.href"
            v-model:target="link.target"
            data-edit-target=".href"
            label="Destino"
            :maxlength="rules.link.href.maxLength"
            :counter="false"
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
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';

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

/*
 * Al quitar la foto, EditorImage ya vacía `image`; aquí se limpia lo que
 * dependía de ella: el texto alternativo y el punto focal.
 */
const resetImageExtras = (
  item: EcosystemEsanItem,
) => {
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
    target: '',
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

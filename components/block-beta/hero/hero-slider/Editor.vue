<template>
  <div class="hs-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Título para buscadores (SEO)</h6>

    <div class="mb-2">
      <label class="form-label" for="hs-seo-heading">Contenido del &lt;h1&gt;</label>
      <select
        id="hs-seo-heading"
        v-model="localData.seoHeadingSource"
        data-edit-target="seoHeadingSource"
        class="form-select form-select-sm"
      >
        <option value="esan">Texto fijo (ESAN por defecto)</option>
        <option value="title" :disabled="!canUseSlideHeading">Título de la diapositiva</option>
        <option value="eyebrow" :disabled="!canUseSlideHeading">Antetítulo de la diapositiva</option>
        <option value="none" :disabled="!canUseSlideHeading">No emitir H1</option>
      </select>
    </div>
    <EditorText
      v-if="localData.seoHeadingSource === 'esan'"
      v-model="localData.seoHeadingText"
      data-edit-target="seoHeadingText"
      class="mb-2"
      label="Texto del H1"
      placeholder="ESAN"
    />
    <p class="hs-hint">
      <template v-if="canUseSlideHeading">
        Puedes usar el título o antetítulo visible como H1. El texto fijo se mantiene
        oculto. Cada página debe tener <strong>uno solo</strong>.
      </template>
      <template v-else>
        Con varias diapositivas, el H1 debe ser fijo para no cambiar al avanzar el
        carrusel. Cada página debe tener <strong>uno solo</strong>.
      </template>
    </p>

    <hr />

    <h6 class="fw-bold small text-uppercase mb-1">Presentación</h6>
    <div class="btn-group w-100" role="group" aria-label="Presentación de la portada">
      <button
        v-for="option in MODE_OPTIONS"
        :key="option.value"
        type="button"
        class="btn btn-sm"
        :class="localData.mode === option.value ? 'btn-secondary' : 'btn-outline-secondary'"
        :aria-pressed="localData.mode === option.value"
        @click="setMode(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
    <p class="hs-hint mt-1">
      <template v-if="isSingle">
        Se muestra una sola diapositiva, sin flechas ni contador.
        <template v-if="localData.slides.length > 1">
          Las otras {{ localData.slides.length - 1 }} se conservan y vuelven si
          eliges Carrusel.
        </template>
      </template>
      <template v-else>
        Varias diapositivas con flechas y contador.
      </template>
    </p>

    <hr />

    <EditorBrandColor
      v-model="localData.panelColorToken"
      data-edit-target="panelColorToken"
      label="Color de la franja"
    />
    <p class="hs-hint mt-1">
      Es el color de la franja diagonal que se ve en teléfono. Aplica a todas
      las diapositivas.
    </p>

    <hr />

    <h6 class="fw-bold small text-uppercase mb-1">Velo sobre la foto</h6>
    <div class="hs-overlay__label">
      <label for="hs-overlay">Opacidad</label>
      <span>{{ localData.overlayOpacity }}%</span>
    </div>
    <input
      id="hs-overlay"
      v-model.number="localData.overlayOpacity"
      data-edit-target="overlayOpacity"
      type="range"
      class="form-range"
      min="0"
      max="100"
      step="5"
    />
    <p class="hs-hint">
      Es la oscuridad del degradado que va detrás del texto. 100% es el velo de
      siempre y 0% lo quita, para que se vea la foto tal cual. Aplica a todas las
      diapositivas, en escritorio y tableta: en teléfono el texto va sobre la
      franja de color y no hay velo.
    </p>

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">{{ isSingle ? 'Diapositiva' : 'Diapositivas' }}</h6>
      <span v-if="!isSingle" class="badge bg-secondary">{{ localData.slides.length }}</span>
    </div>
    <p class="hs-hint">
      Los títulos de las diapositivas son de presentación: se ven como titulares,
      pero no son el título principal de la página.
    </p>

    <!--
      En modo de una sola diapositiva solo se edita la primera: sin subir, bajar
      ni quitar (no hay nada que reordenar y quitarla dejaría la portada vacía).
    -->
    <CardAccordionItem
      v-for="(slide, index) in visibleSlides"
      :edit-key="`slides.${index}`"
      :key="slide.id"
      :title="slide.title"
      :index="index"
      :total="visibleSlides.length"
      :open="openIndex === index"
      :locked="isSingle"
      remove-label="Quitar diapositiva"
      @toggle="toggle(index)"
      @move="moveSlide(index, $event)"
      @remove="removeSlide(index)"
    >
      <div>
        <!-- Antetítulo — opcional -->
        <div class="hs-optional">
          <div class="hs-optional__head">
            <label class="form-label m-0">Antetítulo</label>
            <button
              v-if="isOpen(slide, 'eyebrow')"
              type="button"
              class="hs-optional__drop"
              title="Quitar antetítulo"
              @click="clearField(slide, 'eyebrow')"
            >
              <i class="las la-times"></i>
            </button>
          </div>

          <template v-if="isOpen(slide, 'eyebrow')">
            <EditorText
              v-model="slide.eyebrow"
              data-edit-target=".eyebrow"
              placeholder="Admisión 2026 - Examen virtual en plataforma"
            />
          </template>
          <button
            v-else
            type="button"
            class="btn btn-sm btn-outline-secondary w-100"
            @click="openField(slide, 'eyebrow')"
          >
            <i class="las la-plus me-1"></i> Agregar antetítulo
          </button>
        </div>

        <EditorTextarea v-model="slide.title" data-edit-target=".title" class="mb-2" label="Título" :rows="2" />

        <!-- Descripción — opcional -->
        <div class="hs-optional">
          <div class="hs-optional__head">
            <label class="form-label m-0">Descripción</label>
            <button
              v-if="isOpen(slide, 'desc')"
              type="button"
              class="hs-optional__drop"
              title="Quitar descripción"
              @click="clearField(slide, 'desc')"
            >
              <i class="las la-times"></i>
            </button>
          </div>

          <EditorTextarea
            v-if="isOpen(slide, 'desc')"
            v-model="slide.desc"
            data-edit-target=".desc"
            :rows="3"
          />
          <button
            v-else
            type="button"
            class="btn btn-sm btn-outline-secondary w-100"
            @click="openField(slide, 'desc')"
          >
            <i class="las la-plus me-1"></i> Agregar descripción
          </button>
        </div>

        <EditorImage
          v-model="slide.image"
          v-model:alt="slide.imageAlt"
          :focus-values="slide.imageFocusProfiles"
          :focus-modes="imageFocusModes"
          focus-ratio="18 / 7"
          focus-crop-preview
          data-edit-target=".image"
          alt-edit-target=".imageAlt"
          class="mb-3"
          label="Imagen de fondo"
          @select="$emit('select-image', { item: slide, field: 'image' })"
          @update:focus-values="saveImageFocusProfiles(slide, $event)"
        />

        <hr />

        <h6 class="fw-bold small text-uppercase mb-1">Botones</h6>
        <div class="btn-group w-100 mb-1" role="group" aria-label="Botones de la diapositiva">
          <button
            v-for="option in BUTTONS_OPTIONS"
            :key="option.value"
            type="button"
            class="btn btn-sm"
            :class="slide.buttons === option.value ? 'btn-secondary' : 'btn-outline-secondary'"
            :aria-pressed="slide.buttons === option.value"
            @click="slide.buttons = option.value"
          >
            {{ option.label }}
          </button>
        </div>
        <p class="hs-hint">
          El botón que no se elige se conserva, solo deja de mostrarse.
        </p>

        <!-- Botón principal: con "Ambos" o "Solo principal" -->
        <template v-if="slide.buttons !== 'secondary'">
          <h6 class="fw-bold small text-uppercase mb-1">Botón principal</h6>
          <EditorText
            v-model="slide.primary.label"
            data-edit-target=".primary.label"
            class="mb-2"
            label="Texto"
            placeholder="Habla con un asesor"
          />
          <EditorUrl
            v-model="slide.primary.url"
            v-model:target="slide.primary.target"
            data-edit-target=".primary.url"
            class="mb-2"
            label="Destino"
          />
          <EditorIcon
            v-model="slide.primary.icon"
            v-model:position="slide.primary.iconPosition"
            with-position
            class="mb-3"
            hint="Opcional. Déjalo vacío para un botón sin ícono."
          />
        </template>

        <!-- Botón secundario: con "Ambos" o "Solo secundario" -->
        <template v-if="slide.buttons !== 'primary'">
          <h6 class="fw-bold small text-uppercase mb-1">Botón secundario</h6>
          <EditorText
            v-model="slide.secondary.label"
            data-edit-target=".secondary.label"
            class="mb-2"
            label="Texto"
            placeholder="Postula ahora"
          />
          <EditorUrl
            v-model="slide.secondary.url"
            v-model:target="slide.secondary.target"
            data-edit-target=".secondary.url"
            class="mb-2"
            label="Destino"
          />
          <EditorIcon
            v-model="slide.secondary.icon"
            v-model:position="slide.secondary.iconPosition"
            with-position
            hint="Opcional. Déjalo vacío para un botón sin ícono."
          />
        </template>
      </div>
    </CardAccordionItem>

    <!-- En modo de una sola diapositiva solo hace falta si no queda ninguna. -->
    <button
      v-if="!isSingle || !localData.slides.length"
      type="button"
      class="btn btn-sm btn-danger w-100 mt-2"
      @click="addSlide"
    >
      <i class="las la-plus me-1"></i> Agregar diapositiva
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor del carrusel de portada.
 */
import { computed, ref, watch } from 'vue';
/*
 * El acordeón viene de la familia `events`. Es una pieza de interfaz del panel
 * sin nada específico de aquella familia, y duplicarla solo para no cruzar
 * carpetas dejaría copias que mantener a la par. Es el segundo bloque que lo
 * reutiliza así: conviene subirlo a block-beta/_shared/.
 */
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import {
  createImageFocusModes,
  normalizeImageFocus,
  normalizeImageFocusProfiles,
  saveImageFocusProfiles,
} from '../../../../helpers/imageFocus';
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import EditorIcon from '../../../editor-beta/EditorIcon/EditorIcon.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import {
  newHeroSlideId,
  normalizeHeroAction,
  normalizeHeroButtons,
  normalizeHeroMode,
  normalizeHeroOverlay,
  normalizeHeroPanelColor,
  normalizeHeroSeoHeadingSource,
  type HeroButtons,
  type HeroMode,
  type HeroSlideItem,
} from '../_shared/types';

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);
const imageFocusModes = createImageFocusModes({
  web: '18 / 7',
  tablet: '16 / 9',
  mobile: '4 / 3',
});

const MODE_OPTIONS: Array<{ value: HeroMode; label: string }> = [
  { value: 'carousel', label: 'Carrusel' },
  { value: 'single', label: 'Una diapositiva' },
];

const BUTTONS_OPTIONS: Array<{ value: HeroButtons; label: string }> = [
  { value: 'both', label: 'Ambos' },
  { value: 'primary', label: 'Solo principal' },
  { value: 'secondary', label: 'Solo secundario' },
];

const buildSlide = (source: any): HeroSlideItem => {
  const imageFocusX = normalizeImageFocus(source?.imageFocusX);
  const imageFocusY = normalizeImageFocus(source?.imageFocusY);
  const secondary = normalizeHeroAction(source?.secondary);

  return {
    id: source?.id || newHeroSlideId(),
    eyebrow: source?.eyebrow ?? '',
    title: source?.title ?? '',
    desc: source?.desc ?? '',
    image: source?.image ?? '',
    imageAlt: source?.imageAlt ?? '',
    imageFocusX,
    imageFocusY,
    imageFocusProfiles: normalizeImageFocusProfiles(
      source?.imageFocusProfiles,
      imageFocusX,
      imageFocusY,
    ),
    buttons: normalizeHeroButtons(source?.buttons, secondary),
    primary: normalizeHeroAction(source?.primary),
    secondary,
  };
};

const build = (source: any) => ({
  seoHeadingSource: normalizeHeroSeoHeadingSource(source?.seoHeadingSource, source?.showSeoHeading),
  seoHeadingText: typeof source?.seoHeadingText === 'string' ? source.seoHeadingText : 'ESAN',
  mode: normalizeHeroMode(source?.mode),
  panelColorToken: normalizeHeroPanelColor(source?.panelColorToken),
  overlayOpacity: normalizeHeroOverlay(source?.overlayOpacity),
  slides: Array.isArray(source?.slides) ? source.slides.map(buildSlide) : [],
});

const localData = ref(build(props.modelValue));

/* -------------------------------------------------------------------------- */
/* Presentación: carrusel o una sola diapositiva                               */
/* -------------------------------------------------------------------------- */

const isSingle = computed(() => localData.value.mode === 'single');

/** En modo de una sola diapositiva solo se edita la primera; las demás se conservan. */
const visibleSlides = computed(() =>
  isSingle.value ? localData.value.slides.slice(0, 1) : localData.value.slides,
);

const canUseSlideHeading = computed(() => visibleSlides.value.length === 1);

watch(
  () => visibleSlides.value.length,
  (length) => {
    if (length > 1 && localData.value.seoHeadingSource !== 'esan') {
      localData.value.seoHeadingSource = 'esan';
    }
  },
  { immediate: true },
);

const setMode = (mode: HeroMode) => {
  localData.value.mode = mode;

  // La única diapositiva visible se abre sola: es lo que hay que editar.
  if (mode === 'single' && localData.value.slides.length) openIndex.value = 0;
};

/* -------------------------------------------------------------------------- */
/* Campos opcionales                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Los dos campos de texto que la maqueta marca como opcionales.
 *
 * Ninguno ocupa sitio en el panel hasta que se pide: con todos los campos
 * siempre desplegados, una diapositiva obligaba a recorrer el doble de panel
 * para llegar a lo que de verdad se estaba editando. (El botón secundario ya no
 * es un opcional más: se elige con el selector "Botones" de cada diapositiva.)
 */
type OptionalField = 'eyebrow' | 'desc';

/**
 * Campos desplegados, por diapositiva y campo.
 *
 * Hace falta un estado aparte y no basta con mirar el dato: al pulsar "Agregar"
 * el campo está vacío, y si el desplegado se dedujera del contenido se cerraría
 * solo antes de poder escribir nada.
 *
 * Es estado del panel, no del bloque: no se guarda.
 */
const optionalOpen = ref<Record<string, boolean>>({});

const fieldKey = (slide: HeroSlideItem, field: OptionalField) => `${slide.id}:${field}`;

/** ¿Este campo opcional trae contenido guardado? */
const hasContent = (slide: HeroSlideItem, field: OptionalField) =>
  Boolean(field === 'eyebrow' ? slide.eyebrow : slide.desc);

/**
 * Sin decisión previa manda el dato, que es lo que hace que una diapositiva ya
 * guardada aparezca con sus campos opcionales desplegados al abrir el editor.
 */
const isOpen = (slide: HeroSlideItem, field: OptionalField) =>
  optionalOpen.value[fieldKey(slide, field)] ?? hasContent(slide, field);

const openField = (slide: HeroSlideItem, field: OptionalField) => {
  optionalOpen.value[fieldKey(slide, field)] = true;
};

/** Se limpia el dato además de plegar: si no, el bloque seguiría dibujándolo. */
const clearField = (slide: HeroSlideItem, field: OptionalField) => {
  if (field === 'eyebrow') slide.eyebrow = '';
  else slide.desc = '';

  optionalOpen.value[fieldKey(slide, field)] = false;
};

/* -------------------------------------------------------------------------- */
/* Lista de diapositivas                                                       */
/* -------------------------------------------------------------------------- */

/*
 * Acordeón de un solo panel abierto: con varias diapositivas desplegadas a la
 * vez habría que recorrer todo el panel para llegar al botón de agregar.
 */
const openIndex = ref<number | null>(null);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addSlide = () => {
  localData.value.slides.push(buildSlide({}));
  // La diapositiva nueva se abre sola: es la que se va a rellenar.
  openIndex.value = localData.value.slides.length - 1;
};

const removeSlide = (index: number) => {
  localData.value.slides.splice(index, 1);

  // El índice abierto se corrige para no quedar apuntando a otra diapositiva.
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveSlide = (index: number, delta: number) => {
  const target = index + delta;
  const list = localData.value.slides;
  if (target < 0 || target >= list.length) return;

  [list[index], list[target]] = [list[target], list[index]];

  // El panel abierto viaja con su diapositiva.
  if (openIndex.value === index) openIndex.value = target;
  else if (openIndex.value === target) openIndex.value = index;
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return;
    if (JSON.stringify(newVal) === JSON.stringify(localData.value)) return;
    localData.value = build(newVal);
  },
  { deep: true },
);

watch(
  localData,
  (newVal) => emit('update:modelValue', JSON.parse(JSON.stringify(newVal))),
  { deep: true },
);
</script>

<style scoped>
.hs-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

/* Etiqueta del control de opacidad: nombre a la izquierda, valor a la derecha. */
.hs-overlay__label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
}

.hs-overlay__label span {
  font-variant-numeric: tabular-nums;
  color: #6b7688;
}

/* Bloque de un campo opcional: encabezado con su botón de quitar, y debajo el
   campo o el botón de agregar. */
.hs-optional {
  margin-bottom: 12px;
}

.hs-optional__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.hs-optional__drop {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: #6b7688;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.hs-optional__drop:hover {
  background: #dc3545;
  color: #fff;
}
</style>

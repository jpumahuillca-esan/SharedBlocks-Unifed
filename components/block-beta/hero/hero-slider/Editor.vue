<template>
  <div class="hs-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Título para buscadores (SEO)</h6>

    <div class="hs-seo">
      <div class="form-check form-switch m-0">
        <input
          id="hs-seo-heading"
          v-model="localData.showSeoHeading"
          class="form-check-input"
          type="checkbox"
          role="switch"
        />
        <label class="form-check-label" for="hs-seo-heading">
          Emitir &lt;h1&gt; "ESAN"
        </label>
      </div>
      <span class="hs-seo__state" :class="{ 'is-on': localData.showSeoHeading }">
        {{ localData.showSeoHeading ? 'Activado' : 'Desactivado' }}
      </span>
    </div>

    <p class="hs-hint">
      Es el título principal de la página: no se ve, pero lo leen los buscadores
      y los lectores de pantalla. Cada página debe tener <strong>uno solo</strong>.
      Desactívalo si la página ya tiene su propio título principal o si "ESAN" no
      la describe.
    </p>

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Diapositivas</h6>
      <span class="badge bg-secondary">{{ localData.slides.length }}</span>
    </div>
    <p class="hs-hint">
      Los títulos de las diapositivas son de presentación: se ven como titulares,
      pero no son el título principal de la página.
    </p>

    <CardAccordionItem
      v-for="(slide, index) in localData.slides"
      :key="slide.id"
      :title="slide.title"
      :index="index"
      :total="localData.slides.length"
      :open="openIndex === index"
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
            <input
              v-model="slide.eyebrow"
              type="text"
              class="form-control form-control-sm"
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

        <label class="form-label">Título</label>
        <textarea v-model="slide.title" class="form-control form-control-sm mb-2" rows="2"></textarea>

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

          <textarea
            v-if="isOpen(slide, 'desc')"
            v-model="slide.desc"
            class="form-control form-control-sm"
            rows="3"
          ></textarea>
          <button
            v-else
            type="button"
            class="btn btn-sm btn-outline-secondary w-100"
            @click="openField(slide, 'desc')"
          >
            <i class="las la-plus me-1"></i> Agregar descripción
          </button>
        </div>

        <label class="form-label">Imagen de fondo</label>
        <div class="hs-image-preview mb-2">
          <img v-if="slide.image" :src="slide.image" alt="" />
          <span v-else class="text-muted small">Sin imagen</span>
        </div>
        <div class="d-flex gap-2 mb-2">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary flex-grow-1"
            @click="$emit('select-image', { item: slide, field: 'image' })"
          >
            <i class="las la-image me-1"></i>
            {{ slide.image ? 'Cambiar imagen' : 'Subir imagen' }}
          </button>
          <button
            v-if="slide.image"
            type="button"
            class="btn btn-sm btn-outline-danger"
            title="Quitar imagen"
            @click="slide.image = ''"
          >
            <i class="las la-trash"></i>
          </button>
        </div>

        <label class="form-label">Texto alternativo</label>
        <input v-model="slide.imageAlt" type="text" class="form-control form-control-sm mb-3" />

        <hr />

        <h6 class="fw-bold small text-uppercase mb-1">Botón principal</h6>
        <label class="form-label">Texto</label>
        <input
          v-model="slide.primary.label"
          type="text"
          class="form-control form-control-sm mb-2"
          placeholder="Habla con un asesor"
        />
        <label class="form-label">Destino</label>
        <input
          v-model="slide.primary.url"
          type="text"
          class="form-control form-control-sm mb-3"
          placeholder="/ruta o https://"
        />

        <!-- Botón secundario — opcional -->
        <div class="hs-optional">
          <div class="hs-optional__head">
            <h6 class="fw-bold small text-uppercase m-0">Botón secundario</h6>
            <button
              v-if="isOpen(slide, 'secondary')"
              type="button"
              class="hs-optional__drop"
              title="Quitar botón secundario"
              @click="clearField(slide, 'secondary')"
            >
              <i class="las la-times"></i>
            </button>
          </div>

          <template v-if="isOpen(slide, 'secondary')">
            <label class="form-label">Texto</label>
            <input
              v-model="slide.secondary.label"
              type="text"
              class="form-control form-control-sm mb-2"
              placeholder="Postula ahora"
            />
            <label class="form-label">Destino</label>
            <input
              v-model="slide.secondary.url"
              type="text"
              class="form-control form-control-sm"
              placeholder="/ruta o https://"
            />
          </template>
          <button
            v-else
            type="button"
            class="btn btn-sm btn-outline-secondary w-100"
            @click="openField(slide, 'secondary')"
          >
            <i class="las la-plus me-1"></i> Agregar botón secundario
          </button>
        </div>
      </div>
    </CardAccordionItem>

    <button type="button" class="btn btn-sm btn-danger w-100 mt-2" @click="addSlide">
      <i class="las la-plus me-1"></i> Agregar diapositiva
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor del carrusel de portada.
 */
import { ref, watch } from 'vue';
/*
 * El acordeón viene de la familia `events`. Es una pieza de interfaz del panel
 * sin nada específico de aquella familia, y duplicarla solo para no cruzar
 * carpetas dejaría copias que mantener a la par. Es el segundo bloque que lo
 * reutiliza así: conviene subirlo a block-beta/_shared/.
 */
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import {
  newHeroSlideId,
  normalizeHeroAction,
  normalizeShowSeoHeading,
  type HeroSlideItem,
} from '../_shared/types';

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const buildSlide = (source: any): HeroSlideItem => ({
  id: source?.id || newHeroSlideId(),
  eyebrow: source?.eyebrow ?? '',
  title: source?.title ?? '',
  desc: source?.desc ?? '',
  image: source?.image ?? '',
  imageAlt: source?.imageAlt ?? '',
  primary: normalizeHeroAction(source?.primary),
  secondary: normalizeHeroAction(source?.secondary),
});

const build = (source: any) => ({
  showSeoHeading: normalizeShowSeoHeading(source?.showSeoHeading),
  slides: Array.isArray(source?.slides) ? source.slides.map(buildSlide) : [],
});

const localData = ref(build(props.modelValue));

/* -------------------------------------------------------------------------- */
/* Campos opcionales                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Los tres campos que la maqueta marca como opcionales.
 *
 * Ninguno ocupa sitio en el panel hasta que se pide: con los siete campos
 * siempre desplegados, una diapositiva obligaba a recorrer el doble de panel
 * para llegar a lo que de verdad se estaba editando.
 */
type OptionalField = 'eyebrow' | 'desc' | 'secondary';

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
const hasContent = (slide: HeroSlideItem, field: OptionalField) => {
  if (field === 'secondary') return Boolean(slide.secondary.label || slide.secondary.url);
  if (field === 'eyebrow') return Boolean(slide.eyebrow);
  return Boolean(slide.desc);
};

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
  if (field === 'secondary') {
    slide.secondary.label = '';
    slide.secondary.url = '';
  } else if (field === 'eyebrow') {
    slide.eyebrow = '';
  } else {
    slide.desc = '';
  }

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
/* Interruptor del título para buscadores, con su estado a la vista. */
.hs-seo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
  padding: 8px 10px;
  border: 1px solid #dde3ec;
  border-radius: 7px;
  background: #f4f6fa;
}

.hs-seo .form-check-label {
  font-size: 12.5px;
  font-weight: 600;
  color: #1f2733;
}

.hs-seo__state {
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 999px;
  background: #dde3ec;
  color: #495057;
  font-size: 10.5px;
  font-weight: 700;
}

.hs-seo__state.is-on {
  background: #d1f0dc;
  color: #0f6b34;
}

.hs-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
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

.hs-image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  border: 1px dashed #c6cedb;
  border-radius: 7px;
  background: #f4f6fa;
  overflow: hidden;
}

.hs-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

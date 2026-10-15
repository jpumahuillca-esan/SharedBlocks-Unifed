<template>
  <div class="ac-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Encabezado</h6>

    <EditorText v-model="localData.title" data-edit-target="title" class="mb-2" label="Título" placeholder="Acerca de la carrera" />

    <EditorTextarea
      v-model="localData.subtitle"
      data-edit-target="subtitle"
      class="mb-2"
      label="Subtítulo"
      :rows="2"
      hint="Frase corta en negrita bajo el título. Vacío la oculta."
    />

    <EditorTextarea
      v-model="localData.description"
      data-edit-target="description"
      class="mb-2"
      label="Descripción"
      :rows="4"
      hint="Vacío la oculta."
    />

    <hr />

    <h6 class="fw-bold small text-uppercase mb-1">Video</h6>

    <EditorImage
      v-model="localData.image"
      v-model:alt="localData.imageAlt"
      :focus-values="localData.imageFocusProfiles"
      :focus-modes="imageFocusModes"
      focus-ratio="16 / 9"
      focus-crop-preview
      data-edit-target="image"
      alt-edit-target="imageAlt"
      class="mb-2"
      label="Imagen del video"
      hint="Es la miniatura que se ve antes de reproducir."
      @select="$emit('select-image', { item: localData, field: 'image' })"
      @update:focus-values="saveImageFocusProfiles(localData, $event)"
    />

    <EditorUrl
      v-model="localData.videoUrl"
      data-edit-target="videoUrl"
      class="mb-2"
      label="Video"
      placeholder="https://www.youtube.com/watch?v=..."
      :hint="videoHint(localData.videoUrl)"
      hint-position="bottom"
      :hint-tone="videoWarning(localData.videoUrl) ? 'warn' : 'default'"
    />

    <EditorText
      v-model="localData.duration"
      data-edit-target="duration"
      class="mb-2"
      label="Duración"
      hint="Se muestra abajo a la derecha del video, ej. 02:14. Vacío la oculta."
      placeholder="02:14"
    />

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1" data-edit-target="details">
      <h6 class="fw-bold small text-uppercase m-0">Datos</h6>
      <span class="badge bg-secondary">{{ localData.details.length }}</span>
    </div>
    <p class="ac-hint">Rótulo y valor, como «Grado» y «Bachiller en Administración». Un dato sin valor no se muestra.</p>

    <CardAccordionItem
      v-for="(detail, index) in localData.details"
      :edit-key="`details.${index}`"
      :key="detail.id"
      :title="detail.label || detail.value"
      :index="index"
      :total="localData.details.length"
      :open="isOpen('details', index)"
      remove-label="Quitar dato"
      @toggle="toggle('details', index)"
      @move="moveItem('details', index, $event)"
      @remove="removeItem('details', index)"
    >
      <div>
        <EditorText
          v-model="detail.label"
          data-edit-target=".label"
          class="mb-2"
          label="Rótulo"
          hint="Vacío lo oculta."
          placeholder="Grado"
        />

        <EditorTextarea
          v-model="detail.value"
          data-edit-target=".value"
          label="Valor"
          :rows="2"
          placeholder="Bachiller en Administración"
        />
      </div>
    </CardAccordionItem>

    <button type="button" class="btn btn-sm btn-danger w-100 mt-1" @click="addDetail">
      <i class="las la-plus me-1"></i> Agregar dato
    </button>

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1" data-edit-target="links">
      <h6 class="fw-bold small text-uppercase m-0">Enlaces</h6>
      <span class="badge bg-secondary">{{ localData.links.length }}</span>
    </div>
    <p class="ac-hint">Tarjetas con ícono al pie del bloque. Un enlace sin texto no se muestra.</p>

    <CardAccordionItem
      v-for="(link, index) in localData.links"
      :edit-key="`links.${index}`"
      :key="link.id"
      :title="link.label"
      :index="index"
      :total="localData.links.length"
      :open="isOpen('links', index)"
      remove-label="Quitar enlace"
      @toggle="toggle('links', index)"
      @move="moveItem('links', index, $event)"
      @remove="removeItem('links', index)"
    >
      <div>
        <EditorText
          v-model="link.label"
          data-edit-target=".label"
          class="mb-2"
          label="Texto"
          placeholder="Conoce las certificaciones"
        />

        <label class="form-label">Ícono</label>
        <div class="d-flex align-items-center gap-2 mb-2">
          <!--
            Vista previa del ícono elegido. Se dibuja aquí con AtomIcon porque,
            a diferencia de los pictogramas, este átomo no depende de los
            estilos de .arcis-scope: trae su tamaño en el propio SVG.
          -->
          <span class="ac-icon-preview" :class="{ 'is-empty': !link.icon }" aria-hidden="true">
            <AtomIcon v-if="link.icon" :name="link.icon" :size="18" />
          </span>
          <select v-model="link.icon" data-edit-target=".icon" class="form-select form-select-sm">
            <option value="">Sin ícono</option>
            <option v-for="name in ICON_SUGGESTIONS" :key="name" :value="name">
              {{ name }}
            </option>
          </select>
        </div>

        <EditorUrl
          v-model="link.url"
          v-model:target="link.target"
          data-edit-target=".url"
          label="Destino del enlace"
        />
      </div>
    </CardAccordionItem>

    <button type="button" class="btn btn-sm btn-danger w-100 mt-1" @click="addLink">
      <i class="las la-plus me-1"></i> Agregar enlace
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor del bloque «Acerca de la carrera».
 *
 * Dos listas —datos y enlaces— con el mismo acordeón de un panel abierto a la
 * vez; el estado de apertura se comparte (`openKey`) para que en todo el panel
 * haya, como mucho, una tarjeta abierta.
 */
import { ref, watch } from 'vue';
/*
 * El acordeón viene de la familia `events`, igual que en `info/mapamundi` y
 * `info/values-cards`: ver la nota de mapamundi/Editor.vue sobre subirlo a un
 * lugar común.
 */
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import { ICON_SUGGESTIONS } from '../../../../helpers/iconOptions';
import { toVideoSource } from '../../../../helpers/video';
import {
  createImageFocusModes,
  normalizeImageFocus,
  normalizeImageFocusProfiles,
  saveImageFocusProfiles,
} from '../../../../helpers/imageFocus';
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';

type ListKey = 'details' | 'links';

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);
const imageFocusModes = createImageFocusModes('16 / 9');

const newItemId = () => `ac-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const buildDetail = (source: any) => ({
  id: source?.id || newItemId(),
  label: source?.label ?? '',
  value: source?.value ?? '',
});

const buildLink = (source: any) => ({
  id: source?.id || newItemId(),
  icon: source?.icon ?? '',
  label: source?.label ?? '',
  url: source?.url ?? '',
  target: normalizeLinkTarget(source?.target),
});

const build = (source: any) => {
  const imageFocusX = normalizeImageFocus(source?.imageFocusX);
  const imageFocusY = normalizeImageFocus(source?.imageFocusY);

  return {
    title: source?.title ?? '',
    subtitle: source?.subtitle ?? '',
    description: source?.description ?? '',
    image: source?.image ?? '',
    imageAlt: source?.imageAlt ?? '',
    imageFocusX,
    imageFocusY,
    imageFocusProfiles: normalizeImageFocusProfiles(source?.imageFocusProfiles, imageFocusX, imageFocusY),
    videoUrl: source?.videoUrl ?? '',
    duration: source?.duration ?? '',
    details: Array.isArray(source?.details) ? source.details.map(buildDetail) : [],
    links: Array.isArray(source?.links) ? source.links.map(buildLink) : [],
  };
};

const localData = ref(build(props.modelValue));

/*
 * El enlace se acepta en cualquiera de sus formas, así que conviene decir en el
 * panel si el que se pegó se reconoció — de lo contrario el fallo solo se ve al
 * pulsar un botón de reproducir que no hace nada.
 */
const videoWarning = (url: string) => Boolean(url?.trim()) && toVideoSource(url).kind === 'none';

const videoHint = (url: string) => {
  if (!url?.trim()) return 'Opcional. Sin enlace, el botón de reproducir queda decorativo.';
  if (toVideoSource(url).kind === 'none') {
    return 'No se reconoce este enlace. Se aceptan YouTube, Vimeo o un archivo .mp4/.webm.';
  }
  return 'Enlace reconocido. El video se reproduce dentro del bloque.';
};

/* Una sola tarjeta abierta en todo el panel, no una por lista. */
const openKey = ref<string | null>(null);

const keyOf = (list: ListKey, index: number) => `${list}:${index}`;

const isOpen = (list: ListKey, index: number) => openKey.value === keyOf(list, index);

const toggle = (list: ListKey, index: number) => {
  const key = keyOf(list, index);
  openKey.value = openKey.value === key ? null : key;
};

const addDetail = () => {
  localData.value.details.push(buildDetail({}));
  // El dato nuevo se abre solo: es el que se va a rellenar.
  openKey.value = keyOf('details', localData.value.details.length - 1);
};

const addLink = () => {
  localData.value.links.push(buildLink({}));
  openKey.value = keyOf('links', localData.value.links.length - 1);
};

const removeItem = (list: ListKey, index: number) => {
  localData.value[list].splice(index, 1);

  // La tarjeta abierta se corrige para no quedar apuntando a otro elemento.
  const open = openKey.value;
  if (!open?.startsWith(`${list}:`)) return;

  const openIndex = Number(open.split(':')[1]);
  if (openIndex === index) openKey.value = null;
  else if (openIndex > index) openKey.value = keyOf(list, openIndex - 1);
};

const moveItem = (list: ListKey, index: number, delta: number) => {
  const target = index + delta;
  const items = localData.value[list];
  if (target < 0 || target >= items.length) return;

  [items[index], items[target]] = [items[target], items[index]];

  // La tarjeta abierta viaja con su elemento.
  if (openKey.value === keyOf(list, index)) openKey.value = keyOf(list, target);
  else if (openKey.value === keyOf(list, target)) openKey.value = keyOf(list, index);
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
.ac-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

.ac-icon-preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: 1px solid #dde3ec;
  border-radius: 7px;
  background: #fff;
  color: #1f2733;
}

.ac-icon-preview.is-empty {
  border-style: dashed;
  background: #f4f6fa;
}
</style>

<template>
  <div class="vc-editor">
    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Pilares</h6>
      <span class="badge bg-secondary">{{ localData.items.length }}</span>
    </div>
    <p class="vc-hint">
      Cada pilar es un filtro y su tarjeta. En la página se ve uno a la vez, el
      que esté seleccionado. Si no caben todos en una fila, el visitante
      desplaza la fila de filtros hacia el lado.
    </p>

    <CardAccordionItem
      v-for="(item, index) in localData.items"
      :edit-key="`items.${index}`"
      :key="item.id"
      :title="item.tabLabel"
      :index="index"
      :total="localData.items.length"
      :open="openIndex === index"
      remove-label="Quitar pilar"
      @toggle="toggle(index)"
      @move="moveItem(index, $event)"
      @remove="removeItem(index)"
    >
      <div>
        <EditorText
          v-model="item.tabLabel"
          data-edit-target=".tabLabel"
          class="mb-2"
          label="Texto del filtro"
          hint="Va dentro de la pastilla, arriba de la tarjeta."
        />

        <label class="form-label">Ícono del filtro</label>
        <div class="d-flex align-items-center gap-2 mb-2">
          <!--
            Vista previa del ícono elegido. Se dibuja aquí con AtomIcon porque,
            a diferencia de los pictogramas, este átomo no depende de los
            estilos de .arcis-scope: trae su tamaño en el propio SVG.
          -->
          <span class="vc-icon-preview" :class="{ 'is-empty': !item.icon }" aria-hidden="true">
            <AtomIcon v-if="item.icon" :name="item.icon" :size="18" />
          </span>
          <select v-model="item.icon" data-edit-target=".icon" class="form-select form-select-sm">
            <option value="">Sin ícono</option>
            <option v-for="name in ICON_SUGGESTIONS" :key="name" :value="name">
              {{ name }}
            </option>
          </select>
        </div>

        <hr class="my-2" />

        <EditorText
          v-model="item.eyebrow"
          data-edit-target=".eyebrow"
          class="mb-2"
          label="Etiqueta superior"
          hint="Texto corto en rojo sobre el título. Vacío la oculta."
        />

        <EditorTextarea v-model="item.title" data-edit-target=".title" class="mb-2" label="Título" :rows="2" />

        <EditorTextarea v-model="item.desc" data-edit-target=".desc" class="mb-2" label="Texto de apoyo" :rows="3" />

        <BadgeListEditor
          :badges="item.bullets"
          data-edit-target=".bullets"
          label="Viñetas"
          hint="Se listan bajo el texto de apoyo, una debajo de otra. Una viñeta sin texto no se muestra."
          placeholder="Texto de la viñeta"
          empty-text="Sin viñetas."
        />

        <EditorText
          v-model="item.linkLabel"
          data-edit-target=".linkLabel"
          class="mt-2 mb-2"
          label="Texto del enlace"
          hint="Vacío oculta el enlace del pie."
          placeholder="Explora nuestros programas"
        />

        <EditorUrl
          v-model="item.linkUrl"
          v-model:target="item.linkTarget"
          data-edit-target=".linkUrl"
          class="mb-2"
          label="Destino del enlace"
        />

        <hr class="my-2" />

        <EditorImage
          v-model="item.image"
          v-model:alt="item.imageAlt"
          v-model:focus-x="item.imageFocusX"
          v-model:focus-y="item.imageFocusY"
          focus-ratio="16 / 9"
          data-edit-target=".image"
          alt-edit-target=".imageAlt"
          class="mb-2"
          label="Imagen del video"
          hint="Es la miniatura que se ve antes de reproducir."
          @select="$emit('select-image', { item, field: 'image' })"
        />

        <EditorUrl
          v-model="item.videoUrl"
          data-edit-target=".videoUrl"
          class="mb-2"
          label="Video"
          placeholder="https://www.youtube.com/watch?v=..."
          :hint="videoHint(item.videoUrl)"
          hint-position="bottom"
          :hint-tone="videoWarning(item.videoUrl) ? 'warn' : 'default'"
        />

        <EditorText
          v-model="item.duration"
          data-edit-target=".duration"
          label="Duración"
          hint="Se muestra arriba del video, ej. 02:15. Vacío la oculta."
          placeholder="02:15"
        />
      </div>
    </CardAccordionItem>

    <button type="button" class="btn btn-sm btn-danger w-100 mt-2" @click="addItem">
      <i class="las la-plus me-1"></i> Agregar pilar
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor de las tarjetas de valor.
 */
import { ref, watch } from 'vue';
/*
 * El acordeón viene de la familia `events`, igual que en `testimonials` e
 * `info/mapamundi`. Con esta ya son cuatro familias usándolo: conviene subirlo
 * a block-beta/_shared/ en un cambio aparte que toque todos esos editores.
 */
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
/*
 * Mismo caso: el editor de listas de texto de `events` es exactamente lo que
 * necesitan las viñetas. Se le pasan los rótulos propios en vez de clonarlo.
 */
import BadgeListEditor from '../../events/_shared/BadgeListEditor.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import { ICON_SUGGESTIONS } from '../../../../helpers/iconOptions';
import { toVideoSource } from '../../../../helpers/video';
import { normalizeImageFocus } from '../../../../helpers/imageFocus';
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const newItemId = () => `vc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const buildItem = (source: any) => ({
  id: source?.id || newItemId(),
  icon: source?.icon ?? '',
  tabLabel: source?.tabLabel ?? '',
  eyebrow: source?.eyebrow ?? '',
  title: source?.title ?? '',
  desc: source?.desc ?? '',
  bullets: Array.isArray(source?.bullets) ? source.bullets.map((b: any) => String(b ?? '')) : [],
  linkLabel: source?.linkLabel ?? '',
  linkUrl: source?.linkUrl ?? '',
  linkTarget: normalizeLinkTarget(source?.linkTarget),
  image: source?.image ?? '',
  imageAlt: source?.imageAlt ?? '',
  imageFocusX: normalizeImageFocus(source?.imageFocusX),
  imageFocusY: normalizeImageFocus(source?.imageFocusY),
  videoUrl: source?.videoUrl ?? '',
  duration: source?.duration ?? '',
});

const build = (source: any) => ({
  items: Array.isArray(source?.items) ? source.items.map(buildItem) : [],
});

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
  return 'Enlace reconocido. El video se reproduce dentro de la tarjeta.';
};

/*
 * Acordeón de un solo panel abierto: con varios pilares desplegados a la vez
 * habría que recorrer todo el panel para llegar al botón de agregar.
 */
const openIndex = ref<number | null>(null);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addItem = () => {
  localData.value.items.push(buildItem({}));
  // El pilar nuevo se abre solo: es el que se va a rellenar.
  openIndex.value = localData.value.items.length - 1;
};

const removeItem = (index: number) => {
  localData.value.items.splice(index, 1);

  // El índice abierto se corrige para no quedar apuntando a otro pilar.
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveItem = (index: number, delta: number) => {
  const target = index + delta;
  const list = localData.value.items;
  if (target < 0 || target >= list.length) return;

  [list[index], list[target]] = [list[target], list[index]];

  // El panel abierto viaja con su pilar.
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
.vc-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

.vc-icon-preview {
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

.vc-icon-preview.is-empty {
  border-style: dashed;
  background: #f4f6fa;
}
</style>

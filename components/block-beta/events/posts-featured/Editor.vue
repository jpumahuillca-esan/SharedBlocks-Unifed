<template>
  <div class="posts-editor">
    <CardSectionHeaderEditor
      :desc="localData.desc"
      :title="localData.title"
      :link-label="localData.linkLabel"
      :link-url="localData.linkUrl"
      :link-target="localData.linkTarget"
      :card-count="localData.cardCount"
      @update:desc="localData.desc = $event"
      @update:title="localData.title = $event"
      @update:link-label="localData.linkLabel = $event"
      @update:link-url="localData.linkUrl = $event"
      @update:link-target="localData.linkTarget = $event"
      @update:card-count="localData.cardCount = $event"
    />

    <hr class="my-3" />

    <!-- Selector de Modo de Alimentación -->
    <div class="mb-3">
      <label class="form-label small fw-bold text-uppercase d-block mb-1">
        Origen de Contenido
      </label>
      <div class="btn-group btn-group-sm w-100" role="group">
        <button
          type="button"
          class="btn"
          :class="localData.feedMode === 'dynamic' ? 'btn-danger' : 'btn-outline-secondary'"
          @click="setFeedMode('dynamic')"
        >
          <i class="las la-globe me-1"></i> Conexión API (Global)
        </button>
        <button
          type="button"
          class="btn"
          :class="localData.feedMode === 'manual' ? 'btn-danger' : 'btn-outline-secondary'"
          @click="setFeedMode('manual')"
        >
          <i class="las la-edit me-1"></i> Manual
        </button>
      </div>
      <p class="ps-hint mt-1">
        <template v-if="localData.feedMode === 'dynamic'">
          Conecta con la base de datos de publicaciones y filtra por Unidad Académica y Categoría.
        </template>
        <template v-else>
          Redacta y organiza cada tarjeta manualmente desde este panel.
        </template>
      </p>
    </div>

    <!-- PANEL MODO DINÁMICO (API) -->
    <div v-if="localData.feedMode === 'dynamic'" class="feed-config-panel p-2 mb-3 bg-light border rounded">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <span class="small fw-bold text-dark">
          <i class="las la-sliders-h me-1 text-danger"></i> Filtros de Consulta
        </span>
        <span v-if="loadingFeed" class="spinner-border spinner-border-sm text-danger" role="status"></span>
      </div>

      <!-- Selector de Unidad Académica -->
      <div class="mb-2">
        <label class="form-label x-small fw-semibold text-muted mb-1">Unidad Académica</label>
        <select
          v-model="localData.feedConfig.academic_unit_id"
          class="form-select form-select-sm"
          @change="onFilterChanged"
        >
          <option value="all">Todas las Unidades (Global)</option>
          <option v-for="unit in academicUnits" :key="unit.id" :value="unit.id">
            {{ unit.name }}
          </option>
        </select>
      </div>

      <!-- Selector de Categoría -->
      <div class="mb-2">
        <label class="form-label x-small fw-semibold text-muted mb-1">Categoría</label>
        <select
          v-model="localData.feedConfig.category_id"
          class="form-select form-select-sm"
          @change="onFilterChanged"
        >
          <option value="all">Todas las Categorías</option>
          <option v-for="cat in availableCategories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Selector de Tipo de Publicación -->
      <div class="mb-3">
        <label class="form-label x-small fw-semibold text-muted mb-1">Tipo de Publicación</label>
        <select
          v-model="localData.feedConfig.type"
          class="form-select form-select-sm"
          @change="onFilterChanged"
        >
          <option value="news">Noticias (news)</option>
          <option value="calls">Convocatorias (calls)</option>
          <option value="all">Todos los tipos (all)</option>
        </select>
      </div>

      <!-- Botón de Sincronización Manual -->
      <button
        type="button"
        class="btn btn-sm btn-outline-danger w-100 mb-2"
        :disabled="loadingFeed"
        @click="syncFeed"
      >
        <i class="las la-sync-alt me-1" :class="{ 'fa-spin': loadingFeed }"></i>
        {{ loadingFeed ? 'Sincronizando...' : 'Actualizar Noticias desde API' }}
      </button>

      <div v-if="feedStatusMsg" class="alert alert-info py-1 px-2 x-small mb-0">
        <i class="las la-info-circle me-1"></i> {{ feedStatusMsg }}
      </div>
    </div>

    <!-- RESUMEN DE TARJETAS CARGADAS -->
    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Publicaciones cargadas</h6>
      <span class="badge" :class="localData.cards.length ? 'bg-danger' : 'bg-secondary'">
        {{ localData.cards.length }}
      </span>
    </div>
    <p class="ps-hint">
      Se muestran {{ localData.cardCount }} columnas a la vez en el carrusel.
    </p>

    <!-- MODO MANUAL: ACORDEÓN EDITABLE COMPLETO -->
    <template v-if="localData.feedMode === 'manual'">
      <CardAccordionItem
        v-for="(card, index) in localData.cards"
        :edit-key="`cards.${index}`"
        :key="card.id"
        :title="card.title"
        :index="index"
        :total="localData.cards.length"
        :open="openIndex === index"
        remove-label="Quitar publicación"
        @toggle="toggle(Number(index))"
        @move="moveCard(Number(index), $event)"
        @remove="removeCard(Number(index))"
      >
        <div>
          <EditorTextarea v-model="card.title" data-edit-target=".title" class="mb-2" label="Título" :rows="2" />

          <EditorImage
            v-model="card.image"
            v-model:alt="card.imageAlt"
            :focus-values="card.imageFocusProfiles"
            :focus-modes="imageFocusModes"
            focus-ratio="16 / 9"
            focus-crop-preview
            data-edit-target=".image"
            alt-edit-target=".imageAlt"
            class="mb-2"
            @select="$emit('select-image', { item: card, field: 'image' })"
            @update:focus-values="saveImageFocusProfiles(card, $event)"
          />

          <EditorUrl v-model="card.href" v-model:target="card.target" data-edit-target=".href" class="mb-2" label="Destino" />

          <label class="form-label">Fecha</label>
          <input v-model="card.date" data-edit-target=".date" type="date" class="form-control form-control-sm" />
          <p class="ps-hint mt-1">
            <template v-if="preview(card.date)">
              En la tarjeta se verá <strong>{{ preview(card.date) }}</strong>.
            </template>
            <template v-else-if="card.date">
              Se conserva lo anterior: <strong>{{ card.date }}</strong>.
            </template>
            <template v-else>
              Elige una fecha y se mostrará en formato día, mes y año.
            </template>
          </p>

          <EditorText
            v-model="card.ctaLabel"
            data-edit-target=".ctaLabel"
            class="mb-2"
            label="Texto del enlace"
            placeholder="Leer artículo"
          />

          <BadgeListEditor :badges="card.badges" data-edit-target=".badges" />
        </div>
      </CardAccordionItem>

      <button type="button" class="btn btn-sm btn-danger w-100" @click="addCard">
        <i class="las la-plus me-1"></i> Agregar publicación manual
      </button>
    </template>

    <!-- MODO DINÁMICO: LISTA RESUMIDA CON DETALLE -->
    <template v-else>
      <div v-if="localData.cards.length === 0" class="text-center p-3 border rounded bg-white text-muted small">
        <i class="las la-newspaper fs-4 d-block mb-1 text-secondary"></i>
        No se encontraron noticias con los filtros seleccionados.
        <br />
        <button type="button" class="btn btn-xs btn-outline-danger mt-2" @click="syncFeed">
          Reintentar consulta
        </button>
      </div>

      <div v-else class="list-group list-group-flush border rounded mb-2 bg-white">
        <div
          v-for="(card, idx) in localData.cards"
          :key="card.id || idx"
          class="list-group-item d-flex align-items-center gap-2 p-2"
        >
          <img
            v-if="card.image"
            :src="card.image"
            alt="Preview"
            class="rounded border"
            style="width: 44px; height: 32px; object-fit: cover; flex-shrink: 0;"
          />
          <div
            v-else
            class="rounded border bg-light d-flex align-items-center justify-content-center text-muted"
            style="width: 44px; height: 32px; flex-shrink: 0; font-size: 10px;"
          >
            <i class="las la-image"></i>
          </div>

          <div class="flex-grow-1 min-w-0" style="font-size: 11.5px; line-height: 1.25;">
            <div class="fw-semibold text-truncate text-dark">{{ card.title }}</div>
            <div class="text-muted d-flex align-items-center gap-2 mt-1" style="font-size: 10.5px;">
              <span><i class="las la-calendar me-1"></i>{{ card.date || 'Sin fecha' }}</span>
              <span v-if="card.badges?.length" class="badge bg-light text-secondary border">
                {{ card.badges[0] }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-xs btn-outline-secondary w-100"
        @click="convertFeedToManual"
        title="Convierte estas noticias traídas de la API en tarjetas manuales para editarlas individualmente"
      >
        <i class="las la-pencil-ruler me-1"></i> Desvincular de la API y editar textos manualmente
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor de la sección de publicaciones destacadas.
 * Soporta modo 'manual' y modo 'dynamic' (conexión en vivo a la API).
 */
import { ref, computed, onMounted, watch } from 'vue';
import CardSectionHeaderEditor from '../_shared/CardSectionHeaderEditor.vue';
import BadgeListEditor from '../_shared/BadgeListEditor.vue';
import CardAccordionItem from '../_shared/CardAccordionItem.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import { newCardId, normalizeCardCount, type PostCardItem } from '../_shared/types';
import { toDisplayDate } from '../_shared/date';
import {
  createImageFocusModes,
  normalizeImageFocus,
  normalizeImageFocusProfiles,
  saveImageFocusProfiles,
} from '../../../../helpers/imageFocus';
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';
import { usePostsFeed, type PostsFeedFilters, type RawPostEntity } from '../../../../composables/usePostsFeed';

const preview = (iso: string) => toDisplayDate(iso ?? '');

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

// Composable global del feed de noticias
const {
  academicUnits,
  categories,
  pending: loadingFeed,
  fetchFeed,
  fetchFilters,
  mapRawPostToCard,
} = usePostsFeed();

const feedStatusMsg = ref<string>('');
const imageFocusModes = createImageFocusModes('16 / 9');

const buildCard = (source: any): PostCardItem => {
  const imageFocusX = normalizeImageFocus(source?.imageFocusX);
  const imageFocusY = normalizeImageFocus(source?.imageFocusY);

  return {
    id: source?.id || newCardId(),
    image: source?.image ?? '',
    imageAlt: source?.imageAlt ?? '',
    imageFocusX,
    imageFocusY,
    imageFocusProfiles: normalizeImageFocusProfiles(
      source?.imageFocusProfiles,
      imageFocusX,
      imageFocusY,
    ),
    title: source?.title ?? '',
    href: source?.href ?? '',
    target: normalizeLinkTarget(source?.target),
    date: source?.date ?? '',
    ctaLabel: source?.ctaLabel ?? 'Leer artículo',
    badges: Array.isArray(source?.badges) ? [...source.badges] : [],
  };
};

const build = (source: any) => ({
  desc: source?.desc ?? '',
  title: source?.title ?? '',
  linkLabel: source?.linkLabel ?? '',
  linkUrl: source?.linkUrl ?? '',
  linkTarget: normalizeLinkTarget(source?.linkTarget),
  cardCount: normalizeCardCount(source?.cardCount),
  feedMode: source?.feedMode ?? (source?.cards?.length ? 'manual' : 'dynamic'),
  feedConfig: {
    academic_unit_id: source?.feedConfig?.academic_unit_id ?? 'all',
    category_id: source?.feedConfig?.category_id ?? 'all',
    type: source?.feedConfig?.type ?? 'news',
    limit: source?.feedConfig?.limit ?? normalizeCardCount(source?.cardCount),
  },
  cards: Array.isArray(source?.cards) ? source.cards.map(buildCard) : [],
});

const localData = ref(build(props.modelValue));

// Categorías filtradas por la Unidad Académica seleccionada
const availableCategories = computed(() => {
  const selectedUnit = localData.value.feedConfig.academic_unit_id;
  if (!selectedUnit || selectedUnit === 'all') {
    return categories.value;
  }
  return categories.value.filter((cat) => String(cat.academic_unit_id) === String(selectedUnit));
});

const openIndex = ref<number | null>(null);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addCard = () => {
  localData.value.cards.push(buildCard({}));
  openIndex.value = localData.value.cards.length - 1;
};

const removeCard = (index: number) => {
  localData.value.cards.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveCard = (index: number, delta: number) => {
  const target = index + delta;
  const list = localData.value.cards;
  if (target < 0 || target >= list.length) return;

  [list[index], list[target]] = [list[target], list[index]];
  if (openIndex.value === index) openIndex.value = target;
  else if (openIndex.value === target) openIndex.value = index;
};

const setFeedMode = (mode: 'manual' | 'dynamic') => {
  localData.value.feedMode = mode;
  if (mode === 'dynamic' && localData.value.cards.length === 0) {
    syncFeed();
  }
};

const convertFeedToManual = () => {
  localData.value.feedMode = 'manual';
  feedStatusMsg.value = 'Tarjetas desacopladas. Ahora puedes editarlas manualmente.';
};

const syncFeed = async () => {
  try {
    const filters: PostsFeedFilters = {
      academic_unit_id: localData.value.feedConfig.academic_unit_id,
      category_id: localData.value.feedConfig.category_id,
      type: localData.value.feedConfig.type,
      limit: localData.value.cardCount || 4,
    };

    const rawList = await fetchFeed(filters);
    const mapped = rawList.map((item: RawPostEntity, i: number) => mapRawPostToCard(item, i));
    localData.value.cards = mapped;
    feedStatusMsg.value = `Se cargaron ${mapped.length} publicaciones de la API.`;
  } catch (e: any) {
    feedStatusMsg.value = 'No se pudo conectar con la API de noticias.';
  }
};

const onFilterChanged = () => {
  syncFeed();
};

onMounted(async () => {
  await fetchFilters();
  // Si arranca en modo dinámico y no tiene tarjetas precargadas, sincronizar
  if (localData.value.feedMode === 'dynamic' && localData.value.cards.length === 0) {
    await syncFeed();
  }
});

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
.ps-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}
.x-small {
  font-size: 11px;
}
.feed-config-panel {
  background-color: #f8fafc;
}
</style>

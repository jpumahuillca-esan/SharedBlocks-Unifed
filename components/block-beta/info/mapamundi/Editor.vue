<template>
  <div class="mm-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Encabezado</h6>

    <label class="form-label">Etiqueta superior</label>
    <p class="mm-hint">Texto corto en rojo sobre el título. Vacío la oculta.</p>
    <input
      v-model="localData.eyebrow"
      type="text"
      class="form-control form-control-sm mb-2"
      placeholder="ESAN Global Experience"
    />

    <label class="form-label">Título</label>
    <textarea v-model="localData.title" class="form-control form-control-sm mb-2" rows="2"></textarea>

    <p class="mm-hint">
      <i class="las la-globe-americas me-1"></i>
      El mapa del centro y los logos de las tarjetas son fijos: no se editan desde aquí.
    </p>

    <template v-for="side in SIDES" :key="side.key">
      <hr />

      <div class="d-flex align-items-center justify-content-between mb-1">
        <h6 class="fw-bold small text-uppercase m-0">{{ side.title }}</h6>
        <span class="badge bg-secondary">{{ localData[side.key].items.length }}</span>
      </div>
      <p class="mm-hint">{{ side.hint }}</p>

      <CardAccordionItem
        v-for="(item, index) in localData[side.key].items"
        :key="item.id"
        :title="item.text"
        :index="index"
        :total="localData[side.key].items.length"
        :open="isOpen(side.key, index)"
        remove-label="Quitar ítem"
        @toggle="toggle(side.key, index)"
        @move="moveItem(side.key, index, $event)"
        @remove="removeItem(side.key, index)"
      >
        <div>
          <label class="form-label">Pictograma</label>
          <div class="d-flex align-items-center gap-2 mb-2">
            <!--
              Vista previa del dibujo elegido: los nombres solos no bastan para
              distinguir dos pictogramas de personas. Se pinta con v-html y no
              con AtomPictogram porque el panel no está dentro de .arcis-scope y
              la clase del átomo no tendría estilos aquí.
            -->
            <span
              class="mm-icon-preview"
              :class="{ 'is-empty': !pictogramSvg(item.icon) }"
              aria-hidden="true"
              v-html="pictogramSvg(item.icon)"
            ></span>
            <select v-model="item.icon" class="form-select form-select-sm">
              <option value="">Sin pictograma</option>
              <option v-for="option in PICTOGRAM_OPTIONS" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <label class="form-label">Texto</label>
          <textarea v-model="item.text" class="form-control form-control-sm" rows="2"></textarea>
          <p class="mm-hint mt-1">Un ítem sin texto no se muestra.</p>
        </div>
      </CardAccordionItem>

      <button type="button" class="btn btn-sm btn-danger w-100 mt-1" @click="addItem(side.key)">
        <i class="las la-plus me-1"></i> Agregar ítem
      </button>
    </template>

    <hr />

    <h6 class="fw-bold small text-uppercase mb-1">Botón</h6>

    <label class="form-label">Texto del botón</label>
    <p class="mm-hint">Vacío oculta el botón.</p>
    <input
      v-model="localData.button.label"
      type="text"
      class="form-control form-control-sm mb-2"
      placeholder="Descubre ESAN Internacional"
    />

    <label class="form-label">Destino del botón</label>
    <input
      v-model="localData.button.url"
      type="text"
      class="form-control form-control-sm"
      placeholder="/ruta o https://"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Editor del mapamundi.
 *
 * Las dos tarjetas tienen exactamente los mismos campos, así que el panel se
 * escribe una vez y se repite por lado (SIDES), en vez de duplicar el marcado.
 */
import { ref, watch } from 'vue';
/*
 * El acordeón viene de la familia `events`, igual que en `testimonials`. Con
 * esta ya son tres familias usándolo: conviene subirlo a block-beta/_shared/
 * en un cambio aparte que toque los tres editores a la vez.
 */
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import { PICTOGRAM_OPTIONS, getPictogramSvg } from '../../../../helpers/pictograms';

type SideKey = 'left' | 'right';

/*
 * El título de cada panel nombra la escuela y no solo el lado: el logo ya no se
 * ve en el editor, y así queda claro a qué tarjeta pertenece cada lista.
 */
const SIDES: Array<{ key: SideKey; title: string; hint: string }> = [
  { key: 'left', title: 'ESAN University', hint: 'Tarjeta izquierda.' },
  { key: 'right', title: 'ESAN Graduate School of Business', hint: 'Tarjeta derecha.' },
];

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue']);

const newItemId = () => `mm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const buildItem = (source: any) => ({
  id: source?.id || newItemId(),
  icon: source?.icon ?? '',
  text: source?.text ?? '',
});

/* Solo la lista: el logo de cada tarjeta es fijo y lo pone el bloque. */
const buildCard = (source: any) => ({
  items: Array.isArray(source?.items) ? source.items.map(buildItem) : [],
});

const build = (source: any) => ({
  eyebrow: source?.eyebrow ?? '',
  title: source?.title ?? '',
  left: buildCard(source?.left),
  right: buildCard(source?.right),
  button: {
    label: source?.button?.label ?? '',
    url: source?.button?.url ?? '',
  },
});

const localData = ref(build(props.modelValue));

const pictogramSvg = (name: string) => getPictogramSvg(name);

/*
 * Un solo ítem abierto en todo el panel, no uno por tarjeta: con un ítem
 * abierto en cada lado habría que desplazarse entre los dos para seguir
 * editando.
 */
const openKey = ref<string | null>(null);

const keyOf = (side: SideKey, index: number) => `${side}:${index}`;

const isOpen = (side: SideKey, index: number) => openKey.value === keyOf(side, index);

const toggle = (side: SideKey, index: number) => {
  const key = keyOf(side, index);
  openKey.value = openKey.value === key ? null : key;
};

const addItem = (side: SideKey) => {
  const items = localData.value[side].items;
  items.push(buildItem({}));
  // El ítem nuevo se abre solo: es el que se va a rellenar.
  openKey.value = keyOf(side, items.length - 1);
};

const removeItem = (side: SideKey, index: number) => {
  localData.value[side].items.splice(index, 1);

  // El panel abierto se corrige para no quedar apuntando a otro ítem.
  const open = openKey.value;
  if (!open?.startsWith(`${side}:`)) return;

  const openIndex = Number(open.split(':')[1]);
  if (openIndex === index) openKey.value = null;
  else if (openIndex > index) openKey.value = keyOf(side, openIndex - 1);
};

const moveItem = (side: SideKey, index: number, delta: number) => {
  const target = index + delta;
  const list = localData.value[side].items;
  if (target < 0 || target >= list.length) return;

  [list[index], list[target]] = [list[target], list[index]];

  // El panel abierto viaja con su ítem.
  if (openKey.value === keyOf(side, index)) openKey.value = keyOf(side, target);
  else if (openKey.value === keyOf(side, target)) openKey.value = keyOf(side, index);
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
.mm-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

.mm-icon-preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  padding: 4px;
  border: 1px solid #dde3ec;
  border-radius: 7px;
  background: #fff;
  color: #e3173e;
}

.mm-icon-preview.is-empty {
  border-style: dashed;
  background: #f4f6fa;
}

/* El SVG llega por v-html: el ámbito del componente no lo alcanza sin :deep. */
.mm-icon-preview :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

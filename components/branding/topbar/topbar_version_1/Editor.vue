<template>
  <div class="topbar-v1-editor">
    <!-- Acceso principal -->
    <h6 class="fw-bold small text-uppercase mb-1">Acceso principal</h6>
    <p class="te-hint">El enlace en rojo, con el ícono, al principio de la franja.</p>

    <label class="form-label">Texto</label>
    <input
      v-model="localData.brandLabel"
      type="text"
      class="form-control form-control-sm mb-2"
      placeholder="Portal Académico"
    />

    <label class="form-label">Destino</label>
    <input
      v-model="localData.brandUrl"
      type="text"
      class="form-control form-control-sm"
      placeholder="/ruta o https://"
    />

    <hr />

    <!-- Las dos listas comparten el mismo panel -->
    <template v-for="group in GROUPS" :key="group.key">
      <div class="d-flex align-items-center justify-content-between mb-1">
        <h6 class="fw-bold small text-uppercase m-0">{{ group.title }}</h6>
        <span class="badge bg-secondary">{{ localData[group.key].length }}</span>
      </div>
      <p class="te-hint">{{ group.hint }}</p>

      <CardAccordionItem
        v-for="(item, index) in localData[group.key]"
        :key="item.id"
        :title="item.label"
        :index="index"
        :total="localData[group.key].length"
        :open="openKey === item.id"
        remove-label="Quitar enlace"
        @toggle="toggle(item.id)"
        @move="move(localData[group.key], index, $event)"
        @remove="localData[group.key].splice(index, 1)"
      >
        <label class="form-label">Texto</label>
        <input
          v-model="item.label"
          type="text"
          class="form-control form-control-sm mb-2"
          :placeholder="group.placeholder"
        />

        <label class="form-label">Destino</label>
        <p class="te-hint">Si tiene opciones, se ignora: el texto abre el desplegable.</p>
        <input
          v-model="item.url"
          type="text"
          class="form-control form-control-sm mb-2"
          placeholder="/ruta o https://"
        />

        <label class="form-label">Opciones del desplegable</label>
        <p class="te-hint">Con al menos una, el enlace pasa a ser un desplegable con flecha.</p>
        <div v-for="(child, childIndex) in item.children" :key="child.id" class="te-row">
          <div class="te-row__fields">
            <input
              v-model="child.label"
              type="text"
              class="form-control form-control-sm"
              placeholder="Texto"
            />
            <input
              v-model="child.url"
              type="text"
              class="form-control form-control-sm"
              placeholder="/ruta o https://"
            />
          </div>
          <div class="te-row__actions">
            <button
              type="button"
              class="te-row__btn"
              title="Subir"
              :disabled="childIndex === 0"
              @click="move(item.children, childIndex, -1)"
            >
              <i class="las la-arrow-up"></i>
            </button>
            <button
              type="button"
              class="te-row__btn"
              title="Bajar"
              :disabled="childIndex === item.children.length - 1"
              @click="move(item.children, childIndex, 1)"
            >
              <i class="las la-arrow-down"></i>
            </button>
            <button
              type="button"
              class="te-row__btn is-danger"
              title="Quitar opción"
              @click="item.children.splice(childIndex, 1)"
            >
              <i class="las la-trash"></i>
            </button>
          </div>
        </div>

        <button
          type="button"
          class="btn btn-sm btn-outline-secondary w-100"
          @click="item.children.push(buildLink({}))"
        >
          <i class="las la-plus me-1"></i> Agregar opción
        </button>
      </CardAccordionItem>

      <button
        type="button"
        class="btn btn-sm btn-outline-danger w-100"
        @click="addItem(group.key)"
      >
        <i class="las la-plus me-1"></i> Agregar enlace
      </button>

      <hr />
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor del topbar, versión 1.
 *
 * Mismo patrón que los editores de block-beta: una copia local construida con
 * valores por defecto, que se emite en cuanto cambia. Las dos listas (junto al
 * portal y al otro lado) tienen la misma forma: un enlace que, si lleva
 * opciones, se dibuja como desplegable.
 */
import { ref, watch } from 'vue';
import CardAccordionItem from '../../../block-beta/events/_shared/CardAccordionItem.vue';

type GroupKey = 'startItems' | 'endItems';

interface TopbarLink { id: string; label: string; url: string }
interface TopbarItem extends TopbarLink { children: TopbarLink[] }

const GROUPS: Array<{ key: GroupKey; title: string; hint: string; placeholder: string }> = [
  {
    key: 'startItems',
    title: 'Junto al acceso principal',
    hint: 'Pegados al portal, a la izquierda. Se ven en todos los tamaños.',
    placeholder: 'Admisión',
  },
  {
    key: 'endItems',
    title: 'Al otro lado',
    hint: 'Pegados al borde derecho. Solo en escritorio: en tableta y teléfono se ocultan.',
    placeholder: 'Centro de Idiomas',
  },
];

const props = defineProps<{ modelValue: any }>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const text = (value: unknown) => (typeof value === 'string' ? value : '');
const list = (value: unknown): any[] => (Array.isArray(value) ? value : []);

const buildLink = (source: any): TopbarLink => ({
  id: source?.id || newId('tl'),
  label: text(source?.label),
  url: text(source?.url),
});

const buildItem = (source: any): TopbarItem => ({
  ...buildLink(source),
  children: list(source?.children).map(buildLink),
});

const build = (source: any) => ({
  brandLabel: text(source?.brandLabel),
  brandUrl: text(source?.brandUrl),
  startItems: list(source?.startItems).map(buildItem),
  endItems: list(source?.endItems).map(buildItem),
});

const localData = ref(build(props.modelValue));

/* Un solo panel abierto entre las dos listas; los id no se repiten entre ellas. */
const openKey = ref<string | null>(null);

const toggle = (key: string) => {
  openKey.value = openKey.value === key ? null : key;
};

/** Mueve un elemento de cualquiera de las listas un puesto arriba o abajo. */
const move = (items: any[], index: number, delta: number) => {
  const target = index + delta;
  if (target < 0 || target >= items.length) return;
  [items[index], items[target]] = [items[target], items[index]];
};

const addItem = (group: GroupKey) => {
  const item = buildItem({});
  localData.value[group].push(item);
  // El nuevo se abre solo: es el que se va a rellenar.
  openKey.value = item.id;
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
.te-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

/* Fila de una opción: campos a la izquierda, acciones a la derecha. */
.te-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 8px;
  padding: 6px;
  border: 1px solid #dde3ec;
  border-radius: 7px;
  background: #fff;
}

.te-row__fields {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.te-row__actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.te-row__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
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

.te-row__btn:hover:not(:disabled) {
  background: #eef1f6;
  color: #212529;
}

.te-row__btn.is-danger:hover:not(:disabled) {
  background: #dc3545;
  color: #fff;
}

.te-row__btn:disabled {
  opacity: 0.35;
  cursor: default;
}
</style>

<template>
  <div class="mega-menu-beta-editor">
    <!-- Identidad -->
    <h6 class="fw-bold small text-uppercase mb-1">Logo</h6>
    <p class="me-hint">Sin imagen se usa el logo oficial de ESAN.</p>

    <div class="me-logo-preview mb-2">
      <img :src="localData.logoUrl || defaultLogo" alt="" :style="{ height: `${localData.logoHeight}px` }" />
    </div>
    <div class="d-flex gap-2 mb-2">
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary flex-grow-1"
        @click="$emit('select-image', { item: localData, field: 'logoUrl' })"
      >
        <i class="las la-image me-1"></i>
        {{ localData.logoUrl ? 'Cambiar logo' : 'Subir logo' }}
      </button>
      <button
        v-if="localData.logoUrl"
        type="button"
        class="btn btn-sm btn-outline-danger"
        title="Volver al logo oficial"
        @click="localData.logoUrl = ''"
      >
        <i class="las la-undo"></i>
      </button>
    </div>

    <label class="form-label">Texto alternativo del logo</label>
    <p class="me-hint">
      El nombre de la unidad, para buscadores y lectores de pantalla. Vacío, se
      usa "Universidad ESAN" con el logo oficial y "Inicio" con uno propio.
    </p>
    <input
      v-model="localData.logoAlt"
      type="text"
      class="form-control form-control-sm mb-2"
      placeholder="Universidad ESAN"
    />

    <div class="d-flex justify-content-between">
      <label class="form-label mb-0">Alto en escritorio</label>
      <span class="badge bg-light text-dark border">{{ localData.logoHeight }}px</span>
    </div>
    <p class="me-hint">En tableta y teléfono se reduce en proporción.</p>
    <input v-model.number="localData.logoHeight" type="range" class="form-range mb-2" min="24" max="64" step="2" />

    <label class="form-label">Destino del logo</label>
    <input v-model="localData.urlRedict" type="text" class="form-control form-control-sm mb-2" placeholder="/" />

    <label class="form-label">Destino de la búsqueda</label>
    <p class="me-hint">La página a la que lleva el botón rojo de la lupa. Vacío, la lupa no se muestra.</p>
    <input v-model="localData.searchUrl" type="text" class="form-control form-control-sm" placeholder="/buscar" />

    <hr />

    <!-- Menú -->
    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Menú</h6>
      <span class="badge bg-secondary">{{ localData.menu_tree.length }}</span>
    </div>
    <p class="me-hint">
      Las entradas y sus enlaces salen del <strong>Menú Institucional</strong>
      (panel izquierdo) y se editan en <strong>Menús</strong>. Aquí se ajusta lo
      propio de la cabecera: el título de cada panel y el diseño de cada pestaña.
    </p>

    <p v-if="!localData.menu_tree.length" class="me-empty">
      Todavía no hay menú. Vincula uno en <strong>Menú Institucional</strong>.
    </p>

    <div v-for="root in localData.menu_tree" :key="root.id" class="me-root" :class="{ 'is-open': openId === root.id }">
      <button type="button" class="me-root__head" :aria-expanded="openId === root.id" @click="toggle(root.id)">
        <i class="las" :class="openId === root.id ? 'la-angle-down' : 'la-angle-right'"></i>
        <span class="me-root__title">{{ root.title || 'Sin título' }}</span>
        <span class="me-root__count">{{ root.children?.length || 0 }}</span>
      </button>

      <div v-if="openId === root.id" class="me-root__body">
        <label class="form-label">Título del panel</label>
        <p class="me-hint">Encabeza el panel, con la flecha roja. Vacío, se usa el de la entrada.</p>
        <input
          v-model="root.header_title"
          type="text"
          class="form-control form-control-sm mb-2"
          :placeholder="root.title || 'ESAN University'"
        />

        <label class="form-label">Destino del título</label>
        <input v-model="root.url" type="text" class="form-control form-control-sm mb-3" placeholder="/universidad" />

        <p v-if="!root.children?.length" class="me-hint mb-0">Esta entrada no tiene submenú: es un enlace directo.</p>

        <div v-for="tab in root.children" :key="tab.id" class="me-tab">
          <div class="me-tab__head">
            <span class="me-tab__title">{{ tab.title || 'Sin título' }}</span>
            <select v-model="tab.layout" class="form-select form-select-sm me-tab__layout">
              <option value="columns">Columnas de grupos</option>
              <option value="banner_split">Lista con banner</option>
            </select>
          </div>

          <template v-if="tab.layout === 'banner_split'">
            <div class="me-banner-preview mb-2">
              <img v-if="tab.banner_image" :src="tab.banner_image" alt="" />
              <span v-else class="small">Banner</span>
            </div>
            <div class="d-flex gap-2 mb-2">
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary flex-grow-1"
                @click="$emit('select-image', { item: tab, field: 'banner_image' })"
              >
                <i class="las la-image me-1"></i>
                {{ tab.banner_image ? 'Cambiar banner' : 'Subir banner' }}
              </button>
              <button
                v-if="tab.banner_image"
                type="button"
                class="btn btn-sm btn-outline-danger"
                title="Quitar banner"
                @click="tab.banner_image = ''"
              >
                <i class="las la-trash"></i>
              </button>
            </div>
            <input
              v-model="tab.banner_title"
              type="text"
              class="form-control form-control-sm mb-1"
              placeholder="Texto sobre el banner (opcional)"
            />
            <input
              v-model="tab.banner_url"
              type="text"
              class="form-control form-control-sm"
              placeholder="Destino del banner (opcional)"
            />
          </template>
          <p v-else class="me-hint mb-0">
            {{ tab.children?.length || 0 }} grupos, en columnas de tres.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor de la cabecera mega_menu_beta.
 *
 * Mismo patrón que los editores de block-beta: una copia local que se emite en
 * cuanto cambia.
 *
 * El árbol del menú (`menu_tree`) no se crea aquí: lo arma useUnitBranding a
 * partir del Menú Institucional, y al recargarlo conserva lo que este editor
 * añade —título del panel, destinos, diseño y banner de cada pestaña—, pero
 * vuelve a tomar títulos y estructura del menú. Por eso aquí solo se editan
 * esos campos, y títulos y estructura se editan en Menús.
 */
import { ref, watch } from 'vue';
import defaultLogo from '../../../../assets/images/logos/logo-esan-official.svg';

const props = defineProps<{ modelValue: any }>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const text = (value: unknown) => (typeof value === 'string' ? value : '');

/*
 * El resto de campos se conserva tal cual (`...source`): menu_tree trae
 * niveles 3 y 4 que este editor no toca, y no deben perderse al guardar.
 */
const build = (source: any) => ({
  ...(source || {}),
  logoUrl: text(source?.logoUrl),
  logoAlt: text(source?.logoAlt),
  logoHeight: Number(source?.logoHeight) || 36,
  urlRedict: text(source?.urlRedict) || '/',
  searchUrl: text(source?.searchUrl),
  menu_tree: Array.isArray(source?.menu_tree) ? JSON.parse(JSON.stringify(source.menu_tree)) : [],
});

const localData = ref(build(props.modelValue));

/* Una entrada abierta a la vez, para que el panel no se haga interminable. */
const openId = ref<string | number | null>(null);

const toggle = (id: string | number) => {
  openId.value = openId.value === id ? null : id;
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
.me-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

.me-empty {
  padding: 12px;
  border: 1px dashed #c6cedb;
  border-radius: 7px;
  font-size: 12px;
  color: #6b7688;
  text-align: center;
}

.me-logo-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70px;
  padding: 8px;
  border: 1px dashed #c6cedb;
  border-radius: 7px;
  background: #fff;
  overflow: hidden;
}

.me-logo-preview img {
  max-width: 100%;
  object-fit: contain;
}

.me-root {
  margin-bottom: 6px;
  border: 1px solid #dde3ec;
  border-radius: 7px;
  overflow: hidden;
}

.me-root.is-open {
  border-color: #c6cedb;
}

.me-root__head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: #f4f6fa;
  text-align: left;
  cursor: pointer;
}

.me-root__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  color: #212529;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.me-root__count {
  font-size: 11px;
  color: #6b7688;
}

.me-root__body {
  padding: 10px;
  background: #fff;
}

.me-tab {
  margin-bottom: 8px;
  padding: 8px;
  border: 1px solid #dde3ec;
  border-radius: 7px;
  background: #fafbfd;
}

.me-tab__head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.me-tab__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 12.5px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.me-tab__layout {
  width: auto;
  font-size: 11.5px;
}

.me-banner-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16 / 9;
  border-radius: 7px;
  background: #bdbdbd;
  color: #fff;
  overflow: hidden;
}

.me-banner-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

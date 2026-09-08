<!-- src/shared/components/branding/header-mega/HeaderMegaEditor.vue -->
<template>
  <div class="header-mega-editor p-3 bg-white h-100 overflow-auto custom-scrollbar">
    <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
      <h6 class="fw-bold text-dark m-0 small text-uppercase">
        <i class="las la-sliders-h text-danger me-1"></i> Personalización de Mega Menú
      </h6>
      <span class="badge bg-secondary font-monospace">{{ localData.menu_tree?.length || 0 }} Secciones</span>
    </div>

    <!-- SECCIONES DE NIVEL 1 -->
    <div v-for="(l1, i1) in localData.menu_tree" :key="l1.id || i1" class="card mb-3 border shadow-sm">
      <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center">
        <span class="fw-bold small text-dark"><i class="las la-folder text-danger me-1"></i> {{ l1.title }}</span>
        <span class="badge bg-danger bg-opacity-10 text-danger border border-danger-subtle">Nivel 1</span>
      </div>

      <div class="card-body p-2">
        <div class="row g-2 mb-2">
          <div class="col-7">
            <label class="small text-muted fw-bold mb-1">Título Encabezado (H3)</label>
            <input type="text" class="form-control form-control-sm" v-model="l1.header_title" placeholder="Ej: ESAN University" />
          </div>
          <div class="col-5">
            <label class="small text-muted fw-bold mb-1">URL Principal</label>
            <input type="text" class="form-control form-control-sm" v-model="l1.url" placeholder="/universidad" />
          </div>
        </div>

        <!-- PESTAÑAS DE NIVEL 2 -->
        <div class="border-top pt-2 mt-2">
          <label class="small text-muted fw-bold d-block mb-1">Pestañas Laterales (Nivel 2)</label>

          <div v-for="(tab, i2) in l1.children" :key="tab.id || i2" class="p-2 mb-2 bg-light rounded border">
            <div class="row g-1 align-items-center mb-2">
              <div class="col-5">
                <input type="text" class="form-control form-control-sm fw-bold" v-model="tab.title" placeholder="Pestaña (Pregrado)" />
              </div>
              <div class="col-3">
                <input type="text" class="form-control form-control-sm" v-model="tab.url" placeholder="/pregrado" />
              </div>
              <div class="col-4">
                <select v-model="tab.layout" class="form-select form-select-sm" style="font-size: 0.72rem;">
                  <option value="columns">Modo Agrupado (Columnas)</option>
                  <option value="banner_split">Modo Lista + Banner</option>
                </select>
              </div>
            </div>

            <!-- MODO 1: GRUPOS / COLUMNAS (Nivel 3) + ENLACES (Nivel 4) -->
            <div v-if="tab.layout === 'columns'" class="p-2 bg-white rounded border mt-1">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <small class="fw-bold text-muted">Grupos / Facultades (Columnas)</small>
                <button type="button" class="btn btn-xs btn-outline-primary py-0" @click="addGroupColumn(tab)">
                  + Columna
                </button>
              </div>

              <div v-for="(group, ig) in tab.children" :key="ig" class="p-2 mb-2 bg-light rounded border">
                <div class="d-flex gap-1 mb-1">
                  <input type="text" class="form-control form-control-sm fw-bold" v-model="group.title" placeholder="Facultad (ej: ESAN Economics)" />
                  <input type="text" class="form-control form-control-sm w-50" v-model="group.url" placeholder="URL (opcional)" />
                  <button type="button" class="btn btn-sm text-danger p-0 border-0" @click="tab.children.splice(ig, 1)">
                    <i class="las la-times"></i>
                  </button>
                </div>

                <!-- Enlaces dentro de la Columna (Nivel 4) -->
                <div v-for="(sub, isub) in group.children" :key="isub" class="d-flex gap-1 mb-1">
                  <input type="text" class="form-control form-control-sm" v-model="sub.title" placeholder="Carrera/Enlace" />
                  <input type="text" class="form-control form-control-sm" v-model="sub.url" placeholder="/carreras/..." />
                  <button type="button" class="btn btn-sm text-danger p-0 border-0" @click="group.children.splice(isub, 1)">
                    <i class="las la-minus-circle"></i>
                  </button>
                </div>
                <button type="button" class="btn btn-xs btn-link text-decoration-none p-0" @click="addLink(group)">
                  + Agregar Carrera/Enlace
                </button>
              </div>
            </div>

            <!-- MODO 2: LISTA DIRECTA + BANNER LATERAL -->
            <div v-else-if="tab.layout === 'banner_split'" class="p-2 bg-white rounded border mt-1">
              <small class="fw-bold text-muted d-block mb-1">Banner Promocional</small>
              <div class="input-group input-group-sm mb-1">
                <input type="text" class="form-control" v-model="tab.banner_image" placeholder="URL Imagen..." />
                <button class="btn btn-outline-danger" type="button" @click="$emit('select-image', { item: tab, field: 'banner_image' })">
                  <i class="las la-image"></i>
                </button>
              </div>
              <div class="row g-1 mb-2">
                <div class="col-6">
                  <input type="text" class="form-control form-control-sm" v-model="tab.banner_title" placeholder="Título sobre Banner" />
                </div>
                <div class="col-6">
                  <input type="text" class="form-control form-control-sm" v-model="tab.banner_url" placeholder="URL Destino Banner" />
                </div>
              </div>

              <!-- Enlaces Directos (Nivel 3) -->
              <small class="fw-bold text-muted d-block mb-1">Enlaces de Lista Directa</small>
              <div v-for="(item, il) in tab.children" :key="il" class="d-flex gap-1 mb-1">
                <input type="text" class="form-control form-control-sm" v-model="item.title" placeholder="Texto (ej: MBA Tiempo Parcial)" />
                <input type="text" class="form-control form-control-sm" v-model="item.url" placeholder="/mba/..." />
                <button type="button" class="btn btn-sm text-danger p-0 border-0" @click="tab.children.splice(il, 1)">
                  <i class="las la-minus-circle"></i>
                </button>
              </div>
              <button type="button" class="btn btn-xs btn-outline-secondary w-100 mt-1 py-0" @click="addLink(tab)">
                + Enlace Directo
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';

const props = defineProps<{ modelValue: Record<string, any> }>();
const emit = defineEmits<{
  (e: 'update:modelValue', val: Record<string, any>): void;
  (e: 'select-image', payload: any): void;
}>();

const localData = reactive({
  ...props.modelValue,
  menu_tree: props.modelValue?.menu_tree ? JSON.parse(JSON.stringify(props.modelValue.menu_tree)) : []
});

watch(localData, (newVal) => {
  emit('update:modelValue', JSON.parse(JSON.stringify(newVal)));
}, { deep: true });

watch(
  () => props.modelValue?.menu_tree,
  (newTree) => {
    if (newTree && JSON.stringify(localData.menu_tree) !== JSON.stringify(newTree)) {
      localData.menu_tree = JSON.parse(JSON.stringify(newTree));
    }
  },
  { deep: true }
);

const addGroupColumn = (tab: any) => {
  if (!tab.children) tab.children = [];
  tab.children.push({
    id: crypto.randomUUID(),
    title: 'Nueva Facultad / Área',
    url: '',
    children: []
  });
};

const addLink = (parent: any) => {
  if (!parent.children) parent.children = [];
  parent.children.push({
    id: crypto.randomUUID(),
    title: 'Nuevo Enlace',
    url: '#'
  });
};
</script>

<style scoped>
.btn-xs { font-size: 0.72rem; padding: 2px 6px; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 4px; }
</style>
<template>
  <div class="pro-editor bg-white rounded-4 border p-4 shadow-sm h-100 flex-column d-flex">
    <h6 class="fw-bold text-dark mb-4 pb-3 border-bottom d-flex align-items-center tracking-tight">
      <i class="bi bi-gear-fill text-danger fs-4 me-2"></i> Ajustes de Cabecera Mega
    </h6>

    <div class="flex-grow-1 overflow-auto pe-2 pb-4 custom-scrollbar">
      
      <!-- SECCIÓN 1: LOGO -->
      <div class="mb-4">
        <label class="section-title text-uppercase small text-muted mb-3 d-block">1. Logo Principal</label>
        <div class="bg-light p-3 rounded-3 border">
          <div class="mb-3">
            <label class="small text-muted mb-1 fw-bold">Imagen del Logo</label>
            <div class="input-group">
              <input type="text" class="form-control form-control-sm" v-model="localData.logoUrl" placeholder="URL o seleccionar...">
              <button class="btn btn-sm btn-danger" type="button" @click="$emit('select-image', 'logoUrl')">
                <i class="bi bi-image"></i>
              </button>
            </div>
          </div>
          
          <div class="row g-3 pt-2 border-top">
            <div class="col-6">
              <label class="small text-muted d-block mb-1 fw-bold">Altura Normal: <span class="badge bg-secondary">{{ localData.logoHeight }}px</span></label>
              <input type="range" class="form-range" min="30" max="100" step="5" v-model.number="localData.logoHeight">
            </div>
            <div class="col-6">
              <label class="small text-muted d-block mb-1 fw-bold">Altura Scrolled: <span class="badge bg-secondary">{{ localData.logoHeightScrolled }}px</span></label>
              <input type="range" class="form-range" min="20" max="80" step="5" v-model.number="localData.logoHeightScrolled">
            </div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 2: COLORES NAVBAR -->
      <div class="mb-4">
        <label class="section-title text-uppercase small text-muted mb-3 d-block">2. Paleta de Color (Navbar)</label>
        <div class="bg-light p-3 rounded-3 border">
          <div class="row g-2">
            <div class="col-6">
              <label class="small text-muted mb-1 fw-bold">Fondo General</label>
              <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.navBgColor">
            </div>
            <div class="col-6">
              <label class="small text-muted mb-1 fw-bold">Texto (Hover/Active)</label>
              <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.navHoverColor">
            </div>
            <div class="col-6">
              <label class="small text-muted mb-1 fw-bold">Texto Normal</label>
              <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.navTextColor">
            </div>
            <div class="col-6">
              <label class="small text-muted mb-1 fw-bold">Texto Transparente</label>
              <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.navTransparentTextColor">
            </div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 3: TOP BAR -->
      <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3 pb-1">
          <label class="section-title text-uppercase small text-muted mb-0 d-block">3. Cinta Superior (Top Bar)</label>
          <div class="form-check form-switch form-switch-md m-0">
            <input class="form-check-input" type="checkbox" v-model="localData.showTopBar" id="sw-topbar">
          </div>
        </div>

        <div v-if="localData.showTopBar" class="bg-light p-3 rounded-3 border">
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="small text-muted mb-1">Fondo TopBar</label>
              <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.topBarBgColor">
            </div>
            <div class="col-6">
              <label class="small text-muted mb-1">Texto TopBar</label>
              <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.topBarTextColor">
            </div>
          </div>

          <hr class="text-muted opacity-25 my-3">
          <label class="small text-muted mb-2 d-block fw-bold">Botón de Acción (CTA)</label>
          <div class="d-flex gap-2 mb-3">
            <input type="text" class="form-control form-control-sm w-50" v-model="localData.ctaText" placeholder="Texto (ej: PORTAL)">
            <input type="text" class="form-control form-control-sm w-50" v-model="localData.ctaUrl" placeholder="URL (#)">
          </div>

          <hr class="text-muted opacity-25 my-3">
          <label class="small text-muted mb-2 d-block fw-bold">Redes Sociales</label>
          <SocialLinksManager :items="localData.socialLinks" class="mb-3" />

          <hr class="text-muted opacity-25 my-3">
          <label class="small text-muted mb-2 d-block fw-bold">Enlaces Secundarios</label>
          <div v-for="(link, i) in localData.topLinks" :key="i" class="d-flex gap-2 mb-2 align-items-center p-2 bg-white rounded border">
            <input type="text" class="form-control form-control-sm" v-model="link.text" placeholder="Texto">
            <input type="text" class="form-control form-control-sm" v-model="link.url" placeholder="URL">
            <button class="btn btn-sm text-danger p-1 border-0 bg-transparent" @click="localData.topLinks.splice(i, 1)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <button class="btn btn-sm btn-outline-primary dashed-btn w-100" @click="localData.topLinks.push({ text: 'Nuevo Enlace', url: '#', hasChild: false })">
            + Agregar Enlace Secundario
          </button>
        </div>
      </div>

      <!-- SECCIÓN 4: COMPORTAMIENTO -->
      <div>
        <label class="section-title text-uppercase small text-muted mb-3 d-block fw-bold">4. Comportamiento</label>
        <div class="bg-light p-3 rounded-3 border">
          <div class="form-check form-switch mb-2">
            <input class="form-check-input" type="checkbox" v-model="localData.isTransparent" id="sw-trans">
            <label class="form-check-label small fw-bold" for="sw-trans">Fondo Inicial Transparente (Overlay)</label>
          </div>
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" v-model="localData.sticky" id="sw-sticky">
            <label class="form-check-label small fw-bold" for="sw-sticky">Fijar al Hacer Scroll (Sticky)</label>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import SocialLinksManager from '../../../components/editor/SocialLinksManager.vue';

const props = defineProps<{ modelValue: Record<string, any> }>();
const emit = defineEmits<{
  (e: 'update:modelValue', val: Record<string, any>): void;
  (e: 'select-image', field: string): void;
}>();

const localData = reactive({
  logoUrl: props.modelValue?.logoUrl || '',
  logoHeight: Number(props.modelValue?.logoHeight) || 65,
  logoHeightScrolled: Number(props.modelValue?.logoHeightScrolled) || 45,
  sticky: props.modelValue?.sticky ?? true,
  isTransparent: props.modelValue?.isTransparent ?? true,
  showTopBar: props.modelValue?.showTopBar ?? true,
  topBarBgColor: props.modelValue?.topBarBgColor || '#e31140',
  topBarTextColor: props.modelValue?.topBarTextColor || '#ffffff',
  navBgColor: props.modelValue?.navBgColor || '#ffffff', 
  navTextColor: props.modelValue?.navTextColor || '#333333',
  navTransparentTextColor: props.modelValue?.navTransparentTextColor || '#ffffff',
  navHoverColor: props.modelValue?.navHoverColor || '#e31140',
  socialLinks: props.modelValue?.socialLinks ? JSON.parse(JSON.stringify(props.modelValue.socialLinks)) : [],
  topLinks: props.modelValue?.topLinks ? JSON.parse(JSON.stringify(props.modelValue.topLinks)) : [],
  ctaText: props.modelValue?.ctaText || '',
  ctaUrl: props.modelValue?.ctaUrl || '#',
  ctaIcon: props.modelValue?.ctaIcon || 'bi bi-arrow-right-circle'
});

watch(localData, (newVal) => {
  emit('update:modelValue', JSON.parse(JSON.stringify(newVal)));
}, { deep: true });

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && JSON.stringify(localData) !== JSON.stringify(newVal)) {
      Object.assign(localData, JSON.parse(JSON.stringify(newVal)));
    }
  },
  { deep: true }
);
</script>

<style scoped>
.tracking-tight { letter-spacing: -0.5px; }
.section-title { font-size: 0.75rem; font-weight: 800; letter-spacing: 0.5px; }
.dashed-btn { border-style: dashed; }
.form-check-input:checked { background-color: #e31140; border-color: #e31140; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 4px; }
</style>
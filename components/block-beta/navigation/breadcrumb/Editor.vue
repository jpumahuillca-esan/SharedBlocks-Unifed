<template>
  <div class="breadcrumb-editor p-1">
    <!-- MODO DE CONFIGURACIÓN -->
    <div class="btn-group w-100 mb-3 p-1 bg-white border rounded shadow-sm">
      <button
        type="button"
        class="btn btn-xs py-1"
        :class="localData.mode === 'dynamic' ? 'btn-danger text-white fw-semibold' : 'btn-light text-muted'"
        @click="setMode('dynamic')"
      >
        <i class="las la-sync-alt me-1"></i> Por Unidad de Página (Auto)
      </button>
      <button
        type="button"
        class="btn btn-xs py-1"
        :class="localData.mode === 'manual' ? 'btn-danger text-white fw-semibold' : 'btn-light text-muted'"
        @click="setMode('manual')"
      >
        <i class="las la-edit me-1"></i> Modo Manual
      </button>
    </div>

    <!-- MODO DINÁMICO: VINCULADO DIRECTO A LA PÁGINA -->
    <div v-if="localData.mode === 'dynamic'" class="feed-config-panel border rounded p-3 mb-3 bg-white">
      
      <!-- ESPACIO DE TRABAJO / UNIDAD DETECTADA -->
      <div class="border rounded p-2 bg-light mb-3">
        <div class="d-flex align-items-center justify-content-between">
          <span class="small fw-bold text-dark">
            <i class="las la-university text-danger me-1"></i> Unidad Académica:
          </span>
          <span class="badge bg-success-subtle text-success border border-success-subtle">
            <i class="las la-check-circle me-1"></i> {{ currentUnitName }}
          </span>
        </div>
        <div class="text-muted mt-1" style="font-size: 11px;">
          Detectada directamente de esta página. No necesitas cambiar tu sesión de Super-Admin.
        </div>

        <!-- OPCIÓN AVANZADA PARA SUPER-ADMIN: OVERRIDE DE UNIDAD -->
        <div class="mt-2 pt-2 border-top">
          <div class="d-flex align-items-center justify-content-between">
            <button
              type="button"
              class="btn btn-xs text-secondary p-0 text-decoration-none"
              style="font-size: 11px;"
              @click="showCustomUnitSelect = !showCustomUnitSelect"
            >
              <i class="las la-cog me-1"></i>
              {{ showCustomUnitSelect ? 'Ocultar selector de unidad' : '¿Cambiar unidad manualmente?' }}
            </button>
            <button
              v-if="isOverridden"
              type="button"
              class="btn btn-xs btn-outline-danger py-0 px-1"
              style="font-size: 10px;"
              title="Restablecer a la unidad original de la página"
              @click="resetToPageUnit"
            >
              Restablecer
            </button>
          </div>

          <div v-if="showCustomUnitSelect" class="mt-2">
            <select
              v-model="localData.academic_unit_id"
              class="form-select form-select-sm"
              @change="onUnitChanged"
            >
              <option :value="null">🏛️ Unidad de la página ({{ pageUnitName }})</option>
              <option value="all">🌐 Portal Central / Raíz</option>
              <option
                v-for="unit in academicUnits"
                :key="unit.id"
                :value="unit.id"
              >
                {{ unit.name }} {{ unit.slug ? `(/${unit.slug})` : '' }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- OPCIÓN DE INCLUIR PÁGINA ACTUAL O SOLO HASTA EL PENÚLTIMO -->
      <div class="mb-3 border rounded p-2 bg-light">
        <div class="form-check form-switch mb-1">
          <input
            id="breadcrumb-include-current"
            v-model="localData.includeCurrentPage"
            class="form-check-input"
            type="checkbox"
            @change="rebuildAutoPath"
          />
          <label class="form-check-label small fw-bold" for="breadcrumb-include-current">
            Incluir página actual al final
          </label>
        </div>
        <small class="text-muted d-block mb-2" style="font-size: 11px;">
          Si se desactiva, la ruta mostrará solo los niveles anteriores hasta el penúltimo.
        </small>

        <div v-if="localData.includeCurrentPage" class="mt-2">
          <label class="form-label text-dark small fw-semibold mb-1" style="font-size: 11px;">
            Texto de la página actual:
          </label>
          <input
            v-model="localData.currentPage"
            type="text"
            class="form-control form-control-sm"
            :placeholder="props.pageTitle || 'Título de página'"
            @input="rebuildAutoPath"
          />
        </div>
      </div>

      <!-- VISTA PREVIA DE LA RUTA GENERADA -->
      <div class="border rounded p-2 bg-light mb-2">
        <div class="small fw-bold text-secondary mb-1" style="font-size: 11px;">
          <i class="las la-route text-danger me-1"></i> Vista previa de la ruta:
        </div>
        <div class="d-flex flex-wrap align-items-center gap-1">
          <template v-for="(item, idx) in localData.items" :key="idx">
            <span
              v-if="idx < localData.items.length - 1 || !localData.includeCurrentPage"
              class="badge bg-white text-dark border px-2 py-1"
              style="font-size: 11px;"
            >
              {{ item.label }}
              <small class="text-muted ms-1">({{ item.href || '/' }})</small>
            </span>
            <span
              v-else
              class="badge bg-danger text-white px-2 py-1"
              style="font-size: 11px;"
            >
              {{ item.label }}
              <small class="opacity-75 ms-1">(actual)</small>
            </span>
            <i
              v-if="idx < localData.items.length - 1"
              class="las la-angle-right text-muted"
              style="font-size: 10px;"
            ></i>
          </template>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-xs btn-outline-secondary w-100 mt-2"
        @click="convertToManual"
      >
        <i class="las la-pencil-ruler me-1"></i> Desacoplar y editar niveles manualmente
      </button>
    </div>

    <!-- MODO MANUAL: EDICIÓN ÍTEM POR ÍTEM -->
    <div v-else class="bg-white border rounded p-3 mb-3">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <label class="form-label fw-bold text-dark small mb-0">
          <i class="las la-list text-danger me-1"></i> Niveles de la Ruta
        </label>
        <button
          type="button"
          class="btn btn-xs btn-outline-danger"
          @click="addCrumb"
        >
          <i class="las la-plus me-1"></i> Agregar nivel
        </button>
      </div>

      <div class="list-group list-group-flush border rounded mb-2">
        <div
          v-for="(crumb, idx) in localData.items"
          :key="idx"
          class="list-group-item p-2 bg-light"
        >
          <div class="d-flex align-items-center gap-1 mb-1">
            <span class="badge bg-secondary-subtle text-dark border px-1" style="font-size: 10px;">
              #{{ idx + 1 }}
            </span>
            <span v-if="idx === 0" class="badge bg-info-subtle text-info border" style="font-size: 10px;">
              Base
            </span>
            <span v-else-if="idx === localData.items.length - 1" class="badge bg-danger-subtle text-danger border" style="font-size: 10px;">
              Final
            </span>

            <div class="ms-auto d-flex gap-1">
              <button
                type="button"
                class="btn btn-xs btn-light border py-0 px-1"
                :disabled="idx === 0"
                title="Mover arriba"
                @click="moveCrumb(idx, -1)"
              >
                <i class="las la-arrow-up"></i>
              </button>
              <button
                type="button"
                class="btn btn-xs btn-light border py-0 px-1"
                :disabled="idx === localData.items.length - 1"
                title="Mover abajo"
                @click="moveCrumb(idx, 1)"
              >
                <i class="las la-arrow-down"></i>
              </button>
              <button
                type="button"
                class="btn btn-xs btn-outline-danger py-0 px-1"
                :disabled="localData.items.length <= 1"
                title="Eliminar nivel"
                @click="removeCrumb(idx)"
              >
                <i class="las la-trash"></i>
              </button>
            </div>
          </div>

          <div class="row g-2">
            <div :class="idx === localData.items.length - 1 ? 'col-12' : 'col-6'">
              <input
                v-model="crumb.label"
                type="text"
                class="form-control form-control-sm"
                placeholder="Texto del nivel"
              />
            </div>
            <div v-if="idx < localData.items.length - 1" class="col-6">
              <input
                v-model="crumb.href"
                type="text"
                class="form-control form-control-sm"
                placeholder="URL (ej: /pregrado/)"
                @blur="crumb.href = ensureTrailingSlash(crumb.href)"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-xs btn-outline-secondary w-100"
        @click="revertToDynamic"
      >
        <i class="las la-undo me-1"></i> Volver a sincronizar con la Unidad de la Página
      </button>
    </div>

    <!-- OPCIONES GENERALES -->
    <div class="bg-white border rounded p-3">
      <div class="form-check form-switch mb-0">
        <input
          id="breadcrumb-boxed"
          v-model="localData.isBoxed"
          class="form-check-input"
          type="checkbox"
        />
        <label class="form-check-label small fw-semibold" for="breadcrumb-boxed">
          Limitar ancho al contenedor (Boxed)
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useBreadcrumb } from '../../../../composables/useBreadcrumb';

const props = defineProps<{
  modelValue?: any;
  pageAcademicUnitId?: number | null;
  pageTitle?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const {
  academicUnits,
  loading,
  fetchAcademicUnits,
  buildBreadcrumbPath,
  ensureTrailingSlash,
} = useBreadcrumb();

const showCustomUnitSelect = ref(false);

const buildModel = (source: any) => {
  const currentTitle = source?.currentPage || props.pageTitle || '';
  return {
    mode: source?.mode ?? 'dynamic',
    academic_unit_id: source?.academic_unit_id ?? null,
    includeCurrentPage: source?.includeCurrentPage !== false,
    currentPage: currentTitle,
    isBoxed: source?.isBoxed !== false,
    items: Array.isArray(source?.items) && source.items.length > 0
      ? JSON.parse(JSON.stringify(source.items))
      : [
          { label: 'Inicio', href: '/' }
        ],
  };
};

const localData = ref(buildModel(props.modelValue));

/**
 * ID efectivo de la unidad académica:
 * 1. Si el usuario eligió manualmente una unidad en el selector avanzado, usa esa.
 * 2. Si no, usa directamente la unidad de la página actual (props.pageAcademicUnitId).
 * 3. Solo si la página no tuviese unidad asignada (null), recurre a localStorage o 'all'.
 */
const effectiveUnitId = computed(() => {
  if (localData.value.academic_unit_id !== null && localData.value.academic_unit_id !== undefined) {
    return localData.value.academic_unit_id;
  }
  if (props.pageAcademicUnitId !== null && props.pageAcademicUnitId !== undefined) {
    return props.pageAcademicUnitId;
  }
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('academic_unit_id');
    if (stored) return Number(stored);
  }
  return 'all';
});

const isOverridden = computed(() => {
  return (
    localData.value.academic_unit_id !== null &&
    localData.value.academic_unit_id !== undefined &&
    String(localData.value.academic_unit_id) !== String(props.pageAcademicUnitId)
  );
});

const pageUnitName = computed(() => {
  if (!props.pageAcademicUnitId) return 'Sin unidad';
  const found = academicUnits.value.find((u) => String(u.id) === String(props.pageAcademicUnitId));
  return found?.name || `Unidad #${props.pageAcademicUnitId}`;
});

const currentUnitName = computed(() => {
  const targetId = effectiveUnitId.value;
  if (targetId === 'all') return 'Portal Central / Raíz';
  const found = academicUnits.value.find((u) => String(u.id) === String(targetId));
  return found?.name || pageUnitName.value;
});

const setMode = (mode: 'dynamic' | 'manual') => {
  localData.value.mode = mode;
  if (mode === 'dynamic') {
    rebuildAutoPath();
  }
};

const resetToPageUnit = () => {
  localData.value.academic_unit_id = null;
  showCustomUnitSelect.value = false;
  rebuildAutoPath();
};

const onUnitChanged = () => {
  rebuildAutoPath();
};

const rebuildAutoPath = () => {
  if (localData.value.mode !== 'dynamic') return;

  const targetTitle = localData.value.currentPage || props.pageTitle || '';

  const crumbs = buildBreadcrumbPath(
    effectiveUnitId.value,
    targetTitle,
    academicUnits.value,
    localData.value.includeCurrentPage
  );

  localData.value.items = crumbs;
};

const convertToManual = () => {
  localData.value.mode = 'manual';
};

const revertToDynamic = () => {
  localData.value.mode = 'dynamic';
  localData.value.academic_unit_id = null;
  rebuildAutoPath();
};

const addCrumb = () => {
  const last = localData.value.items.pop();
  localData.value.items.push({ label: 'Nuevo nivel', href: '/' });
  if (last) {
    localData.value.items.push(last);
  }
};

const removeCrumb = (index: number) => {
  localData.value.items.splice(index, 1);
};

const moveCrumb = (index: number, delta: number) => {
  const target = index + delta;
  if (target < 0 || target >= localData.value.items.length) return;
  const list = localData.value.items;
  [list[index], list[target]] = [list[target], list[index]];
};

const loadUnits = async () => {
  await fetchAcademicUnits();
  if (localData.value.mode === 'dynamic') {
    if (!localData.value.currentPage && props.pageTitle) {
      localData.value.currentPage = props.pageTitle;
    }
    rebuildAutoPath();
  }
};

onMounted(() => {
  loadUnits();
});

// Cuando llega el ID de la unidad desde el backend (PageBuilderController)
watch(
  () => props.pageAcademicUnitId,
  () => {
    rebuildAutoPath();
  }
);

// Cuando llega el título real de la página (ej: "ESAN Management")
watch(
  () => props.pageTitle,
  (newTitle) => {
    if (newTitle && (!localData.value.currentPage || localData.value.currentPage === 'Página actual')) {
      localData.value.currentPage = newTitle;
    }
    rebuildAutoPath();
  }
);

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return;
    const incoming = JSON.stringify(newVal);
    const current = JSON.stringify(localData.value);
    if (incoming !== current) {
      localData.value = buildModel(newVal);
    }
  },
  { deep: true }
);

watch(
  localData,
  (newVal) => {
    emit('update:modelValue', JSON.parse(JSON.stringify(newVal)));
  },
  { deep: true }
);
</script>

<style scoped>
.breadcrumb-editor {
  font-size: 12px;
}
.btn-xs {
  font-size: 11px;
  padding: 2px 6px;
}
.feed-config-panel {
  background-color: #f8fafc;
}
</style>

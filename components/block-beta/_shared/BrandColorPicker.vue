<template>
  <div class="brand-color-picker">
    <label class="form-label">
      Color institucional
    </label>

    <!-- ================================================================
         Selección actual
         ================================================================ -->

    <button
      type="button"
      class="brand-color-picker__current"
      :class="{ 'is-open': isOpen }"
      :aria-expanded="isOpen"
      @click="togglePicker"
    >
      <span
        class="brand-color-picker__swatch"
        :style="{
          backgroundColor: `var(${selectedColor.token})`,
        }"
        aria-hidden="true"
      ></span>

      <span class="brand-color-picker__current-content">
        <strong>
          {{ selectedColor.label }}
        </strong>

        <small>
          {{ selectedColorGroup.label }}
        </small>
      </span>

      <span class="brand-color-picker__current-action">
        <span>
          {{ isOpen ? 'Cerrar' : 'Cambiar' }}
        </span>

        <i
          class="las la-angle-down"
          :class="{ 'is-open': isOpen }"
          aria-hidden="true"
        ></i>
      </span>
    </button>

    <!-- ================================================================
         Opciones
         ================================================================ -->

    <div
      v-if="isOpen"
      class="brand-color-picker__panel"
    >
      <label class="form-label">
        Familia
      </label>

      <select
        v-model="selectedGroupId"
        class="form-select form-select-sm mb-2"
      >
        <option
          v-for="group in BRAND_COLOR_GROUPS"
          :key="group.id"
          :value="group.id"
        >
          {{ group.label }}
        </option>
      </select>

      <div class="brand-color-picker__options">
        <button
          v-for="color in visibleColors"
          :key="color.token"
          type="button"
          class="brand-color-picker__option"
          :class="{
            'is-active': normalizedValue === color.token,
          }"
          @click="selectColor(color.token)"
        >
          <span
            class="brand-color-picker__swatch"
            :style="{
              backgroundColor: `var(${color.token})`,
            }"
            aria-hidden="true"
          ></span>

          <span class="brand-color-picker__option-label">
            {{ color.label }}
          </span>

          <i
            v-if="normalizedValue === color.token"
            class="las la-check brand-color-picker__check"
            aria-hidden="true"
          ></i>
        </button>
      </div>

      <p
        v-if="usesDarkContent"
        class="brand-color-picker__hint"
      >
        Este color utiliza texto oscuro para mantener el contraste.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  watch,
} from 'vue';

import {
  BRAND_COLOR_GROUPS,
  DEFAULT_BRAND_COLOR_GROUP,
  findBrandGroupByToken,
  getBrandColorGroup,
  normalizeBrandColorToken,
  resolveBrandContentToken,
  type BrandColorGroupId,
} from './brandColors';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (
    event: 'update:modelValue',
    value: string,
  ): void;
}>();

const isOpen = ref(false);

const normalizedValue = computed(() =>
  normalizeBrandColorToken(
    props.modelValue,
  ),
);

const initialGroup =
  findBrandGroupByToken(
    normalizedValue.value,
  );

const selectedGroupId =
  ref<BrandColorGroupId>(
    initialGroup?.id ??
      DEFAULT_BRAND_COLOR_GROUP,
  );

const selectedColorGroup = computed(() =>
  findBrandGroupByToken(
    normalizedValue.value,
  ),
);

const selectedColor = computed(() => {
  const group =
    selectedColorGroup.value;

  return (
    group.colors.find(
      (color) =>
        color.token ===
        normalizedValue.value,
    ) ??
    group.colors[0]
  );
});

const visibleColors = computed(() =>
  getBrandColorGroup(
    selectedGroupId.value,
  ).colors,
);

const usesDarkContent = computed(
  () =>
    resolveBrandContentToken(
      normalizedValue.value,
    ) ===
    '--ds-color-text-primary',
);

const togglePicker = () => {
  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    selectedGroupId.value =
      selectedColorGroup.value.id;
  }
};

const selectColor = (
  token: string,
) => {
  emit(
    'update:modelValue',
    normalizeBrandColorToken(token),
  );

  isOpen.value = false;
};

watch(
  () => props.modelValue,
  (value) => {
    if (!isOpen.value) {
      selectedGroupId.value =
        findBrandGroupByToken(
          value,
        ).id;
    }
  },
);
</script>

<style scoped>
.brand-color-picker {
  width: 100%;
}

.brand-color-picker__current {
  display: flex;
  align-items: center;

  width: 100%;

  gap: 10px;

  padding: 9px 10px;

  border: 1px solid #d7dde6;
  border-radius: 7px;

  background: #fff;
  color: #1f2733;

  text-align: left;

  cursor: pointer;

  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.brand-color-picker__current:hover,
.brand-color-picker__current.is-open {
  border-color: #aab4c2;
  background: #f8f9fb;
}

.brand-color-picker__swatch {
  flex: 0 0 auto;

  width: 26px;
  height: 26px;

  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 5px;
}

.brand-color-picker__current-content {
  display: flex;
  flex: 1;
  flex-direction: column;

  min-width: 0;
}

.brand-color-picker__current-content strong {
  overflow: hidden;

  color: #1f2733;

  font-size: 12px;
  font-weight: 700;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.brand-color-picker__current-content small {
  overflow: hidden;

  margin-top: 1px;

  color: #778292;

  font-size: 10.5px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.brand-color-picker__current-action {
  display: flex;
  flex: 0 0 auto;
  align-items: center;

  gap: 5px;

  color: #6b7688;

  font-size: 10.5px;
  font-weight: 600;
}

.brand-color-picker__current-action i {
  font-size: 11px;

  transition: transform 0.15s ease;
}

.brand-color-picker__current-action i.is-open {
  transform: rotate(180deg);
}

.brand-color-picker__panel {
  margin-top: 8px;
  padding: 10px;

  border: 1px solid #dde3ec;
  border-radius: 7px;

  background: #f8f9fb;
}

.brand-color-picker__options {
  display: flex;
  flex-direction: column;

  gap: 6px;
}

.brand-color-picker__option {
  display: flex;
  align-items: center;

  width: 100%;

  gap: 9px;

  padding: 7px 8px;

  border: 1px solid #dde3ec;
  border-radius: 6px;

  background: #fff;
  color: #303846;

  text-align: left;

  cursor: pointer;

  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.brand-color-picker__option:hover {
  border-color: #aeb8c6;

  background: #f4f6fa;
}

.brand-color-picker__option.is-active {
  border-color: #697586;

  background: #eef1f5;
}

.brand-color-picker__option .brand-color-picker__swatch {
  width: 22px;
  height: 22px;
}

.brand-color-picker__option-label {
  flex: 1;

  min-width: 0;

  font-size: 11.5px;
  font-weight: 600;
}

.brand-color-picker__check {
  flex: 0 0 auto;

  color: #303846;

  font-size: 14px;
}

.brand-color-picker__hint {
  margin: 8px 0 0;

  color: #6b7688;

  font-size: 10.5px;
  line-height: 1.4;
}
</style>
<template>
  <div class="isv2-richtext-field" :class="$attrs.class">
    <label v-if="label" class="form-label">{{ label }}</label>
    <div
      ref="editor"
      class="form-control form-control-sm isv2-richtext-field__editor"
      contenteditable="true"
      role="textbox"
      aria-multiline="true"
      :aria-label="label || 'Texto enriquecido'"
      v-bind="controlAttrs"
      @input="updateValue"
      @keydown.ctrl.b.prevent="formatBold"
    ></div>
    <small v-if="hint" class="form-text">{{ hint }}</small>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, watch } from 'vue';

defineOptions({ inheritAttrs: false });
defineProps<{ label?: string; hint?: string }>();
const model = defineModel<string>({ default: '' });
const attrs = useAttrs();
const editor = ref<HTMLElement | null>(null);
const controlAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
));

const sync = async () => {
  await nextTick();
  if (editor.value && editor.value.innerHTML !== model.value) editor.value.innerHTML = model.value;
};
const updateValue = () => { model.value = editor.value?.innerHTML ?? ''; };
const formatBold = () => {
  editor.value?.focus();
  document.execCommand('bold');
  updateValue();
};

watch(model, sync, { immediate: true });
</script>

<style scoped>
.isv2-richtext-field__editor { min-height: 88px; overflow-y: auto; }
.isv2-richtext-field__editor:focus { border-color: #86b7fe; outline: 0; box-shadow: 0 0 0 .15rem rgba(13, 110, 253, .15); }
</style>

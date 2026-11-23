<template>
  <div class="imm-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Encabezado</h6>
    <EditorText
      v-model="localData.eyebrow"
      data-edit-target="eyebrow"
      class="mb-2"
      label="Antetítulo"
      placeholder="Internacionalización"
    />
    <EditorTextarea v-model="localData.title" data-edit-target="title" class="mb-2" label="Título" :rows="2" />
    <EditorTextarea
      v-model="localData.subtitle"
      data-edit-target="subtitle"
      class="mb-2"
      label="Descripción"
      :rows="2"
    />

    <hr />
    <h6 class="fw-bold small text-uppercase mb-1">Tarjeta ESAN University</h6>
    <EditorText
      v-model="localData.left.tag"
      data-edit-target="left.tag"
      class="mb-2"
      label="Etiqueta"
      placeholder="Pregrado"
    />

    <CardAccordionItem
      v-for="(item, index) in localData.left.items"
      :key="item.id"
      :edit-key="`left.items.${index}`"
      :title="item.text || `Beneficio ${index + 1}`"
      :index="index"
      :total="localData.left.items.length"
      :open="openIndex === index"
      remove-label="Quitar beneficio"
      @toggle="toggle(index)"
      @move="moveItem(index, $event)"
      @remove="removeItem(index)"
    >
      <div>
        <label class="form-label">Pictograma</label>
        <select v-model="item.icon" data-edit-target=".icon" class="form-select form-select-sm mb-2">
          <option value="">Sin pictograma</option>
          <option v-for="option in PICTOGRAM_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <EditorTextarea
          v-model="item.text"
          data-edit-target=".text"
          label="Texto"
          :rows="2"
          hint="Los beneficios sin texto no aparecen en la tarjeta."
        />
      </div>
    </CardAccordionItem>
    <button type="button" class="btn btn-sm btn-danger w-100 mt-1" @click="addItem">
      <i class="las la-plus me-1"></i> Agregar beneficio
    </button>

    <p class="small text-muted mb-2">
      <i class="las la-passport me-1"></i>
      La ilustración del pasaporte es fija y se muestra junto a la tarjeta.
    </p>
    <EditorText
      v-model="localData.imageAlt"
      data-edit-target="imageAlt"
      class="mb-2"
      label="Texto alternativo del pasaporte"
      hint="Describe la imagen para lectores de pantalla. Si queda vacío, será decorativa."
    />

    <hr />
    <h6 class="fw-bold small text-uppercase mb-1">Botón inferior</h6>
    <EditorText
      v-model="localData.button.label"
      data-edit-target="button.label"
      class="mb-2"
      label="Texto del botón"
      placeholder="Descubre ESAN Internacional"
    />
    <EditorUrl
      v-model="localData.button.url"
      v-model:target="localData.button.target"
      data-edit-target="button.url"
      label="Destino del botón"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import { PICTOGRAM_OPTIONS } from '../../../../helpers/pictograms';
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';

const props = defineProps<{ modelValue: any; availableSections?: Array<{ id: string; title: string }> }>();
const emit = defineEmits(['update:modelValue']);
const newItemId = () => `imm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const build = (source: any) => ({
  eyebrow: source?.eyebrow ?? '',
  title: source?.title ?? '',
  subtitle: source?.subtitle ?? '',
  imageAlt: source?.imageAlt ?? '',
  left: {
    tag: source?.left?.tag ?? '',
    items: Array.isArray(source?.left?.items)
      ? source.left.items.map((item: any) => ({
          id: item?.id || newItemId(),
          icon: item?.icon ?? '',
          text: item?.text ?? '',
        }))
      : [],
  },
  button: {
    label: source?.button?.label ?? '',
    url: source?.button?.url ?? '',
    target: normalizeLinkTarget(source?.button?.target),
  },
});

const localData = ref(build(props.modelValue));
const openIndex = ref<number | null>(0);
const toggle = (index: number) => { openIndex.value = openIndex.value === index ? null : index; };
const addItem = () => {
  localData.value.left.items.push({ id: newItemId(), icon: '', text: '' });
  openIndex.value = localData.value.left.items.length - 1;
};
const removeItem = (index: number) => {
  localData.value.left.items.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};
const moveItem = (index: number, delta: number) => {
  const target = index + delta;
  const list = localData.value.left.items;
  if (target < 0 || target >= list.length) return;
  [list[index], list[target]] = [list[target], list[index]];
  if (openIndex.value === index) openIndex.value = target;
  else if (openIndex.value === target) openIndex.value = index;
};

watch(() => props.modelValue, (value) => {
  if (value && JSON.stringify(value) !== JSON.stringify(localData.value)) localData.value = build(value);
}, { deep: true });
watch(localData, (value) => emit('update:modelValue', JSON.parse(JSON.stringify(value))), { deep: true });
</script>

<template>
  <div :class="$attrs.class" :style="$attrs.style as any">
    <EditorText
      v-bind="controlAttrsOf($attrs)"
      v-model="model"
      :placeholder="placeholder"
      inputmode="url"
      autocomplete="off"
      spellcheck="false"
    />

    <!-- Solo si el editor enlaza `v-model:target`: el destino de un video, por ejemplo, no lo lleva. -->
    <EditorLinkTarget v-if="hasTarget" v-model="target" class="mt-1" />

    <!-- Selector opcional de secciones de la misma página (anclas #pregrado, #sec-...). -->
    <div v-if="sectionOptions.length > 0" class="mt-2">
      <label :for="sectionSelectId" class="form-label mb-1">
        {{ sectionLabel }}
      </label>
      <select
        :id="sectionSelectId"
        :value="selectedSectionValue"
        class="form-select form-select-sm"
        @change="onSectionChange"
      >
        <option value="">— URL manual / otra página —</option>
        <option v-for="sec in sectionOptions" :key="sec.id" :value="sec.anchor">
          {{ sec.title }} ({{ sec.anchor }})
        </option>
      </select>
      <EditorHint v-if="sectionHint" after>
        {{ sectionHint }}
      </EditorHint>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Campo de destino de un enlace: una ruta del sitio (`/carreras`) o una
 * dirección completa (`https://…`).
 *
 * Es un EditorText y no un `type="url"` a propósito: una ruta relativa como
 * `/carreras` no es una URL válida para el navegador, y el campo la
 * rechazaría o la marcaría como error. Solo cambia el placeholder por defecto
 * y que en el móvil salga el teclado de direcciones.
 *
 * Con `v-model:target` añade debajo el interruptor "Link interno / Página
 * externa" (EditorLinkTarget): el `target` es `''` (misma página) o `_blank`
 * (pestaña nueva). Sin ese enlace no se dibuja, que es lo que quieren los
 * campos que no son una redirección.
 *
 * `class` y `style` van al contenedor (el margen); lo demás (`label`, `hint`,
 * `maxlength`, `data-edit-target`…) pasa a EditorText, que lo reparte.
 */
import { computed, getCurrentInstance } from 'vue';
import EditorHint from '../EditorHint/EditorHint.vue';
import EditorText from '../EditorText/EditorText.vue';
import EditorLinkTarget from '../EditorLinkTarget/EditorLinkTarget.vue';
import { controlAttrsOf, nextFieldId } from '../_shared/fieldUtils';

interface SectionOption {
  id: string;
  title?: string;
  type?: string;
  sectionId?: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    sections?: SectionOption[];
    sectionLabel?: string;
    sectionHint?: string;
  }>(),
  {
    placeholder: '/ruta o https://',
    sections: undefined,
    sectionLabel: 'Redirigir a sección existente',
    sectionHint: 'Opcional: selecciona una sección de esta página para enlazar automáticamente (ej. #pregrado).',
  },
);

const model = defineModel<string>({ default: '' });
const target = defineModel<string>('target', { default: '' });

/*
 * ¿El editor enlazó `v-model:target`? Se mira si llegó el listener, y no el
 * valor: un dato antiguo sin `target` llega como `undefined` y aun así el
 * interruptor tiene que aparecer.
 */
const instance = getCurrentInstance();
const hasTarget = computed(() => Boolean(instance?.vnode.props && 'onUpdate:target' in instance.vnode.props));

const sectionSelectId = nextFieldId('ed-url-sec');

const normalizeAnchor = (sec: SectionOption): string => {
  const custom = String(sec.sectionId ?? '').trim().replace(/^#+/, '');
  return `#${custom || `sec-${sec.id}`}`;
};

const sectionOptions = computed(() =>
  (props.sections ?? [])
    .filter((sec) => Boolean(sec?.id))
    .map((sec) => ({
      id: sec.id,
      title: String(sec.title || sec.type || 'Sección').trim(),
      anchor: normalizeAnchor(sec),
    })),
);

const selectedSectionValue = computed(() => {
  const current = String(model.value ?? '').trim();
  if (!current) return '';
  return sectionOptions.value.some((sec) => sec.anchor === current) ? current : '';
});

const onSectionChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  if (value) {
    model.value = value;
    // Un ancla interna debe navegar dentro de la misma página.
    if (hasTarget.value && target.value === '_blank') {
      target.value = '';
    }
    return;
  }

  if (String(model.value ?? '').trim().startsWith('#')) {
    model.value = '';
  }
};
</script>

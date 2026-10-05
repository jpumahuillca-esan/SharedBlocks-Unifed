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
import EditorText from '../EditorText/EditorText.vue';
import EditorLinkTarget from '../EditorLinkTarget/EditorLinkTarget.vue';
import { controlAttrsOf } from '../_shared/fieldUtils';

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<{ placeholder?: string }>(), {
  placeholder: '/ruta o https://',
});

const model = defineModel<string>({ default: '' });
const target = defineModel<string>('target', { default: '' });

/*
 * ¿El editor enlazó `v-model:target`? Se mira si llegó el listener, y no el
 * valor: un dato antiguo sin `target` llega como `undefined` y aun así el
 * interruptor tiene que aparecer.
 */
const instance = getCurrentInstance();
const hasTarget = computed(() => Boolean(instance?.vnode.props && 'onUpdate:target' in instance.vnode.props));
</script>

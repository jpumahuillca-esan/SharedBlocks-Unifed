<script setup lang="ts">
/**
 * MoleculeCookieBanner — aviso de cookies fijo al pie (ARCIS Design
 * System, Elementos > Cookie Banner).
 *
 * Vive en components/molecules/ y no en components/atoms/ porque
 * compone el átomo AtomButton (Rechazar/Aceptar) — mismo criterio que
 * MoleculeAlert/MoleculeChip.
 *
 * Envuelve ".cookie-banner"/".cookie-banner__*"/".cookie-banner--light"
 * portadas en assets/styles/elements/_cookie-banner.scss. Replica el
 * comportamiento real de webunificada (assets/js/main.js,
 * initCookieBanner()): guarda el consentimiento en localStorage (clave
 * "arcis-cookie-consent"), se muestra solo si todavía no hay un valor
 * guardado, y se oculta al hacer click en cualquiera de los dos botones.
 *
 * `preview`: modo vista previa — fuerza el banner siempre visible con
 * position:absolute (.cookie-banner--preview) en vez de consultar
 * localStorage real y quedar position:fixed. Mismo motivo que
 * MoleculeScrollTop: sin esto, se escaparía del recuadro de vista
 * previa y aparecería flotando sobre la UI real del editor.
 */
import { ref, computed, onMounted } from 'vue';
import AtomButton from '../atoms/AtomButton.vue';

const STORAGE_KEY = 'arcis-cookie-consent';

const props = withDefaults(defineProps<{
  variant?: 'dark' | 'light';
  text?: string;
  linkText?: string;
  linkHref?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  preview?: boolean;
}>(), {
  variant: 'dark',
  text: 'Usamos cookies para mejorar tu experiencia. Al continuar navegando aceptas nuestra',
  linkText: 'política de cookies',
  linkHref: '#',
  acceptLabel: 'Aceptar',
  rejectLabel: 'Rechazar',
  preview: false,
});

const emit = defineEmits<{
  consent: [value: 'accept' | 'reject'];
}>();

const visible = ref(props.preview);

onMounted(() => {
  if (props.preview) return;

  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    stored = null;
  }

  if (!stored) visible.value = true;
});

const respond = (value: 'accept' | 'reject') => {
  if (props.preview) return;

  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* localStorage no disponible (ej. modo privado) */
  }

  visible.value = false;
  emit('consent', value);
};

/* La versión por defecto es la oscura; `light` es la excepción. */
const isDark = computed(() => props.variant !== 'light');

const classes = computed(() => [
  'cookie-banner',
  props.variant === 'light' ? 'cookie-banner--light' : null,
  props.preview ? 'cookie-banner--preview' : null,
  visible.value ? 'is-visible' : null,
]);
</script>

<template>
  <div :class="classes">
    <p class="cookie-banner__text">{{ text }} <a :href="linkHref">{{ linkText }}</a>.</p>
    <div class="cookie-banner__actions">
      <!--
        En la versión oscura, los botones van en su versión para fondo oscuro
        (`negative`), como pide el Figma: el secundario rojo sobre el fondo
        oscuro no llegaba al contraste mínimo.
      -->
      <AtomButton variant="secondary" size="sm" :negative="isDark" :tabindex="preview ? -1 : undefined" @click="respond('reject')">
        {{ rejectLabel }}
      </AtomButton>
      <AtomButton variant="primary" size="sm" :negative="isDark" :tabindex="preview ? -1 : undefined" @click="respond('accept')">
        {{ acceptLabel }}
      </AtomButton>
    </div>
  </div>
</template>

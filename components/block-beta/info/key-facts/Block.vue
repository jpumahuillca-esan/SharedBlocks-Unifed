<template>
  <section class="key-facts" :style="colorStyle" v-bind="edit('colorToken')">
    <div class="key-facts__inner">
      <!--
        Lista y no una rejilla de <div>: son datos paralelos del mismo programa,
        y así un lector de pantalla anuncia "lista de 4 elementos".

        La franja se dibuja aunque no haya ningún dato: en el lienzo del editor
        un bloque que desaparece no se puede volver a seleccionar.
      -->
      <ul v-if="items.length" class="key-facts__list" :style="{ '--key-facts-columns': items.length }">
        <li
          v-for="item in items"
          :key="item.id"
          class="key-facts__item"
          v-bind="edit(`items.${item.index}`)"
        >
          <!-- Como <p> los dos: son textos de contenido, no marcas dentro de una frase. -->
          <AtomText v-if="item.label" size="body-sm" class="key-facts__label" v-bind="edit('.label')">
            {{ item.label }}
          </AtomText>

          <AtomHeading as="p" size="h6" weight="bold" class="key-facts__value" v-bind="edit('.value')">
            {{ item.value }}
          </AtomHeading>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Datos clave — franja de color con hasta cuatro datos del programa.
 *
 * Cada dato es un rótulo pequeño ("Duración:") sobre su valor en negrita
 * ("10 semestres académicos"), entre dos filetes. En escritorio van todos en una
 * fila; por debajo de 768px pasan a dos columnas con un filete entre filas. El
 * contenido se escribe desde el editor; no consulta ninguna API.
 *
 * El color de la franja es un color institucional que se guarda como TOKEN, y
 * el del texto sale de él (resolveBrandContentToken): blanco, salvo sobre los
 * fondos claros de la paleta.
 */
import { computed } from 'vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import {
  DEFAULT_BRAND_COLOR_TOKEN,
  normalizeBrandColorToken,
  resolveBrandContentToken,
} from '../../../editor-beta/EditorBrandColor/brandColors';
import { useEditTarget } from '../../../../core/editFocus';
import { KEY_FACTS_MAX_ITEMS } from './types';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

const props = defineProps<{ data: any }>();

/*
 * Un dato sin valor no se dibuja: un rótulo solo, sin nada debajo, deja un
 * hueco que no dice nada. Así un dato recién agregado en el editor aparece en
 * cuanto se le escribe el valor.
 *
 * `index` es la posición en el dato ANTES de filtrar: es la que usa el editor
 * para abrir la tarjeta correcta.
 */
const items = computed(() =>
  (Array.isArray(props.data?.items) ? props.data.items : [])
    .slice(0, KEY_FACTS_MAX_ITEMS)
    .map((item: any, i: number) => ({
      id: item?.id || `key-facts-item-${i}`,
      index: i,
      label: String(item?.label ?? '').trim(),
      value: String(item?.value ?? '').trim(),
    }))
    .filter((item: { value: string }) => item.value),
);

const colorStyle = computed(() => {
  const token = normalizeBrandColorToken(props.data?.colorToken ?? DEFAULT_BRAND_COLOR_TOKEN);
  const contentToken = resolveBrandContentToken(token);
  const onDark = contentToken === '--ds-color-text-inverse';

  return {
    '--key-facts-color': `var(${token})`,
    '--key-facts-content': `var(${contentToken})`,
    // Filetes y rótulos más suaves que el dato, según el fondo sea oscuro o claro.
    '--key-facts-rule': onDark ? 'var(--ds-color-white-60)' : 'var(--ds-color-border-strong)',
    '--key-facts-label': onDark ? 'var(--ds-color-white-80)' : 'var(--ds-color-text-secondary)',
  };
});
</script>

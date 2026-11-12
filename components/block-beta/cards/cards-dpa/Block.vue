<template>
  <section
    class="cards-dpa-section"
    v-bind="edit('backgroundColor')"
    :style="sectionStyle"
  >
    <div class="cards-dpa__container">
      <!-- Encabezado de la sección -->
      <header class="cards-dpa__header">
        <div class="cards-dpa__header-left">
          <!-- Logo DPA (imagen) -->
          <div
            v-if="data.logoImage"
            class="cards-dpa__logo-wrapper"
            v-bind="edit('logoImage')"
          >
            <img
              :src="data.logoImage"
              :alt="data.logoAlt || 'ESAN DPA'"
              :style="{ height: `${data.logoHeight || 44}px` }"
              class="cards-dpa__logo"
              loading="lazy"
            />
          </div>

          <!-- Título H2 -->
          <h2
            v-if="data.title"
            class="cards-dpa__title"
            v-bind="edit('title')"
          >
            {{ data.title }}
          </h2>

          <!-- Regla / guion de acento bajo el título -->
          <span
            v-if="data.title"
            class="cards-dpa__rule"
            aria-hidden="true"
          ></span>

          <!-- Descripción P -->
          <p
            v-if="data.desc"
            class="cards-dpa__desc"
            v-bind="edit('desc')"
          >
            {{ data.desc }}
          </p>
        </div>

        <!-- Enlace / botón lateral derecho -->
        <div
          v-if="data.linkLabel"
          class="cards-dpa__header-right"
          v-bind="edit('linkLabel')"
        >
          <component
            :is="data.linkUrl ? AtomLink : 'span'"
            :href="data.linkUrl || undefined"
            :target="data.linkTarget || '_self'"
            class="cards-dpa__link"
          >
            <span>{{ data.linkLabel }}</span>
            <span class="cards-dpa__link-arrow" aria-hidden="true">
              <i class="las la-arrow-right"></i>
            </span>
          </component>
        </div>
      </header>

      <!-- Rejilla de tarjetas (Cards) -->
      <div v-if="cards.length" class="cards-dpa__grid">
        <component
          :is="card.url ? AtomLink : 'div'"
          v-for="(card, i) in cards"
          v-bind="edit(`cards.${i}`)"
          :key="card.id"
          :href="card.url || undefined"
          :target="card.target || '_self'"
          class="cards-dpa__card"
        >
          <!-- Imagen de la tarjeta -->
          <div class="cards-dpa__card-media" v-bind="edit('.image')">
            <img
              v-if="card.image"
              :src="card.image"
              :alt="card.imageAlt || card.title"
              :style="cardImageStyle(card)"
              class="image-focus-responsive"
              loading="lazy"
            />
            <div v-else class="cards-dpa__card-media-empty">
              <i class="las la-image"></i>
            </div>
          </div>

          <!-- Cuerpo de la tarjeta -->
          <div class="cards-dpa__card-body">
            <h3 class="cards-dpa__card-title" v-bind="edit('.title')">
              {{ card.title }}
            </h3>

            <!-- Fila inferior: descripción y botón de acción al lado -->
            <div class="cards-dpa__card-bottom">
              <p
                v-if="card.desc"
                class="cards-dpa__card-desc"
                v-bind="edit('.desc')"
              >
                {{ card.desc }}
              </p>

              <!-- Botón / flecha de acción -->
              <span class="cards-dpa__card-btn" aria-hidden="true">
                <AtomIcon name="chevron-right" :size="18" />
              </span>
            </div>
          </div>
        </component>
      </div>

      <!-- Enlace inferior en móvil (centrado debajo de las tarjetas) -->
      <div
        v-if="data.linkLabel"
        class="cards-dpa__footer-mobile"
        v-bind="edit('linkLabel')"
      >
        <component
          :is="data.linkUrl ? AtomLink : 'span'"
          :href="data.linkUrl || undefined"
          :target="data.linkTarget || '_self'"
          class="cards-dpa__link"
        >
          <span>{{ data.linkLabel }}</span>
          <span class="cards-dpa__link-arrow" aria-hidden="true">
            <i class="las la-arrow-right"></i>
          </span>
        </component>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Bloque: Cards DPA (Carreras para gente que trabaja).
 *
 * Encabezado con logo institucional DPA, título H2 con guion acentuado,
 * descripción P y enlace derecho "Descubre más...".
 * Rejilla de tarjetas reutilizables con fotografía superior, título del programa,
 * descripción de área y botón de navegación con flecha.
 *
 * Fondo configurable: mixto con degradado sobre imagen, degradado puro o color sólido.
 */
import { computed } from 'vue';
import AtomLink from '../../../atoms/AtomLink.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import { useEditTarget } from '../../../../core/editFocus';
import { imageFocusProfilesStyle } from '../../../../helpers/imageFocus';
import { buildCardsDpaData, type CardsDpaData, type ProgramCardItem } from './types';

const edit = useEditTarget();

const props = defineProps<{
  data: any;
}>();

const data = computed<CardsDpaData>(() => buildCardsDpaData(props.data));
const cards = computed<ProgramCardItem[]>(() => data.value.cards);

function cardImageStyle(card: ProgramCardItem): Record<string, string> {
  if (card.imageFocusProfiles) {
    return imageFocusProfilesStyle(
      card.imageFocusProfiles,
      card.imageFocusX,
      card.imageFocusY,
    );
  }
  const fx = typeof card.imageFocusX === 'number' ? card.imageFocusX : 50;
  const fy = typeof card.imageFocusY === 'number' ? card.imageFocusY : 20;
  return {
    objectPosition: `${fx}% ${fy}%`,
  };
}

const sectionStyle = computed(() => {
  const d = data.value;

  if (d.bgType === 'color') {
    return {
      backgroundColor: d.backgroundColor || '#0B1B3D',
    };
  }

  const start = d.gradientStart || 'rgba(11, 27, 61, 0.94)';
  const end = d.gradientEnd || 'rgba(22, 44, 94, 0.88)';

  if (d.bgType === 'gradient' || !d.backgroundImage) {
    return {
      background: `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
      backgroundColor: d.backgroundColor || '#0B1B3D',
    };
  }

  // Modo 'overlay' mixto (por defecto): foto + degradado encima
  return {
    background: `linear-gradient(135deg, ${start} 0%, ${end} 100%), url("${d.backgroundImage}") center center / cover no-repeat`,
    backgroundColor: d.backgroundColor || '#0B1B3D',
  };
});
</script>


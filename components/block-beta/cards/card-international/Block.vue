<template>
  <section class="card-international-section">
    <div class="card-international__container">
      <article
        class="card-international__card"
        :style="{
          backgroundColor: resolvedBackground,
          '--card-intl-cols': String(columnsCount),
        }"
        v-bind="edit('panelColorToken')"
      >
        <!-- Título H2 -->
        <h2
          v-if="dataNormalized.title"
          class="card-international__title"
          v-bind="edit('title')"
        >
          {{ dataNormalized.title }}
        </h2>

        <!-- Foto principal -->
        <div
          v-if="dataNormalized.image"
          class="card-international__media"
          v-bind="edit('image')"
        >
          <img
            :src="dataNormalized.image"
            :alt="dataNormalized.imageAlt || dataNormalized.title"
            class="image-focus-responsive"
            loading="lazy"
            decoding="async"
            :style="imageFocusStyle"
          />
        </div>

        <!-- Descripción opcional -->
        <p
          v-if="dataNormalized.desc"
          class="card-international__desc"
          v-bind="edit('desc')"
          v-html="dataNormalized.desc"
        ></p>

        <!-- Cuadrícula de items / beneficios -->
        <div
          v-if="dataNormalized.items && dataNormalized.items.length"
          class="card-international__grid"
        >
          <div
            v-for="(item, idx) in dataNormalized.items"
            :key="item.id || idx"
            class="card-international__item"
            v-bind="edit(`items.${idx}`)"
          >
            <div class="card-international__item-icon-wrap">
              <img
                v-if="resolveIcon(item.icon)"
                :src="resolveIcon(item.icon)"
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <AtomIcon
                v-else-if="item.icon"
                :name="item.icon"
                :size="36"
                aria-hidden="true"
              />
            </div>
            <p class="card-international__item-text" v-bind="edit(`items.${idx}.text`)">
              {{ item.text }}
            </p>
          </div>
        </div>

        <!-- Botón / CTA de acción -->
        <div
          v-if="dataNormalized.buttonText"
          class="card-international__actions"
          v-bind="edit('buttonText')"
        >
          <AtomButton
            variant="secondary"
            negative
            :href="dataNormalized.buttonLink || '#'"
            :target="dataNormalized.buttonTarget || undefined"
            class="card-international__btn"
            v-bind="edit('buttonLink')"
          >
            {{ dataNormalized.buttonText }}
          </AtomButton>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import { useEditTarget } from '../../../../core/editFocus';
import { imageFocusProfilesStyle } from '../../../../helpers/imageFocus';
import {
  DEFAULT_CARD_INTERNATIONAL_DATA,
  normalizeCardInternationalData,
  resolveCardInternationalBackground,
  type CardInternationalData,
} from './shared/types';

import iconPinGlobe from '../../../../assets/images/icon-pin-globe.svg';
import iconHandshake from '../../../../assets/images/icon-handshake.svg';
import iconGradCap from '../../../../assets/images/icon-grad-cap.svg';
import iconAlumniGroup from '../../../../assets/images/icon-alumni-group.svg';

const BUILTIN_ICONS: Record<string, string> = {
  'pin-globe': iconPinGlobe,
  'ubicaciones': iconPinGlobe,
  'handshake': iconHandshake,
  'acuerdo': iconHandshake,
  'grad-cap': iconGradCap,
  'graduacion': iconGradCap,
  'alumni-group': iconAlumniGroup,
  'icon-alumni': iconAlumniGroup,
};

const edit = useEditTarget();

const props = defineProps<{
  data?: Partial<CardInternationalData>;
}>();

const dataNormalized = computed<CardInternationalData>(() =>
  normalizeCardInternationalData(props.data),
);

const resolvedBackground = computed(() =>
  resolveCardInternationalBackground(props.data ?? DEFAULT_CARD_INTERNATIONAL_DATA),
);

const imageFocusStyle = computed(() =>
  imageFocusProfilesStyle(
    dataNormalized.value.imageFocusProfiles,
    dataNormalized.value.imageFocusX ?? 50,
    dataNormalized.value.imageFocusY ?? 30,
  ),
);

const columnsCount = computed(() => {
  const count = dataNormalized.value.items?.length || 4;
  return Math.min(Math.max(count, 1), 4);
});

const resolveIcon = (iconName?: string) => {
  if (!iconName) return null;
  if (BUILTIN_ICONS[iconName]) return BUILTIN_ICONS[iconName];
  if (iconName.startsWith('/') || iconName.startsWith('http') || iconName.endsWith('.svg') || iconName.endsWith('.png')) {
    return iconName;
  }
  return null;
};
</script>

<template>
  <div class="audience-switcher">
    <div class="audience-switcher__inner">
      <h3
        v-if="normalized.title"
        class="audience-switcher__title"
        v-bind="edit('title')"
      >
        {{ normalized.title }}
      </h3>

      <div v-if="normalized.cards.length" class="audience-switcher__cards">
        <a
          v-for="(card, i) in normalized.cards"
          :key="card.id || i"
          :href="resolveHref(card)"
          v-bind="{ ...linkTargetAttrs(card.target), ...edit(`cards.${i}`) }"
          class="audience-switcher__card"
          @click="handleCardClick($event, card)"
        >
          <img
            v-if="card.image"
            :src="card.image"
            :alt="card.imageAlt || card.title"
            class="audience-switcher__card-image image-focus-responsive"
            :style="cardImageStyle(card)"
            loading="lazy"
            v-bind="edit(`cards.${i}.image`)"
          />
          <div class="audience-switcher__card-overlay" aria-hidden="true"></div>
          <div class="audience-switcher__card-body">
            <div class="audience-switcher__card-content">
              <h4 class="audience-switcher__card-title" v-bind="edit(`cards.${i}.title`)">
                {{ card.title }}
              </h4>
              <p
                v-if="card.desc"
                class="audience-switcher__card-desc"
                v-bind="edit(`cards.${i}.desc`)"
              >
                {{ card.desc }}
              </p>
            </div>
            <span class="audience-switcher__card-arrow" aria-hidden="true">
              <AtomIcon name="chevron-right" :size="20" />
            </span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import { normalizeAudienceSwitcherData, type AudienceCardItem, type AudienceSwitcherData } from './shared/types';
import { EDIT_CANVAS_KEY, useEditTarget } from '../../../../core/editFocus';
import { imageFocusProfilesStyle } from '../../../../helpers/imageFocus';
import { linkTargetAttrs } from '../../../../helpers/linkTarget';

const props = defineProps<{
  data: AudienceSwitcherData;
}>();

const inCanvas = inject(EDIT_CANVAS_KEY, false);
const edit = useEditTarget();
const normalized = computed(() => normalizeAudienceSwitcherData(props.data));

const cardImageStyle = (card: AudienceCardItem) =>
  imageFocusProfilesStyle(
    card.imageFocusProfiles,
    card.imageFocusX ?? 50,
    card.imageFocusY ?? 50,
  );

const resolveHref = (card: AudienceCardItem): string => {
  const href = typeof card.href === 'string' ? card.href.trim() : '';
  if (!href) return '#';
  if (href.startsWith('#') || href.startsWith('/') || /^https?:\/\//i.test(href)) {
    return href;
  }
  return `#${href}`;
};

const findAnchorTarget = (rawId: string): HTMLElement | null => {
  if (typeof document === 'undefined' || !rawId) return null;
  const cleanId = rawId.replace(/^#/, '').trim();
  if (!cleanId) return null;

  const byId = document.getElementById(cleanId);
  if (byId) return byId;

  if (!cleanId.startsWith('sec-')) {
    const bySecId = document.getElementById(`sec-${cleanId}`);
    if (bySecId) return bySecId;
  }

  const bareBlockId = cleanId.replace(/^sec-/, '');
  const escapeCss = typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
    ? CSS.escape
    : (val: string) => val.replace(/["\\]/g, '\\$&');

  return (
    document.querySelector<HTMLElement>(`[data-block-id="${escapeCss(bareBlockId)}"]`) ||
    document.querySelector<HTMLElement>(`[data-section-id="${escapeCss(cleanId)}"]`)
  );
};

const handleCardClick = (event: MouseEvent, card: AudienceCardItem) => {
  // En el lienzo del editor el clic selecciona/enfoca la tarjeta sin navegar.
  if (inCanvas) {
    event.preventDefault();
    return;
  }

  const href = resolveHref(card);
  if (href === '#') {
    event.preventDefault();
    return;
  }

  // Redirección suave por ancla a una sección existente (#pregrado, #dpa, #sec-...).
  if (href.startsWith('#') && (!card.target || card.target === '_self')) {
    event.preventDefault();
    let rawId = href.slice(1);
    try {
      rawId = decodeURIComponent(rawId);
    } catch (_) {
      // Mantiene rawId sin decodificar si hay caracteres inválidos.
    }

    const targetEl = findAnchorTarget(rawId);
    if (!targetEl) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    targetEl.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    });

    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', href);
    }
  }
};
</script>

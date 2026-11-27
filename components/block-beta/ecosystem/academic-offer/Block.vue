<template>
  <section
    class="academic-offer"
    :style="{ backgroundColor: content.backgroundColor }"
    v-bind="edit('backgroundColor')"
  >
    <div class="academic-offer__inner">
      <header
        v-if="content.eyebrow || content.title || content.desc"
        class="academic-offer__header"
      >
        <AtomEyebrow
          v-if="content.eyebrow"
          as="p"
          class="academic-offer__eyebrow"
          v-bind="edit('eyebrow')"
        >
          {{ content.eyebrow }}
        </AtomEyebrow>

        <AtomHeading
          v-if="content.title"
          :level="2"
          size="h2"
          weight="semibold"
          class="academic-offer__title"
          v-bind="edit('title')"
        >
          {{ content.title }}
        </AtomHeading>

        <span
          v-if="content.title"
          class="academic-offer__rule"
          aria-hidden="true"
        ></span>

        <AtomText
          v-if="content.desc"
          size="body-lg"
          class="academic-offer__desc"
          v-bind="edit('desc')"
        >
          {{ content.desc }}
        </AtomText>
      </header>

      <div v-if="content.items.length" class="academic-offer__body">
        <!-- Tarjetas destacadas (horizontal banner con subenlaces, Figma Banner-ESAN-Ecosystem-v2) -->
        <article
          v-for="entry in featuredItems"
          :key="entry.item.id"
          class="academic-offer-card academic-offer-card--featured"
          :style="cardStyle(entry.item)"
          v-bind="edit(`items.${entry.index}`)"
        >
          <AtomLink
            :href="entry.item.href || undefined"
            :target="entry.item.target"
            as="div"
            class="academic-offer-card__media-link"
            :aria-label="entry.item.href ? `Ir a ${entry.item.title || 'categoría'}` : undefined"
          >
            <div class="academic-offer-card__media" v-bind="edit('.image')">
              <img
                v-if="entry.item.image"
                :src="entry.item.image"
                :alt="entry.item.imageAlt || entry.item.title || ''"
                width="390"
                height="358"
                class="image-focus-responsive"
                :style="imageFocusProfilesStyle(entry.item.imageFocusProfiles, entry.item.imageFocusX, entry.item.imageFocusY)"
                loading="lazy"
                decoding="async"
              />
              <div v-else class="academic-offer-card__media-empty" aria-hidden="true">
                <AtomIcon name="layout-grid" :size="32" />
              </div>
            </div>
          </AtomLink>

          <div class="academic-offer-card__wrapper">
            <AtomLink
              :href="entry.item.href || undefined"
              :target="entry.item.target"
              as="div"
              class="academic-offer-card__head"
              :aria-label="entry.item.href ? `Ir a ${entry.item.title || 'categoría'}` : undefined"
            >
              <div class="academic-offer-card__head-text">
                <AtomHeading
                  v-if="entry.item.title"
                  :level="3"
                  size="h5"
                  weight="semibold"
                  class="academic-offer-card__title"
                  v-bind="edit('.title')"
                >
                  {{ entry.item.title }}
                </AtomHeading>

                <AtomText
                  v-if="entry.item.desc"
                  size="body"
                  class="academic-offer-card__desc"
                  v-bind="edit('.desc')"
                >
                  {{ entry.item.desc }}
                </AtomText>
              </div>

              <span
                class="academic-offer-card__arrow"
                aria-hidden="true"
                v-bind="edit('.href')"
              >
                <AtomIcon name="chevron-right" :size="24" />
              </span>
            </AtomLink>

            <ul
              v-if="entry.item.links.length"
              class="academic-offer-card__links"
              :aria-label="`Subcategorías de ${entry.item.title}`"
            >
              <li
                v-for="(link, li) in entry.item.links"
                :key="link.id"
                class="academic-offer-card__link-item"
                v-bind="edit(`.links.${li}.label`)"
              >
                <AtomButton
                  variant="list"
                  :href="link.href || undefined"
                  :target="link.target"
                  class="academic-offer-card__link"
                >
                  <span class="academic-offer-card__link-label">{{ link.label }}</span>
                  <AtomIcon name="arrow-right" :size="16" class="academic-offer-card__link-icon" />
                </AtomButton>
              </li>
            </ul>
          </div>
        </article>

        <!-- Rejilla de tarjetas compactas (3 cols Desktop / 2 cols Tablet / 1 col Mobile) -->
        <div v-if="compactItems.length" class="academic-offer__grid">
          <article
            v-for="entry in compactItems"
            :key="entry.item.id"
            class="academic-offer-card academic-offer-card--compact"
            :style="cardStyle(entry.item)"
            v-bind="edit(`items.${entry.index}`)"
          >
            <AtomLink
              :href="entry.item.href || undefined"
              :target="entry.item.target"
              as="div"
              class="academic-offer-card__compact-link"
              :aria-label="entry.item.href ? `Ir a ${entry.item.title || 'categoría'}` : undefined"
            >
              <div class="academic-offer-card__media" v-bind="edit('.image')">
                <img
                  v-if="entry.item.image"
                  :src="entry.item.image"
                  :alt="entry.item.imageAlt || entry.item.title || ''"
                  width="410"
                  height="150"
                  class="image-focus-responsive"
                  :style="imageFocusProfilesStyle(entry.item.imageFocusProfiles, entry.item.imageFocusX, entry.item.imageFocusY)"
                  loading="lazy"
                  decoding="async"
                />
                <div v-else class="academic-offer-card__media-empty" aria-hidden="true">
                  <AtomIcon name="layout-grid" :size="28" />
                </div>
              </div>

              <div class="academic-offer-card__wrapper">
                <div class="academic-offer-card__head academic-offer-card__head--compact">
                  <div class="academic-offer-card__head-text">
                    <AtomHeading
                      v-if="entry.item.title"
                      :level="3"
                      size="h5"
                      weight="semibold"
                      class="academic-offer-card__title"
                      v-bind="edit('.title')"
                    >
                      {{ entry.item.title }}
                    </AtomHeading>

                    <AtomText
                      v-if="entry.item.desc"
                      size="body"
                      class="academic-offer-card__desc"
                      v-bind="edit('.desc')"
                    >
                      {{ entry.item.desc }}
                    </AtomText>
                  </div>

                  <span
                    class="academic-offer-card__arrow"
                    aria-hidden="true"
                    v-bind="edit('.href')"
                  >
                    <AtomIcon name="chevron-right" :size="24" />
                  </span>
                </div>
              </div>
            </AtomLink>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Oferta Académica / Categorías — reutiliza átomos ARCIS y replica la arquitectura
 * de tarjetas Banner-ESAN-Ecosystem-v2 (destacado con subenlaces + grilla 3/2/1 cols).
 */
import { computed, type CSSProperties } from 'vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import AtomLink from '../../../atoms/AtomLink.vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import { resolveBrandContentToken } from '../../../editor-beta/EditorBrandColor/brandColors';
import { imageFocusProfilesStyle } from '../../../../helpers/imageFocus';
import { useEditTarget } from '../../../../core/editFocus';
import {
  normalizeAcademicOfferData,
  type AcademicOfferItem,
} from './types';

const props = defineProps<{ data: any }>();
const edit = useEditTarget();

const content = computed(() => normalizeAcademicOfferData(props.data));

const indexedItems = computed(() =>
  content.value.items.map((item, index) => ({ item, index })),
);

const featuredItems = computed(() =>
  indexedItems.value.filter((entry) => entry.item.variant === 'featured'),
);

const compactItems = computed(() =>
  indexedItems.value.filter((entry) => entry.item.variant !== 'featured'),
);

const cardStyle = (item: AcademicOfferItem): CSSProperties => ({
  '--ao-card-color': `var(${item.colorToken || '--ds-color-esan-corp'})`,
  '--ao-card-fg': `var(${resolveBrandContentToken(item.colorToken || '--ds-color-esan-corp')})`,
} as CSSProperties);
</script>

<template>
  <section class="convenios-dpa">
    <!-- World map silhouette in the background (Figma 2315:38541, 5% opacity) -->
    <img
      class="convenios-dpa__map"
      :src="mapSvgUrl"
      alt=""
      width="1973"
      height="856"
      loading="lazy"
      decoding="async"
      aria-hidden="true"
    />

    <!-- Curved red dome + compass watermark (Figma 2315:38517) -->
    <img
      class="convenios-dpa__dome"
      :src="domeSvgUrl"
      alt=""
      width="1920"
      height="361"
      loading="lazy"
      decoding="async"
      aria-hidden="true"
    />

    <div class="convenios-dpa__inner">
      <header
        v-if="dataNormalized.eyebrow || dataNormalized.title"
        class="convenios-dpa__header"
      >
        <AtomEyebrow
          v-if="dataNormalized.eyebrow"
          as="p"
          class="convenios-dpa__eyebrow"
          v-bind="edit('eyebrow')"
        >
          {{ dataNormalized.eyebrow }}
        </AtomEyebrow>

        <AtomHeading
          v-if="dataNormalized.title"
          :level="2"
          size="h2"
          weight="semibold"
          class="convenios-dpa__title"
          v-bind="edit('title')"
        >
          {{ dataNormalized.title }}
        </AtomHeading>

        <span
          v-if="dataNormalized.title"
          class="convenios-dpa__rule"
          aria-hidden="true"
        ></span>
      </header>

      <div
        v-if="dataNormalized.cards.length"
        class="convenios-dpa__grid"
      >
        <article
          v-for="(card, index) in dataNormalized.cards"
          :key="card.id"
          class="convenios-dpa-card"
          v-bind="edit(`cards.${index}`)"
        >
          <div class="convenios-dpa-card__media" v-bind="edit('.image')">
            <img
              :src="card.image"
              :alt="card.imageAlt || ''"
              width="468"
              height="259"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div class="convenios-dpa-card__body">
            <div
              v-if="card.logo"
              class="convenios-dpa-card__logo-wrap"
              v-bind="edit('.logo')"
            >
              <img
                class="convenios-dpa-card__logo"
                :src="card.logo"
                :alt="card.logoAlt || 'Universidad asociada'"
                :style="{ maxHeight: `${card.logoHeight}px` }"
                loading="lazy"
                decoding="async"
              />
            </div>

            <span
              class="convenios-dpa-card__rule"
              aria-hidden="true"
            ></span>

            <AtomText
              v-if="card.desc"
              size="body-lg"
              class="convenios-dpa-card__desc"
              v-bind="edit('.desc')"
            >
              {{ card.desc }}
            </AtomText>
          </div>
        </article>
      </div>

      <AtomButton
        v-if="dataNormalized.button.label"
        variant="light"
        class="convenios-dpa__action"
        :href="dataNormalized.button.url || '#'"
        :target="dataNormalized.button.target"
        v-bind="edit('button.label')"
      >
        <span>{{ dataNormalized.button.label }}</span>
        <AtomIcon name="arrow-right" :size="16" />
      </AtomButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import mapSvgUrl from '../../../../assets/images/mapamundi-dpa.svg';
import domeSvgUrl from '../../../../assets/images/convenios-dpa-dome.svg';
import { useEditTarget } from '../../../../core/editFocus';
import { normalizeConveniosData } from './types';

const edit = useEditTarget();

const props = defineProps<{
  data: any;
}>();

const dataNormalized = computed(() => normalizeConveniosData(props.data));
</script>


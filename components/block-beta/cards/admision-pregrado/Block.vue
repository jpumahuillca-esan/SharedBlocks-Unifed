<template>
  <section class="card-section admision-pregrado">
    <header
      v-if="data.title || data.desc || (data.linkLabel && data.linkUrl)"
      class="admision-pregrado__header"
    >
      <div class="admision-pregrado__heading">
        <AtomHeading
          v-if="data.title"
          v-bind="edit('title')"
          :level="2"
          size="h2"
          weight="semibold"
          class="admision-pregrado__title"
        >
          {{ data.title }}
        </AtomHeading>

        <span v-if="data.title" class="admision-pregrado__rule" aria-hidden="true"></span>

        <AtomText
          v-if="data.desc"
          v-bind="edit('desc')"
          size="body-lg"
          weight="regular"
          class="admision-pregrado__desc"
        >
          {{ data.desc }}
        </AtomText>
      </div>

      <AtomButton
        v-if="data.linkLabel && data.linkUrl"
        v-bind="edit('linkLabel')"
        variant="link"
        size="md"
        class="admision-pregrado__cta"
        :href="data.linkUrl"
      >
        {{ data.linkLabel }}
        <AtomIcon name="arrow-right" :size="16" />
      </AtomButton>
    </header>

    <CardSlider
      v-if="data.cards.length"
      class="admision-pregrado__slider"
      role="region"
      :aria-label="data.title || 'Tarjetas de admisión de pregrado'"
      :count="data.cards.length"
      :columns="data.cardCount"
    >
      <MoleculeBanner
        v-for="(card, index) in data.cards"
        v-bind="edit('cards.' + index)"
        :key="card.id"
        variant="image"
        class="admision-pregrado__card"
        :image="card.image"
        :image-alt="card.imageAlt"
        :title="card.title"
        :title-level="3"
        title-size="h5"
        :text="card.desc"
        text-size="body-compact"
        :href="card.href"
      />
    </CardSlider>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import AtomText from '../../../atoms/AtomText.vue';
import MoleculeBanner from '../../../molecules/MoleculeBanner.vue';
import CardSlider from '../../events/_shared/CardSlider.vue';
import { useEditTarget } from '../../../../core/editFocus';
import { buildAdmissionPregradoData } from './_shared/types';

const props = defineProps<{ data: any }>();

const edit = useEditTarget();
const data = computed(() => buildAdmissionPregradoData(props.data));
</script>

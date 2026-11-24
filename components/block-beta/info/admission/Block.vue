<template>
  <section class="admission-section">
    <div class="admission-section__container">
      <CardSectionHeader
        class="admission-section__header"
        :eyebrow="content.eyebrow"
        eyebrow-as="h2"
        :title="content.title"
        title-as="h3"
        :desc="content.description"
        link-label=""
        link-url=""
      />

      <div class="admission-section__body">
        <div v-if="content.schedule.length" class="admission-section__schedule">
          <div v-for="(item, index) in content.schedule" :key="item.id" class="admission-section__schedule-row" v-bind="edit(`schedule.${index}`)">
            <AtomText size="body" weight="semibold" class="admission-section__schedule-label" v-bind="edit('.label')">{{ item.label }}</AtomText>
            <AtomText size="body-lg" weight="medium" class="admission-section__schedule-value" v-bind="edit('.value')">{{ item.value }}</AtomText>
          </div>
        </div>

        <section v-if="content.steps.length" class="admission-section__steps-section">
          <h4 v-if="content.stepsTitle" class="admission-section__subheading" v-bind="edit('stepsTitle')">{{ content.stepsTitle }}</h4>
          <div class="admission-section__steps">
            <article v-for="(step, index) in content.steps" :key="step.id" class="admission-section__step" v-bind="edit(`steps.${index}`)">
              <span class="admission-section__step-number" aria-hidden="true">{{ index + 1 }}</span>
              <div class="admission-section__step-content">
                <AtomHeading v-if="step.title" :level="5" size="h6" weight="bold" class="admission-section__step-title" v-bind="edit('.title')">{{ step.title }}</AtomHeading>
                <AtomText v-if="step.description" size="body" class="admission-section__step-description" v-bind="edit('.description')">{{ step.description }}</AtomText>
                <AtomButton v-if="step.linkLabel" variant="text" :href="step.linkUrl || undefined" :target="step.linkTarget || undefined" class="admission-section__step-link" v-bind="edit('.linkLabel')">
                  <AtomIcon name="arrow-right" :size="16" />
                  {{ step.linkLabel }}
                </AtomButton>
              </div>
            </article>
          </div>
        </section>

        <section v-if="content.modalities.length" class="admission-section__modalities-section">
          <h4 v-if="content.modalitiesTitle" class="admission-section__subheading" v-bind="edit('modalitiesTitle')">{{ content.modalitiesTitle }}</h4>
          <div class="admission-section__modalities">
            <template v-for="(item, index) in content.modalities" :key="item.id">
              <AtomButton v-if="item.label" variant="secondary" :href="item.url || undefined" :target="item.target || undefined" class="admission-section__modality-button" v-bind="edit(`modalities.${index}.label`)">
                {{ item.label }}
              </AtomButton>
            </template>
          </div>
        </section>

        <section v-if="content.cards.length" class="admission-section__cards-section">
          <div v-if="content.cardsTitle" class="admission-section__cards-heading" v-bind="edit('cardsTitle')">{{ content.cardsTitle }}</div>
          <div class="admission-section__cards">
            <article
              v-for="(card, index) in content.cards"
              :key="card.id"
              class="admission-section__card"
              :style="{ backgroundColor: `var(${card.backgroundToken})`, color: `var(${resolveBrandContentToken(card.backgroundToken)})` }"
              v-bind="edit(`cards.${index}`)"
            >
              <div class="admission-section__card-media" v-bind="edit('.image')">
                <img
                  v-if="card.image"
                  class="admission-section__card-image image-focus-responsive"
                  :src="card.image"
                  :alt="card.imageAlt"
                  :style="imageFocusProfilesStyle(card.imageFocusProfiles, card.imageFocusX, card.imageFocusY)"
                  loading="lazy"
                  decoding="async"
                />
                <span v-else class="admission-section__card-image-placeholder">Imagen de la tarjeta</span>
              </div>
              <div class="admission-section__card-content">
                <p v-if="card.eyebrow" class="admission-section__card-eyebrow" v-bind="edit('.eyebrow')">{{ card.eyebrow }}</p>
                <h3 v-if="card.title" class="admission-section__card-title" v-bind="edit('.title')">{{ card.title }}</h3>
                <p v-if="card.description" class="admission-section__card-description" v-bind="edit('.description')">{{ card.description }}</p>
                <AtomButton
                  v-if="card.buttonLabel"
                  variant="primary"
                  :negative="card.backgroundToken === '--ds-color-esan-corp'"
                  class="admission-section__card-button"
                  :href="card.buttonUrl || undefined"
                  :target="card.buttonTarget || undefined"
                  v-bind="edit('.buttonLabel')"
                >
                  {{ card.buttonLabel }}
                  <AtomIcon name="arrow-right" :size="16" />
                </AtomButton>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import AtomText from '../../../atoms/AtomText.vue';
import CardSectionHeader from '../../events/_shared/CardSectionHeader.vue';
import { useEditTarget } from '../../../../core/editFocus';
import { imageFocusProfilesStyle } from '../../../../helpers/imageFocus';
import { resolveBrandContentToken } from '../../../editor-beta/EditorBrandColor/brandColors';
import { normalizeAdmissionData, type AdmissionData } from './shared/types';

const props = defineProps<{ data?: Partial<AdmissionData> }>();
const edit = useEditTarget();
const content = computed(() => normalizeAdmissionData(props.data));
</script>

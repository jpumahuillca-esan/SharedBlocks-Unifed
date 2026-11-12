<template>
  <section
    class="about-dpa"
    :style="{ backgroundColor: dataNormalized.backgroundColor || '#FFFFFF' }"
    v-bind="edit('backgroundColor')"
  >
    <div class="about-dpa__inner">
      <div class="about-dpa__row">
        <!-- Left Column: Title, Red Rule, Description, Actions -->
        <div class="about-dpa__col about-dpa__col--text">
          <header
            v-if="dataNormalized.eyebrow || dataNormalized.title"
            class="about-dpa__header"
          >
            <AtomText
              v-if="dataNormalized.eyebrow"
              size="body-sm"
              weight="semibold"
              class="about-dpa__eyebrow"
              v-bind="edit('eyebrow')"
            >
              {{ dataNormalized.eyebrow }}
            </AtomText>

            <AtomHeading
              v-if="dataNormalized.title"
              :level="2"
              size="h2"
              weight="semibold"
              class="about-dpa__title"
              v-bind="edit('title')"
            >
              {{ dataNormalized.title }}
            </AtomHeading>

            <span
              v-if="dataNormalized.title"
              class="about-dpa__rule"
              aria-hidden="true"
            ></span>
          </header>

          <div
            v-if="dataNormalized.description"
            class="about-dpa__body"
          >
            <AtomText
              size="body-lg"
              class="about-dpa__desc"
              v-bind="edit('description')"
            >
              {{ dataNormalized.description }}
            </AtomText>
          </div>

          <div
            v-if="dataNormalized.primaryButton.label || dataNormalized.secondaryButton.label"
            class="about-dpa__actions"
          >
            <AtomButton
              v-if="dataNormalized.primaryButton.label"
              variant="primary"
              class="about-dpa__btn-primary"
              :href="dataNormalized.primaryButton.url || '#'"
              :target="dataNormalized.primaryButton.target"
              v-bind="edit('primaryButton.label')"
            >
              {{ dataNormalized.primaryButton.label }}
            </AtomButton>

            <AtomButton
              v-if="dataNormalized.secondaryButton.label"
              variant="link"
              class="about-dpa__btn-link"
              :href="dataNormalized.secondaryButton.url || '#'"
              :target="dataNormalized.secondaryButton.target"
              v-bind="edit('secondaryButton.label')"
            >
              <span>{{ dataNormalized.secondaryButton.label }}</span>
              <AtomIcon name="arrow-right" :size="16" />
            </AtomButton>
          </div>
        </div>

        <!-- Right Column: Video Preview -->
        <div
          class="about-dpa__col about-dpa__col--media"
          v-bind="edit('image')"
        >
          <MoleculeVideoPreview
            class="about-dpa__video"
            :image="dataNormalized.image"
            :image-alt="dataNormalized.imageAlt"
            :image-focus-x="dataNormalized.imageFocusX"
            :image-focus-y="dataNormalized.imageFocusY"
            :image-focus-profiles="dataNormalized.imageFocusProfiles"
            :duration="dataNormalized.duration"
            :video-url="dataNormalized.videoUrl"
            :aria-label="playLabel"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import MoleculeVideoPreview from '../../../molecules/MoleculeVideoPreview.vue';
import { useEditTarget } from '../../../../core/editFocus';
import { normalizeAboutDpaData } from './types';

const edit = useEditTarget();

const props = defineProps<{
  data: any;
}>();

const dataNormalized = computed(() => normalizeAboutDpaData(props.data));

const playLabel = computed(() => {
  const title = dataNormalized.value.title?.trim();
  return title ? `Reproducir video de ${title}` : 'Reproducir video';
});
</script>


<template>
  <div class="cta-banner__content">
    <component
      :is="isEyebrowH2 ? 'h2' : 'p'"
      v-if="eyebrow"
      class="cta-banner__eyebrow"
      v-bind="edit('eyebrow')"
    >
      {{ eyebrow }}
    </component>

    <AtomHeading
      v-if="title"
      :as="isEyebrowH2 ? 'p' : 'h2'"
      :level="2"
      size="h3"
      weight="semibold"
      class="cta-banner__title"
      v-bind="edit('title')"
    >
      {{ title }}
    </AtomHeading>

    <AtomText
      v-if="desc"
      size="body-lg"
      weight="regular"
      class="cta-banner__desc"
      v-bind="edit('desc')"
    >
      {{ desc }}
    </AtomText>

    <AtomButton
      v-if="buttonLabel"
      variant="primary"
      :negative="buttonNegative"
      class="cta-banner__button"
      :href="buttonUrl || '#'"
      :target="buttonTarget"
      v-bind="edit('buttonLabel')"
    >
      <span class="cta-banner__button-label">{{ buttonLabel }}</span>
      <AtomIcon name="arrow-right" :size="16" aria-hidden="true" />
    </AtomButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AtomButton from '../../../../atoms/AtomButton.vue';
import AtomHeading from '../../../../atoms/AtomHeading.vue';
import AtomIcon from '../../../../atoms/AtomIcon.vue';
import AtomText from '../../../../atoms/AtomText.vue';
import { useEditTarget } from '../../../../../core/editFocus';

const props = defineProps<{
  eyebrow?: string;
  eyebrowAsH2?: boolean;
  title: string;
  desc: string;
  buttonLabel: string;
  buttonNegative: boolean;
  buttonUrl: string;
  buttonTarget: string;
}>();

const edit = useEditTarget();

/* Si eyebrowAsH2 está activo y hay texto en el antetítulo, este pasa a ser el <h2> y el título a <p>. */
const isEyebrowH2 = computed(() => Boolean(props.eyebrowAsH2 && props.eyebrow && props.eyebrow.trim()));
</script>

<template>
  <section class="cta-banner-section">
    <div class="cta-banner">
      <div class="cta-banner__layout" :style="panelColorStyle">
        <div class="cta-banner__panel">
          <CtaBannerContent
            :title="banner.title"
            :desc="banner.desc"
            :button-label="banner.buttonLabel"
            :button-negative="banner.buttonNegative"
            :button-url="banner.buttonUrl"
            :button-target="banner.buttonTarget"
          />
        </div>

        <div class="cta-banner__media" v-bind="edit('image')">
          <img
            v-if="banner.image"
            :src="banner.image"
            :alt="banner.imageAlt"
            :style="imageFocusStyle(banner.imageFocusX, banner.imageFocusY)"
            loading="lazy"
            decoding="async"
          />
          <span v-else class="cta-banner__placeholder" aria-hidden="true"></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CtaBannerContent from './shared/CtaBannerContent.vue';
import { normalizeCtaBannerData } from './shared/types';
import { resolveBrandContentToken } from '../../../editor-beta/EditorBrandColor/brandColors';
import { imageFocusStyle } from '../../../../helpers/imageFocus';
import { useEditTarget } from '../../../../core/editFocus';

const props = defineProps<{ data: any }>();

const edit = useEditTarget();
const banner = computed(() => normalizeCtaBannerData(props.data));
const panelColorStyle = computed(() => ({
  '--cta-banner-panel-color': `var(${banner.value.panelColorToken})`,
  '--cta-banner-content-color': `var(${resolveBrandContentToken(banner.value.panelColorToken)})`,
}));
</script>

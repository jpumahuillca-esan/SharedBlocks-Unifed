<template>
  <section class="malla-curricular">
    <div class="malla-curricular__inner">
      <!-- Encabezado del bloque -->
      <header
        v-if="dataNormalized.eyebrow || dataNormalized.title || dataNormalized.desc"
        class="malla-curricular__header"
      >
        <AtomEyebrow
          v-if="dataNormalized.eyebrow"
          as="p"
          class="malla-curricular__eyebrow"
          v-bind="edit('eyebrow')"
        >
          {{ dataNormalized.eyebrow }}
        </AtomEyebrow>

        <AtomHeading
          v-if="dataNormalized.title"
          :level="2"
          size="h2"
          weight="bold"
          class="malla-curricular__title"
          v-bind="edit('title')"
        >
          {{ dataNormalized.title }}
        </AtomHeading>

        <span
          v-if="dataNormalized.title"
          class="malla-curricular__rule"
          aria-hidden="true"
        ></span>

        <AtomText
          v-if="dataNormalized.desc"
          size="body"
          class="malla-curricular__desc"
          v-bind="edit('desc')"
        >
          {{ dataNormalized.desc }}
        </AtomText>
      </header>

      <!-- Lista de Años desplegables -->
      <div v-if="dataNormalized.years.length" class="malla-curricular__years">
        <article
          v-for="(year, yearIndex) in dataNormalized.years"
          :key="year.id"
          class="malla-year"
          :class="{ 'is-open': isYearOpen(year.id) }"
          v-bind="edit(`years.${yearIndex}`)"
        >
          <button
            type="button"
            class="malla-year__trigger"
            :aria-expanded="isYearOpen(year.id)"
            @click="toggleYear(year.id)"
          >
            <div class="malla-year__title-wrap">
              <span class="malla-year__number">{{ year.number }}</span>
              <span class="malla-year__title">{{ year.title }}</span>
            </div>

            <span
              class="malla-year__icon"
              :class="{ 'is-open': isYearOpen(year.id) }"
              aria-hidden="true"
            >
              <AtomIcon name="chevron-down" :size="24" />
            </span>
          </button>

          <div v-show="isYearOpen(year.id)" class="malla-year__body">
            <div class="malla-cycles-grid">
              <div
                v-for="cycle in year.cycles"
                :key="cycle.id"
                class="malla-cycle"
              >
                <h4 class="malla-cycle__title">{{ cycle.name }}</h4>

                <div class="malla-cycle__courses">
                  <div
                    v-for="course in cycle.courses"
                    :key="course.id"
                    class="malla-course-card"
                  >
                    <span class="malla-course-card__name">{{ course.name }}</span>
                    <span v-if="course.badge" class="malla-course-card__badge">{{ course.badge }}</span>
                  </div>
                </div>

                <p v-if="cycle.note" class="malla-cycle__note">
                  {{ cycle.note }}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Alerta informativa / disclaimer -->
      <div v-if="dataNormalized.showAlert" class="malla-curricular__alert">
        <span class="malla-curricular__alert-icon" aria-hidden="true">
          <i class="las la-info-circle"></i>
        </span>
        <p class="malla-curricular__alert-text" v-bind="edit('alertText')">
          {{ dataNormalized.alertText }}
        </p>
      </div>

      <!-- Pie con enlaces a modalidades y descarga de brochure -->
      <footer
        v-if="dataNormalized.modalities?.length || dataNormalized.showDownload"
        class="malla-curricular__footer-actions"
      >
        <div v-if="dataNormalized.modalities?.length" class="malla-curricular__modalities">
          <a
            v-for="(mod, mIdx) in dataNormalized.modalities"
            :key="mIdx"
            :href="mod.url || '#'"
            class="malla-curricular__modality-link"
          >
            <span>{{ mod.label }}</span>
            <AtomIcon name="arrow-right" :size="14" />
          </a>
        </div>

        <a
          v-if="dataNormalized.showDownload"
          :href="dataNormalized.downloadUrl || '#'"
          class="malla-curricular__download-btn"
          target="_blank"
          rel="noopener noreferrer"
          v-bind="edit('downloadLabel')"
        >
          <AtomIcon name="download" :size="18" />
          <span>{{ dataNormalized.downloadLabel }}</span>
        </a>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import { useEditTarget } from '../../../../core/editFocus';
import {
  buildMallaCurricularData,
  type MallaCurricularData,
} from './shared/types';

const props = defineProps<{
  data: Partial<MallaCurricularData> | any;
}>();

const edit = useEditTarget();
const dataNormalized = computed(() => buildMallaCurricularData(props.data));

// Estado de apertura de años: por defecto abre el año configurado con defaultOpen o el primero
const openYears = ref<Record<string, boolean>>({
  'year-1': true,
});

const isYearOpen = (yearId: string) => Boolean(openYears.value[yearId]);

const toggleYear = (yearId: string) => {
  openYears.value[yearId] = !openYears.value[yearId];
};
</script>


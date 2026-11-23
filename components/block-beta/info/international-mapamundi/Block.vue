<template>
  <section
    class="international-mapamundi"
    :style="{
      backgroundImage: `url('${mapamundiUrl}')`,
    }"
  >
    <div class="international-mapamundi__inner">
      <header
        v-if="data.eyebrow || data.title || data.subtitle"
        class="international-mapamundi__header"
      >
        <AtomHeading
          v-if="data.eyebrow"
          :level="2"
          size="body-sm"
          weight="semibold"
          class="international-mapamundi__eyebrow"
          v-bind="edit('eyebrow')"
        >
          {{ data.eyebrow }}
        </AtomHeading>

        <AtomHeading
          v-if="data.title"
          :level="3"
          size="h2"
          weight="semibold"
          class="international-mapamundi__title"
          v-bind="edit('title')"
        >
          {{ data.title }}
        </AtomHeading>

        <span v-if="data.title" class="international-mapamundi__rule" aria-hidden="true"></span>

        <AtomText
          v-if="data.subtitle"
          size="body-lg"
          class="international-mapamundi__subtitle"
          v-bind="edit('subtitle')"
        >
          {{ data.subtitle }}
        </AtomText>
      </header>

      <div class="international-mapamundi__stage">
        <article class="international-mapamundi-card" v-bind="edit('left')">
          <AtomHeading :level="4" size="body" weight="bold" class="international-mapamundi-card__head">
            <img
              class="international-mapamundi-card__logo"
              :src="logoUniversityUrl"
              alt="ESAN University"
              width="142"
              height="40"
            />
          </AtomHeading>

          <div class="international-mapamundi-card__body">
            <AtomBadge
              v-if="data.left?.tag"
              as="div"
              variant="brand-solid"
              class="international-mapamundi-card__tag"
              v-bind="edit('.tag')"
            >
              {{ data.left.tag }}
            </AtomBadge>

            <ul v-if="items.length" class="international-mapamundi-card__list">
              <li
                v-for="item in items"
                :key="item.id"
                class="international-mapamundi-card__item"
                v-bind="edit(`.items.${item.index}`)"
              >
                <AtomPictogram :name="item.icon" :size="32" v-bind="edit('.icon')" />
                <AtomText size="body-compact" class="international-mapamundi-card__text" v-bind="edit('.text')">
                  {{ item.text }}
                </AtomText>
              </li>
            </ul>

            <span class="international-mapamundi-card__barcode" aria-hidden="true"></span>
          </div>
        </article>

        <div class="international-mapamundi__artwork">
          <img
            class="international-mapamundi__image"
            :src="passportUrl"
            :alt="data.imageAlt || ''"
            width="678"
            height="520"
            loading="lazy"
            decoding="async"
            v-bind="edit('imageAlt')"
          />
        </div>
      </div>

      <AtomButton
        v-if="data.button?.label"
        variant="light"
        class="international-mapamundi__action"
        v-bind="edit('button.label')"
        :href="data.button.url || '#'"
        :target="normalizeLinkTarget(data.button.target)"
      >
        {{ data.button.label }}
        <AtomIcon name="arrow-right" :size="16" />
      </AtomButton>
    </div>

    <div class="international-mapamundi__base">
      <span class="international-mapamundi__compass" aria-hidden="true">
        <img :src="compassUrl" alt="" width="494" height="203" loading="lazy" decoding="async" />
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomBadge from '../../../atoms/AtomBadge.vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import AtomPictogram from '../../../atoms/AtomPictogram.vue';
import logoUniversityUrl from '../../../../assets/images/logos/logo-esan-university-light.svg';
import compassUrl from '../../../../assets/images/mapamundi-compass.png';
import mapamundiUrl from '../../../../assets/images/mapamundi.webp';
import passportUrl from '../../../../assets/images/pasaporte.webp';
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';
import { useEditTarget } from '../../../../core/editFocus';

const edit = useEditTarget();
const props = defineProps<{ data: any }>();

const items = computed(() =>
  (Array.isArray(props.data?.left?.items) ? props.data.left.items : [])
    .map((item: any, index: number) => ({
      id: item?.id || `international-mapamundi-item-${index}`,
      index,
      icon: item?.icon || '',
      text: String(item?.text || '').trim(),
    }))
    .filter((item: { text: string }) => item.text),
);
</script>

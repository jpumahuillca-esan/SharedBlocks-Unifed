<template>
  <section class="graduate-profile-section">
    <div class="graduate-profile-section__container">
      <header v-if="content.title" class="graduate-profile-section__header">
        <AtomHeading :level="2" size="h2" weight="semibold" class="graduate-profile-section__title" v-bind="edit('title')">
          {{ content.title }}
        </AtomHeading>
        <span class="graduate-profile-section__rule" aria-hidden="true"></span>
      </header>

      <div v-if="content.cards.length" class="graduate-profile-section__grid">
        <article
          v-for="(card, cardIndex) in content.cards"
          :key="card.id"
          class="graduate-profile-section__card"
          v-bind="edit(`cards.${cardIndex}`)"
        >
          <div class="graduate-profile-section__card-header">
            <AtomHeading v-if="card.title" :level="3" size="h5" weight="semibold" class="graduate-profile-section__card-title" v-bind="edit('.title')">
              {{ card.title }}
            </AtomHeading>
            <AtomText v-if="card.intro" size="body" class="graduate-profile-section__intro" v-bind="edit('.intro')">
              {{ card.intro }}
            </AtomText>
          </div>

          <div v-if="card.items.length" class="graduate-profile-section__items">
            <p v-for="(item, itemIndex) in card.items" :key="item.id" class="graduate-profile-section__item" v-bind="edit(`.items.${itemIndex}.text`)">
              {{ item.text }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import { useEditTarget } from '../../../../core/editFocus';
import { normalizeGraduateProfile, type GraduateProfileData } from './shared/types';

const props = defineProps<{ data?: Partial<GraduateProfileData> }>();
const edit = useEditTarget();
const content = computed(() => normalizeGraduateProfile(props.data));
</script>

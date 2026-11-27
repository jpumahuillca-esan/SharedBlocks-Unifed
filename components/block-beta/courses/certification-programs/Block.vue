<template>
  <section class="certification-programs">
    <div class="certification-programs__inner">
      <header
        v-if="content.eyebrow || content.title"
        class="certification-programs__header"
      >
        <AtomEyebrow
          v-if="content.eyebrow"
          as="p"
          variant="brand"
          class="certification-programs__eyebrow"
          v-bind="edit('eyebrow')"
        >
          {{ content.eyebrow }}
        </AtomEyebrow>

        <AtomHeading
          v-if="content.title"
          :level="2"
          size="h3"
          weight="semibold"
          class="certification-programs__title"
          v-bind="edit('title')"
        >
          {{ content.title }}
        </AtomHeading>

        <span
          v-if="content.title"
          class="certification-programs__rule"
          aria-hidden="true"
        ></span>
      </header>

      <div class="certification-programs__body">
        <!-- Lista de Acordeones Numerados (Figma Collapse-programs 3272:18670 / 3272:18284) -->
        <div v-if="content.programs.length" class="certification-programs__list">
          <article
            v-for="(prog, pIdx) in content.programs"
            :key="prog.id"
            class="cert-program"
            :class="{ 'is-open': isOpen(prog.id) }"
            v-bind="edit(`programs.${pIdx}`)"
          >
            <button
              type="button"
              class="cert-program__trigger"
              :aria-expanded="isOpen(prog.id)"
              :aria-controls="`cert-panel-${prog.id}`"
              @click="toggleProgram(prog.id)"
            >
              <span class="cert-program__trigger-main">
                <span
                  v-if="prog.number"
                  class="cert-program__number"
                  v-bind="edit('.number')"
                >
                  {{ prog.number }}
                </span>
                <span
                  class="cert-program__title"
                  v-bind="edit('.title')"
                >
                  {{ prog.title }}
                </span>
              </span>

              <span class="cert-program__toggle-icon" aria-hidden="true">
                <AtomIcon :name="isOpen(prog.id) ? 'minus' : 'plus'" :size="24" />
              </span>
            </button>

            <div
              v-show="isOpen(prog.id)"
              :id="`cert-panel-${prog.id}`"
              class="cert-program__body"
            >
              <!-- Descripción principal (markdown simple con **negrita**) -->
              <div
                v-if="descriptionParagraphs(prog.description).length"
                class="cert-program__description"
                v-bind="edit('.description')"
              >
                <p
                  v-for="(para, dIdx) in descriptionParagraphs(prog.description)"
                  :key="dIdx"
                  class="cert-program__text"
                >
                  <template v-for="(seg, sIdx) in para" :key="sIdx">
                    <strong v-if="seg.bold">{{ seg.text }}</strong>
                    <template v-else>{{ seg.text }}</template>
                  </template>
                </p>
              </div>

              <!-- Subsección Metodología -->
              <div
                v-if="prog.methodologyTitle || descriptionParagraphs(prog.methodologyText).length"
                class="cert-program__subsection"
              >
                <AtomHeading
                  v-if="prog.methodologyTitle"
                  :level="3"
                  size="h5"
                  weight="semibold"
                  class="cert-program__subtitle"
                  v-bind="edit('.methodologyTitle')"
                >
                  {{ prog.methodologyTitle }}
                </AtomHeading>

                <div
                  v-if="descriptionParagraphs(prog.methodologyText).length"
                  class="cert-program__description"
                  v-bind="edit('.methodologyText')"
                >
                  <p
                    v-for="(para, mIdx) in descriptionParagraphs(prog.methodologyText)"
                    :key="mIdx"
                    class="cert-program__text"
                  >
                    <template v-for="(seg, sIdx) in para" :key="sIdx">
                      <strong v-if="seg.bold">{{ seg.text }}</strong>
                      <template v-else>{{ seg.text }}</template>
                    </template>
                  </p>
                </div>
              </div>

              <!-- Acciones: Ver calendario de clases + enlace secundario (ej. Beneficios) -->
              <div
                v-if="prog.calendarLabel || prog.secondaryActionLabel"
                class="cert-program__actions"
              >
                <AtomButton
                  v-if="prog.calendarLabel"
                  :variant="prog.calendarVariant === 'outline' ? 'secondary' : 'link'"
                  :href="prog.calendarUrl || undefined"
                  :target="prog.calendarUrl ? prog.calendarTarget : undefined"
                  :class="
                    prog.calendarVariant === 'outline'
                      ? 'cert-program__cal-btn'
                      : 'cert-program__cal-link'
                  "
                  v-bind="edit('.calendarLabel')"
                >
                  <AtomIcon name="calendar" :size="prog.calendarVariant === 'outline' ? 18 : 16" aria-hidden="true" />
                  <span>{{ prog.calendarLabel }}</span>
                </AtomButton>

                <AtomButton
                  v-if="prog.secondaryActionLabel"
                  variant="link"
                  :href="prog.secondaryActionUrl || undefined"
                  :target="prog.secondaryActionUrl ? prog.secondaryActionTarget : undefined"
                  class="cert-program__sec-link"
                  v-bind="edit('.secondaryActionLabel')"
                >
                  <span>{{ prog.secondaryActionLabel }}</span>
                  <AtomIcon name="arrow-right" :size="16" aria-hidden="true" />
                </AtomButton>
              </div>

              <!-- Listas de ítems con viñeta cuadrada roja (Objetivos, Cursos y Talleres, etc.) -->
              <div
                v-for="(sec, sIdx) in prog.bulletSections"
                :key="sec.id"
                class="cert-program__subsection"
                v-bind="edit(`.bulletSections.${sIdx}`)"
              >
                <AtomHeading
                  v-if="sec.title"
                  :level="3"
                  size="h5"
                  weight="semibold"
                  class="cert-program__subtitle"
                  v-bind="edit('.title')"
                >
                  {{ sec.title }}
                </AtomHeading>

                <ul v-if="sec.items.length" class="cert-program__bullet-list">
                  <li
                    v-for="(itemText, iIdx) in sec.items"
                    :key="`${sec.id}-${iIdx}`"
                    class="cert-program__bullet-item"
                  >
                    <span class="cert-program__bullet" aria-hidden="true"></span>
                    <span class="cert-program__bullet-text">{{ itemText }}</span>
                  </li>
                </ul>
              </div>

              <!-- Tabla Información general -->
              <div
                v-if="visibleRows(prog.infoRows).length"
                class="cert-program__subsection"
              >
                <AtomHeading
                  v-if="prog.infoTitle"
                  :level="3"
                  size="h5"
                  weight="semibold"
                  class="cert-program__subtitle"
                  v-bind="edit('.infoTitle')"
                >
                  {{ prog.infoTitle }}
                </AtomHeading>

                <dl class="cert-program__info-table">
                  <div
                    v-for="row in visibleRows(prog.infoRows)"
                    :key="row.id"
                    class="cert-program__info-row"
                    v-bind="edit(`.infoRows.${row.index}`)"
                  >
                    <dt class="cert-program__info-label" v-bind="edit('.label')">
                      {{ row.label }}
                    </dt>

                    <dd class="cert-program__info-value" v-bind="edit('.value')">
                      <ul v-if="row.bullets.length" class="cert-program__info-bullets">
                        <li v-for="(bulletLine, bIdx) in row.bullets" :key="bIdx">
                          {{ bulletLine }}
                        </li>
                      </ul>
                      <span
                        v-else
                        :class="
                          row.isLongBody
                            ? 'cert-program__info-text--body'
                            : 'cert-program__info-text--display'
                        "
                      >
                        {{ row.value }}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </article>
        </div>

        <!-- Banda inferior compartida: Formas de pago (PowerPay) -->
        <div
          v-if="content.showPaymentMethods && (content.paymentLabel || content.paymentText || resolvedPaymentLogo)"
          class="certification-programs__payment"
        >
          <p
            v-if="content.paymentLabel"
            class="certification-programs__payment-label"
            v-bind="edit('paymentLabel')"
          >
            {{ content.paymentLabel }}
          </p>

          <div class="certification-programs__payment-detail">
            <p
              v-if="content.paymentText"
              class="certification-programs__payment-text"
              v-bind="edit('paymentText')"
            >
              {{ content.paymentText }}
            </p>

            <img
              v-if="resolvedPaymentLogo"
              :src="resolvedPaymentLogo"
              :alt="content.paymentLogoAlt || 'PowerPay'"
              width="165"
              height="48"
              class="certification-programs__payment-logo"
              loading="lazy"
              decoding="async"
              v-bind="edit('paymentLogo')"
            />
          </div>
        </div>

        <!-- Notas legales al pie -->
        <div
          v-if="footnoteLines.length"
          class="certification-programs__footnotes"
          v-bind="edit('footnotes')"
        >
          <p
            v-for="(line, fIdx) in footnoteLines"
            :key="fIdx"
            class="certification-programs__footnote"
          >
            {{ line }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Certificaciones y Preparación CFA — Lista de acordeones numerados (01, 02...),
 * con descripción, metodología, acciones de calendario, listados con viñeta cuadrada roja,
 * tabla de información general, banda Formas de pago (PowerPay) y notas legales.
 *
 * Tolerante a columna lateral flotante (`ps-columns--float`).
 */
import { computed, ref, watch } from 'vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import { parseInlineBoldParagraphs } from '../../../../helpers/inlineMarkdown';
import { useEditTarget } from '../../../../core/editFocus';
import {
  normalizeCertificationProgramsData,
  parseInfoBulletLines,
  resolvePaymentLogoUrl,
  type CertificationInfoRow,
} from './types';

const props = defineProps<{ data: any }>();
const edit = useEditTarget();

const content = computed(() => normalizeCertificationProgramsData(props.data));

const openIds = ref<string[]>(
  content.value.programs.filter((p) => p.defaultOpen).map((p) => p.id),
);

watch(
  () => content.value.programs.map((p) => `${p.id}:${p.defaultOpen ? 1 : 0}`).join('|'),
  () => {
    const validIds = new Set(content.value.programs.map((p) => p.id));
    const currentOpen = openIds.value.filter((id) => validIds.has(id));
    for (const prog of content.value.programs) {
      if (prog.defaultOpen && !currentOpen.includes(prog.id)) {
        currentOpen.push(prog.id);
      }
    }
    openIds.value = currentOpen;
  },
);

const isOpen = (id: string): boolean => openIds.value.includes(id);

const toggleProgram = (id: string): void => {
  if (isOpen(id)) {
    openIds.value = openIds.value.filter((item) => item !== id);
  } else {
    openIds.value = [...openIds.value, id];
  }
};

const descriptionParagraphs = (raw: string) => parseInlineBoldParagraphs(raw);

const visibleRows = (rows: CertificationInfoRow[]) =>
  rows
    .map((row, index) => {
      const label = row.label.trim();
      const value = row.value.trim();
      const bullets = parseInfoBulletLines(value, row.valueStyle);
      const isLongBody =
        row.valueStyle === 'body' ||
        (row.valueStyle === 'auto' && bullets.length === 0 && value.length > 72);
      return {
        ...row,
        index,
        label,
        value,
        bullets,
        isLongBody,
      };
    })
    .filter((row) => row.label.length > 0 || row.value.length > 0);

const resolvedPaymentLogo = computed(() => resolvePaymentLogoUrl(content.value.paymentLogo));

const footnoteLines = computed(() =>
  content.value.footnotes
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean),
);
</script>

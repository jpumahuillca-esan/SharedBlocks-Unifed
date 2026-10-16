<template>
  <section class="about-career">
    <div class="about-career__inner">
      <header v-if="data?.title" class="about-career__header">
        <!--
          Es un h2: el bloque abre una sección de la página. `size` lo lleva al
          tamaño del diseño. Sin `align`: lo decide la hoja, para que el filete
          de abajo y el título queden siempre a la izquierda.
        -->
        <AtomHeading :level="2" size="h2" weight="bold" class="about-career__title" v-bind="edit('title')">
          {{ data.title }}
        </AtomHeading>

        <!-- Filete corto bajo el título, igual que en `events`, `ecosystem` e `info/values-cards`. -->
        <span class="about-career__rule" aria-hidden="true"></span>
      </header>

      <div v-if="data?.subtitle || data?.description" class="about-career__intro">
        <!-- Subtítulo y descripción son texto de contenido: <p>, no <span>. -->
        <AtomText v-if="data.subtitle" size="body-lg" weight="semibold" class="about-career__subtitle" v-bind="edit('subtitle')">
          {{ data.subtitle }}
        </AtomText>

        <AtomText v-if="data.description" size="body" class="about-career__description" v-bind="edit('description')">
          {{ data.description }}
        </AtomText>
      </div>

      <!--
        MoleculeVideoPreview ya es esta pieza: miniatura 16:9 con esquinas
        redondeadas, botón de play y duración abajo a la derecha. Con `video-url`
        reproduce dentro del propio marco.

        Va SIEMPRE, aunque todavía no haya foto ni video: es el marco con el play
        el que indica dónde va el video en un bloque recién insertado.
      -->
      <div class="about-career__media" v-bind="edit('image')">
        <MoleculeVideoPreview
          :image="media.image"
          :image-alt="media.imageAlt"
          :image-focus-x="media.imageFocusX"
          :image-focus-y="media.imageFocusY"
          :image-focus-profiles="media.imageFocusProfiles"
          :duration="media.duration"
          :video-url="media.videoUrl"
          :aria-label="playLabel"
        />
      </div>

      <!--
        Lista y no una tabla: son datos paralelos de la carrera. Rótulo y valor
        son textos de contenido, así que van en <p>.
      -->
      <ul v-if="details.length" class="about-career__details">
        <li
          v-for="detail in details"
          :key="detail.id"
          class="about-career__detail"
          v-bind="edit(`details.${detail.index}`)"
        >
          <AtomText v-if="detail.label" size="body-compact" class="about-career__detail-label" v-bind="edit('.label')">
            {{ detail.label }}
          </AtomText>

          <AtomHeading as="p" size="h6" weight="bold" class="about-career__detail-value" v-bind="edit('.value')">
            {{ detail.value }}
          </AtomHeading>
        </li>
      </ul>

      <ul v-if="links.length" class="about-career__links">
        <li v-for="link in links" :key="link.id" class="about-career__links-item">
          <!--
            AtomLink resuelve el enlace según el sitio (NuxtLink, RouterLink o
            <a>); `as="a"` hace que sin destino siga siendo un ancla y no un div.
          -->
          <AtomLink
            as="a"
            class="about-career-link"
            :href="link.url || '#'"
            :target="link.target"
            v-bind="edit(`links.${link.index}`)"
          >
            <span v-if="link.icon" class="about-career-link__icon" aria-hidden="true" v-bind="edit('.icon')">
              <AtomIcon :name="link.icon" :size="24" />
            </span>

            <AtomText size="body" weight="medium" class="about-career-link__label" v-bind="edit('.label')">
              {{ link.label }}
            </AtomText>

            <AtomIcon name="chevron-right" :size="20" class="about-career-link__chevron" aria-hidden="true" />
          </AtomLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Acerca de la carrera — presentación de una carrera.
 *
 * Título con filete, subtítulo y descripción, el video de la carrera, una lista
 * de datos (Grado, Título…) y debajo enlaces con ícono a páginas relacionadas
 * (certificaciones, áreas de especialización…). El contenido se escribe desde
 * el editor; no consulta ninguna API.
 *
 * No inventa piezas: el video es MoleculeVideoPreview, el titular y los textos
 * son los átomos de siempre y el enlace es AtomLink. Lo único propio del bloque
 * es la tarjeta de enlace, que el sistema no tiene (ver _about-career.scss).
 */
import { computed } from 'vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import AtomLink from '../../../atoms/AtomLink.vue';
import MoleculeVideoPreview from '../../../molecules/MoleculeVideoPreview.vue';
import {
  normalizeImageFocus,
  normalizeImageFocusProfiles,
} from '../../../../helpers/imageFocus';
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';
import { useEditTarget } from '../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

const props = defineProps<{ data: any }>();

const playLabel = 'Reproducir el video de la carrera';

const media = computed(() => {
  const imageFocusX = normalizeImageFocus(props.data?.imageFocusX);
  const imageFocusY = normalizeImageFocus(props.data?.imageFocusY);

  return {
    image: props.data?.image ?? '',
    imageAlt: props.data?.imageAlt ?? '',
    imageFocusX,
    imageFocusY,
    imageFocusProfiles: normalizeImageFocusProfiles(props.data?.imageFocusProfiles, imageFocusX, imageFocusY),
    videoUrl: props.data?.videoUrl ?? '',
    duration: props.data?.duration ?? '',
  };
});

/*
 * Un dato sin valor no se dibuja: un rótulo solo, sin nada al lado, deja una
 * fila que no dice nada. `index` es la posición en el dato ANTES de filtrar:
 * es la que usa el editor para abrir la tarjeta correcta.
 */
const details = computed(() =>
  (Array.isArray(props.data?.details) ? props.data.details : [])
    .map((detail: any, i: number) => ({
      id: detail?.id || `about-career-detail-${i}`,
      index: i,
      label: String(detail?.label ?? '').trim(),
      value: String(detail?.value ?? '').trim(),
    }))
    .filter((detail: { value: string }) => detail.value),
);

/* Un enlace sin texto no se dibuja: sería una tarjeta con solo un ícono y una flecha. */
const links = computed(() =>
  (Array.isArray(props.data?.links) ? props.data.links : [])
    .map((link: any, i: number) => ({
      id: link?.id || `about-career-link-${i}`,
      index: i,
      icon: link?.icon ?? '',
      label: String(link?.label ?? '').trim(),
      url: link?.url ?? '',
      target: normalizeLinkTarget(link?.target),
    }))
    .filter((link: { label: string }) => link.label),
);
</script>

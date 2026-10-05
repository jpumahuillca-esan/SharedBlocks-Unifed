<template>
  <section class="values-cards">
    <div class="values-cards__inner">
      <!--
        Carril de pestañas, en la forma "cards" del sistema: cada una es su
        propia caja con ícono y la activa se rellena de rojo.

        La molécula trae lo que antes vivía en este bloque: el desplazamiento
        lateral cuando no caben, el arrastre con el ratón y el estado activo.
        Solo queda acá la clase del bloque, que la sangra hasta los bordes de
        la sección.
      -->
      <MoleculeTabs
        v-if="items.length > 1"
        v-model="activeId"
        variant="cards"
        :items="tabItems"
        aria-label="Filtros"
        class="values-cards__filters"
      />

      <article v-if="active" class="values-cards__card" v-bind="edit(`items.${activeIndex}`)">
        <div class="values-cards__body">
          <!--
            Etiqueta, título y filete van juntos en un grupo: entre ellos el aire
            es corto, mientras que del filete hacia abajo la maqueta pide 30px
            parejos. Agrupados, ese hueco lo pone un solo `gap` en el cuerpo.
          -->
          <div class="values-cards__heading">
            <AtomEyebrow v-if="active.eyebrow" as="h2" v-bind="edit('.eyebrow')">{{ active.eyebrow }}</AtomEyebrow>  

            <!--
              Es un h3 y no un h2: el bloque se inserta dentro de una página que
              ya tiene su título de sección. `size` lo lleva al tamaño del diseño
              sin cambiar ese nivel.
            -->
            <AtomHeading
              v-if="active.title"
              :level="3"
              size="h3"
              weight="bold"
              class="values-cards__title"
              v-bind="edit('.title')"
            >
              {{ active.title }}
            </AtomHeading>

            <!-- Filete corto bajo el título, igual que en `events` y `ecosystem`. -->
            <span v-if="active.title" class="values-cards__rule" aria-hidden="true"></span>
          </div>

          <AtomText v-if="active.desc" size="body-compact" class="values-cards__desc" v-bind="edit('.desc')">
            {{ active.desc }}
          </AtomText>

          <ul v-if="active.bullets.length" class="values-cards__list" v-bind="edit('.bullets')">
            <li v-for="(bullet, i) in active.bullets" :key="i" class="values-cards__item">
              <AtomText size="body-compact">{{ bullet }}</AtomText>
            </li>
          </ul>

          <AtomButton
            v-if="active.linkLabel"
            variant="link"
            class="values-cards__link"
            v-bind="edit('.linkLabel')"
            :href="active.linkUrl || '#'"
            :target="active.linkTarget"
          >
            {{ active.linkLabel }}
            <AtomIcon name="arrow-right" :size="16" />
          </AtomButton>
        </div>

        <!--
          El medio es MoleculeVideoPreview en su forma "featured", que ya es
          exactamente esta pieza: foto a sangre, duración arriba y botón de play
          en vidrio. Con `video-url` reproduce dentro de la propia tarjeta.

          Va SIEMPRE, aunque el pilar todavía no tenga foto ni video: es la
          mitad derecha de la tarjeta y, vacía, el marco con el play es lo que
          indica dónde va el video. Ocultarla dejaba el bloque recién insertado
          sin nada a la derecha.

          La `key` remonta el reproductor al cambiar de pilar: sin ella, pasar a
          otra pestaña con un video abierto dejaría sonando el anterior.
        -->
        <div class="values-cards__media" v-bind="edit('.image')">
          <MoleculeVideoPreview
            :key="active.id"
            variant="featured"
            :image="active.image"
            :image-alt="active.imageAlt"
            :image-focus-x="active.imageFocusX"
            :image-focus-y="active.imageFocusY"
            :duration="active.duration"
            :video-url="active.videoUrl"
            :href="active.linkUrl"
            :target="active.linkTarget"
            :aria-label="playLabel"
          />
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Tarjetas de valor con filtros.
 *
 * Una fila de pestañas —los pilares de la propuesta de valor— y, debajo, la
 * tarjeta del pilar elegido: texto a la izquierda y video a la derecha. El
 * contenido se escribe desde el editor; no consulta ninguna API.
 *
 * Solo se ve un pilar a la vez, el que esté seleccionado. Los demás siguen
 * ahí, a un clic en su pestaña: es un filtro, no un carrusel.
 *
 * La tarjeta no inventa piezas: el video es MoleculeVideoPreview ("featured")
 * y la tira de pestañas es MoleculeTabs en su forma "cards".
 */
import { ref, computed, watch } from 'vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import MoleculeTabs, { type TabItem } from '../../../molecules/MoleculeTabs.vue';
import MoleculeVideoPreview from '../../../molecules/MoleculeVideoPreview.vue';
import { normalizeImageFocus } from '../../../../helpers/imageFocus';
import { normalizeLinkTarget, type LinkTarget } from '../../../../helpers/linkTarget';
import { useEditTarget } from '../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

/** Un pilar ya normalizado: lo que la plantilla puede dar por hecho. */
interface ValueItem {
  id: string;
  icon: string;
  tabLabel: string;
  eyebrow: string;
  title: string;
  desc: string;
  bullets: string[];
  linkLabel: string;
  linkUrl: string;
  linkTarget: LinkTarget;
  image: string;
  imageAlt: string;
  imageFocusX: number;
  imageFocusY: number;
  videoUrl: string;
  duration: string;
}

const props = defineProps<{ data: any }>();


const items = computed<ValueItem[]>(() => {
  const raw = Array.isArray(props.data?.items) ? props.data.items : [];

  return raw.map((item: any, i: number) => ({
    id: item?.id || `value-${i}`,
    icon: item?.icon ?? '',
    tabLabel: item?.tabLabel ?? '',
    eyebrow: item?.eyebrow ?? '',
    title: item?.title ?? '',
    desc: item?.desc ?? '',
    /* Una viñeta vacía dejaría un punto suelto sin texto al lado. */
    bullets: (Array.isArray(item?.bullets) ? item.bullets : [])
      .map((bullet: any) => (typeof bullet === 'string' ? bullet : ''))
      .filter((bullet: string) => bullet.trim()),
    linkLabel: item?.linkLabel ?? '',
    linkUrl: item?.linkUrl ?? '',
    linkTarget: normalizeLinkTarget(item?.linkTarget),
    image: item?.image ?? '',
    imageAlt: item?.imageAlt ?? '',
    imageFocusX: normalizeImageFocus(item?.imageFocusX),
    imageFocusY: normalizeImageFocus(item?.imageFocusY),
    videoUrl: item?.videoUrl ?? '',
    duration: item?.duration ?? '',
  }));
});

const activeId = ref('');

/* Lo que la molécula necesita de cada pilar: id, etiqueta e ícono. */
const tabItems = computed<TabItem[]>(() =>
  items.value.map((item) => ({
    id: item.id,
    label: item.tabLabel,
    icon: item.icon || undefined,
  }))
);

const active = computed(
  () => items.value.find((item) => item.id === activeId.value) ?? items.value[0] ?? null
);

/* Posición del pilar visible en el dato, para el enfoque de campos del constructor. */
const activeIndex = computed(() => (active.value ? items.value.indexOf(active.value) : 0));

/*
 * El pilar elegido se guarda por id y no por posición, para que reordenar la
 * lista desde el panel no cambie de tarjeta. Si el que estaba seleccionado
 * desaparece —se quitó desde el editor—, se vuelve al primero.
 */
watch(
  items,
  (list) => {
    if (!list.some((item) => item.id === activeId.value)) {
      activeId.value = list[0]?.id ?? '';
    }
  },
  { immediate: true }
);

const playLabel = computed(() =>
  active.value?.tabLabel
    ? `Reproducir el video de ${active.value.tabLabel}`
    : 'Reproducir el video'
);
</script>

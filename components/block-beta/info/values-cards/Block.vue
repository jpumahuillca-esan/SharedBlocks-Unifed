<template>
  <section class="values-cards">
    <div class="values-cards__inner">
      <!--
        Carril de filtros.

        No se envuelve en varias líneas ni se recorta: en cuanto no caben, se
        desplaza de lado. useDragScroll añade lo único que el desbordamiento no
        cubre — con un ratón no hay gesto horizontal, así que el carril se
        arrastra, igual que en la sección de historias.
      -->
      <div
        v-if="items.length > 1"
        ref="rail"
        class="values-cards__filters"
        role="group"
        aria-label="Filtros"
      >
        <MoleculeChip
          v-for="item in items"
          :key="item.id"
          :active="item.id === activeId"
          class="values-cards__filter"
          @click="activeId = item.id"
        >
          <AtomIcon v-if="item.icon" :name="item.icon" :size="16" />
          {{ item.tabLabel }}
        </MoleculeChip>
      </div>

      <article v-if="active" class="values-cards__card">
        <div class="values-cards__body">
          <!--
            Etiqueta, título y filete van juntos en un grupo: entre ellos el aire
            es corto, mientras que del filete hacia abajo la maqueta pide 30px
            parejos. Agrupados, ese hueco lo pone un solo `gap` en el cuerpo.
          -->
          <div class="values-cards__heading">
            <AtomEyebrow v-if="active.eyebrow" as="p">{{ active.eyebrow }}</AtomEyebrow>

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
            >
              {{ active.title }}
            </AtomHeading>

            <!-- Filete corto bajo el título, igual que en `events` y `ecosystem`. -->
            <span v-if="active.title" class="values-cards__rule" aria-hidden="true"></span>
          </div>

          <AtomText v-if="active.desc" size="body-compact" class="values-cards__desc">
            {{ active.desc }}
          </AtomText>

          <ul v-if="active.bullets.length" class="values-cards__list">
            <li v-for="(bullet, i) in active.bullets" :key="i" class="values-cards__item">
              <AtomText size="body-compact">{{ bullet }}</AtomText>
            </li>
          </ul>

          <AtomButton
            v-if="active.linkLabel"
            variant="link"
            class="values-cards__link"
            :href="active.linkUrl || '#'"
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
        <div class="values-cards__media">
          <MoleculeVideoPreview
            :key="active.id"
            variant="featured"
            :image="active.image"
            :image-alt="active.imageAlt"
            :duration="active.duration"
            :video-url="active.videoUrl"
            :href="active.linkUrl"
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
 * y cada pestaña es MoleculeChip en su forma de filtro, con su estado activo.
 */
import { ref, computed, watch } from 'vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import MoleculeChip from '../../../molecules/MoleculeChip.vue';
import MoleculeVideoPreview from '../../../molecules/MoleculeVideoPreview.vue';
import { useDragScroll } from '../../../../composables/useDragScroll';

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
  image: string;
  imageAlt: string;
  videoUrl: string;
  duration: string;
}

const props = defineProps<{ data: any }>();

/*
 * Con trackpad o pantalla táctil el carril ya se desplaza solo; con un ratón no
 * hay gesto horizontal, así que se puede arrastrar.
 */
const rail = ref<HTMLElement | null>(null);
useDragScroll(rail);

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
    image: item?.image ?? '',
    imageAlt: item?.imageAlt ?? '',
    videoUrl: item?.videoUrl ?? '',
    duration: item?.duration ?? '',
  }));
});

const activeId = ref('');

const active = computed(
  () => items.value.find((item) => item.id === activeId.value) ?? items.value[0] ?? null
);

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

<template>
  <section class="mapamundi">
    <div class="mapamundi__inner">
      <header v-if="data.eyebrow || data.title || data.subtitle" class="mapamundi__header">
        <!--
          Como <p>, igual que la etiqueta de los CTA (ctaband__eyebrow): es un
          texto de contenido, no una marca suelta dentro de otra frase.

          La clase propia es solo para quitarle el punto que el átomo pone
          delante en el resto de la librería: aquí el remate es el filete que
          va bajo el título.
        -->
        <AtomEyebrow v-if="data.eyebrow" as="p" class="mapamundi__eyebrow" v-bind="edit('eyebrow')">
          {{ data.eyebrow }}
        </AtomEyebrow>

        <!--
          Sin `align`: la alineación la decide la hoja del bloque, que centra en
          escritorio y alinea a la izquierda en teléfono. El átomo la aplicaría
          en línea y ganaría siempre sobre el punto de quiebre.
        -->
        <AtomHeading
          v-if="data.title"
          :level="2"
          size="h2"
          weight="bold"
          class="mapamundi__title"
          v-bind="edit('title')"
        >
          {{ data.title }}
        </AtomHeading>

        <!-- Filete corto bajo el título, igual que en `events` y `ecosystem`. -->
        <span v-if="data.title" class="mapamundi__rule" aria-hidden="true"></span>

        <AtomText v-if="data.subtitle" size="body-lg" class="mapamundi__subtitle" v-bind="edit('subtitle')">
          {{ data.subtitle }}
        </AtomText>
      </header>

      <!--
        El escenario reparte todo en una sola rejilla: el globo al centro y una
        tarjeta a cada lado. El globo va PRIMERO en el marcado porque en tableta
        y teléfono queda arriba y las tarjetas debajo; así el orden de lectura
        coincide con lo que se ve en los tres tamaños.
      -->
      <div class="mapamundi__stage">
        <!--
          alt vacío: el globo y sus marcadores son ambientación. Lo que un lector
          de pantalla necesita saber —qué programas hay— está en las tarjetas.
          Ancho y alto son los del archivo, para reservar el hueco antes de que
          cargue y que las tarjetas no salten.
        -->
        <img
          class="mapamundi__map"
          :src="globeUrl"
          alt=""
          width="1000"
          height="799"
          loading="lazy"
          decoding="async"
        />

        <article
          v-for="card in cards"
          :key="card.side"
          class="mapamundi-card"
          :class="`mapamundi-card--${card.side}`"
          v-bind="edit(card.key)"
        >
          <!--
            La cabecera es el titular de la tarjeta aunque solo muestre el logo:
            el texto alternativo es el nombre de la escuela, así que el <h3>
            sigue teniendo contenido legible para buscadores y lectores de
            pantalla.
          -->
          <AtomHeading :level="3" size="body" weight="bold" class="mapamundi-card__head">
            <img
              class="mapamundi-card__logo"
              :src="card.logo.src"
              :alt="card.logo.alt"
              :width="card.logo.width"
              :height="card.logo.height"
            />
          </AtomHeading>

          <!--
            El cuerpo blanco monta sobre la cabecera con las esquinas de arriba
            redondeadas, como un ticket: por eso es un contenedor aparte y no
            la propia tarjeta.
          -->
          <div class="mapamundi-card__body">
            <!-- <p>: es texto de contenido (ver textos-de-contenido-en-p). -->
            <AtomBadge v-if="card.tag" as="p" variant="brand-solid" class="mapamundi-card__tag" v-bind="edit('.tag')">
              {{ card.tag }}
            </AtomBadge>

            <ul v-if="card.items.length" class="mapamundi-card__list">
              <li v-for="item in card.items" :key="item.id" class="mapamundi-card__item" v-bind="edit(`.items.${item.index}`)">
                <AtomPictogram :name="item.icon" :size="32" v-bind="edit('.icon')" />
                <AtomText size="body-compact" class="mapamundi-card__text" v-bind="edit('.text')">
                  {{ item.text }}
                </AtomText>
              </li>
            </ul>

            <!-- Código de barras del "ticket": adorno puro, lo dibuja la hoja. -->
            <span class="mapamundi-card__barcode" aria-hidden="true"></span>
          </div>
        </article>
      </div>
    </div>

    <!--
      Franja roja a sangre con el botón. Va fuera de `inner` para poder llegar a
      los bordes de la ventana; su borde superior curvo lo dibuja la hoja, y las
      tarjetas, que se pintan encima, se montan un poco sobre ella. La franja se
      dibuja siempre; sin texto de botón solo queda el color.

      Botón `light`: blanco con texto rojo, como en la maqueta.
    -->
    <div class="mapamundi__base">
      <!-- Brújula de adorno (alt vacío): la dibuja y recorta la hoja del bloque. -->
      <span class="mapamundi__compass" aria-hidden="true">
        <img
          class="mapamundi__compass-img"
          :src="compassUrl"
          alt=""
          width="494"
          height="203"
          loading="lazy"
          decoding="async"
        />
      </span>

      <AtomButton
        v-if="button.label"
        variant="light"
        class="mapamundi__action"
        v-bind="edit('button.label')"
        :href="button.url || '#'"
        :target="button.target"
      >
        {{ button.label }}
        <AtomIcon name="arrow-right" :size="16" />
      </AtomButton>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Mapamundi — presencia internacional.
 *
 * Encabezado centrado (etiqueta, título, filete y subtítulo), el globo al
 * centro y dos tarjetas con forma de ticket que lo flanquean —cada una con la
 * cabecera de su escuela, una etiqueta (Pregrado / Postgrado) y una lista de
 * beneficios con pictograma—, sobre una franja roja que lleva el botón. El
 * contenido se escribe desde el editor; no consulta ninguna API.
 *
 * El globo y los dos logos son fijos: son archivos de la librería y no campos
 * del editor. Lo editable de cada tarjeta es su etiqueta y su lista. Los
 * pictogramas de cada ítem los elige el usuario entre los del catálogo
 * compartido (helpers/pictograms.ts), que cualquier otro bloque puede reutilizar.
 *
 * Las tarjetas son exactamente dos, izquierda y derecha, y no una lista: el
 * diseño depende de que cada una flanquee el globo, y cada lado pertenece a
 * una escuela concreta (con su propio color de cabecera). Por eso se guardan
 * como `left` y `right`.
 */
import { computed } from 'vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomBadge from '../../../atoms/AtomBadge.vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import AtomPictogram from '../../../atoms/AtomPictogram.vue';
import globeUrl from '../../../../assets/images/mapamundi-globe.webp';
import compassUrl from '../../../../assets/images/mapamundi-compass.png';
import logoUniversityUrl from '../../../../assets/images/logos/logo-esan-university-light.svg';
import logoBusinessUrl from '../../../../assets/images/logos/logo-esan-business-light.svg';
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';
import { useEditTarget } from '../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

const props = defineProps<{ data: any }>();

/*
 * Logo de cada lado, según la maqueta: University a la izquierda y la Graduate
 * School of Business a la derecha. Son las versiones en blanco, porque van
 * sobre la cabecera de color. Ancho y alto son los de cada archivo, para
 * reservar el hueco antes de que carguen.
 */
const LOGOS = {
  start: { src: logoUniversityUrl, alt: 'ESAN University', width: 142, height: 40 },
  end: { src: logoBusinessUrl, alt: 'ESAN Graduate School of Business', width: 154, height: 40 },
};

/*
 * Un ítem sin texto no se dibuja: un pictograma suelto, sin nada al lado, deja
 * una fila que no dice nada. Así un ítem recién agregado en el editor aparece
 * en cuanto se le escribe algo.
 */
const toItems = (raw: unknown) =>
  (Array.isArray(raw) ? raw : [])
    .map((item: any, i: number) => ({
      id: item?.id || `mapamundi-item-${i}`,
      // Posición en el dato, antes de filtrar: es la que usa el editor.
      index: i,
      icon: item?.icon ?? '',
      text: item?.text ?? '',
    }))
    .filter((item) => item.text.trim());

const toCard = (raw: any, side: 'start' | 'end', key: 'left' | 'right') => ({
  side,
  key,
  logo: LOGOS[side],
  tag: (raw?.tag ?? '').trim(),
  items: toItems(raw?.items),
});

const cards = computed(() => [
  toCard(props.data?.left, 'start', 'left'),
  toCard(props.data?.right, 'end', 'right'),
]);

const button = computed(() => ({
  label: props.data?.button?.label ?? '',
  url: props.data?.button?.url ?? '',
  target: normalizeLinkTarget(props.data?.button?.target),
}));
</script>

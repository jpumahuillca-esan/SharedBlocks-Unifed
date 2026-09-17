<template>
  <section class="mapamundi">
    <div class="mapamundi__inner">
      <header v-if="data.eyebrow || data.title" class="mapamundi__header">
        <!--
          Como <p>, igual que la etiqueta de los CTA (ctaband__eyebrow): es un
          texto de contenido, no una marca suelta dentro de otra frase.

          La clase propia es solo para quitarle el punto que el átomo pone
          delante en el resto de la librería: aquí va el filete de abajo.
        -->
        <AtomEyebrow v-if="data.eyebrow" as="p" class="mapamundi__eyebrow">
          {{ data.eyebrow }}
        </AtomEyebrow>

        <!-- Filete corto bajo la etiqueta, igual que en `events` y `ecosystem`. -->
        <span v-if="data.eyebrow" class="mapamundi__rule" aria-hidden="true"></span>

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
        >
          {{ data.title }}
        </AtomHeading>
      </header>

      <!--
        El escenario reparte todo en una sola rejilla: el mapa detrás, una
        tarjeta a cada lado montada sobre sus bordes y el botón bajo el mapa. El
        mapa va PRIMERO en el marcado porque en tableta y teléfono queda arriba y
        las tarjetas debajo; así el orden de lectura coincide con lo que se ve en
        los tres tamaños.
      -->
      <div class="mapamundi__stage">
        <!--
          alt vacío: el mapa y sus marcadores son ambientación. Lo que un lector
          de pantalla necesita saber —qué programas hay— está en las tarjetas.
          Ancho y alto son los del archivo, para reservar el hueco antes de que
          cargue y que las tarjetas no salten.
        -->
        <img
          class="mapamundi__map"
          :src="mapamundiUrl"
          alt=""
          width="771"
          height="335"
          loading="lazy"
          decoding="async"
        />

        <article
          v-for="card in cards"
          :key="card.side"
          class="mapamundi-card"
          :class="`mapamundi-card--${card.side}`"
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

          <ul v-if="card.items.length" class="mapamundi-card__list">
            <li v-for="item in card.items" :key="item.id" class="mapamundi-card__item">
              <AtomPictogram :name="item.icon" :size="32" />
              <AtomText size="sm" class="mapamundi-card__text">
                {{ item.text }}
              </AtomText>
            </li>
          </ul>
        </article>

        <!--
          Dentro del escenario y no debajo: en el diseño ocupa la columna del
          mapa, alineado al pie de las tarjetas. Va último en el marcado para
          que en teléfono quede después de ellas.
        -->
        <AtomButton
          v-if="button.label"
          variant="primary"
          class="mapamundi__action"
          :href="button.url || '#'"
        >
          {{ button.label }}
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Mapamundi — presencia internacional.
 *
 * Encabezado centrado, el mapa del mundo al centro con un botón debajo, y dos
 * tarjetas que lo flanquean, cada una con la cabecera de su escuela y una lista
 * de beneficios con pictograma. El contenido se escribe desde el editor; no
 * consulta ninguna API.
 *
 * El mapa y los dos logos son fijos: son archivos de la librería y no campos
 * del editor. Lo único editable de cada tarjeta es su lista. Los pictogramas de
 * cada ítem los elige el usuario entre los del catálogo compartido
 * (helpers/pictograms.ts), que cualquier otro bloque puede reutilizar.
 *
 * Las tarjetas son exactamente dos, izquierda y derecha, y no una lista: el
 * diseño depende de que cada una se monte sobre un borde del mapa, y cada lado
 * pertenece a una escuela concreta. Por eso se guardan como `left` y `right`.
 */
import { computed } from 'vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import AtomPictogram from '../../../atoms/AtomPictogram.vue';
import mapamundiUrl from '../../../../assets/images/mapamundi.svg';
import logoUniversityUrl from '../../../../assets/images/logos/logo-esan-university-light.svg';
import logoBusinessUrl from '../../../../assets/images/logos/logo-esan-business-light.svg';

const props = defineProps<{ data: any }>();

/*
 * Logo de cada lado, según la maqueta: University a la izquierda y la Graduate
 * School of Business a la derecha. Son las versiones en blanco, porque van
 * sobre la cabecera roja. Ancho y alto son los de cada archivo, para reservar
 * el hueco antes de que carguen.
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
      icon: item?.icon ?? '',
      text: item?.text ?? '',
    }))
    .filter((item) => item.text.trim());

const toCard = (raw: any, side: 'start' | 'end') => ({
  side,
  logo: LOGOS[side],
  items: toItems(raw?.items),
});

const cards = computed(() => [
  toCard(props.data?.left, 'start'),
  toCard(props.data?.right, 'end'),
]);

const button = computed(() => ({
  label: props.data?.button?.label ?? '',
  url: props.data?.button?.url ?? '',
}));
</script>

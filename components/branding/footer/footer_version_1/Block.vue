<template>
  <!--
    `arcis-scope` va en la raíz del propio pie, no en quien lo usa: el lienzo de
    branding del admin y el layout de public-site lo pintan fuera de cualquier
    `.arcis-scope`, y sin él no aplicaría ninguna regla del sistema. Al ser el
    contenedor de consulta (ver base.scss), la vista de tableta y móvil del
    lienzo también cambia la composición, aunque la ventana sea ancha.

    La raíz es un <div> y no un <footer>: public-site ya lo envuelve en uno, y
    un <footer> no puede ir dentro de otro.
  -->
  <div ref="root" class="arcis-scope">
    <div class="footer-v1">
      <div class="footer-v1__inner">
        <div v-if="contacts.length" class="footer-v1__contacts">
          <div v-for="contact in contacts" :key="contact.id" class="footer-v1__contact">
            <AtomText v-if="contact.title" size="sm" class="footer-v1__contact-title">
              {{ contact.title }}
            </AtomText>

            <!-- Los saltos de línea del editor se respetan desde la hoja (pre-line). -->
            <AtomText v-if="contact.text" size="sm" class="footer-v1__contact-value">
              <component
                :is="linkTag"
                v-if="contact.url"
                v-bind="getLinkProps(contact.url)"
              >{{ contact.text }}</component>
              <template v-else>{{ contact.text }}</template>
            </AtomText>
          </div>
        </div>

        <!--
          Columnas, redes y libro de reclamaciones comparten una sola rejilla: en
          escritorio las redes van bajo la primera columna y el libro bajo la
          última, sin esperar a que termine la más larga (ver _footer-v1.scss).
          En tableta y móvil la misma rejilla pasa a una pila, sin duplicar
          marcado.
        -->
        <div
          class="footer-v1__main"
          :class="{ 'is-single': columns.length === 1 }"
          :style="{ '--footer-v1-columns': String(columns.length || 1) }"
        >
          <div
            v-for="(column, i) in columns"
            :key="column.id"
            class="footer-v1__column"
            :class="{
              'is-open': isOpen(column.id),
              'is-first': i === 0,
              'is-last': i === columns.length - 1,
            }"
          >
            <!--
              En escritorio es un rótulo (<p>): las columnas se ven siempre
              abiertas y no hay nada que pulsar. En acordeón pasa a ser el
              control que la abre, y entonces es un <a> —nunca <button>, por la
              decisión de proyecto que documenta AtomButton— con lo que un
              <button> daría de fábrica: rol, foco, estado y teclado.
            -->
            <component
              :is="accordion ? 'a' : 'p'"
              class="footer-v1__column-title"
              :role="accordion ? 'button' : undefined"
              :tabindex="accordion ? 0 : undefined"
              :aria-expanded="accordion ? String(isOpen(column.id)) : undefined"
              @click="accordion && toggle(column.id)"
              @keydown="accordion && activate($event, column.id)"
            >
              {{ column.title }}
              <AtomIcon name="chevron-down" :size="16" />
            </component>

            <div class="footer-v1__panel">
              <div class="footer-v1__panel-inner">
                <nav class="footer-v1__links" :aria-label="column.title || undefined">
                  <component
                    :is="linkTag"
                    v-for="link in column.links"
                    :key="link.id"
                    v-bind="getLinkProps(link.url)"
                    class="footer-v1__link"
                  >
                    <AtomIcon name="arrow-right" :size="14" />
                    {{ link.label }}
                  </component>
                </nav>
              </div>
            </div>
          </div>

          <div v-if="socials.length" class="footer-v1__social">
            <!-- Glifos de marca del sistema, en su forma plana (la del footer del kit). -->
            <AtomSocialIcon
              v-for="social in socials"
              :key="social.id"
              flat
              :network="social.network"
              :href="social.url || '#'"
              :target="social.url ? '_blank' : undefined"
              :rel="social.url ? 'noopener noreferrer' : undefined"
            />
          </div>

          <div v-if="claims.image" class="footer-v1__claims">
            <component
              :is="linkTag"
              v-if="claims.url"
              v-bind="getLinkProps(claims.url)"
              class="footer-v1__claims-link"
            >
              <img class="footer-v1__claims-image" :src="claims.image" :alt="claims.imageAlt" loading="lazy" decoding="async" />
            </component>
            <img v-else class="footer-v1__claims-image" :src="claims.image" :alt="claims.imageAlt" loading="lazy" decoding="async" />
          </div>
        </div>

        <div v-if="copyright" class="footer-v1__bottom">
          <AtomText size="sm" class="footer-v1__copyright">{{ copyright }}</AtomText>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Pie de página institucional, versión 1.
 *
 * Datos de contacto arriba, columnas de enlaces, redes sociales, el libro de
 * reclamaciones y el copyright. Todo se escribe desde el editor de branding;
 * los enlaces no salen del menú del sitio.
 *
 * Tres composiciones:
 *   escritorio  contactos en fila, filete rojo y columnas de enlaces abiertas
 *   tableta     contactos en fila; las columnas pasan a acordeón y las redes
 *               suben sobre ellas
 *   teléfono    igual que tableta, con los contactos apilados
 *
 * Parte del footer del kit (webunificada, `.footer`), con lo que cambia en la
 * maqueta: el fondo, las redes bajo la primera columna, el libro de
 * reclamaciones como imagen y los contactos, que en móvil NO invierten el
 * énfasis. Sin botón de volver arriba.
 */
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import AtomSocialIcon from '../../../atoms/AtomSocialIcon.vue';
import { useDynamicLink } from '../../../../composables/useDynamicLink';

type SocialNetwork = 'facebook' | 'x' | 'youtube' | 'instagram' | 'linkedin';

/** Las que AtomSocialIcon sabe dibujar. Otra, guardada a mano, se descarta. */
const NETWORKS: SocialNetwork[] = ['facebook', 'x', 'youtube', 'instagram', 'linkedin'];

/**
 * Ancho del pie a partir del cual las columnas son acordeón. Es el mismo punto
 * de quiebre que usa la hoja ('mobile' en breakpoints.scss): si cambia uno,
 * tiene que cambiar el otro.
 */
const ACCORDION_MAX = 768;

interface FooterContact { id: string; title: string; text: string; url: string }
interface FooterLink { id: string; label: string; url: string }
interface FooterColumn { id: string; title: string; links: FooterLink[] }
interface FooterSocial { id: string; network: SocialNetwork; url: string }

const props = defineProps<{
  config: any;
  /*
   * Los pasan el lienzo del admin y public-site a todo pie de branding. Este no
   * usa `menu` —sus enlaces se escriben en el editor— ni `viewMode`, porque la
   * vista de dispositivo ya la resuelve el ancho del contenedor.
   */
  menu?: any[];
  viewMode?: string;
  /** NuxtLink en public-site; sin él, un <a> normal. */
  linkComponent?: any;
}>();

const { linkTag, getLinkProps } = useDynamicLink(props.linkComponent);

const text = (value: unknown) => (typeof value === 'string' ? value : '');
const list = (value: unknown): any[] => (Array.isArray(value) ? value : []);

const contacts = computed<FooterContact[]>(() =>
  list(props.config?.contacts).map((contact: any, i: number) => ({
    id: contact?.id || `contact-${i}`,
    title: text(contact?.title),
    text: text(contact?.text),
    url: text(contact?.url).trim(),
  }))
);

const columns = computed<FooterColumn[]>(() =>
  list(props.config?.columns).map((column: any, i: number) => ({
    id: column?.id || `column-${i}`,
    title: text(column?.title),
    links: list(column?.links).map((link: any, j: number) => ({
      id: link?.id || `link-${i}-${j}`,
      label: text(link?.label),
      url: text(link?.url).trim(),
    })),
  }))
);

const socials = computed<FooterSocial[]>(() =>
  list(props.config?.socials)
    .filter((social: any) => NETWORKS.includes(social?.network))
    .map((social: any, i: number) => ({
      id: social?.id || `social-${i}`,
      network: social.network as SocialNetwork,
      url: text(social?.url).trim(),
    }))
);

const claims = computed(() => ({
  // Una ruta con solo espacios cuenta como vacía: si no, saldría una imagen rota.
  image: text(props.config?.claimsImage).trim(),
  imageAlt: text(props.config?.claimsImageAlt),
  url: text(props.config?.claimsUrl).trim(),
}));

const copyright = computed(() => text(props.config?.copyright));

/* -------------------------------------------------------------------------
   Acordeón
   ------------------------------------------------------------------------- */

/*
 * Columnas abiertas, por id y no por posición: reordenar desde el editor no
 * cambia cuál está abierta. Cada una se abre y cierra por su cuenta, como en el
 * kit. De entrada, la primera abierta, como en la maqueta.
 */
const openIds = ref<string[]>([]);
let seeded = false;

watch(
  () => columns.value.map((column) => column.id),
  (ids) => {
    if (!seeded && ids.length) {
      openIds.value = [ids[0]];
      seeded = true;
    }
    // Una columna quitada desde el editor no se queda en la lista.
    openIds.value = openIds.value.filter((id) => ids.includes(id));
  },
  { immediate: true }
);

const isOpen = (id: string) => openIds.value.includes(id);

const toggle = (id: string) => {
  openIds.value = isOpen(id)
    ? openIds.value.filter((openId) => openId !== id)
    : [...openIds.value, id];
};

/** Un <button> se activa con Enter y Espacio; un <a> sin href, con ninguna. */
const activate = (event: KeyboardEvent, id: string) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;

  // Espacio, sin esto, desplaza la página.
  event.preventDefault();
  toggle(id);
};

/*
 * ¿Se ve como acordeón? Lo decide la hoja por ancho; aquí solo se replica para
 * poner rol, foco y estado al título cuando de verdad es un control. Se mide el
 * propio pie y no la ventana, por la misma razón que las reglas de la hoja: el
 * lienzo del admin lo estrecha sin cambiar la ventana.
 *
 * Arranca en falso: en el servidor no hay nada que medir, y así lo primero que
 * se pinta coincide en los dos lados.
 */
const root = ref<HTMLElement | null>(null);
const accordion = ref(false);

const measure = () => {
  if (root.value) accordion.value = root.value.clientWidth <= ACCORDION_MAX;
};

let observer: ResizeObserver | null = null;

onMounted(() => {
  measure();

  if (typeof ResizeObserver !== 'undefined' && root.value) {
    observer = new ResizeObserver(measure);
    observer.observe(root.value);
  }
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <!--
    `arcis-scope` en la raíz, como en el pie de branding: quien lo pinta (el
    lienzo del admin, el layout de public-site) no lo envuelve en ninguno. Al ser
    además el contenedor de consulta, la vista de tableta del lienzo también
    cambia la composición aunque la ventana sea ancha.

    `placement` decide en qué anchos se muestra esta copia (ver la cabecera del
    script y _topbar-v1.scss).
  -->
  <div class="arcis-scope topbar-v1-host" :class="placement ? `is-${placement}` : null">
    <nav class="topbar-v1" aria-label="Accesos rápidos">
      <!-- Junto al portal: el acceso principal y sus desplegables. -->
      <div class="topbar-v1__group topbar-v1__group--start">
        <component
          :is="linkTag"
          v-if="brandLabel"
          v-bind="getLinkProps(brandUrl)"
          class="topbar-v1__link topbar-v1__link--brand"
        >
          <!--
            Ícono de la maqueta (Foundations.svg), relleno y no de trazo: Lucide
            no tiene esta versión. Va en línea con currentColor para seguir el
            color del enlace, también al pasar el ratón.
          -->
          <svg class="topbar-v1__brand-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 0.666992C12.0501 0.666992 15.333 3.94991 15.333 8C15.333 12.0501 12.0501 15.333 8 15.333C3.94991 15.333 0.666992 12.0501 0.666992 8C0.666992 3.94991 3.94991 0.666992 8 0.666992ZM6 12C5.82319 12 5.65334 12.0703 5.52832 12.1953C5.4034 12.3203 5.33301 12.4903 5.33301 12.667V13.374C6.13661 13.7736 7.04164 14 8 14C8.95836 14 9.86339 13.7736 10.667 13.374V12.667C10.667 12.4903 10.5966 12.3203 10.4717 12.1953C10.3467 12.0703 10.1768 12 10 12H6ZM8 2C4.68629 2 2 4.68629 2 8C2 9.78087 2.77664 11.3797 4.00879 12.4785C4.05239 12.0172 4.25557 11.5834 4.58594 11.2529C4.96101 10.8779 5.46957 10.667 6 10.667H10C10.5304 10.667 11.039 10.8779 11.4141 11.2529C11.7444 11.5834 11.9466 12.0173 11.9902 12.4785C13.2227 11.3796 14 9.78113 14 8C14 4.68629 11.3137 2 8 2ZM8 4C9.47276 4 10.667 5.19423 10.667 6.66699C10.6668 8.1396 9.47265 9.33301 8 9.33301C6.52735 9.33301 5.33318 8.1396 5.33301 6.66699C5.33301 5.19423 6.52724 4 8 4ZM8 5.33301C7.26362 5.33301 6.66699 5.93061 6.66699 6.66699C6.66717 7.40322 7.26373 8 8 8C8.73627 8 9.33283 7.40322 9.33301 6.66699C9.33301 5.93061 8.73638 5.33301 8 5.33301Z"
            />
          </svg>
          {{ brandLabel }}
        </component>

        <template v-for="item in startItems" :key="item.id">
          <MoleculeDropdown
            v-if="item.children.length"
            plain
            class="topbar-v1__item"
            :label="item.label"
            :items="toDropdownItems(item)"
            :link-component="linkComponent"
          />
          <component
            :is="linkTag"
            v-else
            v-bind="getLinkProps(item.url)"
            class="topbar-v1__link topbar-v1__item"
          >{{ item.label }}</component>
        </template>
      </div>

      <!-- Al otro lado: los enlaces institucionales. Solo en escritorio. -->
      <div v-if="endItems.length" class="topbar-v1__group topbar-v1__group--end">
        <template v-for="(item, i) in endItems" :key="item.id">
          <!-- El último desplegable abre hacia la izquierda: pegado al borde, se saldría. -->
          <MoleculeDropdown
            v-if="item.children.length"
            plain
            class="topbar-v1__item"
            :label="item.label"
            :items="toDropdownItems(item)"
            :align="i === endItems.length - 1 ? 'right' : 'left'"
            :link-component="linkComponent"
          />
          <component
            :is="linkTag"
            v-else
            v-bind="getLinkProps(item.url)"
            class="topbar-v1__link topbar-v1__item"
          >{{ item.label }}</component>
        </template>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
/**
 * Topbar institucional, versión 1.
 *
 * Franja sobre el navbar: a la izquierda el acceso al portal y, a su lado, sus
 * desplegables (Admisión); a la derecha, los enlaces institucionales. Parte del
 * topbar del kit (webunificada, `.topbar`), con los ajustes de la maqueta.
 *
 * Tres composiciones:
 *   escritorio  sobre el navbar, con los dos grupos y sus divisores
 *   tableta     (992px o menos) bajo el navbar, solo el grupo del portal
 *   teléfono    igual que tableta
 *
 * Cambiar de sitio respecto al navbar no se puede hacer desde dentro del
 * componente: está fuera de él. Por eso quien lo pinta decide con `placement`:
 *   'above'  copia de encima del navbar: se ve solo en escritorio
 *   'below'  copia de debajo del navbar: se ve solo en tableta y móvil
 *   sin él   se ve siempre (el lienzo del admin, que ya lo coloca midiendo)
 * public-site pinta las dos copias y la hoja muestra la que toca. Se duplica
 * el marcado en vez de moverlo con JavaScript porque el cambio lo decide una
 * consulta de medios, y así no hay salto al hidratar: mismo criterio que el
 * enlace del pie en las secciones de tarjetas (CardSectionFooter).
 */
import { computed } from 'vue';
import MoleculeDropdown, { type DropdownItem } from '../../../molecules/MoleculeDropdown.vue';
import { useDynamicLink } from '../../../../composables/useDynamicLink';

interface TopbarLink { id: string; label: string; url: string }
interface TopbarItem extends TopbarLink { children: TopbarLink[] }

const props = defineProps<{
  config: any;
  placement?: 'above' | 'below';
  /** NuxtLink en public-site; sin él, un <a> normal. */
  linkComponent?: any;
  /*
   * Los pasa el lienzo del admin a toda pieza de branding. Este no los usa:
   * sus enlaces se escriben en el editor y la vista de dispositivo la resuelve
   * el ancho del contenedor.
   */
  menu?: any[];
  viewMode?: string;
}>();

const { linkTag, getLinkProps } = useDynamicLink(props.linkComponent);

const text = (value: unknown) => (typeof value === 'string' ? value : '');
const list = (value: unknown): any[] => (Array.isArray(value) ? value : []);

const toLink = (link: any, fallbackId: string): TopbarLink => ({
  id: link?.id || fallbackId,
  label: text(link?.label),
  url: text(link?.url).trim(),
});

/* Un ítem sin texto no se dibuja: quedaría un divisor suelto. */
const toItems = (raw: unknown, prefix: string): TopbarItem[] =>
  list(raw)
    .map((item: any, i: number) => ({
      ...toLink(item, `${prefix}-${i}`),
      children: list(item?.children)
        .map((child: any, j: number) => toLink(child, `${prefix}-${i}-${j}`))
        .filter((child) => child.label.trim()),
    }))
    .filter((item) => item.label.trim());

const brandLabel = computed(() => text(props.config?.brandLabel));
const brandUrl = computed(() => text(props.config?.brandUrl).trim());
const startItems = computed(() => toItems(props.config?.startItems, 'start'));
const endItems = computed(() => toItems(props.config?.endItems, 'end'));

/* Opciones del desplegable como enlaces: con `href`, MoleculeDropdown navega. */
const toDropdownItems = (item: TopbarItem): DropdownItem[] =>
  item.children.map((child) => ({ label: child.label, href: child.url || '#' }));
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';
import CodeBlock from './CodeBlock.vue';
import EditorText from '../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../editor-beta/EditorUrl/EditorUrl.vue';
import EditorBrandColor from '../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import EditorImage from '../editor-beta/EditorImage/EditorImage.vue';
import demoImageUrl from './editor-demo-image.svg';
import {
  DEFAULT_BRAND_COLOR_TOKEN,
  resolveBrandContentToken,
} from '../editor-beta/EditorBrandColor/brandColors';

type EditorCodeKey = 'text' | 'link' | 'color' | 'image';

const createDemoData = () => ({
  title: 'Expande tus habilidades con Extended Learning',
  desc: 'Aprende con programas prácticos, diseñados para impulsar tu camino y adaptarse a tus objetivos.',
  buttonLabel: 'Inscríbete ahora',
  buttonUrl: '/programas/extended-learning',
  buttonTarget: '',
  panelColorToken: DEFAULT_BRAND_COLOR_TOKEN,
  image: demoImageUrl,
  imageAlt: 'Personas aprendiendo en un aula',
  imageFocusX: 50,
  imageFocusY: 50,
});

const demoData = ref(createDemoData());
const demoMessage = ref('');
const imageInput = ref<HTMLInputElement | null>(null);
const demoRoot = ref<HTMLElement | null>(null);
const codeSection = ref<HTMLElement | null>(null);
const demoCodeRequest = ref<{ key: EditorCodeKey; line: number } | null>(null);
let localImageUrl: string | null = null;

const editorCodeTabs: Array<{
  key: EditorCodeKey;
  label: string;
  description: string;
  defaultLine: number;
}> = [
  { key: 'text', label: 'Texto', description: 'Ajusta label, hint, placeholder y maxlength. EditorTextarea añade rows; counter=false oculta el contador sin quitar el límite.', defaultLine: 6 },
  { key: 'link', label: 'Enlace', description: 'EditorUrl combina la dirección con el switch de enlace interno o página externa al enlazar v-model:target.', defaultLine: 6 },
  { key: 'color', label: 'Color', description: 'EditorBrandColor guarda el token seleccionado; Block.vue resuelve ese token como fondo y elige el color de texto con contraste.', defaultLine: 4 },
  { key: 'image', label: 'Imagen', description: 'Vincula alt y foco de forma opcional; focus-ratio muestra el recorte real y @select conecta con el selector de medios.', defaultLine: 4 },
];

const editorCodeExamples: Record<EditorCodeKey, string> = {
  text: `<!-- Editor.vue -->
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue'
import EditorText from '../../../editor-beta/EditorText/EditorText.vue'

<EditorTextarea
  v-model="localData.title"
  data-edit-target="title"
  label="Título"
  :rows="2"
  :maxlength="90"
/>

<EditorTextarea
  v-model="localData.desc"
  data-edit-target="desc"
  label="Descripción"
  :rows="3"
/>

<EditorText
  v-model="localData.buttonLabel"
  label="Texto del botón"
  :maxlength="40"
  :counter="false"
/>`,
  link: `<!-- Editor.vue -->
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue'

<EditorUrl
  v-model="localData.buttonUrl"
  v-model:target="localData.buttonTarget"
  data-edit-target="buttonUrl"
  label="Destino del botón"
  placeholder="/ruta o https://"
/>`,
  color: `<!-- Editor.vue -->
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue'

<EditorBrandColor
  v-model="localData.panelColorToken"
  label="Color del panel"
/>

// Block.vue
import { computed } from 'vue'
import { resolveBrandContentToken } from '../../../editor-beta/EditorBrandColor/brandColors'

// El bloque aplica el token guardado y decide el color de texto con contraste.
const panelColorStyle = computed(() => ({
  '--cta-banner-panel-color': \`var(\${banner.value.panelColorToken})\`,
  '--cta-banner-content-color': \`var(\${resolveBrandContentToken(banner.value.panelColorToken)})\`,
}))`,
  image: `<!-- Editor.vue -->
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue'

<EditorImage
  v-model="localData.image"
  v-model:alt="localData.imageAlt"
  v-model:focus-x="localData.imageFocusX"
  v-model:focus-y="localData.imageFocusY"
  data-edit-target="image"
  alt-edit-target="imageAlt"
  focus-ratio="592 / 266"
  :focus-height="150"
  label=""
  @select="selectImage"
/>

const selectImage = () => {
  emit('select-image', { item: localData.value, field: 'image' });
}`,
};

const activeCodeKey = ref<EditorCodeKey>('text');
const activeCodeLine = ref(6);
const activeCodeTab = computed(() => editorCodeTabs.find((tab) => tab.key === activeCodeKey.value)!);
const activeCodeExample = computed(() => editorCodeExamples[activeCodeKey.value]);

const showCode = async (key: EditorCodeKey, line: number) => {
  activeCodeKey.value = key;
  activeCodeLine.value = line;
  demoMessage.value = '';
  demoCodeRequest.value = null;
  await nextTick();
  codeSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const selectCodeTab = (key: EditorCodeKey) => {
  const tab = editorCodeTabs.find((item) => item.key === key);
  if (tab) void showCode(key, tab.defaultLine);
};

const panelStyle = computed(() => ({
  backgroundColor: `var(${demoData.value.panelColorToken})`,
  color: `var(${resolveBrandContentToken(demoData.value.panelColorToken)})`,
}));

const focusStyle = computed(() => ({
  objectPosition: `${demoData.value.imageFocusX}% ${demoData.value.imageFocusY}%`,
}));

const focusDemoField = (field: string) => {
  const target = demoRoot.value?.querySelector<HTMLElement>(`[data-edit-target="${field}"]`);
  if (!target) return;

  target.focus();
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  demoMessage.value = `Campo “${field}” seleccionado en el panel de edición.`;
  const codeTarget: Record<string, { key: EditorCodeKey; line: number }> = {
    title: { key: 'text', line: 6 },
    desc: { key: 'text', line: 14 },
    image: { key: 'image', line: 4 },
  };
  demoCodeRequest.value = codeTarget[field] ?? null;
};

const chooseLocalImage = () => imageInput.value?.click();

const onLocalImagePicked = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  if (localImageUrl) URL.revokeObjectURL(localImageUrl);
  localImageUrl = URL.createObjectURL(file);
  demoData.value.image = localImageUrl;
  demoData.value.imageAlt = file.name;
  demoMessage.value = 'Imagen local cargada para esta demostración.';
  demoCodeRequest.value = { key: 'image', line: 4 };
};

const removeDemoImage = () => {
  if (localImageUrl) URL.revokeObjectURL(localImageUrl);
  localImageUrl = null;
  if (imageInput.value) imageInput.value.value = '';
  demoData.value.imageAlt = '';
  demoData.value.imageFocusX = 50;
  demoData.value.imageFocusY = 50;
};

const previewButtonAction = () => {
  demoCodeRequest.value = null;
  if (!demoData.value.buttonUrl.trim()) {
    demoMessage.value = 'Agrega un destino para ver cómo quedaría configurado el enlace.';
    return;
  }

  const behavior = demoData.value.buttonTarget === '_blank'
    ? 'se abriría en una pestaña nueva'
    : 'se abriría en esta misma página';
  demoMessage.value = `Acción de demostración: ${behavior}. Destino: ${demoData.value.buttonUrl}`;
};

const resetDemo = () => {
  if (localImageUrl) URL.revokeObjectURL(localImageUrl);
  localImageUrl = null;
  if (imageInput.value) imageInput.value.value = '';
  demoData.value = createDemoData();
  demoMessage.value = 'Se restauraron los valores de ejemplo.';
  demoCodeRequest.value = null;
};

const serializedDemoData = computed(() => JSON.stringify(demoData.value, null, 2));

onBeforeUnmount(() => {
  if (localImageUrl) URL.revokeObjectURL(localImageUrl);
});

const focusExample = `// Block.vue
const edit = useEditTarget();
<h2 v-bind="edit('title')">{{ data.title }}</h2>

// Editor.vue
<EditorTextarea
  v-model="localData.title"
  data-edit-target="title"
  label="Título"
/>`;
</script>

<template>
  <div class="editor-docs">
    <header class="editor-docs__header">
      <span class="editor-docs__eyebrow">Documentación para el administrador</span>
      <h1 class="editor-docs__title">Editor beta</h1>
      <p class="editor-docs__lead">
        Los componentes de <code>components/editor-beta</code> son controles atómicos reutilizables
        que cada <code>Editor.vue</code> puede usar en el panel de administración. Permiten editar el contenido
        del bloque desde campos claros y ver los cambios en el lienzo, sin modificar el JSON a mano.
      </p>
    </header>

    <section id="editor-beta-purpose" class="editor-docs__section">
      <h2>Qué es y para qué sirve</h2>
      <p>
        <strong>Editor beta no es un bloque de contenido ni una pantalla independiente.</strong>
        Es una colección compartida de controles para construir el formulario de cada bloque.
        Cada bloque conserva su propio <code>Editor.vue</code>, que importa los controles que necesita,
        decide cuáles mostrar y cómo enlazarlos con sus datos.
      </p>
      <p>
        Para quien administra una página, esto significa que puede cambiar títulos, enlaces, imágenes,
        colores y otros ajustes desde controles consistentes. Los valores editados actualizan el
        contenido del bloque y se reflejan en la vista previa del lienzo.
      </p>
      <div class="editor-docs__note">
        <strong>La diferencia entre las piezas:</strong>
        <code>Block.vue</code> pinta el bloque en la página; <code>Editor.vue</code> presenta el
        formulario en el administrador; <code>editor-beta</code> aporta los controles atómicos que ese
        formulario puede reutilizar.
      </div>
    </section>

    <section id="editor-beta-playground" class="editor-docs__section">
      <h2>Pruébalo en vivo</h2>
      <p>
        Cambia los campos de este panel de prueba y mira el bloque actualizarse al instante.
        Son los mismos controles de <code>editor-beta</code> que se usan en los editores de bloques.
      </p>

      <div ref="demoRoot" class="editor-demo arcis-scope">
        <div class="editor-demo__topbar">
          <div>
            <span class="editor-demo__status-dot"></span>
            <strong>Administrador</strong>
            <span class="editor-demo__breadcrumb">/ Editor beta / Bloque de ejemplo</span>
          </div>
          <button type="button" class="editor-demo__reset" @click="resetDemo">
            <i class="las la-redo-alt" aria-hidden="true"></i>
            Reiniciar demo
          </button>
        </div>

        <div class="editor-demo__workspace">
          <div class="editor-demo__panel">
            <div class="editor-demo__panel-heading">
              <div>
                <span class="editor-demo__panel-kicker">Panel de edición</span>
                <h3>CTA Banner</h3>
              </div>
              <span class="editor-demo__beta-badge">BETA</span>
            </div>

            <div class="editor-demo__field">
              <button class="editor-demo__code-link" type="button" @click="showCode('text', 6)">
                <i class="las la-code" aria-hidden="true"></i> Ver código
              </button>
              <EditorTextarea
                v-model="demoData.title"
                data-edit-target="title"
                class="mb-3"
                label="Título"
                :rows="2"
                :maxlength="90"
                placeholder="Escribe un título"
              />
            </div>

            <div class="editor-demo__field">
              <button class="editor-demo__code-link" type="button" @click="showCode('text', 14)">
                <i class="las la-code" aria-hidden="true"></i> Ver código
              </button>
              <EditorTextarea
                v-model="demoData.desc"
                data-edit-target="desc"
                class="mb-3"
                label="Descripción"
                :rows="3"
                :maxlength="180"
                placeholder="Escribe una descripción"
              />
            </div>

            <div class="editor-demo__field">
              <button class="editor-demo__code-link" type="button" @click="showCode('text', 21)">
                <i class="las la-code" aria-hidden="true"></i> Ver código
              </button>
              <EditorText
                v-model="demoData.buttonLabel"
                data-edit-target="buttonLabel"
                class="mb-2"
                label="Texto del botón"
                :maxlength="40"
                placeholder="Inscríbete ahora"
              />
            </div>

            <div class="editor-demo__field">
              <button class="editor-demo__code-link" type="button" @click="showCode('link', 6)">
                <i class="las la-code" aria-hidden="true"></i> Ver código
              </button>
              <EditorUrl
                v-model="demoData.buttonUrl"
                v-model:target="demoData.buttonTarget"
                data-edit-target="buttonUrl"
                class="mb-3"
                label="Destino del botón"
                placeholder="/ruta o https://"
              />
            </div>

            <div class="editor-demo__field">
              <button class="editor-demo__code-link" type="button" @click="showCode('color', 4)">
                <i class="las la-code" aria-hidden="true"></i> Ver código
              </button>
              <EditorBrandColor
                v-model="demoData.panelColorToken"
                class="mb-3"
                label="Color del panel"
              />
            </div>

            <input
              ref="imageInput"
              class="editor-demo__file-input"
              type="file"
              accept="image/*"
              aria-label="Elegir imagen para la demostración"
              @change="onLocalImagePicked"
            />
            <div class="editor-demo__field">
              <button class="editor-demo__code-link" type="button" @click="showCode('image', 4)">
                <i class="las la-code" aria-hidden="true"></i> Ver código
              </button>
              <EditorImage
                v-model="demoData.image"
                v-model:alt="demoData.imageAlt"
                v-model:focus-x="demoData.imageFocusX"
                v-model:focus-y="demoData.imageFocusY"
                data-edit-target="image"
                class="mb-2"
                label="Imagen"
                alt-label="Texto alternativo"
                alt-placeholder="Describe la imagen"
                alt-hint="Describe la imagen si aporta información."
                focus-ratio="16 / 10"
                :focus-height="150"
                @select="chooseLocalImage"
                @remove="removeDemoImage"
              />
            </div>

            <p class="editor-demo__local-note">
              La imagen elegida se usa solo en esta demo; no se sube ni se guarda.
            </p>
          </div>

          <div class="editor-demo__preview-area">
            <div class="editor-demo__preview-heading">
              <div>
                <span class="editor-demo__panel-kicker">Vista del bloque</span>
                <h3>Así lo verías en la página</h3>
              </div>
              <span class="editor-demo__live-badge"><span></span> En vivo</span>
            </div>

            <article class="editor-demo__block">
              <div class="editor-demo__copy" :style="panelStyle">
                <div>
                  <h4
                    class="editor-demo__canvas-editable"
                    role="button"
                    tabindex="0"
                    aria-label="Enfocar el campo del título"
                    @click="focusDemoField('title')"
                    @keydown.enter.prevent="focusDemoField('title')"
                    @keydown.space.prevent="focusDemoField('title')"
                  >
                    {{ demoData.title || 'Tu título aparecerá aquí' }}
                  </h4>
                  <p
                    class="editor-demo__canvas-editable"
                    role="button"
                    tabindex="0"
                    aria-label="Enfocar el campo de la descripción"
                    @click="focusDemoField('desc')"
                    @keydown.enter.prevent="focusDemoField('desc')"
                    @keydown.space.prevent="focusDemoField('desc')"
                  >
                    {{ demoData.desc || 'La descripción aparecerá aquí.' }}
                  </p>
                </div>
                <button type="button" class="editor-demo__cta" @click="previewButtonAction">
                  {{ demoData.buttonLabel || 'Texto del botón' }}
                  <i class="las la-arrow-right" aria-hidden="true"></i>
                </button>
              </div>

              <div
                class="editor-demo__image editor-demo__canvas-editable"
                :class="{ 'is-empty': !demoData.image }"
                role="button"
                tabindex="0"
                aria-label="Enfocar el campo de imagen"
                @click="focusDemoField('image')"
                @keydown.enter.prevent="focusDemoField('image')"
                @keydown.space.prevent="focusDemoField('image')"
              >
                <img
                  v-if="demoData.image"
                  :src="demoData.image"
                  :alt="demoData.imageAlt"
                  :style="focusStyle"
                />
                <div v-else class="editor-demo__image-empty">
                  <i class="las la-image" aria-hidden="true"></i>
                  <span>Sube una imagen desde el panel</span>
                </div>
              </div>
            </article>

            <p class="editor-demo__image-caption">
              Mueve el punto focal en el campo de imagen y observa cómo cambia el recorte.
            </p>

            <div v-if="demoMessage" class="editor-demo__message" role="status">
              <i class="las la-info-circle" aria-hidden="true"></i>
              {{ demoMessage }}
              <button
                v-if="demoCodeRequest"
                type="button"
                class="editor-demo__message-link"
                @click="showCode(demoCodeRequest.key, demoCodeRequest.line)"
              >
                Ver código de este campo
              </button>
            </div>

            <details class="editor-demo__data">
              <summary>Ver los datos que cambian</summary>
              <pre>{{ serializedDemoData }}</pre>
            </details>
          </div>
        </div>
      </div>

      <p class="editor-docs__caption">
        Prueba escribir un título, cambiar el color, elegir “Página externa” o cargar una imagen.
        El texto, el estilo, la acción del botón y el encuadre se reflejan en la vista de la derecha.
        También puedes hacer clic en el título, la descripción o la imagen de la vista para enfocar
        su campo. Todo ocurre localmente en esta página de documentación.
      </p>

      <div id="editor-beta-code" ref="codeSection" class="editor-code-explorer" tabindex="-1">
        <div class="editor-code-explorer__heading">
          <div>
            <span class="editor-docs__eyebrow">Implementación</span>
            <h3>Cómo se consume {{ activeCodeTab.label }}</h3>
          </div>
          <span class="editor-code-explorer__line-note">
            Línea {{ activeCodeLine }} resaltada
          </span>
        </div>

        <div class="editor-code-explorer__tabs" role="tablist" aria-label="Ejemplos de código por campo">
          <button
            v-for="tab in editorCodeTabs"
            :id="`editor-code-tab-${tab.key}`"
            :key="tab.key"
            type="button"
            role="tab"
            :aria-selected="activeCodeKey === tab.key"
            :tabindex="activeCodeKey === tab.key ? 0 : -1"
            :class="{ 'is-active': activeCodeKey === tab.key }"
            @click="selectCodeTab(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>

        <p class="editor-code-explorer__description">{{ activeCodeTab.description }}</p>
        <div role="tabpanel" :aria-labelledby="`editor-code-tab-${activeCodeKey}`">
          <CodeBlock
            :code="activeCodeExample"
            lang="vue"
            :highlight-line="activeCodeLine"
          />
        </div>
        <p class="editor-code-explorer__help">
          Usa los botones <strong>Ver código</strong> junto a los campos para saltar a su ejemplo y
          resaltar la línea correspondiente. Los imports son relativos al <code>Editor.vue</code> del bloque.
        </p>
      </div>
    </section>

    <section id="editor-beta-consumption" class="editor-docs__section">
      <h2>Cómo se consumen en un <code>Editor.vue</code></h2>
      <p>
        Cada editor importa los controles que necesita desde <code>components/editor-beta</code>,
        los coloca en su formulario y conecta cada valor con los datos del bloque mediante
        <code>v-model</code>. Las props permiten ajustar etiquetas, ayudas, límites y variaciones.
      </p>
      <ol>
        <li>Importa el control, por ejemplo <code>EditorTextarea</code>, en el <code>Editor.vue</code>.</li>
        <li>Conecta el campo con la propiedad correspondiente, como <code>v-model="localData.title"</code>.</li>
        <li>Configura sus opciones con props y, si aplica, enlaza modelos adicionales como <code>target</code>, <code>alt</code> o el punto focal.</li>
        <li>El editor emite los datos actualizados y el bloque los refleja en la vista previa.</li>
      </ol>
      <div class="editor-docs__note">
        <strong>Son controles para construir formularios.</strong>
        Los componentes de <code>editor-beta</code> no son bloques de contenido ni se agregan al lienzo
        por sí solos: se reutilizan dentro del editor de cada bloque.
      </div>
    </section>

    <section id="editor-beta-fields" class="editor-docs__section">
      <h2>Campos disponibles</h2>
      <p>
        El editor de cada bloque combina solo los controles que necesita. Los campos comparten
        etiquetas, ayudas, márgenes y comportamiento para que el panel sea familiar entre bloques.
      </p>
      <ul class="editor-docs__field-list">
        <li><code>EditorText</code>: texto de una línea; permite <code>maxlength</code>, <code>counter</code>, <code>placeholder</code> y ayudas.</li>
        <li><code>EditorTextarea</code>: texto multilínea con las mismas opciones y <code>rows</code> para definir su alto inicial.</li>
        <li><code>EditorUrl</code>: acepta rutas internas o URL completas; <code>v-model:target</code> agrega el switch de pestaña.</li>
        <li><code>EditorImage</code>: seleccionar, cambiar o quitar una imagen; alt y controles de foco aparecen al enlazar sus modelos.</li>
        <li><code>EditorBrandColor</code>: elige un color institucional y guarda su token de diseño.</li>
        <li><code>EditorImageFocus</code>: ajusta qué parte de la imagen queda visible al recortarla.</li>
        <li><code>EditorLinkTarget</code>: configura si un enlace abre en la misma pestaña o en otra.</li>
        <li><code>EditorFieldShell</code> y <code>EditorHint</code>: estructura común para etiquetas, ayuda y avisos.</li>
      </ul>

      <p>
        El selector de color conserva el token, por ejemplo <code>--ds-color-univ-management</code>,
        en los datos del bloque. El componente visual resuelve ese token al mostrar el color. En la demo,
        el selector de código muestra cómo conectar el token con el estilo de <code>Block.vue</code>.
      </p>
      <p>
        <code>EditorImage</code> puede recibir texto alternativo y coordenadas de foco por
        <code>v-model</code>. El evento <code>select</code> permite que el editor abra el selector de
        medios del administrador y asigne el archivo al campo correspondiente.
      </p>
    </section>

    <section id="editor-beta-canvas-focus" class="editor-docs__section">
      <h2>Editar un campo haciendo clic en el lienzo</h2>
      <p>
        Los bloques pueden vincular una parte visible —como un título o una imagen— con el campo que
        la controla. Al hacer clic en esa parte dentro del lienzo, el inspector abre o enfoca el campo
        correspondiente. La ruta debe coincidir en ambos lados: <code>data-edit</code> en el bloque y
        <code>data-edit-target</code> en el editor.
      </p>
      <CodeBlock :code="focusExample" lang="vue" />
      <p>
        Este comportamiento lo coordina <code>core/editFocus.ts</code>. Las marcas se activan en el
        lienzo del constructor; no forman parte de la página pública.
      </p>
    </section>

  </div>
</template>

<style scoped>
.editor-docs {
  color: var(--docs-text);
}

.editor-docs__header {
  padding-bottom: 32px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--docs-border);
}

.editor-docs__eyebrow {
  display: block;
  margin-bottom: 8px;
  color: var(--docs-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.editor-docs__title {
  margin: 0 0 8px;
  color: var(--docs-text);
  font-size: 34px;
  font-weight: 700;
}

.editor-docs__lead,
.editor-docs__section p,
.editor-docs__section li {
  color: var(--docs-text-muted);
  font-size: 15px;
  line-height: 1.7;
}

.editor-docs__lead {
  max-width: 760px;
  margin: 0;
}

.editor-docs code {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--docs-bg-hover);
  color: var(--docs-text);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 0.88em;
}

.editor-docs__section {
  padding-top: 30px;
  scroll-margin-top: 24px;
}

.editor-docs__section h2 {
  margin: 0 0 12px;
  color: var(--docs-text);
  font-size: 22px;
  font-weight: 700;
}

.editor-docs__section h3 {
  margin: 24px 0 10px;
  color: var(--docs-text);
  font-size: 16px;
  font-weight: 650;
}

.editor-docs__section p {
  max-width: 800px;
  margin: 0 0 14px;
}

.editor-docs__section ol,
.editor-docs__field-list {
  max-width: 850px;
  padding-left: 24px;
  margin: 0 0 18px;
}

.editor-docs__section li + li {
  margin-top: 8px;
}

.editor-docs__section strong {
  color: var(--docs-text);
}

.editor-docs__note {
  max-width: 850px;
  padding: 14px 16px;
  border-left: 3px solid var(--docs-accent);
  border-radius: 0 6px 6px 0;
  background: var(--docs-bg-elevated);
  color: var(--docs-text-muted);
  font-size: 14px;
  line-height: 1.65;
}

.editor-docs__caption {
  margin-top: 10px !important;
  font-size: 13px !important;
}

.editor-demo {
  overflow: hidden;
  margin-top: 22px;
  border: 1px solid #dfe3ea;
  border-radius: 12px;
  background: #f5f7fa;
  color: #1f2733;
  box-shadow: 0 8px 28px rgba(24, 35, 52, 0.08);
}

.editor-demo__topbar,
.editor-demo__topbar > div,
.editor-demo__reset,
.editor-demo__panel-heading,
.editor-demo__preview-heading,
.editor-demo__live-badge {
  display: flex;
  align-items: center;
}

.editor-demo__topbar {
  min-height: 48px;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 16px;
  border-bottom: 1px solid #e1e5eb;
  background: #fff;
  font-size: 12px;
}

.editor-demo__topbar > div {
  min-width: 0;
  gap: 8px;
}

.editor-demo__status-dot,
.editor-demo__live-badge span {
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #27ae70;
}

.editor-demo__breadcrumb {
  overflow: hidden;
  color: #7a8492;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.editor-demo__reset {
  flex: 0 0 auto;
  gap: 6px;
  padding: 6px 9px;
  border: 1px solid #dfe3ea;
  border-radius: 6px;
  background: #fff;
  color: #424d5c;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.editor-demo__reset:hover {
  border-color: #b9c1cd;
  background: #f8f9fb;
}

.editor-demo__workspace {
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  min-width: 0;
}

.editor-demo__panel {
  min-width: 0;
  padding: 20px;
  background: #fff;
}

.editor-demo__panel-heading,
.editor-demo__preview-heading {
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 18px;
}

.editor-demo__panel-heading h3,
.editor-demo__preview-heading h3 {
  margin: 3px 0 0;
  color: #1f2733;
  font-size: 16px;
  font-weight: 700;
}

.editor-demo__panel-kicker {
  color: #8490a0;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.editor-demo__beta-badge {
  padding: 4px 7px;
  border-radius: 4px;
  background: #fff1f3;
  color: #d8193f;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.editor-demo__file-input {
  display: none;
}

.editor-demo__local-note {
  margin: 4px 0 0;
  color: #7a8492;
  font-size: 10px;
  line-height: 1.45;
}

.editor-demo__field {
  position: relative;
}

.editor-demo__code-link {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 0 2px 6px;
  border: 0;
  background: #fff;
  color: #536b8e;
  font: inherit;
  font-size: 10px;
  line-height: 1.4;
  cursor: pointer;
}

.editor-demo__code-link:hover,
.editor-demo__code-link:focus-visible {
  color: #d7193f;
  text-decoration: underline;
}

.editor-demo__preview-area {
  min-width: 0;
  padding: 22px;
  background: #f4f6f9;
}

.editor-demo__preview-heading {
  margin-bottom: 18px;
}

.editor-demo__live-badge {
  flex: 0 0 auto;
  gap: 6px;
  padding: 5px 8px;
  border: 1px solid #dce8df;
  border-radius: 999px;
  background: #f5fbf6;
  color: #39734e;
  font-size: 10px;
  font-weight: 600;
}

.editor-demo__live-badge span {
  width: 6px;
  height: 6px;
}

.editor-demo__block {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.95fr);
  min-height: 260px;
  overflow: hidden;
  border-radius: 0 14px 14px 14px;
  background: #fff;
  box-shadow: 0 4px 14px rgba(24, 35, 52, 0.1);
}

.editor-demo__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  min-width: 0;
  padding: clamp(20px, 3vw, 30px);
  transition: background-color 160ms ease, color 160ms ease;
}

.editor-demo__copy h4 {
  margin: 0 0 10px;
  color: inherit;
  font-family: var(--ds-font-family-display, inherit);
  font-size: clamp(18px, 2vw, 25px);
  font-weight: 650;
  line-height: 1.2;
}

.editor-demo__canvas-editable {
  cursor: pointer;
}

.editor-demo__copy .editor-demo__canvas-editable:hover {
  text-decoration: underline dotted currentColor;
  text-underline-offset: 4px;
}

.editor-demo__copy p {
  margin: 0;
  color: inherit;
  font-size: 13px;
  line-height: 1.55;
  opacity: 0.92;
}

.editor-demo__cta {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  max-width: 100%;
  padding: 11px 15px;
  border: 0;
  border-radius: 4px;
  background: #fff;
  color: #254d9a;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.editor-demo__cta i {
  color: #e3173e;
  font-size: 16px;
}

.editor-demo__cta:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
}

.editor-demo__image {
  min-width: 0;
  min-height: 220px;
  overflow: hidden;
  background: #d8e3ee;
}

.editor-demo__image:hover {
  outline: 3px solid rgba(255, 255, 255, 0.72);
  outline-offset: -5px;
}

.editor-demo__image img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 220px;
  object-fit: cover;
  transition: object-position 120ms ease;
}

.editor-demo__image-empty {
  display: flex;
  height: 100%;
  min-height: 220px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #64748b;
  font-size: 12px;
}

.editor-demo__image-empty i {
  font-size: 30px;
}

.editor-demo__image-caption {
  margin: 9px 0 14px;
  color: #737e8c;
  font-size: 11px;
}

.editor-demo__message {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 7px;
  padding: 9px 11px;
  border: 1px solid #d8e4f4;
  border-radius: 6px;
  background: #f7faff;
  color: #40546f;
  font-size: 11px;
  line-height: 1.45;
}

.editor-demo__message i {
  flex: 0 0 auto;
  margin-top: 1px;
  color: #426aa2;
}

.editor-demo__message-link {
  margin-left: auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: #315c96;
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

.editor-demo__data {
  margin-top: 12px;
  border: 1px solid #dfe3ea;
  border-radius: 6px;
  background: #fff;
}

.editor-demo__data summary {
  padding: 9px 11px;
  color: #596575;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.editor-demo__data pre {
  max-height: 230px;
  overflow: auto;
  margin: 0;
  padding: 10px 12px;
  border-top: 1px solid #e8ebf0;
  background: #181a20;
  color: #e6e9ef;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 10px;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.editor-code-explorer {
  padding-top: 28px;
  margin-top: 22px;
  scroll-margin-top: 24px;
}

.editor-code-explorer:focus {
  outline: none;
}

.editor-code-explorer__heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--docs-border);
}

.editor-code-explorer__heading .editor-docs__eyebrow {
  margin-bottom: 4px;
}

.editor-code-explorer__heading h3 {
  margin: 0;
  color: var(--docs-text);
  font-size: 19px;
}

.editor-code-explorer__line-note {
  flex: 0 0 auto;
  padding: 5px 8px;
  border: 1px solid #f2c9d1;
  border-radius: 5px;
  background: #fff6f7;
  color: #b51d3b;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 10px;
}

.editor-code-explorer__tabs {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 14px 0 10px;
}

.editor-code-explorer__tabs button {
  flex: 0 0 auto;
  padding: 7px 12px;
  border: 1px solid var(--docs-border);
  border-radius: 6px;
  background: var(--docs-bg);
  color: var(--docs-text-muted);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}

.editor-code-explorer__tabs button:hover {
  border-color: var(--docs-accent);
}

.editor-code-explorer__tabs button.is-active {
  border-color: var(--docs-accent);
  background: var(--docs-accent);
  color: #fff;
}

.editor-code-explorer__description,
.editor-code-explorer__help {
  margin: 0 0 12px;
  color: var(--docs-text-muted);
  font-size: 13px;
  line-height: 1.55;
}

.editor-code-explorer__help {
  margin: 10px 0 0;
  font-size: 12px;
}

.editor-code-explorer__help strong {
  color: var(--docs-text);
}

.editor-code-explorer__help code {
  padding: 1px 4px;
  border-radius: 4px;
  background: var(--docs-bg-hover);
  color: var(--docs-text);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 0.9em;
}

@media (max-width: 900px) {
  .editor-docs__title {
    font-size: 28px;
  }

  .editor-demo__workspace {
    grid-template-columns: minmax(0, 1fr);
  }

  .editor-demo__preview-area {
    border-top: 1px solid #e1e5eb;
  }
}

@media (max-width: 580px) {
  .editor-code-explorer__heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .editor-demo__topbar {
    align-items: flex-start;
  }

  .editor-demo__topbar > div {
    flex-wrap: wrap;
  }

  .editor-demo__breadcrumb {
    flex-basis: 100%;
    padding-left: 16px;
  }

  .editor-demo__panel,
  .editor-demo__preview-area {
    padding: 16px;
  }

  .editor-demo__block {
    display: flex;
    flex-direction: column-reverse;
  }

  .editor-demo__image,
  .editor-demo__image img {
    min-height: 190px;
    max-height: 220px;
  }
}
</style>

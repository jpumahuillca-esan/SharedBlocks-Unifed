<template>
  <div class="footer-v1-editor">
    <!-- Contactos -->
    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Contactos</h6>
      <span class="badge bg-secondary">{{ localData.contacts.length }}</span>
    </div>
    <p class="fe-hint">
      La fila de arriba. En escritorio y tableta van uno al lado del otro; en
      teléfono, apilados.
    </p>

    <CardAccordionItem
      v-for="(contact, index) in localData.contacts"
      :key="contact.id"
      :title="contact.title"
      :index="index"
      :total="localData.contacts.length"
      :open="openKey === `contact-${contact.id}`"
      remove-label="Quitar contacto"
      @toggle="toggle(`contact-${contact.id}`)"
      @move="move(localData.contacts, index, $event)"
      @remove="localData.contacts.splice(index, 1)"
    >
      <label class="form-label">Título</label>
      <input
        v-model="contact.title"
        type="text"
        class="form-control form-control-sm mb-2"
        placeholder="Sede principal:"
      />

      <label class="form-label">Dato</label>
      <p class="fe-hint">Cada salto de línea se respeta en el pie.</p>
      <textarea
        v-model="contact.text"
        class="form-control form-control-sm mb-2"
        rows="2"
        placeholder="Alonso de Molina 1652,&#10;Monterrico, Surco - Lima, Perú"
      ></textarea>

      <label class="form-label">Enlace (opcional)</label>
      <p class="fe-hint">Para que el dato se pueda pulsar: mailto:, tel: o una ruta.</p>
      <input
        v-model="contact.url"
        type="text"
        class="form-control form-control-sm"
        placeholder="mailto:informes@esan.edu.pe"
      />
    </CardAccordionItem>

    <button type="button" class="btn btn-sm btn-outline-danger w-100" @click="addContact">
      <i class="las la-plus me-1"></i> Agregar contacto
    </button>

    <hr />

    <!-- Columnas de enlaces -->
    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Columnas de enlaces</h6>
      <span class="badge bg-secondary">{{ localData.columns.length }}</span>
    </div>
    <p class="fe-hint">
      En escritorio, una columna al lado de otra. En tableta y teléfono cada
      una se pliega bajo su título; la primera se ve abierta.
    </p>

    <CardAccordionItem
      v-for="(column, index) in localData.columns"
      :key="column.id"
      :title="column.title"
      :index="index"
      :total="localData.columns.length"
      :open="openKey === `column-${column.id}`"
      remove-label="Quitar columna"
      @toggle="toggle(`column-${column.id}`)"
      @move="move(localData.columns, index, $event)"
      @remove="localData.columns.splice(index, 1)"
    >
      <label class="form-label">Título de la columna</label>
      <input
        v-model="column.title"
        type="text"
        class="form-control form-control-sm mb-2"
        placeholder="Estudia en ESAN"
      />

      <label class="form-label">Enlaces</label>
      <div v-for="(link, linkIndex) in column.links" :key="link.id" class="fe-link">
        <div class="fe-link__fields">
          <input
            v-model="link.label"
            type="text"
            class="form-control form-control-sm"
            placeholder="Texto"
          />
          <input
            v-model="link.url"
            type="text"
            class="form-control form-control-sm"
            placeholder="/ruta o https://"
          />
        </div>
        <div class="fe-link__actions">
          <button
            type="button"
            class="fe-link__btn"
            title="Subir"
            :disabled="linkIndex === 0"
            @click="move(column.links, linkIndex, -1)"
          >
            <i class="las la-arrow-up"></i>
          </button>
          <button
            type="button"
            class="fe-link__btn"
            title="Bajar"
            :disabled="linkIndex === column.links.length - 1"
            @click="move(column.links, linkIndex, 1)"
          >
            <i class="las la-arrow-down"></i>
          </button>
          <button
            type="button"
            class="fe-link__btn is-danger"
            title="Quitar enlace"
            @click="column.links.splice(linkIndex, 1)"
          >
            <i class="las la-trash"></i>
          </button>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-sm btn-outline-secondary w-100"
        @click="column.links.push(buildLink({}))"
      >
        <i class="las la-plus me-1"></i> Agregar enlace
      </button>
    </CardAccordionItem>

    <button type="button" class="btn btn-sm btn-outline-danger w-100" @click="addColumn">
      <i class="las la-plus me-1"></i> Agregar columna
    </button>

    <hr />

    <!-- Redes sociales -->
    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Redes sociales</h6>
      <span class="badge bg-secondary">{{ localData.socials.length }}</span>
    </div>
    <p class="fe-hint">
      En escritorio van bajo la primera columna; en tableta y teléfono, sobre
      las columnas. Se abren en una pestaña nueva.
    </p>

    <div v-for="(social, index) in localData.socials" :key="social.id" class="fe-link">
      <div class="fe-link__fields">
        <select v-model="social.network" class="form-select form-select-sm">
          <option v-for="option in NETWORK_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <input
          v-model="social.url"
          type="text"
          class="form-control form-control-sm"
          placeholder="https://"
        />
      </div>
      <div class="fe-link__actions">
        <button
          type="button"
          class="fe-link__btn"
          title="Subir"
          :disabled="index === 0"
          @click="move(localData.socials, index, -1)"
        >
          <i class="las la-arrow-up"></i>
        </button>
        <button
          type="button"
          class="fe-link__btn"
          title="Bajar"
          :disabled="index === localData.socials.length - 1"
          @click="move(localData.socials, index, 1)"
        >
          <i class="las la-arrow-down"></i>
        </button>
        <button
          type="button"
          class="fe-link__btn is-danger"
          title="Quitar red"
          @click="localData.socials.splice(index, 1)"
        >
          <i class="las la-trash"></i>
        </button>
      </div>
    </div>

    <button type="button" class="btn btn-sm btn-outline-danger w-100" @click="addSocial">
      <i class="las la-plus me-1"></i> Agregar red
    </button>

    <hr />

    <!-- Libro de reclamaciones -->
    <h6 class="fw-bold small text-uppercase mb-1">Libro de reclamaciones</h6>
    <p class="fe-hint">
      En escritorio va bajo la última columna; en tableta y teléfono, centrado
      sobre el copyright. Sin imagen no se muestra.
    </p>

    <div class="fe-image-preview mb-2">
      <img v-if="localData.claimsImage" :src="localData.claimsImage" alt="" />
      <span v-else class="text-muted small">Sin imagen</span>
    </div>
    <div class="d-flex gap-2 mb-2">
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary flex-grow-1"
        @click="$emit('select-image', { item: localData, field: 'claimsImage' })"
      >
        <i class="las la-image me-1"></i>
        {{ localData.claimsImage ? 'Cambiar imagen' : 'Subir imagen' }}
      </button>
      <button
        v-if="localData.claimsImage"
        type="button"
        class="btn btn-sm btn-outline-danger"
        title="Quitar imagen"
        @click="localData.claimsImage = ''"
      >
        <i class="las la-trash"></i>
      </button>
    </div>

    <label class="form-label">Texto alternativo</label>
    <input
      v-model="localData.claimsImageAlt"
      type="text"
      class="form-control form-control-sm mb-2"
      placeholder="Libro de Reclamaciones"
    />

    <label class="form-label">Destino</label>
    <input
      v-model="localData.claimsUrl"
      type="text"
      class="form-control form-control-sm"
      placeholder="/libro-de-reclamaciones o https://"
    />

    <hr />

    <!-- Copyright -->
    <label class="form-label fw-bold small text-uppercase">Copyright</label>
    <input
      v-model="localData.copyright"
      type="text"
      class="form-control form-control-sm"
      placeholder="© Copyright 2026 - Universidad ESAN | Todos los derechos reservados."
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Editor del pie de página, versión 1.
 *
 * Mismo patrón que los editores de block-beta: una copia local construida con
 * valores por defecto, que se emite en cuanto cambia. Las listas usan el mismo
 * panel plegable que las tarjetas de `events`, y un solo panel abierto a la vez
 * entre contactos y columnas, para que el panel no se haga interminable.
 */
import { ref, watch } from 'vue';
import CardAccordionItem from '../../../block-beta/events/_shared/CardAccordionItem.vue';

type SocialNetwork = 'facebook' | 'x' | 'youtube' | 'instagram' | 'linkedin';

/** Las que sabe dibujar AtomSocialIcon, en el orden de la maqueta. */
const NETWORK_OPTIONS: Array<{ value: SocialNetwork; label: string }> = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
];

interface FooterContact { id: string; title: string; text: string; url: string }
interface FooterLink { id: string; label: string; url: string }
interface FooterColumn { id: string; title: string; links: FooterLink[] }
interface FooterSocial { id: string; network: SocialNetwork; url: string }

const props = defineProps<{ modelValue: any }>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const text = (value: unknown) => (typeof value === 'string' ? value : '');
const list = (value: unknown): any[] => (Array.isArray(value) ? value : []);

const buildContact = (source: any): FooterContact => ({
  id: source?.id || newId('fc'),
  title: text(source?.title),
  text: text(source?.text),
  url: text(source?.url),
});

const buildLink = (source: any): FooterLink => ({
  id: source?.id || newId('fl'),
  label: text(source?.label),
  url: text(source?.url),
});

const buildColumn = (source: any): FooterColumn => ({
  id: source?.id || newId('fcol'),
  title: text(source?.title),
  links: list(source?.links).map(buildLink),
});

const buildSocial = (source: any): FooterSocial => ({
  id: source?.id || newId('fs'),
  network: NETWORK_OPTIONS.some((option) => option.value === source?.network)
    ? source.network
    : 'facebook',
  url: text(source?.url),
});

const build = (source: any) => ({
  contacts: list(source?.contacts).map(buildContact),
  columns: list(source?.columns).map(buildColumn),
  socials: list(source?.socials).map(buildSocial),
  claimsImage: text(source?.claimsImage),
  claimsImageAlt: text(source?.claimsImageAlt),
  claimsUrl: text(source?.claimsUrl),
  copyright: text(source?.copyright),
});

const localData = ref(build(props.modelValue));

/*
 * Un solo panel abierto entre contactos y columnas. Se guarda con prefijo y id,
 * no por posición, para que reordenar no abra otro panel.
 */
const openKey = ref<string | null>(null);

const toggle = (key: string) => {
  openKey.value = openKey.value === key ? null : key;
};

/** Mueve un elemento de cualquiera de las listas un puesto arriba o abajo. */
const move = (items: any[], index: number, delta: number) => {
  const target = index + delta;
  if (target < 0 || target >= items.length) return;
  [items[index], items[target]] = [items[target], items[index]];
};

const addContact = () => {
  const contact = buildContact({});
  localData.value.contacts.push(contact);
  // El nuevo se abre solo: es el que se va a rellenar.
  openKey.value = `contact-${contact.id}`;
};

const addColumn = () => {
  const column = buildColumn({ links: [{}] });
  localData.value.columns.push(column);
  openKey.value = `column-${column.id}`;
};

/* Propone la primera red que todavía no esté en la lista. */
const addSocial = () => {
  const used = new Set(localData.value.socials.map((social) => social.network));
  const next = NETWORK_OPTIONS.find((option) => !used.has(option.value))?.value ?? 'facebook';
  localData.value.socials.push(buildSocial({ network: next }));
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return;
    if (JSON.stringify(newVal) === JSON.stringify(localData.value)) return;
    localData.value = build(newVal);
  },
  { deep: true },
);

watch(
  localData,
  (newVal) => emit('update:modelValue', JSON.parse(JSON.stringify(newVal))),
  { deep: true },
);
</script>

<style scoped>
.fe-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

/* Fila de un enlace o de una red: campos a la izquierda, acciones a la derecha. */
.fe-link {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 8px;
  padding: 6px;
  border: 1px solid #dde3ec;
  border-radius: 7px;
  background: #fff;
}

.fe-link__fields {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.fe-link__actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.fe-link__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: #6b7688;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.fe-link__btn:hover:not(:disabled) {
  background: #eef1f6;
  color: #212529;
}

.fe-link__btn.is-danger:hover:not(:disabled) {
  background: #dc3545;
  color: #fff;
}

.fe-link__btn:disabled {
  opacity: 0.35;
  cursor: default;
}

/* Fondo oscuro, el del pie: así se ve la imagen como va a quedar. */
.fe-image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  padding: 8px;
  border: 1px dashed #c6cedb;
  border-radius: 7px;
  background: #161922;
  overflow: hidden;
}

.fe-image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>

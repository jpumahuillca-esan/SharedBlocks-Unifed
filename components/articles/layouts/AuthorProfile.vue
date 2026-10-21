<template>
  <article class="author-profile-page py-5 bg-white">
    <div class="container">
      <div class="row g-5">
        <!-- Columna Principal -->
        <div :class="author.photo_url ? 'col-lg-8' : 'col-lg-10 mx-auto'">
          <!-- Cabecera del Autor -->
          <div class="d-flex flex-column flex-sm-row gap-4 align-items-sm-center pb-4 border-bottom">
            <div class="flex-shrink-0">
              <img
                :src="formatImageUrl(author.avatar_url || author.foto_avatar)"
                :alt="author.name || author.full_name"
                class="rounded-circle shadow-sm border border-2 border-light object-fit-cover"
                width="160"
                height="160"
                @error="(e: any) => e.target.src = 'https://ui-avatars.com/api/?background=0f6eb6&color=fff&name=' + encodeURIComponent(author.name || 'Autor')"
              />
            </div>
            <div class="flex-grow-1">
              <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                <h1 class="h2 fw-bold text-dark m-0">{{ author.name || author.full_name }}</h1>
                <span v-if="author.country" class="badge bg-light text-secondary border px-2 py-1">
                  {{ author.country.replace(/[()]/g, '') }}
                </span>
                <span class="badge bg-info-subtle text-info border border-info-subtle px-2 py-1 fw-semibold">
                  Autor Conexión ESAN
                </span>
              </div>

              <p v-if="author.degree" class="text-primary fw-semibold mb-2" style="font-size: 0.95rem; line-height: 1.4;">
                {{ author.degree }}
              </p>

              <p v-if="author.position || author.cargo" class="text-muted small mb-0 fw-medium">
                {{ author.position || author.cargo }}
              </p>

              <div v-if="author.academic_area || author.area" class="mt-2">
                <span class="badge bg-danger-subtle text-danger border border-danger-subtle fw-normal">
                  {{ author.academic_area || author.area }}
                </span>
              </div>
            </div>
          </div>

          <!-- Reseña / Biografía -->
          <section v-if="author.bio || author.resena" class="pt-4">
            <h2 class="h5 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i class="las la-user-tie text-danger fs-4"></i> Reseña Biográfica
            </h2>
            <div class="author-rich-text text-secondary lh-lg" v-html="author.bio || author.resena"></div>
          </section>

          <!-- Trayectoria y Experiencia Profesional -->
          <section v-if="author.experience || author.experiencia" class="pt-4 mt-2">
            <h2 class="h5 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i class="las la-briefcase text-danger fs-4"></i> Trayectoria Profesional
            </h2>
            <div class="author-rich-text text-secondary lh-lg" v-html="author.experience || author.experiencia"></div>
          </section>

          <!-- Cursos y Programas Donde Enseña (Maestrías, Diplomas, etc.) -->
          <section v-if="author.courses && author.courses.length" class="pt-4 mt-2 border-top">
            <h2 class="h5 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i class="las la-graduation-cap text-danger fs-4"></i> Programas y Maestrías
            </h2>
            <div class="row g-2">
              <div v-for="(course, idx) in author.courses" :key="idx" class="col-md-6">
                <div class="card h-100 border-light bg-light shadow-sm p-3 rounded-3">
                  <div class="d-flex align-items-center gap-2">
                    <i class="las la-book-reader text-danger fs-4 flex-shrink-0"></i>
                    <div>
                      <small class="text-muted d-block" style="font-size: 0.75rem;">Docente en:</small>
                      <AtomLink :href="course.url" class="fw-bold text-dark text-decoration-none hover-primary small">
                        {{ course.title || course.name }}
                      </AtomLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Artículos Publicados en Conexión ESAN -->
          <section v-if="author.articles && author.articles.length" class="pt-4 mt-3 border-top">
            <h2 class="h5 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i class="las la-newspaper text-danger fs-4"></i> Artículos de Opinión en Conexión ESAN
            </h2>
            <ul class="list-group list-group-flush border rounded-3 overflow-hidden shadow-sm">
              <li
                v-for="(art, idx) in author.articles"
                :key="idx"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
              >
                <AtomLink :href="art.url" class="text-dark fw-medium text-decoration-none hover-danger flex-grow-1 pe-3">
                  {{ art.title }}
                </AtomLink>
                <span v-if="art.date" class="badge bg-light text-muted border fw-normal flex-shrink-0">
                  <i class="las la-calendar me-1"></i>{{ art.date }}
                </span>
              </li>
            </ul>
          </section>
        </div>

        <!-- Columna Lateral: Foto Portrait / Destacada (Si existe) -->
        <div v-if="author.photo_url" class="col-lg-4">
          <div class="position-sticky" style="top: 2rem;">
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
              <img
                :src="formatImageUrl(author.photo_url)"
                :alt="author.name || author.full_name"
                class="img-fluid w-100 object-fit-cover"
                style="max-height: 520px;"
              />
              <div class="card-body bg-light p-3 text-center">
                <span class="small text-muted fw-semibold">Autor y Columnista</span>
                <div class="fw-bold text-dark">{{ author.name || author.full_name }}</div>
                <small class="text-primary fw-medium d-block">Conexión ESAN</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Secciones Libres del Page Builder (Opción D: Híbrido) -->
      <div v-if="author.content_blocks && author.content_blocks.length" class="mt-5 pt-4 border-top">
        <PageSections :content="author.content_blocks" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatImageUrl } from '../../../helpers/url';
import PageSections from '../../layout/PageSections.vue';
import AtomLink from '../../atoms/AtomLink.vue';

const props = defineProps<{
  data?: any;
  pageData?: any;
  docenteData?: any;
}>();

const author = computed(() => {
  const raw = props.docenteData || props.data || props.pageData || {};
  let body = raw.body || raw.content_blocks || raw;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  return {
    slug: raw.slug || body.slug || '',
    name: body.name || raw.name || raw.title || `${raw.first_name || ''} ${raw.last_name || ''}`.trim(),
    full_name: raw.full_name || body.full_name || raw.title,
    country: body.country || raw.country || '(Perú)',
    avatar_url: body.avatar_url || raw.avatar_url || raw.avatar_path || raw.foto_avatar || raw.photo_url,
    photo_url: body.photo_url || raw.photo_url || raw.photo_path || raw.foto,
    degree: body.degree || raw.degree || raw.grado,
    position: body.position || raw.position || raw.cargo || raw.position_name,
    academic_area: body.academic_area || raw.academic_area || raw.area,
    bio: body.bio || raw.bio || raw.resena || '',
    experience: body.experience || raw.experience || raw.experiencia || '',
    articles: body.articles || raw.articles || [],
    content_blocks: Array.isArray(raw.content_blocks) ? raw.content_blocks : (Array.isArray(body.content_blocks) ? body.content_blocks : []),
  };
});
</script>

<style scoped>
.hover-primary:hover {
  color: #0f6eb6 !important;
  text-decoration: underline !important;
}
.hover-danger:hover {
  color: #c41e3a !important;
  text-decoration: underline !important;
}
.author-rich-text :deep(p) {
  margin-bottom: 1rem;
}
.author-rich-text :deep(p:last-child) {
  margin-bottom: 0;
}
</style>

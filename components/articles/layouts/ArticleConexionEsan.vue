<template>
  <article class="conexion-esan-article-page bg-white py-4 py-lg-5">
    <div class="container" style="max-width: 1280px;">
      
      <!-- 1. BREADCRUMBS EDITORIAL -->
      <nav class="mb-4" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0 small text-muted">
          <li class="breadcrumb-item">
            <AtomLink to="/" class="text-decoration-none text-muted hover-danger">Inicio</AtomLink>
          </li>
          <li class="breadcrumb-item">
            <AtomLink to="/conexion-esan/" class="text-decoration-none text-muted hover-danger">Conexión ESAN</AtomLink>
          </li>
          <li class="breadcrumb-item active text-danger fw-semibold" aria-current="page">
            {{ categoryName }}
          </li>
        </ol>
      </nav>

      <div class="row g-5">
        <!-- ==========================================
             COLUMNA PRINCIPAL (ARTÍCULO DE OPINIÓN)
             ========================================== -->
        <div class="col-lg-8">
          
          <!-- Categoría & Badge -->
          <div class="d-flex align-items-center gap-2 mb-3">
            <span class="badge bg-danger bg-opacity-10 text-danger border border-danger-subtle px-3 py-1 text-uppercase fw-bold letter-spacing-1">
              {{ categoryName }}
            </span>
            <span class="text-muted small">
              <i class="las la-clock me-1"></i> {{ readingTime }} min de lectura
            </span>
          </div>

          <!-- Título del Artículo -->
          <h1 class="article-title fw-bold text-dark mb-3">
            {{ article.title }}
          </h1>

          <!-- Bajada / Copete / Excerpt -->
          <p v-if="article.excerpt" class="article-excerpt lead text-secondary mb-4">
            {{ article.excerpt }}
          </p>

          <!-- Barra de Autor y Redes Sociales -->
          <div class="author-meta-bar d-flex flex-wrap align-items-center justify-content-between gap-3 py-3 border-top border-bottom mb-4">
            <!-- Info Autor -->
            <div class="d-flex align-items-center gap-3">
              <img
                :src="authorAvatar"
                :alt="authorName"
                class="rounded-circle shadow-sm object-fit-cover border border-2 border-danger-subtle flex-shrink-0"
                width="50"
                height="50"
                @error="handleAvatarError"
              />
              <div>
                <div class="d-flex align-items-center gap-2">
                  <AtomLink
                    v-if="authorSlug"
                    :to="authorUrl"
                    class="fw-bold text-dark text-decoration-none hover-danger"
                  >
                    {{ authorName }}
                  </AtomLink>
                  <span v-else class="fw-bold text-dark">
                    {{ authorName }}
                  </span>
                  <span class="badge bg-danger-subtle text-danger small px-2 py-0.5 fw-semibold" style="font-size: 0.7rem;">
                    Autor Conexión ESAN
                  </span>
                </div>
                <small class="text-muted d-block" style="font-size: 0.8rem; max-width: 420px; line-height: 1.3;">
                  {{ authorPosition }}
                </small>
                <small class="text-muted" style="font-size: 0.75rem;">
                  <i class="las la-calendar me-1"></i> Publicado: {{ formattedDate }}
                </small>
              </div>
            </div>

            <!-- Botones de Compartir -->
            <div class="d-flex align-items-center gap-2">
              <span class="text-muted small fw-semibold d-none d-sm-inline">Compartir:</span>
              <a
                :href="shareUrls.whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-sm btn-outline-success rounded-circle share-btn"
                title="Compartir por WhatsApp"
              >
                <i class="lab la-whatsapp fs-18"></i>
              </a>
              <a
                :href="shareUrls.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-sm btn-outline-primary rounded-circle share-btn"
                title="Compartir en LinkedIn"
              >
                <i class="lab la-linkedin-in fs-18"></i>
              </a>
              <a
                :href="shareUrls.twitter"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-sm btn-outline-dark rounded-circle share-btn"
                title="Compartir en X"
              >
                <i class="lab la-twitter fs-18"></i>
              </a>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary rounded-circle share-btn"
                :title="copied ? '¡Copiado!' : 'Copiar enlace'"
                @click="copyArticleLink"
              >
                <i class="las" :class="copied ? 'la-check text-success' : 'la-link fs-18'"></i>
              </button>
            </div>
          </div>

          <!-- Imagen Principal de Portada -->
          <figure class="article-cover-wrapper mb-4">
            <img
              :src="coverImage"
              :alt="article.title"
              class="w-100 rounded-3 shadow-sm object-fit-cover"
              style="max-height: 480px; min-height: 280px; object-position: center;"
              @error="handleCoverError"
            />
            <figcaption v-if="coverCaption" class="text-muted small mt-2 fst-italic text-center">
              {{ coverCaption }}
            </figcaption>
          </figure>

          <!-- ==========================================
               CUERPO DEL ARTÍCULO
               ========================================== -->
          <div class="article-content-body">
            <!-- Si tiene contenido HTML en la BD -->
            <div v-if="hasRealContent" class="rich-editorial-content" v-html="renderedHtmlContent" />

            <!-- Si el body de la base de datos está vacío (artículos migrados sin cuerpo extraído aún) -->
            <div v-else class="editorial-demo-content">
              <div class="alert alert-light border border-danger-subtle d-flex align-items-center gap-2 py-2 px-3 mb-4 rounded-3 text-muted small">
                <i class="las la-info-circle text-danger fs-18"></i>
                <span>Artículo de opinión y análisis económico de <strong>Conexión ESAN</strong>.</span>
              </div>

              <p class="fs-5 text-dark fw-medium lh-lg mb-4">
                El entorno macroeconómico y la coyuntura empresarial demandan un análisis riguroso de las variables que influyen directamente en la toma de decisiones estratégicas en el mercado peruano e internacional.
              </p>

              <h2 class="h4 fw-bold text-dark mt-4 mb-3 border-start border-4 border-danger ps-3">
                Factores determinantes y perspectivas
              </h2>

              <p class="text-secondary lh-lg mb-4">
                A lo largo de los últimos ejercicios fiscales, la interacción entre la política monetaria, la disciplina fiscal y el acceso al financiamiento corporativo ha redefinido el costo de capital para las organizaciones. En este escenario, la predictibilidad jurídica y la solidez institucional continúan siendo pilares fundamentales para mantener la atracción de capitales de largo plazo.
              </p>

              <!-- Cita Destacada (Blockquote Editorial) -->
              <blockquote class="editorial-quote my-4 p-4 rounded-3 bg-light border-start border-4 border-danger position-relative">
                <i class="las la-quote-left text-danger opacity-25 fs-1 position-absolute top-0 start-0 m-3"></i>
                <p class="fs-5 fst-italic text-dark mb-2 position-relative z-1" style="line-height: 1.7;">
                  "La confianza de los agentes económicos no se construye únicamente con indicadores de corto plazo, sino con una visión estructural que asegure la estabilidad de las reglas de juego y la competitividad productiva."
                </p>
                <footer class="blockquote-footer text-danger fw-semibold mt-2 mb-0">
                  {{ authorName }}, {{ authorPosition || 'Profesor de ESAN' }}
                </footer>
              </blockquote>

              <h2 class="h4 fw-bold text-dark mt-4 mb-3 border-start border-4 border-danger ps-3">
                Implicancias para la gestión empresarial
              </h2>

              <p class="text-secondary lh-lg mb-4">
                Para los directores financieros y gerentes generales, el desafío radica en optimizar la estructura de deuda, diversificar las fuentes de fondeo y gestionar proactivamente los riesgos de mercado. La adopción de herramientas analíticas de proyección y el monitoreo continuo de los diferenciales de tasa permiten a las compañías mitigar vulnerabilidades y capturar oportunidades de crecimiento sostenible.
              </p>

              <div class="p-3 bg-light rounded-3 border d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mt-4">
                <div>
                  <span class="fw-bold text-dark d-block">¿Deseas profundizar en este tema?</span>
                  <small class="text-muted">Conoce las publicaciones e investigaciones académicas de nuestros profesores.</small>
                </div>
                <AtomLink :to="authorUrl" class="btn btn-outline-danger btn-sm fw-bold px-3 text-nowrap">
                  Ver perfil de {{ authorName.split(' ')[0] }}
                </AtomLink>
              </div>
            </div>
          </div>

          <!-- Etiquetas del Artículo -->
          <div class="article-tags d-flex flex-wrap align-items-center gap-2 mt-5 pt-4 border-top">
            <span class="text-muted small fw-bold me-1">
              <i class="las la-tags me-1"></i> Temas:
            </span>
            <span v-for="cat in articleCategories" :key="cat.id" class="badge bg-light text-secondary border px-3 py-1.5 fw-medium">
              #{{ cat.name }}
            </span>
            <span class="badge bg-light text-secondary border px-3 py-1.5 fw-medium">
              #ConexiónESAN
            </span>
            <span class="badge bg-light text-secondary border px-3 py-1.5 fw-medium">
              #EducaciónEjecutiva
            </span>
          </div>

          <!-- ==========================================
               TARJETA "SOBRE EL AUTOR" (FOOTER)
               ========================================== -->
          <div class="author-bio-card p-4 rounded-3 border mt-5 bg-light shadow-sm">
            <div class="d-flex flex-column flex-sm-row gap-4 align-items-sm-center">
              <img
                :src="authorAvatar"
                :alt="authorName"
                class="rounded-circle shadow-sm border border-3 border-white object-fit-cover flex-shrink-0"
                width="84"
                height="84"
                @error="handleAvatarError"
              />
              <div class="flex-grow-1">
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
                  <div>
                    <span class="text-uppercase text-danger fw-bold small" style="letter-spacing: 0.05em; font-size: 0.75rem;">
                      Sobre el Autor
                    </span>
                    <h3 class="h5 fw-bold text-dark m-0">
                      {{ authorName }}
                    </h3>
                  </div>
                  <AtomLink
                    v-if="authorSlug"
                    :to="authorUrl"
                    class="btn btn-danger btn-sm fw-bold px-3 shadow-sm"
                  >
                    Ver perfil completo <i class="las la-arrow-right ms-1"></i>
                  </AtomLink>
                </div>

                <p class="text-muted small mb-2" v-if="authorPosition">
                  {{ authorPosition }}
                </p>

                <div v-if="authorBio" class="author-bio-text text-secondary small" style="line-height: 1.6;" v-html="authorBioSnippet"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ==========================================
             BARRA LATERAL (SIDEBAR CONEXIÓN ESAN)
             ========================================== -->
        <aside class="col-lg-4">
          <div class="sticky-top" style="top: 24px;">
            
            <!-- Widget: Buscador en Conexión ESAN -->
            <div class="card border shadow-sm mb-4">
              <div class="card-body p-3">
                <h6 class="fw-bold text-dark mb-2">
                  <i class="las la-search text-danger me-1"></i> Buscar en Conexión ESAN
                </h6>
                <div class="input-group input-group-sm">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Buscar noticias o artículos..."
                    v-model="searchQuery"
                    @keyup.enter="handleSearch"
                  />
                  <button class="btn btn-danger" type="button" @click="handleSearch">
                    <i class="las la-search"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Widget: Artículos Destacados / Lo Más Leído -->
            <div class="card border shadow-sm mb-4">
              <div class="card-header bg-white border-bottom py-3">
                <h6 class="fw-bold text-dark m-0 d-flex align-items-center">
                  <i class="las la-chart-line text-danger me-2 fs-18"></i>
                  Lo Más Leído en Conexión ESAN
                </h6>
              </div>
              <div class="card-body p-0">
                <ul class="list-group list-group-flush">
                  <li
                    v-for="(post, index) in sidebarArticles"
                    :key="post.id || index"
                    class="list-group-item p-3 list-group-item-action border-bottom-dashed"
                  >
                    <div class="d-flex gap-3 align-items-start">
                      <span class="fs-4 fw-bold text-danger opacity-75 font-monospace" style="line-height: 1;">
                        0{{ index + 1 }}
                      </span>
                      <div class="flex-grow-1">
                        <span v-if="post.category_name" class="badge bg-light text-secondary border px-1.5 py-0.5 small mb-1" style="font-size: 0.68rem;">
                          {{ post.category_name }}
                        </span>
                        <h6 class="mb-1" style="font-size: 0.88rem; line-height: 1.35;">
                          <AtomLink :to="post.url" class="text-dark fw-semibold text-decoration-none hover-danger">
                            {{ post.title }}
                          </AtomLink>
                        </h6>
                        <small v-if="post.author_name" class="text-muted d-block" style="font-size: 0.75rem;">
                          Por: {{ post.author_name }}
                        </small>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Widget: Banner de Especialización Escuela de Negocios ESAN -->
            <div class="card bg-dark text-white border-0 shadow rounded-3 overflow-hidden mb-4 position-relative">
              <div class="card-body p-4 position-relative z-1">
                <span class="badge bg-danger text-white text-uppercase px-2 py-1 mb-2 fw-bold" style="font-size: 0.7rem;">
                  Educación Ejecutiva
                </span>
                <h5 class="fw-bold text-white mb-2">
                  Especialízate en la Escuela de Negocios de ESAN
                </h5>
                <p class="text-white-50 small mb-3">
                  Accede a programas de vanguardia, maestrías internacionales y diplomas dictados por nuestra prestigiosa plana docente.
                </p>
                <div class="d-grid gap-2">
                  <AtomLink to="/escuela-de-negocios/maestrias/" class="btn btn-danger btn-sm fw-bold">
                    Explorar Maestrías <i class="las la-graduation-cap ms-1"></i>
                  </AtomLink>
                  <AtomLink to="/escuela-de-negocios/diplomas/" class="btn btn-outline-light btn-sm fw-semibold">
                    Ver Diplomas y PEE <i class="las la-certificate ms-1"></i>
                  </AtomLink>
                </div>
              </div>
              <!-- Acento estético de fondo -->
              <div class="position-absolute end-0 bottom-0 opacity-10 p-3 pointer-events-none">
                <i class="las la-university" style="font-size: 140px;"></i>
              </div>
            </div>

            <!-- Widget: Categorías Populares -->
            <div class="card border shadow-sm">
              <div class="card-header bg-white border-bottom py-3">
                <h6 class="fw-bold text-dark m-0">
                  <i class="las la-folder text-danger me-1"></i> Categorías Populares
                </h6>
              </div>
              <div class="card-body p-3">
                <div class="d-flex flex-wrap gap-1.5">
                  <span class="badge bg-light text-dark border p-2 fw-normal hover-danger pointer">Finanzas</span>
                  <span class="badge bg-light text-dark border p-2 fw-normal hover-danger pointer">Economía</span>
                  <span class="badge bg-light text-dark border p-2 fw-normal hover-danger pointer">Marketing Digital</span>
                  <span class="badge bg-light text-dark border p-2 fw-normal hover-danger pointer">Gestión Pública</span>
                  <span class="badge bg-light text-dark border p-2 fw-normal hover-danger pointer">Tecnología y TI</span>
                  <span class="badge bg-light text-dark border p-2 fw-normal hover-danger pointer">Minería y Energía</span>
                  <span class="badge bg-light text-dark border p-2 fw-normal hover-danger pointer">Recursos Humanos</span>
                </div>
              </div>
            </div>

          </div>
        </aside>
      </div>

    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import AtomLink from '../../atoms/AtomLink.vue';
import { formatImageUrl } from '../../../helpers/url';

const props = defineProps<{
  pageData?: any;
  data?: any;
}>();

const rawData = computed(() => props.data || props.pageData || {});
const article = computed(() => {
  const p = rawData.value;
  return {
    title: p.title || 'Artículo de Opinión',
    slug: p.slug || '',
    excerpt: p.excerpt || '',
    body: p.body,
    featured_image: p.featured_image || p.featured_image_path || '',
    published_at: p.published_at || p.created_at || '',
    views_count: p.views_count || 1,
    categories: p.categories || [],
    category_name: p.category_name || (p.categories?.[0]?.name) || 'Opinión y Coyuntura',
    author: p.author || null,
    related_posts: p.related_posts || []
  };
});

// Autor
const author = computed(() => article.value.author || {});
const authorName = computed(() => author.value.name || 'Docente Conexión ESAN');
const authorSlug = computed(() => author.value.slug || '');
const authorPosition = computed(() => author.value.position || 'Profesor de Posgrado de la Universidad ESAN');
const authorBio = computed(() => author.value.bio || '');
const authorUrl = computed(() => authorSlug.value ? `/conexion-esan/autor/${authorSlug.value}/` : '/conexion-esan/');

const authorAvatar = computed(() => {
  if (author.value.photo_url) return formatImageUrl(author.value.photo_url);
  return `https://ui-avatars.com/api/?background=e31140&color=fff&name=${encodeURIComponent(authorName.value)}`;
});

const handleAvatarError = (e: any) => {
  e.target.src = `https://ui-avatars.com/api/?background=e31140&color=fff&name=${encodeURIComponent(authorName.value)}`;
};

// Portada
const coverImage = computed(() => {
  if (article.value.featured_image) {
    return formatImageUrl(article.value.featured_image);
  }
  // Fallback a imagen corporativa editorial de alta calidad
  return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop';
});

const handleCoverError = (e: any) => {
  e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop';
};

const coverCaption = computed(() => {
  return `Análisis económico y coyuntural por ${authorName.value} para Conexión ESAN.`;
});

// Categorías
const categoryName = computed(() => article.value.category_name || 'Economía y Negocios');
const articleCategories = computed(() => {
  if (Array.isArray(article.value.categories) && article.value.categories.length > 0) {
    return article.value.categories;
  }
  return [{ id: 1, name: categoryName.value, slug: 'economia' }];
});

// Fecha formateada
const formattedDate = computed(() => {
  const d = article.value.published_at;
  if (!d) return 'Reciente';
  try {
    return new Date(d).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return 'Reciente';
  }
});

// Tiempo de lectura estimado
const readingTime = computed(() => {
  const words = (article.value.title.length + (article.value.excerpt?.length || 0) * 5);
  return Math.max(3, Math.ceil(words / 150));
});

// Contenido HTML real
const hasRealContent = computed(() => {
  const b = article.value.body;
  if (!b) return false;
  if (typeof b === 'string') {
    return b.trim().length > 30;
  }
  if (typeof b === 'object') {
    return Boolean(b.content_paragraph_1 || b.content_paragraph_2 || b.richTextContent || b.plainHtml);
  }
  return false;
});

const renderedHtmlContent = computed(() => {
  const b = article.value.body;
  if (!b) return '';
  if (typeof b === 'string') {
    if (b.startsWith('{')) {
      try {
        const parsed = JSON.parse(b);
        return [parsed.content_paragraph_1, parsed.content_paragraph_2, parsed.richTextContent].filter(Boolean).join('');
      } catch {
        return b;
      }
    }
    return b;
  }
  return [b.content_paragraph_1, b.content_paragraph_2, b.richTextContent, b.plainHtml].filter(Boolean).join('');
});

// Bio extract
const authorBioSnippet = computed(() => {
  const raw = authorBio.value.replace(/<[^>]+>/g, '').trim();
  if (raw.length <= 180) return raw;
  return raw.slice(0, 180) + '...';
});

// Artículos para el Sidebar
const sidebarArticles = computed(() => {
  const posts = article.value.related_posts;
  if (Array.isArray(posts) && posts.length > 0) {
    return posts.slice(0, 5);
  }
  return [];
});

// Compartir en redes
const currentUrl = ref('');
onMounted(() => {
  if (typeof window !== 'undefined') {
    currentUrl.value = window.location.href;
  }
});

const shareUrls = computed(() => {
  const url = encodeURIComponent(currentUrl.value || 'https://www.esan.edu.pe');
  const title = encodeURIComponent(article.value.title);
  return {
    whatsapp: `https://api.whatsapp.com/send?text=${title}%20${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`
  };
});

// Copiar enlace
const copied = ref(false);
const copyArticleLink = async () => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(currentUrl.value || window.location.href);
      copied.value = true;
      setTimeout(() => { copied.value = false; }, 2500);
    } catch (e) {}
  }
};

// Buscador sidebar
const searchQuery = ref('');
const handleSearch = () => {
  if (searchQuery.value.trim() && typeof window !== 'undefined') {
    window.location.href = `/conexion-esan/?q=${encodeURIComponent(searchQuery.value.trim())}`;
  }
};
</script>

<style scoped>
.hover-danger:hover {
  color: #e31140 !important;
  text-decoration: underline !important;
}

.article-title {
  font-size: clamp(1.85rem, 3.2vw, 2.65rem);
  line-height: 1.24;
  letter-spacing: -0.02em;
  color: #111827;
}

.article-excerpt {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #4b5563;
}

.share-btn {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s ease;
}

.share-btn:hover {
  transform: translateY(-2px);
}

.border-bottom-dashed {
  border-bottom: 1px dashed #e5e7eb !important;
}

.editorial-quote {
  background-color: #f9fafb !important;
}

.letter-spacing-1 {
  letter-spacing: 0.08em;
}

.pointer {
  cursor: pointer;
}

.rich-editorial-content :deep(p) {
  font-size: 1.15rem;
  line-height: 1.85;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.rich-editorial-content :deep(h2),
.rich-editorial-content :deep(h3) {
  font-weight: 700;
  color: #111827;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.rich-editorial-content :deep(blockquote) {
  border-left: 4px solid #e31140;
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  font-style: italic;
  margin: 1.5rem 0;
}

.rich-editorial-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
}
</style>

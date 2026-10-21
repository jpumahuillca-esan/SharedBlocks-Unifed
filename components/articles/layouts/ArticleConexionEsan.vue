<template>
  <article class="blog-articulo">
    <!-- 1. Cabecera Responsiva para Móviles (page-top2) -->
    <div class="page-top2">
      <div class="container" style="max-width: 1240px;">
        <div class="row">
          <div class="col-12">
            <h1 class="page-title">{{ article.title }}</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Bloque Principal Superior (Título, Descripción, Autor, Compartir y Foto Portada) -->
    <div class="container" style="max-width: 1240px;">
      <!-- Breadcrumb institucional editorial -->
      <nav class="pt-3 pb-1" aria-label="breadcrumb">
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

      <div class="row align-items-start">
        <!-- Columna Izquierda: H1 Title, Descripción, Autor, Redes -->
        <div class="col-lg-8">
          <h1 id="title">{{ article.title }}</h1>

          <div class="descripcion" v-if="article.excerpt">
            <p>{{ article.excerpt }}</p>
          </div>

          <p class="author">
            Por:
            <AtomLink v-if="authorSlug" :to="authorUrl" class="fw-bold">
              {{ authorName }}
            </AtomLink>
            <span v-else class="fw-bold">{{ authorName }}</span>
            el {{ formattedDate }}
          </p>

          <p class="genits-redes-nav">
            <span>Compartir en:</span>
            
            <!-- Facebook -->
            <a
              :href="shareUrls.facebook"
              target="_blank"
              rel="noopener noreferrer"
              class="share-btn share-facebook"
              title="Compartir en Facebook"
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="#1877f2">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>

            <!-- LinkedIn -->
            <a
              :href="shareUrls.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="share-btn share-linkedin"
              title="Compartir en LinkedIn"
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="#0077b5">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 1 0-.01-3.38 1.69 1.69 0 0 0 .01 3.38m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
              </svg>
            </a>

            <!-- Twitter / X -->
            <a
              :href="shareUrls.twitter"
              target="_blank"
              rel="noopener noreferrer"
              class="share-btn share-twitter"
              title="Compartir en Twitter / X"
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="#000000">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            <!-- WhatsApp -->
            <a
              :href="shareUrls.whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              class="share-btn share-whatsapp"
              title="Compartir en WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="#25D366">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m-3.53 4.75c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.89 1.21 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.08-.13-.27-.2-.57-.35-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01"/>
              </svg>
            </a>
          </p>
        </div>

        <!-- Columna Derecha: Portada (imagen1) -->
        <div class="col-lg-4">
          <figure id="imagen1">
            <img
              :src="coverImage"
              :alt="article.title"
              class="img-fluid"
              @error="handleCoverError"
            />
          </figure>
        </div>
      </div>
    </div>

    <!-- 3. Segundo Contenido: Cuerpo del Artículo (Izquierda) + Cuadro de Autor & Programas (Derecha) -->
    <div class="segundo-contenido">
      <div class="container" style="max-width: 1240px;">
        <div class="row">
          <!-- CUERPO PRINCIPAL DEL ARTÍCULO (HTML Editorial) -->
          <div class="col-lg-8">
            <div
              v-if="hasRealContent"
              class="genits-html-content"
              v-html="renderedHtmlContent"
            ></div>

            <!-- Fallback ilustrativo si aún no se ha scrapeado el body completo -->
            <div v-else class="genits-html-content fallback-demo-body">
              <p class="lead">
                {{ article.excerpt }}
              </p>
              <p>
                La coyuntura actual exige un análisis profundo de los factores económicos, regulatorios y sociales que inciden directamente en las decisiones directivas y la sostenibilidad de las organizaciones en el Perú y la región.
              </p>
              <h2>Desafíos y Oportunidades Clave</h2>
              <p>
                En este contexto, la innovación en la gestión y la optimización de procesos representan ventajas competitivas determinantes. Los líderes ejecutivos deben anticipar escenarios y fortalecer sus capacidades estratégicas.
              </p>
              <p>
                La formación continua y el aprendizaje práctico constituyen el pilar fundamental para liderar con éxito en entornos dinámicos y de alta incertidumbre.
              </p>
            </div>
          </div>

          <!-- SIDEBAR: CUADRO2 (AUTOR + BIO BULLETS + PROGRAMAS DOCENTE) -->
          <div class="col-lg-4">
            <div class="cuadro2" v-if="authorName">
              <!-- Foto circular del autor -->
              <div
                :alt="authorName"
                :style="{ backgroundImage: `url('${authorAvatar}')` }"
                class="img-profesor-articulo"
              ></div>

              <!-- Nombre del autor -->
              <p id="profe-title">
                <AtomLink v-if="authorSlug" :to="authorUrl">
                  {{ authorName }}
                </AtomLink>
                <span v-else>{{ authorName }}</span>
              </p>

              <!-- Biografía en lista de viñetas (parrafo) -->
              <div id="parrafo" v-html="authorBioFormatted"></div>

              <!-- Lista de Programas Académicos donde es Docente (cuandro-interno) -->
              <div class="cuandro-interno" v-if="authorPrograms && authorPrograms.length > 0">
                <ul>
                  <li v-for="prog in authorPrograms" :key="prog.id || prog.slug">
                    Docente en
                    <AtomLink :to="prog.url || `/escuela-de-negocios/${prog.slug}/`">
                      {{ prog.name }}
                    </AtomLink>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Artículos Más Leídos / Relacionados de Conexión ESAN -->
            <div class="related-widget mt-4" v-if="sidebarArticles.length > 0">
              <div class="card border shadow-sm">
                <div class="card-header bg-white border-bottom py-3">
                  <h6 class="fw-bold text-dark m-0 d-flex align-items-center">
                    <i class="las la-chart-line text-danger me-2 fs-18"></i>
                    Lo Más Leído en Conexión ESAN
                  </h6>
                </div>
                <div class="card-body p-0">
                  <ul class="list-group list-group-flush">
                    <li
                      v-for="(post, idx) in sidebarArticles"
                      :key="post.id || idx"
                      class="list-group-item p-3 border-bottom"
                    >
                      <AtomLink
                        :to="post.url"
                        class="text-decoration-none text-dark hover-danger fw-semibold small d-block mb-1 lh-sm"
                      >
                        {{ post.title }}
                      </AtomLink>
                      <span class="text-muted text-uppercase fw-bold" style="font-size: 11px;" v-if="post.author_name">
                        <i class="las la-pen text-danger me-1"></i> {{ post.author_name }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    published_at: p.published_at || p.created_at || p.start_date || '',
    views_count: p.views_count || 1,
    categories: p.categories || [],
    category_name: p.category_name || (p.categories?.[0]?.name) || 'Opinión y Coyuntura',
    author: p.author || null,
    related_posts: p.related_posts || []
  };
});

// Autor
const author = computed(() => article.value.author || {});
const authorName = computed(() => author.value.name || author.value.full_name || 'Docente Conexión ESAN');
const authorSlug = computed(() => author.value.slug || '');
const authorBio = computed(() => author.value.bio || '');
const authorUrl = computed(() => authorSlug.value ? `/conexion-esan/autor/${authorSlug.value}/` : '/conexion-esan/');

// Foto de avatar del autor
const authorAvatar = computed(() => {
  if (author.value.photo_url) return formatImageUrl(author.value.photo_url);
  if (author.value.portrait_photo_url) return formatImageUrl(author.value.portrait_photo_url);
  return `https://ui-avatars.com/api/?background=e31140&color=fff&name=${encodeURIComponent(authorName.value)}`;
});

// Formato de biografía en lista de viñetas exacta
const authorBioFormatted = computed(() => {
  const bio = authorBio.value;
  if (!bio) {
    return '<ul><li>Profesor e investigador de la Universidad ESAN con amplia trayectoria académica y ejecutiva.</li></ul>';
  }
  if (bio.includes('<ul>') || bio.includes('<li>')) {
    return bio;
  }
  // Si viene en texto plano con saltos de línea o puntos
  const clean = bio.replace(/<[^>]+>/g, '').trim();
  const points = clean.split('\n').map(s => s.trim()).filter(s => s.length > 5);
  if (points.length > 0) {
    return '<ul>' + points.map(p => `<li>${p.replace(/^[•\-\*]\s*/, '')}</li>`).join('') + '</ul>';
  }
  return `<ul><li>${clean}</li></ul>`;
});

// Programas en los que es docente el autor
const authorPrograms = computed(() => {
  const progs = author.value.programs;
  if (Array.isArray(progs) && progs.length > 0) {
    return progs;
  }
  return [];
});

// Portada del artículo
const coverImage = computed(() => {
  if (article.value.featured_image) {
    return formatImageUrl(article.value.featured_image);
  }
  return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop';
});

const handleCoverError = (e: any) => {
  e.target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop';
};

// Categoría
const categoryName = computed(() => article.value.category_name || 'Salud y Transformación Digital');

// Fecha formateada (ej: "19 Octubre 2026")
const formattedDate = computed(() => {
  const d = article.value.published_at;
  if (!d) return 'Reciente';
  try {
    const dateObj = new Date(d);
    const day = dateObj.getDate();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return 'Reciente';
  }
});

// Detección y renderizado de HTML del artículo
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
  let b = article.value.body;
  if (!b) return '';
  if (typeof b === 'string') {
    let clean = b.trim();
    if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
      try {
        const unescaped = JSON.parse(clean);
        if (typeof unescaped === 'string') clean = unescaped;
      } catch {}
    }
    if (clean.startsWith('{')) {
      try {
        const parsed = JSON.parse(clean);
        return [parsed.content_paragraph_1, parsed.content_paragraph_2, parsed.richTextContent].filter(Boolean).join('');
      } catch {
        return clean;
      }
    }
    return clean;
  }
  return [b.content_paragraph_1, b.content_paragraph_2, b.richTextContent, b.plainHtml].filter(Boolean).join('');
});

// Artículos para el Sidebar
const sidebarArticles = computed(() => {
  const posts = article.value.related_posts;
  if (Array.isArray(posts) && posts.length > 0) {
    return posts.slice(0, 5);
  }
  return [];
});

// URLs para compartir
const currentUrl = ref('');
onMounted(() => {
  if (typeof window !== 'undefined') {
    currentUrl.value = window.location.href;
  }
});

const shareUrls = computed(() => {
  const url = encodeURIComponent(currentUrl.value || 'https://www.esan.edu.pe');
  const title = encodeURIComponent(article.value.title || 'Conexión ESAN');
  const excerpt = encodeURIComponent(article.value.excerpt || '');

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${excerpt}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    whatsapp: `https://wa.me/?text=${title}%20${url}`
  };
});
</script>

<style scoped>
/* ==========================================================================
   CSS EXACTO DE DETALLE DE CONEXIÓN ESAN (Basado en detalle.css de ESAN)
   ========================================================================== */
.blog-articulo {
  background-color: #ffffff;
  padding-bottom: 60px;
  color: #2b2b2b;
}

/* Título principal de la columna izquierda */
h1#title {
  font-weight: 700;
  color: #000000;
  font-size: 2.2rem;
  padding-top: 30px;
  line-height: 1.25;
  margin-bottom: 20px;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Párrafo de descripción / lead */
.descripcion {
  font-size: 16px;
  margin-top: 20px;
  margin-bottom: 20px;
  line-height: 1.6;
  color: #333333;
}

.descripcion :deep(a) {
  color: #cf0f11;
  text-decoration: underline;
}

/* Línea de autor y fecha */
.author {
  color: #000000;
  font-size: 18px;
  margin-top: 25px;
  margin-bottom: 20px;
}

.author :deep(a) {
  color: #CF0F11;
  text-decoration: none;
}

.author :deep(a:hover) {
  text-decoration: underline;
}

/* Redes sociales */
.blog-articulo .genits-redes-nav {
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  margin-bottom: 30px;
}

.blog-articulo .genits-redes-nav span {
  font-size: 15px;
  font-weight: 600;
  color: #444444;
}

.blog-articulo .genits-redes-nav a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.blog-articulo .genits-redes-nav a:hover {
  transform: scale(1.12);
}

/* Imagen de portada en la columna derecha superior */
#imagen1 {
  position: relative;
  text-align: right;
  margin-top: 30px;
}

#imagen1 img {
  border-radius: 8px;
  max-width: 100%;
  height: auto;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

/* Bloque inferior */
.segundo-contenido {
  margin-top: 30px;
  margin-bottom: 50px;
}

/* Contenido HTML del artículo */
.genits-html-content {
  font-size: 17px;
  line-height: 1.8;
  color: #2b2b2b;
}

.genits-html-content :deep(p) {
  margin-bottom: 1.35rem;
}

.genits-html-content :deep(h2) {
  font-size: 1.45rem;
  font-weight: 700;
  color: #111111;
  margin-top: 35px;
  margin-bottom: 15px;
  line-height: 1.3;
}

.genits-html-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 700;
  color: #222222;
  margin-top: 28px;
  margin-bottom: 12px;
}

.genits-html-content :deep(ul) {
  padding-left: 24px;
  margin-bottom: 1.5rem;
}

.genits-html-content :deep(ul li) {
  margin-bottom: 10px;
  line-height: 1.65;
}

.genits-html-content :deep(a) {
  color: #CF0F11;
  text-decoration: underline;
}

/* ==========================================================================
   CUADRO 2: TARJETA DE AUTOR & DOCENTE ESAN
   ========================================================================== */
.cuadro2 {
  margin-top: 0;
  padding: 35px 28px;
  border-radius: 10px;
  border: solid 1px #979797;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.img-profesor-articulo {
  width: 125px;
  height: 125px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0 auto 16px auto;
  border: 1px solid #dcdcdc;
}

#profe-title {
  color: #CF0F11;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  margin-bottom: 16px;
}

#profe-title :deep(a) {
  color: #CF0F11;
  text-decoration: none;
}

#profe-title :deep(a:hover) {
  text-decoration: underline;
}

#parrafo {
  font-size: 13.5px;
  line-height: 1.55;
  color: #444444;
}

#parrafo :deep(ul) {
  padding-left: 18px;
  margin: 0;
}

#parrafo :deep(ul li) {
  margin-bottom: 8px;
}

/* Programas académicos vinculados al autor */
.cuandro-interno {
  padding-top: 25px;
  margin-top: 20px;
  width: 100%;
  border-top: solid 1px #979797;
  font-size: 13.5px;
}

.cuandro-interno ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cuandro-interno ul li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 9px;
  line-height: 1.45;
}

.cuandro-interno ul li:before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 6px;
  width: 5px;
  height: 8px;
  border-radius: 2px;
  background-color: #CF0F11;
}

.cuandro-interno :deep(a) {
  color: #CF0F11;
  text-decoration: underline;
}

.cuandro-interno :deep(a:hover) {
  color: #9e0b0d;
}

/* ==========================================================================
   CABECERA MÓVIL
   ========================================================================== */
.page-top2 {
  display: none;
}

@media (max-width: 959px) {
  .page-top2 {
    display: block;
    background-color: #f8f9fa;
    padding: 24px 0 16px 0;
    border-bottom: 1px solid #e9ecef;
  }

  #imagen1 {
    display: none;
  }

  h1.page-title {
    padding: 10px 0;
    font-size: 24px !important;
    color: #000000 !important;
    font-weight: 700;
    line-height: 1.25;
  }

  #title {
    display: none;
  }

  .cuadro2 {
    margin-top: 30px;
  }
}
</style>

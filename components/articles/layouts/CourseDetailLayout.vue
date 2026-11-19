<template>
  <div class="course-detail-layout bg-light">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb" class="bg-light py-3 border-bottom">
      <div class="container">
        <ol class="breadcrumb mb-0 small">
          <li class="breadcrumb-item">
            <a href="/" class="text-decoration-none text-muted">Inicio</a>
          </li>
          <li v-if="course.unit_name && unitUrl" class="breadcrumb-item">
            <a :href="unitUrl" class="text-decoration-none text-muted">{{ course.unit_name }}</a>
          </li>
          <li v-if="course.category_name" class="breadcrumb-item text-muted">
            {{ course.category_name }}
          </li>
          <li v-else-if="course.program_name" class="breadcrumb-item text-muted">
            {{ course.program_name }}
          </li>
          <li class="breadcrumb-item active text-danger fw-semibold" aria-current="page">
            {{ course.title }}
          </li>
        </ol>
      </div>
    </nav>

    <!-- Hero / Cabecera del Curso o Titulación -->
    <header class="py-5 bg-light border-bottom">
      <div class="container">
        <div class="row align-items-center g-4">
          <div class="col-lg-8">
            <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
              <span class="badge bg-danger text-white text-uppercase px-3 py-2">
                {{ typeLabel }}
              </span>
              <span v-if="course.category_name" class="badge bg-light text-dark border px-3 py-2">
                {{ course.category_name }}
              </span>
              <span v-if="course.program_name" class="badge bg-light text-dark border px-3 py-2">
                {{ course.program_name }}
              </span>
            </div>

            <h1 class="display-6 fw-bold text-dark mb-3">{{ course.title }}</h1>

            <p v-if="course.excerpt" class="lead text-secondary mb-4">
              {{ course.excerpt }}
            </p>

            <div class="d-flex flex-wrap gap-3 small text-dark">
              <div v-if="course.modality" class="px-3 py-2 rounded border bg-light d-flex align-items-center gap-2">
                <i class="las la-laptop text-danger fs-5"></i>
                <div>
                  <div class="text-muted" style="font-size: 0.72rem;">Modalidad</div>
                  <div class="fw-bold">{{ course.modality }}</div>
                </div>
              </div>

              <div v-if="course.duration_label || course.hours" class="px-3 py-2 rounded border bg-light d-flex align-items-center gap-2">
                <i class="las la-clock text-danger fs-5"></i>
                <div>
                  <div class="text-muted" style="font-size: 0.72rem;">Duración</div>
                  <div class="fw-bold">{{ course.duration_label || `${course.hours} horas` }}</div>
                </div>
              </div>

              <div v-if="course.start_date" class="px-3 py-2 rounded border bg-light d-flex align-items-center gap-2">
                <i class="las la-calendar-check text-danger fs-5"></i>
                <div>
                  <div class="text-muted" style="font-size: 0.72rem;">Inicio</div>
                  <div class="fw-bold">{{ course.start_date }}</div>
                </div>
              </div>

              <div v-if="course.schedule_text" class="px-3 py-2 rounded border bg-light d-flex align-items-center gap-2">
                <i class="las la-calendar-alt text-danger fs-5"></i>
                <div>
                  <div class="text-muted" style="font-size: 0.72rem;">Horario</div>
                  <div class="fw-bold">{{ course.schedule_text }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="card border shadow-sm bg-light rounded-4 p-4">
              <h5 class="fw-bold text-dark mb-2">¿Deseas más información?</h5>
              <p class="text-muted small mb-3">
                Recibe asesoría personalizada sobre fechas de inicio, inversión y proceso de inscripción.
              </p>

              <a
                v-if="course.syllabus_path"
                :href="course.syllabus_path"
                target="_blank"
                rel="noopener"
                class="btn btn-outline-danger w-100 fw-bold mb-2"
              >
                <i class="las la-file-pdf me-1"></i> Descargar Brochure / Sílabo
              </a>

              <a href="#solicitar-informacion" class="btn btn-danger w-100 fw-bold">
                <i class="las la-paper-plane me-1"></i> Solicitar Información
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido Estructurado Principal -->
    <section class="py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-8">
            <div v-if="course.description" class="card border-0 shadow-sm bg-light rounded-4 p-4 mb-4">
              <h3 class="h5 fw-bold text-dark mb-3">Presentación</h3>
              <div class="text-secondary" style="white-space: pre-line; line-height: 1.7;" v-html="course.description"></div>
            </div>

            <div
              v-if="course.audience_target || (course.requirements_json && course.requirements_json.length > 0)"
              class="card border-0 shadow-sm bg-light rounded-4 p-4 mb-4"
            >
              <h3 class="h5 fw-bold text-dark mb-3">
                {{ course.course_type === 'titulacion' ? 'Requisitos y Modalidad de Titulación' : 'Dirigido a / Requisitos' }}
              </h3>
              <p v-if="course.audience_target" class="text-secondary mb-3" style="white-space: pre-line;">
                {{ course.audience_target }}
              </p>
              <ul v-if="course.requirements_json && course.requirements_json.length > 0" class="mb-0 text-secondary">
                <li v-for="(req, idx) in course.requirements_json" :key="idx" class="mb-1">
                  {{ typeof req === 'string' ? req : req.text || req.title }}
                </li>
              </ul>
            </div>

            <div
              v-if="course.syllabus_json && course.syllabus_json.length > 0"
              class="card border-0 shadow-sm bg-light rounded-4 p-4 mb-4"
            >
              <h3 class="h5 fw-bold text-dark mb-3"> Estructura y Contenido</h3>
              <div class="d-flex flex-column gap-3">
                <div
                  v-for="(mod, idx) in course.syllabus_json"
                  :key="idx"
                  class="p-3 rounded-3 border bg-light"
                >
                  <div class="fw-bold text-dark mb-1">
                    {{ mod.title || `Módulo ${Number(idx) + 1}` }}
                  </div>
                  <div v-if="mod.content || mod.description" class="small text-secondary" style="white-space: pre-line;">
                    {{ mod.content || mod.description }}
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="course.instructors && course.instructors.length > 0"
              class="card border-0 shadow-sm bg-light rounded-4 p-4 mb-4"
            >
              <h3 class="h5 fw-bold text-dark mb-3">Plana Docente</h3>
              <div class="row g-3">
                <div v-for="inst in course.instructors" :key="inst.id" class="col-md-6">
                  <div class="p-3 rounded-3 border bg-light h-100 d-flex align-items-center gap-3">
                    <img
                      v-if="inst.photo_url"
                      :src="inst.photo_url"
                      :alt="inst.full_name"
                      class="rounded-circle object-fit-cover"
                      style="width: 56px; height: 56px;"
                    />
                    <div>
                      <div class="fw-bold text-dark">{{ inst.full_name }}</div>
                      <div v-if="inst.position_name || inst.academic_degree" class="small text-muted">
                        {{ inst.position_name || inst.academic_degree }}
                      </div>
                      <a
                        v-if="inst.profile_url"
                        :href="inst.profile_url"
                        class="small text-danger text-decoration-none fw-semibold"
                      >
                        Ver perfil →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Relacionados -->
          <div class="col-lg-4">
            <div
              v-if="course.related_courses && course.related_courses.length > 0"
              class="card border-0 shadow-sm bg-light rounded-4 p-4"
            >
              <h4 class="h6 fw-bold text-dark text-uppercase mb-3">Oferta Relacionada</h4>
              <div class="d-flex flex-column gap-3">
                <a
                  v-for="rel in course.related_courses"
                  :key="rel.id"
                  :href="rel.url"
                  class="p-3 rounded-3 border bg-light text-decoration-none d-block"
                >
                  <div class="small text-danger fw-semibold mb-1">
                    {{ rel.category_name || typeLabel }}
                  </div>
                  <div class="fw-bold text-dark small mb-1">{{ rel.title }}</div>
                  <div v-if="rel.modality || rel.duration_label" class="text-muted" style="font-size: 0.75rem;">
                    {{ [rel.modality, rel.duration_label].filter(Boolean).join(' · ') }}
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Secciones Adicionales del Page Builder (Modelo Híbrido) -->
    <div id="solicitar-informacion">
      <PageSections v-if="blocks && blocks.length > 0" :content="blocks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PageSections from '../../layout/PageSections.vue';

const props = defineProps<{
  course: Record<string, any>;
  blocks?: any[];
}>();

const typeLabel = computed(() => {
  const labels: Record<string, string> = {
    curso: 'Curso Especializado',
    taller: 'Taller Práctico',
    certificacion: 'Certificación Internacional',
    idioma: 'Programa de Idiomas',
    titulacion: 'Programa de Titulación',
  };
  return labels[props.course?.course_type] || 'Programa Académico';
});

const unitUrl = computed(() => {
  const full = props.course?.unit_full_slug;
  if (!full || full === 'main/') return '/';
  return `/${String(full).replace(/^\/+|\/+$/g, '')}/`;
});
</script>

/**
 * Catálogo curado de íconos Lucide con etiquetas y palabras clave en español.
 *
 * Todos los ítems aquí listados están importados de forma síncrona en AtomIcon.vue
 * para que rendericen instantáneamente en SSR y en el navegador. Además, EditorIcon
 * permite alternar a toda la librería de @lucide/vue (~1,800 íconos) cuando se necesite
 * uno específico.
 */

export type IconCategory =
  | 'Educación'
  | 'Negocios'
  | 'Tecnología'
  | 'Comunicación'
  | 'Interfaz';

export interface IconCatalogItem {
  name: string;
  label: string;
  category: IconCategory;
  keywords: string;
}

export const ICON_CATEGORIES: Array<'Todas' | IconCategory> = [
  'Todas',
  'Educación',
  'Negocios',
  'Tecnología',
  'Comunicación',
  'Interfaz',
];

export const ICON_CATALOG: IconCatalogItem[] = [
  // Educación y Academia
  { name: 'graduation-cap', label: 'Birrete / Graduación', category: 'Educación', keywords: 'egresado carrera pregrado posgrado titulo universidad alumno estudiante' },
  { name: 'book-open', label: 'Libro abierto / Estudio', category: 'Educación', keywords: 'curso lectura programa syllabus temario aprender' },
  { name: 'book', label: 'Libro', category: 'Educación', keywords: 'manual curso biblioteca materia' },
  { name: 'library', label: 'Biblioteca', category: 'Educación', keywords: 'libros archivos facultad recursos' },
  { name: 'school', label: 'Campus / Escuela', category: 'Educación', keywords: 'universidad facultad edificio sede aulas' },
  { name: 'university', label: 'Universidad / Rectorado', category: 'Educación', keywords: 'esan academia institucional campus' },
  { name: 'award', label: 'Medalla / Reconocimiento', category: 'Educación', keywords: 'premio acreditacion diploma excelencia logro certificado' },
  { name: 'badge-check', label: 'Insignia verificada', category: 'Educación', keywords: 'certificacion acreditacion oficial sello aprobado' },
  { name: 'trophy', label: 'Trofeo / Excelencia', category: 'Educación', keywords: 'ranking primer puesto ganador merito' },
  { name: 'notebook-pen', label: 'Cuaderno y notas', category: 'Educación', keywords: 'apuntes taller clases practicas ejercicios' },
  { name: 'presentation', label: 'Presentación / Pizarra', category: 'Educación', keywords: 'charla ponencia seminario clase exposicion' },
  { name: 'brain', label: 'Conocimiento / Estrategia', category: 'Educación', keywords: 'inteligencia habilidades blandas pensamiento analisis' },
  { name: 'lightbulb', label: 'Idea / Innovación', category: 'Educación', keywords: 'creatividad emprendimiento solucion taller' },
  { name: 'atom', label: 'Ciencia / Investigación', category: 'Educación', keywords: 'stem fisica quimica laboratorio investigacion' },
  { name: 'microscope', label: 'Laboratorio / Análisis', category: 'Educación', keywords: 'investigacion ciencia prueba medicina estudio' },
  { name: 'stethoscope', label: 'Salud / Medicina', category: 'Educación', keywords: 'clinica doctor salud psicologia' },
  { name: 'scale', label: 'Derecho / Justicia', category: 'Educación', keywords: 'leyes balanza legal abogacia normativa' },
  { name: 'bookmark', label: 'Marcador / Destacado', category: 'Educación', keywords: 'guardar favorito guia lectura' },

  // Negocios y Liderazgo
  { name: 'briefcase', label: 'Maletín / Empleo', category: 'Negocios', keywords: 'trabajo profesional empresa carrera laboral ejecutivos' },
  { name: 'briefcase-business', label: 'Negocios / Gerencia', category: 'Negocios', keywords: 'administracion empresa corporativo ejecutivo' },
  { name: 'building-2', label: 'Empresa / Corporativo', category: 'Negocios', keywords: 'organizacion oficina edificio convenio' },
  { name: 'building', label: 'Oficina / Edificio', category: 'Negocios', keywords: 'sede corporativo institucional' },
  { name: 'landmark', label: 'Institución / Finanzas', category: 'Negocios', keywords: 'banco gobierno economia estado' },
  { name: 'handshake', label: 'Alianza / Convenio', category: 'Negocios', keywords: 'acuerdo empresas socios networking empleo' },
  { name: 'trending-up', label: 'Crecimiento / Éxito', category: 'Negocios', keywords: 'finanzas ventas mejora ascenso proyeccion' },
  { name: 'bar-chart-3', label: 'Gráfico de barras', category: 'Negocios', keywords: 'analitica estadisticas kpi metricas datos' },
  { name: 'pie-chart', label: 'Gráfico circular', category: 'Negocios', keywords: 'reporte porcentaje finanzas mercado' },
  { name: 'target', label: 'Objetivo / Meta', category: 'Negocios', keywords: 'estrategia alcance foco dirigido a' },
  { name: 'rocket', label: 'Impulso / Emprendimiento', category: 'Negocios', keywords: 'startup lanzamiento acelerar carrera innovacion' },
  { name: 'crown', label: 'Liderazgo / Premium', category: 'Negocios', keywords: 'excelencia top ejecutivos directivos' },
  { name: 'coins', label: 'Finanzas / Inversión', category: 'Negocios', keywords: 'dinero costos becas presupuesto economia' },
  { name: 'wallet', label: 'Pagos / Matrícula', category: 'Negocios', keywords: 'billetera tarifa inversion pension' },
  { name: 'credit-card', label: 'Tarjeta / Pago en línea', category: 'Negocios', keywords: 'inscripcion compra cuota financiamiento' },
  { name: 'percent', label: 'Descuento / Beca', category: 'Negocios', keywords: 'porcentaje tasa beneficio promocion' },
  { name: 'users', label: 'Equipo / Comunidad', category: 'Negocios', keywords: 'personas grupo networking alumnos egresados' },
  { name: 'users-round', label: 'Personas / Grupo', category: 'Negocios', keywords: 'colaboradores equipo taller' },
  { name: 'user', label: 'Persona / Perfil', category: 'Negocios', keywords: 'individual alumno postulante usuario' },
  { name: 'user-check', label: 'Postulante admitido', category: 'Negocios', keywords: 'perfil validado egresado aprobado' },
  { name: 'user-plus', label: 'Nuevo alumno / Registro', category: 'Negocios', keywords: 'inscripcion admision sumar contacto' },
  { name: 'heart-handshake', label: 'Responsabilidad / Apoyo', category: 'Negocios', keywords: 'mentoria sostenibilidad bienestar social' },
  { name: 'leaf', label: 'Sostenibilidad / Verde', category: 'Negocios', keywords: 'ecologia impacto ambiental esg' },

  // Tecnología e Innovación
  { name: 'laptop', label: 'Laptop / Modalidad virtual', category: 'Tecnología', keywords: 'computadora online elearning remoto curso digital' },
  { name: 'monitor', label: 'Computadora / Pantalla', category: 'Tecnología', keywords: 'escritorio plataforma web sistemas' },
  { name: 'smartphone', label: 'Celular / App móvil', category: 'Tecnología', keywords: 'telefono whatsapp contacto movil' },
  { name: 'tablet', label: 'Tablet / Dispositivo', category: 'Tecnología', keywords: 'digital pantalla portable' },
  { name: 'cpu', label: 'Inteligencia Artificial / TI', category: 'Tecnología', keywords: 'tecnologia procesador ingenieria software datos' },
  { name: 'code-2', label: 'Programación / Código', category: 'Tecnología', keywords: 'desarrollo software ingenieria web tech' },
  { name: 'database', label: 'Base de datos / Analytics', category: 'Tecnología', keywords: 'data science big data sql nube' },
  { name: 'cloud', label: 'Nube / Plataforma cloud', category: 'Tecnología', keywords: 'internet servidor almacenamiento virtual' },
  { name: 'wifi', label: 'Conectividad / Online', category: 'Tecnología', keywords: 'senial internet en linea clases virtuales' },
  { name: 'layers', label: 'Módulos / Arquitectura', category: 'Tecnología', keywords: 'niveles etapas estructura malla' },
  { name: 'sliders-horizontal', label: 'Configuración / Ajuste', category: 'Tecnología', keywords: 'filtros opciones parametros personalizado' },
  { name: 'wrench', label: 'Herramientas prácticas', category: 'Tecnología', keywords: 'aplicado taller soporte tecnica' },
  { name: 'settings', label: 'Engranaje / Procesos', category: 'Tecnología', keywords: 'gestion automatizacion operaciones sistema' },
  { name: 'sparkles', label: 'IA / Destacado', category: 'Tecnología', keywords: 'brillo nuevo innovacion inteligencia artificial' },
  { name: 'zap', label: 'Rápido / Intensivo', category: 'Tecnología', keywords: 'energia agilidad rapido rayo flash' },

  // Comunicación, Ubicación y Tiempo
  { name: 'globe', label: 'Mundo / Internacional', category: 'Comunicación', keywords: 'global intercambio paises idiomas convenio' },
  { name: 'globe-2', label: 'Planeta / Global', category: 'Comunicación', keywords: 'internacionalizacion mundo red global' },
  { name: 'compass', label: 'Exploración / Orientación', category: 'Comunicación', keywords: 'guia vocacional rumbo mapa carrera' },
  { name: 'map-pin', label: 'Ubicación / Campus', category: 'Comunicación', keywords: 'direccion sede lima monterrico presencial' },
  { name: 'map', label: 'Mapa / Cobertura', category: 'Comunicación', keywords: 'alcance sedes global ubicacion' },
  { name: 'calendar', label: 'Calendario / Fechas', category: 'Comunicación', keywords: 'inicio cierre cronograma evento horario' },
  { name: 'clock', label: 'Reloj / Duración', category: 'Comunicación', keywords: 'tiempo horas horarios flexibilidad ritmo' },
  { name: 'phone', label: 'Teléfono', category: 'Comunicación', keywords: 'llamada contacto asesor central' },
  { name: 'phone-call', label: 'Llamada directa', category: 'Comunicación', keywords: 'asesoria atencion telefono contacto' },
  { name: 'mail', label: 'Correo electrónico', category: 'Comunicación', keywords: 'email mensaje contacto buzon' },
  { name: 'message-circle', label: 'Chat / Asesoría', category: 'Comunicación', keywords: 'whatsapp conversacion consulta duda' },
  { name: 'send', label: 'Enviar / Solicitar', category: 'Comunicación', keywords: 'avion papel envio formulario mensaje' },
  { name: 'share-2', label: 'Compartir / Red', category: 'Comunicación', keywords: 'networking redes sociales difundir' },
  { name: 'megaphone', label: 'Anuncio / Convocatoria', category: 'Comunicación', keywords: 'novedades publicidad evento comunicacion' },
  { name: 'newspaper', label: 'Noticias / Blog', category: 'Comunicación', keywords: 'articulo prensa publicacion conexion esan' },
  { name: 'video', label: 'Video / Videoconferencia', category: 'Comunicación', keywords: 'zoom grabacion clase online webinar' },
  { name: 'play', label: 'Reproducir', category: 'Comunicación', keywords: 'video multimedia iniciar ver' },
  { name: 'play-circle', label: 'Ver video / Historia', category: 'Comunicación', keywords: 'testimonio multimedia streaming' },
  { name: 'headphones', label: 'Audio / Soporte', category: 'Comunicación', keywords: 'atencion podcast clase audio' },
  { name: 'mic', label: 'Micrófono / Ponencia', category: 'Comunicación', keywords: 'charla podcast webinar conferencia' },
  { name: 'camera', label: 'Fotografía / Media', category: 'Comunicación', keywords: 'imagen visual evento galeria' },
  { name: 'image', label: 'Imagen / Galería', category: 'Comunicación', keywords: 'foto recurso visual' },
  { name: 'bell', label: 'Notificación / Aviso', category: 'Comunicación', keywords: 'alerta recordatorio inicio clases' },

  // Documentos, Validaciones y UI
  { name: 'check', label: 'Check / Incluido', category: 'Interfaz', keywords: 'si correcto lista requisito incluido' },
  { name: 'check-circle', label: 'Verificado / Completo', category: 'Interfaz', keywords: 'ok aprobado beneficio requisito' },
  { name: 'check-square', label: 'Casilla marcada', category: 'Interfaz', keywords: 'lista tareas completado checklist' },
  { name: 'star', label: 'Estrella / Destacado', category: 'Interfaz', keywords: 'favorito calidad excelencia top' },
  { name: 'heart', label: 'Corazón / Bienestar', category: 'Interfaz', keywords: 'preferido comunidad vida universitaria' },
  { name: 'thumbs-up', label: 'Recomendado / Aprobado', category: 'Interfaz', keywords: 'positivo me gusta calidad' },
  { name: 'shield', label: 'Respaldo / Garantía', category: 'Interfaz', keywords: 'seguridad proteccion prestigio confianza' },
  { name: 'shield-check', label: 'Garantía verificada', category: 'Interfaz', keywords: 'respaldo esan calidad confianza acreditado' },
  { name: 'lock', label: 'Seguridad / Acceso privado', category: 'Interfaz', keywords: 'candado privado protegido' },
  { name: 'unlock', label: 'Acceso abierto', category: 'Interfaz', keywords: 'libre desbloqueado abierto' },
  { name: 'key', label: 'Llave / Acceso', category: 'Interfaz', keywords: 'clave oportunidad ingreso' },
  { name: 'eye', label: 'Ver / Visión', category: 'Interfaz', keywords: 'visualizar detalle explorar transparencia' },
  { name: 'flag', label: 'Meta / Hito', category: 'Interfaz', keywords: 'bandera objetivo inicio etapa' },
  { name: 'flame', label: 'Tendencia / Destacado', category: 'Interfaz', keywords: 'fuego popular demanda nuevo' },
  { name: 'file-text', label: 'Documento / Brochure', category: 'Interfaz', keywords: 'syllabus ficha plan estudios pdf' },
  { name: 'file-check', label: 'Documento aprobado', category: 'Interfaz', keywords: 'certificado tramite constancia requisito' },
  { name: 'file-down', label: 'Descargar PDF', category: 'Interfaz', keywords: 'brochure malla archivo descarga' },
  { name: 'folder', label: 'Carpeta / Repositorio', category: 'Interfaz', keywords: 'archivos material documentos' },
  { name: 'download', label: 'Descargar', category: 'Interfaz', keywords: 'bajar archivo pdf brochure' },
  { name: 'external-link', label: 'Enlace externo', category: 'Interfaz', keywords: 'abrir nueva pestana web' },
  { name: 'link', label: 'Vínculo / Enlace', category: 'Interfaz', keywords: 'url conectar acceso' },
  { name: 'search', label: 'Buscar / Explorar', category: 'Interfaz', keywords: 'lupa encontrar catalogo' },
  { name: 'filter', label: 'Filtro', category: 'Interfaz', keywords: 'ordenar buscar categoria' },
  { name: 'layout-grid', label: 'Grilla / Catálogo', category: 'Interfaz', keywords: 'tarjetas categorias bloques opciones' },
  { name: 'list', label: 'Lista / Temario', category: 'Interfaz', keywords: 'indice modulos requisitos' },
  { name: 'pencil', label: 'Editar / Diseño', category: 'Interfaz', keywords: 'escribir modificar taller creativo' },
  { name: 'trash-2', label: 'Eliminar', category: 'Interfaz', keywords: 'basura quitar borrar' },
  { name: 'help-circle', label: 'Ayuda / Preguntas', category: 'Interfaz', keywords: 'faq dudas soporte consulta interrogacion' },
  { name: 'info', label: 'Información', category: 'Interfaz', keywords: 'detalle aviso nota explicacion' },
  { name: 'alert-circle', label: 'Aviso importante', category: 'Interfaz', keywords: 'alerta recordatorio atencion' },
  { name: 'alert-triangle', label: 'Advertencia', category: 'Interfaz', keywords: 'precaucion alerta requisito' },
  { name: 'arrow-right', label: 'Flecha derecha', category: 'Interfaz', keywords: 'ir continuar ver mas cta' },
  { name: 'arrow-up-right', label: 'Flecha diagonal', category: 'Interfaz', keywords: 'abrir enlace destino' },
  { name: 'arrow-up', label: 'Flecha arriba', category: 'Interfaz', keywords: 'subir elevar crecimiento' },
  { name: 'chevron-right', label: 'Siguiente', category: 'Interfaz', keywords: 'adelante flecha menor' },
  { name: 'chevron-left', label: 'Anterior', category: 'Interfaz', keywords: 'atras volver flecha' },
  { name: 'chevron-down', label: 'Desplegar', category: 'Interfaz', keywords: 'abajo acordeon ver' },
  { name: 'plus', label: 'Más / Agregar', category: 'Interfaz', keywords: 'sumar nuevo anadir' },
  { name: 'minus', label: 'Menos', category: 'Interfaz', keywords: 'restar quitar colapsar' },
  { name: 'menu', label: 'Menú', category: 'Interfaz', keywords: 'navegacion opciones barras' },
  { name: 'x', label: 'Cerrar', category: 'Interfaz', keywords: 'quitar cancelar equis' },
];

/** Lista plana compatible con los selectores heredados. */
export const ICON_SUGGESTIONS: string[] = ICON_CATALOG.map((item) => item.name);

const ICON_CATALOG_BY_NAME = new Map<string, IconCatalogItem>(
  ICON_CATALOG.map((item) => [item.name, item]),
);

export const findIconCatalogItem = (name: string): IconCatalogItem | undefined => {
  const clean = (name || '').trim().toLowerCase();
  return clean ? ICON_CATALOG_BY_NAME.get(clean) : undefined;
};

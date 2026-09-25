import { defineAsyncComponent } from 'vue';
import { ELEMENTS_REGISTRY } from '../components/pre_elements/ElementsRegistry';

export const BLOCK_REGISTRY: Record<string, any> = {

    /* ---------------------------------------------------------------------
       BETA — bloques portados de los componentes de webunificada.

       Se marcan con `beta: true` y su `group` no coincide con ninguno de
       `baseGroups`, así que quedan fuera del catálogo clásico: el panel
       izquierdo los lista aparte, en su propia pestaña.
       --------------------------------------------------------------------- */
    HeroLeadForm: {
        label: '📋 Formulario de Conversión (Leads)',
        icon: 'las la-envelope-open-text',
        group: 'Formularios',
        beta: true,
        isBoxed: true,
        component: defineAsyncComponent(() => import('../components/block-beta/formularios/lead-form/Block.vue')),
        initialData: {
            themeColor: '#e31140',
            button_text: 'Enviar Solicitud',
            campaign_id: null,
            show_phone: true,
            show_consult: false,
            show_courses: true,
            courses_list: [],
        },
    },

    EventsFeatured: {
        label: 'Eventos destacados',
        icon: 'las la-calendar',
        group: 'Events',
        beta: true,
        isBoxed: true,
        component: defineAsyncComponent(() => import('../components/block-beta/events/events-featured/Block.vue')),
        initialData: {
            desc: 'Descubre todos los eventos de los que puedes ser parte.',
            title: 'Eventos',
            linkLabel: 'Ver todos los eventos',
            linkUrl: '',
            cardCount: 4,
            cards: [
                {
                    id: 'ev-1', date: '2026-03-12', day: '', month: '',
                    title: 'Conferencia de liderazgo y gestión pública',
                    href: '',
                    image: '', imageAlt: '', tag: '', badges: ['Conferencia', 'Presencial'],
                },
                {
                    id: 'ev-2', date: '2026-03-18', day: '', month: '',
                    title: 'Taller de transformación digital para directivos',
                    href: '',
                    image: '', imageAlt: '', tag: '', badges: ['Taller', 'Híbrido'],
                },
                {
                    id: 'ev-3', date: '2026-03-25', day: '', month: '',
                    title: 'Encuentro de egresados y networking profesional',
                    href: '',
                    image: '', imageAlt: '', tag: '', badges: ['Encuentro', 'Virtual'],
                },
                {
                    id: 'ev-4', date: '2026-04-02', day: '', month: '',
                    title: 'Seminario de innovación y emprendimiento',
                    href: '',
                    image: '', imageAlt: '', tag: '', badges: ['Conferencia', 'Presencial'],
                },
            ],
        },
    },

    PostsFeatured: {
        label: 'Publicaciones destacadas',
        icon: 'las la-newspaper',
        group: 'Events',
        beta: true,
        isBoxed: true,
        component: defineAsyncComponent(() => import('../components/block-beta/events/posts-featured/Block.vue')),
        initialData: {
            desc: '',
            title: 'Conexión ESAN',
            linkLabel: 'Ver todas las publicaciones',
            linkUrl: '',
            cardCount: 4,
            cards: [
                {
                    id: 'po-1', image: '', imageAlt: '',
                    title: 'ESAN acompaña logro de escolar peruano premiado en mundial de robótica',
                    date: '2026-07-09', badges: ['Actualidad'], ctaLabel: 'Leer artículo', href: '',
                },
                {
                    id: 'po-2', image: '', imageAlt: '',
                    title: 'Tendencias que están redefiniendo la gestión directiva',
                    date: '2026-07-02', badges: ['Actualidad'], ctaLabel: 'Leer artículo', href: '',
                },
                {
                    id: 'po-3', image: '', imageAlt: '',
                    title: 'Decisiones financieras en escenarios de incertidumbre',
                    date: '2026-06-24', badges: ['Actualidad'], ctaLabel: 'Leer artículo', href: '',
                },
                {
                    id: 'po-4', image: '', imageAlt: '',
                    title: 'El rol de las empresas en la agenda ambiental',
                    date: '2026-06-18', badges: ['Actualidad'], ctaLabel: 'Leer artículo', href: '',
                },
            ],
        },
    },

    SectionEcosystem: {
        label: 'Sección ecosistema',
        icon: 'las la-sitemap',
        group: 'Ecosystem',
        beta: true,
        isBoxed: false,
        component: defineAsyncComponent(() => import('../components/block-beta/ecosystem/section-ecosystem/Block.vue')),
        initialData: {
            title: 'Descubre nuestro Ecosistema Académico',
            desc: 'En ESAN innovamos con nuestra oferta académica para responder a la transformación social, económica, laboral y tecnológica.',
            features: [
                {
                    id: 'eco-f1', color: 'mba',
                    title: 'ESAN Graduate School of Business',
                    desc: 'MBAs, Maestrías, Doctorados y programas especializados, Institutos, Business Law',
                    image: '', imageAlt: '', href: '',
                },
                {
                    id: 'eco-f2', color: 'government',
                    title: 'ESAN School of Government',
                    desc: 'Programas y servicios para la administración pública',
                    image: '', imageAlt: '', href: '',
                },
            ],
            bar: {
                title: 'ESAN University',
                desc: 'Carreras de pregrado, postgrado y para gente que trabaja (DPA)',
                href: '',
            },
            faculties: [
                {
                    id: 'eco-1', color: 'blue', title: 'ESAN Management',
                    desc: 'Carreras de ciencias administrativas', image: '', imageAlt: '', href: '',
                },
                {
                    id: 'eco-2', color: 'wine', title: 'ESAN Economics',
                    desc: 'Carreras de ciencias económicas', image: '', imageAlt: '', href: '',
                },
                {
                    id: 'eco-3', color: 'green', title: 'ESAN Engineering',
                    desc: 'Carreras de ingeniería', image: '', imageAlt: '', href: '',
                },
                {
                    id: 'eco-4', color: 'yellow', title: 'ESAN Law',
                    desc: 'Carreras de derecho', image: '', imageAlt: '', href: '',
                },
                {
                    id: 'eco-5', color: 'cyan', title: 'ESAN Communications',
                    desc: 'Carreras en comunicación', image: '', imageAlt: '', href: '',
                },
                {
                    id: 'eco-6', color: 'orange', title: 'ESAN Psychology',
                    desc: 'Carreras de ciencias sociales', image: '', imageAlt: '', href: '',
                },
            ],
        },
    },

    HeroSlider: {
        label: 'Portada (carrusel)',
        icon: 'las la-images',
        group: 'Heros',
        beta: true,
        // La foto sangra a todo el ancho: no va dentro de una caja.
        isBoxed: false,
        component: defineAsyncComponent(() => import('../components/block-beta/hero/hero-slider/Block.vue')),
        initialData: {
            // <h1> oculto "ESAN" para buscadores. Se desactiva en las páginas
            // que ya tengan su propio título principal.
            showSeoHeading: true,
            slides: [
                {
                    id: 'hero-1',
                    eyebrow: 'Domina las áreas y sectores clave del mercado',
                    title: 'Descubre +20 Maestrías Especializadas',
                    desc: 'Programas Incompany, consultoría y consejería diseñados para enfrentar los desafíos estratégicos de tu empresa.',
                    image: '',
                    imageAlt: '',
                    primary: { label: 'Habla con un asesor', url: '' },
                    secondary: { label: '', url: '' },
                },
                {
                    id: 'hero-2',
                    eyebrow: 'Admisión 2026 - Examen virtual en plataforma',
                    title: 'Postula a ESAN y sé dueño de tus sueños',
                    desc: 'Cierre de inscripciones: 18 de junio. Cupos limitados',
                    image: '',
                    imageAlt: '',
                    primary: { label: 'Habla con un asesor', url: '' },
                    secondary: { label: '', url: '' },
                },
                {
                    id: 'hero-3',
                    eyebrow: 'ESAN University',
                    title: 'Examen de Admisión Virtual - Sábado 29 de Agosto',
                    desc: 'Cierre de inscripciones: 18 de junio. Cupos limitados',
                    image: '',
                    imageAlt: '',
                    primary: { label: 'Postula ahora', url: '' },
                    secondary: { label: 'Habla con un asesor', url: '' },
                },
            ],
        },
    },

    SubHero: {
        label: 'Portada (pregrado)',
        icon: 'las la-images',
        group: 'Heros',
        beta: true,
        // La foto sangra a todo el ancho: no va dentro de una caja.
        isBoxed: false,
        component: defineAsyncComponent(() => import('../components/block-beta/hero/sub-hero/Block.vue')),
        initialData: {
            eyebrow: 'ESAN UNIVERSITY',
            title: 'Explora nuestras 17 carreras universitarias',
            desc: '',
            image: '',
            imageAlt: '',
        },
    },

    StoriesFeatured: {
        label: 'Historias destacadas (video)',
        icon: 'las la-play-circle',
        group: 'Testimonials',
        beta: true,
        // La franja de color sangra a todo el ancho: no va dentro de una caja.
        isBoxed: false,
        component: defineAsyncComponent(() => import('../components/block-beta/testimonials/stories-featured/Block.vue')),
        initialData: {
            title: 'Historias que trascienden',
            subtitle: 'Conoce las historias reales y el impacto de quienes eligieron a ESAN',
            linkLabel: 'Conoce más historias',
            linkUrl: '',
            cardCount: 4,
            cards: [
                {
                    id: 'st-1', name: 'Gabriela Berriel',
                    role: 'Estudiante pregrado · Administración y Finanzas',
                    image: '', imageAlt: '', videoUrl: '', href: '', ctaLabel: 'Ver historia',
                },
                {
                    id: 'st-2', name: 'Alberto Echevarría',
                    role: 'Egresado · Administración y Marketing',
                    image: '', imageAlt: '', videoUrl: '', href: '', ctaLabel: 'Ver historia',
                },
                {
                    id: 'st-3', name: 'Esther Diez Berriel',
                    role: 'Alumna de postgrado · Maestría Gerencia en Gestión Pública',
                    image: '', imageAlt: '', videoUrl: '', href: '', ctaLabel: 'Ver historia',
                },
                {
                    id: 'st-4', name: 'Luis García Echevarría',
                    role: 'Ejecutivo · PADE Internacional en Business Admin.',
                    image: '', imageAlt: '', videoUrl: '', href: '', ctaLabel: 'Ver historia',
                },
            ],
        },
    },

    InfoMapamundi: {
        label: 'Mapamundi (presencia internacional)',
        icon: 'las la-globe-americas',
        group: 'Info',
        beta: true,
        // La franja gris sangra a todo el ancho: no va dentro de una caja.
        isBoxed: false,
        component: defineAsyncComponent(() => import('../components/block-beta/info/mapamundi/Block.vue')),
        initialData: {
            eyebrow: 'ESAN Global Experience',
            title: 'Lleva tu excelencia más lejos',
            // Los logos de cada tarjeta son fijos (los pone el bloque): aquí solo va la lista.
            left: {
                items: [
                    { id: 'mm-l1', icon: 'graduate-doc', text: 'Programas cortos y experiencias inmersivas' },
                    { id: 'mm-l2', icon: 'airplane', text: '+130 Intercambios internacionales' },
                    { id: 'mm-l3', icon: 'alumni', text: 'Doble titulación con universidades internacionales' },
                    { id: 'mm-l4', icon: 'awards', text: 'Doble titulación con programas de grado internacionales' },
                    { id: 'mm-l5', icon: 'chats', text: '+300 estudiantes han completado un programa de intercambio.' },
                ],
            },
            right: {
                items: [
                    { id: 'mm-r1', icon: 'alumni', text: 'Doble titulación de MBA' },
                    { id: 'mm-r2', icon: 'airplane', text: '+70 oportunidades de MBA internacional' },
                    { id: 'mm-r3', icon: 'family-hold', text: 'Consorcio de escuelas de EMBA internacionales' },
                    { id: 'mm-r4', icon: 'awards', text: 'Programas de máster especializados' },
                    { id: 'mm-r5', icon: 'graduate-doc', text: 'Programas de educación ejecutiva' },
                ],
            },
            button: { label: 'Descubre ESAN Internacional', url: '' },
        },
    },

    InfoValuesCards: {
        label: 'Tarjetas de valor (con filtros)',
        icon: 'las la-layer-group',
        group: 'Info',
        beta: true,
        // La franja gris sangra a todo el ancho: no va dentro de una caja.
        isBoxed: false,
        component: defineAsyncComponent(() => import('../components/block-beta/info/values-cards/Block.vue')),
        initialData: {
            items: [
                {
                    id: 'vc-1', icon: 'globe', tabLabel: 'Internacionalización',
                    eyebrow: 'Experiencia internacional',
                    title: 'Amplía tu visión del mundo y accede a oportunidades en el extranjero',
                    desc: 'Vive experiencias académicas internacionales y desarrolla una perspectiva global para tu carrera.',
                    bullets: [
                        'Programa de Doble Grado',
                        'Programas de Intercambio',
                        'Programas cortos en el extranjero',
                        'Global Week',
                        'Becas Internacionales',
                    ],
                    linkLabel: 'Explora nuestros programas', linkUrl: '',
                    image: '', imageAlt: '', videoUrl: '', duration: '02:15',
                },
                {
                    id: 'vc-2', icon: 'handshake', tabLabel: 'Conexión empresarial',
                    eyebrow: 'Cerca de las empresas',
                    title: 'Aprende de la mano de las empresas que lideran el mercado',
                    desc: 'Proyectos, prácticas y mentorías con las organizaciones que definen la agenda del país.',
                    bullets: [
                        'Proyectos con empresas reales',
                        'Mentorías con directivos',
                        'Ferias y rondas de empleabilidad',
                    ],
                    linkLabel: 'Conoce nuestras alianzas', linkUrl: '',
                    image: '', imageAlt: '', videoUrl: '', duration: '',
                },
                {
                    id: 'vc-3', icon: 'cpu', tabLabel: 'Tecnología e Innovación',
                    eyebrow: 'Innovación aplicada',
                    title: 'Domina las herramientas que están transformando tu profesión',
                    desc: 'Laboratorios, analítica de datos e inteligencia artificial aplicada a tu campo.',
                    bullets: [
                        'Laboratorios de innovación',
                        'Analítica de datos e IA',
                        'Retos de transformación digital',
                    ],
                    linkLabel: 'Descubre nuestros laboratorios', linkUrl: '',
                    image: '', imageAlt: '', videoUrl: '', duration: '',
                },
                {
                    id: 'vc-4', icon: 'briefcase', tabLabel: 'Empleabilidad',
                    eyebrow: 'Tu carrera profesional',
                    title: 'Da el salto al mercado laboral con acompañamiento desde el primer ciclo',
                    desc: 'Orientación, prácticas y una red de egresados que abre puertas.',
                    bullets: [
                        'Bolsa de trabajo exclusiva',
                        'Asesoría de carrera',
                        'Red de egresados',
                    ],
                    linkLabel: 'Conoce el centro de carrera', linkUrl: '',
                    image: '', imageAlt: '', videoUrl: '', duration: '',
                },
                {
                    id: 'vc-5', icon: 'leaf', tabLabel: 'Sostenibilidad',
                    eyebrow: 'Impacto positivo',
                    title: 'Lidera proyectos que dejan huella en la sociedad y el ambiente',
                    desc: 'Formación e investigación con criterios de sostenibilidad en cada disciplina.',
                    bullets: [
                        'Proyectos de impacto social',
                        'Investigación en sostenibilidad',
                        'Voluntariado universitario',
                    ],
                    linkLabel: 'Explora nuestras iniciativas', linkUrl: '',
                    image: '', imageAlt: '', videoUrl: '', duration: '',
                },
                {
                    id: 'vc-6', icon: 'award', tabLabel: 'Excelencia académica',
                    eyebrow: 'Calidad reconocida',
                    title: 'Estudia en una escuela acreditada y con reconocimiento internacional',
                    desc: 'Docentes con trayectoria y programas evaluados por acreditadoras internacionales.',
                    bullets: [
                        'Acreditaciones internacionales',
                        'Plana docente con experiencia',
                        'Investigación de alto impacto',
                    ],
                    linkLabel: 'Conoce nuestras acreditaciones', linkUrl: '',
                    image: '', imageAlt: '', videoUrl: '', duration: '',
                },
            ],
        },
    },

    AwardsFeatured: {
        label: 'Reconocimientos (logos)',
        icon: 'las la-award',
        group: 'Awards',
        beta: true,
        // Sección blanca con su propio ancho máximo, igual que las de `events`.
        isBoxed: true,
        component: defineAsyncComponent(() => import('../components/block-beta/awards/awards-featured/Block.vue')),
        initialData: {
            title: 'Reconocimiento que genera confianza',
            desc: 'El prestigio se construye con resultados, reconocimiento internacional y el impacto de nuestros egresados.',
            linkLabel: 'Ver más reconocimientos',
            linkUrl: '',
            // Las cuatro casillas de la maqueta (el tope), vacías para que se suba cada logo.
            awards: [
                { id: 'aw-1', image: '', imageAlt: '' },
                { id: 'aw-2', image: '', imageAlt: '' },
                { id: 'aw-3', image: '', imageAlt: '' },
                { id: 'aw-4', image: '', imageAlt: '' },
            ],
        },
    },

    CardsImageGrid: {
        label: 'Tarjetas con imagen (grilla)',
        icon: 'las la-th-large',
        group: 'Cards',
        beta: true,
        // Sección blanca con su propio ancho máximo, igual que las de `events`.
        isBoxed: true,
        component: defineAsyncComponent(() => import('../components/block-beta/cards/image-grid/Block.vue')),
        initialData: {
            eyebrow: 'Comunidad y vida ESAN',
            title: 'Más que una institución académica',
            desc: '',
            linkLabel: '',
            linkUrl: '',
            // Las seis tarjetas de la maqueta, sin foto para que se suba cada una.
            cards: [
                { id: 'ig-1', image: '', imageAlt: '', title: 'Vida universitaria', desc: 'Descripción de la categoría del banner', href: '' },
                { id: 'ig-2', image: '', imageAlt: '', title: 'Deportes', desc: 'Descripción de la categoría del banner', href: '' },
                { id: 'ig-3', image: '', imageAlt: '', title: 'Cultura', desc: 'Descripción de la categoría del banner', href: '' },
                { id: 'ig-4', image: '', imageAlt: '', title: 'Networking', desc: 'Descripción de la categoría del banner', href: '' },
                { id: 'ig-5', image: '', imageAlt: '', title: 'Eventos', desc: 'Descripción de la categoría del banner', href: '' },
                { id: 'ig-6', image: '', imageAlt: '', title: 'Alumni', desc: 'Descripción de la categoría del banner', href: '' },
            ],
        },
    },

    CtaBandImage: {
        label: 'CTA con imagen',
        icon: 'las la-image',
        group: 'CtaBrands',
        beta: true,
        isBoxed: false,
        component: defineAsyncComponent(() => import('../components/block-beta/cta/ctaband-image/Block.vue')),
        initialData: {
            eyebrow: 'Educación Ejecutiva',
            title: 'Lleva la gestión de tu empresa al siguiente nivel',
            desc: 'Programas para gerentes y directivos en actividad, diseñados junto a las principales empresas del país.',
            image: '',
            imageAlt: '',
            buttonCount: 2,
            primary: { label: 'Ver programas ejecutivos', url: '' },
            secondary: { label: 'Habla con un asesor', url: '' },
        },
    },

    CtaBandFullImage: {
        label: 'CTA con imagen de fondo',
        icon: 'las la-images',
        group: 'CtaBrands',
        beta: true,
        isBoxed: false,
        component: defineAsyncComponent(() => import('../components/block-beta/cta/ctaband-full-image/Block.vue')),
        initialData: {
            eyebrow: 'Admisión 2026',
            title: 'Título del CTA band hasta 2 líneas de contenido',
            desc: 'Texto de apoyo del CTA band hasta 2 líneas de contenido, para acompañar al título.',
            image: '',
            imageAlt: '',
            buttonCount: 2,
            primary: { label: 'Botón primario', url: '' },
            secondary: { label: 'Botón secundario', url: '' },
        },
    },

    CtaBandSolid: {
        label: 'CTA sólido de marca',
        icon: 'las la-bullhorn',
        group: 'CtaBrands',
        beta: true,
        isBoxed: false,
        component: defineAsyncComponent(() => import('../components/block-beta/cta/ctaband-solid/Block.vue')),
        initialData: {
            eyebrow: 'Admisión 2026',
            title: '¿Listo para dar el siguiente paso?',
            desc: 'Inicia tu postulación hoy y asegura tu vacante en el proceso de admisión 2026.',
            buttonCount: 1,
            primary: { label: 'Postula ahora', url: '' },
            secondary: { label: '', url: '' },
        },
    },

    CtaBandCompact: {
        label: 'CTA compacto',
        icon: 'las la-info-circle',
        group: 'CtaBrands',
        beta: true,
        // Pensado para insertarse dentro de una columna de contenido.
        isBoxed: true,
        component: defineAsyncComponent(() => import('../components/block-beta/cta/ctaband-compact/Block.vue')),
        initialData: {
            icon: 'help-circle',
            title: '¿Tienes dudas sobre el proceso de admisión?',
            desc: 'Nuestros asesores académicos te acompañan en cada paso.',
            linkLabel: 'Habla con un asesor',
            linkUrl: '',
        },
    },


};

/* -------------------------------------------------------------------------- */
/* BETA — catálogo propio                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Categorías de los bloques beta.
 *
 * Son independientes de `baseGroups` a propósito: ningún id coincide con los
 * del catálogo clásico, así que los bloques beta nunca aparecen mezclados con
 * él. El panel izquierdo los agrupa por estas categorías en su propia pestaña.
 */
const betaBaseGroups = [
    // 'Formularios' no coincide con ningún id de baseGroups: no se cuela en el catálogo clásico.
    { id: 'Formularios', label: 'Formularios', color: 'outline-primary', icon: 'las la-wpforms' },
    { id: 'CtaBrands', label: 'CTA & Brands', color: 'outline-danger', icon: 'las la-bullhorn' },
    { id: 'Events', label: 'Events', color: 'outline-primary', icon: 'las la-calendar' },
    // 'Testimonials' y no 'Testimonios': el id de baseGroups no debe repetirse
    // aquí, o los bloques beta acabarían mezclados con el catálogo clásico.
    { id: 'Testimonials', label: 'Testimonials', color: 'outline-warning', icon: 'las la-quote-right' },
    // 'Heros' y no 'Hero': ese id ya es el de la categoría clásica de portadas.
    // Repetirlo colaría este bloque también en el catálogo viejo, porque
    // blockGroups filtra por id sin descartar los beta.
    { id: 'Heros', label: 'Heros', color: 'outline-info', icon: 'las la-images' },
    { id: 'Ecosystem', label: 'Ecosystem', color: 'outline-success', icon: 'las la-sitemap' },
    // 'Info' no coincide con ningún id de baseGroups: no se cuela en el catálogo clásico.
    { id: 'Info', label: 'Info', color: 'outline-secondary', icon: 'las la-info-circle' },
    // 'Awards' no coincide con ningún id de baseGroups: no se cuela en el catálogo clásico.
    { id: 'Awards', label: 'Awards', color: 'outline-dark', icon: 'las la-award' },
    // 'Cards' no coincide con ningún id de baseGroups: no se cuela en el catálogo clásico.
    { id: 'Cards', label: 'Cards', color: 'outline-success', icon: 'las la-th-large' },
];

/** Claves de los bloques marcados como beta, sin agrupar. */
export const betaBlockKeys = Object.keys(BLOCK_REGISTRY).filter(
    key => BLOCK_REGISTRY[key].beta === true
);

/** Bloques beta agrupados por categoría, en el mismo formato que blockGroups. */
export const betaBlockGroups = betaBaseGroups.map(group => ({
    ...group,
    keys: betaBlockKeys.filter(key => BLOCK_REGISTRY[key].group === group.id),
}));

/**
 * Bloques beta sin categoría reconocida.
 *
 * Existe para que un bloque nuevo no desaparezca del panel por olvidar darle
 * una categoría o por escribirla mal: se muestra aparte en lugar de perderse.
 */
export const betaUngroupedKeys = betaBlockKeys.filter(
    key => !betaBaseGroups.some(group => group.id === BLOCK_REGISTRY[key].group)
);

export const BlockComponents = Object.keys(BLOCK_REGISTRY).reduce((acc, key) => {
    acc[key] = BLOCK_REGISTRY[key].component;
    return acc;
}, {} as Record<string, any>);

export const BlockLabels = Object.keys(BLOCK_REGISTRY).reduce((acc, key) => {
    acc[key] = BLOCK_REGISTRY[key].label;
    return acc;
}, {} as Record<string, string>);

export const blockIcons = Object.keys(BLOCK_REGISTRY).reduce((acc, key) => {
    acc[key] = BLOCK_REGISTRY[key].icon;
    return acc;
}, {} as Record<string, string>);

//Resolvedores limpios de lógica pública
// resolveBlock también resuelve components/pre_elements (ELEMENTS_REGISTRY) como
// fallback: así el mismo mecanismo de "agregar bloque" (addBlock en
// usePageBuilder.ts) sirve para insertar un elemento en el canvas para verlo
// en contexto real. No tienen entrada en editorRegistry.ts a propósito: al no
// existir editor para su type, resolveEditor(type) devuelve null y el panel
// de edición simplemente no muestra nada para ellos — sin necesitar una
// bandera "sin editor" aparte, es el mismo comportamiento que ya tienen otros
// bloques de este registry con su editor comentado.
export const resolveBlock = (type: string) => BlockComponents[type] || ELEMENTS_REGISTRY[type]?.component || null;
export const getInitialData = (type: string) => JSON.parse(JSON.stringify(BLOCK_REGISTRY[type]?.initialData || {}));
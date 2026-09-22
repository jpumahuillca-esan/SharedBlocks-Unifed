import { defineAsyncComponent } from 'vue';

export const BRANDING_REGISTRY: Record<string, any> = {

    HeaderClassic: {
        label: '🏛️ Institucional Clásico',
        icon: 'las la-university',
        component: defineAsyncComponent(() => import('../components/branding/previews/HeaderClassic.vue')),
        editor: defineAsyncComponent(() => import('../components/branding/editors/HeaderClassicEditor.vue')),
        initialData: {
            sticky: true,
            showTopBar: true,
            logoHeight: 60,
            menuAlignment: 'right',
            topBarText: 'Portal Académico Oficial',
            menu_id: null
        }
    },


    HeaderClassicV1: {
        label: '🏛️ Institucional Clásico V1',
        icon: 'las la-school',
        component: defineAsyncComponent(() => import('../components/branding/headers/previews/HeaderClassicV1.vue')),
        editor: defineAsyncComponent(() => import('../components/branding/headers/updates/HeaderClassicV1Editor.vue')),
        initialData: {
            logoUrl: '',
            logoHeight: 65,
            logoHeightScrolled: 45,
            sticky: true,
            isTransparent: false,

            backdropBlur: 10,
            showTopBar: true,
            topBarBgColor: '#003366',
            topBarTextColor: '#ffffff',
            navBgColor: '#ffffff',
            navTextColor: '#333333',
            navTransparentTextColor: '#ffffff',
            navHoverColor: '#cc0033',
            socialLinks: [
                { icon: 'bi bi-facebook', url: '#' },
                { icon: 'bi bi-instagram', url: '#' },
                { icon: 'bi bi-linkedin', url: '#' }
            ],
            topLinks: [
                { text: 'Portal de Alumnos', url: '#' },
                { text: 'Intranet Docente', url: '#' }
            ],
            ctaText: 'POSTULA AQUÍ',
            ctaUrl: '#',
            ctaIcon: 'bi bi-arrow-right-circle',

            menuId: null
        }
    },
    HeaderMega: {
        label: '🚀 Mega Menú Premium',
        icon: 'las la-layer-group',
        component: defineAsyncComponent(() => import('../components/branding/headers/header-mega/View.vue')),
        editor: defineAsyncComponent(() => import('../components/branding/headers/header-mega/Update.vue')),
        initialData: {
            sticky: true,
            logoHeight: 70,
            containerType: 'container',
            heavyShadow: true,
            ctaText: 'POSGRADO',
            menu_id: null
        }
    },


    /*
     * Cabecera con mega menú con la arquitectura de block-beta (estilos en
     * assets/styles/elements/_mega-menu-beta.scss). Usa los mismos datos que
     * HeaderMega —el árbol del Menú Institucional en `menu_tree`—, así que se
     * puede cambiar de una a otra sin perder la personalización del menú. La
     * clave empieza por "Header": el panel de branding lista las cabeceras por
     * ese prefijo.
     */
    HeaderMegaMenuBeta: {
        label: '🧭 Mega Menú Beta (ESAN)',
        icon: 'las la-bars',
        component: defineAsyncComponent(() => import('../components/branding/headers/mega_menu_beta/Block.vue')),
        editor: defineAsyncComponent(() => import('../components/branding/headers/mega_menu_beta/Editor.vue')),
        initialData: {
            // Vacío: se usa el logo oficial de ESAN que trae la librería.
            logoUrl: '',
            // Vacío: se describe según el logo que haya (ver Block.vue).
            logoAlt: '',
            logoHeight: 36,
            urlRedict: '/',
            // Vacío: la lupa no se muestra.
            searchUrl: '',
        }
    },

    FooterPro: {
        label: '🏁 Footer Institucional Pro (Azul RiesGIRD)',
        icon: 'las la-shoe-prints',
        component: defineAsyncComponent(() => import('../components/branding/footer/previews/FooterPro.vue')),
        editor: defineAsyncComponent(() => import('../components/branding/footer/updates/FooterProEditor.vue')),
        initialData: {
            logoUrl: '/img.png',
            logoHeight: 60,
            description: 'Institución líder enfocada en la excelencia académica, la gestión del riesgo y la formación integral.',
            bgColor: '#1e40af',
            textColor: '#e0f2fe',
            accentColor: '#ffffff',
            bulletColor: '#93c5fd',
            bottomBgColor: '#173287',
            bottomTextColor: '#93c5fd',
            copyrightText: 'Riesgird - ACC | Todos los derechos reservados.',
            footerColumns: [
                {
                    title: 'Organización',
                    links: [
                        { text: 'RED', url: '/' },
                        { text: '¿Qué es la Red?', url: '/organizacion' },
                        { text: 'Estructura organizacional', url: '/estructuraOrganizacional' },
                        { text: 'Proceso y requisito de membresía', url: '/procesoMembresia' }
                    ]
                },
                {
                    title: 'Líneas de acción',
                    links: [
                        { text: 'Investigación', url: '/investigacionesProducidas' },
                        { text: 'Formación', url: '/estrategiaTransversalizacion' },
                        { text: 'Responsabilidad socio ambiental', url: '/servicioDesarrolloTerritorial' }
                    ]
                },
                {
                    title: 'Eventos y noticias',
                    links: [
                        { text: 'Noticias', url: '/eventosNoticias' },
                        { text: 'Convocatorias', url: '/noticiasConvocatorias' }
                    ]
                },
                {
                    title: 'Miembros',
                    links: [
                        { text: 'Directorio', url: '/directorio' },
                        { text: 'Universidades', url: '/universidades' }
                    ]
                },
                {
                    title: 'Documentos',
                    links: [
                        { text: 'Memorias', url: '/memoriasCongreso' },
                        { text: 'Documentos y Gestión', url: '/gestionConocimiento' },
                        { text: 'Investigaciones', url: '/investigacionesProducidas' },
                        { text: 'Presencia Riesgird', url: '/presenciaRed' }
                    ]
                }
            ]
        }
    },
    FooterSimple: {
        label: '⬛ Footer Simple Minimalista',
        icon: 'las la-minus',
        component: defineAsyncComponent(() => import('../components/branding/footer/previews/FooterSimple.vue')),
        editor: defineAsyncComponent(() => import('../components/branding/footer/updates/FooterSimpleEditor.vue')),
        initialData: {
            bgColor: '#1e1e1e',
            textColor: '#7e7e7e',
            linkColor: '#9ba8b5',
            iconColor: '#ffffff',
            links: [
                { text: 'Blog UE', url: '#' },
                { text: 'UE Virtual', url: '#' },
                { text: 'Tour Virtual', url: '#' },
                { text: 'FabLab Esan', url: '#' },
                { text: 'Acreditación Esan', url: '#' }
            ],
            copyrightText: 'Universidad ESAN - R.U.C N° 20136507720',
            socialLinks: [
                { icon: 'bi bi-twitter-x', url: '#' },
                { icon: 'bi bi-facebook', url: '#' },
                { icon: 'bi bi-youtube', url: '#' },
                { icon: 'bi bi-instagram', url: '#' }
            ]
        }
    },

    /*
     * Pie con la arquitectura de block-beta (Block.vue + Editor.vue, estilos en
     * assets/styles/elements/_footer-v1.scss). La clave empieza por "Footer"
     * porque el panel de branding separa cabeceras y pies por ese prefijo.
     */
    FooterVersion1: {
        label: '🏁 Footer Versión 1 (ESAN)',
        icon: 'las la-shoe-prints',
        component: defineAsyncComponent(() => import('../components/branding/footer/footer_version_1/Block.vue')),
        editor: defineAsyncComponent(() => import('../components/branding/footer/footer_version_1/Editor.vue')),
        initialData: {
            contacts: [
                { id: 'fc-1', title: 'Sede principal:', text: 'Alonso de Molina 1652,\nMonterrico, Surco - Lima, Perú', url: '' },
                { id: 'fc-2', title: 'Oficina de Admisión de Pregrado', text: 'Horario de atención:\nLun. a Vie. de 10:00 - 6:45 p.m.', url: '' },
                { id: 'fc-3', title: 'Central telefónica', text: '317-7200 / 712-7200', url: '' },
                { id: 'fc-4', title: 'Correos:', text: 'informes@esan.edu.pe', url: '' },
            ],
            columns: [
                {
                    id: 'fcol-1',
                    title: 'Estudia en ESAN',
                    links: [
                        { id: 'fl-1-1', label: 'Carreras de pregrado', url: '' },
                        { id: 'fl-1-2', label: 'MBA y maestrías', url: '' },
                        { id: 'fl-1-3', label: 'Programas ejecutivos', url: '' },
                        { id: 'fl-1-4', label: 'Cursos y certificaciones', url: '' },
                        { id: 'fl-1-5', label: 'Centro de idiomas', url: '' },
                    ],
                },
                {
                    id: 'fcol-2',
                    title: 'Para estudiantes',
                    links: [
                        { id: 'fl-2-1', label: 'Portal Académico', url: '' },
                        { id: 'fl-2-2', label: 'Biblioteca', url: '' },
                        { id: 'fl-2-3', label: 'Bolsa de trabajo', url: '' },
                        { id: 'fl-2-4', label: 'Certificados digitales', url: '' },
                    ],
                },
                {
                    id: 'fcol-3',
                    title: 'Servicios',
                    links: [
                        { id: 'fl-3-1', label: 'Convention & Sport Center', url: '' },
                        { id: 'fl-3-2', label: 'R&D Labs', url: '' },
                        { id: 'fl-3-3', label: 'Innova ESAN', url: '' },
                    ],
                },
                {
                    id: 'fcol-4',
                    title: 'Institución',
                    links: [
                        { id: 'fl-4-1', label: 'Sobre ESAN', url: '' },
                        { id: 'fl-4-2', label: 'Rankings y acreditaciones', url: '' },
                        { id: 'fl-4-3', label: 'Transparencia universitaria', url: '' },
                        { id: 'fl-4-4', label: 'Defensoría universitaria', url: '' },
                        { id: 'fl-4-5', label: 'Política de privacidad', url: '' },
                        { id: 'fl-4-6', label: 'Mapa del sitio', url: '' },
                    ],
                },
                {
                    id: 'fcol-5',
                    title: 'Contacto y comunidad',
                    links: [
                        { id: 'fl-5-1', label: 'Comunícate con nosotros', url: '' },
                        { id: 'fl-5-2', label: 'Visitas guiadas', url: '' },
                        { id: 'fl-5-3', label: 'Eventos', url: '' },
                        { id: 'fl-5-4', label: 'Factura electrónica', url: '' },
                        { id: 'fl-5-5', label: 'Portal del colaborador', url: '' },
                    ],
                },
            ],
            socials: [
                { id: 'fs-1', network: 'facebook', url: '' },
                { id: 'fs-2', network: 'x', url: '' },
                { id: 'fs-3', network: 'youtube', url: '' },
                { id: 'fs-4', network: 'instagram', url: '' },
                { id: 'fs-5', network: 'linkedin', url: '' },
            ],
            // La imagen oficial la sube cada unidad desde el editor.
            claimsImage: '',
            claimsImageAlt: 'Libro de Reclamaciones',
            claimsUrl: '',
            copyright: '© Copyright 2026 - Universidad ESAN | Todos los derechos reservados.',
        }
    },

    /*
     * Franja sobre el navbar (bajo él desde tableta). La clave empieza por
     * "Topbar": el panel de branding lista los topbars por ese prefijo, igual
     * que cabeceras y pies. Estilos en assets/styles/elements/_topbar-v1.scss.
     */
    TopbarVersion1: {
        label: '🔝 Topbar Versión 1 (ESAN)',
        icon: 'las la-grip-lines',
        component: defineAsyncComponent(() => import('../components/branding/topbar/topbar_version_1/Block.vue')),
        editor: defineAsyncComponent(() => import('../components/branding/topbar/topbar_version_1/Editor.vue')),
        initialData: {
            brandLabel: 'Portal Académico',
            brandUrl: '',
            startItems: [
                {
                    id: 'tl-s1',
                    label: 'Admisión',
                    url: '',
                    children: [
                        { id: 'tl-s1-1', label: 'Pregrado', url: '' },
                        { id: 'tl-s1-2', label: 'Posgrado', url: '' },
                        { id: 'tl-s1-3', label: 'Educación Ejecutiva', url: '' },
                    ],
                },
            ],
            endItems: [
                { id: 'tl-e1', label: 'Institutos', url: '', children: [] },
                { id: 'tl-e2', label: 'Centro de Idiomas', url: '', children: [] },
                { id: 'tl-e3', label: 'Investigación', url: '', children: [] },
                { id: 'tl-e4', label: 'Biblioteca', url: '', children: [] },
                {
                    id: 'tl-e5',
                    label: 'Comunidad ESAN',
                    url: '',
                    children: [
                        { id: 'tl-e5-1', label: 'Alumni ESAN', url: '' },
                        { id: 'tl-e5-2', label: 'Convenios', url: '' },
                        { id: 'tl-e5-3', label: 'Boletín ESAN', url: '' },
                    ],
                },
                { id: 'tl-e6', label: 'Eventos', url: '', children: [] },
                { id: 'tl-e7', label: 'Conexión ESAN', url: '', children: [] },
                { id: 'tl-e8', label: 'Acerca de ESAN', url: '', children: [] },
            ],
        }
    }
};

export const resolveBrandingComponent = (type: string) => BRANDING_REGISTRY[type]?.component || null;
export const resolveBrandingEditor = (type: string) => BRANDING_REGISTRY[type]?.editor || null;
export const getInitialBrandingData = (type: string) => JSON.parse(JSON.stringify(BRANDING_REGISTRY[type]?.initialData || {}))
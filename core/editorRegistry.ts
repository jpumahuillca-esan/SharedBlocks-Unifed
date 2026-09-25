import { defineAsyncComponent } from 'vue';

export const EDITOR_REGISTRY: Record<string, any> = {
    // Beta — bloques portados de los componentes de webunificada.
    EventsFeatured: defineAsyncComponent(() => import('../components/block-beta/events/events-featured/Editor.vue')),
    PostsFeatured: defineAsyncComponent(() => import('../components/block-beta/events/posts-featured/Editor.vue')),
    CtaBandImage: defineAsyncComponent(() => import('../components/block-beta/cta/ctaband-image/Editor.vue')),
    CtaBandFullImage: defineAsyncComponent(() => import('../components/block-beta/cta/ctaband-full-image/Editor.vue')),
    CtaBandSolid: defineAsyncComponent(() => import('../components/block-beta/cta/ctaband-solid/Editor.vue')),
    CtaBandCompact: defineAsyncComponent(() => import('../components/block-beta/cta/ctaband-compact/Editor.vue')),
    StoriesFeatured: defineAsyncComponent(() => import('../components/block-beta/testimonials/stories-featured/Editor.vue')),
    HeroSlider: defineAsyncComponent(() => import('../components/block-beta/hero/hero-slider/Editor.vue')),
    SubHero: defineAsyncComponent(() => import('../components/block-beta/hero/sub-hero/Editor.vue')),
    SectionEcosystem: defineAsyncComponent(() => import('../components/block-beta/ecosystem/section-ecosystem/Editor.vue')),
    InfoMapamundi: defineAsyncComponent(() => import('../components/block-beta/info/mapamundi/Editor.vue')),
    InfoValuesCards: defineAsyncComponent(() => import('../components/block-beta/info/values-cards/Editor.vue')),
    AwardsFeatured: defineAsyncComponent(() => import('../components/block-beta/awards/awards-featured/Editor.vue')),
    CardsImageGrid: defineAsyncComponent(() => import('../components/block-beta/cards/image-grid/Editor.vue')),

    HeroLeadForm: defineAsyncComponent(() => import('../components/block-beta/formularios/lead-form/Editor.vue'))
    
};

export const resolveEditor = (type: string) => EDITOR_REGISTRY[type] || null;   
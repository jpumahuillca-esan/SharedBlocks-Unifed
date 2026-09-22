<!-- src/shared/components/branding/header-mega/HeaderMega.vue -->
<template>
  <div 
    class="header-master"
    :class="{ 'is-sticky': safeConfig.sticky && scrolled }"
    @mouseleave="activeHoveredMenuId = null"
  >
    <div class="navbar-main">
      <div class="navbar-container-wrapper">
        <!-- Logo -->
        <component :is="linkTag" v-bind="getLinkProps(safeConfig.urlRedict)" class="logo-box">
          <img 
            v-if="safeConfig.logoUrl || 'http://127.0.0.1:8000/storage/media/main/2026/08/1787694395_logoesan.webp'" 
            :src="safeConfig.logoUrl || 'http://127.0.0.1:8000/storage/media/main/2026/08/1787694395_logoesan.webp'" 
            :style="{ height: `${safeConfig.logoHeight}px` }" 
            alt="Logo" 
          />
          <span v-else class="fw-bold branding-text">LOGO</span>
        </component>

        <!-- Navegación Nivel 1 -->
        <nav class="d-none d-lg-block nav-left-aligned-wrapper">
          <ul class="main-menu">
            <li 
              v-for="item in activeMenuList" 
              :key="item.id" 
              class="menu-item-1"
              @mouseenter="activeHoveredMenuId = item.id"
            >
              <component 
                :is="linkTag" 
                v-bind="getLinkProps(item.url)" 
                class="main-menu-link"
                :class="{ 'is-active': activeHoveredMenuId === item.id }"
              >
                <span class="menu-link-text-content">{{ item.title }}</span>
                <i v-if="item.children?.length" class="bi bi-chevron-down menu-arrow-down"></i>
              </component>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- MEGA MENÚ DESPLEGABLE CONGELADO -->
    <Transition name="fade-slide">
      <MegaMenuFlyout
        v-if="currentMegaMenuData"
        :root-item="currentMegaMenuData"
        :link-component="linkComponent"

        @close="activeHoveredMenuId = null"
      />
      <!-- Evento de Cerrar "Modal" -->
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDynamicLink } from '../../../../composables/useDynamicLink';
import { useHeaderState } from '../../../../composables/useHeaderState';
import MegaMenuFlyout from './components/MegaMenuFlyout.vue';

const props = defineProps<{
  config: Record<string, any>;
  menu?: any[];
  linkComponent?: any;
}>();

const { linkTag, getLinkProps } = useDynamicLink(props.linkComponent);
const { scrolled } = useHeaderState();

const activeHoveredMenuId = ref<string | number | null>(null);

const activeMenuList = computed(() => {
  return props.config?.menu_tree?.length ? props.config.menu_tree : (props.menu || []);
});

const currentMegaMenuData = computed(() => {
  if (!activeHoveredMenuId.value) return null;
  const item = activeMenuList.value.find((m: any) => m.id === activeHoveredMenuId.value);
  return item && item.children && item.children.length > 0 ? item : null;
});

/*
const verifySearchAcademicUnit = computed(() => {
    let slugNavigation = getSelection();
    
});

  */

const safeConfig = computed(() => ({
  logoUrl: props.config?.logoUrl || '',
  urlRedict: props.config?.urlRedict || '/',
  logoHeight: Number(props.config?.logoHeight) || 65,
  sticky: props.config?.sticky ?? true,
}));
</script>

<style scoped>
.header-master {
  position: relative;
  width: 100%;
  background-color: #ffffff;
  z-index: 1030;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}
.navbar-main { padding: 16px 0; }
.navbar-container-wrapper {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
}
.branding-text { font-size: 1.5rem; color: #000; }
.nav-left-aligned-wrapper { margin-left: 3rem; }
.main-menu { display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0; }
.main-menu-link {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  color: #0f172a;
  padding: 8px 0;
  position: relative;
}
.main-menu-link:hover, .main-menu-link.is-active { color: #e31140; }

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
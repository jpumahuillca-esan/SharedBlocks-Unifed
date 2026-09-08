<template>
  <div 
    class="header-master" 
    :class="{ 
      'is-sticky': safeConfig.sticky && scrolled, 
      'is-transparent': safeConfig.isTransparent && !scrolled 
    }"
    :style="{
      '--nav-bg': safeConfig.navBgColor,
      '--nav-text': safeConfig.navTextColor,
      '--nav-text-trans': safeConfig.navTransparentTextColor,
      '--nav-hover': safeConfig.navHoverColor
    }"
  >
    <!-- Top Bar Opcional -->
    <div 
      v-if="safeConfig.showTopBar && (safeConfig.socialLinks.length || safeConfig.topLinks.length || safeConfig.ctaText)" 
      class="top-bar-container transition-all"
      :style="{ backgroundColor: safeConfig.topBarBgColor, color: safeConfig.topBarTextColor }"
    >
      <div class="top-container-wrapper">
        <div class="social-icons-wrapper">
          <a 
            v-for="(social, i) in safeConfig.socialLinks" 
            :key="i" 
            :href="social.url" 
            class="social-icon-btn" 
            :style="{ borderColor: 'rgba(255,255,255,0.2)', color: safeConfig.topBarTextColor }"
          >
            <i :class="social.icon"></i>
          </a>
        </div>

        <div class="top-right-actions">
          <div class="top-mini-links-box">
            <a 
              v-for="(link, i) in safeConfig.topLinks" 
              :key="i" 
              :href="link.url" 
              class="top-mini-link" 
              :style="{ color: safeConfig.topBarTextColor }"
            >
              {{ link.text }} <i v-if="link.hasChild" class="bi bi-chevron-down mini-arrow"></i>
            </a>
          </div>
          <a 
            v-if="safeConfig.ctaText" 
            :href="safeConfig.ctaUrl" 
            class="top-cta-btn" 
            :style="{ backgroundColor: 'rgba(255,255,255,0.18)', color: safeConfig.topBarTextColor }"
          >
            <span class="cta-desktop-text">{{ safeConfig.ctaText }}</span>
            <span class="cta-mobile-text">Portal</span>
            <i v-if="safeConfig.ctaIcon" :class="[safeConfig.ctaIcon, 'ms-1.5']"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Navegación Principal -->
    <header class="navbar-main transition-all" :class="{ 'scrolled-nav': scrolled }">
      <div class="navbar-container-wrapper">
        <component :is="linkTag" v-bind="getLinkProps(safeConfig.logoLink || '/')" class="logo-box z-index-top">
          <img 
            v-if="safeConfig.logoUrl" 
            :src="safeConfig.logoUrl" 
            :style="{ height: (scrolled ? safeConfig.logoHeightScrolled : safeConfig.logoHeight) + 'px' }" 
            class="transition-all logo-img" 
            alt="Logo"
          />
          <span v-else class="fw-bold branding-text">LOGO</span>
        </component>

        <!-- Menú Desktop -->
        <nav class="d-none d-lg-block nav-left-aligned-wrapper">
          <ul class="main-menu">
            <li v-for="item in menu" :key="item.id" class="menu-item-1">
              <component :is="linkTag" v-bind="getLinkProps(item.url)" class="main-menu-link">
                <span class="menu-link-text-content">{{ item.title }}</span>
                <i v-if="item.children?.length" class="bi bi-chevron-down menu-arrow-down"></i>
              </component>

              <!-- Nivel 2 -->
              <ul v-if="item.children?.length" class="dropdown-level-2 shadow-lg">
                <li v-for="child in item.children" :key="child.id" class="menu-item-2">
                  <component :is="linkTag" v-bind="getLinkProps(child.url)" class="submenu-link-l2">
                    <span>{{ child.title }}</span>
                    <i v-if="child.children?.length" class="bi bi-chevron-right sub-arrow-right"></i>
                  </component>

                  <!-- Nivel 3 -->
                  <ul v-if="child.children?.length" class="dropdown-level-3 shadow-lg">
                    <li v-for="subChild in child.children" :key="subChild.id" class="menu-item-3">
                      <component :is="linkTag" v-bind="getLinkProps(subChild.url)" class="submenu-link-l3">
                        {{ subChild.title }}
                      </component>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        <!-- Botón Toggle Móvil -->
        <button class="d-lg-none mobile-toggle-btn z-index-top" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menu">
          <i class="bi" :class="mobileMenuOpen ? 'bi-x-lg' : 'bi-list'"></i>
        </button>
      </div>
    </header>

    <!-- Menú Desplegable Móvil -->
    <div class="mobile-menu-wrapper d-lg-none" :class="{ 'is-open': mobileMenuOpen }">
      <div class="mobile-menu-inner"> 
        <ul class="mobile-main-list">
          <li v-for="item in menu" :key="item.id" class="mobile-item">
            <div class="mobile-nav-flex-row">
              <component :is="linkTag" v-bind="getLinkProps(item.url)" class="mobile-link" @click="mobileMenuOpen = false">
                {{ item.title }}
              </component>
              <button v-if="item.children?.length" class="mobile-expand-sub-btn" @click.stop="toggleMobileSubmenu(item.id)">
                <i class="bi bi-chevron-down transition-all" :class="{ 'rotate-180': activeMobileSubmenus[item.id] }"></i>
              </button>
            </div>
            
            <div class="mobile-submenu-collapse" :class="{ 'show': activeMobileSubmenus[item.id] }">
              <ul class="mobile-submenu-list">
                <li v-for="child in item.children" :key="child.id" class="mobile-nested-item">
                  <div class="mobile-nav-flex-row">
                    <component :is="linkTag" v-bind="getLinkProps(child.url)" class="mobile-submenu-link" @click="mobileMenuOpen = false">
                      {{ child.title }}
                    </component>
                    <button v-if="child.children?.length" class="mobile-expand-sub-btn" @click.stop="toggleMobileSubmenu('sub-' + child.id)">
                      <i class="bi bi-chevron-down transition-all" :class="{ 'rotate-180': activeMobileSubmenus['sub-' + child.id] }"></i>
                    </button>
                  </div>

                  <div class="mobile-submenu-collapse" :class="{ 'show': activeMobileSubmenus['sub-' + child.id] }">
                    <ul class="mobile-sub-submenu-list">
                      <li v-for="subChild in child.children" :key="subChild.id" class="mobile-sub-nested-item">
                        <component :is="linkTag" v-bind="getLinkProps(subChild.url)" class="mobile-sub-submenu-link" @click="mobileMenuOpen = false">
                          {{ subChild.title }}
                        </component>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDynamicLink } from '../../../composables/useDynamicLink';
import { useHeaderState } from '../../../composables/useHeaderState';

const props = defineProps<{ 
  config: Record<string, any>; 
  menu: any[];
  linkComponent?: any;
}>();

const { linkTag, getLinkProps } = useDynamicLink(props.linkComponent);
const { scrolled, mobileMenuOpen, activeMobileSubmenus, toggleMobileSubmenu } = useHeaderState();

const safeConfig = computed(() => ({
  logoUrl: props.config?.logoUrl || '',
  logoLink: props.config?.logoLink,
  logoHeight: Number(props.config?.logoHeight) || 65,
  logoHeightScrolled: Number(props.config?.logoHeightScrolled) || 48,
  sticky: props.config?.sticky ?? true,
  isTransparent: props.config?.isTransparent ?? true,
  showTopBar: props.config?.showTopBar ?? false,
  topBarBgColor: props.config?.topBarBgColor || '#db143c',
  topBarTextColor: props.config?.topBarTextColor || '#ffffff',
  navBgColor: props.config?.navBgColor || '#ffffff', 
  navTextColor: props.config?.navTextColor || '#1e293b',
  navTransparentTextColor: props.config?.navTransparentTextColor || '#ffffff',
  navHoverColor: props.config?.navHoverColor || '#db143c',
  socialLinks: Array.isArray(props.config?.socialLinks) ? props.config.socialLinks : [],
  topLinks: Array.isArray(props.config?.topLinks) ? props.config.topLinks : [],
  ctaText: props.config?.ctaText || '',
  ctaUrl: props.config?.ctaUrl || '#',
  ctaIcon: props.config?.ctaIcon || ''
}));
</script>

<style scoped>
.header-master {
  width: 100%; 
  z-index: 1050; 
  position: relative;
  font-family: var(--font-bricolage), system-ui, -apple-system, sans-serif !important; 
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;  
  box-shadow: 0px 4px 8px 0px rgba(100, 116, 139, 0.6);
}

.header-master ul, .header-master li { list-style: none !important; margin: 0; padding: 0; }

.is-sticky {
  position: fixed; top: 0; left: 0; width: 100%; 
  background-color: var(--nav-bg);
  opacity: 0.96;
  animation: navSlideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  box-shadow: 0px 4px 8px 0px rgba(100, 116, 139, 0.6);
}
.is-transparent:not(.is-sticky) { position: absolute; top: 0; left: 0; }

@keyframes navSlideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }

.top-bar-container { height: 38px; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; }
.is-sticky .top-bar-container { height: 0; overflow: hidden; }
.top-container-wrapper { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: space-between; align-items: center; }
.social-icons-wrapper { display: flex; gap: 8px; }
.social-icon-btn { width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid; border-radius: 50%; text-decoration: none; transition: transform 0.2s; }
.social-icon-btn:hover { transform: scale(1.08); }
.top-right-actions { display: flex; align-items: center; gap: 24px; }
.top-mini-links-box { display: flex; gap: 20px; }
.top-mini-link { text-decoration: none; opacity: 0.85; display: flex; align-items: center; gap: 4px; font-weight: 600; }
.top-mini-link:hover { opacity: 1; }
.mini-arrow { font-size: 0.65rem; }

.top-cta-btn { padding: 6px 16px; border-radius: 6px; text-decoration: none; font-size: 0.72rem; text-transform: uppercase; font-weight: 700; display: flex; align-items: center; letter-spacing: 0.5px; transition: opacity 0.2s; }
.top-cta-btn:hover { opacity: 0.9; }

.navbar-main { padding: 1.1rem 0; background-color: var(--nav-bg); position: relative; z-index: 1060; transition: padding 0.25s ease; }
.is-transparent:not(.is-sticky) .navbar-main { background-color: transparent !important; border-bottom: 1px solid rgba(255,255,255,0.1); }
.scrolled-nav { padding: 0.65rem 0; }

.navbar-container-wrapper { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: flex-start; align-items: center; position: relative; }
.logo-box { display: flex; align-items: center; text-decoration: none; flex-shrink: 0; }
.logo-img { display: block; object-fit: contain; transition: height 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.branding-text { color: var(--nav-text); font-size: 1.5rem; font-weight: 800; letter-spacing: -0.5px; }
.is-transparent:not(.is-sticky) .branding-text { color: var(--nav-text-trans); }

.nav-left-aligned-wrapper { position: relative; margin-left: 3.5rem; flex-grow: 1; }
.main-menu { display: flex; margin: 0; padding: 0; gap: 2.2rem; }
.menu-item-1 { position: relative; padding: 14px 0; }
.main-menu-link { color: var(--nav-text); text-decoration: none; font-size: 0.95rem; font-weight: 600; transition: color 0.2s ease; display: flex; align-items: center; gap: 6px; letter-spacing: 0.4px; position: relative; }

.menu-link-text-content { position: relative; padding-bottom: 6px; }
.menu-link-text-content::after { content: ""; position: absolute; bottom: -2px; left: 0; width: 0; height: 3px; background: linear-gradient(90deg, var(--nav-hover) 0%, var(--nav-hover) 100%); border-radius: 4px; transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.menu-item-1:hover .menu-link-text-content::after { width: 100%; }
.menu-item-1:hover .main-menu-link { color: var(--nav-hover); }
.is-transparent:not(.is-sticky) .main-menu-link { color: var(--nav-text-trans); }
.is-transparent:not(.is-sticky) .menu-item-1:hover .main-menu-link { color: var(--nav-hover); }

.menu-arrow-down { font-size: 0.68rem; transition: transform 0.2s ease; opacity: 0.8; }
.menu-item-1:hover .menu-arrow-down { transform: rotate(180deg); color: var(--nav-hover); }

.dropdown-level-2 { position: absolute; top: 100%; left: 0; background-color: #ffffff; min-width: 260px; border-radius: 12px; padding: 8px 0; display: none; box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0; border-top: 4px solid var(--nav-hover); z-index: 2000; }
.menu-item-2 { position: relative; width: 100%; }
.submenu-link-l2 { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; color: var(--nav-text) !important; text-decoration: none; font-size: 0.86rem; font-weight: 700; transition: all 0.2s ease; }
.sub-arrow-right { font-size: 0.7rem; color: #94a3b8; }
.menu-item-1:hover > .dropdown-level-2 { display: block; animation: navFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.menu-item-2:hover > .dropdown-level-3 { display: block; animation: navFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.menu-item-2:hover > .submenu-link-l2 { color: var(--nav-hover) !important; background-color: #f8fafc; }
.menu-item-2:hover .sub-arrow-right { color: var(--nav-hover); }

.dropdown-level-3 { position: absolute; top: -8px; left: 100%; background-color: #ffffff; min-width: 260px; border-radius: 12px; padding: 8px 0; display: none; box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0; border-left: 4px solid var(--nav-hover); z-index: 2010; }
.dropdown-level-3::before { content: ''; position: absolute; top: 0; left: -15px; width: 15px; height: 100%; background: transparent; }
.submenu-link-l3 { display: block; padding: 12px 20px; color: var(--nav-text) !important; opacity: 0.9; text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: all 0.2s ease; }
.submenu-link-l3:hover { color: var(--nav-hover) !important; opacity: 1; background-color: #f8fafc; padding-left: 24px; }

@keyframes navFadeIn { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }

.mobile-toggle-btn { background: transparent; border: none; font-size: 1.8rem; color: var(--nav-text); cursor: pointer; display: flex; align-items: center; margin-left: auto; }
.is-transparent:not(.is-sticky) .mobile-toggle-btn { color: var(--nav-text-trans); }
.mobile-menu-wrapper { position: absolute; top: 100%; left: 0; width: 100%; background-color: #ffffff; box-shadow: 0 15px 30px rgba(15, 23, 42, 0.06); max-height: 0; overflow: hidden; transition: max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1); z-index: 1050; }
.mobile-menu-wrapper.is-open { max-height: 85vh; overflow-y: auto; border-top: 1px solid #f1f5f9; }
.mobile-menu-inner { padding: 10px 24px 30px 24px; }
.mobile-nav-flex-row { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.mobile-link { display: block; padding: 14px 0; color: #1e293b; text-decoration: none; font-weight: 700; text-transform: uppercase; font-size: 0.88rem; flex-grow: 1; }
.mobile-expand-sub-btn { background: none; border: none; padding: 10px; color: #64748b; cursor: pointer; display: flex; align-items: center; }
.mobile-submenu-collapse { max-height: 0; overflow: hidden; transition: max-height 0.25s ease-out; }
.mobile-submenu-collapse.show { max-height: 1500px; transition: max-height 0.45s ease-in; }
.rotate-180 { transform: rotate(180deg); }
.mobile-submenu-list { margin: 4px 0 12px 0; border-left: 2px solid #e2e8f0; }
.mobile-submenu-link { display: block; padding: 10px 0; color: #334155; text-decoration: none; font-size: 0.86rem; font-weight: 700; flex-grow: 1; }
.mobile-sub-submenu-list { margin: 4px 0 8px 0; border-left: 2px solid #cbd5e1; }
.mobile-sub-submenu-link { display: block; padding: 8px 0; color: #64748b; text-decoration: none; font-size: 0.82rem; font-weight: 600; }
.z-index-top { position: relative; z-index: 1070; }
.transition-all { transition: all 0.2s ease; }

@media (max-width: 640px) {
  .cta-desktop-text { display: none; }
  .cta-mobile-text { display: inline; }
  .top-mini-links-box { display: none; }
}
</style>
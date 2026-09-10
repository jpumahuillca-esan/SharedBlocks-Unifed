<!-- src/shared/components/branding/header-mega/components/MegaMenuFlyout.vue -->
<template>
  <div class="mega-menu-dropdown-wrapper">
    <div class="mega-menu-inner-container">
      
      <div class="mega-menu-header">
        <component 
          :is="linkTag" 
          v-bind="getLinkProps(rootItem.url)"
          class="mega-header-link"
          @click="$emit('close')" 
        >
        <!-- 🔴 [CIERRE: Nivel 1] -->
          <span class="mega-header-text">{{ rootItem.header_title || rootItem.title }}</span>
          <i class="bi bi-arrow-right mega-header-arrow"></i>
        </component>
        <div class="header-red-divider"></div>
      </div>

      <div class="mega-menu-grid">
        
        <div class="mega-tabs-column">
          <ul class="mega-tabs-list">
            <li v-for="tab in level2Items" :key="tab.id">
              <component
                :is="linkTag"
                v-bind="getLinkProps(tab.url)"
                class="mega-tab-link"
                :class="{ 'is-active': activeTab?.id === tab.id }"
                @mouseenter="activeTabId = tab.id"
                @click="$emit('close')" 
              >
              <!-- 🔴 [CIERRE: Pestaña Nivel 2] -->
                <span class="tab-label">{{ tab.title }}</span>
                <i class="bi bi-chevron-right tab-arrow"></i>
              </component>
            </li>
          </ul>
        </div>

        <!-- COLUMNA DERECHA: Contenido Dinámico -->
        <div class="mega-content-column">
          <div v-if="activeTab" class="w-100 h-100">

            <div v-if="activeTab.layout === 'columns'" class="prototype-columns-grid">
              <div 
                v-for="group in activeTab.children" 
                :key="group.id" 
                class="column-group"
              >
                <!-- Título del Grupo / Facultad (Nivel 3) -->
                <component
                  :is="group.url && group.url !== '#' ? linkTag : 'h6'"
                  v-bind="group.url && group.url !== '#' ? getLinkProps(group.url) : {}"
                  class="column-group-title"
                  @click="group.url && group.url !== '#' ? $emit('close') : null" 
                >
                  {{ group.title }}
                </component>
                <!-- 🔴 [CIERRE: Grupo Nivel 3] -->
                <ul v-if="group.children?.length" class="column-links-list">
                  <li v-for="subItem in group.children" :key="subItem.id">
                    <component 
                      :is="linkTag" 
                      v-bind="getLinkProps(subItem.url)" 
                      class="column-item-link"
                      @click="$emit('close')"
                    >
                      {{ subItem.title }}
                    </component>
                 <!-- 🔴 [CIERRE: Sub-enlace Nivel 4] -->

                  </li>
                </ul>
              </div>
            </div>


            <div v-else-if="activeTab.layout === 'banner_split'" class="prototype-banner-split">
              <div class="banner-links-box">
                <component
                  :is="activeTab.url && activeTab.url !== '#' ? linkTag : 'h6'"
                  v-bind="activeTab.url && activeTab.url !== '#' ? getLinkProps(activeTab.url) : {}"
                  class="column-group-title"
                  @click="activeTab.url && activeTab.url !== '#' ? $emit('close') : null" 
                >
                  {{ activeTab.title }}
                </component>
                <!-- 🔴 [CIERRE: Título Banner Nivel 3] -->
                <ul class="column-links-list">
                  <li v-for="item in activeTab.children" :key="item.id">
                    <component 
                      :is="linkTag" 
                      v-bind="getLinkProps(item.url)" 
                      class="column-item-link"
                      @click="$emit('close')" 
                    >
                      {{ item.title }}
                    </component>
                    <!-- 🔴 [CIERRE: Enlace Lista Nivel 3] -->
                  </li>
                </ul>
              </div>

              <div class="banner-display-box">
                <component
                  :is="activeTab.banner_url ? linkTag : 'div'"
                  v-bind="activeTab.banner_url ? getLinkProps(activeTab.banner_url) : {}"
                  class="promo-banner-card"
                  :style="activeTab.banner_image ? { backgroundImage: `url(${activeTab.banner_image})` } : {}"
                  @click="activeTab.banner_url ? $emit('close') : null" 
                >
                <!-- 🔴 [CIERRE: Clic en Banner] -->
                  <div v-if="!activeTab.banner_image" class="banner-empty-placeholder">
                    <i class="bi bi-image placeholder-icon"></i>
                    <span>Banner</span>
                  </div>
                  <div v-else-if="activeTab.banner_title" class="banner-overlay-info">
                    <AtomHeading :level="5" class="banner-caption">{{ activeTab.banner_title }}</AtomHeading>
                  </div>
                </component>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AtomHeading from '../../../../ui/atoms/AtomHeading.vue';
import { ref, computed, watch } from 'vue';
import { useDynamicLink } from '../../../../../composables/useDynamicLink';

const props = defineProps<{
  rootItem: any;
  linkComponent?: any;
}>();

// 🔴 
defineEmits<{
  (e: 'close'): void;
}>();

const { linkTag, getLinkProps } = useDynamicLink(props.linkComponent);

const level2Items = computed(() => props.rootItem?.children || []);
const activeTabId = ref<string | number | null>(null);

watch(
  () => level2Items.value,
  (items) => {
    if (items.length > 0) {
      activeTabId.value = items[0].id;
    }
  },
  { immediate: true }
);

const activeTab = computed(() => {
  return level2Items.value.find((tab: any) => tab.id === activeTabId.value) || level2Items.value[0];
});
</script>

<style scoped>
.mega-menu-dropdown-wrapper {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border-top: 1px solid #f1f5f9;
  box-shadow: 0 25px 40px -10px rgba(0, 0, 0, 0.12);
  z-index: 1050;
  animation: megaDropdownSlide 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes megaDropdownSlide {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.mega-menu-inner-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 24px 24px 36px 24px;
}

.mega-menu-header { margin-bottom: 24px; }
.mega-header-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  margin-bottom: 8px;
}
.mega-header-text {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
}
.mega-header-arrow { color: #e31140; font-size: 1.25rem; }
.header-red-divider { width: 100%; height: 2px; background-color: #e31140; }

.mega-menu-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 36px;
}

.mega-tabs-list {
  list-style: none;
  margin: 0;
  padding: 0 16px 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-right: 1px solid #f1f5f9;
}

.mega-tab-link {
  width: 100%;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.92rem;
  font-weight: 600;
  color: #334155;
  transition: all 0.15s ease;
}

.mega-tab-link:hover {
  background-color: #f8fafc;
  color: #0f172a;
}

.mega-tab-link.is-active {
  background-color: #e31140 !important;
  color: #ffffff !important;
}

.tab-arrow { font-size: 0.75rem; opacity: 0.6; }
.mega-tab-link.is-active .tab-arrow { opacity: 1; }

.prototype-columns-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px 32px;
}

.column-group-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
  text-decoration: none;
  display: block;
}

.column-links-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.column-item-link {
  display: block;
  padding: 6px 0;
  color: #475569;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.15s ease;
}

.column-item-link:hover {
  color: #e31140;
  padding-left: 4px;
}

.prototype-banner-split {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 36px;
  height: 100%;
}

.promo-banner-card {
  width: 100%;
  min-height: 290px;
  height: 100%;
  background-color: #cbd5e1;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.banner-empty-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 700;
}

.placeholder-icon { font-size: 2.5rem; opacity: 0.7; }
.banner-overlay-info {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%);
  display: flex;
  align-items: flex-end;
  padding: 20px;
}
.banner-caption { color: #ffffff; font-size: 1.15rem; font-weight: 700; margin: 0; }
</style>
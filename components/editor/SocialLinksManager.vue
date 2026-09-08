<template>
  <div class="social-manager">
    <div v-for="(item, index) in items" :key="index" class="card p-2 mb-2 border rounded shadow-sm bg-white position-relative">
      <button 
        type="button" 
        class="btn btn-sm text-danger position-absolute top-0 end-0 m-1 p-0 border-0 bg-transparent" 
        @click="removeItem(index)"
      >
        <i class="bi bi-trash"></i>
      </button>

      <div class="d-flex gap-2">
        <div class="input-group input-group-sm">
          <span class="input-group-text bg-white border">
            <i :class="item.icon || 'bi bi-link-45deg'" class="fs-6"></i>
          </span>
          <input type="text" class="form-control bg-light" v-model="item.icon" placeholder="Clase CSS" />
          <button 
            class="btn btn-light border" 
            type="button" 
            @click="activeIconIndex = activeIconIndex === index ? null : index"
          >
            <i class="bi bi-search"></i>
          </button>
        </div>
        <input type="text" class="form-control form-control-sm w-50" v-model="item.url" placeholder="https://..." />
      </div>

      <!-- Paleta rápida de iconos sugeridos -->
      <div v-if="activeIconIndex === index" class="bg-light p-2 border rounded mt-2">
        <div class="d-flex flex-wrap gap-1 justify-content-center">
          <button 
            v-for="icon in iconCatalog" 
            :key="icon" 
            type="button" 
            class="btn btn-light border p-0 rounded" 
            style="width: 30px; height: 30px;"
            @click="selectIcon(index, icon)"
          >
            <i :class="icon" class="fs-6 text-dark"></i>
          </button>
        </div>
      </div>
    </div>

    <button type="button" class="btn btn-sm btn-outline-primary dashed-btn w-100" @click="addItem">
      + Agregar Red Social
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    items: Array<{ icon: string; url: string }>;
    iconCatalog?: string[];
  }>(),
  {
    iconCatalog: () => [
      'bi bi-facebook', 'bi bi-twitter-x', 'bi bi-instagram', 'bi bi-youtube',
      'bi bi-linkedin', 'bi bi-tiktok', 'bi bi-whatsapp', 'bi bi-telegram',
      'bi bi-envelope', 'bi bi-telephone', 'bi bi-globe', 'bi bi-database',
      'bi bi-link-45deg', 'bi bi-geo-alt', 'bi bi-mortarboard', 'bi bi-briefcase'
    ],
  }
);

const activeIconIndex = ref<number | null>(null);

const addItem = () => {
  props.items.push({ icon: 'bi bi-link-45deg', url: '#' });
};

const removeItem = (index: number) => {
  props.items.splice(index, 1);
  if (activeIconIndex.value === index) activeIconIndex.value = null;
};

const selectIcon = (index: number, icon: string) => {
  props.items[index].icon = icon;
  activeIconIndex.value = null;
};
</script>

<style scoped>
.dashed-btn { border-style: dashed; }
</style>
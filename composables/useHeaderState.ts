import { onMounted, onUnmounted, ref } from "vue";


export function useHeaderState(scrollThreshold = 40, breakpoint = 992){
    const scrolled = ref(false);
    const mobileMenuOpen = ref(false);
    const activeMobileSubmenus = ref<Record<string | number, boolean>>({});

    const handleScroll = () => {
        if(typeof window !== 'undefined'){
            scrolled.value = window.scrollY > scrollThreshold;
        }
    };

    const handleResize = () => {
        if(typeof window !== 'undefined' && window.innerWidth >= breakpoint) {
            mobileMenuOpen.value = false;
            activeMobileSubmenus.value = {};
        }
    };

    const toggleMobileSubmenu = (itemId: string | number) => {
    activeMobileSubmenus.value[itemId] = !activeMobileSubmenus.value[itemId];
  };

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleResize, { passive: true });
    }
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    }
  });

  return {
    scrolled,
    mobileMenuOpen,
    activeMobileSubmenus,
    toggleMobileSubmenu,
  };
}
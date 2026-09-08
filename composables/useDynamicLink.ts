import { computed } from 'vue';

export function useDynamicLink(customComponent?: any) {
  const linkTag = computed(() => customComponent || 'a');

  const getLinkProps = (url: string | null | undefined) => {
    const finalUrl = url || '#';
    return linkTag.value === 'a' 
      ? { href: finalUrl } 
      : { to: finalUrl };
  };

  return {
    linkTag,
    getLinkProps,
  };
}
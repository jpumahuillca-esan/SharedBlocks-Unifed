export const formatImageUrl = (url?: string) => {
  if (!url) return 'https://placehold.co/600x400?text=Sin+Imagen';

  const baseUrl = (
    (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SITE_URL || import.meta.env?.VITE_MEDIA_URL)) || 
    ''
  ).replace(/\/+$/, "");

  let sanitizedUrl = url;
  if (
    sanitizedUrl.includes('127.0.0.1:8000') || 
    sanitizedUrl.includes('localhost:8000') ||
    /172\.\d+\.\d+\.\d+:8000/.test(sanitizedUrl) ||
    sanitizedUrl.includes('admin.redgirdaccperu.edu.pe') ||
    sanitizedUrl.includes('admin.esan.edu.pe')
  ) {
    sanitizedUrl = sanitizedUrl
      .replace(/^https?:\/\/(127\.0\.0\.1|localhost|172\.\d+\.\d+\.\d+):8000/, baseUrl)
      .replace('https://admin.redgirdaccperu.edu.pe', baseUrl)
      .replace('https://admin.esan.edu.pe', baseUrl);
  }

  if (sanitizedUrl.startsWith('http') && !sanitizedUrl.includes('/storage/')) {
    return sanitizedUrl;
  }

  let cleanPath = sanitizedUrl;
  if (sanitizedUrl.includes('storage/')) {
    cleanPath = sanitizedUrl.split('storage/').pop() || ''; 
  }

  cleanPath = cleanPath
    .replace('public/', "")
    .replace(/^\/+/, "") 
    .replace(/\/+/g, "/");

  return baseUrl ? `${baseUrl}/storage/${cleanPath}` : `/storage/${cleanPath}`;
};
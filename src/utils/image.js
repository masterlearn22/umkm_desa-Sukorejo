export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  const base = import.meta.env.BASE_URL;
  
  if (url.startsWith('/')) {
    return `${base}${url.slice(1)}`;
  }
  return `${base}${url}`;
};

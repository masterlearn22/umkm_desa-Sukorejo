export const resolveImageUrl = (url) => {
  if (!url) return '';
  
  // Convert standard Google Drive view link to direct image link
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }
  
  if (url.startsWith('http')) return url;
  
  const base = import.meta.env.BASE_URL;
  
  if (url.startsWith('/')) {
    return `${base}${url.slice(1)}`;
  }
  return `${base}${url}`;
};

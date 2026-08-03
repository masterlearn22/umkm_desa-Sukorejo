export const resolveImageUrl = (url) => {
  if (!url) return '';
  
  // Convert standard Google Drive view link to direct image link using thumbnail endpoint (more reliable for embedding)
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }
  }

  // Also convert old uc?export=view links to thumbnail endpoint to bypass recent Google blocks
  if (url.includes('drive.google.com/uc')) {
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }
  }
  
  if (url.startsWith('http')) return url;
  
  const base = import.meta.env.BASE_URL;
  
  if (url.startsWith('/')) {
    return `${base}${url.slice(1)}`;
  }
  return `${base}${url}`;
};

import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website',
  keywords = ''
}) => {
  const siteName = "BUMDes Sukorejo";
  const defaultTitle = "BUMDes Sukorejo - Pusat Produk Unggulan & UMKM";
  const defaultDescription = "Temukan berbagai produk unggulan, kerajinan, dan layanan terbaik dari UMKM Desa Sukorejo Banyuwangi. Dukung ekonomi lokal bersama BUMDes Sukorejo.";
  const defaultImage = "https://images.unsplash.com/photo-1596422846543-74c6fc1e360f?auto=format&fit=crop&q=80"; // A scenic village/agriculture image as fallback
  const defaultKeywords = "UMKM Sukorejo, BUMDes, Banyuwangi, Produk Desa, Kerajinan, Pertanian";

  const metaTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaImage = image || defaultImage;
  const metaKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
  const metaUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEO;

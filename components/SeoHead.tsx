import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

export const SeoHead = ({ 
  title, 
  description = "Create stunning digital wedding invitations instantly.", 
  image = "https://xfantasypro.com/default-og.jpg", // We will fix this URL later
  url = typeof window !== 'undefined' ? window.location.href : ''
}: SeoProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};


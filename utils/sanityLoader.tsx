export default function sanityLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const baseUrl = 'https://cdn.sanity.io';

  const srcUrl = new URL(src);
  const relativePath = srcUrl.pathname; // You want only the path part from src

  // Now form the new URL
  const url = new URL(relativePath, baseUrl);
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'max');
  url.searchParams.set('w', width.toString());

  if (quality) {
    url.searchParams.set('q', quality.toString());
  }

  return url.href;
}

export function createSanityLoader(defaults: { width: number; quality?: number }) {
  return ({ src, width, quality }: { src: string; width?: number; quality?: number }) => {
    return sanityLoader({ 
      src, 
      width: width ?? defaults.width, 
      quality: quality ?? defaults.quality 
    });
  };
}

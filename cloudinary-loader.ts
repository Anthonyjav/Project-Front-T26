export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  // Imágenes de Cloudinary — ya optimizadas, Next.js no las retoca
  if (src.includes('cloudinary.com')) {
    if (src.includes('/upload/w_')) return src // ya tiene transformaciones
    return src.replace('/upload/', `/upload/w_${width},q_${quality ?? 'auto'},f_auto/`)
  }

  // Imágenes locales o de otro dominio — Next.js las procesa normal
  return src
}
import Image, { type ImageProps } from "next/image";

const responsiveMedia: Record<string, { name: string; widths: number[] }> = {
  "/images/projects/缺陷检测装置1.png": { name: "waterbag", widths: [480, 800] },
  "/images/projects/Robomaster封面.png": { name: "autoaim", widths: [480, 800, 1280] },
  "/images/projects/3041149f-a6cf-4b66-aefa-e2e29be65b78.png": { name: "mascot", widths: [480, 800, 1280] },
  "https://raw.githubusercontent.com/MzKyle/DataScope-Studio/main/docs/assets/cover.png": { name: "datascope", widths: [480, 800, 1280] },
  "/images/evidence/autoaim-result.png": { name: "autoaim-result", widths: [480, 800] },
};

export function PortfolioImage({ src, sizes, alt, ...props }: ImageProps) {
  const media = typeof src === "string" ? responsiveMedia[src] : undefined;
  if (!media) return <Image {...props} src={src} sizes={sizes} alt={alt} unoptimized />;
  const url = (width: number) => `/images/projects/optimized/${media.name}-${width}.webp`;
  return <picture className="portfolio-picture">
    <source type="image/webp" srcSet={media.widths.map(width => `${url(width)} ${width}w`).join(", ")} sizes={sizes ?? "100vw"} />
    <Image {...props} src={url(media.widths[media.widths.length - 1])} sizes={sizes} alt={alt} unoptimized />
  </picture>;
}

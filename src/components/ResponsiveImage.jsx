import React from "react";
import images from "../data/images.json";
export default function ResponsiveImage({
  src,
  alt,
  hero = false,
  sizes = "(max-width: 760px) 100vw, 50vw",
  ...props
}) {
  const image = images[src.replace("/images/", "")];
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={image.variants.map((v) => `${v.avif} ${v.width}w`).join(", ")}
        sizes={sizes}
      />
      <img
        {...props}
        src={image.variants.at(-1).webp}
        srcSet={image.variants.map((v) => `${v.webp} ${v.width}w`).join(", ")}
        sizes={sizes}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={hero ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={hero ? "high" : undefined}
      />
    </picture>
  );
}

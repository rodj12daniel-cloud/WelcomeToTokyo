import React from "react";

const RESPONSIVE_WIDTHS = [480, 768, 1200, 1600, 2400, 3200, 3840];

function getProvider(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "images.pexels.com") return "pexels";
    if (parsed.hostname === "images.unsplash.com") return "unsplash";
  } catch {
    return null;
  }
  return null;
}

function buildVariant(url, provider, width, format) {
  const parsed = new URL(url);
  parsed.searchParams.set("w", String(width));
  parsed.searchParams.set("fm", format);
  if (provider === "unsplash") {
    parsed.searchParams.set("auto", "format");
    parsed.searchParams.set("q", "90");
  }
  return parsed.toString();
}

function buildSrcSet(url, provider, format) {
  return RESPONSIVE_WIDTHS.map((width) => `${buildVariant(url, provider, width, format)} ${width}w`).join(", ");
}

export default function OptimizedImage({
  src,
  alt = "",
  priority = false,
  sizes = "100vw",
  loading,
  decoding = "async",
  ...props
}) {
  const provider = getProvider(src);
  const fallback = provider ? buildVariant(src, provider, RESPONSIVE_WIDTHS[3], "jpg") : src;
  const imageProps = {
    ...props,
    alt,
    src: fallback,
    ...(provider ? { srcSet: buildSrcSet(src, provider, "jpg") } : {}),
    sizes,
    loading: loading ?? (priority ? "eager" : "lazy"),
    decoding,
    fetchPriority: priority ? "high" : "auto",
  };

  if (!provider) return <img {...imageProps} />;

  return (
    <picture>
      <source type="image/avif" srcSet={buildSrcSet(src, provider, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet(src, provider, "webp")} sizes={sizes} />
      <img {...imageProps} />
    </picture>
  );
}
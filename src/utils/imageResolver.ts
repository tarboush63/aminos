// src/utils/imageResolver.ts
/**
 * Resolve images from /src/assets using Vite's import.meta.glob with eager option (build-time).
 * Returns a URL string appropriate for <img src=...>.
 *
 * product.image may be:
 *  - bare filename like "glp-rt30.jpg"
 *  - "@/assets/glp-rt30.jpg"
 *  - public path "/images/..."
 *  - remote URL "https://..."
 */

type AssetMap = Record<string, string>;

// Use import.meta.glob with eager: true (works with Vite types)
const modules = import.meta.glob("/src/assets/*.{png,jpg,jpeg,webp,svg}", { eager: true }) as Record<
  string,
  { default: string }
>;

const assetMap: AssetMap = Object.entries(modules).reduce((acc, [filePath, mod]) => {
  const parts = filePath.split("/");
  const filename = parts[parts.length - 1].toLowerCase();
  acc[filename] = (mod as any).default as string;
  return acc;
}, {} as AssetMap);

// locate placeholder in assets or fall back to public placeholder path
const PLACEHOLDER =
  assetMap["placeholder.png"] ||
  assetMap["placeholder.jpg"] ||
  assetMap["placeholder.jpeg"] ||
  "/images/placeholder.png";

export function resolveImage(imageRef?: string | null): string {
  if (!imageRef) return PLACEHOLDER;

  if (/^https?:\/\//i.test(imageRef)) return imageRef; // remote
  if (imageRef.startsWith("/")) return imageRef; // public path

  const filename = imageRef.split("/").pop()?.toLowerCase() ?? "";
  if (filename && assetMap[filename]) return assetMap[filename];

  // handle "@/assets/..." style by taking basename
  const basename = imageRef.replace(/^.*[\\/]/, "").toLowerCase();
  if (basename && assetMap[basename]) return assetMap[basename];

  return PLACEHOLDER;
}

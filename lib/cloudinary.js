import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ secure: true }); // reads CLOUDINARY_URL

export { cloudinary };
export const TAG = "shopsnap";

const CATEGORIES = {
  Clothing: ["saree", "sari", "dress", "shirt", "kurta", "clothing", "apparel", "fashion", "textile", "scarf", "jeans"],
  Kitchen: ["bottle", "cup", "pot", "pan", "kitchen", "steel", "bowl", "plate", "utensil", "cookware"],
  Food: ["food", "cake", "sweet", "snack", "dessert", "bread", "cookie", "pickle"],
  Jewellery: ["jewelry", "jewellery", "necklace", "ring", "earring", "bracelet"],
  Electronics: ["phone", "electronics", "headphones", "charger", "laptop", "speaker"],
  Home: ["candle", "vase", "decor", "furniture", "pillow", "lamp", "rug"],
};

export function guessCategory(tags = []) {
  const t = tags.map((x) => x.toLowerCase());
  for (const [cat, words] of Object.entries(CATEGORIES)) {
    if (t.some((x) => words.some((w) => x.includes(w)))) return cat;
  }
  return "General";
}

export function guessTitle(tags = []) {
  const t = tags.find((x) => x !== TAG) || "Product";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// One upload -> every format a seller needs. The AI work happens in the URL.
const cleanPad = (w, h) => [
  { width: w, height: h, crop: "fill", gravity: "auto" },      // content-aware crop
  { effect: "background_removal" },                              // AI background removal
  { width: w, height: h, crop: "pad", background: "white" },     // clean white studio
  { fetch_format: "auto", quality: "auto" },                     // f_auto,q_auto
];

export function variants(publicId) {
  const u = (transformation) => cloudinary.url(publicId, { secure: true, transformation });
  return {
    original: u([{ width: 800, crop: "limit" }, { fetch_format: "auto", quality: "auto" }]),
    square: u(cleanPad(1080, 1080)),
    story: u(cleanPad(1080, 1920)),
    web: u(cleanPad(1600, 900)),
  };
}

export function shape(r) {
  const tags = (r.tags || []).filter((t) => t !== TAG);
  return {
    publicId: r.public_id,
    title: r.context?.custom?.title || r.context?.title || guessTitle(tags),
    category: r.metadata?.category || guessCategory(tags),
    tags,
    variants: variants(r.public_id),
  };
}

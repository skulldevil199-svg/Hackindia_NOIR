# ShopSnap: phone photo in, professional catalog out

**Track 1: AI Media Pipelines** (Cloudinary x HackIndia)

## The problem
Small Indian sellers (kirana stores, Instagram boutiques, WhatsApp resellers, home bakers) shoot products on a phone against a messy background. Their listings look amateur, and writing titles, tags and categories by hand is slow. Most can't afford a photographer.

## What ShopSnap does
Upload one raw photo. Cloudinary's AI does the rest:

| Step | Cloudinary feature |
|---|---|
| Reject unsafe images | Upload API `moderation` (AI moderation add-on) |
| Clean white background | `e_background_removal` |
| Instagram, Story and web crops | `c_fill,g_auto` content-aware cropping |
| Auto title, tags, category | `categorization` + `auto_tagging` |
| Store category and status | Structured metadata |
| Find products fast | Search API (tags, metadata, context) |
| Fast on slow networks | `f_auto,q_auto` on every URL |

The seller gets a searchable catalog and a Share on WhatsApp link per product.

## Run it locally
1. `npm install`
2. Create a free Cloudinary account and copy your API environment variable.
3. `cp .env.example .env.local` and paste it into `CLOUDINARY_URL`.
4. In Cloudinary Console > Settings > Add-ons, enable **AI Moderation**, **Google Auto Tagging** and **Cloudinary AI Background Removal** (free plans include limited usage). Leave `CLD_MODERATION` or `CLD_TAGGING` blank in `.env.local` to skip one.
5. `npm run setup` (creates the `category` and `status` metadata fields, run once).
6. `npm run dev` and open http://localhost:3000.

## How to test
1. Upload a product photo taken on a cluttered background.
2. Compare Before and After, then open the Instagram, Story and Web variants.
3. Check the detected tags, title and category.
4. Search the catalog by tag or category, e.g. `kitchen`.
5. Upload an inappropriate image to see moderation reject it.

## Deploy
Push to GitHub, import into Vercel, and set `CLOUDINARY_URL`, `CLD_MODERATION`, `CLD_TAGGING` as environment variables. No credentials are stored in this repo.

## Notes
- The first request for a background-removed image can take a few seconds, so the UI retries automatically.
- Vercel limits request bodies to about 4.5 MB on serverless functions; use photos under that size.

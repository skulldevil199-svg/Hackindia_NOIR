// Run once: npm run setup  (creates the structured metadata fields ShopSnap uses)
import { v2 as cloudinary } from "cloudinary";
for (const [external_id, label] of [["category", "Category"], ["status", "Status"]]) {
  try {
    await cloudinary.api.add_metadata_field({ external_id, label, type: "string" });
    console.log("created", external_id);
  } catch (e) {
    console.log(external_id, "->", e.error?.message || e.message);
  }
}

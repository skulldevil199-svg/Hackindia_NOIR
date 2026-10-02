
import { cloudinary, TAG, shape } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const q = (new URL(req.url).searchParams.get("q") || "").replace(/[^a-zA-Z0-9]/g, "").trim();
    let expr = `tags=${TAG}`;
    if (q) expr += ` AND (tags=${q} OR metadata.category=${q} OR context.title=${q}*)`;
    const res = await cloudinary.search
      .expression(expr)
      .sort_by("created_at", "desc")
      .with_field("tags").with_field("context").with_field("metadata")
      .max_results(30)
      .execute();
    return Response.json(res.resources.map(shape));
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

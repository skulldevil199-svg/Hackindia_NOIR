import { cloudinary, TAG, guessCategory, guessTitle, shape } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

const upload = (buf, opts) =>
  new Promise((res, rej) => cloudinary.uploader.upload_stream(opts, (e, r) => (e ? rej(e) : res(r))).end(buf));

export async function POST(req) {
  try {
    const file = (await req.formData()).get("file");
    if (!file || !file.type?.startsWith("image/")) return Response.json({ error: "Upload an image file." }, { status: 400 });

    const opts = { resource_type: "image", tags: [TAG] };
    if (process.env.CLD_MODERATION) opts.moderation = process.env.CLD_MODERATION;
    if (process.env.CLD_TAGGING) { opts.categorization = process.env.CLD_TAGGING; opts.auto_tagging = 0.6; }

    const r = await upload(Buffer.from(await file.arrayBuffer()), opts);

    if (r.moderation?.some((m) => m.status === "rejected")) {
      await cloudinary.uploader.destroy(r.public_id);
      return Response.json({ error: "This photo was rejected by content moderation. Upload a clear product photo." }, { status: 422 });
    }

    const tags = (r.tags || []).filter((t) => t !== TAG);
    const category = guessCategory(tags);
    const title = guessTitle(tags);
    await cloudinary.uploader.update_metadata({ category, status: "draft" }, [r.public_id]);
    await cloudinary.uploader.add_context(`title=${title.replace(/[=|]/g, " ")}`, [r.public_id]);

    return Response.json(shape({ ...r, context: { custom: { title } }, metadata: { category } }));
  } catch (e) {
    return Response.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}

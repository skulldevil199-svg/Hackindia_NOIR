"use client";
import { useEffect, useState, useCallback } from "react";

// Background removal renders on first request, so retry a few times.
function Img({ src, alt }) {
  const [n, setN] = useState(0);
  return (
    <img
      src={n ? `${src}${src.includes("?") ? "&" : "?"}r=${n}` : src}
      alt={alt}
      loading="lazy"
      onError={() => n < 6 && setTimeout(() => setN(n + 1), 2500)}
    />
  );
}

const wa = (p, url) => `https://wa.me/?text=${encodeURIComponent(`${p.title} (${p.category}) ${url}`)}`;

export default function Home() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  const load = useCallback(async (query = "") => {
    const r = await fetch(`/api/catalog?q=${encodeURIComponent(query)}`);
    const d = await r.json();
    if (Array.isArray(d)) setItems(d);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setError(""); setResult(null);
    const fd = new FormData(); fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) return setError(d.error);
    setResult(d); load(q);
  }

  return (
    <main>
      <header>
        <h1>ShopSnap</h1>
        <p>Shoot your product on your phone. Get a clean catalog photo in every size, tagged and ready to share.</p>
      </header>

      <label className="drop">
        <input type="file" accept="image/*" onChange={onFile} disabled={busy} />
        {busy ? "Cleaning up your photo…" : "Choose a product photo"}
      </label>
      {error && <p className="error" role="alert">{error}</p>}

      {result && (
        <section className="result">
          <div className="ba">
            <figure><Img src={result.variants.original} alt="Original photo" /><figcaption>Before</figcaption></figure>
            <figure><Img src={result.variants.square} alt="Cleaned photo" /><figcaption>After</figcaption></figure>
          </div>
          <h2>{result.title} <span className="chip">{result.category}</span></h2>
          <p className="tags">{result.tags.join(", ") || "No tags detected"}</p>
          <div className="sizes">
            {[["Instagram post", "square"], ["Story", "story"], ["Web store", "web"]].map(([l, k]) => (
              <a key={k} href={result.variants[k]} target="_blank" rel="noreferrer">{l}</a>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="bar">
          <h2>Your catalog</h2>
          <input placeholder="Search: saree, kitchen…" value={q}
            onChange={(e) => { setQ(e.target.value); load(e.target.value); }} />
        </div>
        {items.length === 0 && <p className="muted">No products yet. Upload your first photo above.</p>}
        <div className="grid">
          {items.map((p) => (
            <article key={p.publicId}>
              <Img src={p.variants.square} alt={p.title} />
              <h3>{p.title}</h3>
              <span className="chip">{p.category}</span>
              <a className="share" target="_blank" rel="noreferrer" href={wa(p, p.variants.square)}>Share on WhatsApp</a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

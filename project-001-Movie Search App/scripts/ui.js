const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' fill='%231a1a24'%3E%3Crect width='200' height='300'/%3E%3Ctext x='50%25' y='50%25' fill='%23555' font-family='sans-serif' font-size='14' text-anchor='middle' dy='.35em'%3ENo Poster%3C/text%3E%3C/svg%3E";

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function posterSrc(url) {
  return url && url !== "N/A" ? url : PLACEHOLDER_IMG;
}

const UI = {
  /* ── Poster Card ── */
  createCard(item) {
    const el = document.createElement("div");
    el.className = "poster-card";
    el.dataset.id = item.imdbID;
    el.innerHTML = `
      <img src="${posterSrc(item.Poster)}" alt="${esc(item.Title)}" loading="lazy"/>
      <div class="card-info">
        <div class="card-title">${esc(item.Title)}</div>
        <div class="card-year">${esc(item.Year)}</div>
      </div>`;
    return el;
  },

  renderCards(container, items) {
    container.innerHTML = "";
    (items || []).forEach((m) => container.appendChild(UI.createCard(m)));
  },

  /* ── Hero ── */
  setHero({ title, meta, poster }) {
    const bg = document.getElementById("heroBg");
    const blur = document.getElementById("bgBlur");
    const titleEl = document.getElementById("heroTitle");
    const metaEl = document.getElementById("heroMeta");

    if (titleEl) titleEl.textContent = title || "";
    if (metaEl) metaEl.innerHTML = meta || "";

    const src = posterSrc(poster);
    if (bg) bg.style.backgroundImage = `url(${src})`;
    if (blur) blur.style.backgroundImage = `url(${src})`;
  },

  /* ── Search Overlay ── */
  openSearch() {
    const o = document.getElementById("searchOverlay");
    const inp = document.getElementById("searchInput");
    const res = document.getElementById("searchResults");
    if (o) o.classList.remove("hidden");
    if (inp) { inp.value = ""; inp.focus(); }
    if (res) res.innerHTML = "";
    UI.searchError("");
    UI.searchLoading(false);
  },
  closeSearch() {
    const o = document.getElementById("searchOverlay");
    if (o) o.classList.add("hidden");
  },
  searchLoading(on) {
    const s = document.getElementById("searchSpinner");
    if (s) s.classList.toggle("hidden", !on);
  },
  searchError(msg) {
    const el = document.getElementById("searchError");
    if (!el) return;
    el.textContent = msg || "";
    el.classList.toggle("hidden", !msg);
  },

  /* ── My List helpers ── */
  listLoading(on) {
    const s = document.getElementById("listSpinner");
    if (s) s.classList.toggle("hidden", !on);
  },
  listError(msg) {
    const el = document.getElementById("listError");
    if (!el) return;
    el.textContent = msg || "";
    el.classList.toggle("hidden", !msg);
  },
  listEmpty(on) {
    const el = document.getElementById("listEmpty");
    if (el) el.classList.toggle("hidden", !on);
  },

  /* ── Modal ── */
  openModal() {
    const o = document.getElementById("modalOverlay");
    const sp = document.getElementById("modalSpinner");
    const d = document.getElementById("modalDetail");
    if (o) o.classList.remove("hidden");
    if (sp) sp.classList.remove("hidden");
    if (d) d.classList.add("hidden");
    document.body.style.overflow = "hidden";
  },

  fillModal(data) {
    const sp = document.getElementById("modalSpinner");
    const d = document.getElementById("modalDetail");
    if (sp) sp.classList.add("hidden");
    if (!d) return;

    d.innerHTML = `
      <img class="detail-poster" src="${posterSrc(data.Poster)}" alt="${esc(data.Title)}"/>
      <div class="detail-info">
        <h2 class="detail-title">${esc(data.Title)}</h2>
        <p class="detail-meta">
          ${esc(data.Year)} &middot; ${esc(data.Runtime || "-")} &middot; ${esc(data.Genre || "-")}
          &nbsp; <span class="imdb">IMDb ${esc(data.imdbRating || "-")}</span>
        </p>
        <p class="detail-plot">${esc(data.Plot || "No plot available.")}</p>
        <div class="detail-rows">
          <div class="detail-row"><span class="label">Director</span><span>${esc(data.Director || "-")}</span></div>
          <div class="detail-row"><span class="label">Actors</span><span>${esc(data.Actors || "-")}</span></div>
          <div class="detail-row"><span class="label">Language</span><span>${esc(data.Language || "-")}</span></div>
          <div class="detail-row"><span class="label">Country</span><span>${esc(data.Country || "-")}</span></div>
          <div class="detail-row"><span class="label">Box Office</span><span>${esc(data.BoxOffice || "-")}</span></div>
        </div>
      </div>`;
    d.classList.remove("hidden");
  },

  closeModal() {
    const o = document.getElementById("modalOverlay");
    if (o) o.classList.add("hidden");
    document.body.style.overflow = "";
  },
};

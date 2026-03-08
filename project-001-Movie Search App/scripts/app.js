(function () {
  const STORAGE_KEY = "movieApp_myList";
  const DEBOUNCE_MS = 300;

  const FEATURED_ID = "tt5109280";
  const FEATURED = {
    title: "RAYA AND THE LAST DRAGON",
    meta: 'A Disney Original Film &middot; <span class="match">98% Match</span> 2021',
    imdbID: FEATURED_ID,
  };

  const DEFAULT_IDS = [
    "tt2911666", // John Wick
    "tt3890160", // Baby Driver
    "tt1856101", // Blade Runner 2049
    "tt1727824", // Bohemian Rhapsody
    "tt1217209", // Brave
    "tt0034583", // Casablanca
    "tt0770828", // Crazy Stupid Love
    "tt1431045", // Deadpool
  ];

  let debounceTimer = 0;

  /* ── Helpers ── */
  function getList() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }
  function saveList(arr) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch {}
  }

  /* ── Init ── */
  async function init() {
    bindEvents();
    await loadHero();
    await loadMyList();
  }

  /* ── Hero ── */
  async function loadHero() {
    try {
      const data = await OMDB.getById(FEATURED_ID);
      if (data && !data.Error) {
        UI.setHero({
          title: FEATURED.title,
          meta: FEATURED.meta,
          poster: data.Poster,
        });
        return;
      }
    } catch {}
    UI.setHero({ title: FEATURED.title, meta: FEATURED.meta, poster: null });
  }

  /* ── My List ── */
  async function loadMyList() {
    const track = document.getElementById("myListTrack");
    let list = getList();

    if (list.length === 0) {
      UI.listLoading(true);
      UI.listEmpty(false);
      try {
        const results = await Promise.all(
          DEFAULT_IDS.map((id) =>
            OMDB.getById(id)
              .then((d) => (d && !d.Error ? d : null))
              .catch(() => null)
          )
        );
        list = results.filter(Boolean).map((d) => ({
          imdbID: d.imdbID,
          Title: d.Title,
          Year: d.Year,
          Poster: d.Poster,
          Type: d.Type,
        }));
        saveList(list);
      } catch {
        UI.listError("Failed to load movies.");
      } finally {
        UI.listLoading(false);
      }
    }

    UI.listEmpty(list.length === 0);
    UI.renderCards(track, list);
  }

  /* ── Search ── */
  function onSearchInput() {
    clearTimeout(debounceTimer);
    const q = document.getElementById("searchInput")?.value?.trim();
    if (!q) {
      document.getElementById("searchResults").innerHTML = "";
      UI.searchError("");
      UI.searchLoading(false);
      return;
    }
    debounceTimer = setTimeout(() => runSearch(q), DEBOUNCE_MS);
  }

  async function runSearch(q) {
    UI.searchError("");
    UI.searchLoading(true);
    const container = document.getElementById("searchResults");
    try {
      const data = await OMDB.search(q);
      if (data.Error) {
        container.innerHTML = "";
        UI.searchError(data.Error);
      } else {
        UI.renderCards(container, data.Search || []);
      }
    } catch {
      container.innerHTML = "";
      UI.searchError("Network error — please try again.");
    } finally {
      UI.searchLoading(false);
    }
  }

  /* ── Detail Modal ── */
  async function openDetail(imdbID) {
    UI.openModal();
    try {
      const data = await OMDB.getById(imdbID);
      if (data.Error) { UI.closeModal(); return; }
      UI.fillModal(data);
    } catch {
      UI.closeModal();
    }
  }

  /* ── Add featured to My List ── */
  function addFeaturedToList() {
    OMDB.getById(FEATURED_ID).then((d) => {
      if (!d || d.Error) return;
      const list = getList();
      if (list.some((m) => m.imdbID === d.imdbID)) return;
      list.unshift({
        imdbID: d.imdbID, Title: d.Title,
        Year: d.Year, Poster: d.Poster, Type: d.Type,
      });
      saveList(list);
      UI.renderCards(document.getElementById("myListTrack"), list);
      UI.listEmpty(false);
    });
  }

  /* ── Card click delegation ── */
  function onCardClick(e) {
    const card = e.target.closest(".poster-card");
    if (card?.dataset?.id) openDetail(card.dataset.id);
  }

  /* ── Bind events ── */
  function bindEvents() {
    document.querySelector(".btn-search")?.addEventListener("click", UI.openSearch);
    document.getElementById("closeSearch")?.addEventListener("click", UI.closeSearch);
    document.getElementById("searchInput")?.addEventListener("input", onSearchInput);
    document.getElementById("searchInput")?.addEventListener("keydown", (e) => {
      if (e.key === "Escape") UI.closeSearch();
    });

    document.getElementById("modalClose")?.addEventListener("click", UI.closeModal);
    document.getElementById("modalBackdrop")?.addEventListener("click", UI.closeModal);

    document.getElementById("btnPlay")?.addEventListener("click", () => openDetail(FEATURED_ID));
    document.getElementById("btnAdd")?.addEventListener("click", addFeaturedToList);

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
    });

    document.getElementById("myListTrack")?.addEventListener("click", onCardClick);
    document.getElementById("searchResults")?.addEventListener("click", onCardClick);
  }

  /* ── Bootstrap ── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

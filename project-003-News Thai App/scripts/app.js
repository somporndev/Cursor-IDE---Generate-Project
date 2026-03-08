/**
 * News Thai App – ฮีโร่, กริดข่าว, ฟิลเตอร์หมวด, Modal ดูเนื้อข่าว
 */

(function () {
  const heroBadge = document.getElementById("heroBadge");
  const heroTitle = document.getElementById("heroTitle");
  const heroDesc = document.getElementById("heroDesc");
  const heroSource = document.getElementById("heroSource");
  const heroDate = document.getElementById("heroDate");
  const newsGrid = document.getElementById("newsGrid");
  const loading = document.getElementById("loading");
  const empty = document.getElementById("empty");
  const navLinks = document.querySelectorAll(".nav-link[data-category]");
  const btnMenu = document.getElementById("btnMenu");
  const nav = document.querySelector(".nav");

  const modal = document.getElementById("articleModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalClose = document.getElementById("modalClose");
  const modalImage = document.getElementById("modalImage");
  const modalCategory = document.getElementById("modalCategory");
  const modalTitle = document.getElementById("modalTitle");
  const modalSource = document.getElementById("modalSource");
  const modalDate = document.getElementById("modalDate");
  const modalDescription = document.getElementById("modalDescription");
  const modalContent = document.getElementById("modalContent");
  const modalLink = document.getElementById("modalLink");

  let currentCategory = "all";
  let currentArticles = [];

  function setHero(article) {
    if (!article) {
      heroTitle.textContent = "ไม่มีข่าวเด่น";
      heroDesc.textContent = "";
      heroSource.textContent = "";
      heroDate.textContent = "";
      return;
    }
    heroTitle.textContent = article.title;
    heroDesc.textContent = article.description || "";
    heroSource.textContent = article.source || "";
    heroDate.textContent = formatDate(article.date);
  }

  function getCategoryLabel(cat) {
    return (typeof CATEGORY_LABEL !== "undefined" && CATEGORY_LABEL[cat]) || cat || "ทั่วไป";
  }

  function openArticleModal(article) {
    if (!article || !modal) return;
    if (modalImage) {
      modalImage.src = article.imageUrl || "";
      modalImage.alt = article.title || "";
      if (!article.imageUrl) modalImage.style.display = "none";
      else modalImage.style.display = "";
    }
    if (modalCategory) modalCategory.textContent = getCategoryLabel(article.category);
    if (modalTitle) modalTitle.textContent = article.title || "";
    if (modalSource) modalSource.textContent = article.source || "";
    if (modalDate) modalDate.textContent = formatDate(article.date);
    if (modalDescription) {
      modalDescription.textContent = article.description || "";
      modalDescription.style.display = article.description ? "" : "none";
    }
    if (modalContent) {
      const content = (article.content || "").trim();
      modalContent.textContent = content;
      modalContent.style.display = content ? "" : "none";
    }
    if (modalLink) {
      modalLink.href = article.url || "#";
      modalLink.style.display = article.url && article.url !== "#" ? "" : "none";
    }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeArticleModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function renderCards(articles) {
    currentArticles = articles || [];
    if (!newsGrid) return;
    newsGrid.innerHTML = "";
    if (!articles || articles.length === 0) {
      if (empty) empty.classList.remove("hidden");
      return;
    }
    if (empty) empty.classList.add("hidden");
    articles.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.setAttribute("role", "button");
      card.tabIndex = 0;
      card.innerHTML = `
        <img class="news-card-image" src="${item.imageUrl || ""}" alt="" loading="lazy" onerror="this.style.background='var(--surface)';this.src='';this.alt='ไม่มีรูป'"/>
        <div class="news-card-body">
          <span class="news-card-category">${getCategoryLabel(item.category)}</span>
          <h3 class="news-card-title">${escapeHtml(item.title)}</h3>
          <div class="news-card-meta">
            <span class="news-card-source">${escapeHtml(item.source || "")}</span>
            <span>${formatDate(item.date)}</span>
          </div>
        </div>
      `;
      card.addEventListener("click", () => openArticleModal(item));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openArticleModal(item);
        }
      });
      newsGrid.appendChild(card);
    });
  }

  function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function setLoading(show) {
    if (loading) loading.classList.toggle("hidden", !show);
  }

  function setActiveNav(category) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.category === category);
    });
  }

  async function loadNews(category) {
    currentCategory = category;
    setActiveNav(category);
    setLoading(true);
    newsGrid.innerHTML = "";
    if (empty) empty.classList.add("hidden");

    try {
      const list = await getNews(category);
      const first = list[0];
      setHero(first);
      renderCards(list);
      const note = document.getElementById("footerApiNote");
      if (note) note.classList.toggle("hidden", window.NEWS_API_COUNTRY !== "us");
    } catch (e) {
      setHero(null);
      renderCards([]);
      if (empty) {
        empty.querySelector("p").textContent = "โหลดข่าวไม่สำเร็จ " + (e.message || "");
        empty.classList.remove("hidden");
      }
    } finally {
      setLoading(false);
    }
  }

  function openMenu() {
    nav?.classList.toggle("open");
  }

  loadNews("all");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = link.dataset.category;
      if (cat) loadNews(cat);
      openMenu();
    });
  });

  if (btnMenu) btnMenu.addEventListener("click", openMenu);

  if (modalBackdrop) modalBackdrop.addEventListener("click", closeArticleModal);
  if (modalClose) modalClose.addEventListener("click", closeArticleModal);
  modal?.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeArticleModal();
  });
})();

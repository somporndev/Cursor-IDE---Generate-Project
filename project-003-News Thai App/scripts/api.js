/**
 * News API – ดึงข่าวจริงจาก NewsAPI หรือ fallback เป็น mock
 * หมายเหตุ: NewsAPI ไม่อนุญาต CORS จากเบราว์เซอร์ จึงใช้ proxy ถ้าต้องการ
 */
const NEWS_API_BASE = "https://newsapi.org/v2";
/** ใช้ proxy เพื่อหลีก CORS เมื่อรันจากเบราว์เซอร์ (เปิดแล้ว key ถึงจะทำงาน) */
const CORS_PROXY = "https://api.allorigins.win/raw?url=";
const CATEGORY_MAP = {
  all: "ทั้งหมด",
  general: "ทั่วไป",
  business: "ธุรกิจ",
  tech: "technology",
  sports: "กีฬา",
};

/** ส่งออกชื่อหมวดสำหรับแสดง (ภาษาไทย) */
const CATEGORY_LABEL = {
  all: "ทั้งหมด",
  general: "ทั่วไป",
  business: "ธุรกิจ",
  tech: "เทคโนโลยี",
  technology: "เทคโนโลยี",
  sports: "กีฬา",
};

/**
 * ดึงข่าวจาก NewsAPI (ข่าวไทย)
 * @param {string} category - all | general | business | tech | sports
 * @returns {Promise<Array>}
 */
async function getNews(category = "all") {
  const apiKey = typeof window !== "undefined" && window.NEWS_API_KEY;
  if (apiKey && apiKey.trim()) {
    try {
      return await getNewsFromAPI(apiKey, category);
    } catch (err) {
      console.warn("NewsAPI failed, using mock:", err.message);
      return getNewsMock(category);
    }
  }
  return getNewsMock(category);
}

/**
 * เรียก NewsAPI จริง
 * หมายเหตุ: NewsAPI ไม่มีแหล่งข่าวไทย (country=th คืน 0 รายการ) จึงลอง th ก่อน แล้ว fallback เป็น us
 */
async function getNewsFromAPI(apiKey, category) {
  const countries = ["th", "us"];
  let data = null;
  let usedCountry = "th";

  for (const country of countries) {
    const params = new URLSearchParams({
      country: country,
      pageSize: "20",
      apiKey: apiKey,
    });
    if (category && category !== "all") {
      const apiCategory = CATEGORY_MAP[category] || category;
      if (apiCategory && apiCategory !== "ทั้งหมด") params.set("category", apiCategory);
    }
    const apiUrl = `${NEWS_API_BASE}/top-headlines?${params.toString()}`;
    const url = typeof window !== "undefined" ? CORS_PROXY + encodeURIComponent(apiUrl) : apiUrl;
    const res = await fetch(url);
    data = await res.json();
    if (data.status !== "ok" || !Array.isArray(data.articles)) {
      throw new Error(data.message || "โหลดข่าวไม่สำเร็จ");
    }
    usedCountry = country;
    if (data.articles && data.articles.length > 0) break;
  }

  if (!data.articles || data.articles.length === 0) {
    throw new Error("ไม่พบข่าวใน NewsAPI สำหรับหมวดนี้");
  }

  if (typeof window !== "undefined") {
    window.NEWS_API_COUNTRY = usedCountry;
  }

  return data.articles
    .filter((a) => a.title && a.title !== "[Removed]" && a.title !== "[removed]")
    .map((a) => ({
      id: a.url || Math.random().toString(36).slice(2),
      title: a.title,
      description: a.description || a.content || "",
      source: a.source?.name || "",
      date: a.publishedAt ? a.publishedAt.slice(0, 10) : "",
      category: category,
      imageUrl: a.urlToImage || "",
      url: a.url || "#",
      content: a.content || a.description || "",
    }));
}

/** Fallback: ข่าวจาก data.js */
function getNewsMock(category) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const list = typeof MOCK_NEWS !== "undefined" ? [...MOCK_NEWS] : [];
      const out =
        category === "all" ? list : list.filter((item) => item.category === category);
      resolve(out);
    }, 400);
  });
}

/**
 * จัดรูปแบบวันที่ (รับได้ทั้ง YYYY-MM-DD และ ISO string)
 */
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  const th = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const day = d.getDate();
  const month = th[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

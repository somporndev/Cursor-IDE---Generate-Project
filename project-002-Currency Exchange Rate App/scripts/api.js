/**
 * Frankfurter API - อัตราแลกเปลี่ยน (ไม่ต้องใช้ API key)
 * https://frankfurter.dev/
 */

const API_BASE = "https://api.frankfurter.dev/v1";

/**
 * ดึงรายการสกุลเงิน (code -> name)
 * @returns {Promise<Object>} เช่น { USD: "US Dollar", THB: "Thai Baht" }
 */
async function fetchCurrencies() {
  const res = await fetch(`${API_BASE}/currencies`);
  if (!res.ok) throw new Error("โหลดรายการสกุลเงินไม่สำเร็จ");
  return res.json();
}

/**
 * ดึงอัตราแลกเปลี่ยนล่าสุด จาก base ไป to
 * @param {string} base - สกุลเงินต้นทาง (เช่น USD)
 * @param {string} to - สกุลเงินปลายทาง (เช่น THB)
 * @returns {Promise<{ rate: number, date: string }>}
 */
async function fetchLatestRate(base, to) {
  if (base === to) {
    return { rate: 1, date: new Date().toISOString().slice(0, 10) };
  }
  const url = `${API_BASE}/latest?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(to)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("โหลดอัตราแลกเปลี่ยนไม่สำเร็จ");
  const data = await res.json();
  const rate = data.rates?.[to];
  if (rate == null) throw new Error("ไม่พบอัตราสำหรับสกุลเงินที่เลือก");
  return { rate, date: data.date };
}

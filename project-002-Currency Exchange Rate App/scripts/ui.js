/**
 * UI - เติม dropdown สกุลเงิน แสดงผล และสถานะ
 */

function fillCurrencySelect(selectEl, currencies, defaultCode = "USD") {
  if (!selectEl || !currencies) return;
  selectEl.innerHTML = "";
  const entries = Object.entries(currencies).sort((a, b) => a[0].localeCompare(b[0]));
  for (const [code, name] of entries) {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = `${code} – ${name}`;
    if (code === defaultCode) opt.selected = true;
    selectEl.appendChild(opt);
  }
}

function showAmountTo(value, decimals = 2) {
  const el = document.getElementById("amountTo");
  if (!el) return;
  if (value == null || Number.isNaN(value)) {
    el.value = "";
    el.placeholder = "—";
    return;
  }
  el.value = Number(value).toFixed(decimals);
  el.placeholder = "";
}

function showResultForward(text) {
  const el = document.getElementById("resultForward");
  if (el) el.textContent = text || "—";
}

function showResultBack(text) {
  const el = document.getElementById("resultBack");
  if (el) el.textContent = text || "—";
}

function showRateDate(dateStr) {
  const el = document.getElementById("rateDate");
  if (!el) return;
  if (!dateStr) {
    el.textContent = "";
    return;
  }
  el.textContent = `อัตราล่าสุด วันที่ ${dateStr}`;
}

function showLoading(show) {
  const spinner = document.getElementById("spinner");
  const err = document.getElementById("errorMsg");
  if (spinner) spinner.classList.toggle("hidden", !show);
  if (err) {
    err.classList.add("hidden");
    if (!show) err.textContent = "";
  }
}

function showError(message) {
  const err = document.getElementById("errorMsg");
  const spinner = document.getElementById("spinner");
  if (spinner) spinner.classList.add("hidden");
  if (err) {
    err.textContent = message || "เกิดข้อผิดพลาด";
    err.classList.remove("hidden");
  }
}

function hideError() {
  const err = document.getElementById("errorMsg");
  if (err) {
    err.textContent = "";
    err.classList.add("hidden");
  }
}

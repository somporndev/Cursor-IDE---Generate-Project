/**
 * Currency Exchange Rate App
 * - กำหนดมูลค่าเงินต้นทาง และเห็นมูลค่าปลายทาง
 * - แสดงมูลค่าแลกมา / แลกกลับ
 */

(function () {
  const amountFromEl = document.getElementById("amountFrom");
  const currencyFromEl = document.getElementById("currencyFrom");
  const currencyToEl = document.getElementById("currencyTo");
  const btnSwap = document.getElementById("btnSwap");

  let currencies = null;

  function getAmount() {
    const v = parseFloat(amountFromEl?.value, 10);
    return Number.isFinite(v) && v >= 0 ? v : 0;
  }

  function formatMoney(amount, code) {
    if (amount == null || Number.isNaN(amount)) return "—";
    const n = Number(amount);
    const fixed = n % 1 === 0 ? 0 : 2;
    return `${n.toFixed(fixed)} ${code}`;
  }

  async function convert() {
    const amount = getAmount();
    const from = currencyFromEl?.value || "USD";
    const to = currencyToEl?.value || "THB";

    hideError();
    showAmountTo(null);
    showResultForward("—");
    showResultBack("—");
    showRateDate("");

    if (amount <= 0) {
      showAmountTo("");
      return;
    }

    if (from === to) {
      showAmountTo(amount);
      showResultForward(formatMoney(amount, from) + " = " + formatMoney(amount, to));
      showResultBack(formatMoney(amount, to) + " = " + formatMoney(amount, from));
      showRateDate(new Date().toISOString().slice(0, 10));
      return;
    }

    showLoading(true);
    try {
      const { rate, date } = await fetchLatestRate(from, to);
      const converted = amount * rate;
      const backAmount = converted / rate;

      showAmountTo(converted);
      showResultForward(`${formatMoney(amount, from)} = ${formatMoney(converted, to)}`);
      showResultBack(`${formatMoney(converted, to)} = ${formatMoney(backAmount, from)}`);
      showRateDate(date);
    } catch (e) {
      showError(e.message || "โหลดอัตราไม่สำเร็จ");
    } finally {
      showLoading(false);
    }
  }

  function swapCurrencies() {
    if (!currencyFromEl || !currencyToEl) return;
    const from = currencyFromEl.value;
    const to = currencyToEl.value;
    currencyFromEl.value = to;
    currencyToEl.value = from;
    convert();
  }

  async function init() {
    try {
      currencies = await fetchCurrencies();
      fillCurrencySelect(currencyFromEl, currencies, "USD");
      fillCurrencySelect(currencyToEl, currencies, "THB");
      convert();
    } catch (e) {
      showError(e.message || "โหลดรายการสกุลเงินไม่สำเร็จ");
    }

    amountFromEl?.addEventListener("input", convert);
    amountFromEl?.addEventListener("change", convert);
    currencyFromEl?.addEventListener("change", convert);
    currencyToEl?.addEventListener("change", convert);
    btnSwap?.addEventListener("click", swapCurrencies);
  }

  init();
})();

document.addEventListener("DOMContentLoaded", () => {
    const todayEl = document.getElementById("gc-today");
    const totalEl = document.getElementById("gc-total");
    if (!todayEl || !totalEl) return;

    const today = new Date().toISOString().split("T")[0];
    const base = "https://kazan33333.goatcounter.com/counter";

    fetch(`${base}/TOTAL.json?start=${today}&end=${today}`)
        .then(r => r.json())
        .then(d => todayEl.textContent = d.count)
        .catch(() => todayEl.textContent = "-");

    fetch(`${base}/TOTAL.json`)
        .then(r => r.json())
        .then(d => totalEl.textContent = d.count)
        .catch(() => totalEl.textContent = "-");
});

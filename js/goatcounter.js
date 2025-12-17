document.addEventListener("DOMContentLoaded", () => {
    const todayEl = document.getElementById("gc-today");
    const weekEl  = document.getElementById("gc-week");
    const totalEl = document.getElementById("gc-total");
    if (!todayEl || !weekEl || !totalEl) return;

    const base = "https://kazan33333.goatcounter.com/counter";

    function toISODate(d) {
        return d.toISOString().split("T")[0];
    }

    const nowPL = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Europe/Warsaw" })
    );

    const startTodayPL = new Date(nowPL);
    startTodayPL.setHours(0, 0, 0, 0);

    const endTodayPL = new Date(startTodayPL);
    endTodayPL.setDate(endTodayPL.getDate() + 1);

    const day = startTodayPL.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;

    const startWeekPL = new Date(startTodayPL);
    startWeekPL.setDate(startWeekPL.getDate() + diffToMonday);

    const endWeekPL = new Date(startWeekPL);
    endWeekPL.setDate(endWeekPL.getDate() + 7);

    fetch(`${base}/TOTAL.json?start=${toISODate(startTodayPL)}&end=${toISODate(endTodayPL)}`)
        .then(r => r.json())
        .then(d => todayEl.textContent = d.count)
        .catch(() => todayEl.textContent = "-");

    fetch(`${base}/TOTAL.json?start=${toISODate(startWeekPL)}&end=${toISODate(endWeekPL)}`)
        .then(r => r.json())
        .then(d => weekEl.textContent = d.count)
        .catch(() => weekEl.textContent = "-");

    fetch(`${base}/TOTAL.json`)
        .then(r => r.json())
        .then(d => totalEl.textContent = d.count)
        .catch(() => totalEl.textContent = "-");
});

document.addEventListener("DOMContentLoaded", () => {
    const pageViewsElem = document.getElementById("pageViews");
    if (!pageViewsElem) return;

    const path = encodeURIComponent(location.pathname);

    const url = `https://kazan33333.goatcounter.com/counter/${path}.json`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            pageViewsElem.textContent = data.count;
        })
        .catch(err => console.error("Błąd licznika GoatCounter:", err));
});

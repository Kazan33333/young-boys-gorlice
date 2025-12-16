document.addEventListener("DOMContentLoaded", () => {
    const pageViewsElem = document.getElementById("pageViews");
    if (!pageViewsElem || !window.gc) return;

    gc.count().then(data => {
        pageViewsElem.textContent = data.count;
    }).catch(err => {
        console.error("Błąd licznika GoatCounter:", err);
    });
});

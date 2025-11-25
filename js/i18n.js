const translations = {
    en: {
        "navbar.history": "History",
        "navbar.results": "Results",
        "navbar.tournaments": "Tournaments",
        "navbar.gallery": "Gallery",
        "table.date": "Date",
        "table.match": "Match",
        "table.score": "Score",
        "table.noScorers": "No scorers",
        "table.team": "Team",
        "table.G": "G",
        "table.noData": "No data",
        "table.toBePlayed": "To be played",
        "season": "Season"
    },
    pl: {
        "navbar.history": "Historia",
        "navbar.results": "Wyniki",
        "navbar.tournaments": "Turnieje",
        "navbar.gallery": "Galeria",
        "table.date": "Data",
        "table.match": "Mecz",
        "table.score": "Wynik",
        "table.team": "Drużyna",
        "table.G": "B",
        "table.noData": "Brak danych",
        "table.toBePlayed": "Mecz do rozegrania",
        "season": "Sezon"
    }
};

let currentLang = localStorage.getItem("lang") || "en";
const languagePickEnElement = document.querySelector(".language-pick-2-en");
const languagePickPlElement = document.querySelector(".language-pick-pl");

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    languagePickEnElement.classList.remove("language-pick-en", "language-pick-2-en");
    languagePickPlElement.classList.remove("language-pick-pl", "language-pick-2-pl");

    if (lang === "pl") {
        languagePickEnElement.classList.add("language-pick-2-en");
        languagePickPlElement.classList.add("language-pick-2-pl");
    } else {
        languagePickEnElement.classList.add("language-pick-en");
        languagePickPlElement.classList.add("language-pick-pl");
    }
}

document.getElementById("language-collapsible").addEventListener("click", function() {
    changeLanguage(currentLang === "en" ? "pl" : "en");
});

document.addEventListener("DOMContentLoaded", () => {
    changeLanguage(currentLang);
});

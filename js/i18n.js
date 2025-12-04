const translations = {
    en: {
        "navbar.fixtures": "Fixtures",
        "navbar.history": "History",
        "navbar.results": "Results",
        "navbar.tournaments": "Tournaments",
        "navbar.gallery": "Gallery",
        "table.hour": "Hour",
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
        "navbar.fixtures": "Terminarz",
        "navbar.history": "Historia",
        "navbar.results": "Wyniki",
        "navbar.tournaments": "Turnieje",
        "navbar.gallery": "Galeria",
        "table.hour": "Godzina",
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

const languagePickEnElement = document.querySelector(".language-pick-en");
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

    languagePickEnElement.classList.toggle("language-active", lang === "en");
    languagePickPlElement.classList.toggle("language-active", lang === "pl");
}

document.getElementById("language-collapsible").addEventListener("click", function() {
    changeLanguage(currentLang === "en" ? "pl" : "en");
});

document.addEventListener("DOMContentLoaded", () => {
    changeLanguage(currentLang);
});

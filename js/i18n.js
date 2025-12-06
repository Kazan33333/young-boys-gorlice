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
        "season": "Season",
        "fixturesInfo": "Current season's fixtures and scores of finished games.",
        "historyInfo": "Club's history, achievements, old photos and fun facts.",
        "resultsInfo": "Detailed scores of Young Boys Gorlice's games throughout the seasons, league tables and stats.",
        "tournamentsInfo": "Info about tournaments the club participated in.",
        "galleryInfo": "Team's exquisite photo gallery.",
        "search": "Search",
        "searchInfo": "A search engine for finding an opponent the team has played against."
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
        "season": "Sezon",
        "fixturesInfo": "Terminarz wszystkich meczów obecnego sezonu oraz wyniki z odbytych meczów.",
        "historyInfo": "Historia klubu, osiągnięcia, stare zdjęcia i ciekawostki.",
        "resultsInfo": "Szczegółowe wyniki Young Boys Gorlice z poszczególnych sezonów, tabele ligowe i statystyki.",
        "tournamentsInfo": "Informacje o turniejach, w których klub brał udział.",
        "galleryInfo": "Kunsztowna galeria zdjęć drużyny.",
        "search": "Wyszukiwanie",
        "searchInfo": "Wyszukiwarka do znajdowania przeciwników, z którymi mierzyła się drużyna."
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

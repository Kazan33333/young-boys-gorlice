const translations = {
    en: {
        "navbar.fixtures": "Fixtures",
        "navbar.history": "History",
        "navbar.results": "Results",
        "navbar.tournaments": "Tournaments",
        "navbar.stats": "Stats",
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
        "search": "Search",
        "table": "Table",
        "results": "Results",
        "chart": "Chart",
        "stats": "Stats",
        "round": "Round",
        "views": "Views",
        "today": "Today",
        "week": "Week",
        "total": "Total",
        "matches": "Matches",
        "player": "Player",
        "goals": "Goals",
        "wins": "Wins",
        "draws": "Draws",
        "losses": "Losses",
        "goalsScored": "Goals scored",
        "goalsConceded": "Goals conceded",
        "goalBalance": "Goal balance",
        "topScorers": "Top scorers (some data missing)",
        "tableBeforeDivision": "Table before division",
        "1stDivision": "1st division",
        "2ndDivision": "2nd division",
        "futsalLeagueFixtures": "Futsal League Fixtures",
        "footerInfo": "All scores on the website are based on official data from the organizers, PDFs are linked accordingly.",
        "fixturesInfo": "Current season's futsal league's fixtures and scores of finished games.",
        "historyInfo": "Club's history, achievements, old photos and fun facts.",
        "resultsInfo": "Detailed scores of Young Boys Gorlice's games throughout the seasons, league tables and stats.",
        "tournamentsInfo": "Info about tournaments the club participated in.",
        "galleryInfo": "Team's exquisite photo gallery.",
        "searchInfo": "A search engine for finding an opponent the team has played against.",
        "homePage": "Homepage",
        "homePageDesc": "Below are cards that are links to individual subpages or features on the site.",
        "fixturesDesc": "Here you can find current season's futsal league's fixtures and scores of finished games.",
        "historyDesc": "Young Boys Gorlice is a football club founded in the second half of the 2010s.",
        "tournamentsDesc": "Here you can find info about tournaments the club participated in.",
        "statsDesc": "Here you can find miscellaneous statistics."
    },
    pl: {
        "navbar.fixtures": "Terminarz",
        "navbar.history": "Historia",
        "navbar.results": "Wyniki",
        "navbar.tournaments": "Turnieje",
        "navbar.stats": "Statystyki",
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
        "search": "Wyszukiwanie",
        "table": "Tabela",
        "results": "Wyniki",
        "chart": "Wykres",
        "stats": "Statystyki",
        "round": "Kolejka",
        "views": "Wyświetlenia",
        "today": "Dzisiaj",
        "week": "Tydzień",
        "total": "Łącznie",
        "matches": "Mecze",
        "player": "Zawodnik",
        "goals": "Gole",
        "wins": "Wygrane",
        "draws": "Remisy",
        "losses": "Porażki",
        "goalsScored": "Bramki strzelone",
        "goalsConceded": "Bramki stracone",
        "goalBalance": "Bilans bramkowy",
        "topScorers": "Najlepsi strzelcy (brakujące dane)",
        "tableBeforeDivision": "Tabela przed podziałem",
        "1stDivision": "I liga",
        "2ndDivision": "II liga",
        "futsalLeagueFixtures": "Terminarz ligi futsal",
        "footerInfo": "Wszystkie wyniki na stronie są oparte na oficjalnych wynikach od organizatorów, PDFy są odpowiednio podlinkowane.",
        "fixturesInfo": "Terminarz wszystkich meczów obecnego sezonu ligi futsal oraz wyniki z odbytych meczów.",
        "historyInfo": "Historia klubu, osiągnięcia, stare zdjęcia i ciekawostki.",
        "resultsInfo": "Szczegółowe wyniki Young Boys Gorlice z poszczególnych sezonów, tabele ligowe i statystyki.",
        "tournamentsInfo": "Informacje o turniejach, w których klub brał udział.",
        "galleryInfo": "Kunsztowna galeria zdjęć drużyny.",
        "searchInfo": "Wyszukiwarka do znajdowania przeciwników, z którymi mierzyła się drużyna.",
        "homePage": "Strona główna",
        "homePageDesc": "Poniżej znajdują się karty będące odnośnikami do poszczególnych podstron bądź funkcji na stronie.",
        "fixturesDesc": "Tutaj znajdziesz terminarz wszystkich meczów obecnego sezonu ligi futsal oraz wyniki z odbytych meczów.",
        "historyDesc": "Young Boys Gorlice to klub piłkarski założony w drugiej połowie lat 10. XXI wieku.",
        "tournamentsDesc": "Tutaj znajdziesz informacje o turniejach, w których klub brał udział.",
        "statsDesc": "Tutaj znajdziesz rozmaite statystyki."
    }
};

let storedLang = localStorage.getItem("lang");
let browserLang = navigator.language.slice(0, 2);
let currentLang = storedLang || (browserLang === "pl" ? "pl" : "en");

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

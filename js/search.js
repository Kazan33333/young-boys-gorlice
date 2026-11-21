import { resultsData } from "./resultsData.js";
import { tournamentResultsData } from "./tournamentsData.js";
import { leagueFixturesData } from "./leagueFixturesData.js";

let chartInstance = null;

const CLUB_NAME = "Young Boys Gorlice";

function isClubName(name) {
    return name.trim() === CLUB_NAME;
}

function getMatchTeams(team) {
    return team.split(/\s+-\s+/).map(name => name.trim());
}

function getClubIndex(match) {
    return getMatchTeams(match).findIndex(isClubName);
}

function getClubScorers(match) {
    if (!match.scorers) return "";

    const teams = getMatchTeams(match.team);
    const scorers = match.scorers.split(/\s+-\s+/);

    if (teams.length !== 2 || scorers.length !== 2) return "";

    const index = teams.findIndex(isClubName);

    return index === -1 ? "" : scorers[index].trim();
}

// Sprawdza, czy mecz jest bezpośrednim spotkaniem
// Young Boys Gorlice z wyszukiwaną drużyną.
function isHeadToHead(matchTeam, search) {
    if (!matchTeam || !search) return false;

    const teams = getMatchTeams(matchTeam);

    if (teams.length !== 2) return false;

    const hasClub = teams.some(isClubName);

    const hasOpponent = teams.some(team =>
        !isClubName(team) &&
        team.toLocaleLowerCase("pl").includes(search)
    );

    return hasClub && hasOpponent;
}

function searchMatches(teamName) {
    const search = teamName.trim().toLocaleLowerCase("pl");
    const matches = [];

    if (!search) return matches;

    // Starsze sezony z resultsData.
    Object.entries(resultsData).forEach(([season, games]) => {

        // Nie pobieramy ponownie sezonów generowanych
        // bezpośrednio z leagueFixturesData.
        if (
            Number(season.split("/")[0]) >= 2026 &&
            leagueFixturesData[season]
        ) {
            return;
        }

        games.forEach(g => {

            // Tylko mecze Young Boys Gorlice z wyszukiwaną drużyną.
            if (!isHeadToHead(g.team, search)) return;

            matches.push({
                date: g.date,
                match: g.team,
                score: g.score,
                scorers: g.scorers || "",
                source: season
            });
        });
    });

    // Aktualne sezony z leagueFixturesData.
    Object.entries(leagueFixturesData).forEach(([season, games]) => {

        if (Number(season.split("/")[0]) < 2026) return;

        games.forEach(g => {

            // Odrzucamy wszystkie mecze, w których
            // nie występuje Young Boys Gorlice.
            if (!isHeadToHead(g.team, search)) return;

            matches.push({
                date: g.date.split(" ")[0],
                match: g.team,
                score: g.score,
                scorers: getClubScorers(g),
                source: season
            });
        });
    });

    // Wyniki turniejowe.
    Object.entries(tournamentResultsData).forEach(([tournament, games]) => {

        games.forEach(g => {

            // Również tutaj pokazujemy tylko bezpośrednie
            // mecze Young Boys Gorlice z wyszukiwaną drużyną.
            if (!isHeadToHead(g.team, search)) return;

            matches.push({
                date: g.date,
                match: g.team,
                score: g.score,
                scorers: g.scorers || "",
                source: tournament
            });
        });
    });

    return matches;
}

function generateChart(localTeamName, localResults) {
    let wins = 0;
    let draws = 0;
    let losses = 0;

    localResults.forEach(r => {
        const parts = r.match.split(" - ").map(s => s.trim());
        const scores = (r.score || "").split(" - ").map(s => Number(s.trim()));

        if (
            parts.length < 2 ||
            scores.length < 2 ||
            Number.isNaN(scores[0]) ||
            Number.isNaN(scores[1])
        ) {
            return;
        }

        const [teamA, teamB] = parts;
        const [scoreA, scoreB] = scores;

        const isYBG_A = isClubName(teamA);

        const our = isYBG_A ? scoreA : scoreB;
        const opp = isYBG_A ? scoreB : scoreA;

        if (our > opp) wins++;
        else if (our < opp) losses++;
        else draws++;
    });

    const ctx = document.getElementById("resultsChart");

    if (!ctx) {
        console.warn("Brak elementu #resultsChart — wykres pominięty");
        return;
    }

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "pie",

        data: {
            labels: ["Wygrane", "Remisy", "Porażki"],

            datasets: [{
                data: [wins, draws, losses],

                backgroundColor: [
                    "rgba(0,255,0,0.8)",
                    "rgba(255,215,0,0.8)",
                    "rgba(255,0,0,0.8)"
                ],

                borderColor: [
                    "rgba(0,190,0,1)",
                    "rgba(190,160,0,1)",
                    "rgba(190,0,0,1)"
                ],

                borderWidth: 3
            }]
        },

        options: {
            plugins: {
                legend: {
                    labels: {
                        color: "white"
                    }
                }
            },

            maintainAspectRatio: false,

            animation: {
                duration: 0
            },

            layout: {
                padding: {
                    top: 5,
                    bottom: 40,
                    left: 30,
                    right: 30
                }
            }
        },

        plugins: [{
            id: "outsideLabels",

            afterDraw(chart) {
                const { ctx, chartArea } = chart;
                const meta = chart.getDatasetMeta(0);

                ctx.save();

                ctx.fillStyle = "white";
                ctx.font = "16px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                meta.data.forEach((segment, i) => {
                    const value = chart.data.datasets[0].data[i];

                    if (value <= 0) return;

                    const { x, y } = segment.tooltipPosition();

                    const cx = (chartArea.right + chartArea.left) / 2;
                    const cy = (chartArea.bottom + chartArea.top) / 2;

                    const vx = x - cx;
                    const vy = y - cy;

                    const factor = 2.3;

                    const nx = cx + vx * factor;
                    const ny = cy + vy * factor;

                    ctx.fillText(value, nx, ny);
                });

                ctx.restore();
            }
        }]
    });
}

function showSearchModal(teamName, results) {
    if (!results) {
        results = searchMatches(teamName);
    }

    results.sort((a, b) => {
        if (!a.date || !b.date) return 0;

        const parseDate = (d) => {
            const [day, month, year] = d.split(".").map(Number);

            return new Date(year, month - 1, day);
        };

        return parseDate(a.date) - parseDate(b.date);
    });

    const modalElement = document.getElementById("searchResultsModal");

    if (!modalElement) {
        console.error("Brak elementu #searchResultsModal");
        return;
    }

    const tableBody = document.getElementById("searchResultsBody");
    const modalTitle = document.getElementById("searchResultsLabel");

    const tabTable = document.getElementById("tabTable");
    const tabChart = document.getElementById("tabChart");
    const tabStats = document.getElementById("tabStats");

    const chartContainer = document.getElementById("chartContainer");
    const statsContainer = document.getElementById("statsContainer");

    if (
        !tableBody ||
        !modalTitle ||
        !tabTable ||
        !tabChart ||
        !tabStats ||
        !chartContainer ||
        !statsContainer
    ) {
        console.error("Brak wymaganych elementów modala");
        return;
    }

    const tableWrapper = tableBody.parentElement;

    const modal = new bootstrap.Modal(modalElement);

    modalTitle.textContent = teamName;
    tableBody.innerHTML = "";

    if (!results || results.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-secondary">
                    Brak meczów z tą drużyną
                </td>
            </tr>
        `;

        setActiveTab(tabTable);

        tableWrapper.style.display = "table";
        chartContainer.style.display = "none";
        statsContainer.style.display = "none";

        modal.show();

        return;
    }

    // Wyświetlanie wyników.
    results.forEach(r => {

        const highlighted = r.match.replace(
            /(Young Boys Gorlice)/g,
            '<span style="color: gold;">$1</span>'
        );

        let scoreColor = "inherit";

        try {
            const scores = r.score?.split(" - ").map(Number);
            const teams = r.match.split(" - ");

            const idx = teams.findIndex(isClubName);

            if (idx !== -1 && scores.length === 2) {
                if (scores[idx] > scores[1 - idx]) {
                    scoreColor = "chartreuse";
                } else if (scores[idx] < scores[1 - idx]) {
                    scoreColor = "red";
                }
            }
        } catch {}

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${r.date ?? ""}</td>
            <td>${highlighted}</td>
            <td style="color:${scoreColor}">${r.score ?? ""}</td>
        `;

        tableBody.appendChild(row);
    });

    // Statystyki Young Boys Gorlice.
    function generateStats() {
        let matches = 0;
        let goalsFor = 0;
        let goalsAgainst = 0;

        const scorersMap = {};

        results.forEach(r => {
            if (!r.score || r.score.trim() === "") return;

            const scores = r.score.split(" - ").map(Number);
            const teams = r.match.split(" - ");

            const idx = teams.findIndex(isClubName);

            if (idx === -1 || scores.length !== 2 || scores.some(isNaN)) {
                return;
            }

            matches++;

            goalsFor += scores[idx];
            goalsAgainst += scores[1 - idx];

            if (!r.scorers) return;

            const raw = r.scorers.toLowerCase();

            if (raw.includes("w/o") || raw.includes("n/a")) return;

            r.scorers.split(",").forEach(entry => {
                entry = entry.trim();

                if (!entry || entry.includes("o.g.")) return;

                const match = entry.match(/(.+?)(?:\s*x?\s*(\d+))?$/i);

                if (!match) return;

                const name = match[1].trim();
                const goals = match[2] ? parseInt(match[2], 10) : 1;

                scorersMap[name] = (scorersMap[name] || 0) + goals;
            });
        });

        const goalDiff = goalsFor - goalsAgainst;

        const diffLabel = `${goalDiff > 0 ? "+" : ""}${goalDiff}`;

        const topScorers = Object.entries(scorersMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        statsContainer.innerHTML = `
            <div class="stats-grid">

                <div class="stat-card">
                    <div class="stat-value">${matches}</div>
                    <div class="stat-label" data-i18n="matches"></div>
                </div>

                <div class="stat-card">
                    <div class="stat-value">${goalsFor}</div>
                    <div class="stat-label" data-i18n="goalsScored"></div>
                </div>

                <div class="stat-card">
                    <div class="stat-value">${goalsAgainst}</div>
                    <div class="stat-label" data-i18n="goalsConceded"></div>
                </div>

                <div class="stat-card">
                    <div class="stat-value">
                        ${diffLabel}
                    </div>
                    <div class="stat-label" data-i18n="goalBalance"></div>
                </div>

            </div>

            <h6 class="mb-2" data-i18n="top3Scorers"></h6>

            <ul class="list-group top-scorers">

                ${
                    topScorers.length === 0
                        ? `<li class="list-group-item bg-dark text-secondary">Brak danych</li>`
                        : topScorers.map(
                            ([name, goals], i) => `
                                <li class="list-group-item d-flex justify-content-between">
                                    <span>${i + 1}. ${name}</span>
                                    <strong>${goals}</strong>
                                </li>
                            `
                        ).join("")
                }

            </ul>
        `;

        changeLanguage(currentLang);
    }

    // Przełączanie zakładek.
    function setActiveTab(activeBtn) {
        [tabTable, tabChart, tabStats].forEach(btn =>
            btn.classList.remove("active-tab")
        );

        activeBtn.classList.add("active-tab");
    }

    tabTable.onclick = () => {
        setActiveTab(tabTable);

        tableWrapper.style.display = "table";
        chartContainer.style.display = "none";
        statsContainer.style.display = "none";
    };

    tabChart.onclick = () => {
        setActiveTab(tabChart);

        generateChart(teamName, results);

        tableWrapper.style.display = "none";
        chartContainer.style.display = "block";
        statsContainer.style.display = "none";
    };

    tabStats.onclick = () => {
        setActiveTab(tabStats);

        tableWrapper.style.display = "none";
        chartContainer.style.display = "none";
        statsContainer.style.display = "block";

        generateStats();
    };

    setActiveTab(tabTable);

    tableWrapper.style.display = "table";
    chartContainer.style.display = "none";
    statsContainer.style.display = "none";

    modal.show();
}

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("searchInput");

    const searchIcon = document.querySelector(".search-icon");

    const searchBox = input ? input.parentElement : null;

    // Zabezpieczenie, gdy na stronie nie ma wyszukiwarki.
    if (!input || !searchBox) return;

    const suggestionBox = document.createElement("div");

    suggestionBox.className = "search-suggestions bg-dark text-light";

    suggestionBox.style.position = "absolute";
    suggestionBox.style.display = "none";
    suggestionBox.style.zIndex = "999";
    suggestionBox.style.maxHeight = "200px";
    suggestionBox.style.overflowY = "auto";
    suggestionBox.style.borderRadius = "0 0 4px 4px";
    suggestionBox.style.border = "1px solid #1C1F23";
    suggestionBox.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";

    input.parentElement.style.position = "relative";
    input.parentElement.appendChild(suggestionBox);

    const searchElement = document.querySelector('[data-i18n="search"]');

    const searchMenuLink = searchElement
        ? searchElement.closest("a")
        : null;

    const navbarToggler = document.querySelector(".navbar-toggler");

    if (searchMenuLink) {
        searchMenuLink.addEventListener("click", (e) => {
            e.preventDefault();

            const isMobile = window.innerWidth < 992;

            if (isMobile && navbarToggler) {
                navbarToggler.click();

                const navbarCollapse = document.getElementById("navbarNav");

                if (navbarCollapse) {
                    navbarCollapse.addEventListener("shown.bs.collapse", () => {
                        searchBox.classList.add("expanded");

                        input.focus();

                        if (typeof showSuggestionsOnFocus === "function") {
                            showSuggestionsOnFocus();
                        }
                    }, { once: true });
                }
            } else {
                searchBox.classList.add("expanded");

                input.focus();

                if (typeof showSuggestionsOnFocus === "function") {
                    showSuggestionsOnFocus();
                }
            }
        });
    }

    // Wstępne załadowanie Chart.js.
    (function preloadChartJS() {
        const dummyCanvas = document.createElement("canvas");

        dummyCanvas.style.display = "none";

        document.body.appendChild(dummyCanvas);

        try {
            const ctx = dummyCanvas.getContext("2d");

            let preloadChart = new Chart(ctx, {
                type: "pie",

                data: {
                    labels: ["A", "B"],

                    datasets: [{
                        data: [1, 1]
                    }]
                }
            });

            preloadChart.destroy();

        } catch (err) {
            console.warn("Preload Chart.js failed:", err);
        }

        dummyCanvas.remove();
    })();

    function showSuggestionsOnFocus() {
        const query = input.value.trim();

        if (query === "") {
            suggestionBox.innerHTML = "";

            allTeams.forEach(team => {
                const item = document.createElement("div");

                item.textContent = team;
                item.style.padding = "6px 10px";
                item.style.cursor = "pointer";

                const selectTeam = (e) => {
                    e.preventDefault();

                    showSearchModal(team);

                    input.value = "";
                    suggestionBox.style.display = "none";
                };

                item.addEventListener("click", selectTeam);

                if (window.matchMedia("(pointer:fine)").matches) {
                    item.addEventListener("pointerdown", selectTeam);
                }

                item.addEventListener("mouseover", () => {
                    [...suggestionBox.children].forEach(n => {
                        n.style.background = "";
                    });

                    item.style.background = "rgba(157, 157, 157, 0.3)";
                    item.style.color = "chartreuse";
                });

                item.addEventListener("mouseout", () => {
                    [...suggestionBox.children].forEach(n => {
                        n.style.background = "";
                    });

                    item.style.color = "white";
                });

                suggestionBox.appendChild(item);
            });

            suggestionBox.style.display = "block";

            currentFocus = -1;

            updateSuggestionBoxPosition();

        } else {
            updateSuggestions(query);
        }
    }

    function updateSuggestionBoxPosition() {
        const rect = input.getBoundingClientRect();

        const parentRect = input.parentElement.getBoundingClientRect();

        suggestionBox.style.width = rect.width + "px";

        suggestionBox.style.left =
            (rect.left - parentRect.left) + "px";

        suggestionBox.style.top = input.offsetHeight + "px";
    }

    let currentFocus = -1;

    function getAllTeams() {
        const set = new Set();

        const addTeamsFrom = (text) => {
            const parts = getMatchTeams(text);

            parts.forEach(team => {
                if (!isClubName(team)) {
                    set.add(team);
                }
            });
        };

        Object.values(resultsData).forEach(games =>
            games.forEach(g => addTeamsFrom(g.team))
        );

        Object.entries(leagueFixturesData).forEach(([season, games]) => {
            if (Number(season.split("/")[0]) >= 2026) {
                games.forEach(g => addTeamsFrom(g.team));
            }
        });

        Object.values(tournamentResultsData).forEach(games =>
            games.forEach(g => addTeamsFrom(g.team))
        );

        return [...set];
    }

    const allTeams = getAllTeams().sort((a, b) =>
        a.localeCompare(b, "pl")
    );

    function updateSuggestions(query) {
        suggestionBox.innerHTML = "";

        if (!query) {
            suggestionBox.style.display = "none";
            return;
        }

        const filtered = allTeams.filter(t =>
            t.toLocaleLowerCase("pl").includes(
                query.toLocaleLowerCase("pl")
            )
        );

        filtered.forEach(team => {
            const item = document.createElement("div");

            item.textContent = team;

            item.style.padding = "6px 10px";
            item.style.cursor = "pointer";

            item.addEventListener("click", () => {
                showSearchModal(team);

                input.value = "";
                suggestionBox.style.display = "none";
            });

            item.addEventListener("mouseover", () => {
                [...suggestionBox.children].forEach(n => {
                    n.style.background = "";
                });

                item.style.background = "#52575C";
            });

            suggestionBox.appendChild(item);
        });

        suggestionBox.style.display =
            filtered.length > 0 ? "block" : "none";

        currentFocus = -1;

        updateSuggestionBoxPosition();
    }

    function performSearch() {
        const query = input.value.trim();

        if (query.length > 1) {
            showSearchModal(query);

            input.value = "";

            suggestionBox.style.display = "none";

            searchBox.classList.remove("expanded");
        }
    }

    if (searchIcon) {
        searchIcon.addEventListener("click", (e) => {
            e.preventDefault();

            input.focus();

            performSearch();
        });
    }

    input.addEventListener("keyup", (e) => {
        const query = input.value.trim();

        const items = suggestionBox.querySelectorAll("div");

        if (e.key === "ArrowDown") {
            if (items.length === 0) return;

            currentFocus++;

            if (currentFocus >= items.length) {
                currentFocus = 0;
            }

            items.forEach(el => {
                el.style.background = "";
            });

            items[currentFocus].style.background = "#52575C";
        }

        else if (e.key === "ArrowUp") {
            if (items.length === 0) return;

            currentFocus--;

            if (currentFocus < 0) {
                currentFocus = items.length - 1;
            }

            items.forEach(el => {
                el.style.background = "";
            });

            items[currentFocus].style.background = "#52575C";
        }

        else if (e.key === "Enter") {
            e.preventDefault();

            if (currentFocus > -1 && items[currentFocus]) {
                items[currentFocus].click();
            } else {
                performSearch();
            }
        }

        else {
            updateSuggestions(query);
        }
    });

    document.addEventListener("click", (e) => {
        if (!searchBox.contains(e.target)) {
            if (input.value.trim() !== "") {
                suggestionBox.style.display = "none";
            } else {
                searchBox.classList.remove("expanded");

                suggestionBox.style.display = "none";
            }
        }
    });

    searchBox.addEventListener("click", () => {
        if (input.value.trim() !== "") {
            suggestionBox.style.display =
                suggestionBox.children.length > 0 ? "block" : "none";
        }

        searchBox.classList.add("expanded");

        input.focus();

        showSuggestionsOnFocus();
    });

    input.addEventListener("blur", () => {
        setTimeout(() => {
            if (input.value.trim() === "") {
                suggestionBox.style.display = "none";

                searchBox.classList.remove("expanded");
            }
        }, 150);
    });

    input.addEventListener("input", () => {
        updateSuggestionBoxPosition();

        if (input.value.trim() !== "") {
            searchBox.classList.add("expanded");

            if (suggestionBox.children.length > 0) {
                suggestionBox.style.display = "block";
            }

        } else {
            searchBox.classList.remove("expanded");

            suggestionBox.style.display = "none";
        }
    });

    input.addEventListener("focus", () => {
        updateSuggestionBoxPosition();

        setTimeout(() => {
            showSuggestionsOnFocus();
        }, 400);
    });

    document.addEventListener("keydown", (e) => {
        if (
            e.key === "/" &&
            e.target.tagName !== "INPUT" &&
            e.target.tagName !== "TEXTAREA"
        ) {
            e.preventDefault();

            searchBox.classList.add("expanded");

            setTimeout(() => {
                input.focus();

                showSuggestionsOnFocus();
            }, 400);
        }

        if (e.key === "Escape") {
            suggestionBox.style.display = "none";

            input.blur();

            if (input.value.trim().length === 0) {
                searchBox.classList.remove("expanded");
            }
        }
    });
});

export { searchMatches, showSearchModal };
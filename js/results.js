
import { renderStandingsRows } from "./standingsTable.js";
import { clubScoreColor, highlightClub } from "./matchUtils.js";
import { resultsData } from "./resultsData.js";
import { standingsData } from "./standingsData.js";
import { seasonMedals } from "./seasonMedals.js";
import { leagueFixturesData } from "./leagueFixturesData.js";

document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("resultsTableBody");
    const seasonButton = document.getElementById("seasonDropdown");

    const standingsTableBody = document.getElementById("standingsTableBody");
    const seasonTitle = document.getElementById("seasonTitle");
    const medalIcon = document.getElementById("medalIcon");
    const pdfLink = document.getElementById("pdfLink");
    const resultsModalEl = document.getElementById("resultsModal");

    const CLUB_NAMES = ["Young Boys Gorlice", "Young Boys"];

    let currentSeason = "2026/27";
    let currentTableIndex = 0;

    function t(key) {
        return translations[currentLang]?.[key] || key;
    }

    // =========================================
    // ROZPOZNAWANIE MECZÓW YOUNG BOYS
    // =========================================

    function getTeams(match) {
        return match.team.split(/\s+-\s+/).map(team => team.trim());
    }

    function isClubTeam(team) {
        return CLUB_NAMES.includes(team.trim());
    }

    function getClubMatches(season) {
        // Obecny sezon pobieramy bezpośrednio z terminarza.
        if (Number(season.split("/")[0]) >= 2026) {
            return (leagueFixturesData[season] || []).filter(match =>
                getTeams(match).some(isClubTeam)
            );
        }

        // Starsze sezony korzystają z dotychczasowych danych.
        return resultsData[season] || [];
    }

    function getClubScorers(match) {
        if (!match.scorers) return "";

        const teams = getTeams(match);
        const scorers = match.scorers.split(/\s+-\s+/);

        if (teams.length !== 2 || scorers.length !== 2) {
            return match.scorers;
        }

        const clubIndex = teams.findIndex(isClubTeam);

        if (clubIndex === -1) return "";

        return scorers[clubIndex].trim();
    }

    // =========================================
    // WYNIKI KLUBU
    // =========================================

    function updateTable(season) {
        if (!tableBody) return;

        const matches = getClubMatches(season);

        if (matches.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3">Brak wyników dla sezonu ${season}.</td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = matches.map((match, index) => {
            const scoreColor = clubScoreColor(match);
            const highlightedTeam = highlightClub(match.team);

            const scorers = Number(season.split("/")[0]) >= 2026
                ? getClubScorers(match)
                : match.scorers;

            const scoreDisplay = match.score
                ? match.score
                : `<span data-i18n="table.toBePlayed">${t("table.toBePlayed")}</span>`;

            const scorersDisplay = scorers
                ? scorers
                : `<span data-i18n="table.noData">${t("table.noData")}</span>`;

            return `
                <tr class="match-row" data-index="${index}">
                    <td>${match.date.split(" ")[0]}</td>
                    <td>${highlightedTeam}</td>
                    <td style="color: ${scoreColor};">${scoreDisplay}</td>
                </tr>
                <tr class="scorers-row" data-index="${index}" style="display: none;">
                    <td colspan="3">
                        ⚽ <span class="scorers-text">${scorersDisplay}</span>
                    </td>
                </tr>
            `;
        }).join("");

        tableBody.querySelectorAll(".match-row").forEach(row => {
            row.style.cursor = "pointer";

            row.addEventListener("click", function () {
                const index = this.dataset.index;
                const scorerRow = tableBody.querySelector(
                    `.scorers-row[data-index="${index}"]`
                );

                if (scorerRow) {
                    scorerRow.style.display =
                        scorerRow.style.display === "none"
                            ? "table-row"
                            : "none";
                }
            });
        });
    }

    // =========================================
    // AUTOMATYCZNA TABELA LIGOWA
    // =========================================

    function generateStandingsFromFixtures(season) {
        const matches = leagueFixturesData[season] || [];
        const teams = new Map();
        const playedMatches = [];

        function parseScore(score) {
            const result = String(score || "").trim().match(
                /^(\d+)\s*(?:-|–|—|:)\s*(\d+)$/
            );

            if (!result) return null;

            return {
                homeGoals: Number(result[1]),
                awayGoals: Number(result[2])
            };
        }

        function addTeam(name) {
            if (!teams.has(name)) {
                teams.set(name, {
                    team: name,
                    matches: 0,
                    points: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goalsFor: 0,
                    goalsAgainst: 0
                });
            }

            return teams.get(name);
        }

        const fixtures = matches.map(match => {
            const names = getTeams(match);

            if (names.length !== 2) return null;

            return {
                homeName: names[0],
                awayName: names[1],
                home: addTeam(names[0]),
                away: addTeam(names[1]),
                score: parseScore(match.score)
            };
        });

        const seasonComplete =
            fixtures.length > 0 &&
            fixtures.every(fixture => fixture && fixture.score);

        fixtures.forEach(fixture => {
            if (!fixture || !fixture.score) return;

            const { home, away, homeName, awayName, score } = fixture;
            const { homeGoals, awayGoals } = score;

            home.matches++;
            away.matches++;

            home.goalsFor += homeGoals;
            home.goalsAgainst += awayGoals;

            away.goalsFor += awayGoals;
            away.goalsAgainst += homeGoals;

            if (homeGoals > awayGoals) {
                home.points += 3;
                home.wins++;
                away.losses++;
            } else if (homeGoals < awayGoals) {
                away.points += 3;
                away.wins++;
                home.losses++;
            } else {
                home.points++;
                away.points++;
                home.draws++;
                away.draws++;
            }

            playedMatches.push({
                home: homeName,
                away: awayName,
                homeGoals,
                awayGoals
            });
        });

        function compareOverall(a, b) {
            return (
                b.points - a.points ||
                (b.goalsFor - b.goalsAgainst) -
                (a.goalsFor - a.goalsAgainst) ||
                b.goalsFor - a.goalsFor
            );
        }

        let sortedTeams;

        if (!seasonComplete) {
            sortedTeams = [...teams.values()].sort(compareOverall);
        } else {
            const byPoints = [...teams.values()].sort(
                (a, b) => b.points - a.points
            );

            sortedTeams = [];

            let index = 0;

            while (index < byPoints.length) {
                let nextIndex = index + 1;

                while (
                    nextIndex < byPoints.length &&
                    byPoints[nextIndex].points === byPoints[index].points
                ) {
                    nextIndex++;
                }

                const tiedTeams = byPoints.slice(index, nextIndex);

                if (tiedTeams.length === 1) {
                    sortedTeams.push(tiedTeams[0]);
                    index = nextIndex;
                    continue;
                }

                const tiedNames = new Set(
                    tiedTeams.map(team => team.team)
                );

                const headToHead = new Map();

                tiedTeams.forEach(team => {
                    headToHead.set(team.team, {
                        points: 0,
                        goalsFor: 0,
                        goalsAgainst: 0
                    });
                });

                playedMatches.forEach(match => {
                    if (
                        !tiedNames.has(match.home) ||
                        !tiedNames.has(match.away)
                    ) return;

                    const home = headToHead.get(match.home);
                    const away = headToHead.get(match.away);

                    home.goalsFor += match.homeGoals;
                    home.goalsAgainst += match.awayGoals;

                    away.goalsFor += match.awayGoals;
                    away.goalsAgainst += match.homeGoals;

                    if (match.homeGoals > match.awayGoals) {
                        home.points += 3;
                    } else if (match.homeGoals < match.awayGoals) {
                        away.points += 3;
                    } else {
                        home.points++;
                        away.points++;
                    }
                });

                tiedTeams.sort((a, b) => {
                    const hA = headToHead.get(a.team);
                    const hB = headToHead.get(b.team);

                    return (
                        hB.points - hA.points ||
                        (hB.goalsFor - hB.goalsAgainst) -
                        (hA.goalsFor - hA.goalsAgainst) ||
                        hB.goalsFor - hA.goalsFor ||
                        compareOverall(a, b)
                    );
                });

                sortedTeams.push(...tiedTeams);
                index = nextIndex;
            }
        }

        return sortedTeams.map((team, index) => ({
            position: index + 1,
            team: team.team,
            matches: team.matches,
            points: team.points,
            balance: `${team.goalsFor}-${team.goalsAgainst}`
        }));
    }

    // =========================================
    // WYŚWIETLANIE TABELI
    // =========================================

    function renderSingleTable(table) {
        renderStandingsRows(standingsTableBody, table);
    }

    function renderMultiTable(tableObj) {
        renderStandingsRows(standingsTableBody, tableObj.rows);
    }

    function removeNavigationButtons() {
        document.getElementById("modalNavButtons")?.remove();
    }

    function updateTableInfo() {
        const infoText = document.getElementById("tableInfoText");
        if (!infoText) return;

        const seasonData = standingsData[currentSeason];

        if (seasonData?.type !== "multi") return;

        const table = seasonData.tables[currentTableIndex];

        infoText.textContent = table.titleKey
            ? t(table.titleKey)
            : table.title || "";
    }

    function addNavigationButtons(totalTables) {
        removeNavigationButtons();

        const modalBody = document.querySelector(
            "#resultsModal .modal-body"
        );

        if (!modalBody) return;

        const navDiv = document.createElement("div");
        navDiv.id = "modalNavButtons";
        navDiv.style.display = "flex";
        navDiv.style.alignItems = "center";
        navDiv.style.justifyContent = "space-between";
        navDiv.style.marginBottom = "10px";

        const infoText = document.createElement("div");
        infoText.id = "tableInfoText";
        infoText.style.flex = "1";
        infoText.style.textAlign = "center";
        infoText.style.fontWeight = "bold";

        const prevBtn = document.createElement("button");
        prevBtn.className = "btn btn-dark btn-sm";
        prevBtn.innerHTML = '<i class="bi bi-caret-left-fill"></i>';

        const nextBtn = document.createElement("button");
        nextBtn.className = "btn btn-dark btn-sm";
        nextBtn.innerHTML = '<i class="bi bi-caret-right-fill"></i>';

        function showTable() {
            const table = standingsData[currentSeason].tables[currentTableIndex];

            infoText.textContent = table.titleKey
                ? t(table.titleKey)
                : table.title || "";

            renderMultiTable(table);

            prevBtn.disabled = currentTableIndex === 0;
            nextBtn.disabled = currentTableIndex === totalTables - 1;
        }

        prevBtn.addEventListener("click", () => {
            if (currentTableIndex > 0) {
                currentTableIndex--;
                showTable();
            }
        });

        nextBtn.addEventListener("click", () => {
            if (currentTableIndex < totalTables - 1) {
                currentTableIndex++;
                showTable();
            }
        });

        navDiv.append(prevBtn, infoText, nextBtn);
        modalBody.prepend(navDiv);

        showTable();
    }

    function loadStandings(season) {
        if (!standingsTableBody || !seasonTitle) return;

        standingsTableBody.innerHTML = "";
        seasonTitle.textContent = season;
        currentTableIndex = 0;

        removeNavigationButtons();

        // Od sezonu 2026/27 tabela jest generowana z terminarza.
        if (Number(season.split("/")[0]) >= 2026) {
            const generatedTable = generateStandingsFromFixtures(season);
            renderSingleTable(generatedTable);
            return;
        }

        const seasonData = standingsData[season];

        if (!seasonData) {
            console.error("Brak danych tabeli dla sezonu:", season);
            return;
        }

        if (seasonData.type === "multi") {
            renderMultiTable(seasonData.tables[0]);
            addNavigationButtons(seasonData.tables.length);
        } else if (Array.isArray(seasonData)) {
            renderSingleTable(seasonData);
        }
    }

    // =========================================
    // MEDAL I PDF
    // =========================================

    function updateMedal(season) {
        if (!medalIcon) return;

        medalIcon.src =
            seasonMedals[season] || "images/pedestal-podium.svg";
    }

    function updatePdfLink(season) {
        if (!pdfLink) return;

        pdfLink.href =
            `pdf/league/wyniki_${season.replace("/", "-")}.pdf`;
    }

    function changeSeason(season) {
        currentSeason = season;

        if (seasonButton) {
            seasonButton.textContent = season;
        }

        updateTable(season);
        loadStandings(season);
        updateMedal(season);
        updatePdfLink(season);
    }

    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", function () {
            const selectedSeason = this.textContent.trim();

            if (/^\d{4}\/\d{2}$/.test(selectedSeason)) {
                changeSeason(selectedSeason);
            }
        });
    });

    if (resultsModalEl) {
        resultsModalEl.addEventListener("shown.bs.modal", () => {
            updateTableInfo();
        });
    }

    if (medalIcon && resultsModalEl) {
        medalIcon.addEventListener("click", () => {
            loadStandings(currentSeason);

            const modal = new bootstrap.Modal(resultsModalEl);
            modal.show();
        });
    }

    changeSeason("2026/27");
});

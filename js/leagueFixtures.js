import { renderStandingsRows } from "./standingsTable.js";
import { highlightClub } from "./matchUtils.js";
import { leagueFixturesData } from "./leagueFixturesData.js";
import { standingsData } from "./standingsData.js";
import { seasonMedals } from "./seasonMedals.js";
import { formatMatchScorers } from "./scorerUtils.js";

document.addEventListener("DOMContentLoaded", function () {
    const seasonDropdownButton = document.getElementById("fixturesSeasonDropdown");
    const seasonDropdownItems = document.querySelectorAll(".dropdown-menu .dropdown-item");
    const standingsTableBody = document.getElementById("standingsTableBody");
    const seasonTitle = document.getElementById("seasonTitle");
    const medalIcon = document.getElementById("medalIcon");
    const pdfLink = document.getElementById("pdfLink");

    let currentSeason = "2026/27";
    let currentTableIndex = 0;
    seasonDropdownButton.textContent = currentSeason;

    function parsePLDate(dateStr) {
        const [day, month, year] = dateStr.split(".");
        return new Date(year, month - 1, day, 12);
    }

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

    function addTeam(teamName) {
        if (!teams.has(teamName)) {
            teams.set(teamName, {
                team: teamName,
                matches: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                points: 0,
                goalsFor: 0,
                goalsAgainst: 0
            });
        }

        return teams.get(teamName);
    }

    const fixtures = matches.map(match => {
        const teamsInMatch = match.team.split(/\s+-\s+/);

        if (teamsInMatch.length !== 2) return null;

        const homeName = teamsInMatch[0].trim();
        const awayName = teamsInMatch[1].trim();

        const home = addTeam(homeName);
        const away = addTeam(awayName);

        return {
            homeName,
            awayName,
            home,
            away,
            score: parseScore(match.score)
        };
    });

    const seasonComplete =
        fixtures.length > 0 &&
        fixtures.every(fixture => fixture !== null && fixture.score !== null);

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
        const goalDifferenceA = a.goalsFor - a.goalsAgainst;
        const goalDifferenceB = b.goalsFor - b.goalsAgainst;

        return (
            b.points - a.points ||
            goalDifferenceB - goalDifferenceA ||
            b.goalsFor - a.goalsFor
        );
    }

    let sortedTeams;

    if (!seasonComplete) {

        sortedTeams = [...teams.values()].sort(compareOverall);

    } else {

        const teamsByPoints = [...teams.values()].sort(
            (a, b) => b.points - a.points
        );

        sortedTeams = [];

        let index = 0;

        while (index < teamsByPoints.length) {

            let nextIndex = index + 1;

            while (
                nextIndex < teamsByPoints.length &&
                teamsByPoints[nextIndex].points === teamsByPoints[index].points
            ) {
                nextIndex++;
            }

            const tiedTeams = teamsByPoints.slice(index, nextIndex);

            if (tiedTeams.length === 1) {
                sortedTeams.push(tiedTeams[0]);
                index = nextIndex;
                continue;
            }

            const tiedTeamNames = new Set(
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
                    !tiedTeamNames.has(match.home) ||
                    !tiedTeamNames.has(match.away)
                ) {
                    return;
                }

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
                const headA = headToHead.get(a.team);
                const headB = headToHead.get(b.team);

                const headDifferenceA =
                    headA.goalsFor - headA.goalsAgainst;

                const headDifferenceB =
                    headB.goalsFor - headB.goalsAgainst;

                return (
                    headB.points - headA.points ||

                    headDifferenceB - headDifferenceA ||

                    headB.goalsFor - headA.goalsFor ||

                    (b.goalsFor - b.goalsAgainst) -
                    (a.goalsFor - a.goalsAgainst) ||

                    b.goalsFor - a.goalsFor
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

    function getDefaultOpenRoundIndex(roundDates) {
        const now = new Date();
        let resultIndex = -1;

        for (let i = 0; i < roundDates.length; i++) {
            const roundDate = parsePLDate(roundDates[i]);

            const endOfVisibility = new Date(roundDate);
            endOfVisibility.setDate(endOfVisibility.getDate() + 2);
            endOfVisibility.setHours(23, 59, 59, 999);

            if (now <= endOfVisibility) {
                resultIndex = i;
                break;
            }

            if (now > endOfVisibility && i + 1 < roundDates.length) {
                resultIndex = i + 1;
            }
        }

        return resultIndex;
    }

    function updateFixtures(season = currentSeason) {
        const container = document.getElementById("fixturesContainer");
        container.innerHTML = "";

        const rounds = {};
        leagueFixturesData[season].forEach(match => {
            const day = match.date.split(" ")[0];
            if (!rounds[day]) rounds[day] = [];
            rounds[day].push(match);
        });

        const roundDates = Object.keys(rounds).sort(
            (a, b) => parsePLDate(a) - parsePLDate(b)
        );

        let defaultOpenIndex;
        const lastMatchDate = parsePLDate(roundDates[roundDates.length - 1]);
        if (lastMatchDate >= new Date()) {
            defaultOpenIndex = getDefaultOpenRoundIndex(roundDates);
        } else {
            defaultOpenIndex = -1;
        }

        roundDates.forEach((date, roundIndex) => {
            const isOpen = roundIndex === defaultOpenIndex;
            const roundDiv = document.createElement("div");
            roundDiv.classList.add("round");

            const header = document.createElement("div");
            header.classList.add("round-header");
            header.style.cursor = "pointer";
            header.style.background = "#212529";
            header.style.padding = "10px 10px";
            header.innerHTML = `<span data-i18n="round">${translations[currentLang]["round"]}</span> ${roundIndex + 1} - ${date} <span class="round-arrow" style="float:right;">${isOpen ? "▾" : "▸"}</span>`;
            roundDiv.appendChild(header);

            const body = document.createElement("div");
            body.classList.add("round-body");

            if (isOpen) {
                body.classList.add("open");
                requestAnimationFrame(() => {
                    body.style.maxHeight = body.scrollHeight + "px";
                });
            }

            const table = document.createElement("table");
            table.className = "table table-dark table-striped table-hover";

            const thead = document.createElement("thead");
            thead.innerHTML = `
                <tr>
                    <th data-i18n="table.hour">${translations[currentLang]["table.hour"]}</th>
                    <th data-i18n="table.match">${translations[currentLang]["table.match"]}</th>
                    <th data-i18n="table.score">${translations[currentLang]["table.score"]}</th>
                </tr>
            `;
            table.appendChild(thead);

            const tbody = document.createElement("tbody");

            rounds[date].forEach(match => {
                const highlightedTeam = highlightClub(match.team);

                const scoreDisplay = match.score
                    ? match.score
                    : `<span data-i18n="table.toBePlayed">${translations[currentLang]["table.toBePlayed"]}</span>`;

                const scorersDisplay = match.scorers
                    ? match.scorers
                    : `<span data-i18n="table.noData">${translations[currentLang]["table.noData"]}</span>`;

                const trMatch = document.createElement("tr");
                trMatch.classList.add("match-row");
                trMatch.style.cursor = "pointer";
                trMatch.innerHTML = `<td>${match.date.split(" ")[1]}</td><td>${highlightedTeam}</td><td>${scoreDisplay}</td>`;
                tbody.appendChild(trMatch);

                const trScorers = document.createElement("tr");
                trScorers.classList.add("scorers-row");
                trScorers.style.display = "none";
                trScorers.innerHTML = `<td colspan="3">⚽ <span class="scorers-text">${scorersDisplay}</span></td>`;
                tbody.appendChild(trScorers);

                trMatch.addEventListener("click", () => {
                    const isHidden = trScorers.style.display === "none";

                    trScorers.style.display = isHidden ? "table-row" : "none";

                    const body = trMatch.closest(".round-body");
                    if (body) {
                        requestAnimationFrame(() => {
                            body.style.maxHeight = body.scrollHeight + "px";
                        });
                    }
                });

            });

            table.appendChild(tbody);
            body.appendChild(table);
            roundDiv.appendChild(body);
            container.appendChild(roundDiv);

            header.addEventListener("click", () => {
                const isOpen = body.classList.contains("open");
                const arrow = header.querySelector(".round-arrow");

                if (isOpen) {
                    body.style.maxHeight = body.scrollHeight + "px";
                    requestAnimationFrame(() => {
                        body.style.maxHeight = "0";
                        body.classList.remove("open");
                        arrow.textContent = "▸";
                    });
                } else {
                    body.classList.add("open");
                    body.style.maxHeight = body.scrollHeight + "px";
                    arrow.textContent = "▾";
                }
            });
        });

        pdfLink.href = `pdf/league/wyniki_${season.replace("/", "-")}.pdf`;
        medalIcon.src = seasonMedals[season];
    }

    updateFixtures();

    seasonDropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            currentSeason = item.textContent.trim();
            seasonDropdownButton.textContent = currentSeason;
            updateFixtures(currentSeason);
        });
    });

    function loadStandings() {
        seasonTitle.textContent = currentSeason;

        const seasonStartYear = Number(currentSeason.split("/")[0]);

        if (seasonStartYear >= 2026) {
            currentTableIndex = 0;
            removeNavigationButtons();

            const generatedTable = generateStandingsFromFixtures(currentSeason);

            renderSingleTable(generatedTable);

            return;
        }

        const seasonData = standingsData[currentSeason];

        if (!seasonData) {
            console.error("Brak danych standingsData dla sezonu:", currentSeason);
            return;
        }

        if (seasonData.type === "multi") {
            currentTableIndex = 0;
            renderMultiTable(seasonData.tables[currentTableIndex]);
            addNavigationButtons(seasonData.tables.length);
        } else {
            renderSingleTable(seasonData);
            removeNavigationButtons();
        }
    }

    function renderSingleTable(table) {
        renderStandingsRows(standingsTableBody, table);
    }

    function renderMultiTable(tableObj) {
        renderStandingsRows(standingsTableBody, tableObj.rows);
    }

    function addNavigationButtons(totalTables) {
        removeNavigationButtons();

        const modalBody = document.querySelector("#resultsModal .modal-body");

        const navDiv = document.createElement("div");
        navDiv.id = "modalNavButtons";
        navDiv.className = "d-flex justify-content-between mb-2";

        const infoText = document.createElement("div");
        infoText.id = "tableInfoText";
        infoText.style.fontWeight = "bold";
        infoText.textContent = standingsData[season].tables[currentTableIndex].title;

        const prev = document.createElement("button");
        prev.className = "btn btn-dark btn-sm";
        prev.innerHTML = '<i class="bi bi-caret-left-fill"></i>';
        prev.onclick = () => {
            if (currentTableIndex > 0) {
                currentTableIndex--;
                updateInfo();
            }
        };

        const next = document.createElement("button");
        next.className = "btn btn-dark btn-sm";
        next.innerHTML = '<i class="bi bi-caret-right-fill"></i>';
        next.onclick = () => {
            if (currentTableIndex < totalTables - 1) {
                currentTableIndex++;
                updateInfo();
            }
        };

        function updateInfo() {
            infoText.textContent = standingsData[season].tables[currentTableIndex].title;
            renderMultiTable(standingsData[season].tables[currentTableIndex]);
        }

        navDiv.appendChild(prev);
        navDiv.appendChild(infoText);
        navDiv.appendChild(next);

        modalBody.prepend(navDiv);
    }

    function removeNavigationButtons() {
        const nav = document.getElementById("modalNavButtons");
        if (nav) nav.remove();
    }

    medalIcon.addEventListener("click", () => {
        new bootstrap.Modal(document.getElementById("resultsModal")).show();
        loadStandings();
    });

});

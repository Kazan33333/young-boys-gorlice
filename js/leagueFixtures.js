import { leagueFixturesData } from "./leagueFixturesData.js";
import { standingsData } from "./standingsData.js";
import { seasonMedals } from "./seasonMedals.js";

document.addEventListener("DOMContentLoaded", function () {
    const seasonDropdownButton = document.getElementById("fixturesSeasonDropdown");
    const seasonDropdownItems = document.querySelectorAll(".dropdown-menu .dropdown-item");
    const fixturesContainer = document.getElementById("fixturesTableBody");
    const standingsTableBody = document.getElementById("standingsTableBody");
    const seasonTitle = document.getElementById("seasonTitle");
    const medalIcon = document.getElementById("medalIcon");
    const pdfLink = document.getElementById("pdfLink");

    let currentSeason = "2025/26";
    let currentTableIndex = 0;
    seasonDropdownButton.textContent = currentSeason;

    function parsePLDate(dateStr) {
        const [day, month, year] = dateStr.split(".");
        return new Date(year, month - 1, day, 12);
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

        const defaultOpenIndex = getDefaultOpenRoundIndex(roundDates);

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

            rounds[date].forEach((match, matchIndex) => {
                const highlightedTeam = match.team.replace(
                    "Young Boys Gorlice",
                    "<span style='color: gold;'>Young Boys Gorlice</span>"
                );

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
        standingsTableBody.innerHTML = "";
        table.forEach(team => {
            const isYBG = team.team === "Young Boys Gorlice" ? 'style="color: gold;"' : "";
            standingsTableBody.insertAdjacentHTML("beforeend", `
                <tr ${isYBG}>
                    <td>${team.position}</td>
                    <td>${team.team}</td>
                    <td>${team.matches}</td>
                    <td>${team.points}</td>
                    <td>${team.balance}</td>
                </tr>
            `);
        });
    }

    function renderMultiTable(tableObj) {
        standingsTableBody.innerHTML = "";
        tableObj.rows.forEach(team => {
            const isYBG = team.team === "Young Boys Gorlice" ? 'style="color: gold;"' : "";
            standingsTableBody.insertAdjacentHTML("beforeend", `
                <tr ${isYBG}>
                    <td>${team.position}</td>
                    <td>${team.team}</td>
                    <td>${team.matches}</td>
                    <td>${team.points}</td>
                    <td>${team.balance}</td>
                </tr>
            `);
        });
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

    pdfLink.href = `pdf/league/wyniki_2025-26.pdf`;

    medalIcon.addEventListener("click", () => {
        new bootstrap.Modal(document.getElementById("resultsModal")).show();
        loadStandings();
    });

});

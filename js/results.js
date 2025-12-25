import { resultsData } from "./resultsData.js";
import { standingsData } from "./standingsData.js";
import { seasonMedals } from "./seasonMedals.js";

document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("resultsTableBody");
    const seasonDropdownItems = document.querySelectorAll(".dropdown-menu .dropdown-item");
    const seasonButton = document.getElementById("seasonDropdown");

    function updateTable(season) {
        tableBody.innerHTML = "";
        resultsData[season].forEach((match, index) => {
            const scores = match.score.split(" - ").map(Number);
            const teams = match.team.split(" - ");
            const ourTeamIndex = teams.indexOf("Young Boys Gorlice");
            let scoreColor = "";

            if (ourTeamIndex !== -1) {
                const ourScore = scores[ourTeamIndex];
                const opponentScore = scores[1 - ourTeamIndex];
                
                if (ourScore > opponentScore) {
                    scoreColor = "chartreuse";
                } else if (ourScore < opponentScore) {
                    scoreColor = "red";
                }
            }

            const highlightedTeam = match.team.replace("Young Boys Gorlice", "<span style='color: gold;'>Young Boys Gorlice</span>");
            
            const row = `<tr class="match-row" data-index="${index}">
                            <td>${match.date}</td>
                            <td>${highlightedTeam}</td>
                            <td style="color: ${scoreColor};">${match.score ? match.score : `<span data-i18n="table.toBePlayed">${translations[currentLang]["table.toBePlayed"]}</span>`}</td>
                         </tr>
                         <tr class="scorers-row" data-index="${index}" style="display: none;">
                            <td colspan="3">⚽ <span class="scorers-text">${match.scorers ? match.scorers : `<span data-i18n="table.noData">${translations[currentLang]["table.noData"]}</span>`}</span></td>
                         </tr>`;
            tableBody.innerHTML += row;
        });

        document.querySelectorAll(".match-row").forEach(row => {
            row.style.cursor = "pointer";
            row.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                const scorerRow = document.querySelector(`.scorers-row[data-index='${index}']`);
                scorerRow.style.display = scorerRow.style.display === "none" ? "table-row" : "none";
            });
        });
    }

    seasonDropdownItems.forEach(item => {
        item.addEventListener("click", function () {
            const selectedSeason = this.textContent.trim();
            seasonButton.textContent = selectedSeason;
            updateTable(selectedSeason);
        });
    });

    const defaultSeason = "2025/26";
    seasonButton.textContent = defaultSeason;
    updateTable(defaultSeason);
});

document.addEventListener("DOMContentLoaded", function() {
    const standingsTableBody = document.getElementById("standingsTableBody");
    const seasonTitle = document.getElementById("seasonTitle");
    const medalIcon = document.getElementById("medalIcon");
    const pdfLink = document.getElementById("pdfLink");

    let currentTableIndex = 0;

    function loadStandings(season) {
        standingsTableBody.innerHTML = "";
        seasonTitle.textContent = season;

        const seasonData = standingsData[season];

        if (seasonData && seasonData.type === "multi") {
            currentTableIndex = 1;
            renderMultiTable(seasonData.tables[currentTableIndex]);
            addNavigationButtons(seasonData.tables.length);
        } else if (Array.isArray(seasonData)) {
            renderSingleTable(seasonData);
            removeNavigationButtons();
        }
    }

    function renderSingleTable(table) {
        standingsTableBody.innerHTML = "";
        table.forEach(team => {
            const myTeam = team.team === "Young Boys Gorlice" ? 'style="color: gold;"' : "";
            const row = `<tr ${myTeam}>
                <td>${team.position}</td>
                <td>${team.team}</td>
                <td>${team.matches}</td>
                <td>${team.points}</td>
                <td>${team.balance}</td>
            </tr>`;
            standingsTableBody.insertAdjacentHTML('beforeend', row);
        });
    }

    function renderMultiTable(tableObj) {
        standingsTableBody.innerHTML = "";

        tableObj.rows.forEach(team => {
            const myTeam = team.team === "Young Boys Gorlice" ? 'style="color: gold;"' : "";
            const row = `<tr ${myTeam}>
                <td>${team.position}</td>
                <td>${team.team}</td>
                <td>${team.matches}</td>
                <td>${team.points}</td>
                <td>${team.balance}</td>
            </tr>`;
            standingsTableBody.insertAdjacentHTML('beforeend', row);
        });
    }

    function t(key) {
        return translations[currentLang]?.[key] || key;
    }

    function updateTableInfo() {
        const infoText = document.getElementById("tableInfoText");
        if (!infoText) return;

        const season = seasonTitle.textContent;
        const table = standingsData[season]?.tables?.[currentTableIndex];

        if (table?.titleKey) {
            infoText.textContent = t(table.titleKey);
        }
    }

    function addNavigationButtons(totalTables) {
        removeNavigationButtons();

        const modalBody = document.querySelector("#resultsModal .modal-body");

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
        
        const table = standingsData[seasonTitle.textContent].tables[currentTableIndex];

        infoText.textContent = t(table.titleKey);

        const prevBtn = document.createElement("button");
        prevBtn.className = "btn btn-dark btn-sm";
        prevBtn.innerHTML = '<i class="bi bi-caret-left-fill"></i>';
        prevBtn.addEventListener("click", () => {
            if (currentTableIndex > 0) {
                currentTableIndex--;
                updateTableInfo();
                renderMultiTable(
                    standingsData[seasonTitle.textContent].tables[currentTableIndex]
                );
            }
        });

        const nextBtn = document.createElement("button");
        nextBtn.className = "btn btn-dark btn-sm";
        nextBtn.innerHTML = '<i class="bi bi-caret-right-fill"></i>';
        nextBtn.addEventListener("click", () => {
            if (currentTableIndex < totalTables - 1) {
                currentTableIndex++;
                updateTableInfo();
                renderMultiTable(
                    standingsData[seasonTitle.textContent].tables[currentTableIndex]
                );
            }
        });

        navDiv.appendChild(prevBtn);
        navDiv.appendChild(infoText);
        navDiv.appendChild(nextBtn);

        modalBody.prepend(navDiv);
    }

    function removeNavigationButtons() {
        const existingNav = document.getElementById("modalNavButtons");
        if (existingNav) existingNav.remove();
    }

    function updateMedal(season) {
        if (seasonMedals[season]) {
            medalIcon.src = seasonMedals[season];
        }
    }

    function updatePdfLink(season) {
        const pdfFilename = `wyniki_${season.replace("/", "-")}.pdf`;
        pdfLink.href = `pdf/league/${pdfFilename}`;
    }

    const resultsModalEl = document.getElementById("resultsModal");

    resultsModalEl.addEventListener("shown.bs.modal", () => {
        updateTableInfo();
    });

    medalIcon.addEventListener("click", () => {
        updateTableInfo();
        const modal = new bootstrap.Modal(resultsModalEl);
        modal.show();
    });

    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", function () {
            const selectedSeason = this.textContent.trim();
            loadStandings(selectedSeason);
            updateMedal(selectedSeason);
            updatePdfLink(selectedSeason);
        });
    });

    loadStandings("2025/26");
    updateMedal("2025/26");
    updatePdfLink("2025/26");
});

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
    function loadStandings(season) {
        const standingsTableBody = document.getElementById("standingsTableBody");
        const seasonTitle = document.getElementById("seasonTitle");

        seasonTitle.textContent = season;
        standingsTableBody.innerHTML = "";

        const standings = standingsData[season] || [];
        standings.forEach(team => {
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

    function updateMedal(season) {
        const medalIcon = document.getElementById("medalIcon");
        if (seasonMedals[season]) {
            medalIcon.src = seasonMedals[season];
        }
    }

    function updatePdfLink(season) {
        let pdfFilename = "";
    
        if (season === "2021/22") {
            pdfFilename = "wyniki_2021-22.pdf";
        } else if (season === "2019 - Turniej Małego Pola") {
            pdfFilename = "male-pole-2019.pdf";
        }
    
        const pdfUrl = `pdf/league/${pdfFilename}`;
        document.getElementById("pdfLink").href = pdfUrl;
    }

    document.getElementById("medalIcon").addEventListener("click", function() {
        let modal = new bootstrap.Modal(document.getElementById("resultsModal"));
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

import { tournamentResultsData } from "./tournamentsData.js";
import { standingsData } from "./tournamentsStandingsData.js";

document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("resultsTableBody");
    const seasonDropdownItems = document.querySelectorAll(".dropdown-menu .dropdown-item");
    const seasonButton = document.getElementById("seasonDropdown");

    function updateTable(season) {
        tableBody.innerHTML = "";
        tournamentResultsData[season].forEach((match, index) => {
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
            
            const scoreDisplay = match.score
                    ? match.score
                    : `<span data-i18n="table.toBePlayed">${translations[currentLang]["table.toBePlayed"]}</span>`;

            const row = `<tr class="match-row" data-index="${index}">
                            <td>${match.date}</td>
                            <td>${highlightedTeam}</td>
                            <td style="color: ${scoreColor};">${scoreDisplay}</td>
                         </tr>`;
            tableBody.innerHTML += row;
        });
    }

    seasonDropdownItems.forEach(item => {
        item.addEventListener("click", function () {
            const selectedSeason = this.textContent.trim();
            seasonButton.textContent = selectedSeason;
            updateTable(selectedSeason);
        });
    });

    const defaultSeason = "Turniej Futsal - Gorlice 2026";
    seasonButton.textContent = defaultSeason;
    updateTable(defaultSeason);
});

document.addEventListener("DOMContentLoaded", function() {
    const seasonMedals = {
        "Turniej Małego Pola - Gorlice 2019": "images/pedestal-podium.svg",
        "Turniej Małego Pola - Gorlice 2021": "images/bronze-medal-static.svg",
        "Turniej Futsal - Gorlice 2025": "images/pedestal-podium.svg",
        "Turniej Małego Pola - Sękowa 2025": "images/pedestal-podium.svg",
        "Turniej Futsal - Gorlice 2026": "images/gold-medal-static.svg",
    };

    function hideEmptyColumns() {
        const table = document.getElementById("standingsTableBody");
        const rows = table.getElementsByTagName("tr");
        const modalDialog = document.querySelector("#resultsModal .modal-dialog");
    
        let hasMatches = false, hasPoints = false, hasBalance = false;
    
        document.querySelectorAll("#resultsModal thead th, #resultsModal tbody td").forEach(el => {
            el.style.display = "";
        });
    
        for (let row of rows) {
            let cells = row.getElementsByTagName("td");
            if (cells.length >= 4) {
                hasMatches = hasMatches || cells[2].textContent.trim() !== "";
                hasPoints = hasPoints || cells[3].textContent.trim() !== "";
                hasBalance = hasBalance || cells[4].textContent.trim() !== "";
            }
        }
    
        const headers = document.querySelectorAll("#resultsModal thead th");
        if (!hasMatches) headers[2].style.display = "none";
        if (!hasPoints) headers[3].style.display = "none";
        if (!hasBalance) headers[4].style.display = "none";
    
        for (let row of rows) {
            let cells = row.getElementsByTagName("td");
            if (!hasMatches && cells.length >= 4) cells[2].style.display = "none";
            if (!hasPoints && cells.length >= 4) cells[3].style.display = "none";
            if (!hasBalance && cells.length >= 4) cells[4].style.display = "none";
        }
    
        if (!hasMatches && !hasPoints && !hasBalance) {
            headers[0].style.width = "20%";
            headers[1].style.width = "80%";
            modalDialog.classList.remove("modal-lg");
            modalDialog.classList.add("modal-md");
        } else {
            headers[0].style.width = "10%";
            headers[1].style.width = "50%";
            if (hasMatches) headers[2].style.width = "11%";
            if (hasPoints) headers[3].style.width = "11%";
            if (hasBalance) headers[4].style.width = "18%";
    
            modalDialog.classList.remove("modal-md");
            modalDialog.classList.add("modal-lg");
        }
    }
    
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
                <td>${team.matches || ""}</td>
                <td>${team.points || ""}</td>
                <td>${team.balance || ""}</td>
            </tr>`;
            standingsTableBody.insertAdjacentHTML('beforeend', row);
        });
    
        hideEmptyColumns();
    }  

    function updateMedal(season) {
        const medalIcon = document.getElementById("medalIcon");
        if (seasonMedals[season]) {
            medalIcon.src = seasonMedals[season];
        }
    }

    function updatePdfLink(season) {
        let pdfFilename = "";

        if (season === "Turniej Małego Pola - Gorlice 2019") {
            pdfFilename = "male-pole-2019.pdf";
        }
        else if (season === "Turniej Małego Pola - Gorlice 2021") {
            pdfFilename = "male-pole-2021.pdf";
        }
        else if (season === "Turniej Futsal - Gorlice 2025") {
            pdfFilename = "turniej_futsal_2025.pdf";
        }
        else if (season === "Turniej Małego Pola - Sękowa 2025") {
            pdfFilename = "male-pole-2025.pdf";
        }
        else if (season === "Turniej Futsal - Gorlice 2026") {
            pdfFilename = "turniej_futsal_2025.pdf";
        }

        const pdfUrl = `pdf/tournaments/${pdfFilename}`;
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

    loadStandings("Turniej Futsal - Gorlice 2026");
    updateMedal("Turniej Futsal - Gorlice 2026");
    updatePdfLink("Turniej Futsal - Gorlice 2026")
});

import { tournamentResultsData } from "./tournamentsData.js";

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
            
            const row = `<tr class="match-row" data-index="${index}">
                            <td>${match.date}</td>
                            <td>${highlightedTeam}</td>
                            <td style="color: ${scoreColor};">${match.score}</td>
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

    const defaultSeason = "Turniej Małego Pola - Sękowa 2025";
    seasonButton.textContent = defaultSeason;
    updateTable(defaultSeason);
});

document.addEventListener("DOMContentLoaded", function() {
    const standingsData = {
        "Turniej Małego Pola - Gorlice 2019": [
            { position: 1, team: "Solidarność Glinik Gorlice" },
            { position: 2, team: "Hanmart Gorlice" },
            { position: 3, team: "Wojnarowa" },
            { position: 4, team: "Uście Gorlickie" },
            { position: 5, team: "Ogień Sękowa" },
            { position: 6, team: "Young Boys Gorlice" },
            { position: 7, team: "Nafta Kryg" },
            { position: 8, team: "Iskra Tarnów" },
            { position: 9, team: "Stróże" },
            { position: 10, team: "Haller Gorlice" },
            { position: 11, team: "LKS Łużna" },
            { position: 12, team: "Stemik Klęczany" }
        ],
        "Turniej Małego Pola - Gorlice 2021": [
            { position: 1, team: "Solidarność Glinik", matches: 6, points: 16, balance: "25-2" },
            { position: 2, team: "Wysowa-Zdrój", matches: 6, points: 11, balance: "16-5" },
            { position: 3, team: "Young Boys Gorlice", matches: 6, points: 10, balance: "17-15" },
            { position: 4, team: "LKS Łużna", matches: 6, points: 10, balance: "13-13" },
            { position: 5, team: "Gór-Bet", matches: 6, points: 6, balance: "12-25" },
            { position: 6, team: "Ogień Sękowa", matches: 6, points: 4, balance: "9-14" },
            { position: 7, team: "Iskra Tarnów", matches: 6, points: 3, balance: "8-26" },
        ],
        "Turniej Futsal - Gorlice 2025": [
            { position: 1, team: "LKS Łużna" },
            { position: 2, team: "Sokół Staszkówka" },
            { position: 3, team: "JGS Gorlice" },
            { position: 4, team: "Przełęcz Magurska" },
            { position: 5, team: "Young Boys Gorlice" },
            { position: "", team: "Grzmotomocni" },
            { position: "", team: "Silvestria Gorlice" },
            { position: "", team: "Rawian Glass" },
            { position: 9, team: "Redlions" },
            { position: "", team: "Hanmart" },
            { position: "", team: "LKS Kobylanka" },
            { position: "", team: "Ogień Sękowa" },
        ],
        "Turniej Małego Pola - Sękowa 2025": [
            { position: 1, team: "Przełęcz Dukla" },
            { position: 2, team: "FC Haller Gorlice" },
            { position: 3, team: "Welder Kobylanka" },
            { position: 4, team: "Mongoły" },
            { position: 5, team: "Ogień Sękowa" },
            { position: "", team: "Przełęcz Magurska" },
            { position: "", team: "Welder Junior" },
            { position: "", team: "FC Bloxham" },
            { position: 9, team: "Young Boys Gorlice" },
            { position: "", team: "FC Górki" },
            { position: "", team: "Sękowskie Armaty" },
            { position: "", team: "Redlions" },
            { position: 13, team: "Batalion Ropica Górna" },
            { position: "", team: "FC Libusza United" },
            { position: "", team: "FC Po Nalewce" },
            { position: "", team: "Truchcik Libusza" },
            { position: "", team: "Wysowa" }
        ]
    };

    const seasonMedals = {
        "Turniej Małego Pola - Gorlice 2019": "images/pedestal-podium.svg",
        "Turniej Małego Pola - Gorlice 2021": "images/bronze-medal-static.svg",
        "Turniej Futsal - Gorlice 2025": "images/pedestal-podium.svg",
        "Turniej Małego Pola - Sękowa 2025": "images/pedestal-podium.svg",
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
            pdfFilename = "turniejmalegopola2021.pdf";
        }
        else if (season === "Turniej Futsal - Gorlice 2025") {
            pdfFilename = "turniej_futsal_2025.pdf";
        }
        else if (season === "Turniej Małego Pola - Sękowa 2025") {
            pdfFilename = "male-pole-2025.pdf";
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

    loadStandings("Turniej Małego Pola - Sękowa 2025");
    updateMedal("Turniej Małego Pola - Sękowa 2025");
    updatePdfLink("Turniej Małego Pola - Sękowa 2025")
});

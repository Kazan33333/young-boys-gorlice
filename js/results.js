import { resultsData } from "./resultsData.js";

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
    const standingsData = {
        "2018/19": [
            { "position": 1, team: "Haller Gorlice", matches: 14, points: 34, balance: "46-13" },
            { "position": 2, team: "Podhalanin Biecz", matches: 14, points: 26, balance: "41-27" },
            { "position": 3, team: "Kwiatonowice", matches: 14, points: 23, balance: "28-24" },
            { "position": 4, team: "Stemik Klęczany", matches: 14, points: 20, balance: "26-29" },
            { "position": 5, team: "AL-KAM Gorlice", matches: 14, points: 18, balance: "32-33" },
            { "position": 6, team: "Nafta Kryg", matches: 14, points: 17, balance: "17-32" },
            { "position": 7, team: "Young Boys Gorlice", matches: 14, points: 16, balance: "32-38" },
            { "position": 8, team: "Ogień Sękowa", matches: 14, points: 7, balance: "20-46" }
        ],
        "2019/20": [
            { position: 1, team: "Hanmart Gorlice", matches: 15, points: 37, balance: "82-20" },
            { position: 2, team: "Young Boys Gorlice", matches: 15, points: 37, balance: "59-21" },
            { position: 3, team: "Silvestria", matches: 15, points: 35, balance: "53-23" },
            { position: 4, team: "Eko-Par Wiklowski", matches: 15, points: 31, balance: "60-38" },
            { position: 5, team: "LKS Łużna", matches: 15, points: 31, balance: "61-34" },
            { position: 6, team: "Haller", matches: 15, points: 26, balance: "36-36" },
            { position: 7, team: "Gór-Bet Moszczenica", matches: 15, points: 24, balance: "47-37" },
            { position: 8, team: "PMOS Biecz", matches: 15, points: 24, balance: "55-46" },
            { position: 9, team: "LKS Zagórzany", matches: 15, points: 24, balance: "33-38" },
            { position: 10, team: "LKS Szymbark", matches: 15, points: 22, balance: "38-41" },
            { position: 11, team: "Abstynenci", matches: 15, points: 15, balance: "29-54" },
            { position: 12, team: "Stemik Klęczany", matches: 15, points: 15, balance: "34-55" },
            { position: 13, team: "LKS Kwiatonowice", matches: 15, points: 13, balance: "28-49" },
            { position: 14, team: "LKS Nafta Kryg", matches: 15, points: 11, balance: "23-62" },
            { position: 15, team: "Lodownia", matches: 15, points: 8, balance: "20-40" },
            { position: 16, team: "Libusza", matches: 15, points: 0, balance: "14-78" }
        ],
        "2020/21": [
            { position: 1, team: "Hanmart Gorlice", matches: 8, points: 21, balance: "56-6" },
            { position: 2, team: "LKS Łużna", matches: 8, points: 21, balance: "31-18" },
            { position: 3, team: "Coco Jambo", matches: 8, points: 18, balance: "27-10" },
            { position: 4, team: "Uganda", matches: 8, points: 15, balance: "21-28" },
            { position: 5, team: "Ranczo Stróżówka", matches: 8, points: 9, balance: "19-20" },
            { position: 6, team: "Young Boys Gorlice", matches: 8, points: 9, balance: "24-31" },
            { position: 7, team: "Gór Bet Konstrukcje Betonowe", matches: 8, points: 8, balance: "21-28" },
            { position: 8, team: "Team Biecz", matches: 8, points: 7, balance: "22-39" },
            { position: 9, team: "Eko-Par Wiklowski Racławice", matches: 8, points: 6, balance: "13-33" },
            { position: 10, team: "Biała Brunary", matches: 8, points: 4, balance: "22-43" }
        ],
        "2022/23": [
            { position: 1, team: "Hanmart Gorlice", matches: 14, points: 36, balance: "63-29" },
            { position: 2, team: "Young Boys Gorlice", matches: 14, points: 25, balance: "58-38" },
            { position: 3, team: "Glinik Junior", matches: 14, points: 24, balance: "51-50" },
            { position: 4, team: "Smakołysze", matches: 14, points: 24, balance: "46-44" },
            { position: 5, team: "FC Czysta", matches: 14, points: 18, balance: "46-53" },
            { position: 6, team: "Silvestria Gorlice", matches: 14, points: 14, balance: "45-41" },
            { position: 7, team: "LKS Łużna", matches: 14, points: 13, balance: "41-54" },
            { position: 8, team: "Gór-Bet", matches: 14, points: 6, balance: "19-70" }
        ],
        "2023/24": [
            { position: 1, team: "Glinik Junior", matches: 16, points: 38, balance: "77-27" },
            { position: 2, team: "Hanmart Gorlice", matches: 16, points: 37, balance: "87-27" },
            { position: 3, team: "Wysowa", matches: 16, points: 36, balance: "64-33" },
            { position: 4, team: "Young Boys Gorlice", matches: 16, points: 21, balance: "54-67" },
            { position: 5, team: "Silvestria", matches: 16, points: 21, balance: "43-59" },
            { position: 6, team: "LKS Łużna", matches: 16, points: 19, balance: "51-50" },
            { position: 7, team: "Beskid Autokomis", matches: 16, points: 15, balance: "31-45" },
            { position: 8, team: "Grzmotomocni", matches: 16, points: 14, balance: "40-68" },
            { position: 9, team: "Ogień Sękowa", matches: 16, points: 7, balance: "24-95" }
        ],
        "2024/25": [
            { position: 1, team: "Hanmart Gorlice", matches: 11, points: 33, balance: "73-25" },
            { position: 2, team: "LKS Łużna", matches: 11, points: 26, balance: "57-22" },
            { position: 3, team: "Young Boys Gorlice", matches: 11, points: 25, balance: "46-20" },
            { position: 4, team: "Sokół Staszkówka", matches: 11, points: 20, balance: "39-35" },
            { position: 5, team: "JGS Gorlice", matches: 11, points: 19, balance: "45-22" },
            { position: 6, team: "Rawian Glass", matches: 11, points: 18, balance: "29-23" },
            { position: 7, team: "Silvestria", matches: 11, points: 16, balance: "36-24" },
            { position: 8, team: "Przełęcz Magurska", matches: 11, points: 12, balance: "31-33" },
            { position: 9, team: "Redlions", matches: 11, points: 9, balance: "30-48" },
            { position: 10, team: "LKS Kobylanka", matches: 11, points: 8, balance: "12-35" },
            { position: 11, team: "Grzmotomocni", matches: 11, points: 3, balance: "28-61" },
            { position: 12, team: "Ogień Sękowa", matches: 11, points: 0, balance: "4-82" },
        ],
        "2025/26": [
            { position: 1, team: "Hanmart", matches: 2, points: 6, balance: "8-4" },
            { position: 2, team: "FC Melina", matches: 1, points: 3, balance: "4-1" },
            { position: 3, team: "Mongoły", matches: 2, points: 3, balance: "7-5" },
            { position: 4, team: "Silvestria", matches: 2, points: 3, balance: "6-7" },
            { position: 5, team: "Young Boys Gorlice", matches: 2, points: 3, balance: "4-7" },
            { position: 6, team: "MK Ubezpieczenia Gorlice", matches: 2, points: 0, balance: "5-7" },
            { position: 7, team: "Redlions", matches: 1, points: 0, balance: "1-4" }
        ]
    };

    const seasonMedals = {
        "2018/19": "images/silver-medal-svgrepo-com.svg",
        "2019/20": "images/silver-medal-svgrepo-com.svg",
        "2020/21": "images/sixth-place.svg",
        "2021/22": "images/fourth-place.svg",
        "2022/23": "images/silver-medal-svgrepo-com.svg",
        "2023/24": "images/fourth-place.svg",
        "2024/25": "images/bronze-medal-svgrepo-com.svg",
        "2025/26": "images/pedestal-podium-svgrepo-com.svg",
    };

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

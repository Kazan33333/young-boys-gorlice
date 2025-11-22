document.addEventListener("DOMContentLoaded", function () {
    const resultsData = {
        "2018/19": [
            { date: "25.11.2018", team: "Kwiatonowice - Young Boys Gorlice", score: "2 - 0" },
            { date: "25.11.2018", team: "Haller Gorlice - Young Boys Gorlice", score: "2 - 1" },
            { date: "01.12.2018", team: "Young Boys Gorlice - Stemik Klęczany", score: "0 - 1" },
            { date: "08.12.2018", team: "Podhalanin Biecz - Young Boys Gorlice", score: "5 - 2" },
            { date: "08.12.2018", team: "Young Boys Gorlice - Nafta Kryg", score: "1 - 2" },
            { date: "23.12.2018", team: "Ogień Sękowa - Young Boys Gorlice", score: "1 - 1" },
            { date: "05.01.2019", team: "Young Boys Gorlice - AL-KAM Gorlice", score: "1 - 11" },
            { date: "12.01.2019", team: "Young Boys Gorlice - Kwiatonowice", score: "2 - 2" },
            { date: "12.01.2019", team: "Young Boys Gorlice - Haller Gorlice", score: "3 - 3" },
            { date: "19.01.2019", team: "Stemik Klęczany - Young Boys Gorlice", score: "3 - 5" },
            { date: "26.01.2019", team: "Young Boys Gorlice - Podhalanin Biecz", score: "4 - 2" },
            { date: "26.01.2019", team: "Nafta Kryg - Young Boys Gorlice", score: "1 - 1" },
            { date: "02.02.2019", team: "Young Boys Gorlice - Ogień Sękowa", score: "6 - 2" },
            { date: "09.02.2019", team: "AL-KAM Gorlice - Young Boys Gorlice", score: "1 - 5" }
          ],
        "2019/20": [
            { date: "24.11.2019", team: "Young Boys Gorlice - Eko-Par Wiklowski", score: "1 - 3", scorers: "Kacper Wójtowicz" },
            { date: "24.11.2019", team: "Young Boys Gorlice - LKS Łużna", score: "6 - 3", scorers: "Krzysztof Kazanowski x2, Kacper Szpyrka, Kacper Wójtowicz, Jan Zawiliński, Patryk Góratowski" },
            { date: "30.11.2019", team: "LKS Nafta Kryg - Young Boys Gorlice", score: "0 - 2", scorers: "Kacper Wójtowicz, Sebastian Buś" },
            { date: "08.12.2019", team: "Young Boys Gorlice - Haller Gorlice", score: "4 - 2", scorers: "Jan Zawiliński, Kacper Szpyrka, Kacper Wójtowicz, Sebastian Buś" },
            { date: "22.12.2019", team: "LKS Kwiatonowice - Young Boys Gorlice", score: "1 - 4", scorers: "Piotr Kukuła x2, Kacper Wójtowicz, Krzysztof Kazanowski" },
            { date: "04.01.2020", team: "Abstynenci Gorlice - Young Boys Gorlice", score: "1 - 5", scorers: "Kacper Szpyrka x2, Piotr Kukuła, Jan Zawiliński, Krzysztof Kazanowski" },
            { date: "04.01.2019", team: "Young Boys Gorlice - Stemik Klęczany", score: "4 - 1", scorers: "Patryk Góratowski x2, Szymon Zaworski, Kacper Szpyrka" },
            { date: "18.01.2020", team: "Hanmart Gorlice - Young Boys Gorlice", score: "3 - 3" },
            { date: "26.01.2020", team: "PMOS Biecz - Young Boys Gorlice", score: "1 - 4" },
            { date: "26.01.2020", team: "Young Boys Gorlice - Gór-Bet", score: "4 - 2" },
            { date: "02.02.2020", team: "Young Boys Gorlice - Lodownia Gorlice", score: "7 - 0", scorers: "Sebastian Buś x3, Krzysztof Kazanowski x2, Jan Zawiliński, Kacper Szpyrka" },
            { date: "09.02.2020", team: "Silvestria - Young Boys Gorlice", score: "2 - 4", scorers: "" },
            { date: "15.02.2020", team: "Young Boys Gorlice - LKS Szymbark", score: "1 - 2", scorers: "" },
            { date: "23.02.2020", team: "LKS Zagórzany - Young Boys Gorlice", score: "0 - 5", scorers: "" },
            { date: "01.03.2020", team: "Young Boys Gorlice - Libusza", score: "5 - 0", scorers: "w/o" },
        ],
        "2020/21": [
            { date: "28.11.2020", team: "LKS Łużna - Young Boys Gorlice", score: "6 - 2" },
            { date: "05.12.2020", team: "GÓR BET Konstrukcje Betonowe - Young Boys Gorlice", score: "1 - 5" },
            { date: "13.12.2020", team: "Young Boys Gorlice - BIAŁA Brunary", score: "4 - 2" },
            { date: "13.12.2020", team: "Young Boys Gorlice - TEAM Biecz", score: "8 - 3" },
            { date: "19.12.2020", team: "RANCZO Stróżówka - Young Boys Gorlice", score: "3 - 1" },
            { date: "19.12.2020", team: "EKO-PAR Wiklowski Racławice - Young Boys Gorlice", score: "5 - 1" },
            { date: "27.12.2020", team: "Young Boys Gorlice - HANMART Gorlice", score: "2 - 3" },
            { date: "27.12.2020", team: "COCO JAMBO - Young Boys Gorlice", score: "8 - 1" }
        ],
        "2021/22": [
            { date: "20.11.2021", team: "Olimpijczyk Racławice - Young Boys Gorlice", score: "1 - 2", scorers: "Kacper Wójtowicz x2" },
            { date: "27.11.2021", team: "Haller - Young Boys Gorlice", score: "0 - 4", scorers: "Kacper Wójtowicz x2, Krzysztof Kazanowski, Jakub Wierzba" },
            { date: "27.11.2021", team: "Young Boys Gorlice - Panenka Gorlice", score: "3 - 0", scorers: "Kacper Wójtowicz x2, Krzysztof Kazanowski" },
            { date: "04.12.2021", team: "Gór-Bet - Young Boys Gorlice", score: "1 - 0", scorers: "" },
            { date: "04.12.2021", team: "Silvestria - Young Boys Gorlice", score: "2 - 3", scorers: "Kacper Wójtowicz, Jakub Wierzba, sam." },
            { date: "11.12.2021", team: "LKS Szymbark - Young Boys Gorlice", score: "1 - 2", scorers: "Krzysztof Kazanowski, Kacper Wójtowicz" },
            { date: "09.01.2022", team: "Young Boys Gorlice - Lodownia", score: "2 - 1", scorers: "Krzysztof Kazanowski, Kacper Wójtowicz" },
            { date: "15.01.2022", team: "Young Boys Gorlice - LKS Bystra", score: "2 - 0", scorers: "Kacper Szpyrka, sam." },
            { date: "15.01.2022", team: "LKS Łużna - Young Boys Gorlice", score: "1 - 1", scorers: "Kacper Wójtowicz" },
            { date: "23.01.2022", team: "Rawian Glass - Young Boys Gorlice", score: "2 - 3", scorers: "Kacper Wójtowicz x2, Piotr Rokosz" },
            { date: "23.01.2022", team: "Young Boys Gorlice - Uganda Ravesen", score: "3 - 6", scorers: "Kacper Wójtowicz 2, Filip Kucharkowski" },
            { date: "05.02.2022", team: "Hanmart Gorlice- Young Boys Gorlice", score: "2 - 1", scorers: "Piotr Rokosz" },
            { date: "12.02.2022", team: "Young Boys Gorlice - Wysowa Zdrój", score: "1 - 3", scorers: "Jakub Wierzba" },
            { date: "20.02.2022", team: "Rawian Glass - Young Boys Gorlice", score: "1 - 3", scorers: "Krzysztof Kazanowski x2, Jakub Wierzba" },
            { date: "20.02.2022", team: "Young Boys Gorlice - Silvestria", score: "1 - 2", scorers: "Filip Kucharkowski" },
            { date: "27.02.2022", team: "Young Boys Gorlice - Olimpijczyk Racławice", score: "8 - 0", scorers: "Kacper Szpyrka 4, Kacper Wójtowicz 3, Bartłomiej Knych" },
            { date: "27.02.2022", team: "Wysowa-Zdrój - Young Boys Gorlice", score: "0 - 5", scorers: "w/o" },
            { date: "05.03.2022", team: "Young Boys Gorlice - Hanmart Gorlice", score: "1 - 4", scorers: "Kacper Wójtowicz" },
            { date: "05.03.2022", team: "Uganda Ravesen - Young Boys Gorlice", score: "8 - 1", scorers: "Kacper Wójtowicz" },
        ],
        "2022/23": [
            { date: "26.11.2022", team: "FC Czysta - Young Boys Gorlice", score: "1 - 5", scorers: "Kacper Wójtowicz x2, Krzysztof Kazanowski, Bartłomiej Knych, Tomasz Kotowicz" },
            { date: "26.11.2022", team: "Wojnarowa - Young Boys Gorlice", score: "1 - 7", scorers: "Kacper Wójtowicz x3, Krzysztof Kazanowski, Kacper Szpyrka, Bartłomiej Knych, Tomasz Kotowicz" },
            { date: "04.12.2022", team: "Silvestria - Young Boys Gorlice", score: "1 - 1", scorers: "Kacper Wójtowicz" },
            { date: "04.12.2022", team: "Gór-Bet - Young Boys Gorlice", score: "1 - 3", scorers: "Kacper Wójtowicz, Kacper Szpyrka, Piotr Rokosz" },
            { date: "11.12.2022", team: "Young Boys Gorlice - Smakołysze", score: "3 - 6", scorers: "Kacper Wójtowicz, Kacper Szpyrka, Tomasz Kotowicz" },
            { date: "11.12.2022", team: "Young Boys Gorlice - Hanmart Gorlice", score: "3 - 7", scorers: "Kacper Wójtowicz, Kacper Szpyrka, Piotr Rokosz" },
            { date: "07.01.2023", team: "Glinik Junior - Young Boys Gorlice", score: "4 - 0", scorers: "" },
            { date: "14.01.2023", team: "Young Boys Gorlice - LKS Łużna", score: "2 - 1", scorers: "" },
            { date: "05.02.2023", team: "Young Boys Gorlice - Silvestria", score: "4 - 1", scorers: "Krzysztof Kazanowski, Kacper Wójtowicz, Kacper Szpyrka, Kamil Brzozowski" },
            { date: "05.02.2023", team: "Young Boys Gorlice - Gór-Bet", score: "7 - 2", scorers: "Piotr Kukuła x4, Krzysztof Kazanowski, Kacper Wójtowicz, Dominik Czyżyk" },
            { date: "05.02.2023", team: "Young Boys Gorlice - FC Czysta", score: "11 - 2", scorers: "Kacper Wójtowicz x3, Kacper Szpyrka x3, Bartłomiej Knych x2, Piotr Kukuła x2, Piotr Rokosz" },
            { date: "12.02.2023", team: "Smakołysze - Young Boys Gorlice", score: "0 - 5", scorers: "w/o" },
            { date: "19.02.2023", team: "Young Boys Gorlice - Glinik Junior", score: "6 - 1", scorers: "Kacper Wójtowicz x3, Kacper Szpyrka, Bartłomiej Knych, Krzysztof Kazanowski" },
            { date: "26.02.2023", team: "Hanmart Gorlice - Young Boys Gorlice", score: "6 - 4", scorers: "" },
            { date: "26.02.2023", team: "LKS Łużna - Young Boys Gorlice", score: "5 - 4", scorers: "" },
        ],
        "2023/24": [
            { date: "25.11.2023", team: "Young Boys Gorlice - Silvestria", score: "7 - 0", scorers: "Kacper Wójtowicz x4, Filip Kucharkowski x2, Tomasz Mituś" },
            { date: "25.11.2023", team: "Young Boys Gorlice - Ogień Sękowa", score: "6 - 0", scorers: "Kacper Wójtowicz x2, Tomasz Mituś x2, Filip Kucharkowski, Hubert Czech" },
            { date: "02.12.2023", team: "Beskid Autokomis - Young Boys Gorlice", score: "0 - 3", scorers: "Krzysztof Kazanowski, Filip Kucharkowski, Tomasz Mituś" },
            { date: "02.12.2023", team: "Young Boys Gorlice - Wysowa-Zdrój", score: "3 - 5", scorers: "Tomasz Mituś x2, Kacper Wójtowicz" },
            { date: "23.12.2023", team: "Hanmart Gorlice - Young Boys Gorlice", score: "7 - 2", scorers: "Kacper Wójtowicz, Tomasz Mituś" },
            { date: "23.12.2023", team: "Grzmotomocni - Young Boys Gorlice", score: "3 - 1", scorers: "Kacper Wójtowicz" },
            { date: "23.12.2023", team: "LKS Łużna - Young Boys Gorlice", score: "11 - 0", scorers: "" },
            { date: "07.01.2024", team: "GKS Glinik Junior - Young Boys Gorlice", score: "3 - 2", scorers: "Kacper Szpyrka x2" },
            { date: "13.01.2024", team: "Ogień Sękowa - Young Boys Gorlice", score: "3 - 5", scorers: "Krzysztof Kazanowski x2, Tomasz Mituś x2, Piotr Kukuła" },
            { date: "13.01.2024", team: "Young Boys Gorlice - Hanmart Gorlice", score: "4 - 12", scorers: "Tomasz Mituś x3, Filip Kucharkowski" },
            { date: "21.01.2024", team: "Silvestria - Young Boys Gorlice", score: "4 - 3", scorers: "Jakub Paszyński x2, Tomasz Abram" },
            { date: "21.01.2024", team: "Young Boys Gorlice - Beskid Autokomis", score: "4 - 2", scorers: "Krzysztof Kazanowski x3, Tomasz Abram" },
            { date: "03.02.2024", team: "Young Boys Gorlice - Grzmotomocni", score: "5 - 0", scorers: "w/o" },
            { date: "03.02.2024", team: "Young Boys Gorlice - Glinik Junior", score: "1 - 11", scorers: "Jakub Paszyński" },
            { date: "03.02.2024", team: "Wysowa - Young Boys Gorlice", score: "6 - 3", scorers: "Filip Kucharkowski x2, Michał Nowak" },
            { date: "11.02.2024", team: "Young Boys Gorlice - LKS Łużna", score: "5 - 0", scorers: "w/o" }
        ],
        "2024/25": [
            { date: "24.11.2024", team: "LKS Kobylanka - Young Boys Gorlice", score: "1 - 1", scorers: "Krzysztof Kazanowski" },
            { date: "24.11.2024", team: "Young Boys Gorlice - Rawian Glass", score: "4 - 1", scorers: "Krzysztof Kazanowski, Filip Kucharkowski, Przemysław Piecuch, Tomasz Abram" },
            { date: "01.12.2024", team: "Grzmotomocni - Young Boys Gorlice", score: "0 - 2", scorers: "Filip Kucharkowski, Kacper Wójtowicz" },
            { date: "01.12.2024", team: "Young Boys Gorlice - Redlions", score: "7 - 1", scorers: "Krzysztof Kazanowski x3, Kacper Wójtowicz x2, Przemysław Piecuch" },
            { date: "08.12.2024", team: "Sokół Staszkówka - Young Boys Gorlice", score: "2 - 9", scorers: "Krzysztof Kazanowski x4, Kacper Szpyrka x2, Michał Nowak x2, Tomasz Abram" },
            { date: "08.12.2024", team: "Young Boys Gorlice - Ogień Sękowa", score: "9 - 2", scorers: "Michał Nowak x3, Mateusz Węgrzyn x2, Krzysztof Kazanowski x2, Kacper Szpyrka, Tomasz Abram" },
            { date: "22.12.2024", team: "Young Boys Gorlice - Przęłęcz Magurska", score: "4 - 2", scorers: "Kacper Wójtowicz x3, Mateusz Węgrzyn" },
            { date: "29.12.2024", team: "JGS Gorlice - Young Boys Gorlice", score: "0 - 2", scorers: "Mateusz Węgrzyn, Przemysław Piecuch" },
            { date: "29.12.2024", team: "Young Boys Gorlice - Hanmart Gorlice", score: "2 - 5", scorers: "Kacper Wójtowicz, Przemysław Piecuch" },
            { date: "05.01.2025", team: "Silvestria - Young Boys Gorlice", score: "2 - 4", scorers: "Krzysztof Kazanowski, Filip Kucharkowski, Kacper Wójtowicz, Bartłomiej Knych" },
            { date: "05.01.2024", team: "Young Boys Gorlice - LKS Łużna", score: "2 - 4", scorers: "Kacper Wójtowicz, Kacper Szpyrka" },
        ]
    };

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
                            <td style="color: ${scoreColor};">${match.score}</td>
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

    const defaultSeason = "2024/25";
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

    loadStandings("2024/25");
    updateMedal("2024/25");
    updatePdfLink("2024/25");
});

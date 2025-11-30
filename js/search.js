import { resultsData } from "./resultsData.js";
import { tournamentResultsData } from "./tournamentsData.js";

function searchMatches(teamName) {
    const search = teamName.toLowerCase();
    const matches = [];

    Object.entries(resultsData).forEach(([season, games]) => {
        games.forEach(g => {
            if (g.team.toLowerCase().includes(search)) {
                matches.push({
                    date: g.date,
                    match: g.team,
                    score: g.score,
                    source: season
                });
            }
        });
    });

    Object.entries(tournamentResultsData).forEach(([tournament, games]) => {
        games.forEach(g => {
            if (g.team.toLowerCase().includes(search)) {
                matches.push({
                    date: g.date,
                    match: g.team,
                    score: g.score,
                    source: tournament
                });
            }
        });
    });

    return matches;
}

function showSearchModal(teamName) {
    const results = searchMatches(teamName);
    const tbody = document.getElementById("searchResultsBody");

    document.getElementById("searchedTeamName").textContent = teamName;
    tbody.innerHTML = "";

    if (results.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-secondary">
                    Brak meczów z tą drużyną
                </td>
            </tr>`;
    } else {
        results.forEach(r => {
            const highlightedTeam = r.match.replace("Young Boys Gorlice", "<span style='color: gold;'>Young Boys Gorlice</span>");
            const scores = r.score.split(" - ").map(Number);
            const teams = r.match.split(" - ");
            const ourTeamIndex = teams.indexOf("Young Boys Gorlice");
            let scoreColor = "inherit";

            if (ourTeamIndex !== -1) {
                const ourScore = scores[ourTeamIndex];
                const opponentScore = scores[1 - ourTeamIndex];
                
                if (ourScore > opponentScore) {
                    scoreColor = "chartreuse";
                } else if (ourScore < opponentScore) {
                    scoreColor = "red";
                }
            }

            tbody.innerHTML += `
                <tr>
                    <td>${r.date}</td>
                    <td>${highlightedTeam}</td>
                    <td style="color: ${scoreColor};">${r.score}</td>
                </tr>`;
        });
    }

    const modal = new bootstrap.Modal(document.getElementById("searchResultsModal"));
    modal.show();
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("searchInput");

    if (input) {
        input.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                const query = e.target.value.trim();
                if (query.length > 1) {
                    showSearchModal(query);
                }
            }
        });
    }
});

export { searchMatches, showSearchModal };

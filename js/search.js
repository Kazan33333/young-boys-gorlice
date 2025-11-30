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
        return;
    }

    results.forEach(r => {
        const highlightedTeam = r.match.replace(
            "Young Boys Gorlice",
            "<span style='color: gold;'>Young Boys Gorlice</span>"
        );

        const scores = r.score.split(" - ").map(Number);
        const teams = r.match.split(" - ");

        const ourTeamIndex = teams.indexOf("Young Boys Gorlice");
        let scoreColor = "inherit";

        if (ourTeamIndex !== -1) {
            const our = scores[ourTeamIndex];
            const opp = scores[1 - ourTeamIndex];

            if (our > opp) scoreColor = "chartreuse";
            else if (our < opp) scoreColor = "red";
        }

        tbody.innerHTML += `
            <tr>
                <td>${r.date}</td>
                <td>${highlightedTeam}</td>
                <td style="color: ${scoreColor};">${r.score}</td>
            </tr>`;
    });

    const modal = new bootstrap.Modal(document.getElementById("searchResultsModal"));
    modal.show();
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("searchInput");
    const searchIcon = document.querySelector(".search-icon");
    const searchBox = input ? input.parentElement : null;
    
    const suggestionBox = document.createElement("div");
    suggestionBox.className = "search-suggestions bg-dark text-light";
    suggestionBox.style.position = "absolute";
    suggestionBox.style.display = "none";
    suggestionBox.style.zIndex = "999";
    suggestionBox.style.maxHeight = "200px";
    suggestionBox.style.overflowY = "auto";
    suggestionBox.style.borderRadius = "0 0 4px 4px";
    suggestionBox.style.border = "1px solid #1C1F23";
    suggestionBox.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";

    input.parentElement.style.position = "relative";
    input.parentElement.appendChild(suggestionBox);

    function updateSuggestionBoxPosition() {
        const rect = input.getBoundingClientRect();
        const parentRect = input.parentElement.getBoundingClientRect();

        suggestionBox.style.width = rect.width + "px";
        suggestionBox.style.left = (rect.left - parentRect.left) + "px";
        suggestionBox.style.top = input.offsetHeight + "px";
    }

    input.parentElement.appendChild(suggestionBox);

    let currentFocus = -1;

    function getAllTeams() {
        const set = new Set();

        const addTeamsFrom = (text) => {
            const parts = text.split(" - ").map(t => t.trim());
            parts.forEach(team => {
                if (team !== "Young Boys Gorlice") set.add(team);
            });
        };

        Object.values(resultsData).forEach(games =>
            games.forEach(g => addTeamsFrom(g.team))
        );

        Object.values(tournamentResultsData).forEach(games =>
            games.forEach(g => addTeamsFrom(g.team))
        );

        return [...set];
    }

    const allTeams = getAllTeams();

    function updateSuggestions(query) {
        suggestionBox.innerHTML = "";

        if (!query) {
            suggestionBox.style.display = "none";
            return;
        }

        const filtered = allTeams.filter(t =>
            t.toLowerCase().includes(query.toLowerCase())
        );

        filtered.forEach(team => {
            const item = document.createElement("div");
            item.textContent = team;
            item.style.padding = "6px 10px";
            item.style.cursor = "pointer";

            item.addEventListener("click", () => {
                showSearchModal(team);
                input.value = "";
                suggestionBox.style.display = "none";
            });

            item.addEventListener("mouseover", () => {
                [...suggestionBox.children].forEach(n => n.style.background = "");
                item.style.background = "#333";
            });

            suggestionBox.appendChild(item);
        });

        suggestionBox.style.display = filtered.length > 0 ? "block" : "none";
        currentFocus = -1;
        updateSuggestionBoxPosition();
    }

    function performSearch() {
        const query = input.value.trim();
        if (query.length > 1) {
            showSearchModal(query);
            input.value = "";
            suggestionBox.style.display = "none";
            searchBox.classList.remove("expanded");
        }
    }

    if (searchIcon) {
        searchIcon.addEventListener("click", (e) => {
            e.preventDefault();
            input.focus();
            performSearch();
        });
    }

    input.addEventListener("keyup", (e) => {
        const query = input.value.trim();
        const items = suggestionBox.querySelectorAll("div");

        if (e.key === "ArrowDown") {
            currentFocus++;
            if (currentFocus >= items.length) currentFocus = 0;
            items.forEach(el => el.style.background = "");
            items[currentFocus].style.background = "#333";
        }

        else if (e.key === "ArrowUp") {
            currentFocus--;
            if (currentFocus < 0) currentFocus = items.length - 1;
            items.forEach(el => el.style.background = "");
            items[currentFocus].style.background = "#333";
        }

        else if (e.key === "Enter") {
            e.preventDefault();
            if (currentFocus > -1 && items[currentFocus]) {
                items[currentFocus].click();
            } else {
                performSearch();
            }
        }

        else {
            updateSuggestions(query);
        }
    });

    input.addEventListener("blur", () => {
        setTimeout(() => {
            if (input.value.trim() === "") {
                suggestionBox.style.display = "none";
                searchBox.classList.remove("expanded");
            }
        }, 150);
    });

    input.addEventListener("input", () => {
        updateSuggestionBoxPosition();
        if (input.value.trim() !== "") {
            searchBox.classList.add("expanded");
            if (suggestionBox.children.length > 0) suggestionBox.style.display = "block";
        } else {
            searchBox.classList.remove("expanded");
            suggestionBox.style.display = "none";
        }
    });

    input.addEventListener("focus", () => {
        updateSuggestionBoxPosition();
    });

    if (searchIcon) {
        searchIcon.addEventListener("click", performSearch);
    }

document.addEventListener("keydown", (e) => {
    // Jeśli jesteśmy w polu input lub textarea, / nie robi nic
    if (e.key === "/" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchBox.classList.add("expanded");
        input.focus();
    }

    if (e.key === "Escape") {
        suggestionBox.style.display = "none";

        if (input.value.trim().length > 0) {
            input.blur();
        } else {
            input.blur();
            searchBox.classList.remove("expanded");
        }
    }
});


});

export { searchMatches, showSearchModal };

import { resultsData } from "./resultsData.js";
import { tournamentResultsData } from "./tournamentsData.js";

let chartInstance = null;

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

function generateChart(localTeamName, localResults) {
    let wins = 0, draws = 0, losses = 0;

    localResults.forEach(r => {
        const parts = r.match.split(" - ").map(s => s.trim());
        const scores = (r.score || "").split(" - ").map(s => Number(s.trim()));

        if (parts.length < 2 || scores.length < 2 || Number.isNaN(scores[0]) || Number.isNaN(scores[1])) {
            return;
        }

        const [teamA, teamB] = parts;
        const [scoreA, scoreB] = scores;

        const isYBG_A = (teamA === "Young Boys Gorlice");
        const our = isYBG_A ? scoreA : scoreB;
        const opp = isYBG_A ? scoreB : scoreA;

        if (our > opp) wins++;
        else if (our < opp) losses++;
        else draws++;
    });

    const ctx = document.getElementById("resultsChart");
    if (!ctx) {
        console.warn("Brak elementu #resultsChart — wykres pominięty");
        return;
    }

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Wygrane", "Remisy", "Porażki"],
            datasets: [{
                data: [wins, draws, losses],
                backgroundColor: [
                    "rgba(0,255,0,0.8)",
                    "rgba(255,215,0,0.8)",
                    "rgba(255,0,0,0.8)"
                ],
                borderColor: [
                    "rgba(0,190,0,1)",
                    "rgba(190,160,0,1)",
                    "rgba(190,0,0,1)"
                ],
                borderWidth: 3
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: { color: "white" }
                }
            },
            maintainAspectRatio: false,
            animation: { duration: 0 }
        }
    });
}

function showSearchModal(teamName, results) {
    if (!results) {
        results = searchMatches(teamName);
    }

    const modalElement = document.getElementById("searchResultsModal");
    if (!modalElement) {
        console.error("Brak elementu #searchResultsModal w DOM");
        return;
    }
    const modal = new bootstrap.Modal(modalElement);

    const tableBody = document.getElementById("searchResultsBody");
    const chartContainer = document.getElementById("chartContainer");
    const toggleBtn = document.getElementById("toggleChartBtn");
    const modalTitle = document.getElementById("searchResultsLabel");

    if (!tableBody || !modalTitle) {
        console.error("Brak wymaganych elementów modala (searchResultsBody lub searchResultsLabel)");
        return;
    }

    modalTitle.textContent = `${teamName}`;
    tableBody.innerHTML = "";

    if (!results || results.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-secondary">
                    Brak meczów z tą drużyną
                </td>
            </tr>`;
        if (chartContainer) chartContainer.style.display = "none";
        if (tableBody.parentElement) tableBody.parentElement.style.display = "table";
        if (toggleBtn) toggleBtn.textContent = "Pokaż wykres";

        modal.show();
        return;
    }

    results.forEach((r) => {
        const highlighted = r.match.replace(/(Young Boys Gorlice)/g, '<span style="color: gold;">$1</span>');

        let scoreHtml = r.score ?? "";
        let scoreColor = "inherit";
        try {
            const scores = (r.score || "").split(" - ").map(s => Number(s.trim()));
            const teams = r.match.split(" - ").map(t => t.trim());
            const ourIndex = teams.indexOf("Young Boys Gorlice");
            if (!Number.isNaN(scores[0]) && !Number.isNaN(scores[1]) && ourIndex !== -1) {
                const our = scores[ourIndex];
                const opp = scores[1 - ourIndex];
                if (our > opp) scoreColor = "chartreuse";
                else if (our < opp) scoreColor = "red";
            }
        } catch (err) {
            scoreColor = "inherit";
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${r.date ?? ""}</td>
            <td>${highlighted}</td>
            <td style="color: ${scoreColor};">${scoreHtml}</td>
        `;
        tableBody.appendChild(row);
    });

    modal.show();

    if (chartContainer) chartContainer.style.display = "none";
    if (tableBody.parentElement) tableBody.parentElement.style.display = "table";
    if (toggleBtn) toggleBtn.textContent = "Pokaż wykres";

    if (toggleBtn) {
        toggleBtn.onclick = () => {
            const isChartHidden = chartContainer && chartContainer.style.display === "none";
            if (isChartHidden) {
                generateChart(teamName, results);
                chartContainer.style.display = "block";
                if (tableBody.parentElement) tableBody.parentElement.style.display = "none";
                toggleBtn.textContent = "Pokaż tabelę";
            } else {
                if (chartContainer) chartContainer.style.display = "none";
                if (tableBody.parentElement) tableBody.parentElement.style.display = "table";
                toggleBtn.textContent = "Pokaż wykres";
            }
        };
    }
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

    const searchElement = document.querySelector('[data-i18n="search"]');
    const searchMenuLink = searchElement ? searchElement.closest("a") : null;
    const navbarToggler = document.querySelector(".navbar-toggler");

    if (searchMenuLink) {
        searchMenuLink.addEventListener("click", (e) => {
            e.preventDefault();

            const isMobile = window.innerWidth < 992;

            if (isMobile && navbarToggler) {
                navbarToggler.click();

                const navbarCollapse = document.getElementById("navbarNav");
                navbarCollapse.addEventListener("shown.bs.collapse", () => {
                    searchBox.classList.add("expanded");
                    input.focus();
                    if (typeof showSuggestionsOnFocus === "function") showSuggestionsOnFocus();
                }, { once: true });
            } else {
                searchBox.classList.add("expanded");
                input.focus();
                if (typeof showSuggestionsOnFocus === "function") showSuggestionsOnFocus();
            }
        });
    }

    (function preloadChartJS() {
        const dummyCanvas = document.createElement("canvas");
        dummyCanvas.style.display = "none";
        document.body.appendChild(dummyCanvas);

        try {
            const ctx = dummyCanvas.getContext("2d");

            let preloadChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: ["A", "B"],
                    datasets: [{
                        data: [1, 1]
                    }]
                }
            });

            preloadChart.destroy();
        } catch (err) {
            console.warn("Preload Chart.js failed:", err);
        }

        dummyCanvas.remove();
    })();


    function showSuggestionsOnFocus() {
        const query = input.value.trim();
        if (query === "") {
            suggestionBox.innerHTML = "";
            allTeams.forEach(team => {
                const item = document.createElement("div");
                item.textContent = team;
                item.style.padding = "6px 10px";
                item.style.cursor = "pointer";

                const selectTeam = (e) => {
                    e.preventDefault();
                    showSearchModal(team);
                    input.value = "";
                    suggestionBox.style.display = "none";
                };

                let isDragging = false;
                let startY = 0;

                item.addEventListener("touchstart", (e) => {
                    isDragging = false;
                    startY = e.touches[0].clientY;
                }, { passive: true });

                item.addEventListener("touchmove", (e) => {
                    const diff = Math.abs(e.touches[0].clientY - startY);
                    if (diff > 10) {
                        isDragging = true;
                    }
                }, { passive: true });

                item.addEventListener("pointerdown", (e) => {
                    if (isDragging) return;
                    selectTeam(e);
                });

                item.addEventListener("click", (e) => {
                    if (!isDragging) selectTeam(e);
                });

                item.addEventListener("mouseover", () => {
                    [...suggestionBox.children].forEach(n => n.style.background = "");
                    item.style.background = "#52575C";
                });

                suggestionBox.appendChild(item);
            });
            suggestionBox.style.display = "block";
            currentFocus = -1;
            updateSuggestionBoxPosition();
        } else {
            updateSuggestions(query);
        }
    }

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
                item.style.background = "#52575C";
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
            items[currentFocus].style.background = "#52575C";
        }

        else if (e.key === "ArrowUp") {
            currentFocus--;
            if (currentFocus < 0) currentFocus = items.length - 1;
            items.forEach(el => el.style.background = "");
            items[currentFocus].style.background = "#52575C";
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

    document.addEventListener("click", (e) => {
        if (!searchBox.contains(e.target)) {
            if (input.value.trim() !== "") {
                suggestionBox.style.display = "none";
            } else {
                searchBox.classList.remove("expanded");
                suggestionBox.style.display = "none";
            }
        }
    });

    searchBox.addEventListener("click", () => {
        if (input.value.trim() !== "") {
            suggestionBox.style.display = suggestionBox.children.length > 0 ? "block" : "none";
        }
        searchBox.classList.add("expanded");
        input.focus();
        showSuggestionsOnFocus();
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
        setTimeout(() => {
            showSuggestionsOnFocus();
        }, 400);
    });

    if (searchIcon) {
        searchIcon.addEventListener("click", performSearch);
    }

document.addEventListener("keydown", (e) => {
    if (e.key === "/" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchBox.classList.add("expanded");
        setTimeout(() => {
            input.focus();
            showSuggestionsOnFocus();
        }, 400);
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

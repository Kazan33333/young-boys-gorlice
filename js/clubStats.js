import { resultsData } from "./resultsData.js";
import { tournamentResultsData } from "./tournamentsData.js";
import { leagueFixturesData } from "./leagueFixturesData.js";
import { getTeamScorers } from "./scorerUtils.js";

document.addEventListener("DOMContentLoaded", () => {
    renderClubStats();
});

const CLUB_NAME = "Young Boys Gorlice";

function renderClubStats() {
    renderSummaryCards();
    renderResultsChart();
    renderTopScorersTable();
    renderAchievementsCard();
}

function getMatchTeams(team) {
    if (!team) return [];

    return team.split(/\s+-\s+/).map(name => name.trim());
}

function getClubIndex(match) {
    if (!match || !match.team) return -1;

    return getMatchTeams(match.team).findIndex(
        team => team === CLUB_NAME
    );
}

function isYBGHome(match) {
    return getClubIndex(match) === 0;
}

function getClubScorers(match, sourceType = "legacy") {
    if (!match || !match.scorers) return "";

    if (sourceType === "league") {
        return getTeamScorers(match, CLUB_NAME);
    }

    const teams = getMatchTeams(match.team);
    const clubIndex = getClubIndex(match);

    if (clubIndex === -1) return "";

    const scorerSides = match.scorers.split(/\s+-\s+/);

    if (teams.length === 2 && scorerSides.length === 2) {
        return scorerSides[clubIndex].trim();
    }

    return match.scorers.trim();
}

function getClubMatches() {
    const allMatches = [];

    Object.entries(resultsData).forEach(([season, games]) => {

        if (
            Number(season.split("/")[0]) >= 2026 &&
            leagueFixturesData[season]
        ) {
            return;
        }

        games.forEach(match => {

            if (getClubIndex(match) === -1) return;

            allMatches.push({
                ...match,
                clubScorers: getClubScorers(match),
                source: season
            });
        });
    });

    // Nowe sezony z leagueFixturesData.
    Object.entries(leagueFixturesData).forEach(([season, games]) => {

        if (Number(season.split("/")[0]) < 2026) return;

        games.forEach(match => {

            if (getClubIndex(match) === -1) return;

            allMatches.push({
                ...match,
                clubScorers: getClubScorers(match, "league"),
                source: season
            });
        });
    });

    // Wyniki turniejów.
    Object.entries(tournamentResultsData).forEach(([tournament, games]) => {

        games.forEach(match => {

            if (getClubIndex(match) === -1) return;

            allMatches.push({
                ...match,
                clubScorers: getClubScorers(match),
                source: tournament
            });
        });
    });

    return allMatches;
}

function parseScore(score) {
    if (!score) return null;

    const match = score.match(
        /^\s*(\d+)\s*[-–—:]\s*(\d+)\s*$/
    );

    if (!match) return null;

    return {
        a: Number(match[1]),
        b: Number(match[2])
    };
}

function calculateGlobalStats() {
    const stats = {
        matches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        maxGoalsInMatch: 0,
        seasonsCount: 0
    };

    const allMatches = getClubMatches();

    const seasons = new Set(Object.keys(resultsData));

    Object.keys(leagueFixturesData).forEach(season => {
        if (Number(season.split("/")[0]) >= 2026) {
            seasons.add(season);
        }
    });

    stats.seasonsCount = seasons.size;

    allMatches.forEach(match => {
        const parsed = parseScore(match.score);

        if (!parsed) return;

        const clubIndex = getClubIndex(match);

        if (clubIndex === -1) return;

        stats.matches++;

        const home = clubIndex === 0;

        const gf = home ? parsed.a : parsed.b;
        const ga = home ? parsed.b : parsed.a;

        stats.goalsFor += gf;
        stats.goalsAgainst += ga;

        if (gf > ga) {
            stats.wins++;
        } else if (gf === ga) {
            stats.draws++;
        } else {
            stats.losses++;
        }

        if (gf > stats.maxGoalsInMatch) {
            stats.maxGoalsInMatch = gf;
        }
    });

    return stats;
}

function renderSummaryCards() {
    const container = document.getElementById("clubStatsCards");

    if (!container) return;

    const s = calculateGlobalStats();

    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${s.matches}</div>
            <div class="stat-label" data-i18n="matches"></div>
        </div>

        <div class="stat-card">
            <div class="stat-value">${s.wins}</div>
            <div class="stat-label" data-i18n="wins"></div>
        </div>

        <div class="stat-card">
            <div class="stat-value">${s.draws}</div>
            <div class="stat-label" data-i18n="draws"></div>
        </div>

        <div class="stat-card">
            <div class="stat-value">${s.losses}</div>
            <div class="stat-label" data-i18n="losses"></div>
        </div>

        <div class="stat-card">
            <div class="stat-value">${s.goalsFor}</div>
            <div class="stat-label" data-i18n="goalsScored"></div>
        </div>

        <div class="stat-card">
            <div class="stat-value">${s.goalsAgainst}</div>
            <div class="stat-label" data-i18n="goalsConceded"></div>
        </div>
    `;

    changeLanguage(currentLang);
}

let clubStatsChartInstance = null;

function renderResultsChart() {
    const s = calculateGlobalStats();

    const ctx = document.getElementById("clubStatsChart");

    if (!ctx) return;

    const labels = [
        translations[currentLang]["wins"],
        translations[currentLang]["draws"],
        translations[currentLang]["losses"]
    ];

    const data = [
        s.wins,
        s.draws,
        s.losses
    ];

    if (clubStatsChartInstance) {
        clubStatsChartInstance.data.labels = labels;
        clubStatsChartInstance.data.datasets[0].data = data;

        clubStatsChartInstance.update();
    } else {
        clubStatsChartInstance = new Chart(ctx, {
            type: "pie",

            data: {
                labels: labels,

                datasets: [{
                    data: data,

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
                responsive: true,

                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const data = context.dataset.data;

                                const total = data.reduce(
                                    (a, b) => a + b,
                                    0
                                );

                                const value = context.raw;

                                const percent = total
                                    ? ((value / total) * 100).toFixed(1)
                                    : 0;

                                return `${context.label}: ${value} (${percent}%)`;
                            }
                        }
                    },

                    legend: {
                        labels: {
                            color: "#fff"
                        }
                    }
                }
            }
        });
    }
}

function renderAchievementsCard() {
    const container = document.getElementById("achievementsCard");

    if (!container) return;

    container.innerHTML = `
        <div class="row g-3">

            <div class="col-6 col-md-4">
                <div class="achievement-tile text-center p-3 h-100">
                    <img src="images/gold-medal-static.svg" class="achievement-icon mb-2" alt="">
                    <div class="fw-bold">OSiR Turniej Futsal - Gorlice 2026</div>
                    <div class="small text-muted" data-i18n="achievement.league"></div>
                    <div class="mt-1" data-i18n="achievement.bronze"></div>
                </div>
            </div>

            <div class="col-6 col-md-4">
                <div class="achievement-tile text-center p-3 h-100">
                    <img src="images/silver-medal-static.svg" class="achievement-icon mb-2" alt="">
                    <div class="fw-bold">OSiR Liga Futsal - sezon 2019/20</div>
                    <div class="small text-muted" data-i18n="achievement.league"></div>
                    <div class="mt-1" data-i18n="achievement.silver"></div>
                </div>
            </div>

            <div class="col-6 col-md-4">
                <div class="achievement-tile text-center p-3 h-100">
                    <img src="images/silver-medal-static.svg" class="achievement-icon mb-2" alt="">
                    <div class="fw-bold">OSiR Liga Futsal - sezon 2022/23</div>
                    <div class="small text-muted" data-i18n="achievement.league"></div>
                    <div class="mt-1" data-i18n="achievement.silver"></div>
                </div>
            </div>

            <div class="col-6 col-md-4">
                <div class="achievement-tile text-center p-3 h-100">
                    <img src="images/bronze-medal-static.svg" class="achievement-icon mb-2" alt="">
                    <div class="fw-bold">OSiR Liga Futsal - sezon 2025/26</div>
                    <div class="small text-muted" data-i18n="achievement.league"></div>
                    <div class="mt-1" data-i18n="achievement.bronze"></div>
                </div>
            </div>

            <div class="col-6 col-md-4">
                <div class="achievement-tile text-center p-3 h-100">
                    <img src="images/bronze-medal-static.svg" class="achievement-icon mb-2" alt="">
                    <div class="fw-bold">OSiR Liga Futsal - sezon 2024/25</div>
                    <div class="small text-muted" data-i18n="achievement.league"></div>
                    <div class="mt-1" data-i18n="achievement.bronze"></div>
                </div>
            </div>

            <div class="col-6 col-md-4">
                <div class="achievement-tile text-center p-3 h-100">
                    <img src="images/bronze-medal-static.svg" class="achievement-icon mb-2" alt="">
                    <div class="fw-bold">OSiR Turniej Małego Pola - Gorlice 2021</div>
                    <div class="small text-muted" data-i18n="achievement.tournament"></div>
                    <div class="mt-1" data-i18n="achievement.bronze"></div>
                </div>
            </div>

        </div>
    `;

    changeLanguage(currentLang);
}

function renderTopScorersTable() {
    const tbody = document.getElementById("clubStatsTableBody");

    if (!tbody) return;

    const allMatches = getClubMatches();

    const scorersMap = {};

    allMatches.forEach(match => {
        if (!match.clubScorers) return;

        const scorersList = match.clubScorers
            .split(",")
            .map(s => s.trim());

        scorersList.forEach(player => {
            if (!player) return;

            const lowerPlayer = player.toLowerCase();

            if (
                lowerPlayer === "n/a" ||
                lowerPlayer === "o.g." ||
                lowerPlayer === "w/o" ||
                lowerPlayer === "sam." ||
                lowerPlayer.includes("o.g.")
            ) {
                return;
            }

            // Odczytujemy liczbę goli na końcu wpisu.
            const parsed = player.match(/^(.+?)\s+(\d+)$/);

            const name = parsed
                ? parsed[1].trim()
                : player;

            const count = parsed
                ? parseInt(parsed[2], 10)
                : 1;

            if (!name || !count) return;

            scorersMap[name] = (scorersMap[name] || 0) + count;
        });
    });

    const sortedScorers = Object.entries(scorersMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    tbody.innerHTML = sortedScorers.map(([player, goals], index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${player}</td>
            <td>${goals}</td>
        </tr>
    `).join("");
}

window.updateStatsChartLanguage = () => {
    if (clubStatsChartInstance) {
        renderResultsChart();
    }
};
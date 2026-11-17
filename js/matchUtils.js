/** Display helpers shared by the league, results, and tournament pages. */
export const CLUB_NAME = "Young Boys Gorlice";

export function highlightClub(team) {
    return team.replace(CLUB_NAME, `<span style='color: gold;'>${CLUB_NAME}</span>`);
}

export function clubScoreColor(match) {
    const scores = match.score.split(" - ").map(Number);
    const teams = match.team.split(" - ");
    const clubIndex = teams.indexOf(CLUB_NAME);
    if (clubIndex === -1) return "";

    if (scores[clubIndex] > scores[1 - clubIndex]) return "chartreuse";
    if (scores[clubIndex] < scores[1 - clubIndex]) return "red";
    return "";
}

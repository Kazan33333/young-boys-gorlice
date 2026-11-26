import { playerNames } from "./playerNames.js";

export function formatScorerList(scorers) {
    if (!scorers || !scorers.trim()) return "";

    return scorers.split(",").map(scorer => {
        scorer = scorer.trim();

        if (
            scorer === "sam." ||
            scorer === "w/o" ||
            scorer === "n/a"
        ) {
            return scorer;
        }

        const match = scorer.match(/^(.*?)\s*(?:x\s*)?(\d+)?$/i);

        if (!match) return scorer;

        const shortName = match[1].trim();
        const goals = Number(match[2] || 1);

        const fullName = playerNames[shortName] || shortName;

        return goals > 1
            ? `${fullName} ${goals}`
            : fullName;

    }).join(", ");
}

export function formatMatchScorers(scorers) {
    if (!scorers) return "";

    return scorers
        .split(/\s+-\s+/)
        .map(formatScorerList)
        .join(" - ");
}

export function getTeamScorers(match, teamName) {
    if (!match?.scorers || !match?.team) return "";

    const sides = match.scorers.split(/\s+-\s+/);
    const teams = match.team.split(/\s+-\s+/);

    if (teams.length !== 2 || sides.length !== 2) return "";

    const teamIndex = teams.findIndex(
        team => team.trim() === teamName
    );

    if (teamIndex === -1) return "";

    return formatScorerList(sides[teamIndex]);
}
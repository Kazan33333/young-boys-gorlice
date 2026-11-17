/** Render the shared standings columns with the same ordering and team highlight. */
export function renderStandingsRows(tableBody, teams, { emptyMissing = false } = {}) {
    tableBody.innerHTML = "";

    teams.forEach(team => {
        const rowStyle = team.team === "Young Boys Gorlice" ? 'style="color: gold;"' : "";
        const field = key => emptyMissing ? (team[key] || "") : team[key];

        tableBody.insertAdjacentHTML("beforeend", `
            <tr ${rowStyle}>
                <td>${team.position}</td>
                <td>${team.team}</td>
                <td>${field("matches")}</td>
                <td>${field("points")}</td>
                <td>${field("balance")}</td>
            </tr>
        `);
    });
}

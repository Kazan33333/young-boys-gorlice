(() => {

    function initCounters() {

        const todayEl = document.getElementById("gc-today");
        const weekEl = document.getElementById("gc-week");
        const totalEl = document.getElementById("gc-total");

        if (!todayEl || !weekEl || !totalEl) return;

        const base =
            "https://kazan33333.goatcounter.com/counter";

        const counterURL = `${base}/TOTAL.json`;

        function getWarsawDate() {

            const parts = new Intl.DateTimeFormat("en-GB", {
                timeZone: "Europe/Warsaw",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }).formatToParts(new Date());

            const year = parts.find(p => p.type === "year").value;
            const month = parts.find(p => p.type === "month").value;
            const day = parts.find(p => p.type === "day").value;

            return `${year}-${month}-${day}`;
        }


        function addDays(dateString, days) {

            const [year, month, day] =
                dateString.split("-").map(Number);

            const date = new Date(
                Date.UTC(year, month - 1, day + days)
            );

            return [
                date.getUTCFullYear(),
                String(date.getUTCMonth() + 1).padStart(2, "0"),
                String(date.getUTCDate()).padStart(2, "0")
            ].join("-");
        }

        async function loadCount(url, element) {

            element.textContent = "…";

            try {

                const response = await fetch(url, {
                    method: "GET",
                    mode: "cors",
                    credentials: "omit",
                    cache: "no-store"
                });

                if (response.status === 404) {
                    element.textContent = "0";
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();

                element.textContent = data.count ?? "0";

            } catch (error) {

                console.warn("GoatCounter statistics error:", error);
                element.textContent = "-";

            }
        }

        const today = getWarsawDate();
        const tomorrow = addDays(today, 1);

        const [year, month, day] =
            today.split("-").map(Number);

        const weekday = new Date(
            Date.UTC(year, month - 1, day)
        ).getUTCDay();

        const daysSinceMonday = (weekday + 6) % 7;

        const startWeek = addDays(today, -daysSinceMonday);
        const endWeek = addDays(startWeek, 7);

        loadCount(
            `${counterURL}?start=${today}&end=${tomorrow}`,
            todayEl
        );

        loadCount(
            `${counterURL}?start=${startWeek}&end=${endWeek}`,
            weekEl
        );

        loadCount(
            counterURL,
            totalEl
        );

    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initCounters,
            { once: true }
        );

    } else {

        initCounters();

    }

})();

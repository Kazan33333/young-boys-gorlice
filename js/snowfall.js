
(() => {
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) return;

    document.querySelectorAll(".snowfall").forEach((host) => {
        if (host.dataset.snowReady) return;
        host.dataset.snowReady = "true";

        const canvas = document.createElement("canvas");
        canvas.className = "snowfall__canvas";
        canvas.setAttribute("aria-hidden", "true");
        host.appendChild(canvas);

        const ctx = canvas.getContext("2d", {
            alpha: true,
        });

        if (!ctx) {
            canvas.remove();
            return;
        }

        const random = (min, max) =>
            min + Math.random() * (max - min);

        const clamp = (value, min, max) =>
            Math.max(min, Math.min(max, value));

        let width = 0;
        let height = 0;
        let particles = [];

        let wind = 0;
        let targetWind = 0;
        let elapsed = 0;
        let nextGust = 0;

        let running = false;
        let visible = false;
        let raf = 0;
        let lastFrame = 0;
        let resizeRaf = 0;

        const FPS = 30;
        const FRAME_TIME = 1000 / FPS;

        // Ustawienia warstwy śniegu.
        host.style.left = "0px";
        host.style.right = "auto";
        host.style.bottom = "auto";

        // Płynne przejście przy zmianie warstwy.
        host.style.transition = "opacity 300ms ease";
        host.style.opacity = "1";

        let modalLayerActive = false;
        let layerTransitionPending = false;

        // Tworzenie płatka.
        function createParticle(y = random(0, height)) {
            const size = Math.random();

            return {
                x: random(0, width),
                y,

                radius: size < 0.18
                    ? random(3.5, 4.8)
                    : size < 0.5
                        ? random(2.2, 3.3)
                        : random(1.2, 2.0),

                speed: random(38, 52),

                sway: random(1.2, 4),
                frequency: random(0.5, 1.3),
                phase: random(0, Math.PI * 2),

                windFactor: random(0.65, 1.35),

                opacity: size < 0.18
                    ? 1.0
                    : size < 0.5
                        ? 0.8
                        : 0.6
            };
        }

        // Rysowanie wszystkich aktualnych płatków.
        function renderParticles() {
            ctx.clearRect(0, 0, width, height);

            const paths = [[], [], []];

            for (const p of particles) {
                const group = p.opacity > 0.8
                    ? 2
                    : p.opacity > 0.5
                        ? 1
                        : 0;

                paths[group].push(p);
            }

            const opacities = [0.6, 0.8, 1.0];

            for (let i = 0; i < paths.length; i++) {
                ctx.globalAlpha = opacities[i];

                for (const p of paths[i]) {
                    ctx.beginPath();
                    ctx.arc(
                        p.x,
                        p.y,
                        p.radius,
                        0,
                        Math.PI * 2
                    );
                    ctx.fillStyle = "#fff";
                    ctx.fill();
                }
            }

            ctx.globalAlpha = 1;
        }

        // Dopasowanie canvas do wymiarów strony.
        function resize() {
            width = window.innerWidth;

            host.style.width = `${width}px`;

            // Usuwamy poprzednią wysokość przed pomiarem dokumentu.
            host.style.removeProperty("height");

            height = Math.max(
                document.documentElement.scrollHeight,
                document.body ? document.body.scrollHeight : 0,
                document.documentElement.clientHeight,
                window.innerHeight
            );

            host.style.height = `${height}px`;

            const dpr = Math.min(
                window.devicePixelRatio || 1,
                1
            );

            const newWidth = Math.max(1, Math.round(width * dpr));
            const newHeight = Math.max(1, Math.round(height * dpr));

            // Zmiana rozmiaru bitmapy tylko wtedy, gdy jest potrzebna.
            if (
                canvas.width !== newWidth ||
                canvas.height !== newHeight
            ) {
                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }

            // Dopasowanie liczby płatków bez resetowania istniejących.
            const count = clamp(
                Math.round(width * height / 8000),
                70,
                200
            );

            while (particles.length < count) {
                particles.push(createParticle());
            }

            while (particles.length > count) {
                particles.pop();
            }

            // Natychmiastowe odrysowanie po zmianie rozmiaru.
            renderParticles();
        }

        function scheduleResize() {
            if (resizeRaf) return;

            resizeRaf = requestAnimationFrame(() => {
                resizeRaf = 0;
                resize();
            });
        }

        // Ustawienie właściwego z-index dla śniegu.
        function applyModalLayer() {
            if (modalLayerActive) {
                const backdrop = document.querySelector(
                    ".modal-backdrop"
                );

                const backdropZIndex = backdrop
                    ? Number.parseInt(
                        window.getComputedStyle(backdrop).zIndex,
                        10
                    )
                    : 1050;

                host.style.zIndex = String(
                    (
                        Number.isFinite(backdropZIndex)
                            ? backdropZIndex
                            : 1050
                    ) + 1
                );
            } else {
                host.style.removeProperty("z-index");
            }
        }

        // Zmiana warstwy z płynnym wygaszaniem.
        function setModalLayer(active) {
            if (active === modalLayerActive) return;

            modalLayerActive = active;

            const currentOpacity = Number.parseFloat(
                window.getComputedStyle(host).opacity
            );

            // Jeżeli śnieg jest już niewidoczny,
            // możemy od razu zmienić warstwę.
            if (currentOpacity <= 0.001) {
                layerTransitionPending = false;

                applyModalLayer();

                requestAnimationFrame(() => {
                    if (
                        Number.parseFloat(
                            window.getComputedStyle(host).opacity
                        ) <= 0.001
                    ) {
                        host.style.opacity = "1";
                    }
                });

                return;
            }

            // Najpierw wygaszamy śnieg.
            layerTransitionPending = true;
            host.style.opacity = "0";
        }

        // Po wygaszeniu zmieniamy warstwę i pokazujemy śnieg ponownie.
        host.addEventListener("transitionend", (event) => {
            if (
                event.target !== host ||
                event.propertyName !== "opacity" ||
                !layerTransitionPending
            ) return;

            layerTransitionPending = false;

            applyModalLayer();

            requestAnimationFrame(() => {
                if (!layerTransitionPending) {
                    host.style.opacity = "1";
                }
            });
        });

        function updateModalLayer() {
            setModalLayer(
                document.body.classList.contains("modal-open")
            );
        }

        function handleModalShow() {
            setModalLayer(true);

            // Jeśli otwarcie modala zostało anulowane,
            // przywracamy pierwotną warstwę.
            requestAnimationFrame(() => {
                if (!document.body.classList.contains("modal-open")) {
                    setModalLayer(false);
                }
            });
        }

        function handleModalHide() {
            setModalLayer(false);
        }

        function handleModalHidePrevented() {
            setModalLayer(true);
        }

        // Aktualizacja wiatru.
        function updateWind(dt) {
            if (elapsed >= nextGust) {
                const strongGust = Math.random() < 0.18;

                targetWind = random(
                    strongGust ? -55 : -24,
                    strongGust ? 55 : 24
                );

                nextGust = elapsed + random(3, 7);
            }

            wind += (targetWind - wind) *
                (1 - Math.exp(-dt * 0.55));
        }

        // Główna animacja.
        function draw(timestamp) {
            if (!running) return;

            raf = requestAnimationFrame(draw);

            if (timestamp - lastFrame < FRAME_TIME) return;

            const dt = lastFrame
                ? Math.min((timestamp - lastFrame) / 1000, 0.05)
                : 1 / FPS;

            lastFrame = timestamp;
            elapsed += dt;

            updateWind(dt);

            for (const p of particles) {
                const individualDrift =
                    Math.sin(
                        elapsed * p.frequency + p.phase
                    ) * p.sway;

                p.x += (
                    wind * p.windFactor + individualDrift
                ) * dt;

                p.y += p.speed * dt;

                if (p.x < -5) p.x = width + 5;
                if (p.x > width + 5) p.x = -5;

                if (p.y > height + 5) {
                    Object.assign(
                        p,
                        createParticle(
                            -random(
                                5,
                                Math.min(height * 0.15 + 5, 100)
                            )
                        )
                    );
                }
            }

            renderParticles();
        }

        function start() {
            if (
                running ||
                !visible ||
                document.hidden ||
                reducedMotion.matches
            ) return;

            running = true;
            lastFrame = 0;
            raf = requestAnimationFrame(draw);
        }

        function stop() {
            running = false;

            if (raf) {
                cancelAnimationFrame(raf);
                raf = 0;
            }
        }

        // Obserwowanie zawartości strony.
        const content = document.querySelector("main") || document.body;

        const resizeObserver = new ResizeObserver(scheduleResize);
        resizeObserver.observe(content);

        const mutationObserver = new MutationObserver(scheduleResize);
        mutationObserver.observe(content, {
            childList: true,
            subtree: true,
            characterData: true
        });

        window.addEventListener("resize", scheduleResize, {
            passive: true
        });

        // Obserwowanie otwierania i zamykania modali Bootstrapa.
        const modalObserver = new MutationObserver(updateModalLayer);

        modalObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
            childList: true
        });

        document.addEventListener("show.bs.modal", handleModalShow);
        document.addEventListener("shown.bs.modal", updateModalLayer);
        document.addEventListener("hide.bs.modal", handleModalHide);
        document.addEventListener("hidden.bs.modal", handleModalHide);
        document.addEventListener(
            "hidePrevented.bs.modal",
            handleModalHidePrevented
        );

        // Pierwsze ustawienie rozmiaru i warstwy.
        resize();
        updateModalLayer();

        // Kontrola widoczności animacji.
        const intersectionObserver = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;

                if (visible) {
                    start();
                } else {
                    stop();
                }
            }
        );

        intersectionObserver.observe(host);

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stop();
            } else {
                start();
            }
        });

        reducedMotion.addEventListener("change", (event) => {
            if (event.matches) {
                stop();
            } else {
                start();
            }
        });
    });
})();

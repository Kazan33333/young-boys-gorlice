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
            desynchronized: true
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

        const FPS = 30;
        const FRAME_TIME = 1000 / FPS;

        function createParticle(y = random(0, height)) {
            const size = Math.random();

            return {
                x: random(0, width),
                y,

                radius: size < 0.12
                    ? random(2.2, 3.1)
                    : size < 0.5
                        ? random(1.4, 2.2)
                        : random(0.7, 1.4),

                // Slightly different falling speed
                speed: random(25, 34),

                // Individual movement
                sway: random(1.2, 4),
                frequency: random(0.5, 1.3),
                phase: random(0, Math.PI * 2),

                // Different reaction to wind
                windFactor: random(0.65, 1.35),

                // Three opacity levels
                opacity: size < 0.12
                    ? 0.85
                    : size < 0.5
                        ? 0.65
                        : 0.4
            };
        }

        /* RESIZE CANVAS */
        function resize() {
            const rect = host.getBoundingClientRect();

            width = rect.width;
            height = rect.height;

            // Limit pixel density to reduce GPU workload
            const dpr = Math.min(
                window.devicePixelRatio || 1,
                1
            );

            canvas.width = Math.max(1, Math.round(width * dpr));
            canvas.height = Math.max(1, Math.round(height * dpr));

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = clamp(
                Math.round(width * height / 16000),
                40,
                120
            );

            particles = Array.from(
                { length: count },
                () => createParticle()
            );
        }

        function updateWind(dt) {
            if (elapsed >= nextGust) {
                const strongGust = Math.random() < 0.18;

                targetWind = random(
                    strongGust ? -38 : -16,
                    strongGust ? 38 : 16
                );

                nextGust = elapsed + random(3, 7);
            }

            wind += (targetWind - wind) *
                (1 - Math.exp(-dt * 0.55));
        }

        function draw(timestamp) {
            if (!running) return;

            raf = requestAnimationFrame(draw);

            // Limit rendering to 30 FPS
            if (timestamp - lastFrame < FRAME_TIME) return;

            const dt = lastFrame
                ? Math.min((timestamp - lastFrame) / 1000, 0.05)
                : 1 / FPS;

            lastFrame = timestamp;
            elapsed += dt;

            updateWind(dt);

            ctx.clearRect(0, 0, width, height);

            // Draw all particles in one path
            const paths = [[], [], []];

            for (const p of particles) {
                // Independent horizontal movement
                const individualDrift =
                    Math.sin(
                        elapsed * p.frequency + p.phase
                    ) * p.sway;

                // Global wind + individual reaction
                p.x += (
                    wind * p.windFactor + individualDrift
                ) * dt;

                // Independent falling speed
                p.y += p.speed * dt;

                // Horizontal wrapping
                if (p.x < -5) p.x = width + 5;
                if (p.x > width + 5) p.x = -5;

                // Respawn with completely new parameters
                if (p.y > height + 5) {
                    Object.assign(
                        p,
                        createParticle(-random(5, Math.min(height * 0.15 + 5, 100)))
                    );
                }

                const group = p.opacity > 0.8
                    ? 2
                    : p.opacity > 0.5
                        ? 1
                        : 0;

                paths[group].push(p);
            }

            // Three batches instead of one draw call per flake
            const opacities = [0.4, 0.65, 0.85];

            for (let i = 0; i < paths.length; i++) {
                const group = paths[i];

                if (!group.length) continue;

                ctx.beginPath();

                for (const p of group) {
                    ctx.moveTo(p.x + p.radius, p.y);
                    ctx.arc(
                        p.x,
                        p.y,
                        p.radius,
                        0,
                        Math.PI * 2
                    );
                }

                ctx.fillStyle = "#fff";
                ctx.globalAlpha = opacities[i];
                ctx.fill();
            }

            ctx.globalAlpha = 1;
        }

        /* START / STOP */
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

        /* RESIZE OBSERVER */
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);

        resize();

        /* PAUSE WHEN OUTSIDE VIEWPORT */
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

        /* PAUSE WHEN TAB IS HIDDEN */
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stop();
            } else {
                start();
            }
        });

        /* HANDLE REDUCED MOTION CHANGES */
        reducedMotion.addEventListener("change", (event) => {
            if (event.matches) {
                stop();
            } else {
                start();
            }
        });
    });
})();

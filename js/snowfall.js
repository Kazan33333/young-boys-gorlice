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

        const FPS = 30;
        const FRAME_TIME = 1000 / FPS;

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

        function resize() {
            const rect = host.getBoundingClientRect();

            width = rect.width;
            height = rect.height;

            const dpr = Math.min(
                window.devicePixelRatio || 1,
                1
            );

            const newWidth = Math.max(1, Math.round(width * dpr));
            const newHeight = Math.max(1, Math.round(height * dpr));

            if (canvas.width !== newWidth || canvas.height !== newHeight) {
                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }

            const count = clamp(
                Math.round(width * height / 8000),
                70,
                200
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
                strongGust ? -55 : -24,
                strongGust ? 55 : 24
            );

                nextGust = elapsed + random(3, 7);
            }

            wind += (targetWind - wind) *
                (1 - Math.exp(-dt * 0.55));
        }

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

            ctx.clearRect(0, 0, width, height);

            const paths = [[], [], []];

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

            const opacities = [0.6, 0.8, 1.0];

            for (let i = 0; i < paths.length; i++) {
                const group = paths[i];

                ctx.globalAlpha = opacities[i];

                for (const p of group) {
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

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);

        resize();

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

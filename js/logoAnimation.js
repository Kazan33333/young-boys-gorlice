const logo = document.getElementById("logo-brand");

let rotation = 0;
let velocity = 0;
let hovering = false;
let raf = null;

const MAX_SPEED = 3.5;
const ACCEL = 0.12;
const FRICTION = 0.9;
const SPRING = 0.03;
const DAMPING = 0.92;

function animate() {
  if (hovering) {
    velocity = Math.min(velocity + ACCEL, MAX_SPEED);
  } else {
    const target = Math.round(rotation / 360) * 360;
    const distance = target - rotation;

    velocity += distance * SPRING;
    velocity *= DAMPING;
  }

  rotation += velocity;
  logo.style.transform = `rotate(${rotation}deg)`;

  if (
    !hovering &&
    Math.abs(velocity) < 0.01 &&
    Math.abs(rotation % 360) < 0.5
  ) {
    rotation = 0;
    velocity = 0;
    logo.style.transform = "rotate(0deg)";
    cancelAnimationFrame(raf);
    raf = null;
    return;
  }

  raf = requestAnimationFrame(animate);
}

logo.addEventListener("mouseenter", () => {
  hovering = true;
  if (!raf) animate();
});

logo.addEventListener("mouseleave", () => {
  hovering = false;
});

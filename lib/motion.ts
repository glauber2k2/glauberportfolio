import { animate, cubicBezier } from "animejs";

const curtain = cubicBezier(0.76, 0, 0.24, 1);

/** Contador 000→100 e depois a cortina sobe. */
export function runLoader(el: HTMLElement, num: HTMLElement | null, onDone: () => void) {
  const counter = { v: 0 };
  const count = animate(counter, {
    v: 100,
    duration: 1100,
    ease: "linear",
    onUpdate: () => {
      if (num) num.textContent = String(Math.round(counter.v)).padStart(3, "0");
    },
    onComplete: () => {
      onDone();
      animate(el, {
        translateY: { to: "-100%", duration: 900, ease: curtain },
        opacity: { to: 0, duration: 600, ease: "outQuad" },
        onComplete: () => { el.style.display = "none"; },
      });
    },
  });
  return () => count.revert();
}

/** Entrada do hero: letras do nome sobem em cascata e os blocos aparecem em sequência. */
export function runHeroIntro(root: HTMLElement) {
  animate(root.querySelectorAll<HTMLElement>("[data-letter]"), {
    translateY: ["110%", "0%"],
    duration: 1000,
    delay: (el: unknown) => Number((el as HTMLElement).dataset.letter),
    ease: "outQuint",
  });
  root.querySelectorAll<HTMLElement>("[data-intro]").forEach((el) => {
    const d = Number(el.dataset.intro);
    const move = el.dataset.introMove !== "false";
    animate(el, {
      opacity: { from: 0, to: 1, duration: 800, ease: "outQuad" },
      ...(move ? { translateY: { from: 14, to: 0, duration: 800, ease: "outQuint" } } : {}),
      delay: d,
    });
  });
}

/** Revela [data-reveal] ao entrar na viewport (fade + subida + desfoque). */
export function initReveal(root: HTMLElement) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target as HTMLElement;
        const d = Number(el.dataset.delay || 0);
        animate(el, {
          opacity: { from: 0, to: 1, duration: 900, ease: "outQuad" },
          translateY: { from: 28, to: 0, duration: 1000, ease: "outQuint" },
          filter: { from: "blur(6px)", to: "blur(0px)", duration: 900, ease: "outQuad" },
          delay: d,
          onComplete: () => {
            el.style.removeProperty("transform");
            el.style.removeProperty("filter");
            el.style.removeProperty("opacity");
          },
        });
      }),
    { rootMargin: "0px 0px -8% 0px" },
  );
  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    if (el.getBoundingClientRect().top < innerHeight * 0.92) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.filter = "blur(6px)";
    io.observe(el);
  });
  return () => io.disconnect();
}

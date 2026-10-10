"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import type Lenis from "lenis";
import { CALLOUTS, DESK_MQ, EMAIL, EMPTY_FORM, PROJECTS, type Filter, type FormState, type FormStatus } from "@/lib/data";
import { initReveal, runHeroIntro, runLoader } from "@/lib/motion";
import type { SceneInput } from "@/lib/laptop-scene";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Timeline } from "./sections/Timeline";
import { Skills } from "./sections/Skills";
import { Projects } from "./sections/Projects";
import { Services } from "./sections/Services";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";
import { CaseModal } from "./sections/CaseModal";

type ScrollUi = { chapter: number; tl: number; proj: number; step: number; scrolled: boolean };

/** Valores mutáveis lidos a cada frame (fora do ciclo de render do React). */
type Runtime = {
  c: number;
  endT: number;
  mx: number | null;
  my: number | null;
  hoverTarget: Element | null;
  reduced: boolean;
  fine: boolean;
  lenis: Lenis | null;
  lapClick: (() => void) | null;
};

const c01 = (v: number) => Math.max(0, Math.min(1, v));
const noop = () => () => {};

/** Media query reativa (SSR assume `ssr`). */
function useMedia(query: string, ssr: boolean) {
  const subscribe = useCallback((cb: () => void) => {
    const m = matchMedia(query);
    m.addEventListener("change", cb);
    return () => m.removeEventListener("change", cb);
  }, [query]);
  return useSyncExternalStore(subscribe, () => matchMedia(query).matches, () => ssr);
}

export default function Portfolio() {
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [loaded, setLoaded] = useState(false);
  const [ui, setUi] = useState<ScrollUi>({ chapter: 0, tl: 0, proj: 0, step: -1, scrolled: false });
  const [hl, setHl] = useState<string | null>(null);
  const [projHover, setProjHover] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("Todos");
  const [modal, setModal] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [form, setFormState] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [copied, setCopied] = useState(false);
  const year = useSyncExternalStore(noop, () => new Date().getFullYear(), () => 2026);
  const desk = useMedia(DESK_MQ, true);
  const fine = useMedia("(hover: hover) and (pointer: fine)", true);
  const reduced = useMedia("(prefers-reduced-motion: reduce)", false);
  const [glOk, setGlOk] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const calloutRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderNumRef = useRef<HTMLDivElement>(null);
  const tlFillRef = useRef<HTMLDivElement>(null);

  const rt = useRef<Runtime>({ c: 0, endT: 0, mx: null, my: null, hoverTarget: null, reduced: false, fine: false, lenis: null, lapClick: null });
  const uiRef = useRef(ui);

  const visible = useMemo(() => PROJECTS.filter((p) => filter === "Todos" || p.cat === filter), [filter]);
  const activeProj = Math.min(visible.length - 1, desk && projHover != null ? projHover : ui.proj);

  // Espelho do estado React para a cena 3D (lido a cada frame)
  const live = useRef<Omit<SceneInput, "c" | "endT" | "mx" | "my" | "hoverTarget" | "reduced" | "fine" | "desk">>({
    modal, hl, projHover, proj: ui.proj, visible, tl: ui.tl, step: ui.step, form, status, loaded, menu,
  });
  useEffect(() => {
    live.current = { modal, hl, projHover, proj: ui.proj, visible, tl: ui.tl, step: ui.step, form, status, loaded, menu };
    uiRef.current = ui;
  });

  const openModal = useCallback((id: string) => setModal(id), []);
  const closeModal = useCallback(() => setModal(null), []);
  const closeMenu = useCallback(() => setMenu(false), []);
  // Projeto ativo no carrossel (mobile/tablet); no desktop vem da posição de scroll
  const setActiveProj = useCallback((proj: number) => {
    if (proj === uiRef.current.proj) return;
    uiRef.current = { ...uiRef.current, proj };
    setUi(uiRef.current);
  }, []);
  const openActive = useCallback(() => {
    const v = live.current.visible.length ? live.current.visible : PROJECTS;
    const p = v[Math.min(v.length - 1, uiRef.current.proj)];
    if (p) setModal(p.id);
  }, []);

  // Trava o scroll quando menu/modal estão abertos
  useEffect(() => {
    const lock = menu || !!modal;
    document.body.style.overflow = lock ? "hidden" : "";
    if (lock) rt.current.lenis?.stop();
    else rt.current.lenis?.start();
  }, [menu, modal]);

  // Entrada do hero após o loader
  useEffect(() => {
    if (!loaded || !introRef.current) return;
    const root = introRef.current.parentElement!;
    if (rt.current.reduced) {
      root.querySelectorAll<HTMLElement>("[data-letter],[data-intro]").forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; });
      return;
    }
    runHeroIntro(root);
  }, [loaded]);

  useEffect(() => {
    const R = rt.current;
    const root = rootRef.current!;
    const offs: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(t: Window | Document, ev: K, fn: (e: WindowEventMap[K]) => void, o?: AddEventListenerOptions) => {
      t.addEventListener(ev, fn as EventListener, o);
      offs.push(() => t.removeEventListener(ev, fn as EventListener, o));
    };

    R.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    R.fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const deskMq = matchMedia(DESK_MQ);

    on(window, "pointermove", (e) => { R.mx = e.clientX; R.my = e.clientY; R.hoverTarget = e.target as Element; }, { passive: true });
    on(document, "keydown", (e) => { if (e.key === "Escape") { closeModal(); closeMenu(); } });

    // Âncoras internas com scroll suave (Lenis) + clique na tela do notebook abre o estudo de caso
    on(document, "click", (e) => {
      const target = e.target as Element;
      const a = target.closest?.('a[href^="#"]');
      if (a) {
        const id = a.getAttribute("href")!.slice(1);
        const el = id ? document.getElementById(id) : null;
        if (!el) { if (!id) e.preventDefault(); return; }
        e.preventDefault();
        closeMenu();
        const top = id === "top" ? 0 : el.getBoundingClientRect().top + window.scrollY;
        if (R.lenis) { R.lenis.start(); R.lenis.scrollTo(top, { duration: 1.5, force: true }); }
        else window.scrollTo({ top, behavior: R.reduced ? "auto" : "smooth" });
        return;
      }
      if (R.lapClick && !target.closest?.("a,button,input,textarea,label,[role=dialog]")) R.lapClick();
    });

    // Loader (anime.js)
    const loader = loaderRef.current!;
    if (R.reduced) { loader.style.display = "none"; requestAnimationFrame(() => setLoaded(true)); }
    else offs.push(runLoader(loader, loaderNumRef.current, () => setLoaded(true)));

    if (!R.reduced) offs.push(initReveal(root));

    // Smooth scroll
    let cancelled = false;
    if (!R.reduced) {
      import("lenis").then(({ default: LenisCtor }) => {
        if (cancelled) return;
        const lenis = new LenisCtor({ lerp: 0.09, smoothWheel: true, autoRaf: true });
        document.documentElement.style.scrollBehavior = "auto";
        R.lenis = lenis;
        if (document.body.style.overflow === "hidden") lenis.stop();
      });
      offs.push(() => { R.lenis?.destroy(); R.lenis = null; document.documentElement.style.scrollBehavior = ""; });
    }

    // Progresso de scroll → capítulos, barras, palavras, timeline, projetos, etapas
    const computeScroll = () => {
      const vh = innerHeight, y = window.scrollY, line = vh * 0.35;
      let c = 0;
      root.querySelectorAll<HTMLElement>("[data-chapter]").forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top <= line) c = i + c01((line - r.top) / Math.max(1, r.height));
      });
      R.c = c;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const ft = root.querySelector("footer");
      const fTop = ft ? ft.getBoundingClientRect().top : vh * 2;
      R.endT = c01((vh * 1.05 - fTop) / (vh * 0.5));
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${(y / max).toFixed(4)})`;
      root.querySelectorAll<HTMLElement>("[data-navfill]").forEach((el) => { el.style.transform = `scaleX(${c01(c - Number(el.dataset.navfill)).toFixed(3)})`; });
      if (hintRef.current) hintRef.current.style.opacity = String(1 - c01(y / (vh * 0.25)));

      const words = root.querySelectorAll<HTMLElement & { _o?: string }>("[data-w]");
      const lit = R.reduced ? 1e9 : c01((c - 1 - 0.02) / 0.55) * words.length;
      words.forEach((w, i) => { const o = i < lit ? "1" : ".22"; if (w._o !== o) { w._o = o; w.style.opacity = o; } });

      let tl = 0;
      root.querySelectorAll("[data-tl]").forEach((el, i) => { if (el.getBoundingClientRect().top < vh * 0.5) tl = i; });
      const tf = tlFillRef.current;
      if (tf) { const r = tf.parentElement!.getBoundingClientRect(); tf.style.transform = `scaleY(${c01((vh * 0.5 - r.top) / Math.max(1, r.height)).toFixed(4)})`; }
      let proj = uiRef.current.proj;
      // Desktop: projeto ativo pela posição de scroll; mobile/tablet: pelo carrossel (setActiveProj)
      if (deskMq.matches) { proj = 0; root.querySelectorAll("[data-proj]").forEach((el, i) => { if (el.getBoundingClientRect().top < vh * 0.5) proj = i; }); }
      let step = -1;
      root.querySelectorAll("[data-step]").forEach((el, i) => { if (el.getBoundingClientRect().top < vh * 0.62) step = i; });

      const chapter = Math.min(6, Math.floor(c)), scrolled = y > 24, s = uiRef.current;
      if (chapter !== s.chapter || tl !== s.tl || proj !== s.proj || step !== s.step || scrolled !== s.scrolled) {
        const next = { chapter, tl, proj, step, scrolled };
        uiRef.current = next;
        setUi(next);
      }
    };

    // Cena 3D (Three.js carregado sob demanda)
    let render3d: ((now: number) => void) | null = null;
    import("@/lib/laptop-scene").then(({ createLaptopScene }) => {
      if (cancelled || !sceneRef.current) return;
      try {
        const scene = createLaptopScene({
          host: sceneRef.current,
          glow: glowRef.current,
          callouts: calloutRef.current,
          read: () => ({ ...live.current, c: R.c, endT: R.endT, mx: R.mx, my: R.my, hoverTarget: R.hoverTarget, reduced: R.reduced, fine: R.fine, desk: deskMq.matches }),
          setLapClick: (fn) => { R.lapClick = fn; },
          openModal,
          openActive,
          heroSlot: () => root.querySelector<HTMLElement>("[data-hero-slot]"),
        });
        render3d = scene.render;
        offs.push(() => { render3d = null; scene.dispose(); });
      } catch {
        setGlOk(false); // sem WebGL: o site funciona sem a cena (e sem o slot do hero)
      }
    });

    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      computeScroll();
      render3d?.(now);
    };
    raf = requestAnimationFrame(loop);
    offs.push(() => cancelAnimationFrame(raf));

    return () => {
      cancelled = true;
      offs.reverse().forEach((f) => { try { f(); } catch { /* noop */ } });
      document.body.style.overflow = "";
    };
  }, [openModal, openActive, closeModal, closeMenu]);

  const setTheme = (t: "dark" | "light") => {
    const h = document.documentElement;
    h.classList.add("theme-anim");
    h.dataset.theme = t;
    setTimeout(() => h.classList.remove("theme-anim"), 500);
    setThemeState(t);
  };

  const setField = (k: keyof FormState, v: string) => setFormState((f) => ({ ...f, [k]: v }));
  const askQuote = () => setField("type", "Projeto freelance");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    // Abre o app de e-mail do visitante com a mensagem preenchida.
    // Para envio direto (sem abrir o app), integrar com Resend, Formspree ou uma rota /api.
    const subject = `[Portfólio] ${form.type} — ${form.name}`;
    const body = `${form.msg}\n\n—\nNome: ${form.name}\nE-mail: ${form.email}\nTipo: ${form.type}`;
    setStatus("loading");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => setStatus("success"), 900);
  };
  const copyEmail = () => {
    navigator.clipboard?.writeText(EMAIL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const modalProject = PROJECTS.find((p) => p.id === modal) || PROJECTS[0];

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-x-clip bg-bg font-sans text-[16px] leading-[1.6] text-fg">
      {/* Grade de fundo + brilho que segue o notebook + canvas WebGL */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,#000_15%,transparent_78%)]"
        style={{ backgroundImage: "linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px)" }}
      />
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-0 hidden size-[70vmin] rounded-full opacity-50 blur-[30px] will-change-transform desk:block"
        style={{ background: "radial-gradient(circle,var(--glow),transparent 62%)", transform: "translate(60vw,10vh)" }}
      />
      {/* Estilo inline: no mobile/tablet a cena reescreve a posição para virar o dock */}
      <div ref={sceneRef} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }} />

      {/* Rótulos das peças na vista explodida (posicionados pela cena) */}
      <div ref={calloutRef} aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-[3] hidden opacity-0 desk:block">
        {CALLOUTS.map((k, i) => (
          <div
            key={k.part}
            data-callout={i}
            onMouseEnter={() => setHl(k.part)}
            onMouseLeave={() => setHl(null)}
            className="pointer-events-auto absolute top-0 left-0 flex items-center will-change-transform"
          >
            <span className="size-2.5 flex-none rounded-full border-2 border-acc bg-bg" />
            <span className="h-px w-11 flex-none bg-line2" />
            <span data-ccard="" className="flex flex-col gap-px rounded-[10px] border border-line2 bg-nav px-3 py-[7px] whitespace-nowrap backdrop-blur-[10px] transition-[border-color,background-color] duration-[250ms]">
              <span className="font-mono text-[10.5px] tracking-[.08em] text-fg3 uppercase">{k.part}</span>
              <span className="text-[13.5px] leading-[1.4] font-medium text-fg">{k.text}</span>
            </span>
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-0.5">
        <div ref={progressRef} className="h-full origin-left bg-acc" style={{ transform: "scaleX(0)" }} />
      </div>

      <Header
        chapter={ui.chapter}
        scrolled={ui.scrolled}
        menuOpen={menu}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        onToggleMenu={() => setMenu((m) => !m)}
      />

      <main className="relative z-[2]">
        <Hero hintRef={hintRef} introRef={introRef} stage={glOk} onAskQuote={askQuote} />
        <About />
        <Timeline active={ui.tl} fillRef={tlFillRef} />
        <Skills hl={hl} fine={fine} onHighlight={setHl} />
        <Projects
          visible={visible}
          active={activeProj}
          filter={filter}
          reduced={reduced}
          onFilter={(f) => { setFilter(f); setProjHover(null); setActiveProj(0); }}
          onHover={setProjHover}
          onActive={setActiveProj}
          onOpen={openModal}
        />
        <Services step={ui.step} onAskQuote={askQuote} />
        <Contact
          form={form}
          status={status}
          copied={copied}
          onField={setField}
          onSubmit={submit}
          onReset={() => { setStatus("idle"); setFormState(EMPTY_FORM); }}
          onCopy={copyEmail}
        />
      </main>

      <Footer year={year} />

      {modal && <CaseModal project={modalProject} onClose={closeModal} />}

      <div ref={loaderRef} aria-hidden="true" className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-3.5 bg-[#0A0A0B] text-[#EDEDEF]">
        <div className="font-mono text-[40px] font-medium tracking-[-.04em]">GM</div>
        <div ref={loaderNumRef} className="font-mono text-[12px] tracking-[.1em] text-[#8B8B94]">000</div>
      </div>
    </div>
  );
}

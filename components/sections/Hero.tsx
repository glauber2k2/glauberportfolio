import type { Ref } from "react";
import { SOCIALS, lucide } from "@/lib/data";
import { Icon, Panel, SplitGrid, ext } from "../ui";

const NAME = ["Glauber", "Monteiro"].map((wd, li) => [...wd].map((ch, k) => ({ ch, d: Math.round((0.12 + li * 0.14 + k * 0.035) * 1000) })));

/** Estado inicial dos blocos do hero; o anime.js anima a entrada após o loader. */
const pre = { opacity: 0, transform: "translateY(14px)" };

export function Hero({ hintRef, introRef, stage, onAskQuote }: { hintRef: Ref<HTMLDivElement>; introRef: Ref<HTMLDivElement>; stage: boolean; onAskQuote: () => void }) {
  return (
    <section id="top" data-chapter="0" className="relative h-auto desk:h-[190vh]">
      <div className="relative top-0 flex h-auto items-start pt-[84px] pb-10 desk:sticky desk:h-screen desk:min-h-screen desk:items-center desk:p-0">
        <SplitGrid>
          {/* Mobile/tablet: o notebook 3D é posicionado sobre este slot e encolhe para o dock ao rolar */}
          {stage && <div data-hero-slot="" aria-hidden="true" className="col-span-full mb-7 h-[clamp(260px,42vh,400px)] md:h-[clamp(360px,44vh,520px)] desk:hidden" />}
          <Panel side="L" className="flex flex-col items-start">
            <div ref={introRef} className="contents">
              <div data-intro="100" style={pre} className="mb-7 inline-flex h-[34px] items-center gap-2.5 rounded-full border border-line2 bg-nav pr-3.5 pl-3 text-[13px] text-fg2">
                <span className="relative size-2">
                  <span className="absolute inset-0 rounded-full bg-ok" />
                  <span className="absolute inset-0 rounded-full bg-ok [animation:pulse_1.8s_ease-out_infinite]" />
                </span>
                <span>Disponível para novos projetos</span>
              </div>

              <h1 aria-label="Glauber Monteiro" className="mt-0 mb-5 text-[clamp(48px,14vw,72px)] leading-[.94] font-semibold tracking-[-.055em] md:text-[84px] desk:text-[clamp(64px,6.6vw,104px)]">
                {NAME.map((letters, li) => (
                  <span key={li} aria-hidden="true" className="flex overflow-hidden pb-[.07em]">
                    {letters.map((l, k) => (
                      <span key={k} data-letter={l.d} className="inline-block" style={{ transform: "translateY(110%)" }}>
                        {l.ch}
                      </span>
                    ))}
                  </span>
                ))}
              </h1>

              <p data-intro="550" style={pre} className="mt-0 mb-3.5 text-[clamp(19px,2vw,24px)] font-medium tracking-[-.015em]">
                Desenvolvedor Front-end
              </p>
              <p data-intro="650" style={pre} className="mt-0 mb-[30px] max-w-[520px] text-[16px] leading-[1.65] text-pretty text-fg2 md:text-[17px]">
                Crio interfaces rápidas, responsivas e bem acabadas. Formado em Ciência da Computação e pós-graduando em Programação Web Full Stack.
              </p>

              <div data-intro="750" style={pre} className="mb-7 grid w-full grid-cols-1 gap-3 md:grid-cols-[repeat(2,max-content)]">
                <a
                  href="#contato"
                  onClick={onAskQuote}
                  className="inline-flex h-[50px] items-center justify-center gap-2.5 rounded-full bg-acc-btn px-6 text-[15px] font-medium text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:text-white hover:shadow-[0_12px_30px_-12px_var(--glow)]"
                >
                  Solicitar orçamento
                  <Icon src={lucide("arrow-right")} className="size-4" />
                </a>
                <a
                  href="#projetos"
                  className="inline-flex h-[50px] items-center justify-center gap-2.5 rounded-full border border-line2 px-6 text-[15px] font-medium text-fg transition-[background-color,border-color] duration-300 hover:bg-bg3 hover:text-fg"
                >
                  Ver projetos
                </a>
              </div>

              <div data-intro="900" data-intro-move="false" style={{ opacity: 0 }} className="flex gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    {...ext(s.href)}
                    className="flex size-11 items-center justify-center rounded-xl border border-line text-fg2 transition-[color,border-color,background-color] duration-300 hover:border-line2 hover:bg-bg3 hover:text-fg"
                  >
                    <Icon src={s.icon} className="size-[18px]" />
                  </a>
                ))}
              </div>
            </div>
          </Panel>
        </SplitGrid>

        <div ref={hintRef} aria-hidden="true" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5 font-mono text-[11px] tracking-[.1em] text-fg3 uppercase desk:flex">
          <span>Role para abrir</span>
          <span className="relative h-10 w-px overflow-hidden bg-line2">
            <span className="absolute inset-0 bg-acc [animation:cue_1.8s_cubic-bezier(.65,0,.35,1)_infinite]" />
          </span>
        </div>
      </div>
    </section>
  );
}

import type { Ref } from "react";
import { TIMELINE, lucide } from "@/lib/data";
import { Eyebrow, Icon, Panel, SplitGrid, cx, h2Class, tagClass } from "../ui";

export function Timeline({ active, fillRef }: { active: number; fillRef: Ref<HTMLDivElement> }) {
  return (
    <section id="trajetoria" data-chapter="2" className="relative pt-[46vh] pb-[6vh] lg:pt-[24vh] lg:pb-[16vh]">
      <SplitGrid>
        <Panel side="L">
          <Eyebrow n="02" label="Trajetória" />
          <h2 data-reveal="" data-delay="60" className={`mt-0 mb-3.5 ${h2Class}`}>Trajetória</h2>
          <p data-reveal="" data-delay="120" className="mt-0 mb-12 text-[17px] text-fg2">Formação e experiência, de 2020 até hoje.</p>

          <div className="relative">
            <div aria-hidden="true" className="absolute top-2 bottom-10 left-[7px] w-px overflow-hidden bg-line2">
              <div ref={fillRef} className="absolute inset-0 origin-top bg-acc" style={{ transform: "scaleY(0)" }} />
            </div>
            {TIMELINE.map((t, i) => (
              <div
                key={i}
                data-tl=""
                className={cx(
                  "relative pb-11 pl-11 transition-opacity duration-500 lg:min-h-[34vh]",
                  i === active ? "lg:opacity-100" : i < active ? "lg:opacity-50" : "lg:opacity-[.32]",
                )}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-[5px] left-0 size-[15px] rounded-full border-[1.5px] border-acc transition-[transform,background-color] duration-[450ms,400ms] ease-out-quint lg:shadow-[0_0_0_6px_var(--bg)]"
                  style={{ background: i <= active ? "var(--acc)" : "var(--bg)", transform: `scale(${i === active ? 1.15 : 0.8})` }}
                />
                <div className="mb-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-2">
                  <span className="font-mono text-[13px] text-acc">{t.year}</span>
                  <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-line px-[9px] font-mono text-[10.5px] tracking-[.08em] text-fg2 uppercase">
                    <Icon src={lucide(t.kind === "Formação" ? "graduation-cap" : "briefcase")} className="size-3" />
                    {t.kind}
                  </span>
                  {t.current && (
                    <span className="inline-flex h-6 items-center rounded-full bg-acc-soft px-[9px] font-mono text-[10.5px] tracking-[.08em] text-acc uppercase">Atual</span>
                  )}
                </div>
                <h3 className="m-0 text-[24px] leading-[1.2] font-semibold tracking-[-.025em] text-balance">{t.title}</h3>
                {t.org && <div className="mt-1 text-[15px] text-fg2">{t.org}</div>}
                {t.desc && <p className="mt-3 mb-0 max-w-[520px] text-[15px] leading-[1.6] text-pretty text-fg2">{t.desc}</p>}
                {t.tags && t.tags.length > 0 && (
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {t.tags.map((g) => <span key={g} className={tagClass}>{g}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>
      </SplitGrid>
    </section>
  );
}

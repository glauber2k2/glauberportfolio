import CountUp from "../reactbits/CountUp";
import { ABOUT, COMPANIES, STATS } from "@/lib/data";
import { Eyebrow, Panel, SplitGrid, h2Class, monoLabel } from "../ui";

const WORDS = ABOUT.split(" ");

export function About() {
  return (
    <section id="sobre" data-chapter="1" className="relative pt-[46vh] pb-[6vh] lg:pt-[24vh] lg:pb-[16vh]">
      <SplitGrid>
        <Panel side="R">
          <Eyebrow n="01" label="Sobre" />
          <h2 data-reveal="" data-delay="60" className={`mt-0 mb-7 ${h2Class}`}>Sobre mim</h2>

          {/* Palavras acendem conforme o scroll (controlado no loop de scroll) */}
          <p aria-label={ABOUT} className="mt-0 mb-10 text-[clamp(20px,2vw,25px)] leading-[1.45] font-medium tracking-[-.015em] text-pretty">
            {WORDS.map((w, i) => (
              <span key={i} data-w="" aria-hidden="true" className="opacity-[.22] transition-opacity duration-[350ms]">
                {w}{" "}
              </span>
            ))}
          </p>

          <div className="mb-9 grid grid-cols-1 gap-2.5 md:grid-cols-3">
            {STATS.map((st) => (
              <div key={st.label} data-reveal="" data-delay={st.delay} className="rounded-2xl border border-line bg-bg2 p-5">
                <div className="flex min-h-11 items-baseline gap-[7px]">
                  <span className="text-[13px] text-fg3">{st.pre}</span>
                  {st.count != null ? (
                    <CountUp from={st.from} to={st.count} duration={1.4} className="text-[40px] leading-none font-semibold tracking-[-.05em] tabular-nums" />
                  ) : (
                    <span className="text-[40px] leading-none font-semibold tracking-[-.05em] tabular-nums">{st.val}</span>
                  )}
                </div>
                <div className="mt-2.5 text-[14px] leading-[1.4] text-fg2">{st.label}</div>
              </div>
            ))}
          </div>

          <div data-reveal="" className={`mb-3 ${monoLabel}`}>Empresas e instituições com quem já trabalhei</div>
          <div data-reveal="" data-delay="80" className="flex flex-wrap gap-1.5">
            {COMPANIES.map((co) => (
              <span key={co} className="inline-flex h-[34px] items-center rounded-full border border-line2 px-[13px] text-[14px] text-fg">{co}</span>
            ))}
          </div>
        </Panel>
      </SplitGrid>
    </section>
  );
}
